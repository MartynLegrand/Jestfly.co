
import { supabase } from "./client";
import { User } from "@supabase/supabase-js";

/**
 * Registra um novo usuário
 */
export async function signUp(email: string, password: string, userData: any = {}) {
  console.log("Registrando usuário:", email);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });
    
    if (error) {
      console.error("Signup error:", error);
      return { data: null, error };
    }
    
    console.log("Signup successful:", data.user?.id);
    return { data, error: null };
  } catch (e) {
    console.error("Unexpected signup error:", e);
    const formattedError = e instanceof Error ? e : new Error(String(e));
    return { data: null, error: formattedError };
  }
}

/**
 * Faz login de um usuário existente
 */
export async function signIn(email: string, password: string) {
  console.log("Fazendo login para:", email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error);
      return { data: null, error };
    }
    
    console.log("Login successful:", data.user?.id);
    return { data, error: null };
  } catch (e) {
    console.error("Unexpected login error:", e);
    const formattedError = e instanceof Error ? e : new Error(String(e));
    return { data: null, error: formattedError };
  }
}

/**
 * Faz logout do usuário atual
 */
export async function signOut() {
  console.log("Executando logout");
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      return { success: false, error };
    }
    
    console.log("Logout successful");
    return { success: true, error: null };
  } catch (e) {
    console.error("Unexpected logout error:", e);
    const formattedError = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: formattedError };
  }
}

/**
 * Obtém o usuário atual
 */
export async function getCurrentUser() {
  console.log("Obtendo usuário atual");
  try {
    // Primeiro verifica se há uma sessão
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return { user: null, error: sessionError };
    }
    
    if (!sessionData.session) {
      console.log("No active session found");
      return { user: null, error: null };
    }
    
    // Obtém os detalhes do usuário
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Error getting user:", error);
      return { user: null, error };
    }
    
    console.log("Current user:", user?.id);
    
    // Se encontrarmos um usuário, precisamos obter também os dados do perfil
    if (user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error("Error getting user profile:", profileError);
          // Continue even if profile fetch fails
          return { user, error: null };
        } else if (profile) {
          // Mescla os dados do usuário com os dados do perfil
          const userWithProfile = {
            ...user,
            ...profile
          };
          return { user: userWithProfile, error: null };
        }
      } catch (profileFetchError) {
        console.error("Unexpected error fetching profile:", profileFetchError);
        // Continue even if profile fetch fails
        return { user, error: null };
      }
    }
    
    return { user, error: null };
  } catch (e) {
    console.error("Unexpected getCurrentUser error:", e);
    const formattedError = e instanceof Error ? e : new Error(String(e));
    return { user: null, error: formattedError };
  }
}

/**
 * Envia email para redefinição de senha
 */
export async function resetPasswordForEmail(email: string, redirectTo: string) {
  console.log("Enviando redefinição de senha para:", email);
  console.log("Redirecionando para:", redirectTo);
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });
    
    if (error) {
      console.error("Password reset error:", error);
      return { success: false, error };
    }
    
    console.log("Password reset email sent");
    return { success: true, error: null };
  } catch (e) {
    console.error("Unexpected password reset error:", e);
    const formattedError = e instanceof Error ? e : new Error(String(e));
    return { success: false, error: formattedError };
  }
}
