
import React, { useState, useEffect } from 'react';
import { format, addMinutes, parseISO } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useBookingTypes } from '@/hooks/use-bookings';
import { 
  fetchAvailableSlots, 
  createBooking, 
  createBookingPayment
} from '@/lib/booking/bookingService';
import { 
  BookingTypeInfo, 
  AvailabilitySlot,
  BookingFormData 
} from '@/types/booking';
import BookingTypeCard from '@/components/booking/BookingTypeCard';
import BookingCalendar from '@/components/booking/BookingCalendar';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import BookingForm from '@/components/booking/BookingForm';
import BookingPaymentFlow from '@/components/booking/BookingPaymentFlow';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

const NewBookingPage: React.FC = () => {
  const [step, setStep] = useState<'type' | 'date' | 'form' | 'payment' | 'confirmation'>('type');
  const [selectedType, setSelectedType] = useState<BookingTypeInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [bookingFormData, setBookingFormData] = useState<BookingFormData | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  
  const { bookingTypes, loading: typesLoading } = useBookingTypes();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Group booking types by category
  const bookingTypesByCategory: Record<string, BookingTypeInfo[]> = {};
  bookingTypes.forEach(type => {
    if (!bookingTypesByCategory[type.category]) {
      bookingTypesByCategory[type.category] = [];
    }
    bookingTypesByCategory[type.category].push(type);
  });
  
  // Load available slots when date changes
  useEffect(() => {
    if (step === 'date' && selectedType) {
      loadAvailableSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, step]);
  
  const loadAvailableSlots = async () => {
    if (!selectedType) return;
    
    setSlotsLoading(true);
    try {
      // For demo purposes, we'll generate some fake slots
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const slots = await fetchAvailableSlots(selectedType.id, formattedDate);
      
      // If no slots returned from backend, generate some demo slots
      if (slots.length === 0) {
        const demoSlots: AvailabilitySlot[] = [];
        const startHour = 9; // 9 AM
        const endHour = 17; // 5 PM
        
        for (let hour = startHour; hour < endHour; hour++) {
          const slotDate = new Date(selectedDate);
          slotDate.setHours(hour, 0, 0, 0);
          
          demoSlots.push({
            id: `demo-slot-${hour}`,
            resource_id: selectedType.id,
            resource_type: selectedType.category,
            start_time: slotDate.toISOString(),
            end_time: addMinutes(slotDate, selectedType.duration).toISOString(),
            is_available: true,
            created_at: new Date().toISOString()
          });
        }
        
        setAvailableSlots(demoSlots);
      } else {
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      toast({
        title: 'Error',
        description: 'Failed to load available time slots',
        variant: 'destructive',
      });
    } finally {
      setSlotsLoading(false);
    }
  };
  
  const handleTypeSelect = (type: BookingTypeInfo) => {
    setSelectedType(type);
    setStep('date');
  };
  
  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };
  
  const handleFormSubmit = (data: BookingFormData) => {
    setBookingFormData(data);
    setStep('payment');
  };
  
  const handlePaymentComplete = async (paymentId: string) => {
    if (!user?.id || !selectedType || !selectedSlot || !bookingFormData) return;
    
    setIsProcessing(true);
    
    try {
      // Calculate end time based on booking type duration
      const startTime = parseISO(selectedSlot.start_time);
      const endTime = addMinutes(startTime, selectedType.duration);
      
      // Create booking
      const bookingResult = await createBooking({
        booking_type: selectedType.name,
        user_id: user.id,
        resource_id: selectedType.id,
        resource_type: selectedType.category,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        price: selectedType.price,
        customer_name: bookingFormData.customer_name,
        customer_email: bookingFormData.customer_email,
        customer_phone: bookingFormData.customer_phone,
        location: selectedType.location,
        notes: bookingFormData.notes
      });
      
      if (!bookingResult.success || !bookingResult.booking_id) {
        throw new Error(bookingResult.message || 'Failed to create booking');
      }
      
      // Record payment (already processed in payment flow component)
      const paymentResult = await createBookingPayment(
        bookingResult.booking_id,
        selectedType.price,
        'jest_coin'
      );
      
      if (!paymentResult) {
        throw new Error('Failed to record payment');
      }
      
      // Load the created booking
      const mockBooking = {
        id: bookingResult.booking_id,
        booking_type: selectedType.name,
        user_id: user.id,
        resource_id: selectedType.id,
        resource_type: selectedType.category,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'confirmed',
        price: selectedType.price,
        customer_name: bookingFormData.customer_name,
        customer_email: bookingFormData.customer_email,
        customer_phone: bookingFormData.customer_phone,
        location: selectedType.location,
        notes: bookingFormData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setCreatedBooking(mockBooking);
      setStep('confirmation');
    } catch (error: any) {
      console.error('Error finalizing booking:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to finalize your booking',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBackClick = () => {
    if (step === 'type') {
      navigate('/bookings');
    } else if (step === 'date') {
      setStep('type');
      setSelectedDate(new Date());
    } else if (step === 'form') {
      setStep('date');
      setBookingFormData(null);
    } else if (step === 'payment') {
      setStep('form');
    }
  };
  
  const continueToContinue = () => {
    if (step === 'date' && selectedSlot) {
      setStep('form');
    }
  };
  
  const renderStepContent = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Processing...</span>
        </div>
      );
    }
    
    switch (step) {
      case 'type':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Booking Type</h2>
            
            {typesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(bookingTypesByCategory).map(([category, types]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold mb-4 capitalize">{category} Bookings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {types.map(type => (
                        <BookingTypeCard
                          key={type.id}
                          bookingType={type}
                          onSelect={handleTypeSelect}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'date':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Select Date & Time for {selectedType?.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BookingCalendar
                availableSlots={availableSlots}
                selectedDate={selectedDate}
                onDateChange={handleDateSelect}
                isLoading={slotsLoading}
              />
              
              <div className="space-y-4">
                <TimeSlotPicker
                  availableSlots={availableSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSlotSelect}
                  isLoading={slotsLoading}
                />
                
                {selectedSlot && (
                  <Button onClick={continueToContinue} className="w-full">
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'form':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Complete Booking Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-2">Booking Summary</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{selectedType?.name}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {format(selectedDate, 'MMMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">
                          {selectedSlot && format(parseISO(selectedSlot.start_time), 'p')} - 
                          {selectedSlot && format(addMinutes(parseISO(selectedSlot.start_time), selectedType?.duration || 0), 'p')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedType?.location}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{selectedType?.duration} minutes</span>
                      </div>
                      
                      <div className="border-t my-2 pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Price:</span>
                          <span>${selectedType?.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>JestCoin Price:</span>
                          <span>{selectedType?.jest_coin_price} JC</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <BookingForm
                  onSubmit={handleFormSubmit}
                  bookingType={selectedType?.id || ''}
                  startTime={selectedSlot ? parseISO(selectedSlot.start_time) : new Date()}
                  isSubmitting={isProcessing}
                />
              </div>
            </div>
          </div>
        );
        
      case 'payment':
        if (!selectedType) return null;
        
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Payment for {selectedType.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-2">Booking Summary</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{selectedType.name}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {format(selectedDate, 'MMMM d, yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">
                          {selectedSlot && format(parseISO(selectedSlot.start_time), 'p')} - 
                          {selectedSlot && format(addMinutes(parseISO(selectedSlot.start_time), selectedType.duration), 'p')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedType.location}</span>
                      </div>
                      
                      <div className="border-t my-2 pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total Price:</span>
                          <span>${selectedType.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <BookingPaymentFlow
                  bookingId="temp-id" // Will be replaced after booking creation
                  amount={selectedType.price}
                  jestCoinAmount={selectedType.jest_coin_price}
                  onPaymentComplete={handlePaymentComplete}
                  onCancel={handleBackClick}
                />
              </div>
            </div>
          </div>
        );
        
      case 'confirmation':
        if (!createdBooking) return null;
        
        return <BookingConfirmation booking={createdBooking} />;
        
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        {step !== 'confirmation' && (
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
        )}
        
        <h1 className="text-3xl font-bold tracking-tight">
          {step === 'type' && 'New Booking'}
          {step === 'date' && 'Select Date & Time'}
          {step === 'form' && 'Booking Details'}
          {step === 'payment' && 'Payment'}
          {step === 'confirmation' && 'Booking Confirmed'}
        </h1>
        
        {step !== 'confirmation' && (
          <p className="text-muted-foreground mt-1">
            {step === 'type' && 'Choose the type of booking you want to make'}
            {step === 'date' && 'Select an available date and time slot'}
            {step === 'form' && 'Fill in your details to complete the booking'}
            {step === 'payment' && 'Choose your payment method and complete the transaction'}
          </p>
        )}
      </div>

      {renderStepContent()}
    </MainLayout>
  );
};

export default NewBookingPage;
