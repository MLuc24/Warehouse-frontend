import { apiService } from './api';
import { API_ENDPOINTS } from '@/constants';
import type { 
  LoginRequest, 
  LoginResponse, 
  User, 
  CompleteRegistrationRequest 
} from '@/types';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async logout(): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.AUTH.ME);
  }

  async completeRegistration(data: CompleteRegistrationRequest): Promise<LoginResponse> {
    return apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.COMPLETE_REGISTRATION, data);
  }

  async sendVerification(email: string, purpose: string): Promise<{ success: boolean; message: string }> {
    return apiService.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION, { email, purpose });
  }

  // Simple registration for modal usage
  async register(data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    return apiService.post(API_ENDPOINTS.AUTH.REGISTER, data);
  }
}

export const authService = AuthService.getInstance();
