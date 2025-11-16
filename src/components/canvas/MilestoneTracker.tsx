import React, { useMemo } from 'react';
import { useCanvas } from '@/context/canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, CheckCircle, Circle, Clock } from 'lucide-react';
import { format, isAfter, isBefore, isPast, parseISO } from 'date-fns';
import { CanvasElement } from '@/types/canvas';

interface MilestoneWithDueDate extends CanvasElement {
  dueDate?: string;
  status?: string;
}

export const MilestoneTracker: React.FC = () => {
  const { nodes } = useCanvas();
  
  const milestones = useMemo(() => {
    return nodes
      .filter(node => 
        node.type === 'milestone' && 
        node.metadata && 
        (node.metadata.date || node.metadata.dueDate)
      )
      .map(node => ({
        ...node,
        dueDate: node.metadata?.date || node.metadata?.dueDate,
        status: node.metadata?.status || 'pending'
      }))
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }) as MilestoneWithDueDate[];
  }, [nodes]);

  const upcomingMilestones = useMemo(() => 
    milestones.filter(m => 
      m.dueDate && !isPast(new Date(m.dueDate)) && m.status !== 'completed'
    ).slice(0, 3)
  , [milestones]);

  const recentMilestones = useMemo(() => 
    milestones.filter(m => 
      m.status === 'completed' || (m.dueDate && isPast(new Date(m.dueDate)))
    ).slice(0, 3)
  , [milestones]);

  const getMilestoneStatusColor = (milestone: MilestoneWithDueDate) => {
    if (milestone.status === 'completed') return 'bg-green-500';
    if (!milestone.dueDate) return 'bg-gray-500';
    
    const dueDate = new Date(milestone.dueDate);
    if (isPast(dueDate)) return 'bg-red-500';
    
    // If due date is within 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    if (isBefore(dueDate, sevenDaysFromNow)) return 'bg-yellow-500';
    
    return 'bg-blue-500';
  };

  const getMilestoneIcon = (milestone: MilestoneWithDueDate) => {
    if (milestone.status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (!milestone.dueDate) return <Circle className="h-4 w-4 text-gray-500" />;
    
    const dueDate = new Date(milestone.dueDate);
    if (isPast(dueDate)) return <Clock className="h-4 w-4 text-red-500" />;
    
    return <Calendar className="h-4 w-4 text-blue-500" />;
  };

  const renderMilestoneItem = (milestone: MilestoneWithDueDate) => (
    <div key={milestone.id} className="flex items-start space-x-3 pb-3 pt-2 border-b last:border-b-0">
      <div className={`mt-1 w-3 h-3 rounded-full ${getMilestoneStatusColor(milestone)}`}></div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{milestone.title}</h4>
          {milestone.status === 'completed' && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Completed
            </Badge>
          )}
        </div>
        {milestone.dueDate && (
          <p className="text-xs text-gray-500 flex items-center mt-1">
            {getMilestoneIcon(milestone)}
            <span className="ml-1">
              {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
            </span>
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-purple-500" />
          Milestone Tracker
        </CardTitle>
        <CardDescription>
          Track upcoming and completed milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {milestones.length === 0 ? (
          <div className="px-6 py-4 text-center text-muted-foreground">
            No milestones found. Add milestone nodes to your canvas.
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y">
            <div className="px-6 py-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Upcoming Milestones
              </h3>
              {upcomingMilestones.length > 0 ? (
                upcomingMilestones.map(renderMilestoneItem)
              ) : (
                <p className="text-xs text-muted-foreground py-2">No upcoming milestones</p>
              )}
            </div>

            <div className="px-6 py-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Recent Milestones
              </h3>
              {recentMilestones.length > 0 ? (
                recentMilestones.map(renderMilestoneItem)
              ) : (
                <p className="text-xs text-muted-foreground py-2">No recent milestones</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
