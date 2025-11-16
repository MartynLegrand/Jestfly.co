
import { AuthUser } from "@/types/user";
import { RegisterUserData } from "./utils/registrationService";

export interface AuthContextType {
  user: AuthUser | null;
  currentUser: AuthUser | null; // Add alias for backward compatibility
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  register: (email: string, password: string, userData: RegisterUserData) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Add alias for backward compatibility
  isAdmin: boolean;
  isArtist: boolean;
  isFan: boolean;
  isCollaborator: boolean;
  hasPermission: (profileTypes: string[]) => boolean;
  hasSpecificPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasTwoFactorEnabled: () => boolean;
  isEmailVerified: () => boolean;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
}

export interface AuthProviderState {
  user: AuthUser | null;
  currentUser: AuthUser | null; // Add alias
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  register: (email: string, password: string, userData: RegisterUserData) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Add alias
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
  isAdmin: boolean;
  isArtist: boolean;
  isFan: boolean;
  isCollaborator: boolean;
  hasPermission: (profileTypes: string[]) => boolean;
  hasSpecificPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasTwoFactorEnabled: () => boolean;
  isEmailVerified: () => boolean;
}
