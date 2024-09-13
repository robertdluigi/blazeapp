"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CreateSectionInput, getSectionDataInclude, ProfileSection } from "@/lib/types";

export async function createSection(input: CreateSectionInput): Promise<ProfileSection> {
    // Validate the request and retrieve the user
    const { user } = await validateRequest();

    // Throw an error if the user is not authenticated
    if (!user) {
        throw new Error("Unauthorized");
    }

    const { title, content, type, order } = input;

    // Create a new section entry in the database
    const newSection = await prisma.profileSection.create({
        data: {
            title,
            content: JSON.stringify(content), // Ensure content is serialized as JSON
            type,
            order,
            userId: user.id, // Set the userId to the authenticated user's ID
        },
        include: getSectionDataInclude(user.id), // Include user data for consistency in response
    });

    // Return the newly created section
    return newSection as ProfileSection;
}
