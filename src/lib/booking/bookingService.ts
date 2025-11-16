
import { supabase } from '@/lib/supabase/client';
import { Booking, BookingTypeInfo, AvailabilitySlot, BookingPayment, BookingFormData } from '@/types/booking';

// Fetch all booking types
export const fetchBookingTypes = async (): Promise<BookingTypeInfo[]> => {
  const { data, error } = await supabase
    .from('booking_types')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching booking types:', error);
    throw error;
  }

  return data || [];
};

// Fetch booking type by ID
export const fetchBookingTypeById = async (id: string): Promise<BookingTypeInfo> => {
  const { data, error } = await supabase
    .from('booking_types')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching booking type with ID ${id}:`, error);
    throw error;
  }

  return data;
};

// Fetch bookings for a user
export const fetchUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }

  return data || [];
};

// Fetch a single booking by ID
export const fetchBookingById = async (id: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, user:user_id(id, username, display_name, avatar)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }

  return data;
};

// Check availability for a specific time and resource
export const checkAvailability = async (
  resourceId: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  // Check for any conflicting bookings
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('resource_id', resourceId)
    .not('status', 'eq', 'canceled')
    .or(`start_time.lte.${startTime},end_time.gt.${startTime}`)
    .or(`start_time.lt.${endTime},end_time.gte.${endTime}`)
    .or(`start_time.gte.${startTime},end_time.lte.${endTime}`);

  if (error) {
    console.error('Error checking availability:', error);
    throw error;
  }

  // If no conflicting bookings found, the slot is available
  return (data || []).length === 0;
};

// Fetch available slots for a specific day and resource
export const fetchAvailableSlots = async (
  resourceId: string,
  date: string
): Promise<AvailabilitySlot[]> => {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('resource_id', resourceId)
    .eq('is_available', true)
    .gte('start_time', `${date}T00:00:00`)
    .lte('start_time', `${date}T23:59:59`)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching available slots:', error);
    throw error;
  }

  return data || [];
};

// Create a new booking
export const createBooking = async (bookingData: {
  booking_type: string;
  user_id: string;
  resource_id: string;
  resource_type: string;
  start_time: string;
  end_time: string;
  price: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  location?: string;
  details?: string;
  notes?: string;
}): Promise<{ success: boolean; booking_id?: string; message?: string }> => {
  try {
    const { data, error } = await supabase.rpc('create_booking', {
      p_booking_type: bookingData.booking_type,
      p_user_id: bookingData.user_id,
      p_resource_id: bookingData.resource_id,
      p_resource_type: bookingData.resource_type,
      p_start_time: bookingData.start_time,
      p_end_time: bookingData.end_time,
      p_price: bookingData.price,
      p_customer_name: bookingData.customer_name,
      p_customer_email: bookingData.customer_email,
      p_customer_phone: bookingData.customer_phone,
      p_location: bookingData.location,
      p_details: bookingData.details,
      p_notes: bookingData.notes
    });

    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, message: error.message };
    }

    return { success: true, booking_id: data.booking_id };
  } catch (error: any) {
    console.error('Exception creating booking:', error);
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  status: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId);

  if (error) {
    console.error(`Error updating booking ${bookingId} status:`, error);
    return false;
  }

  return true;
};

// Create booking payment
export const createBookingPayment = async (
  bookingId: string,
  amount: number,
  paymentMethod: string
): Promise<BookingPayment | null> => {
  const { data, error } = await supabase
    .from('booking_payments')
    .insert({
      booking_id: bookingId,
      amount,
      payment_method: paymentMethod,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating booking payment:', error);
    return null;
  }

  return data;
};

// Process payment with JestCoin
export const processJestCoinPayment = async (
  userId: string,
  bookingId: string,
  amount: number
): Promise<{ success: boolean; message: string; transaction_id?: string }> => {
  // For demonstration, we're using a mock payment process
  // In a real implementation, this would connect to the transferJestCoins function
  
  try {
    // This would typically call the transferJestCoins function from walletService
    // For now, we'll simulate the payment process
    
    // Update the payment record
    const { data, error } = await supabase
      .from('booking_payments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment status:', error);
      return { success: false, message: 'Payment processing failed' };
    }

    // Update booking status to confirmed
    await updateBookingStatus(bookingId, 'confirmed');

    return {
      success: true,
      message: `Payment of ${amount} JestCoins processed successfully`,
      transaction_id: data.id
    };
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return { success: false, message: error.message || 'Payment processing failed' };
  }
};

// Fetch booking payments
export const fetchBookingPayments = async (bookingId: string): Promise<BookingPayment[]> => {
  const { data, error } = await supabase
    .from('booking_payments')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching booking payments:', error);
    throw error;
  }

  return data || [];
};
