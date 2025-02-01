import { Database } from './lib/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];

export type UserProfile = {
  name: string;
  age: number;
  bio: string;
  avatar: string;
};