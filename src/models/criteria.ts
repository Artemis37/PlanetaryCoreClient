export interface Criteria {
  id: string;
  name: string;
  description: string;
  category: string;
  minimumThreshold: number;
  maximumThreshold: number;
  unit: string;
  weight: number;
  isRequired: boolean;
  createdDate: string;
  modifiedDate: string | null;
  planetCriteria: any[];
}
