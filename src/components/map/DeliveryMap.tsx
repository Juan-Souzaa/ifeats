import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { palette } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { regionFromPoints, type LatLng } from '../../utils/mapCoords';

export type DeliveryMapMarker = {
  id: string;
  coordinate: LatLng;
  title?: string;
  pinColor?: string;
  children?: ReactNode;
};

type Props = {
  markers: DeliveryMapMarker[];
  route: LatLng[];
  fitPoints?: LatLng[];
  height?: number;
  footer?: ReactNode;
};

export function DeliveryMap({
  markers,
  route,
  fitPoints,
  height = 300,
  footer,
}: Props): React.JSX.Element {
  const mapRef = useRef<MapView>(null);
  const didInitialFit = useRef(false);

  const pointsForFit = useMemo(() => {
    if (fitPoints?.length) return fitPoints;
    if (route.length >= 2) return route;
    return markers.map((m) => m.coordinate);
  }, [fitPoints, route, markers]);

  const initialRegion = useMemo(() => regionFromPoints(pointsForFit), [pointsForFit]);

  const fitMap = useCallback(() => {
    if (pointsForFit.length === 0 || !mapRef.current) return;
    mapRef.current.fitToCoordinates(pointsForFit, {
      edgePadding: { top: 56, right: 56, bottom: 56, left: 56 },
      animated: true,
    });
  }, [pointsForFit]);

  useEffect(() => {
    if (didInitialFit.current || pointsForFit.length === 0) return;
    const timer = setTimeout(() => {
      fitMap();
      didInitialFit.current = true;
    }, 350);
    return () => clearTimeout(timer);
  }, [fitMap, pointsForFit]);

  const zoomBy = useCallback((delta: number) => {
    mapRef.current
      ?.getCamera()
      .then((camera) => {
        const zoom = camera.zoom ?? 14;
        mapRef.current?.animateCamera({ zoom: zoom + delta }, { duration: 220 });
      })
      .catch(() => {});
  }, []);

  return (
    <View style={styles.wrap}>
      <View
        style={styles.mapTouchCapture}
        onStartShouldSetResponderCapture={() => true}
        onMoveShouldSetResponderCapture={() => true}
      >
        <MapView
          ref={mapRef}
          style={[styles.map, { height }]}
          initialRegion={initialRegion}
          scrollEnabled
          zoomEnabled
          zoomControlEnabled={Platform.OS === 'android'}
          rotateEnabled={false}
          pitchEnabled={false}
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          moveOnMarkerPress={false}
          {...(Platform.OS === 'android' ? { liteMode: false } : {})}
        >
          {markers.map((m) => (
            <DeliveryMapMarkerPin key={m.id} marker={m} />
          ))}
          {route.length >= 2 ? (
            <Polyline coordinates={route} strokeColor={palette.primary} strokeWidth={4} />
          ) : null}
        </MapView>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={() => zoomBy(1)}
          style={({ pressed }) => [styles.ctrlBtn, pressed && styles.ctrlBtnPressed]}
          hitSlop={6}
        >
          <MaterialIcons name="add" size={20} color={palette.primary} />
        </Pressable>
        <Pressable
          onPress={() => zoomBy(-1)}
          style={({ pressed }) => [styles.ctrlBtn, pressed && styles.ctrlBtnPressed]}
          hitSlop={6}
        >
          <MaterialIcons name="remove" size={20} color={palette.primary} />
        </Pressable>
        <Pressable
          onPress={fitMap}
          style={({ pressed }) => [styles.ctrlBtn, pressed && styles.ctrlBtnPressed]}
          hitSlop={6}
        >
          <MaterialIcons name="center-focus-strong" size={18} color={palette.primary} />
        </Pressable>
      </View>

      {footer}
    </View>
  );
}

function DeliveryMapMarkerPin({ marker }: { marker: DeliveryMapMarker }): React.JSX.Element {
  const custom = marker.children != null;
  const [tracksViewChanges, setTracksViewChanges] = useState(custom);

  useEffect(() => {
    if (!custom) return;
    setTracksViewChanges(true);
    const timer = setTimeout(() => setTracksViewChanges(false), 600);
    return () => clearTimeout(timer);
  }, [custom, marker.coordinate.latitude, marker.coordinate.longitude]);

  return (
    <Marker
      coordinate={marker.coordinate}
      title={marker.title}
      pinColor={custom ? undefined : marker.pinColor}
      anchor={custom ? { x: 0.5, y: 0.5 } : undefined}
      tracksViewChanges={custom ? tracksViewChanges : false}
    >
      {marker.children}
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  mapTouchCapture: { width: '100%' },
  map: { width: '100%' },
  controls: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    gap: 6,
  },
  ctrlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  ctrlBtnPressed: { opacity: 0.75 },
});
