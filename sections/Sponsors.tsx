'use client';

import acmeLogo from '@/public/assets/logo-acme.png';
import quantumLogo from '@/public/assets/logo-quantum.png';
import echoLogo from '@/public/assets/logo-echo.png'
import celestialLogo from '@/public/assets/logo-celestial.png';
import apexLogo from '@/public/assets/logo-apex.png';
import Image from 'next/image';
import { motion } from "framer-motion";
export const Sponsors = () => {
    return (
        <div className="py-8 md:py-12 bg-white">
        <div className="container">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <div className="flex gap-14 flex-none">
            <h2>
                <Image src={apexLogo} alt='Apex' />
            </h2>
            </div>
        </div>
        </div>
        </div>
    );
}