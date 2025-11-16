
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useAuth } from "@/context/AuthContext";
import { LogIn } from "lucide-react";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { useToast } from "@/hooks/use-toast";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres.",
  }),
});

const Login = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSocialLoginInProgress, setIsSocialLoginInProgress] = useState(false);

  // Se o usuário já estiver logado, redireciona para o perfil
  useEffect(() => {
    if (user) {
      console.log("Usuário já logado, redirecionando para o perfil");
      // Verifica se há um estado de redirecionamento
      const from = location.state?.from || "/profile";
      navigate(from);
    }
  }, [user, navigate, location.state]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoginError(null);
    try {
      setIsSubmitting(true);
      console.log("Tentando fazer login com:", values.email);
      
      const { success, error } = await login(values.email, values.password);
      
      if (success) {
        console.log("Login bem-sucedido, redirecionando para o perfil");
        toast({
          title: "Login bem-sucedido",
          description: "Você está agora conectado",
        });
        // Redireciona para a página de origem ou para o perfil
        const from = location.state?.from || "/profile";
        navigate(from);
      } else if (error) {
        console.error("Erro de login:", error);
        setLoginError(error.message || "Credenciais inválidas. Por favor, tente novamente.");
        toast({
          title: "Falha no login",
          description: error.message || "Credenciais inválidas. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Erro de login:", err);
      setLoginError(err.message || "Ocorreu um erro inesperado");
      toast({
        title: "Falha no login",
        description: err.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSocialLoginStart = () => {
    setIsSocialLoginInProgress(true);
  };

  const handleSocialLoginEnd = (success: boolean, error?: any) => {
    setIsSocialLoginInProgress(false);
    
    if (!success && error) {
      setLoginError(error.message || "Falha no login social");
      toast({
        title: "Falha no login social",
        description: error.message || "Não foi possível fazer login. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading || isSocialLoginInProgress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-lg">
            {isSocialLoginInProgress ? "Processando login social..." : "Verificando autenticação..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4">
      <Container className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold font-display mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">
            Entre na sua conta JESTFLY
          </p>
        </div>

        <GlassCard className="animate-scale-in">
          {loginError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {loginError}
            </div>
          )}

          <SocialLoginButtons 
            onLoginStart={handleSocialLoginStart}
            onLoginEnd={handleSocialLoginEnd}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">
                OU CONTINUE COM EMAIL
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="voce@exemplo.com"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <button 
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="w-4 h-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Entrando...
                  </span>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Entrar
                  </>
                )}
              </Button>
            </form>
          </Form>
        </GlassCard>

        <div className="mt-6 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Criar uma
            </Link>
          </p>
        </div>
      </Container>
      
      <ForgotPasswordModal 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </div>
  );
};

export default Login;
