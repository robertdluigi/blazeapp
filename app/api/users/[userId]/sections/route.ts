import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/auth"; // Adjust the path as necessary
import prisma from '@/lib/prisma'; // Adjust the path as necessary

// Handle GET requests to fetch user's profile sections
export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    // Validate the request (e.g., check authentication)
    const {user: loggedInUser} = await validateRequest();
    if (!loggedInUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's profile sections from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profileSections: true, // Fetch only the profile sections
      },
    });

    // Return the profile sections or an empty array if the user is not found
    if (user) {
      return NextResponse.json(user.profileSections || []);
    } else {
      return NextResponse.json([], { status: 404 }); // Not Found
    }
  } catch (error) {
    console.error('Failed to fetch profile sections:', error);
    return NextResponse.json({ error: 'Failed to fetch profile sections' }, { status: 500 });
  }
}
