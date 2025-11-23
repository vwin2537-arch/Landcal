import { Coordinate, ThaiArea } from '../types';

/**
 * Calculates the area of a polygon using the Shoelace formula (Surveyor's formula).
 * Assumes coordinates are in meters (UTM).
 */
export const calculatePolygonArea = (coordinates: Coordinate[]): number => {
  if (coordinates.length < 3) return 0;

  // Clone to avoid mutating original and ensure loop is closed logic
  const points = [...coordinates];
  
  // The Shoelace formula usually assumes the path loops back.
  // We calculate sum(X_i * Y_i+1) - sum(Y_i * X_i+1)
  // Logic handles wrapping the last point to the first point implicitly.
  
  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n; // Next vertex, wrapping to 0 at the end
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area) / 2.0;
};

/**
 * Converts Square Meters to Thai Units (Rai-Ngan-Sq.Wah)
 * 1 Rai = 4 Ngan
 * 1 Ngan = 100 Sq.Wah
 * 1 Rai = 400 Sq.Wah = 1600 Sq.Meters
 * 1 Sq.Wah = 4 Sq.Meters
 */
export const convertToThaiUnits = (sqMeters: number): ThaiArea => {
  const totalSqWah = sqMeters / 4;
  
  const rai = Math.floor(totalSqWah / 400);
  const remainderAfterRai = totalSqWah % 400;
  
  const ngan = Math.floor(remainderAfterRai / 100);
  const sqWah = remainderAfterRai % 100;

  return {
    rai,
    ngan,
    sqWah,
    totalSqWah,
    totalSqMeters: sqMeters
  };
};

export const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};