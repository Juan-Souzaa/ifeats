import { useEffect, useMemo, useState } from 'react';
import { fetchOsrmRoute, type OsrmProfile } from '../services/osrmService';
import type { CoordinatesDTO } from '../types/api';
import { toCoord, type LatLng } from '../utils/mapCoords';

function apiWaypointsToLatLng(waypoints: CoordinatesDTO[] | null | undefined): LatLng[] {
  if (!waypoints?.length) return [];
  return waypoints
    .map((w) => toCoord(w.latitude, w.longitude))
    .filter((p): p is LatLng => p != null);
}

type Options = {
  apiWaypoints?: CoordinatesDTO[] | null;
  origin: LatLng | null;
  destination: LatLng | null;
  via?: LatLng | null;
  profile?: OsrmProfile;
};

export function useRoutePolyline({
  apiWaypoints,
  origin,
  destination,
  via,
  profile = 'driving',
}: Options) {
  const fromApi = useMemo(() => apiWaypointsToLatLng(apiWaypoints), [apiWaypoints]);
  const [osrmRoute, setOsrmRoute] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(false);

  const needsOsrm = fromApi.length < 2 && origin != null && destination != null;

  useEffect(() => {
    if (!needsOsrm) {
      setOsrmRoute([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const points = [origin, ...(via ? [via] : []), destination];

    void fetchOsrmRoute(points, profile)
      .then((route) => {
        if (!cancelled) setOsrmRoute(route);
      })
      .catch(() => {
        if (!cancelled) setOsrmRoute(points);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    needsOsrm,
    origin?.latitude,
    origin?.longitude,
    destination?.latitude,
    destination?.longitude,
    via?.latitude,
    via?.longitude,
    profile,
  ]);

  const route =
    fromApi.length >= 2
      ? fromApi
      : osrmRoute.length >= 2
        ? osrmRoute
        : origin && destination
          ? [origin, destination]
          : [];

  return { route, loading, usesApiWaypoints: fromApi.length >= 2 };
}
