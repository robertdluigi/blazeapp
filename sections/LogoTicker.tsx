'use client';

import acmeLogo from '@/public/assets/logo-acme.png';
import quantumLogo from '@/public/assets/logo-quantum.png';
import echoLogo from '@/public/assets/logo-echo.png'
import celestialLogo from '@/public/assets/logo-celestial.png';
import apexLogo from '@/public/assets/logo-apex.png';
import Image from 'next/image';
import { motion } from "framer-motion";
export const LogoTicker = () => {
    return (
        <div className="py-8 md:py-12 bg-white">
        <div className="container">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <motion.div className="flex gap-14 flex-none" animate={{
                translateX: "-100%",
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',

            }}
            >
            <Image src={acmeLogo} alt="Acme Logo" className="logo-image-ticker"/>
            <Image src={quantumLogo} alt="Quantum Logo" className="logo-image-ticker"/>
            <Image src={echoLogo} alt="Echo Logo" className="logo-image-ticker"/>
            <Image src={celestialLogo} alt="Celestial Logo" className="logo-image-ticker"/>
            <Image src={apexLogo} alt="Apex Logo" className="logo-image-ticker"/>

            <Image src={acmeLogo} alt="Acme Logo" className="logo-image-ticker"/>
            <Image src={quantumLogo} alt="Quantum Logo" className="logo-image-ticker"/>
            <Image src={echoLogo} alt="Echo Logo" className="logo-image-ticker"/>
            <Image src={celestialLogo} alt="Celestial Logo" className="logo-image-ticker"/>
            <Image src={apexLogo} alt="Apex Logo" className="logo-image-ticker"/>

            <Image src={acmeLogo} alt="Acme Logo" className="logo-image-ticker"/>
            <Image src={quantumLogo} alt="Quantum Logo" className="logo-image-ticker"/>
            <Image src={echoLogo} alt="Echo Logo" className="logo-image-ticker"/>
            <Image src={celestialLogo} alt="Celestial Logo" className="logo-image-ticker"/>
            <Image src={apexLogo} alt="Apex Logo" className="logo-image-ticker"/>

            <Image src={acmeLogo} alt="Acme Logo" className="logo-image-ticker"/>
            <Image src={quantumLogo} alt="Quantum Logo" className="logo-image-ticker"/>
            <Image src={echoLogo} alt="Echo Logo" className="logo-image-ticker"/>
            <Image src={celestialLogo} alt="Celestial Logo" className="logo-image-ticker"/>
            <Image src={apexLogo} alt="Apex Logo" className="logo-image-ticker"/>
            </motion.div>
        </div>
        </div>
        </div>
    );
}