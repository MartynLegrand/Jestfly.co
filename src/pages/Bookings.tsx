
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  CalendarRange, 
  Clock, 
  Plus, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserBookings } from '@/hooks/use-bookings';
import { useNavigate } from 'react-router-dom';
import BookingList from '@/components/booking/BookingList';

const BookingsPage: React.FC = () => {
  const { bookings, loading, refetch } = useUserBookings();
  const navigate = useNavigate();
  
  const upcomingBookings = bookings.filter(booking => booking.status !== 'canceled' && booking.status !== 'completed');
  const pastBookings = bookings.filter(booking => booking.status === 'completed');
  const canceledBookings = bookings.filter(booking => booking.status === 'canceled');

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your studio sessions, consultations and event bookings
          </p>
        </div>
        <Button onClick={() => navigate('/bookings/new')}>
          <Plus className="h-4 w-4 mr-1.5" />
          New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
          <div className="bg-card rounded-lg border shadow-sm p-4 space-y-4">
            <h3 className="font-medium text-lg">Quick Actions</h3>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/bookings/new')}>
                <Plus className="h-4 w-4 mr-1.5" />
                New Booking
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => refetch()}>
                <Clock className="h-4 w-4 mr-1.5" />
                Refresh Bookings
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/bookings/manage')}>
                <Settings className="h-4 w-4 mr-1.5" />
                Manage Bookings
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/bookings/calendar')}>
                <CalendarRange className="h-4 w-4 mr-1.5" />
                Calendar View
              </Button>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="canceled">Canceled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-4">
              <BookingList bookings={upcomingBookings} isLoading={loading} />
            </TabsContent>
            
            <TabsContent value="past" className="mt-4">
              <BookingList bookings={pastBookings} isLoading={loading} />
            </TabsContent>
            
            <TabsContent value="canceled" className="mt-4">
              <BookingList bookings={canceledBookings} isLoading={loading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingsPage;
