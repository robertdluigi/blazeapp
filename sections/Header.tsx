import Image from 'next/image';
import ArrowRight from '@/public/assets/arrow-right.svg';
import MenuIcon from '@/public/assets/menu.svg';
import Logo from "@/public/assets/logo-blaze.png";
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      {/* Top Banner */}
      <div className="flex justify-center items-center py-3 bg-black dark:text-white text-sm">
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
            <MenuIcon className="h-5 w-5 text-gray-900 dark:text-white md:hidden" />
            <nav className="hidden md:flex gap-6 items-center">
              <a href="#" className="text-gray-700 dark:text-gray-500">About</a>
              <a href="#" className="text-gray-700 dark:text-gray-500">Features</a>
              <a href="#" className="text-gray-700 dark:text-gray-500">Pricing</a>
              <a href="#" className="text-gray-700 dark:text-gray-500">Help</a>
              <button className="bg-black dark:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium tracking-tight">
                Sign up for free
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
