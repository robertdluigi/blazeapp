import Image from 'next/image';
import FollowButton from '@/components/FollowButton';
import { formatNumber } from '@/lib/utils';
import prisma from '@/lib/prisma';
import { getUserDataSelect, UserData } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { validateRequest } from '@/auth';
import { cache } from 'react';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';

import valorantImage from '@/public/games/valorant.png';
import leagueOfLegendsImage from '@/public/games/leagueoflegends.png';
import genshinImpactImage from '@/public/games/genshinimpact.png';

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({ params: { username } }: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);
  const cardImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/generate-card-image/${username}`;

  return {
    title: `${user.displayName}'s Card | BlazeGG`,
    description: `Check out ${user.displayName}'s profile card on BlazeGG!`,
    openGraph: {
      title: `${user.displayName}'s Card | BlazeGG`,
      description: `Check out ${user.displayName}'s profile card on BlazeGG!`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${username}/card`,
      siteName: 'BlazeGG',
      images: [
        {
          url: cardImageUrl,
          width: 1200,
          height: 630,
          alt: `${user.displayName}'s profile card`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${user.displayName}'s Card | BlazeGG`,
      description: `Check out ${user.displayName}'s profile card on BlazeGG!`,
      images: [cardImageUrl],
      creator: '@BlazeGG',
    },
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5 justify-center">
      <div className="w-full min-w-0 max-w-xl">
        <UserCard user={user} loggedInUserId={loggedInUser.id} />
      </div>
    </main>
  );
}

interface UserCardProps {
  user: UserData;
  loggedInUserId: string;
}

function UserCard({ user, loggedInUserId }: UserCardProps) {
  const followerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId
    ),
  };

  const reputation = 1245; // Example static reputation data
  const games = [
    { name: 'Valorant', image: valorantImage },
    { name: 'League of Legends', image: leagueOfLegendsImage },
    { name: 'Genshin Impact', image: genshinImpactImage },
  ];
  const cardPrimaryColor = user.cardPrimaryColor || '#000'; // Fallback to black if not set
  const cardSecondaryColor = user.cardSecondaryColor || '#FFF'; // Fallback to white if not set

  return (
    <div
      className="relative rounded-2xl h-[600px]" // Fixed height for the card
      style={{
        borderImage: `linear-gradient(to bottom, ${cardPrimaryColor}, ${cardSecondaryColor}) 0`,
      }}
    >
      <div className="h-120 rounded-2xl overflow-hidden shadow-lg flex flex-col">
        {/* Top Section: Avatar and Basic Info */}
        <div
          className={twMerge('p-4 flex flex-col items-center rounded-t-2xl')}
          style={{
            backgroundColor: user.bannerColor || '#1F2937',
            backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size={128}
            className="rounded-full border-4 border-accent dark:border-accent-foreground"
          />
          <div className="text-center mt-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.displayName}
            </h2>
          </div>
        </div>

        {/* Separation Line */}
        <hr
          className="border-t-2 border-gray-300 dark:border-gray-700"
          style={{
            borderImage: `linear-gradient(to left, ${cardPrimaryColor}, ${cardSecondaryColor}) 1`,
          }}
        />

        {/* Bottom Section: Stats, Details, and Placeholder */}
        <div className={twMerge('p-8 flex flex-col space-y-8 rounded-b-2xl')}
          style={{
            background: `linear-gradient(to bottom, ${cardPrimaryColor}, ${cardSecondaryColor})`
          }}>
          <div className="flex justify-end">
            {user.id === loggedInUserId ? (
              // Removed Edit Card button
              <></>
            ) : (
              <FollowButton userId={user.id} initialState={followerInfo} />
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <div className="flex-1 p-4 bg-black/50 rounded-lg shadow-md text-center text-white backdrop-blur-sm max-w-48">
              <h4 className="text-xs font-medium mb-1">Reputation</h4>
              <hr className="border-gray-700 mb-2" />
              <p className="text-2xl font-bold">{formatNumber(reputation)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-black/50 rounded-lg shadow-md p-4 text-center text-white backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray mb-2">Favorite Games</h3>
              <hr className="border-gray-700 mb-2" />
              <div className="flex gap-4 justify-center">
                {games.map((game) => (
                  <div key={game.name} className="flex-1">
                    <Image
                      src={game.image}
                      alt={game.name}
                      width={36}
                      height={36}
                      className="mx-auto rounded-full"
                    />
                    <p className="mt-2 text-xs font-medium">{game.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-grow"></div> {/* Reserved space for future sections */}
          <div className="flex-grow"></div> {/* Reserved space for future sections */}
          <div>
            <hr className="border-gray-700" />
            <div className="mt-3 text-sm text-gray-300">
              <p className="text-center">Development View</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
