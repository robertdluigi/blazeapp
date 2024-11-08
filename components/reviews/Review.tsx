import { useSession } from "@/app/(main)/SessionProvider";
import { ReviewData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import ReviewMoreButton from "./ReviewMoreButton";
interface ReviewProps {
  review: ReviewData;
}

export default function Review({ review }: ReviewProps) {
  const { user } = useSession();

  return (
    <div className="group/review flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={review.reviewer}>
          <Link href={`/users/${review.reviewer.username}`}>
            <UserAvatar avatarUrl={review.reviewer.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={review.reviewer}>
            <Link
              href={`/users/${review.reviewer.username}`}
              className="font-medium hover:underline"
            >
              {review.reviewer.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(review.createdAt)}
          </span>
        </div>
        <div>{review.content}</div>
      </div>
      {review.reviewer.id === user?.id && (
        <ReviewMoreButton
          review={review}
          className="ms-auto opacity-0 transition-opacity group-hover/review:opacity-100"
        />
      )}
    </div>
  );
}