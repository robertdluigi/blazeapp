'use client';

import Image from "next/image";
import TeamIcon from "@/public/assets/team.png";
import ControllerIcon from "@/public/assets/controller.png";
import HandshakeIcon from "@/public/assets/handshake.png";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const benefits = [
  {
    headline: "Build Trust",
    icon: HandshakeIcon,
    description: "Prove your worth with verified reviews from fellow gamers. Showcase your skills and build a trustworthy reputation.",
  },
  {
    headline: "Find Reliable Teammates",
    icon: TeamIcon,
    description: "See the credibility of players before you team up. Find and connect with like-minded gamers for a better gaming experience.",
  },
  {
    headline: "Improve Experience",
    icon: ControllerIcon,
    description: "By knowing the credibility and behavior of your teammates, you can enjoy a more cohesive and enjoyable gaming experience.",
  },
];

export const WhyUs = () => {
  return (
    <section className="py-24" id="features">
      <div className="container">
        <div className="section-heading text-center">
          <h2 className="section-title">Why Choose Us</h2>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-stretch lg:justify-center">
          {benefits.map(({ headline, icon, description }, index) => (
            <div key={index} className="p-10 border border-[#c9c8c8] rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full flex flex-col justify-between">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center">
                  <h3 className="text-lg text-center font-bold text-black/60">{headline}</h3>
                </div>
                <div className="py-6 flex justify-center items-center">
                  <Image src={icon} alt={headline} className="keyfeature-image" />
                </div>
              </div>
              <div className="mt-6 flex flex-col items-center">
                <span className="text-center tracking-tighter text-black">{description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
