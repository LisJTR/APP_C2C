export interface User {
  id?: number;
  username?: string;
  email?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  created_at?: string;
  balance?: number;
  is_verified?: boolean;
  country_id?: number;
  country_name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

