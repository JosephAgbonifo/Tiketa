import { FeatureSection } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import RecentEvents from "@/components/landing/recentevents";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeatureSection />
      <RecentEvents />
    </div>
  );
}
