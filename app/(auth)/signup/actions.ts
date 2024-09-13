"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { generateIdFromEntropySize } from "lucia";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function signUp(
    credentials: SignUpValues
): Promise<{ error: string }> {
    try {
        const { username, email, password } = signUpSchema.parse(credentials);

        const passwordHash = await bcrypt.hash(password, 10);

        const userId = generateIdFromEntropySize(10);

        const existingUsername = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive",
                }
            }
        });

        if (existingUsername) {
            return {
                error: "Username already taken",
            };
        }

        const existingEmail = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                }
            }
        });

        if (existingEmail) {
            return {
                error: "Email already taken",
            };
        }

        await prisma.user.create({
            data: {
                id: userId,
                username,
                displayName: username,
                email,
                passwordHash
            }
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return redirect("/");

    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.error(error);
        return {
            error: "Something went wrong. Please try again."
        };
    }
}
