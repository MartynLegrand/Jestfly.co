
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPost } from "@/lib/community/postService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/types/community";

interface CreatePostFormProps {
  onSuccess?: (post: Post) => void;
  onCancel?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("none"); // Changed from empty string to "none"
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create a post",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your post",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postData = {
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        category: category === "none" ? undefined : category,
      };
      
      const newPost = await createPost(postData);
      
      toast({
        title: "Post created!",
        description: "Your post has been published successfully",
      });
      
      if (onSuccess) {
        onSuccess(newPost);
      }
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("none");
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message || "There was a problem creating your post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Give your post a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category (optional)</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="artist">Artist</SelectItem>
            <SelectItem value="collaboration">Collaboration</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="discussion">Discussion</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="What would you like to share?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
