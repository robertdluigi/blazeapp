import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { validateRequest } from '@/auth';
import { authorizeUrl, clientID, appCallbackUrl } from '@/lib/riot';
import UserRiotData from "./UserRiotData";
import AccountSettings from "./AccountSettings";
import ProfileSettings from "./ProfileSettings";
import BillingSettings from "./BillingSettings";
import prisma from "@/lib/prisma";
import ConnectionSettings from "./ConnectionSettings";

async function fetchSteamData(steamID: string) {
    try {
        const fields = 'personaname,avatar';
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

    const subscription = await prisma.subscription.findUnique({
        where: { userId: user.id },
    });

    const currentPlan = subscription?.plan || "FREE";

    return (
        <main className="container mx-auto py-10">
            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    
                </TabsList>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Manage your account details and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AccountSettings />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                            <CardDescription>Customize your public profile.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileSettings />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="connections">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connected Accounts</CardTitle>
                            <CardDescription>Manage your connected gaming accounts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Steam Connection */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Steam</h3>
                                    {steamID ? (
                                        <p className="text-sm text-gray-500">{steamData?.personaname || steamID}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Not connected</p>
                                    )}
                                </div>
                                {steamID ? (
                                    <div className="flex items-center space-x-2">
                                        {steamData?.avatar && (
                                            <Avatar>
                                                <AvatarImage src={steamData.avatar} alt="Steam Avatar" />
                                                <AvatarFallback>ST</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <Button variant="outline">Disconnect</Button>
                                    </div>
                                ) : (
                                    <Link href="/api/auth/steam/link">
                                        <Button>Connect Steam</Button>
                                    </Link>
                                )}
                            </div>

                            {/* Riot Games Connection */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Riot Games</h3>
                                    {user.riotAccessToken ? (
                                        <UserRiotData userId={user.id} />
                                    ) : (
                                        <p className="text-sm text-gray-500">Not connected</p>
                                    )}
                                </div>
                                {user.riotAccessToken ? (
                                    <Button variant="outline">Disconnect</Button>
                                ) : (
                                    <Link href={link}>
                                        <Button>Connect Riot</Button>
                                    </Link>
                                )}
                            </div>
                            {/* Genshin Impact and Honkai: Star Rail Connections */}
                            <ConnectionSettings userData={{ genshinUid: user.genshinUid ?? undefined, honkaiId: user.honkaiId ?? undefined }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                            <CardDescription>Manage your privacy preferences.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Add privacy settings content here */}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing Settings</CardTitle>
                            <CardDescription>Manage your subscription and billing details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BillingSettings 
                                currentPlan={currentPlan} 
                                stripeCustomerId={user.stripeCustomerId as string} 
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}
