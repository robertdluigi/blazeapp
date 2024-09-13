import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth"; // Custom auth validation
import prisma from '@/lib/prisma'; // Prisma database client
import { SectionType } from '@/lib/sections'; // Enum for section types

export async function POST(req: NextRequest) {
  try {
    // Validate the request and get the authenticated user
    const authResult = await validateRequest();
    
    // Check if user is authenticated
    if (!authResult || !authResult.user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const { user } = authResult;

    // Parse the JSON body from the request
    const { title, content, type } = await req.json();

    // Validate the input data
    if (!title || !content || !type) {
      return new NextResponse(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure that the provided type is a valid SectionType
    if (!Object.values(SectionType).includes(type)) {
      return new NextResponse(JSON.stringify({ error: "Invalid section type" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the highest 'order' value for the user's sections
    const maxOrderSection = await prisma.profileSection.findFirst({
      where: { userId: user.id }, // Correct usage of userId
      orderBy: { order: 'desc' }, // Get the section with the highest order
    });

    // Determine the next order value (if no sections, the first order is 1)
    const nextOrder = maxOrderSection ? maxOrderSection.order + 1 : 1;

    // Create the new profile section in the database, including the `order`
    const newSection = await prisma.profileSection.create({
      data: {
        title,
        content: JSON.stringify(content), // Assuming content is JSON formatted
        type,
        order: nextOrder, // Include the order field
        user: {
          connect: {
            id: user.id, // Connect the section to the authenticated user
          },
        },
      },
    });

    // Return the newly created section data
    return new NextResponse(JSON.stringify(newSection), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating section:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
