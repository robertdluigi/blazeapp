import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import UserMatches from "./UserMatches";

interface PageProps {
  params: { summonerName: string };
}

export function generateMetadata({ params: { summonerName } }: PageProps): Metadata {
  return {
    title: `Matches for ${summonerName}`,
  };
}

export default function Page({ params: { summonerName } }: PageProps) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Matches for &quot;{summonerName}&quot;
          </h1>
        </div>
        <UserMatches summonerName={summonerName} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
