
import { useToast } from "@/hooks/use-toast";
import { performLogout } from "../utils/logoutService";

type NavigateFunction = (path: string, options?: { replace: boolean }) => void;

export const useLogout = (setUser: (user: null) => void, setLoading: (loading: boolean) => void) => {
  const { toast } = useToast();
  
  const logout = async (navigateOrPath?: NavigateFunction | string) => {
    try {
      setLoading(true);
      const { success, error } = await performLogout();
      
      if (!success) {
        console.error("Logout failed:", error);
      }
      
      // Regardless of backend success, clear user from frontend
      setUser(null);
      
      toast({
        title: "Desconectado",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Handle both calling patterns
      if (navigateOrPath) {
        if (typeof navigateOrPath === 'string') {
          // Legacy pattern: logout('/login')
          window.location.href = navigateOrPath;
        } else {
          // New pattern: logout(navigate)
          navigateOrPath("/login", { replace: true });
        }
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      
      toast({
        title: "Falha ao desconectar",
        description: error?.message || "Ocorreu um erro durante o logout",
        variant: "destructive",
      });
      
      // Still clear user on error to prevent UI issues
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { logout };
};
