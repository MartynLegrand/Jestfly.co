
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Booking } from '@/types/booking';
import { useNavigate } from 'react-router-dom';

interface BookingListProps {
  bookings: Booking[];
  isLoading?: boolean;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No Bookings Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't made any bookings yet.
            </p>
            <Button onClick={() => navigate('/bookings/new')}>Book Now</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'canceled':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const startTime = parseISO(booking.start_time);
        const endTime = parseISO(booking.end_time);
        
        return (
          <Card key={booking.id} className="overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{booking.booking_type}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Booking #{booking.id.substring(0, 8)}
                </p>
              </div>
              <Badge variant={getBadgeVariant(booking.status)} className="capitalize">
                {booking.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span>{format(startTime, 'PPP')}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span>{format(startTime, 'p')} - {format(endTime, 'p')}</span>
                </div>
                
                {booking.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span>{booking.location}</span>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                >
                  <span>View Details</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BookingList;
