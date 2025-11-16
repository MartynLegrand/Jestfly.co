
import { useToast } from "@/hooks/use-toast";
import { performLogin } from "../utils/loginService";
// Remove direct useNavigate import

export const useLogin = (setUser: (user: any) => void, setLoading: (loading: boolean) => void) => {
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { success, user, error } = await performLogin(email, password);
      
      if (success && user) {
        setUser(user);
        
        toast({
          title: "Login bem-sucedido!",
          description: "Você foi conectado com sucesso.",
        });
        
        return { success: true };
      }
      
      // Mensagens de erro específicas baseadas no código de erro
      let errorMessage = "Credenciais inválidas. Por favor, tente novamente.";
      
      if (error?.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos. Por favor, verifique suas credenciais.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor, confirme seu email antes de fazer login.";
        }
      }
      
      toast({
        title: "Falha no login",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error };
    } catch (error: any) {
      console.error("Login hook error:", error);
      
      toast({
        title: "Falha no login",
        description: error?.message || "Um erro inesperado ocorreu durante o login.",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { login };
};
