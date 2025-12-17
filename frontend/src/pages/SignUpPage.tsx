import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { isValidEmail } from '@/utils/helpers';
import { ROUTES } from '@/utils/routes';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authApi.signUp({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // response is already AuthResponse (user, token) from auth.api.ts
      setAuth(response.user, response.token);
      navigate(ROUTES.HOME);
    } catch (error: any) {
      console.error('Sign up failed:', error);
      setErrors({
        submit: error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-end p-8 lg:p-16 relative overflow-hidden">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(-6deg); }
            50% { transform: translateY(-20px) rotate(-6deg); }
          }

          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(12deg); }
            50% { transform: translateY(-30px) rotate(12deg); }
          }

          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(3deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }

          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }

          .animate-float-delayed {
            animation: float-delayed 7s ease-in-out infinite;
            animation-delay: 1s;
          }

          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
            animation-delay: 2s;
          }

          .animate-slide-in-right {
            animation: slide-in-right 0.6s ease-out;
          }
        `}
      </style>

      <div className="absolute left-0 top-0 bottom-0 w-1/2 lg:w-3/5 flex items-center justify-center p-8">
        <div className="relative w-full h-full max-w-2xl">
          <div className="absolute top-1/4 left-1/4 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 animate-float">
            <img 
              src="/images/photo1.jpg" 
              alt="Photo 1" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1516575114887-7f2f93d8f119?w=400';
              }}
            />
          </div>
          
          <div className="absolute top-1/3 right-1/4 w-56 h-72 rounded-3xl overflow-hidden shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-500 animate-float-delayed">
            <img 
              src="/images/photo2.jpg" 
              alt="Photo 2" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=400';
              }}
            />
          </div>
          
          <div className="absolute bottom-1/4 left-1/3 w-48 h-64 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:-rotate-3 transition-transform duration-500 animate-float-slow">
            <img 
              src="/images/photo3.jpg" 
              alt="Photo 3" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400';
              }}
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
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<span class="text-4xl">📸</span>';
                }
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tạo tài khoản
          </h1>
          <p className="text-gray-500">Chào mừng đến với Locket</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <Input
              label="Họ và tên"
              type="text"
              placeholder="Nguyen Van A"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
            />
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <Input
              label="Email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            className="w-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </span>
            ) : 'Đăng ký'}
          </Button>
        </form>

        {/* sign in link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              to={ROUTES.SIGNIN}
              className="text-purple-600 font-semibold hover:text-pink-600 transition-colors duration-300 hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* terms */}
        <p className="mt-6 text-xs text-center text-gray-500">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <a href="#" className="text-purple-600 hover:text-pink-600 transition-colors hover:underline">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="#" className="text-purple-600 hover:text-pink-600 transition-colors hover:underline">
            Chính sách bảo mật
          </a>
        </p>
      </div>
    </div>
  );
};