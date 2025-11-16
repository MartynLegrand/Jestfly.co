import React, { useMemo } from 'react';
import { useCanvas } from '@/context/canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameMonth, parseISO, subMonths, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { CanvasElement } from '@/types/canvas';
import { Calendar, CheckCircle, Clock, Milestone } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'milestone';
  status?: string;
  nodeId: string;
}

export const TimelineVisualizer: React.FC = () => {
  const { nodes } = useCanvas();
  
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    
    nodes.forEach(node => {
      if (!node.metadata) return;
      
      let date: string | undefined;
      if (node.type === 'milestone' && node.metadata.date) {
        date = node.metadata.date;
      } else if (node.type === 'task' && node.metadata.dueDate) {
        date = node.metadata.dueDate;
      }
      
      if (date) {
        events.push({
          id: `${node.id}-${date}`,
          title: node.title,
          date: new Date(date),
          type: node.type as 'task' | 'milestone',
          status: node.metadata.status,
          nodeId: node.id
        });
      }
    });
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [nodes]);
  
  // Group events by month
  const eventsByMonth = useMemo(() => {
    const grouped = new Map<string, TimelineEvent[]>();
    
    timelineEvents.forEach(event => {
      const monthKey = format(event.date, 'yyyy-MM');
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)?.push(event);
    });
    
    // Convert to sorted array of [monthKey, events]
    return Array.from(grouped.entries())
      .sort(([monthA], [monthB]) => {
        return new Date(monthA).getTime() - new Date(monthB).getTime();
      });
  }, [timelineEvents]);
  
  const getStatusColor = (event: TimelineEvent) => {
    if (event.status === 'completed') return 'bg-green-500';
    if (event.date < new Date()) return 'bg-red-500';
    return event.type === 'milestone' ? 'bg-purple-500' : 'bg-blue-500';
  };
  
  const getEventIcon = (event: TimelineEvent) => {
    if (event.status === 'completed') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (event.type === 'milestone') {
      return <Milestone className="h-4 w-4 text-purple-500" />;
    }
    if (event.date < new Date()) {
      return <Clock className="h-4 w-4 text-red-500" />;
    }
    return <Calendar className="h-4 w-4 text-blue-500" />;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Timeline</CardTitle>
        <CardDescription>Your journey visualized</CardDescription>
      </CardHeader>
      <CardContent className="relative overflow-x-auto">
        {timelineEvents.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No timeline events found. Add tasks and milestones with dates to your canvas.
          </div>
        ) : (
          <div className="min-w-full">
            {eventsByMonth.map(([monthKey, monthEvents]) => (
              <div key={monthKey} className="mb-8">
                <h3 className="font-medium text-sm mb-3 sticky left-0">
                  {format(new Date(monthKey), 'MMMM yyyy')}
                </h3>
                <div className="relative pl-5">
                  {/* Vertical timeline line */}
                  <div className="absolute top-0 left-2 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {monthEvents.map((event, index) => (
                    <div key={event.id} className="mb-4 relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-3 w-4 h-4 rounded-full ${getStatusColor(event)} z-10`}></div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 ml-3 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              {getEventIcon(event)}
                              <span className="ml-1">{format(event.date, 'EEE, MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <div className="text-xs uppercase font-medium">
                            {event.type === 'milestone' ? (
                              <span className="text-purple-600">Milestone</span>
                            ) : (
                              <span className="text-blue-600">Task</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
