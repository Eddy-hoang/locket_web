import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { isValidEmail } from '@/utils/helpers';
import { ROUTES } from '@/utils/routes';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authApi.signIn(formData);
      setAuth(response.user, response.token);
      navigate(ROUTES.HOME);
    } catch (error: any) {
      console.error('Sign in failed:', error);
      setErrors({
        submit: error.response?.data?.message || 'Email hoặc mật khẩu không đúng',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-end p-8 lg:p-16 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1/2 lg:w-3/5 flex items-center justify-center p-8">
        <div className="relative w-full h-full max-w-2xl">
          <div className="absolute top-1/4 left-1/4 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 animate-float">
            <img 
              src="/images/photo1.jpg" 
              alt="Photo 1" 
              className="w-full h-full object-cover"
              onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1516575114887-7f2f93d8f119?w=400'}
            />
          </div>
          
          <div className="absolute top-1/3 right-1/4 w-56 h-72 rounded-3xl overflow-hidden shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-500 animate-float-delayed">
            <img 
              src="/images/photo2.jpg" 
              alt="Photo 2" 
              className="w-full h-full object-cover"
              onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400'}
            />
          </div>
          
          <div className="absolute bottom-1/4 left-1/3 w-48 h-64 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:-rotate-3 transition-transform duration-500 animate-float-slow">
            <img 
              src="/images/photo3.jpg" 
              alt="Photo 3" 
              className="w-full h-full object-cover"
              onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'}
            />
          </div>
          <div className="absolute top-20 left-20 w-16 h-16 bg-pink-500 rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-12 h-12 bg-purple-500 rounded-full opacity-60 animate-bounce"></div>
          <div className="absolute top-1/2 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-40 blur-xl animate-pulse"></div>
        </div>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 lg:p-10 relative z-10 border border-gray-100 animate-slide-in-right">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4 overflow-hidden shadow-lg transform hover:scale-110 transition-transform duration-300">
            <img 
              src="/images/icon/logo.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">📸</span>';
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng nhập
          </h1>
          <p className="text-gray-500">Chào mừng trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link
              to={ROUTES.SIGNUP}
              className="text-primary font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};