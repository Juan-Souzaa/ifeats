import type { LatLng } from '../utils/mapCoords';

const OSRM_BASE = 'https://router.project-osrm.org';

type OsrmGeometry = {
  type: string;
  coordinates: [number, number][];
};

type OsrmResponse = {
  code: string;
  routes?: { geometry: OsrmGeometry }[];
};

export type OsrmProfile = 'driving' | 'cycling';

export async function fetchOsrmRoute(
  points: LatLng[],
  profile: OsrmProfile = 'driving'
): Promise<LatLng[]> {
  if (points.length < 2) return points;

  const coordinates = points.map((p) => `${p.longitude},${p.latitude}`).join(';');
  const url =
    `${OSRM_BASE}/route/v1/${profile}/${coordinates}` +
    '?overview=full&geometries=geojson&steps=false&alternatives=false';

  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao calcular rota');

  const data = (await res.json()) as OsrmResponse;
  const coords = data.routes?.[0]?.geometry?.coordinates;
  if (data.code !== 'Ok' || !coords?.length) throw new Error('Rota indisponível');

  return coords.map(([lon, lat]) => ({ latitude: lat, longitude: lon }));
}
