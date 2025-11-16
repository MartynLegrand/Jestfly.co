
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DemoSubmission } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, MessageSquare, User, Calendar } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import EnhancedFeedbackInterface from './feedback/EnhancedFeedbackInterface';
import FeedbackAnalysis from './feedback/FeedbackAnalysis';
import { useDemoFeedback } from '@/hooks/use-demo-feedback';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface DemoDetailsViewProps {
  submission: DemoSubmission;
}

const DemoDetailsView: React.FC<DemoDetailsViewProps> = ({ submission }) => {
  const { user } = useAuth();
  const { feedback, isLoading } = useDemoFeedback(submission.id);
  
  const isAdmin = user?.profile?.profile_type === 'admin';
  const isOwner = user?.id === submission.user_id;
  
  // Format the submission date
  const formattedDate = new Date(submission.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const renderStatusBadge = () => {
    switch(submission.status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>{submission.title}</CardTitle>
              <CardDescription>
                By {submission.artist_name} • {formattedDate}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {renderStatusBadge()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="demo" className="space-y-4">
            <TabsList>
              <TabsTrigger value="demo">
                <Music className="h-4 w-4 mr-2" />
                Demo
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="artist">
                <User className="h-4 w-4 mr-2" />
                Artist
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="space-y-4">
              <div className="rounded-md overflow-hidden border">
                <AudioPlayer 
                  src={submission.audio_url} 
                  title={submission.title} 
                  artist={submission.artist_name}
                />
              </div>
              
              {submission.additional_audio_urls && submission.additional_audio_urls.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h3 className="text-sm font-medium">Additional Tracks</h3>
                  {submission.additional_audio_urls.map((url, index) => (
                    <div key={index} className="rounded-md overflow-hidden border">
                      <AudioPlayer 
                        src={url} 
                        title={`${submission.title} - Track ${index + 2}`} 
                        artist={submission.artist_name}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {submission.genre && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium">Genre</h3>
                  <p className="text-muted-foreground">{submission.genre}</p>
                </div>
              )}
              
              {submission.categories && submission.categories.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {submission.categories.map(category => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="feedback">
              <EnhancedFeedbackInterface submission={submission} />
              <FeedbackAnalysis 
                submission={submission} 
                feedback={feedback} 
                isAdmin={isAdmin}
              />
            </TabsContent>
            
            <TabsContent value="artist">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Artist Name</h3>
                  <p className="text-muted-foreground">{submission.artist_name}</p>
                </div>
                
                {submission.biography && (
                  <div>
                    <h3 className="text-sm font-medium">Biography</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{submission.biography}</p>
                  </div>
                )}
                
                {submission.social_links && Object.keys(submission.social_links).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium">Social Media</h3>
                    <ul className="list-disc pl-5 mt-1">
                      {Object.entries(submission.social_links).map(([platform, url]) => (
                        <li key={platform}>
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline"
                          >
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium">Submitted</h3>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formattedDate}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoDetailsView;
