
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CanvasNode } from '@/types/canvas';

interface ElementEditDialogProps {
  isOpen: boolean;
  element: CanvasNode | null;
  onClose: () => void;
  onSave: (element: CanvasNode) => void;
}

export const ElementEditDialog: React.FC<ElementEditDialogProps> = ({
  isOpen,
  element,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  
  useEffect(() => {
    if (element) {
      setTitle(element.title);
      setContent(element.content || '');
      setMetadata(element.metadata || {});
    }
  }, [element]);
  
  const handleSave = () => {
    if (!element) return;
    
    const updatedElement: CanvasNode = {
      ...element,
      title,
      content,
      metadata,
    };
    
    onSave(updatedElement);
    onClose();
  };
  
  if (!element) return null;
  
  // Render different fields based on element type
  const renderElementTypeFields = () => {
    switch (element.type) {
      case 'task':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={metadata.status || 'pending'}
                onChange={(e) => setMetadata({ ...metadata, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={metadata.priority || 'medium'}
                onChange={(e) => setMetadata({ ...metadata, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={metadata.dueDate ? new Date(metadata.dueDate).toISOString().slice(0, 10) : ''}
                onChange={(e) => setMetadata({ ...metadata, dueDate: e.target.value })}
              />
            </div>
          </>
        );
      case 'milestone':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={metadata.date ? new Date(metadata.date).toISOString().slice(0, 10) : ''}
              onChange={(e) => setMetadata({ ...metadata, date: e.target.value })}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {element.type.charAt(0).toUpperCase() + element.type.slice(1)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          {(element.type === 'note' || element.type === 'task') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                rows={4}
              />
            </div>
          )}
          
          {renderElementTypeFields()}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
