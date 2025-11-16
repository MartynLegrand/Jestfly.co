
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingTypeInfo } from '@/types/booking';
import { Clock, MapPin, CreditCard, Tag } from 'lucide-react';

interface BookingTypeCardProps {
  bookingType: BookingTypeInfo;
  onSelect: (bookingType: BookingTypeInfo) => void;
}

const BookingTypeCard: React.FC<BookingTypeCardProps> = ({ bookingType, onSelect }) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    }
    
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} minutes`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{bookingType.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          {bookingType.description && (
            <p className="text-sm text-muted-foreground">{bookingType.description}</p>
          )}
          
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>{formatDuration(bookingType.duration)}</span>
          </div>
          
          {bookingType.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{bookingType.location}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <CreditCard className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>${bookingType.price} / {bookingType.jest_coin_price} JestCoins</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Tag className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span className="capitalize">{bookingType.category}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => onSelect(bookingType)} 
          className="w-full"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingTypeCard;
