'use client';

import CheckIcon from "@/public/assets/check.svg"
import { twMerge } from "tailwind-merge";
import {motion} from "framer-motion";

const pricingTiers = [
    {
      id: 0,
      title: "Free",
      monthlyPrice: 0,
      buttonText: "Get started",
      popular: false,
      inverse: false,
      otp: false,
      features: [
        "Basic profile customization",
        "Limited profile sections",
        "Review access",
      ],
    },
    {
      id: 1,
      title: "Blazer",
      monthlyPrice: 4.99,
      buttonText: "Sign up now",
      popular: true,
      inverse: true,
      otp: false,
      features: [
        "Advanced profile customization",
        "Support priority",
        "Ad-free experience",
      ],
    },
    {
      id: 1,
      title: "Basic",
      monthlyPrice: 1.99,
      buttonText: "Sign up now",
      popular: false,
      inverse: false,
      otp: false,
      features: [
        "Profile customization",
        "Profile badge",
      ],
    },
  ];
  
export const Pricing = () => {
  return (
    <section className="py-24" id="pricing">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title ">Pricing</h2>
          <p className="section-description mt-5">Free forever, Upgrade for unlimited tasks, ads-free and exclusive features.</p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-start lg:justify-center">
          {pricingTiers.map(({id, title, monthlyPrice, buttonText, popular, inverse, features, otp}) => (
            <div key={id} className={twMerge("p-10 border border-[#c9c8c8] rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full", inverse === true && "border-black bg-black text-white/60")}>
              <div className="flex justify-between">                    
                <h3 className={twMerge("text-lg font-bold text-black/50", inverse === true && "text-white/60")}>{title}</h3>
                {popular === true && (
                  <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                    <motion.span
                      animate={{
                        backgroundPositionX: '100%',
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                        repeatType: 'loop',
                      }}
                      className="bg-[linear-gradient(to_right,#DD7DD7,#E1CD86,#BBCB92,#71C2Ef,#3BFFFF,#DD7DDF,#DD7DD7,#E1CD86,#BBCB92,#71C2Ef,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-medium">
                      Popular
                    </motion.span>
                  </div>
                )}     
              </div>
              <div className="flex items-baseline gap-1 mt-[30px]">
                <span className={twMerge("text-4xl font-bold tracking-tighter leading-none dark:text-black/50", inverse === true && "dark:text-white/50")} >${monthlyPrice}</span>
                <span className={twMerge("tracking-tight font-bold text-black/50", inverse === true && "dark:text-white/50")}>
                  {otp === true ? "" : " /month"}
                </span>
              </div>
              <button className={twMerge("btn btn-primary w-full mt-[30px]", inverse === true && "bg-white text-black")}>
                {buttonText}
              </button>
              <ul className="flex flex-col gap-5 mt-8">
                {features.map((feature, index) => (
                  <li key={`${id}-feature-${index}`} className={twMerge("text-sm flex items-center gap-4 dark:text-black", inverse === true && "dark:text-white/50")}>
                    <CheckIcon className="h-6 w-6" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
