export interface Planet {
  id: string;
  name: string;
  stellarSystem: string;
  distanceFromEarth: number;
  radius: number;
  mass: number;
  surfaceTemperature: number;
  surfaceGravity: number;
  hasAtmosphere: boolean;
  atmosphericComposition: string;
  atmosphericPressure: number;
  hasWater: boolean;
  waterCoverage: number;
  planetType: string;
  discoveryDate: string;
  userId: string;
  user: any;
  planetCriteria: any[];
}
