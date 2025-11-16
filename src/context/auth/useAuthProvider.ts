
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLogin } from "./hooks/useLogin";
import { useLogout } from "./hooks/useLogout";
import { useRegister } from "./hooks/useRegister";
import { usePasswordReset } from "./hooks/usePasswordReset";
import { AuthUser } from "@/types";
import { AuthProviderState } from "./types";
import { usePermissions } from "./hooks/usePermissions";

export const useAuthProvider = (): AuthProviderState => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { login } = useLogin(setUser, setLoading);
  const { logout } = useLogout(setUser, setLoading);
  const { register } = useRegister(setLoading);
  const { forgotPassword } = usePasswordReset(setLoading);
  const { 
    isAdmin, 
    isArtist, 
    isFan, 
    isCollaborator, 
    hasPermission, 
    hasSpecificPermission, 
    hasRole,
    hasTwoFactorEnabled,
    isEmailVerified
  } = usePermissions(user);
  
  const refreshSession = async (session: any) => {
    if (!session?.user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email,
        profile: profile || null,
        displayName: profile?.display_name || 'User',
        avatar: profile?.avatar || null
      };
      
      setUser(authUser);
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  useEffect(() => {
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          refreshSession(session);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await refreshSession(session);
      }
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    currentUser: user,
    loading,
    login,
    logout,
    signOut: logout,
    register,
    forgotPassword,
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
