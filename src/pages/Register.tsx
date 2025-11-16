
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import RegistrationSuccess from "@/components/auth/RegistrationSuccess";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Se o usuário já estiver logado, redireciona para o perfil
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleRegistrationSuccess = () => {
    setRegistrationComplete(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-4">
      <Container className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold font-display mb-2">Criar Conta</h1>
          <p className="text-muted-foreground">
            Junte-se à comunidade JESTFLY
          </p>
        </div>

        {registrationComplete ? (
          <RegistrationSuccess />
        ) : (
          <GlassCard className="animate-scale-in">
            <RegisterForm onSuccess={handleRegistrationSuccess} />
          </GlassCard>
        )}

        {!registrationComplete && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Register;
