
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types";
import EventListGrid from "./EventListGrid";
import EventListView from "./EventListView";
import EventListSkeleton from "./EventListSkeleton";
import EventEmptyState from "./EventEmptyState";
import EventListViewToggle from "./EventListViewToggle";

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('start_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <EventListSkeleton />;
  }

  if (events.length === 0) {
    return <EventEmptyState />;
  }

  return (
    <div className="space-y-6">
      <EventListViewToggle view={view} setView={setView} />
      
      {view === 'grid' 
        ? <EventListGrid events={events} />
        : <EventListView events={events} />
      }
    </div>
  );
};

export default EventList;
