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
    try {
      const response = await apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response;
    } catch (error: unknown) {
      // Nếu backend trả về error với format { success: false, message: "..." }
      if (error instanceof Error && error.message) {
        return {
          success: false,
          message: error.message
        };
      }
      
      // Default error response
      return {
        success: false,
        message: 'Đăng nhập thất bại'
      };
    }
  }

  async logout(): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<{ success: boolean; data: User }>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  }

  async completeRegistration(data: CompleteRegistrationRequest): Promise<LoginResponse> {
    return apiService.post<LoginResponse>(API_ENDPOINTS.AUTH.COMPLETE_REGISTRATION, data);
  }

  async sendVerification(contact: string, type: string, purpose: string): Promise<{ success: boolean; message: string }> {
    return apiService.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION, { 
      contact, 
      type, 
      purpose 
    });
  }

  async verifyCode(contact: string, code: string, type: string, purpose: string): Promise<{ success: boolean; message: string }> {
    return apiService.post(API_ENDPOINTS.AUTH.VERIFY_CODE, { 
      contact, 
      code, 
      type, 
      purpose 
    });
  }

  async resetPassword(email: string, newPassword: string, confirmNewPassword: string): Promise<{ success: boolean; message: string }> {
    return apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { 
      Email: email,  // Backend expects PascalCase
      NewPassword: newPassword,  // Backend expects PascalCase 
      ConfirmNewPassword: confirmNewPassword  // Backend expects PascalCase
    });
  }

  // Helper method for registration flow
  async sendRegistrationVerification(email: string): Promise<{ success: boolean; message: string }> {
    return this.sendVerification(email, 'Email', 'Registration');
  }

  // Helper method for forgot password flow  
  async sendForgotPasswordVerification(email: string): Promise<{ success: boolean; message: string }> {
    return this.sendVerification(email, 'Email', 'ForgotPassword');
  }

  // Simple registration for modal usage - now using proper flow
  async register(data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> {
    // First send verification code
    const verificationResult = await this.sendRegistrationVerification(data.email);
    if (!verificationResult.success) {
      return verificationResult;
    }

    // Return success with instruction for next step
    return {
      success: true,
      message: 'Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã để hoàn tất đăng ký.'
    };
  }
}

export const authService = AuthService.getInstance();
