
import { Event } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

const EventCard = ({ event, isPast = false }: EventCardProps) => {
  const categoryColors = {
    music: "bg-purple-500",
    art: "bg-pink-500",
    tech: "bg-blue-500",
    business: "bg-green-500",
    community: "bg-orange-500",
    other: "bg-gray-500",
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {event.cover_image && (
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={event.cover_image} 
            alt={event.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
          <Badge 
            className={`absolute top-2 right-2 ${categoryColors[event.category]}`}
          >
            {event.category}
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-2" />
          {format(new Date(event.start_date), 'PP')}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          {format(new Date(event.start_date), 'p')}
        </div>

        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-sm font-medium">
          {event.jest_coin_price > 0 ? (
            <span>{event.jest_coin_price} JestCoins</span>
          ) : (
            <span>Free</span>
          )}
        </div>
        <Button asChild disabled={isPast}>
          <Link to={`/events/${event.id}`}>
            {isPast ? "Event Ended" : "View Details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
