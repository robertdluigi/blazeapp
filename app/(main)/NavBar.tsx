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
            <Link href="/"><Image src={Logo} alt="BlazeGG" height={40} width={40} /></Link>
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