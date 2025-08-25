import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'citizen' | 'inspector' | 'official';
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'citizen' | 'inspector' | 'official';
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'citizen' | 'inspector' | 'official';
          points?: number;
          updated_at?: string;
        };
      };
      billboards: {
        Row: {
          id: string;
          latitude: number;
          longitude: number;
          address: string;
          permit_number: string | null;
          width: number;
          height: number;
          status: 'compliant' | 'violation' | 'pending_review';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          latitude: number;
          longitude: number;
          address: string;
          permit_number?: string | null;
          width: number;
          height: number;
          status?: 'compliant' | 'violation' | 'pending_review';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          permit_number?: string | null;
          width?: number;
          height?: number;
          status?: 'compliant' | 'violation' | 'pending_review';
          updated_at?: string;
        };
      };
      violations: {
        Row: {
          id: string;
          billboard_id: string;
          reporter_id: string;
          type: 'unauthorized' | 'damaged' | 'oversized' | 'improper_location' | 'missing_permit';
          description: string;
          confidence_score: number;
          photo_url: string;
          video_url: string | null;
          latitude: number;
          longitude: number;
          address: string;
          status: 'pending' | 'verified' | 'resolved' | 'false_positive';
          ai_analysis: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          billboard_id: string;
          reporter_id: string;
          type: 'unauthorized' | 'damaged' | 'oversized' | 'improper_location' | 'missing_permit';
          description: string;
          confidence_score: number;
          photo_url: string;
          video_url?: string | null;
          latitude: number;
          longitude: number;
          address: string;
          status?: 'pending' | 'verified' | 'resolved' | 'false_positive';
          ai_analysis?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          billboard_id?: string;
          reporter_id?: string;
          type?: 'unauthorized' | 'damaged' | 'oversized' | 'improper_location' | 'missing_permit';
          description?: string;
          confidence_score?: number;
          photo_url?: string;
          video_url?: string | null;
          latitude?: number;
          longitude?: number;
          address?: string;
          status?: 'pending' | 'verified' | 'resolved' | 'false_positive';
          ai_analysis?: any;
          updated_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          points_required: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          points_required: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          points_required?: number;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          target: number;
          points_reward: number;
          badge_reward_id: string | null;
          expires_at: string;
          type: 'weekly' | 'monthly' | 'special';
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          target: number;
          points_reward: number;
          badge_reward_id?: string | null;
          expires_at: string;
          type: 'weekly' | 'monthly' | 'special';
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          target?: number;
          points_reward?: number;
          badge_reward_id?: string | null;
          expires_at?: string;
          type?: 'weekly' | 'monthly' | 'special';
        };
      };
    };
  };
};