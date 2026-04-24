// User roles
export type UserRole = "STUDENT" | "INSTRUCTOR";

// Decoded user from JWT
export interface AuthUser {
  email: string;
  fullName: string;
  role: UserRole;
  image?: string;
}

// API Request types
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API Response types
export interface AuthResponse {
  token: string;
  tokenType: string;
}

export interface ApiMetaData {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  metaData: ApiMetaData;
  data: T;
}

// JWT payload structure (what's encoded in the token)
export interface JwtPayload {
  sub: string; // email
  fullName?: string;
  role: UserRole;
  image?: string;
  iat: number;
  exp: number;
}
