
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType } from "./auth/types";
import { useAuthProvider } from "./auth/useAuthProvider";
import { usePermissions } from "./auth/hooks/usePermissions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authProvider = useAuthProvider();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  useEffect(() => {
    if (!authProvider.loading && !isInitialized) {
      console.log("[AuthProvider] Initialization complete");
      setIsInitialized(true);
    }
    
    return () => console.log("[AuthProvider] Unmount");
  }, [authProvider.loading, isInitialized]);

  // Mostra estado de carregamento na primeira renderização
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authProvider}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
