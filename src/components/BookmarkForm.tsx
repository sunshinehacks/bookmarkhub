import React, { useState, useEffect } from 'react';
import { Globe, Plus, Save, X } from 'lucide-react';
import type { Bookmark } from '../types';

const iconComponents = {
  Github: 'Github',
  Twitter: 'Twitter',
  Youtube: 'Youtube',
  Figma: 'Figma',
  Notion: 'Notion',
  Slack: 'Slack',
  Globe: 'Globe'
} as const;

const colorOptions = [
  { name: 'Primary', value: 'from-primary to-primary-dark' },
  { name: 'Primary Light', value: 'from-primary-light to-primary' },
  { name: 'Orange', value: 'from-accent-orange to-primary-dark' },
  { name: 'Yellow', value: 'from-accent-yellow to-accent-orange' },
  { name: 'Teal', value: 'from-primary to-primary-light' },
  { name: 'Dark', value: 'from-primary-dark to-primary' },
];

const categoryOptions = [
  'Development',
  'Social Media',
  'Entertainment',
  'Design',
  'Productivity',
  'Communication',
  'Other'
] as const;

const defaultBookmark = {
  name: '',
  url: '',
  description: '',
  icon: 'Globe' as keyof typeof iconComponents,
  category: categoryOptions[0],
  color: colorOptions[0].value
};

interface BookmarkFormProps {
  bookmark?: Bookmark;
  onSubmit: (bookmark: Partial<Bookmark>) => Promise<void>;
  onCancel: () => void;
}

export default function BookmarkForm({ bookmark, onSubmit, onCancel }: BookmarkFormProps) {
  const [formData, setFormData] = useState(defaultBookmark);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookmark) {
      setFormData({
        name: bookmark.name,
        url: bookmark.url,
        description: bookmark.description || '',
        icon: bookmark.icon as keyof typeof iconComponents,
        category: bookmark.category,
        color: bookmark.color
      });
    } else {
      setFormData(defaultBookmark);
    }
  }, [bookmark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.url.trim()) throw new Error('URL is required');
      
      try {
        new URL(formData.url);
      } catch {
        throw new Error('Invalid URL format');
      }

      await onSubmit(formData);
      setFormData(defaultBookmark);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary-dark/30 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-primary/50">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          {bookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-white hover:text-accent-yellow transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-accent-orange/20 border border-accent-orange/50 text-white rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
            placeholder="Bookmark name"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-white mb-1">
            URL
          </label>
          <input
            id="url"
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
            placeholder="https://example.com"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
            placeholder="Description (optional)"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-white mb-1">
              Icon
            </label>
            <select
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
              disabled={isSubmitting}
            >
              {Object.keys(iconComponents).map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
              disabled={isSubmitting}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-white mb-1">
              Color
            </label>
            <select
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
              disabled={isSubmitting}
            >
              {colorOptions.map((color) => (
                <option key={color.value} value={color.value}>{color.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 border border-primary/50 rounded-lg text-white hover:bg-primary/20 focus:outline-none transition-all duration-300 text-sm sm:text-base"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow transition-all duration-300 flex items-center space-x-2 text-sm sm:text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <span>{bookmark ? 'Update' : 'Add'} Bookmark</span>
                {bookmark ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}