
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GlassCard from "@/components/ui/GlassCard";

const RegistrationSuccess = () => {
  return (
    <GlassCard className="animate-scale-in text-center py-8">
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Verification Email Sent</h2>
        
        <p className="mb-6 text-muted-foreground max-w-md">
          We've sent a verification email to your inbox. Please check your email and click the verification link to complete your registration.
        </p>
        
        <div className="space-y-3">
          <p className="text-sm">
            After verifying your email, you can log in to access your account.
          </p>
          
          <Button asChild>
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default RegistrationSuccess;
