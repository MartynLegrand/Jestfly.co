
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasHash, setHasHash] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Verifica se há uma sessão ativa para redefinição de senha
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      // Verifica se o hash na URL tem dados de autenticação
      const hashParams = window.location.hash 
        ? new URLSearchParams(window.location.hash.substring(1))
        : null;
      
      const errorMsg = hashParams?.get('error_description');
      
      if (errorMsg) {
        setError(decodeURIComponent(errorMsg.replace(/\+/g, ' ')));
        setHasHash(true);
      } else if (error) {
        setError("Sessão inválida. Por favor, solicite um novo link de redefinição de senha.");
      } else if (!data.session) {
        setError("Nenhuma sessão de redefinição de senha encontrada. Por favor, solicite um novo link.");
      }
      
      setIsCheckingSession(false);
    };
    
    checkSession();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Tentando atualizar a senha");
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        console.error("Erro ao redefinir senha:", error);
        throw error;
      }

      console.log("Senha atualizada com sucesso");
      setSuccess(true);
      toast({
        title: "Senha redefinida com sucesso",
        description: "Sua senha foi atualizada. Você será redirecionado para fazer login.",
      });

      // Redireciona para o login após uma redefinição bem-sucedida
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Erro de redefinição de senha:", err);
      setError(err.message || "Falha ao redefinir a senha. Por favor, tente novamente.");
      toast({
        title: "Falha na redefinição de senha",
        description: err.message || "Ocorreu um erro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4">
        <Container className="max-w-md w-full">
          <div className="text-center animate-pulse">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-lg">Verificando sessão de redefinição de senha...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4">
      <Container className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold font-display mb-2">Redefinir Senha</h1>
          <p className="text-muted-foreground">
            Crie uma nova senha para sua conta
          </p>
        </div>

        <GlassCard className="animate-scale-in">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-semibold mb-2">Senha Atualizada com Sucesso</h3>
              <p className="text-muted-foreground mb-4">Sua senha foi redefinida. Você será redirecionado para a página de login em instantes.</p>
              <Button onClick={() => navigate("/login")}>Ir para Login</Button>
            </div>
          ) : hasHash && error ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-semibold mb-2">Link de Redefinição de Senha Expirado</h3>
              <p className="text-muted-foreground mb-4">
                O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo.
              </p>
              <Button onClick={() => navigate("/login")}>Voltar para Login</Button>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-semibold mb-2">Sessão Inválida</h3>
              <p className="text-muted-foreground mb-4">
                {error}
              </p>
              <Button onClick={() => navigate("/login")}>Voltar para Login</Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando Senha...
                    </>
                  ) : (
                    "Redefinir Senha"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </GlassCard>
      </Container>
    </div>
  );
};

export default ResetPassword;
