import React from 'react';
import { Globe, Pencil, Trash2, ExternalLink, Github, Twitter, Youtube, Figma, Slack } from 'lucide-react';
import type { Bookmark } from '../types';

const iconComponents = {
  Github,
  Twitter,
  Youtube,
  Figma,
  Notion: Globe,
  Slack,
  Globe
};

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function BookmarkList({ bookmarks, onEdit, onDelete, loading }: BookmarkListProps) {
  if (loading) {
    return (
      <div className="col-span-full text-center text-white">
        Loading bookmarks...
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="col-span-full text-center text-white">
        No bookmarks yet. Add your first one!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {bookmarks.map((bookmark) => {
        const Icon = iconComponents[bookmark.icon as keyof typeof iconComponents] || Globe;
        return (
          <div
            key={bookmark.id}
            className="bg-primary-dark/30 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-primary/50 hover:bg-primary-dark/40 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${bookmark.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white">{bookmark.name}</h3>
                  <p className="text-xs sm:text-sm text-white/80">{bookmark.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(bookmark)}
                  className="p-1 text-white hover:text-accent-yellow transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(bookmark.id)}
                  className="p-1 text-white hover:text-accent-orange transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {bookmark.description && (
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/90">{bookmark.description}</p>
            )}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 sm:mt-4 inline-flex items-center text-xs sm:text-sm text-accent-yellow hover:text-white transition-colors"
            >
              Visit Site
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </a>
          </div>
        );
      })}
    </div>
  );
}