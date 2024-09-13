import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Home, Gamepad, CreditCard } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import { SubscribeButton } from "@/components/stripe/SubscribeButton";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, subscription] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    prisma.subscription.findUnique({
      where: { userId: user.id },
    }),
  ]);

  const isSubscribed = subscription && subscription.plan !== 'FREE';

  return <div className={className}>
    <Button 
      variant="ghost"
      className="flex items-center justify-start gap-3"
      asChild
    >
      <Link href="/">
        <Home />
        <span className="hidden lg:inline">Home</span>
      </Link>
    </Button>
    <NotificationsButton
      initialState={{ unreadCount: unreadNotificationsCount }}
    />
    <Button 
      variant="ghost"
      className="flex items-center justify-start gap-3"
      asChild
    >
      <Link href="/">
        <Gamepad />
        <span className="hidden lg:inline">Looking for Game</span>
      </Link>
    </Button>
    {!isSubscribed && (
      <SubscribeButton>
        <CreditCard className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline">Subscribe</span>
      </SubscribeButton>
    )}
  </div>
}