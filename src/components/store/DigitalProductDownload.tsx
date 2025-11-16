
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  getDigitalProductDetails, 
  registerDigitalProductDownload 
} from "@/lib/store/productService";

interface DigitalProductDownloadProps {
  productId: string;
  orderId: string;
}

const DigitalProductDownload = ({ productId, orderId }: DigitalProductDownloadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  
  const handleDownload = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to download this product.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get digital product details
      const digitalProduct = await getDigitalProductDetails(productId);
      
      if (!digitalProduct || !digitalProduct.file_path) {
        throw new Error("Digital product not found or no file available");
      }
      
      // Log download
      await registerDigitalProductDownload(productId, user.id, orderId);
      
      // Trigger download
      const link = document.createElement("a");
      link.href = digitalProduct.file_path;
      link.download = digitalProduct.file_path.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloaded(true);
      toast({
        title: "Download started",
        description: "Your download has started. If not, click the button again.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Could not download file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="my-4 p-4 rounded-lg bg-muted/50">
      <h3 className="text-lg font-medium mb-2">Digital Product</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click the button below to download your digital product.
      </p>
      <Button 
        onClick={handleDownload}
        disabled={isLoading}
        className={isDownloaded ? "bg-green-600 hover:bg-green-700" : ""}
      >
        <Download className="mr-2 h-4 w-4" />
        {isLoading ? "Processing..." : isDownloaded ? "Downloaded" : "Download Now"}
      </Button>
    </div>
  );
};

export default DigitalProductDownload;
