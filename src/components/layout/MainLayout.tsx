
import React from "react";
import Header from "@/components/layout/Header";
import Container from "@/components/ui/Container";

interface MainLayoutProps {
  children: React.ReactNode;
  containerClassName?: string;
  fullWidth?: boolean;
  hideHeader?: boolean;
}

const MainLayout = ({ 
  children, 
  containerClassName = "py-8", 
  fullWidth = false,
  hideHeader = false
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-1">
        {fullWidth ? (
          children
        ) : (
          <Container className={containerClassName}>
            {children}
          </Container>
        )}
      </main>
    </div>
  );
};

export default MainLayout;
