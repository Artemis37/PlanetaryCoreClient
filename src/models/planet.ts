export interface CriteriaDetail {
  id: string;
  criteriaName: string;
  criteriaDescription: string;
  criteriaCategory: string;
  minimumThreshold: number;
  maximumThreshold: number;
  unit: string;
  weight: number;
  isRequired: boolean;
  createdDate: string;
  modifiedDate: string | null;
}

export interface PlanetCriteriaFlat {
  id: string;
  planetId: string;
  criteriaId: string;
  value: number;
  score: number;
  isMet: boolean;
  notes: string;
  evaluationDate: string;
  criteriaName: string;
  criteriaDescription: string;
  criteriaCategory: string;
  minimumThreshold: number;
  maximumThreshold: number;
  unit: string;
  weight: number;
  isRequired: boolean;
}

export interface PlanetCriteriaDetail {
  id: string;
  planetId: string;
  criteriaId: string;
  value: number;
  score: number;
  isMet: boolean;
  notes: string;
  evaluationDate: string;
  planet: any;
  criteria: CriteriaDetail;
}

export interface PlanetCriteria {
  criteriaId: string;
  value: number;
  score: number;
  isMet: boolean;
  notes: string;
}

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
  planetCriteria: PlanetCriteriaDetail[];
}

export interface PlanetDetail {
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
  criteria: PlanetCriteriaFlat[];
}
