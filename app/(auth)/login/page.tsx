import { Metadata } from "next"
import Image from "next/image"
import signupImage from "@/public/landing-gaming.png"
import Link from "next/link"
import LoginForm from "./LoginForm"

export const metadata: Metadata = {
    title: "Login"
}

export default function Page()
{
    return <main className="flex h-screen items-center justify-center p-5">
        <div className=" shadow-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card">
            <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
                <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold">Login to Blaze</h1>
                <p className="text-muted-foreground">A place to connect with other <span className="italic">gamers</span>
                </p>
                </div>
                <div className="space-y-5">
                    <LoginForm />
                <Link href="/signup" className="block text-center hover:underline">Don&apos;t have an account? Sign up</Link>
                </div>
            </div>
        <Image src={signupImage} 
        alt=""
        className="w-1/2 hidden md:block relative top-[-550px] h-[1200px] object-cover"
        />
        </div>
        
    </main>
}