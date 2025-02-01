import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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
            <div className="mb-6 p-4 bg-accent-orange/20 border border-accent-orange/50 text-white rounded-lg text-sm">
              {error}
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-white/70" />
              </div>
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg pl-10 pr-12 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <Lock className="absolute left-3 top-2.5 w-5 h-5 text-white/70" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-white/70 hover:text-white transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
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