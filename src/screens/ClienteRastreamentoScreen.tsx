import { useCallback, useMemo } from 'react';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import type { ClientePedidosStackParamList } from '../navigation/types';

import type { StatusPedido } from '../types/api';

import { useRoutePolyline } from '../hooks/useRoutePolyline';

import { DeliveryMap, type DeliveryMapMarker } from '../components/map/DeliveryMap';

import { useClienteRastreamentoViewModel } from '../hooks/useClienteRastreamentoViewModel';

import { Card, ErrorBanner, PedidoTimeline, ScreenShell, SecondaryButton, useThemeColors } from '../components/ui';

import { formatStatusPedido } from '../utils/pedidoStatus';

import { toCoord, type LatLng } from '../utils/mapCoords';

import { palette } from '../theme/colors';

import { spacing, radius } from '../theme/spacing';



type Props = NativeStackScreenProps<ClientePedidosStackParamList, 'ClienteRastreamento'>;



export function ClienteRastreamentoScreen({ navigation, route }: Props): React.JSX.Element {

  const { pedidoId } = route.params;

  const c = useThemeColors();

  const { data, loading, error, refresh } = useClienteRastreamentoViewModel(pedidoId);



  const entregador = useMemo(

    () => toCoord(data?.posicaoAtualLat, data?.posicaoAtualLon),

    [data]

  );

  const destino = useMemo(

    () => toCoord(data?.posicaoDestinoLat, data?.posicaoDestinoLon),

    [data]

  );

  const restaurante = useMemo(

    () => toCoord(data?.posicaoRestauranteLat, data?.posicaoRestauranteLon),

    [data]

  );



  const routeOrigin = entregador ?? restaurante;

  const { route: routeLine } = useRoutePolyline({

    apiWaypoints: data?.waypoints,

    origin: routeOrigin,

    destination: destino,

  });



  const mapPoints = useMemo(() => {

    const pts: LatLng[] = [];

    if (restaurante) pts.push(restaurante);

    if (entregador) pts.push(entregador);

    if (destino) pts.push(destino);

    return pts;

  }, [restaurante, entregador, destino]);



  const mapMarkers = useMemo((): DeliveryMapMarker[] => {

    const markers: DeliveryMapMarker[] = [];

    if (restaurante) {

      markers.push({ id: 'restaurante', coordinate: restaurante, title: 'Restaurante', pinColor: '#d97706' });

    }

    if (destino) {

      markers.push({ id: 'destino', coordinate: destino, title: 'Seu endereço', pinColor: '#2563eb' });

    }

    if (entregador) {

      markers.push({

        id: 'entregador',

        coordinate: entregador,

        title: 'Entregador',

        children: (

          <View style={styles.entregadorPin}>

            <MaterialIcons name="two-wheeler" size={22} color={palette.white} />

          </View>

        ),

      });

    }

    return markers;

  }, [restaurante, destino, entregador]);



  const eta = data?.tempoEstimadoMinutos;

  const status: StatusPedido = data?.statusEntrega ?? 'OUT_FOR_DELIVERY';

  const temMapa = mapPoints.length > 0;



  return (

    <ScreenShell

      title="Rastreamento"

      onBack={() => navigation.goBack()}

      scrollProps={{ nestedScrollEnabled: true }}

      rightAction={

        <Pressable onPress={() => void refresh()} hitSlop={12}>

          <MaterialIcons name="refresh" size={22} color={palette.primary} />

        </Pressable>

      }

    >

      {error ? <ErrorBanner message={error} onRetry={() => void refresh()} /> : null}



      {loading && !data ? (

        <ActivityIndicator color={palette.primary} size="large" style={{ marginTop: 40 }} />

      ) : (

        <>

          <View style={[styles.hero, { backgroundColor: 'rgba(236,73,19,0.12)' }]}>

            <MaterialIcons name="delivery-dining" size={40} color={palette.primary} />

            <Text style={[styles.eta, { color: c.text }]}>

              {eta != null ? `~${eta} min` : 'Calculando...'}

            </Text>

            <Text style={{ color: c.sub, fontSize: 14 }}>tempo estimado até você</Text>

            {data?.proximoAoDestino ? (

              <View style={[styles.nearBadge, { backgroundColor: c.successBg }]}>

                <Text style={{ color: c.success, fontWeight: '700', fontSize: 12 }}>Quase chegando!</Text>

              </View>

            ) : null}

          </View>



          {temMapa ? (

            <View style={[styles.mapWrap, { borderColor: c.border }]}>

              <DeliveryMap

                markers={mapMarkers}

                route={routeLine}

                fitPoints={mapPoints}

                height={300}

                footer={

                  <View style={styles.legend}>

                    <LegendItem color="#d97706" label="Restaurante" />

                    <LegendItem color={palette.primary} label="Entregador" moto />

                    <LegendItem color="#2563eb" label="Destino" />

                  </View>

                }

              />

            </View>

          ) : (

            <Card>

              <Text style={{ color: c.sub, textAlign: 'center', lineHeight: 20 }}>

                O entregador está a caminho. O mapa aparecerá quando a localização estiver disponível.

              </Text>

            </Card>

          )}



          <Card style={{ marginTop: spacing.md }}>

            <Text style={[styles.secTitle, { color: c.text }]}>Progresso da entrega</Text>

            <PedidoTimeline status={status} compact />

          </Card>



          <Card style={{ marginTop: spacing.md }}>

            <Text style={[styles.label, { color: c.sub }]}>Status</Text>

            <Text style={[styles.value, { color: c.text }]}>{formatStatusPedido(status)}</Text>

            {data?.distanciaRestanteKm != null ? (

              <>

                <Text style={[styles.label, { color: c.sub, marginTop: spacing.md }]}>Distância restante</Text>

                <Text style={[styles.value, { color: c.text }]}>

                  {Number(data.distanciaRestanteKm).toFixed(1)} km

                </Text>

              </>

            ) : null}

          </Card>



          {entregador || destino ? (

            <View style={{ marginTop: spacing.md }}>

              <SecondaryButton

                label="Abrir rota no Google Maps"

                onPress={() => {

                  const url =

                    entregador && destino

                      ? `https://www.google.com/maps/dir/?api=1&origin=${entregador.latitude},${entregador.longitude}&destination=${destino.latitude},${destino.longitude}`

                      : destino

                        ? `https://www.google.com/maps/dir/?api=1&destination=${destino.latitude},${destino.longitude}`

                        : `https://www.google.com/maps/dir/?api=1&destination=${entregador!.latitude},${entregador!.longitude}`;

                  void Linking.openURL(url);

                }}

              />

            </View>

          ) : null}

        </>

      )}

    </ScreenShell>

  );

}



function LegendItem({

  color,

  label,

  moto,

}: {

  color: string;

  label: string;

  moto?: boolean;

}): React.JSX.Element {

  return (

    <View style={styles.legendItem}>

      {moto ? (

        <View style={[styles.legendMoto, { backgroundColor: color }]}>

          <MaterialIcons name="two-wheeler" size={10} color={palette.white} />

        </View>

      ) : (

        <View style={[styles.legendDot, { backgroundColor: color }]} />

      )}

      <Text style={styles.legendText}>{label}</Text>

    </View>

  );

}



const styles = StyleSheet.create({

  hero: {

    alignItems: 'center',

    padding: spacing.lg,

    borderRadius: radius.lg,

    marginBottom: spacing.md,

  },

  eta: { fontSize: 38, fontWeight: '800', marginTop: spacing.sm },

  nearBadge: { marginTop: spacing.sm, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },

  mapWrap: {

    borderRadius: radius.lg,

    overflow: 'hidden',

    borderWidth: 1,

  },

  legend: {

    flexDirection: 'row',

    justifyContent: 'center',

    flexWrap: 'wrap',

    gap: spacing.md,

    paddingVertical: spacing.sm,

    paddingHorizontal: spacing.md,

    backgroundColor: 'rgba(0,0,0,0.03)',

  },

  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  legendDot: { width: 10, height: 10, borderRadius: 5 },

  legendMoto: {

    width: 18,

    height: 18,

    borderRadius: 9,

    alignItems: 'center',

    justifyContent: 'center',

  },

  legendText: { fontSize: 11, fontWeight: '600', color: palette.slate600 },

  secTitle: { fontSize: 16, fontWeight: '800', marginBottom: spacing.md },

  label: { fontSize: 13, fontWeight: '600' },

  value: { fontSize: 18, fontWeight: '800', marginTop: 4 },

  entregadorPin: {

    backgroundColor: palette.primary,

    width: 40,

    height: 40,

    borderRadius: 20,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 3,

    borderColor: palette.white,

    shadowColor: '#000',

    shadowOpacity: 0.25,

    shadowRadius: 4,

    elevation: 4,

  },

});

