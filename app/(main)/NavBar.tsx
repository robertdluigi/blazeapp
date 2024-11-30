import Image from 'next/image';
import Logo from "@/public/assets/logo-blaze.png"
import Link from 'next/link';
import UserButton from '@/components/UserButton';
import SearchField from '@/components/SearchField';
import LobbyButton from '@/components/lobby/LobbyButton';

export const NavBar = () =>
{
return(
    <header className="sticky top-0 backdrop-blur-sm z-20">
    <div className="py-5">
        <div className="container">
            <div className="flex items-center justify-between">
            <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#FC8A17,#ED6C09,#C4510A,#ED6C09,#FC8A17)] before:absolute">
            <Link href="/"><Image src={Logo} alt="BlazeGG" height={40} width={40} className='relative' /></Link>
            </div>
            
            <SearchField />
            <div className='flex gap-4'>
            <LobbyButton />
            <UserButton />
            </div>

        </div>
        </div>
    </div>
    </header>
)
};