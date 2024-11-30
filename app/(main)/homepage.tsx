import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { WhyUs } from "@/sections/WhyUs";
import { Footer } from "@/sections/Footer";
import { Pricing } from "@/sections/Pricing";

export default function Homepage() {

  return (
        <div className="bg-white dark:bg-white">
          <Header /> 
          <Hero />
          <WhyUs />
          <Pricing />
          <Footer />

        </div>
  );
}