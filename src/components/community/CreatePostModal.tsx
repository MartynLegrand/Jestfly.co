
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreatePostForm from "./CreatePostForm";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostModal = ({ open, onOpenChange }: CreatePostModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <CreatePostForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
