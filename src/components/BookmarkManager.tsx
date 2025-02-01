import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Bookmark } from '../types';
import BookmarkForm from './BookmarkForm';
import BookmarkList from './BookmarkList';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../hooks/useAuth';

export default function BookmarkManager() {
  const { user } = useAuth();
  const { bookmarks, addBookmark, updateBookmark, deleteBookmark, loading } = useBookmarks(user?.id);
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const handleSubmit = async (bookmarkData: Partial<Bookmark>) => {
    if (editingBookmark) {
      await updateBookmark(editingBookmark.id, bookmarkData);
      setEditingBookmark(null);
    } else {
      await addBookmark(bookmarkData);
      setIsAddingBookmark(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      await deleteBookmark(id);
    }
  };

  const handleCancel = () => {
    setEditingBookmark(null);
    setIsAddingBookmark(false);
  };

  return (
    <div className="space-y-8">
      {/* Add Bookmark Button */}
      {!isAddingBookmark && !editingBookmark && (
        <button
          onClick={() => setIsAddingBookmark(true)}
          className="w-full bg-primary-dark/30 backdrop-blur-md border border-primary/50 rounded-xl p-6 text-white hover:bg-primary-dark/40 transition-all duration-300 flex items-center justify-center space-x-2 group"
        >
          <Plus className="w-5 h-5 text-accent-yellow group-hover:scale-110 transition-transform duration-300" />
          <span className="group-hover:text-accent-yellow transition-colors duration-300">Add New Bookmark</span>
        </button>
      )}

      {/* Bookmark Form */}
      {(isAddingBookmark || editingBookmark) && (
        <BookmarkForm
          bookmark={editingBookmark || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Bookmarks List */}
      <BookmarkList
        bookmarks={bookmarks}
        onEdit={setEditingBookmark}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}