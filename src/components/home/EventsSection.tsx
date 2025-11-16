
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import EventList from "@/components/events/EventList";

const EventsSection = () => {
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join exciting events, connect with artists, and be part of the JESTFLY community.
            </p>
          </motion.div>
        </div>
        
        <EventList />
      </Container>
    </section>
  );
};

export default EventsSection;
