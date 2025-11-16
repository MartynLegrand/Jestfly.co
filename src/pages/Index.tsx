
import MainLayout from "@/components/layout/MainLayout";
import CrystalHero from "@/components/home/CrystalHero";
import FeaturesSection from "@/components/home/FeaturesSection";
import EventsSection from "@/components/home/EventsSection";

const Index = () => {
  return (
    <MainLayout>
      <CrystalHero />
      <FeaturesSection />
      <EventsSection />
    </MainLayout>
  );
};

export default Index;
