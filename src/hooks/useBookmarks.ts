import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Bookmark = Database['public']['Tables']['bookmarks']['Row'];
type NewBookmark = Database['public']['Tables']['bookmarks']['Insert'];

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchBookmarks();
  }, [userId]);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (bookmark: Omit<NewBookmark, 'user_id'>) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .insert([{ ...bookmark, user_id: userId }]);

      if (error) throw error;

      await fetchBookmarks();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateBookmark = async (id: string, updates: Partial<Bookmark>) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      await fetchBookmarks();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteBookmark = async (id: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      await fetchBookmarks();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    refresh: fetchBookmarks
  };
}