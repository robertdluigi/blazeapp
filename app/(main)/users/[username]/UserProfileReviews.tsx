'use client';

import React from 'react';
import UserLeagueMatches from './UserLeagueMatches';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Demo reviews data
const demoReviews = [
  {
    id: 1,
    game: 'League of Legends',
    reviewer: 'PlayerOne',
    reviewee: 'PlayerTwo',
    tags: ['Good shotcalling', 'Friendly'],
    voteType: 'Upvote',
    content: 'Great teammate! Always made good calls and kept the mood positive.',
  },
  {
    id: 2,
    game: 'VALORANT',
    reviewer: 'PlayerThree',
    reviewee: 'PlayerFour',
    tags: ['Toxic', 'Verbal abuse'],
    voteType: 'Downvote',
    content: 'Very toxic behavior, constantly trash-talking teammates.',
  },
  {
    id: 3,
    game: 'Phasmophobia',
    reviewer: 'PlayerFive',
    reviewee: 'PlayerSix',
    tags: ['Helpful', 'Calm'],
    voteType: 'Upvote',
    content: 'Very knowledgeable player, helped me understand the mechanics!',
  },
];

interface UserProfileReviewsProps {
  userId: string;
}

const UserProfileReviews: React.FC<UserProfileReviewsProps> = ({ userId }) => {
  return (
    <div className="user-profile-reviews p-4 rounded-lg shadow-md">

      {/* Reviews Section */}
      <div>
        {/* Map through the demo reviews and display each */}
        {demoReviews.map((review) => (
          <Card key={review.id} className="mb-4">
            <CardHeader>
              <CardTitle>
                {review.reviewer} reviewed {review.reviewee} ({review.game})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><strong>Tags:</strong> {review.tags.join(', ')}</p>
              <p className="mb-2"><strong>Vote:</strong> {review.voteType}</p>
              <p><strong>Review:</strong> {review.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserProfileReviews;
