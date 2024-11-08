import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "@/lib/prisma";
import { Lucia, Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { create } from "domain";


const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes(databaseUserAttributes){
        return {
            id: databaseUserAttributes.id,
            email: databaseUserAttributes.email,
            username: databaseUserAttributes.username,
            displayName: databaseUserAttributes.displayName,
            avatarUrl: databaseUserAttributes.avatarUrl,
            googleId: databaseUserAttributes.googleId,
            riotAccessToken: databaseUserAttributes.riotAccessToken,
            steamId:  databaseUserAttributes.steamId,
            stripeCustomerId: databaseUserAttributes.stripeCustomerId,
            genshinUid: databaseUserAttributes.genshinUid,
            honkaiId: databaseUserAttributes.honkaiId,
            plan: databaseUserAttributes.plan,
            reviewLimit: databaseUserAttributes.reviewLimit,
            currentLobbyId: databaseUserAttributes.currentLobbyId,
        };
    }
})

declare module "lucia"
{
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    id: string,
    email: string,
    username: string,
    displayName: string,
    avatarUrl: string|null,
    googleId: string|null,
    riotAccessToken: string|null,
    steamId:  string|null,
    stripeCustomerId: string|null,
    genshinUid: string|null,
    honkaiId: string|null,
    plan: string|null,
    reviewLimit: number|null,
    currentLobbyId: string|null,
}

export const validateRequest = cache(
    async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

        if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

        const result = await lucia.validateSession(sessionId);

        try {
            if (result.session && result.session.fresh){
                const sessionCookie = lucia.createSessionCookie(result.session.id);
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                )
            }
            if (!result.session)
            {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                )
            }
        } catch {    }
        return result;
    },
);