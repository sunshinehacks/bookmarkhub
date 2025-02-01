import React, { useState, useEffect } from 'react';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Bookmark } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useBookmarks } from '../hooks/useBookmarks';

interface ProfileProps {
  bookmarks: Bookmark[];
}

export default function Profile({ bookmarks }: ProfileProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useProfile(user?.id);
  const { bookmarks: userBookmarks, loading: bookmarksLoading } = useBookmarks(user?.id);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setTempProfile(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!tempProfile) return;

    const success = await updateProfile({
      name: tempProfile.name,
      age: tempProfile.age,
      bio: tempProfile.bio,
      avatar_url: tempProfile.avatar_url
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tempProfile || !user?.id) return;

    try {
      setUploadError(null);

      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
        throw new Error('Invalid file type. Supported formats: JPG, PNG, GIF, WebP');
      }

      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      if (tempProfile.avatar_url && !tempProfile.avatar_url.includes('unsplash.com')) {
        const oldPath = tempProfile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        setTempProfile({ ...tempProfile, avatar_url: publicUrl });
      }
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setUploadError(err.message);
    }
  };

  const categoryCount = userBookmarks.reduce((acc, bookmark) => {
    acc[bookmark.category] = (acc[bookmark.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading || bookmarksLoading) {
    return (
      <div className="flex-grow z-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-dark/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-primary/50">
            <p className="text-white text-center">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow z-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-dark/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-primary/50">
            <p className="text-accent-orange text-center">Error loading profile: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !tempProfile) {
    return (
      <div className="flex-grow z-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-dark/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-primary/50">
            <p className="text-white text-center">No profile found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow z-10 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-white hover:text-accent-yellow transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Bookmarks
        </button>

        <div className="bg-primary-dark/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-primary/50">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-accent-yellow/50 shadow-xl">
                  <img
                    src={isEditing ? tempProfile.avatar_url : profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              {uploadError && (
                <p className="text-accent-orange text-sm text-center">{uploadError}</p>
              )}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.name || ''}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempProfile.age || ''}
                      onChange={(e) => setTempProfile({ ...tempProfile, age: parseInt(e.target.value) || null })}
                      className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white">{profile.age ? `${profile.age} years old` : 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={tempProfile.bio || ''}
                      onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white">{profile.bio || 'No bio provided'}</p>
                  )}
                </div>
                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setTempProfile(profile);
                        setIsEditing(false);
                        setUploadError(null);
                      }}
                      className="px-4 py-2 border border-primary/50 rounded-lg text-white hover:bg-primary/20 focus:outline-none transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow transition-all duration-300 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Your Bookmark Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary-dark/30 rounded-xl p-6 border border-primary/50">
                <h3 className="text-lg font-medium text-white mb-4">Total Bookmarks</h3>
                <p className="text-4xl font-bold text-accent-yellow">{userBookmarks.length}</p>
              </div>
              <div className="bg-primary-dark/30 rounded-xl p-6 border border-primary/50">
                <h3 className="text-lg font-medium text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {Object.entries(categoryCount).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-white">{category}</span>
                      <span className="text-accent-yellow font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}