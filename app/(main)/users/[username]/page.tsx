import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import UserPosts from "./UserPosts";
import UserLeagueMatches from "./UserLeagueMatches";
import UserProfileSections from "./UserProfileSections";
import UserProfileReviews from "./UserProfileReviews";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
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
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <Tabs defaultValue="profile" >
        <div className="flex justify-center">
            <TabsList className="rounded-2xl w-full max-w-4xl">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent className="py-5" value="profile">
          <UserProfileSections user={user} userId={user.id} isOwner={loggedInUser.id === user.id} />
          </TabsContent>
          <TabsContent className="py-5" value="posts">
            <UserPosts userId={user.id} />
          </TabsContent>
          <TabsContent className="py-5" value="reviews">
            <UserProfileReviews userId={user.id} />
          </TabsContent>
          <TabsContent className="py-5" value="highlights">
            Highlights
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-auto w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-col items-center space-y-3">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          size={256}
          className="mx-auto size-full max-h-32 max-w-32 rounded-full"
        />
        <h1 className="text-3xl font-bold text-center">{user.displayName}</h1>
        <div className="text-center text-muted-foreground">@{user.username}</div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-2">
          <div className="text-center sm:text-left">
            Member since {formatDate(user.createdAt, "MMM d, yyyy")}
          </div>
          <div className="flex justify-center sm:justify-start items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">{formatNumber(user._count.posts)}</span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <div className="flex justify-center sm:justify-end mt-3 sm:mt-0">
            <EditProfileButton user={user} />
          </div>
        ) : (
          <div className="flex justify-center sm:justify-end mt-3 sm:mt-0">
            <FollowButton userId={user.id} initialState={followerInfo} />
          </div>
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
