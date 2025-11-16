
import { Event } from "@/types";
import EventCard from "./EventCard";

interface EventListGridProps {
  events: Event[];
}

const EventListGrid = ({ events }: EventListGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event}
          isPast={new Date(event.end_date) < new Date()}
        />
      ))}
    </div>
  );
};

export default EventListGrid;
