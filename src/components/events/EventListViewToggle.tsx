
import { Button } from "@/components/ui/button";
import { Grid2X2, Rows } from "lucide-react";

interface EventListViewToggleProps {
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
}

const EventListViewToggle = ({ view, setView }: EventListViewToggleProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant={view === 'grid' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setView('grid')}
        title="Grid view"
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setView('list')}
        title="List view"
      >
        <Rows className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EventListViewToggle;
