import axios from './axios.config';
import { SignUpRequest, LoginRequest, AuthResponse, ApiResponse } from '@/types';

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    const backendPayload = {
      name: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };
    
    console.log('Sending to backend:', backendPayload); 
    
    const response = await axios.post<ApiResponse<AuthResponse>>(
      '/auth/signup', 
      backendPayload
    );
    return response.data.data!;
  },
  
  signIn: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post<ApiResponse<AuthResponse>>('/auth/signin', data);
    return response.data.data!;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};