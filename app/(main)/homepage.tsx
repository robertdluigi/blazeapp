import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { WhyUs } from "@/sections/WhyUs";
import { Newsletter } from "@/sections/Newsletter";
import { Footer } from "@/sections/Footer";
import { Pricing } from "@/sections/Pricing";

export default function Homepage() {

  return (
        <div className="bg-white dark:bg-white">
          <Header />
          
          <Hero />
          <WhyUs />
          <Pricing />
          <Newsletter />
          <Footer />

        </div>
  );
}