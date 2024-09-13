import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { validateRequest } from '@/auth'; // Ensure this function is correctly imported
import { authorizeUrl, clientID, appCallbackUrl } from '@/lib/riot';

async function fetchSteamData(steamID: string) {
    try {
        const fields = 'personaname,avatar'; // Specify fields you want to retrieve
        const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_CLIENT_ID}&steamids=${steamID}`);
        const data = await response.json();

        if (data.response.players.length > 0) {
            return data.response.players[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching Steam data:", error);
        return null;
    }
}

export default async function Settings() {
    const link = `${authorizeUrl}?redirect_uri=${appCallbackUrl}&client_id=${clientID}&response_type=code&scope=openid offline_access`;
    const { user } = await validateRequest();

    if (!user) {
        return (
            <p className="text-destructive">
                You&apos;re not authorized to view this page.
            </p>
        );
    }

    const steamID = user.steamId;
    let steamData = null;

    if (steamID) {
        steamData = await fetchSteamData(steamID);
    }

    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <Tabs defaultValue="account" className="">
                    <TabsList className="rounded-2xl">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="connections">Connections</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    </TabsList>
                    <TabsContent className="py-5" value="account">

                    </TabsContent>
                    <TabsContent className="py-5" value="profile">
                        Profile
                    </TabsContent>
                    <TabsContent className="py-5" value="connections">
                    {steamID ? (
                            <div>
                                <p>Steam ID: {steamID}</p>
                                {steamData ? (
                                    <div>
                                        <p>Steam Name: {steamData.personaname}</p>
                                        {steamData.avatar && <img src={steamData.avatar} alt="Steam Avatar" />}
                                    </div>
                                ) : (
                                    <p>Steam data not available.</p>
                                )}
                            </div>
                        ) : (
                            <Link href="/api/auth/steam/link">Link Steam Account</Link>
                        )}

                    <Link href={link}>Sign in with Riot</Link>
                    </TabsContent>
                    <TabsContent className="py-5" value="privacy">
                        Privacy
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
