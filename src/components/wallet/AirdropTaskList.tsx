
import React, { useState } from "react";
import { AirdropTask, AirdropSubmission } from "@/types/rewards";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ExternalLink, Award, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitAirdropTask } from "@/lib/rewards/rewardsService";

interface AirdropTaskListProps {
  tasks: AirdropTask[];
  userSubmissions: AirdropSubmission[];
  userId: string;
  onRefresh: () => void;
}

const AirdropTaskList: React.FC<AirdropTaskListProps> = ({ 
  tasks, 
  userSubmissions, 
  userId,
  onRefresh
}) => {
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<AirdropTask | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofDescription, setProofDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a map of tasks that the user has already submitted
  const submittedTasksMap = new Map(
    userSubmissions.map(submission => [submission.task_id, submission])
  );

  const handleSubmitProof = async () => {
    if (!selectedTask || !proofUrl) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await submitAirdropTask(userId, selectedTask.id, proofUrl);
      
      if (success) {
        toast({
          title: "Proof submitted successfully",
          description: "Your submission will be reviewed shortly.",
          variant: "default",
        });
        setSelectedTask(null);
        setProofUrl("");
        setProofDescription("");
        onRefresh();
      } else {
        toast({
          title: "Failed to submit proof",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting proof:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (submission: AirdropSubmission) => {
    switch (submission.status) {
      case 'approved':
        return (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded text-xs flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-2 py-1 rounded text-xs flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </div>
        );
      default:
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded text-xs flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </div>
        );
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted-foreground">No airdrop tasks available at the moment.</p>
        <p className="text-sm text-muted-foreground mt-1">Check back later for new opportunities!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => {
          const submission = submittedTasksMap.get(task.id);
          const isSubmitted = !!submission;
          
          return (
            <GlassCard key={task.id} className="p-4">
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                    ${isSubmitted 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary text-secondary-foreground'}`}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{task.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <span className="capitalize">{task.platform}</span>
                      {task.platform && (
                        <span className="flex items-center ml-2 text-xs bg-secondary px-2 py-0.5 rounded">
                          {task.task_type}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-medium text-lg">+{task.reward_amount} JC</div>
                  
                  {isSubmitted ? (
                    getStatusBadge(submission)
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedTask(task)}
                      className="mt-1"
                    >
                      Submit Proof
                    </Button>
                  )}
                </div>
              </div>
              
              {isSubmitted && submission.proof_url && (
                <div className="mt-3 text-xs flex items-center text-muted-foreground">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <a 
                    href={submission.proof_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Submitted Proof
                  </a>
                </div>
              )}
              
              <p className="text-sm mt-2">{task.description}</p>
            </GlassCard>
          );
        })}
      </div>
      
      {/* Proof submission dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Proof for {selectedTask?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="proof-url">Proof URL</Label>
              <Input
                id="proof-url"
                placeholder="https://"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Provide a link to your post, tweet, screenshot, or other proof
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proof-description">Additional Details (Optional)</Label>
              <Textarea
                id="proof-description"
                placeholder="Describe your submission..."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTask(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitProof} 
              disabled={isSubmitting || !proofUrl}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                'Submit Proof'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AirdropTaskList;
