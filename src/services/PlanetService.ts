import { Planet, PlanetDetail } from '../models/planet';

class PlanetService {
  private readonly baseUrl = 'https://localhost:8081/api/Planet';

  async getPlanets(token: string): Promise<Planet[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: Planet[] = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch planets');
      }
    } catch (error) {
      console.error('Planet fetch error:', error);
      throw error;
    }
  }

  async getPlanetById(id: string, token: string): Promise<Planet> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: Planet = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch planet');
      }
    } catch (error) {
      console.error('Planet fetch error:', error);
      throw error;
    }
  }

  async getPlanetDetail(planetId: string, token: string): Promise<PlanetDetail> {
    try {
      const response = await fetch(`${this.baseUrl}/${planetId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: PlanetDetail = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch planet details');
      }
    } catch (error) {
      console.error('Planet detail fetch error:', error);
      throw error;
    }
  }

  async updatePlanet(planetData: any, token: string): Promise<PlanetDetail> {
    try {
      const response = await fetch(`${this.baseUrl}/${planetData.planetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planetData),
      });

      if (response.ok) {
        const data: PlanetDetail = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update planet');
      }
    } catch (error) {
      console.error('Planet update error:', error);
      throw error;
    }
  }
}

export const planetService = new PlanetService();
export default planetService;
