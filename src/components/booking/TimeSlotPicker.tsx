
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvailabilitySlot } from '@/types/booking';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  availableSlots: AvailabilitySlot[];
  selectedSlot: AvailabilitySlot | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  isLoading?: boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No available time slots for the selected date.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group slots by hour
  const groupedSlots: { [hour: string]: AvailabilitySlot[] } = {};
  
  availableSlots.forEach(slot => {
    const startTime = parseISO(slot.start_time);
    const hour = format(startTime, 'HH:00');
    
    if (!groupedSlots[hour]) {
      groupedSlots[hour] = [];
    }
    
    groupedSlots[hour].push(slot);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Available Time Slots</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(groupedSlots).sort().map(([hour, slots]) => (
            <div key={hour} className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" /> {hour}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {slots.map(slot => {
                  const startTime = parseISO(slot.start_time);
                  const endTime = parseISO(slot.end_time);
                  
                  return (
                    <Button
                      key={slot.id}
                      variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onSelectSlot(slot)}
                      className="justify-start text-left h-auto py-2"
                    >
                      <span>
                        {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotPicker;
