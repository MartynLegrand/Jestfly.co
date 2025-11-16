
import React from 'react';
import { DemoFeedback } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Star, BarChart2 } from 'lucide-react';

interface FeedbackStatsProps {
  feedback: DemoFeedback[];
}

const FeedbackStats: React.FC<FeedbackStatsProps> = ({ feedback }) => {
  if (!feedback || feedback.length === 0) {
    return null;
  }

  // Calculate average rating
  const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = (totalRating / feedback.length).toFixed(1);
  
  // Count ratings by star value
  const ratingCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  
  feedback.forEach(item => {
    if (ratingCounts[item.rating as 1|2|3|4|5] !== undefined) {
      ratingCounts[item.rating as 1|2|3|4|5]++;
    }
  });
  
  // Find the max count for scaling
  const maxCount = Math.max(...Object.values(ratingCounts));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChart2 className="h-5 w-5 mr-2" />
          Feedback Statistics
        </CardTitle>
        <CardDescription>
          Based on {feedback.length} {feedback.length === 1 ? 'review' : 'reviews'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-3xl font-bold mr-2">{averageRating}</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(parseFloat(averageRating))
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center w-12">
                <span className="mr-1">{rating}</span>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${maxCount ? (ratingCounts[rating as 1|2|3|4|5] / maxCount) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8 text-right">
                {ratingCounts[rating as 1|2|3|4|5]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackStats;
