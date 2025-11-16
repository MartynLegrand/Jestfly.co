
import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";

const Footer = () => {
  return (
    <footer className="py-10 border-t">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center font-display text-xl font-bold">
              <span className="text-gradient mr-2">JEST</span>
              <span>FLY</span>
            </Link>
          </div>
          
          <div className="flex gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/community" className="text-muted-foreground hover:text-foreground">Community</Link>
            <Link to="/store" className="text-muted-foreground hover:text-foreground">Store</Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground">Login</Link>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JESTFLY. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
