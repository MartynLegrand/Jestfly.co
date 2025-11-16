
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowLeft, Upload, ImagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(1, {
    message: "Price must be at least 1 JC.",
  }).optional(),
  collectionId: z.string().optional(),
  royaltyPercentage: z.coerce.number().min(0).max(25).default(0),
  isForSale: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const NFTMint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: collections } = useQuery({
    queryKey: ["nft-collections", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nft_collections")
        .select("*")
        .eq("creator_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      collectionId: undefined,
      royaltyPercentage: 0,
      isForSale: false,
    },
  });

  const watchIsForSale = form.watch("isForSale");

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: FormData) => {
    if (!mediaFile) {
      toast({
        title: "Media Required",
        description: "Please upload media for your NFT",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload media file
      const timestamp = Date.now();
      const mediaFileExt = mediaFile.name.split(".").pop();
      const mediaFileName = `${user?.id}/nfts/${timestamp}_media.${mediaFileExt}`;
      
      const { error: mediaUploadError, data: mediaUploadData } = await supabase.storage
        .from("assets")
        .upload(mediaFileName, mediaFile);

      if (mediaUploadError) throw mediaUploadError;

      // Get public URL for media
      const { data: mediaPublicUrlData } = supabase.storage
        .from("assets")
        .getPublicUrl(mediaFileName);

      const mediaUrl = mediaPublicUrlData.publicUrl;

      // Upload thumbnail if provided, otherwise use media
      let thumbnailUrl = mediaUrl;
      if (thumbnailFile) {
        const thumbnailFileExt = thumbnailFile.name.split(".").pop();
        const thumbnailFileName = `${user?.id}/nfts/${timestamp}_thumbnail.${thumbnailFileExt}`;
        
        const { error: thumbnailUploadError, data: thumbnailUploadData } = await supabase.storage
          .from("assets")
          .upload(thumbnailFileName, thumbnailFile);

        if (thumbnailUploadError) throw thumbnailUploadError;

        // Get public URL for thumbnail
        const { data: thumbnailPublicUrlData } = supabase.storage
          .from("assets")
          .getPublicUrl(thumbnailFileName);

        thumbnailUrl = thumbnailPublicUrlData.publicUrl;
      }

      // Create NFT record
      const nftData = {
        title: values.title,
        description: values.description || "",
        creator_id: user?.id,
        owner_id: user?.id,
        collection_id: values.collectionId || null,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        type: getMediaType(mediaFile.type),
        price: values.isForSale ? values.price : null,
        is_for_sale: values.isForSale,
        royalty_percentage: values.royaltyPercentage,
      };

      const { data: nft, error: nftInsertError } = await supabase
        .from("nfts")
        .insert(nftData)
        .select()
        .single();

      if (nftInsertError) throw nftInsertError;

      toast({
        title: "NFT Created",
        description: "Your NFT has been minted successfully!",
      });

      // Redirect to the new NFT page
      navigate(`/nft/${nft.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Determine media type based on MIME type
  const getMediaType = (mimeType: string): "image" | "video" | "audio" | "3d_model" => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.includes("gltf") || mimeType.includes("glb")) return "3d_model";
    return "image"; // Default to image
  };

  if (!user) {
    return (
      <div className="min-h-screen py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
            <p className="mb-6">Please log in to create an NFT.</p>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <Container>
        <div className="mb-6">
          <Link to="/nft-gallery" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create New NFT</h1>
          <p className="text-muted-foreground mb-8">
            Mint a unique digital asset to showcase and sell on JestFly
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col space-y-4">
              <div className="border rounded-lg aspect-square flex items-center justify-center overflow-hidden bg-background/50 backdrop-blur-sm">
                {mediaPreview ? (
                  <img 
                    src={mediaPreview} 
                    alt="Media preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-6">
                    <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Upload your NFT file (image, video, audio, or 3D model)
                    </p>
                  </div>
                )}
              </div>
              <label className="w-full">
                <Button className="w-full" type="button" variant="outline" asChild>
                  <div className="flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Upload Media File</span>
                    <Input 
                      type="file" 
                      className="hidden"
                      onChange={handleMediaChange}
                      accept="image/*,video/*,audio/*,.glb,.gltf"
                    />
                  </div>
                </Button>
              </label>
              
              <div className="border rounded-lg h-32 flex items-center justify-center overflow-hidden bg-background/50 backdrop-blur-sm">
                {thumbnailPreview ? (
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-6">
                    <ImagePlus className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Upload a thumbnail (optional)
                    </p>
                  </div>
                )}
              </div>
              <label className="w-full">
                <Button className="w-full" type="button" variant="outline" size="sm" asChild>
                  <div className="flex items-center justify-center">
                    <Upload className="h-3 w-3 mr-2" />
                    <span>Upload Thumbnail</span>
                    <Input 
                      type="file" 
                      className="hidden"
                      onChange={handleThumbnailChange}
                      accept="image/*"
                    />
                  </div>
                </Button>
              </label>
            </div>

            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a title for your NFT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your NFT" 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a collection (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {collections?.map((collection) => (
                              <SelectItem 
                                key={collection.id} 
                                value={collection.id}
                              >
                                {collection.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="royaltyPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator Royalty (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            max="25"
                            step="0.1"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Percentage you receive on secondary sales (0-25%)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isForSale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            List for Sale
                          </FormLabel>
                          <FormDescription>
                            Make this NFT available for purchase
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchIsForSale && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (JC)*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              step="0.1"
                              placeholder="Set a price in JestCoin"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isUploading}
                  >
                    {isUploading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create NFT
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NFTMint;
