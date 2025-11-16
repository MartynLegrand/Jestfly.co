
import { useToast } from "@/hooks/use-toast";
import { registerUser, RegisterUserData } from "../utils/registrationService";

export const useRegister = (setLoading: (loading: boolean) => void) => {
  const { toast } = useToast();

  const register = async (email: string, password: string, userData: RegisterUserData) => {
    try {
      setLoading(true);
      console.log("Registering with data:", { email, ...userData });
      
      const { data, error } = await registerUser(email, password, userData);
      
      if (error) {
        console.error("Registration hook error:", error);
        
        toast({
          title: "Falha no registro",
          description: error?.message || "Ocorreu um erro durante o registro",
          variant: "destructive",
        });
        
        return { success: false, error };
      }
      
      toast({
        title: "Registro bem-sucedido!",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error("Registration hook unexpected error:", error);
      
      toast({
        title: "Falha no registro",
        description: error?.message || "Ocorreu um erro inesperado durante o registro",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { register };
};
