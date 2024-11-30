import { Prisma } from "@prisma/client";
import { SectionType } from '@/lib/sections';

// Function to select user data
export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    bannerColor: true,
    bannerUrl: true,
    cardPrimaryColor: true,
    cardSecondaryColor: true,
    cardBackground: true,
    currentLobbyId: true,
    riotPUUID: true,
    riotCPID: true, // Add this property
    steamId: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
    profileSections: { // Add this section
      select: {
        id: true,
        title: true,
        type: true,
        content: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    subscription: {
      select: {
        id: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        plan: true,
        createdAt: true,
        expiresAt: true,
      },
    },
    plan: true,
    reviewLimit: true,
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

// Subscription type definition
export type SubscriptionData = Prisma.SubscriptionGetPayload<{
  select: {
    id: true;
    stripeCustomerId: true;
    stripeSubscriptionId: true;
    plan: true;
    createdAt: true;
    expiresAt: true;
  };
}>;

export type PlanType = 'FREE' | 'PRO' | 'FOUNDER';

// Function to include user data in posts
export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

// Function to include user data in reviews
export function getReviewDataInclude(loggedInUserId: string) {
  return {
    reviewer: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.ReviewInclude;
}

export type ReviewData = Prisma.ReviewGetPayload<{
  include: ReturnType<typeof getReviewDataInclude>;
}>;

export interface ReviewsPage {
  reviews: ReviewData[];
  previousCursor: string | null;
}

// Function to include user data in comments
export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

// Profile Section-related Types
export interface ProfileSection {
  id: string;
  userId: string;
  title: string;
  type: SectionType;
  content: any; // Adjust as needed if you're using a different type
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Function to include user data in profile sections
export function getSectionDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId), // Provide a default value or adjust this based on your logic
    },
  } satisfies Prisma.ProfileSectionInclude;
}

export type SectionData = Prisma.ProfileSectionGetPayload<{
  include: ReturnType<typeof getSectionDataInclude>;
}>;

// Mutation Types
export interface CreateSectionInput {
  title: string;
  content: string;
  type: SectionType;
  order: number;
}

// Notifications and Likes Info
export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}
// lobby types

export interface Lobby {
  id: string;
  userId: string;
  gameTitle: string;
  gameMode: string;
  maxPlayers: number;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
  endedAt: Date | null;
}

export interface LobbiesPage {
  lobbies: Lobby[];
  nextCursor: string | null;
}

export interface LobbiesInfo {
  lobbies: Lobby[];
  nextCursor: string | null;
} 

export interface LobbiesCountInfo { 
  lobbiesCount: number; 
} 

export interface CreateLobbyInput {
  userId: string;
  gameTitle: string;
  gameMode: string;
  maxPlayers: number;
  inviteCode: string;
}

export interface JoinLobbyInput {
  inviteCode: string;
}