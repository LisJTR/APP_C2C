export interface User {
  id?: number;
  username?: string;
  email?: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  created_at?: string;
  balance?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

