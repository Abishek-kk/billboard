export interface User {
  id: string;
  email: string;
  name: string;
  role: 'citizen' | 'inspector' | 'official';
  points: number;
  badges: Badge[];
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface Billboard {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  permit_number?: string;
  size: {
    width: number;
    height: number;
  };
  status: 'compliant' | 'violation' | 'pending_review';
  created_at: string;
  updated_at: string;
}

export interface Violation {
  id: string;
  billboard_id: string;
  reporter_id: string;
  type: 'unauthorized' | 'damaged' | 'oversized' | 'improper_location' | 'missing_permit';
  description: string;
  confidence_score: number;
  photo_url: string;
  video_url?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'pending' | 'verified' | 'resolved' | 'false_positive';
  ai_analysis: AIAnalysis;
  created_at: string;
  updated_at: string;
}

export interface AIAnalysis {
  detected_violations: string[];
  confidence_scores: Record<string, number>;
  permit_extracted: boolean;
  permit_number?: string;
  size_compliance: boolean;
  location_compliance: boolean;
  damage_detected: boolean;
  privacy_processed: boolean;
}

export interface Report {
  id: string;
  title: string;
  violations: Violation[];
  compliance_score: number;
  generated_at: string;
  period: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current_progress: number;
  points_reward: number;
  badge_reward?: Badge;
  expires_at: string;
  type: 'weekly' | 'monthly' | 'special';
}