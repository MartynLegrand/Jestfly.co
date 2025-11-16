
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Instagram, Twitter, Link as LinkIcon, Wallet, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/ui/GlassCard";
import UserAvatar from "@/components/ui/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import WalletDisplay from "@/components/wallet/WalletDisplay";
import TransferModal from "@/components/wallet/TransferModal";
import ReceiveModal from "@/components/wallet/ReceiveModal";
import TwoFactorAuth from "@/components/auth/TwoFactorAuth";
import AccountActivityLogs from "@/components/auth/AccountActivityLogs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to view your profile.",
        variant: "destructive",
      });
      navigate("/login");
    }

    if (user?.profile) {
      setTwoFactorEnabled(user.profile.two_factor_enabled || false);
    }
  }, [user, loading, navigate, toast]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  const { profile } = user;

  const handleTwoFactorUpdate = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8 py-12 px-6 rounded-2xl bg-gradient overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col items-center text-white">
            <UserAvatar user={profile} size="xl" className="mb-4 ring-4 ring-white" />
            <h1 className="text-3xl font-bold mb-1">{profile?.display_name}</h1>
            <p className="text-white/80">@{profile?.username}</p>
            <span className="mt-2 px-3 py-1 text-xs font-medium bg-white/20 rounded-full backdrop-blur-sm">
              {profile?.profile_type?.charAt(0).toUpperCase() + profile?.profile_type?.slice(1)}
            </span>
          </div>
        </div>

        <Tabs defaultValue="profile" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <GlassCard className="h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">About</h2>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-muted-foreground mb-6">
                    {profile?.bio || "No bio yet. Tell others about yourself!"}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Social Links</h3>
                    {profile?.social_links?.instagram || profile?.social_links?.twitter || profile?.social_links?.website ? (
                      <div className="flex flex-wrap gap-2">
                        {profile?.social_links?.instagram && (
                          <Button variant="outline" size="sm" className="gap-1.5" asChild>
                            <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer">
                              <Instagram className="h-3.5 w-3.5" />
                              <span>Instagram</span>
                            </a>
                          </Button>
                        )}
                        {profile?.social_links?.twitter && (
                          <Button variant="outline" size="sm" className="gap-1.5" asChild>
                            <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer">
                              <Twitter className="h-3.5 w-3.5" />
                              <span>Twitter</span>
                            </a>
                          </Button>
                        )}
                        {profile?.social_links?.website && (
                          <Button variant="outline" size="sm" className="gap-1.5" asChild>
                            <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer">
                              <LinkIcon className="h-3.5 w-3.5" />
                              <span>Website</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No social links added yet.</p>
                    )}
                  </div>
                </GlassCard>
              </div>

              <div className="md:col-span-2">
                <GlassCard>
                  <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                        <p>@{profile?.username}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                        <p>{profile?.profile_type?.charAt(0).toUpperCase() + profile?.profile_type?.slice(1)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                        <p>{new Date(profile?.created_at || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <TwoFactorAuth 
                userId={user.id} 
                enabled={twoFactorEnabled} 
                onUpdate={handleTwoFactorUpdate} 
              />
              
              <GlassCard>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Account Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your account security settings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-md hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your password regularly to keep your account secure</p>
                    </div>
                    <Button>Change</Button>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-md hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-medium">Email Verification</h4>
                      <p className="text-sm text-muted-foreground">
                        {profile?.is_verified 
                          ? "Your email is verified" 
                          : "Please verify your email address to enhance account security"}
                      </p>
                    </div>
                    {!profile?.is_verified && (
                      <Button variant="outline">Verify Email</Button>
                    )}
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-md hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-medium">Connected Devices</h4>
                      <p className="text-sm text-muted-foreground">Manage devices connected to your account</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <GlassCard className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Wallet</h2>
                <Button variant="outline" size="sm" onClick={() => navigate("/wallet")}>
                  <Wallet className="mr-2 h-4 w-4" /> Manage
                </Button>
              </div>
              
              <WalletDisplay 
                onTransfer={() => setTransferModalOpen(true)}
                onReceive={() => setReceiveModalOpen(true)}
              />
            </GlassCard>
          </TabsContent>

          <TabsContent value="activity">
            <AccountActivityLogs />
          </TabsContent>
        </Tabs>
      </div>

      <TransferModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
      />

      <ReceiveModal
        open={receiveModalOpen}
        onOpenChange={setReceiveModalOpen}
      />
    </MainLayout>
  );
};

export default Profile;
