
import { resetPasswordForEmail } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const usePasswordReset = (setLoading: (loading: boolean) => void) => {
  const { toast } = useToast();

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      
      // Garantindo que estamos usando a URL de redirecionamento correta
      const redirectTo = `${window.location.origin}/reset-password`;
      console.log("Enviando redefinição de senha com redirecionamento para:", redirectTo);
      
      const { success, error } = await resetPasswordForEmail(email, redirectTo);
      
      if (error) {
        console.error("Password reset error:", error);
        // Não lance o erro, para não expor se o email existe ou não
        
        // Por segurança, retornamos sucesso mesmo quando o email não existe
        // Isso evita ataques de enumeração de usuários
        return { success: true };
      }
      
      toast({
        title: "Email de redefinição enviado",
        description: "Se o email estiver cadastrado, você receberá um link para redefinir sua senha.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // Por segurança, não expomos detalhes do erro
      toast({
        title: "Solicitação processada",
        description: "Se o email estiver cadastrado, você receberá um link para redefinir sua senha.",
      });
      
      return { success: true, error };
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword };
};
