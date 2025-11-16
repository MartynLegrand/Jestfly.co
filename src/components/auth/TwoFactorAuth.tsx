
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { updateProfile } from "@/lib/supabase/profiles";
import { useToast } from "@/hooks/use-toast";
import { Shield, Copy, CheckCircle, XCircle } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import GlassCard from "@/components/ui/GlassCard";

interface TwoFactorAuthProps {
  userId: string;
  enabled: boolean;
  onUpdate: (enabled: boolean) => void;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ userId, enabled, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSetup = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // In a real implementation, you would call a Supabase Edge Function
      // to generate a TOTP secret and QR code URL
      const mockSecretKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      const mockQrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/JestFly:user@example.com?secret=ABCDEFGHIJKLMNOPQRSTUVWXYZ234567&issuer=JestFly";
      
      setSecretKey(mockSecretKey);
      setQrCodeUrl(mockQrCodeUrl);
      setShowSetupDialog(true);
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      setError("Failed to set up two-factor authentication");
      toast({
        title: "Error",
        description: "Failed to set up two-factor authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // In a real implementation, you would verify the TOTP code here
      // against the user's secret key
      if (verificationCode === "123456") {
        // Update user profile to enable 2FA
        await updateProfile(userId, {
          two_factor_enabled: true
        });
        
        onUpdate(true);
        setShowSetupDialog(false);
        setShowVerifyDialog(false);
        
        toast({
          title: "Success",
          description: "Two-factor authentication has been enabled",
        });
      } else {
        setError("Invalid verification code");
      }
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      setError("Failed to verify the authentication code");
      toast({
        title: "Error",
        description: "Failed to verify the authentication code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // In a real implementation, you would verify the TOTP code here
      // before disabling 2FA
      if (disableCode === "123456") {
        // Update user profile to disable 2FA
        await updateProfile(userId, {
          two_factor_enabled: false
        });
        
        onUpdate(false);
        setShowDisableDialog(false);
        
        toast({
          title: "Success",
          description: "Two-factor authentication has been disabled",
        });
      } else {
        setError("Invalid verification code");
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      setError("Failed to disable two-factor authentication");
      toast({
        title: "Error",
        description: "Failed to disable two-factor authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretKey);
    toast({
      title: "Copied",
      description: "Secret key copied to clipboard",
    });
  };

  return (
    <GlassCard>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div>
            {enabled ? (
              <Button 
                variant="destructive" 
                onClick={() => setShowDisableDialog(true)}
                disabled={isLoading}
              >
                Disable
              </Button>
            ) : (
              <Button 
                onClick={handleSetup}
                disabled={isLoading}
              >
                Enable
              </Button>
            )}
          </div>
        </div>

        <div className="text-sm">
          {enabled ? (
            <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Two-factor authentication is enabled</AlertTitle>
              <AlertDescription>
                Your account is protected with an additional layer of security.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              <AlertTitle>Two-factor authentication is not enabled</AlertTitle>
              <AlertDescription>
                Enable two-factor authentication to add an extra layer of security to your account.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set up two-factor authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with an authenticator app like Google Authenticator or Authy.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <div className="border p-4 rounded-lg bg-white">
              <img src={qrCodeUrl} alt="QR Code" width={200} height={200} />
            </div>

            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-2">
                Or enter this code manually in your app:
              </p>
              <div className="flex items-center space-x-2">
                <Input value={secretKey} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetupDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowSetupDialog(false);
              setShowVerifyDialog(true);
              setVerificationCode("");
            }} disabled={isLoading}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify two-factor authentication</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code from your authenticator app to verify setup.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-full">
              <InputOTP 
                maxLength={6}
                value={verificationCode} 
                onChange={setVerificationCode}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} index={index} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={isLoading || verificationCode.length !== 6}>
              {isLoading ? "Verifying..." : "Verify & Enable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable two-factor authentication</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code from your authenticator app to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-full">
              <InputOTP 
                maxLength={6}
                value={disableCode} 
                onChange={setDisableCode}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} index={index} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisableDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDisable} 
              disabled={isLoading || disableCode.length !== 6}
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
};

export default TwoFactorAuth;
