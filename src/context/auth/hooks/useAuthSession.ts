import { useState, useEffect, useCallback } from "react";
import { getCurrentUser, supabase } from "@/lib/supabase";

export const useAuthSession = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Verificando sessão do usuário...");
      
      const { user: currentUser, error } = await getCurrentUser();
      
      if (error) {
        console.error("Erro ao verificar usuário:", error);
        setUser(null);
        return;
      }
      
      console.log("Status da sessão:", currentUser ? "Autenticado" : "Não autenticado");
      setUser(currentUser);
    } catch (error) {
      console.error("Erro inesperado ao verificar usuário:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("useAuthSession: Inicializando verificação de sessão");
    
    // Verifica a sessão ao montar o componente
    checkUser();
    
    // Configura o listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Mudança no estado de autenticação:", event, "sessão:", !!session);
      checkUser();
    });
    
    return () => {
      console.log("useAuthSession: Removendo listener de autenticação");
      authListener.subscription.unsubscribe();
    };
  }, [checkUser]);

  return {
    user,
    setUser,
    loading,
    setLoading
  };
};
