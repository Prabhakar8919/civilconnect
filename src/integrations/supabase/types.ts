export type Profile = {
  id: string;
  full_name: string;
  email: string;
  user_type: 'land_owner' | 'buyer' | 'architect' | 'engineer' | 'contractor' | 'builder' | 'worker' | 'material_seller' | 'admin';
  created_at?: string;
  city?: string;
  state?: string;
  bio?: string;
  profile_image?: string;
};

export type LandListing = {
  id: string;
  title: string;
  description: string;
  city: string;
  state: string;
  status: 'active' | 'sold' | 'pending';
  area_sqft: number;
  price: number;
  price_per_sqft: number;
  owner_id: string;
  cover_image?: string;
  images?: string[];
  profiles: Profile;
};

export type ProfessionalProfile = {
  id: string;
  profile_id: string;
  experience_years: number;
  price_per_sqft: number;
  rating: number;
};

export type WorkerProfile = {
  id: string;
  profile_id: string;
  skills: string[];
  experience_years: number;
  rating: number;
};

export type Connection = {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  connection_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'connection_request' | 'connection_accepted' | 'new_message' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          user_type: 'land_owner' | 'buyer' | 'architect' | 'engineer' | 'contractor' | 'builder' | 'worker' | 'material_seller';
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          user_type: 'land_owner' | 'buyer' | 'architect' | 'engineer' | 'contractor' | 'builder' | 'worker' | 'material_seller';
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          user_type?: 'land_owner' | 'buyer' | 'architect' | 'engineer' | 'contractor' | 'builder' | 'worker' | 'material_seller';
        };
        Relationships: [];
      };
      land_listings: {
        Row: {
          id: string;
          title: string;
          description: string;
          city: string;
          state: string;
          status: 'active' | 'sold' | 'pending';
          area_sqft: number;
          price: number;
          price_per_sqft: number;
          owner_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          city: string;
          state: string;
          status?: 'active' | 'sold' | 'pending';
          area_sqft: number;
          price: number;
          price_per_sqft: number;
          owner_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          city?: string;
          state?: string;
          status?: 'active' | 'sold' | 'pending';
          area_sqft?: number;
          price?: number;
          price_per_sqft?: number;
          owner_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "land_listings_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      professional_profiles: {
        Row: {
          id: string;
          profile_id: string;
          experience_years: number;
          price_per_sqft: number;
          rating: number;
        };
        Insert: {
          id?: string;
          profile_id: string;
          experience_years: number;
          price_per_sqft: number;
          rating: number;
        };
        Update: {
          id?: string;
          profile_id?: string;
          experience_years?: number;
          price_per_sqft?: number;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: "professional_profiles_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      worker_profiles: {
        Row: {
          id: string;
          profile_id: string;
          skills: string[];
          experience_years: number;
          rating: number;
        };
        Insert: {
          id?: string;
          profile_id: string;
          skills: string[];
          experience_years: number;
          rating: number;
        };
        Update: {
          id?: string;
          profile_id?: string;
          skills?: string[];
          experience_years?: number;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: "worker_profiles_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
