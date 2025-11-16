
import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AvailabilitySlot } from '@/types/booking';

interface BookingCalendarProps {
  availableSlots?: AvailabilitySlot[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isLoading?: boolean;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  availableSlots = [],
  selectedDate,
  onDateChange,
  isLoading = false
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Create an array of dates that have available slots
  const availableDates = availableSlots.map(slot => {
    return parseISO(slot.start_time).toDateString();
  });

  // Function to check if a date has available slots
  const hasAvailableSlots = (date: Date): boolean => {
    return availableDates.includes(date.toDateString());
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-2 sm:p-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousMonth}
            className="flex items-center justify-center h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextMonth}
            className="flex items-center justify-center h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border"
          modifiers={{
            available: (date) => hasAvailableSlots(date),
          }}
          modifiersClassNames={{
            available: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
          }}
          disabled={{ before: new Date() }}
        />
        
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;
