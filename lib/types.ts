import { Prisma } from "@prisma/client";
import { SectionType } from '@/lib/sections';
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
    riotPUUID: true,
    riotCPID: true, // Add this property
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

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
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

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;


export interface CommentsPage {
  comments: CommentData[];
  previousCursor: string | null;
}

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