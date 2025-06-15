import { LoginRequest, LoginResponse } from '../models/auth';

class AuthService {
  private readonly baseUrl = 'https://localhost:8081/api/Auth';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 200) {
        const data: LoginResponse = await response.json();
        // Save token to localStorage for persistence
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          userType: data.userType,
          expiresAt: data.expiresAt,
        }));
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return false;
    }

    try {
      const userData = JSON.parse(user);
      const expiresAt = new Date(userData.expiresAt);
      return new Date() < expiresAt;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check localStorage and return auth data for Redux initialization
  getStoredAuthData(): { user: any; token: string } | null {
    const token = this.getToken();
    const user = this.getUser();
    
    if (token && user && this.isAuthenticated()) {
      return { user, token };
    }
    
    return null;
  }
}

export const authService = new AuthService();
export default authService;
