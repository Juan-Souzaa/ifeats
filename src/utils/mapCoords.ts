export type LatLng = { latitude: number; longitude: number };

export function toCoord(lat: number | string | null | undefined, lon: number | string | null | undefined): LatLng | null {
  if (lat == null || lon == null) return null;
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  return { latitude, longitude };
}

export function regionFromPoints(points: LatLng[], padding = 0.01) {
  if (points.length === 0) {
    return {
      latitude: -23.5505,
      longitude: -46.6333,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }
  let minLat = points[0]!.latitude;
  let maxLat = points[0]!.latitude;
  let minLon = points[0]!.longitude;
  let maxLon = points[0]!.longitude;
  for (const p of points) {
    minLat = Math.min(minLat, p.latitude);
    maxLat = Math.max(maxLat, p.latitude);
    minLon = Math.min(minLon, p.longitude);
    maxLon = Math.max(maxLon, p.longitude);
  }
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLon + maxLon) / 2;
  const latitudeDelta = Math.max((maxLat - minLat) * 1.4 + padding, 0.02);
  const longitudeDelta = Math.max((maxLon - minLon) * 1.4 + padding, 0.02);
  return { latitude, longitude, latitudeDelta, longitudeDelta };
}
