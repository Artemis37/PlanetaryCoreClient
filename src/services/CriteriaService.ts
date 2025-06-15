import { Criteria } from '../models/criteria';

export interface CreateCriteriaRequest {
  name: string;
  description: string;
  category: string;
  minimumThreshold: number;
  maximumThreshold: number;
  unit: string;
  weight: number;
  isRequired: boolean;
}

export interface UpdateCriteriaRequest extends CreateCriteriaRequest {
  id: string;
}

class CriteriaService {
  private readonly baseUrl = 'https://localhost:8081/api/Criteria';

  async getCriteria(token: string): Promise<Criteria[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: Criteria[] = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch criteria');
      }
    } catch (error) {
      console.error('Criteria fetch error:', error);
      throw error;
    }
  }

  async getCriteriaById(id: string, token: string): Promise<Criteria> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: Criteria = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch criteria');
      }
    } catch (error) {
      console.error('Criteria fetch error:', error);
      throw error;
    }
  }

  async createCriteria(criteriaData: CreateCriteriaRequest, token: string): Promise<Criteria> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteriaData),
      });

      if (response.ok) {
        const data: Criteria = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create criteria');
      }
    } catch (error) {
      console.error('Create criteria error:', error);
      throw error;
    }
  }

  async updateCriteria(criteriaData: UpdateCriteriaRequest, token: string): Promise<Criteria> {
    try {
      const response = await fetch(`${this.baseUrl}/${criteriaData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteriaData),
      });

      if (response.ok) {
        const data: Criteria = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update criteria');
      }
    } catch (error) {
      console.error('Update criteria error:', error);
      throw error;
    }
  }
}

export const criteriaService = new CriteriaService();
export default criteriaService;
