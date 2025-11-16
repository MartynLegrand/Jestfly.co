
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Calendar, Clock, MapPin, User, Mail, Phone, FileText } from 'lucide-react';
import { Booking } from '@/types/booking';
import { useNavigate } from 'react-router-dom';

interface BookingConfirmationProps {
  booking: Booking;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPP'); // Example: April 29, 2023
  };
  
  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'p'); // Example: 12:00 PM
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
        </div>
        <CardTitle className="text-xl">Booking Confirmed</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your booking has been successfully confirmed. We've sent a confirmation email with all details.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Booking Details</h3>
          <div className="text-sm space-y-2">
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Date</p>
                <p>{formatDate(booking.start_time)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Time</p>
                <p>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
              </div>
            </div>
            
            {booking.location && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p>{booking.location}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Your Information</h3>
          <div className="text-sm space-y-2">
            <div className="flex items-start">
              <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Name</p>
                <p>{booking.customer_name}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p>{booking.customer_email}</p>
              </div>
            </div>
            
            {booking.customer_phone && (
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>{booking.customer_phone}</p>
                </div>
              </div>
            )}
            
            {booking.notes && (
              <div className="flex items-start">
                <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Notes</p>
                  <p>{booking.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Payment Information</h3>
          <div className="text-sm">
            <p>Total Amount: <span className="font-medium">${booking.price}</span></p>
            <p>Status: <span className="text-green-600 dark:text-green-400 font-medium">Paid</span></p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          variant="default"
          className="w-full"
          onClick={() => navigate('/bookings')}
        >
          View All Bookings
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
