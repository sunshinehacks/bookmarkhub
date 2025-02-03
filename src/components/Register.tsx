import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (email.includes('+')) return 'Email cannot contain the + character';
    const emailRegex = /^[^\s@+]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const checkPasswordCriteria = (password: string) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    });
  };

  useEffect(() => {
    if (password) {
      checkPasswordCriteria(password);
    }
  }, [password]);

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    let error = '';
    switch (field) {
      case 'email':
        error = validateEmail(email);
        break;
      case 'password':
        error = validatePassword(password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(confirmPassword);
        break;
    }
    setValidationErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const validateForm = () => {
    const errors: ValidationErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword)
    };
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true, confirmPassword: true });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (signUpError) throw signUpError;

      if (data?.user?.identities?.length === 0) {
        throw new Error('An account with this email already exists.');
      }

      navigate('/settings', { 
        state: { 
          message: 'Registration successful! You can now log in.' 
        }
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ValidationIcon = ({ isValid }: { isValid: boolean }) => (
    isValid ? (
      <Check className="w-4 h-4 text-accent-yellow" />
    ) : (
      <X className="w-4 h-4 text-white" />
    )
  );

  return (
    <main className="flex-grow z-10 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/settings')}
          className="mb-6 flex items-center text-white hover:text-accent-yellow transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Login
        </button>

        <div className="bg-primary-dark/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-primary/50">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Create Account</h1>

          {error && (
            <div className="mb-6 p-4 bg-accent-orange/20 border border-accent-orange/50 text-white rounded-lg text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) validateField('email');
                  }}
                  onBlur={() => handleBlur('email')}
                  className={`w-full bg-primary-dark/30 border ${
                    touched.email
                      ? validationErrors.email
                        ? 'border-white'
                        : 'border-accent-yellow'
                      : 'border-primary/50'
                  } rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300`}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
                <Mail className={`absolute left-3 top-2.5 w-5 h-5 ${
                  touched.email
                    ? validationErrors.email
                      ? 'text-white'
                      : 'text-accent-yellow'
                    : 'text-white/70'
                }`} />
              </div>
              {touched.email && validationErrors.email && (
                <p className="mt-2 text-sm text-white">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) validateField('password');
                  }}
                  onBlur={() => handleBlur('password')}
                  className={`w-full bg-primary-dark/30 border ${
                    touched.password
                      ? validationErrors.password
                        ? 'border-white'
                        : 'border-accent-yellow'
                      : 'border-primary/50'
                  } rounded-lg pl-10 pr-12 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300`}
                  placeholder="Create a password"
                  required
                  disabled={loading}
                />
                <Lock className={`absolute left-3 top-2.5 w-5 h-5 ${
                  touched.password
                    ? validationErrors.password
                      ? 'text-white'
                      : 'text-accent-yellow'
                    : 'text-white/70'
                }`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-white/70 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <ValidationIcon isValid={passwordCriteria.length} />
                  <span className={passwordCriteria.length ? 'text-accent-yellow' : 'text-white'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ValidationIcon isValid={passwordCriteria.uppercase} />
                  <span className={passwordCriteria.uppercase ? 'text-accent-yellow' : 'text-white'}>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ValidationIcon isValid={passwordCriteria.lowercase} />
                  <span className={passwordCriteria.lowercase ? 'text-accent-yellow' : 'text-white'}>
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ValidationIcon isValid={passwordCriteria.number} />
                  <span className={passwordCriteria.number ? 'text-accent-yellow' : 'text-white'}>
                    One number
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ValidationIcon isValid={passwordCriteria.special} />
                  <span className={passwordCriteria.special ? 'text-accent-yellow' : 'text-white'}>
                    One special character (!@#$%^&*)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (touched.confirmPassword) validateField('confirmPassword');
                  }}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full bg-primary-dark/30 border ${
                    touched.confirmPassword
                      ? validationErrors.confirmPassword
                        ? 'border-white'
                        : 'border-accent-yellow'
                      : 'border-primary/50'
                  } rounded-lg pl-10 pr-12 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300`}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
                <Lock className={`absolute left-3 top-2.5 w-5 h-5 ${
                  touched.confirmPassword
                    ? validationErrors.confirmPassword
                      ? 'text-white'
                      : 'text-accent-yellow'
                    : 'text-white/70'
                }`} />
              </div>
              {touched.confirmPassword && validationErrors.confirmPassword && (
                <p className="mt-2 text-sm text-white">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            <p className="text-center text-sm text-white">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="text-accent-yellow hover:text-white transition-colors"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}