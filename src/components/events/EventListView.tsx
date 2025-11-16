
import { Event } from "@/types";
import EventCard from "./EventCard";

interface EventListViewProps {
  events: Event[];
}

const EventListView = ({ events }: EventListViewProps) => {
  return (
    <div className="space-y-4">
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

export default EventListView;
