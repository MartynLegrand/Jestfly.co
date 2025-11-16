
/**
 * Custom hook for managing user permissions and access control.
 * Provides utility functions to check user roles and permissions.
 * 
 * @param {AuthUser | null} user - The authenticated user object
 * @returns {Object} Object containing permission check utilities
 * @property {boolean} isAdmin - Whether the user has admin privileges
 * @property {boolean} isArtist - Whether the user is an artist
 * @property {boolean} isFan - Whether the user is a fan
 * @property {boolean} isCollaborator - Whether the user is a collaborator
 * @property {Function} hasPermission - Function to check if user has specific permissions
 * @property {Function} hasRole - Function to check if user has a specific role
 * 
 * @example
 * const { isAdmin, hasPermission, hasRole } = usePermissions(user);
 * 
 * if (isAdmin || hasPermission(['artist', 'collaborator'])) {
 *   // Perform privileged operation
 * }
 */
import { AuthUser } from "@/types/user";

export const usePermissions = (user: AuthUser | null) => {
  const isAdmin = user?.profile?.profile_type === "admin";
  const isArtist = user?.profile?.profile_type === "artist";
  const isFan = user?.profile?.profile_type === "fan";
  const isCollaborator = user?.profile?.profile_type === "collaborator";

  /**
   * Checks if the user has any of the specified profile types
   * @param {string[]} requiredProfileTypes - Array of allowed profile types
   * @returns {boolean} Whether the user has the required permissions
   */
  const hasPermission = (requiredProfileTypes: string[]) => {
    if (!user || !user.profile) return false;
    return requiredProfileTypes.includes(user.profile.profile_type);
  };

  /**
   * Checks if the user has a specific permission from their permissions array
   * @param {string} permission - The permission to check for
   * @returns {boolean} Whether the user has the permission
   */
  const hasSpecificPermission = (permission: string) => {
    if (!user?.profile?.permissions) return false;
    return user.profile.permissions.includes(permission);
  };

  /**
   * Checks if the user has a specific role from their roles array
   * @param {string} role - The role to check for
   * @returns {boolean} Whether the user has the role
   */
  const hasRole = (role: string) => {
    if (!user?.profile?.roles) return false;
    return user.profile.roles.includes(role);
  };

  /**
   * Checks if the user has two-factor authentication enabled
   * @returns {boolean} Whether 2FA is enabled
   */
  const hasTwoFactorEnabled = () => {
    return user?.profile?.two_factor_enabled || false;
  };

  /**
   * Checks if the user's email is verified
   * @returns {boolean} Whether the email is verified
   */
  const isEmailVerified = () => {
    return user?.profile?.is_verified || false;
  };

  return {
    isAdmin,
    isArtist,
    isFan,
    isCollaborator,
    hasPermission,
    hasSpecificPermission,
    hasRole,
    hasTwoFactorEnabled,
    isEmailVerified
  };
};
