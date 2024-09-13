import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate, formatDistanceToNowStrict } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(from: Date) {
  const currendDate = new Date();
  if (currendDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000 )
  {
    return formatDistanceToNowStrict(from, {addSuffix: true})
  }
  else
  {
    if (currendDate.getFullYear() === from.getFullYear() )
    {
      return formatDate(from, "MMM d");
    }
    else
    {
      return formatDate(from, "MMM d, yyyy=");
    }
  }

}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(n);
}

export function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
      return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}