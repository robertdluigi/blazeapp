import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ReviewData, getReviewDataInclude } from '@/lib/types'; // Import the types and functions

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');
  const gameId = searchParams.get('gameId');

  try {
    // Build the filter based on provided query parameters
    const where: { matchId?: string; gameId?: string } = {};
    if (matchId) {
      where.matchId = matchId;
    } else if (gameId) {
      where.gameId = gameId;
    }

    // Fetch the reviews from the database
    const reviews: ReviewData[] = await prisma.review.findMany({
      where,
      include: getReviewDataInclude(''), // Pass an empty string for loggedInUserId if needed
    });

    // Return the reviews as a JSON response
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.error();
  }
}
