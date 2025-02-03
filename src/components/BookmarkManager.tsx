import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import type { Bookmark } from '../types';
import BookmarkForm from './BookmarkForm';
import BookmarkList from './BookmarkList';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../hooks/useAuth';

type FilterOption = 'all' | 'category' | 'icon' | 'color' | 'recent' | 'oldest';

export default function BookmarkManager() {
  const { user } = useAuth();
  const { bookmarks, addBookmark, updateBookmark, deleteBookmark, loading } = useBookmarks(user?.id);
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIcon, setSelectedIcon] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const uniqueCategories = Array.from(new Set(bookmarks.map(b => b.category)));
  const uniqueIcons = Array.from(new Set(bookmarks.map(b => b.icon)));
  const uniqueColors = Array.from(new Set(bookmarks.map(b => b.color)));

  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      // First apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bookmark.name.toLowerCase().includes(query) ||
          bookmark.description?.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query) ||
          bookmark.category.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(bookmark => {
      // Then apply category/icon/color filters
      switch (filterOption) {
        case 'category':
          return selectedCategory === 'all' || bookmark.category === selectedCategory;
        case 'icon':
          return selectedIcon === 'all' || bookmark.icon === selectedIcon;
        case 'color':
          return selectedColor === 'all' || bookmark.color === selectedColor;
        case 'recent':
          return true;
        case 'oldest':
          return true;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (filterOption === 'recent') {
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
      if (filterOption === 'oldest') {
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="bg-primary-dark/30 backdrop-blur-md rounded-xl p-4 border border-primary/50 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/50" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-accent-yellow" />
            <span className="text-white font-medium">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={filterOption}
              onChange={(e) => {
                setFilterOption(e.target.value as FilterOption);
                setSelectedCategory('all');
                setSelectedIcon('all');
                setSelectedColor('all');
              }}
              className="bg-primary-dark/30 border border-primary/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
            >
              <option value="all">All Bookmarks</option>
              <option value="category">Category</option>
              <option value="icon">Icon</option>
              <option value="color">Color</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>

            {filterOption === 'category' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-primary-dark/30 border border-primary/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            )}

            {filterOption === 'icon' && (
              <select
                value={selectedIcon}
                onChange={(e) => setSelectedIcon(e.target.value)}
                className="bg-primary-dark/30 border border-primary/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
              >
                <option value="all">All Icons</option>
                {uniqueIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            )}

            {filterOption === 'color' && (
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="bg-primary-dark/30 border border-primary/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
              >
                <option value="all">All Colors</option>
                {uniqueColors.map(color => (
                  <option key={color} value={color}>
                    {color.split(' ').pop()?.replace('to-', '').replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

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
        bookmarks={filteredBookmarks}
        onEdit={setEditingBookmark}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}