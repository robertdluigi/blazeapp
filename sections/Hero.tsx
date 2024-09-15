"use client";

import ArrowRight from "@/public/assets/arrow-right.svg";
import jettImage from "@/public/landing-gaming.png";
import Image from "next/image";
import Link from "next/link";
import { ProductHunt } from "./ProductHunt";
import { useCallback, useRef, useEffect } from 'react';

export const Hero = () =>
{

    const headerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        headerRef.current = document.querySelector('header');
    }, []);

    const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLButtonElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId);
        if (targetElement && headerRef.current) {
            const headerHeight = headerRef.current.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    return(
        <section className="pt-10 pb-32 lg:pt-32 md:pt-24 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip" id="about">
            <div className="container">
                <div className="md:flex items-center">
                <div className="md:w-[478px]">
                    <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">Version 1.0b</div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E90] text-transparent bg-clip-text mt-6">Transform Your Gaming Journey</h1>
                    <p className="text-xl text-[#010D3E] tracking-tight mt-6">Discover a new way to enhance your gaming experience. Build your ultimate profile, connect with skilled players, and showcase your achievements. Join a community where your skills and moments truly shine. Level up your journey today!</p>
                    <div className="flex gap-1 items-center mt-[30px]">
                        <Link href="/login"><button className="btn btn-primary">Join for free</button></Link>
                        <button 
                            className="btn btn-text gap-1"
                            onClick={(e) => handleSmoothScroll(e, '#features')}
                        >
                            <span>Learn more</span>                      
                            <ArrowRight className="h-5 w-5"/>
                        </button>
                        
                    </div>
                    
                </div>
                <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
                    <Image src={jettImage} alt="Jett" className="sm:hidden md:block lg:block md:absolute md:w-auto md:max-w-none md:mt-10 md:-left-6 lg:left-60 lg:mt-10 absolute top-[-550px] left-[980px] w-[800px] h-[1200px] object-cover"
                    />
                </div>
                    
                </div>
                <div className="flex justify-center items-center lg:block">
                    <div className="relative lg:bottom-24 lg:left-1/2 lg:transform lg:-translate-x-1/2 sm:bottom-2">
                        <ProductHunt />
                    </div>
                </div>
            </div>

        </section>
    )
};

