import { Criteria } from '../models/criteria';

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
}

export const criteriaService = new CriteriaService();
export default criteriaService;
