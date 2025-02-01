import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { BookMarked, Settings as SettingsIcon, User, Heart, LogOut, Menu } from 'lucide-react';
import { supabase } from './lib/supabase';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import BookmarkManager from './components/BookmarkManager';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useBookmarks } from './hooks/useBookmarks';
import About from './components/About';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Contact from './components/Contact';

function App() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { bookmarks } = useBookmarks(user?.id);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const MainContent = () => (
    <div className="flex-grow flex flex-col py-8 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight animate-float">
            BookmarkHub
          </h1>
          <p className="text-lg sm:text-xl text-white mb-6 sm:mb-8 animate-pulse-slow px-4">
            Your personal bookmark manager for organizing and accessing your favorite web resources
          </p>
        </div>

        {user ? (
          <BookmarkManager />
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => navigate('/settings')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg animate-glow font-medium text-lg"
            >
              Get Started
            </button>
            <p className="text-white text-sm sm:text-base">
              New to BookmarkHub?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-accent-yellow hover:text-white transition-colors underline"
              >
                Create an account
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <div 
        className="fixed inset-0"
        style={{ 
          zIndex: -1,
          backgroundImage: 'linear-gradient(to right top, #002c2b, #004b3b, #1b6b3d, #538933, #94a41d, #99a920, #9fae24, #a4b327, #6aa443, #369158, #037b63, #076461)'
        }}
      />

      {/* Navigation */}
      <nav className="bg-primary-dark/80 backdrop-blur-md border-b border-primary/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="animate-float cursor-pointer" onClick={() => navigate('/')}>
                <BookMarked className="w-8 h-8 sm:w-10 sm:h-10 text-accent-yellow" />
              </div>
              <span className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold text-white tracking-tight cursor-pointer" onClick={() => navigate('/')}>
                Bookmark Hub
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="text-white hover:text-accent-yellow p-2 rounded-lg hover:bg-primary/50 transition-all duration-300"
                  >
                    {profile?.avatar_url ? (
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>
                  <button 
                    onClick={() => navigate('/settings')} 
                    className="text-white hover:text-accent-yellow p-2 rounded-lg hover:bg-primary/50 transition-all duration-300"
                  >
                    <SettingsIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-accent-yellow p-2 rounded-lg hover:bg-primary/50 transition-all duration-300"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="space-x-4">
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 text-white hover:text-accent-yellow transition-colors"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors duration-200"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-accent-yellow p-2 transition-colors duration-300"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-3">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {user ? (
                  <>
                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-white hover:text-accent-yellow px-3 py-2 rounded-md hover:bg-primary/50 transition-all duration-300 flex items-center"
                    >
                      {profile?.avatar_url ? (
                        <div className="w-5 h-5 rounded-full overflow-hidden mr-2">
                          <img 
                            src={profile.avatar_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <User className="w-5 h-5 mr-2" />
                      )}
                      Profile
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/settings');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-white hover:text-accent-yellow px-3 py-2 rounded-md hover:bg-primary/50 transition-all duration-300 flex items-center"
                    >
                      <SettingsIcon className="w-5 h-5 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-white hover:text-accent-yellow px-3 py-2 rounded-md hover:bg-primary/50 transition-all duration-300 flex items-center"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-white hover:text-accent-yellow px-3 py-2 rounded-md hover:bg-primary/50 transition-all duration-300"
                    >
                      Register
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-white hover:text-accent-yellow px-3 py-2 rounded-md hover:bg-primary/50 transition-all duration-300"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <Routes>
        <Route path="/profile" element={<Profile bookmarks={bookmarks} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<MainContent />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-primary-dark/80 backdrop-blur-md border-t border-primary/50 z-10 mt-auto">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <BookMarked className="w-6 h-6 text-accent-yellow" />
              <span className="text-white font-semibold">BookmarkHub</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-white">
              <Link to="/about" className="hover:text-accent-yellow transition-colors duration-200">About</Link>
              <Link to="/privacy" className="hover:text-accent-yellow transition-colors duration-200">Privacy</Link>
              <Link to="/terms" className="hover:text-accent-yellow transition-colors duration-200">Terms</Link>
              <Link to="/contact" className="hover:text-accent-yellow transition-colors duration-200">Contact</Link>
            </div>
            <div className="flex items-center">
              <span className="text-white text-sm">Made with</span>
              <Heart className="w-4 h-4 mx-1 text-accent-orange animate-pulse" />
              <span className="text-white text-sm">by INFIP</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;