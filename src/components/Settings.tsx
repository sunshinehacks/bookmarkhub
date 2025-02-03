import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
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
        if (!isResetMode) error = validatePassword(password);
        break;
    }
    setValidationErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const validateForm = () => {
    const errors: ValidationErrors = {
      email: validateEmail(email)
    };
    if (!isResetMode) {
      errors.password = validatePassword(password);
    }
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTouched({ email: true, password: !isResetMode });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isResetMode) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (resetError) throw resetError;
        setSuccess('Password reset instructions have been sent to your email.');
        setEmail('');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!signInError) {
          navigate('/');
          return;
        }

        throw signInError;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow z-10 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-white hover:text-accent-yellow transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Home
        </button>

        <div className="bg-primary-dark/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-primary/50">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            {isResetMode ? 'Reset Password' : 'Login'}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-accent-orange/20 border border-accent-orange/50 text-white rounded-lg text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-primary/20 border border-primary/50 text-white rounded-lg text-sm">
              {success}
            </div>
          )}

          {location.state?.message && (
            <div className="mb-6 p-4 bg-primary/20 border border-primary/50 text-white rounded-lg text-sm">
              {location.state.message}
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
                    touched.email && validationErrors.email
                      ? 'border-accent-orange'
                      : 'border-primary/50'
                  } rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300`}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
                <Mail className={`absolute left-3 top-2.5 w-5 h-5 ${
                  touched.email && validationErrors.email
                    ? 'text-accent-orange'
                    : 'text-white/70'
                }`} />
              </div>
              {touched.email && validationErrors.email && (
                <p className="mt-2 text-sm text-accent-orange">{validationErrors.email}</p>
              )}
            </div>

            {!isResetMode && (
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
                      touched.password && validationErrors.password
                        ? 'border-accent-orange'
                        : 'border-primary/50'
                    } rounded-lg pl-10 pr-12 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <Lock className={`absolute left-3 top-2.5 w-5 h-5 ${
                    touched.password && validationErrors.password
                      ? 'text-accent-orange'
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
                {touched.password && validationErrors.password && (
                  <p className="mt-2 text-sm text-accent-orange">{validationErrors.password}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <span>
                {loading
                  ? isResetMode
                    ? 'Sending Instructions...'
                    : 'Signing In...'
                  : isResetMode
                  ? 'Send Reset Instructions'
                  : 'Continue'}
              </span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="flex flex-col space-y-4 text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(!isResetMode);
                  setError('');
                  setSuccess('');
                  setEmail('');
                  setPassword('');
                  setValidationErrors({});
                  setTouched({});
                }}
                className="text-accent-yellow hover:text-white transition-colors"
              >
                {isResetMode ? 'Back to Login' : 'Forgot Password?'}
              </button>

              {!isResetMode && (
                <p className="text-white">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-accent-yellow hover:text-white transition-colors"
                  >
                    Create one
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}