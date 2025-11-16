
import React, { useState } from 'react';
import { DemoFeedback, DemoSubmission } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Activity } from 'lucide-react';

interface FeedbackAnalysisProps {
  submission: DemoSubmission;
  feedback: DemoFeedback[];
  isAdmin: boolean;
}

const FeedbackAnalysis: React.FC<FeedbackAnalysisProps> = ({ submission, feedback, isAdmin }) => {
  // Only show this component for admins
  if (!isAdmin || feedback.length === 0) {
    return null;
  }

  // Extract common feedback themes (simplified example)
  const getCommonThemes = () => {
    const keywords = {
      production: ['mix', 'production', 'quality', 'sound', 'mastering'],
      melody: ['melody', 'hook', 'catchy', 'tune'],
      lyrics: ['lyrics', 'message', 'story', 'words'],
      structure: ['structure', 'arrangement', 'composition'],
      originality: ['original', 'unique', 'creative', 'innovative']
    };
    
    const themes: Record<string, number> = {
      production: 0,
      melody: 0,
      lyrics: 0,
      structure: 0,
      originality: 0
    };
    
    feedback.forEach(item => {
      const comment = item.comment.toLowerCase();
      
      Object.entries(keywords).forEach(([theme, words]) => {
        if (words.some(word => comment.includes(word))) {
          themes[theme]++;
        }
      });
    });
    
    return themes;
  };
  
  const themes = getCommonThemes();
  
  // Calculate feedback over time (simplified)
  const getFeedbackTimeline = () => {
    const sortedFeedback = [...feedback].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    return sortedFeedback.map((item, index) => ({
      date: new Date(item.created_at).toLocaleDateString(),
      rating: item.rating,
      cumulative: sortedFeedback
        .slice(0, index + 1)
        .reduce((sum, f) => sum + f.rating, 0) / (index + 1)
    }));
  };
  
  const timeline = getFeedbackTimeline();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Feedback Analysis
        </CardTitle>
        <CardDescription>
          Detailed analysis of feedback for "{submission.title}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="themes">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="themes">
              <BarChart className="h-4 w-4 mr-2" />
              Common Themes
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <LineChart className="h-4 w-4 mr-2" />
              Feedback Timeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="themes">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Most commonly mentioned aspects in feedback:
              </p>
              
              {Object.entries(themes).map(([theme, count]) => (
                <div key={theme} className="flex items-center gap-2">
                  <div className="w-24 capitalize">{theme}</div>
                  <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(count / feedback.length) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count} {count === 1 ? 'mention' : 'mentions'}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Feedback ratings over time:
              </p>
              
              <div className="h-40 relative mt-4">
                {/* Simple visualization of timeline */}
                <div className="absolute inset-0 flex items-end">
                  {timeline.map((item, index) => (
                    <div 
                      key={index}
                      className="flex-1 bg-primary mx-0.5 rounded-t"
                      style={{ 
                        height: `${(item.rating / 5) * 100}%`,
                        opacity: 0.7 + (0.3 * index / timeline.length)
                      }}
                      title={`${item.date}: Rating ${item.rating}`}
                    />
                  ))}
                </div>
                
                {/* Line for average rating */}
                <div 
                  className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                  style={{ 
                    bottom: `${(timeline[timeline.length - 1]?.cumulative || 0) / 5 * 100}%` 
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{timeline[0]?.date || 'N/A'}</span>
                <span>{timeline[timeline.length - 1]?.date || 'N/A'}</span>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Current average:</span> 
                  {' '}
                  {timeline[timeline.length - 1]?.cumulative.toFixed(1) || 'N/A'}/5
                </div>
                <div className="text-sm">
                  <span className="font-medium">Total reviews:</span> 
                  {' '}
                  {feedback.length}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackAnalysis;
