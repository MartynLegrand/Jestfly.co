
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { useBooking } from '@/hooks/use-bookings';
import { updateBookingStatus } from '@/lib/booking/bookingService';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  FileText,
  ArrowLeft,
  X,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { booking, loading, error, refetch } = useBooking(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (!booking) return;
    
    setIsCancelling(true);
    
    try {
      const result = await updateBookingStatus(booking.id, 'canceled');
      
      if (result) {
        toast({
          title: 'Booking Canceled',
          description: 'Your booking has been successfully canceled.',
        });
        refetch();
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Error canceling booking:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel booking',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
      setCancellationDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading booking details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !booking) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The booking you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/bookings')}>
            Return to Bookings
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPP'); // Example: April 29, 2023
  };
  
  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'p'); // Example: 12:00 PM
  };
  
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
    <MainLayout>
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => navigate('/bookings')}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Bookings
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {booking.booking_type}
            </h1>
            <p className="text-muted-foreground">
              Booking ID: {booking.id.substring(0, 8)}
            </p>
          </div>
          
          <Badge variant={getBadgeVariant(booking.status)} className="capitalize">
            {booking.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p>{formatDate(booking.start_time)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
                  </div>
                </div>
                
                {booking.location && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p>{booking.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Name</p>
                    <p>{booking.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p>{booking.customer_email}</p>
                  </div>
                </div>
                
                {booking.customer_phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>{booking.customer_phone}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {booking.notes && (
                <div className="flex items-start pt-2">
                  <FileText className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notes</p>
                    <p>{booking.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">${booking.price}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {booking.status === 'confirmed' || booking.status === 'completed' ? 'Paid' : 'Pending'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">JestCoin</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.status === 'confirmed' && (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => setCancellationDialogOpen(true)}
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Cancel Booking
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.print()}
              >
                Print Details
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/bookings/${booking.id}/reschedule`)}
              >
                Reschedule
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-0">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Booking created on:</p>
                <p>{format(parseISO(booking.created_at), 'PPp')}</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Dialog open={cancellationDialogOpen} onOpenChange={setCancellationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isCancelling}>
                Nevermind
              </Button>
            </DialogClose>
            <Button 
              onClick={(e) => {
                e.preventDefault();
                handleCancelBooking();
              }}
              variant="destructive"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-1.5" />
                  Cancel Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default BookingDetailPage;
