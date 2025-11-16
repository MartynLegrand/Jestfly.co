
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Booking, BookingTypeInfo } from '@/types/booking';
import { 
  fetchBookingTypes, 
  fetchUserBookings, 
  fetchBookingById 
} from '@/lib/booking/bookingService';
import { useToast } from '@/hooks/use-toast';

export const useBookingTypes = () => {
  const [bookingTypes, setBookingTypes] = useState<BookingTypeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadBookingTypes = async () => {
      try {
        setLoading(true);
        const types = await fetchBookingTypes();
        setBookingTypes(types);
      } catch (err: any) {
        console.error('Error loading booking types:', err);
        setError(err.message || 'Failed to load booking types');
        toast({
          title: 'Error',
          description: 'Failed to load booking types. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookingTypes();
  }, [toast]);

  return { bookingTypes, loading, error };
};

export const useUserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadUserBookings = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userBookings = await fetchUserBookings(user.id);
        setBookings(userBookings);
      } catch (err: any) {
        console.error('Error loading user bookings:', err);
        setError(err.message || 'Failed to load bookings');
        toast({
          title: 'Error',
          description: 'Failed to load your bookings. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserBookings();
  }, [user, toast]);

  return { bookings, loading, error, refetch: () => { setLoading(true); } };
};

export const useBooking = (bookingId: string | undefined) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchBookingById(bookingId);
        setBooking(data);
      } catch (err: any) {
        console.error(`Error loading booking ${bookingId}:`, err);
        setError(err.message || 'Failed to load booking details');
        toast({
          title: 'Error',
          description: 'Failed to load booking details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, toast]);

  return { booking, loading, error, refetch: () => { setLoading(true); } };
};
