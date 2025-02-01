export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          age: number | null
          bio: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          age?: number | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          age?: number | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          icon: string
          name: string
          description: string | null
          url: string
          category: string
          color: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          icon: string
          name: string
          description?: string | null
          url: string
          category: string
          color: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          icon?: string
          name?: string
          description?: string | null
          url?: string
          category?: string
          color?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}