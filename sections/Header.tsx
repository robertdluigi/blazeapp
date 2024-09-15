"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowRight from '@/public/assets/arrow-right.svg';
import MenuIcon from '@/public/assets/menu.svg';
import Logo from "@/public/assets/logo-blaze.png";
import Link from 'next/link';

const menuItems = [
  { name: 'About', href: '#about' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Help', href: '#help' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuVariants = {
    closed: { y: '-100%', opacity: 0 },
    open: { y: 0, opacity: 1 },
  };

  const menuTransition = {
    type: 'spring',
    stiffness: 250,
    damping: 30,
  };

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash && headerRef.current) {
        const targetId = window.location.hash.replace('#', '');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerHeight = headerRef.current.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-20 bg-white/10 dark:bg-white/10 backdrop-blur-sm">
      {/* Top Banner */}
      <div className="flex justify-center items-center py-3 bg-black dark:text-black text-sm">
        <div className="inline-flex gap-1 items-center">
          <p className="text-white dark:text-white">Get started for free</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center text-white dark:text-white" />
        </div>
      </div>

      {/* Main Header */}
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Image src={Logo} alt="BlazeGG" height={40} width={40} />
            <button onClick={toggleMobileMenu} className="md:hidden">
              <MenuIcon className="h-5 w-5 text-gray-900 dark:text-gray-900" />
            </button>
            <nav className="hidden md:flex gap-6 items-center">
              {menuItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="text-gray-900 dark:text-gray-900"
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                >
                  {item.name}
                </a>
              ))}
              <Link href="/login">
                <button className="bg-black dark:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium tracking-tight">
                  Login
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={menuTransition}
            className="md:hidden absolute top-full left-0 right-0 bg-white/80 dark:bg-white/80 backdrop-blur-sm shadow-lg z-30"
          >
            <nav className="flex flex-col p-4">
              {menuItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  className="py-2 text-gray-900 dark:text-gray-900"
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                >
                  {item.name}
                </a>
              ))}
              <Link href="/login">
                <button className="mt-4 bg-black dark:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium tracking-tight w-full">
                  Login
                </button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
