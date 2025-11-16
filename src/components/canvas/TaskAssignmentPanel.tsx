import React, { useState, useEffect } from 'react';
import { useCanvas } from '@/context/canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

interface TaskAssignmentPanelProps {
  nodeId: string | null;
  teamMembers: TeamMember[];
}

export const TaskAssignmentPanel: React.FC<TaskAssignmentPanelProps> = ({ nodeId, teamMembers }) => {
  const { nodes, updateNodeData } = useCanvas();
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<string>('medium');
  const [status, setStatus] = useState<string>('pending');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const selectedNode = nodeId ? nodes.find(node => node.id === nodeId) : null;

  useEffect(() => {
    if (selectedNode && selectedNode.metadata) {
      setAssignedTo(selectedNode.metadata.assignedTo || '');
      setStatus(selectedNode.metadata.status || 'pending');
      setPriority(selectedNode.metadata.priority || 'medium');
      
      if (selectedNode.metadata.dueDate) {
        setDueDate(new Date(selectedNode.metadata.dueDate));
      } else {
        setDueDate(undefined);
      }
    } else {
      // Reset form if no node is selected
      setAssignedTo('');
      setDueDate(undefined);
      setPriority('medium');
      setStatus('pending');
    }
  }, [selectedNode]);

  const handleSave = async () => {
    if (!nodeId) return;

    const updatedMetadata = {
      ...(selectedNode?.metadata || {}),
      assignedTo,
      status,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : undefined
    };

    await updateNodeData(nodeId, { metadata: updatedMetadata });
  };

  if (!nodeId || !selectedNode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Assignment</CardTitle>
          <CardDescription>Select a task to assign</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          No task selected
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Assignment</CardTitle>
        <CardDescription>{selectedNode.title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Assigned To</label>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {teamMembers.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex items-center">
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-6 h-6 rounded-full mr-2" 
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 mr-2" />
                    )}
                    {member.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setDueDate(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="w-full" onClick={handleSave}>
          Save Assignment
        </Button>
      </CardContent>
    </Card>
  );
};
