
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";

const NotFound = () => {
  useEffect(() => {
    console.log("NotFound page mounted");
    return () => console.log("NotFound page unmounted");
  }, []);

  console.log("Rendering NotFound page");
  
  return (
    <>
      <Helmet>
        <title>Page Not Found | JESTFLY</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Container className="text-center py-20">
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <Button asChild size="lg" className="font-medium">
            <Link to="/">Return to Home</Link>
          </Button>
        </Container>
      </div>
    </>
  );
};

export default NotFound;
