import Image from "next/image"

import logo from "@/public/assets/logo-blaze.png";

export const Footer = () =>
    {
        return(
            <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
                <div className="container">
                    <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#FC8A17,#ED6C09,#C4510A,#ED6C09,#FC8A17)] before:absolute">
                    <Image src={logo} height={40} alt="Logo" className="relative"/>
                    </div>
                <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
                    <a href="#">About</a>
                    <a href="#">Features</a>
                    <a href="#">Pricing</a>
                    <a href="#">Help</a>
                </nav>


                <p className="mt-6">&copy; 2024 Blaze.GG, Inc. All rights reserved.</p>
                </div>

            </footer>
        )
    }