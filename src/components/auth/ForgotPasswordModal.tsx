
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Loader2, MailCheck } from "lucide-react";

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de email válido.",
  }),
});

const ForgotPasswordModal = ({ open, onOpenChange }: ForgotPasswordModalProps) => {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Solicitando redefinição de senha para:", values.email);
      
      // Garantindo que estamos usando a URL de redirecionamento correta
      const { success, error } = await forgotPassword(values.email);
      
      if (success) {
        console.log("Redefinição de senha enviada com sucesso");
        setIsSuccess(true);
        // Resetar formulário
        form.reset();
      } else if (error) {
        console.error("Erro ao solicitar redefinição de senha:", error);
        
        // Mensagem amigável mesmo para emails inexistentes (por segurança)
        setErrorMessage("Se existe uma conta com este email, você receberá um link de redefinição de senha.");
      }
    } catch (err: any) {
      console.error("Erro inesperado ao solicitar redefinição de senha:", err);
      setErrorMessage("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    if (!isLoading) {
      onOpenChange(false);
      // Resetar estado de erro e sucesso após o fechamento do modal
      setTimeout(() => {
        setIsSuccess(false);
        setErrorMessage(null);
        form.reset();
      }, 300);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSuccess ? "Verifique seu email" : "Redefina sua senha"}
          </DialogTitle>
          <DialogDescription>
            {isSuccess
              ? "Enviamos um link de redefinição de senha. Por favor, verifique seu email."
              : "Insira seu endereço de email e enviaremos um link para redefinir sua senha."}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="bg-primary/10 text-primary text-sm p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-primary/10 rounded-full p-3 mb-4">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Se existir uma conta com esse email, você receberá um link de redefinição de senha em breve.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    "Enviar link de redefinição"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
