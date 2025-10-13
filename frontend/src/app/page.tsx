import { FeatureSection } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import HowItWorks from "@/components/landing/howitworks";
import RecentEvents from "@/components/landing/recentevents";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeatureSection />
      <HowItWorks />
      <RecentEvents />
    </div>
  );
}
