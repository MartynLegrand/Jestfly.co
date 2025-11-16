
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";

const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient text-white">
      <Container className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to join the future of music?</h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Sign up today and be part of a revolutionary platform where artists and fans create value together.
        </p>
        <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
          <Link to="/register">Create Your Account</Link>
        </Button>
      </Container>
    </section>
  );
};

export default CtaSection;
