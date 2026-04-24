import { jwtDecode } from "jwt-decode";
import type { AuthUser, JwtPayload, UserRole } from "@/types/auth.types";

/**
 * Check if a decoded JWT payload is expired
 */
function isTokenExpired(decoded: JwtPayload): boolean {
  return decoded.exp * 1000 < Date.now();
}

/**
 * Decode a JWT token and extract user information
 * Returns null if token is invalid or expired
 */
export function decodeToken(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (isTokenExpired(decoded)) {
      return null;
    }

    return {
      email: decoded.sub,
      fullName: decoded.fullName || decoded.sub.split("@")[0],
      role: decoded.role as UserRole,
      image: decoded.image,
    };
  } catch {
    return null;
  }
}
