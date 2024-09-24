'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAddGenshinUID, useRemoveGenshinUID, useAddHonkaiUID, useRemoveHonkaiUID, useAddHoyolabTokens } from './hoyoverse/mutations';

export default function ConnectionSettings({ userData }: { userData: { genshinUid?: string, honkaiId?: string, hoyolabConnected?: boolean } }) {
    const [genshinUID, setGenshinUID] = useState('');
    const [honkaiUID, setHonkaiUID] = useState('');
    const [isGenshinDialogOpen, setIsGenshinDialogOpen] = useState(false);
    const [isHonkaiDialogOpen, setIsHonkaiDialogOpen] = useState(false);
    const [isConnectingHoyolab, setIsConnectingHoyolab] = useState(false);
    const { toast } = useToast();

    const addGenshinMutation = useAddGenshinUID();
    const removeGenshinMutation = useRemoveGenshinUID();
    const addHonkaiMutation = useAddHonkaiUID();
    const removeHonkaiMutation = useRemoveHonkaiUID();
    const addHoyolabTokensMutation = useAddHoyolabTokens();

    const handleAddGenshin = () => {
        if (genshinUID.length !== 9) {
            toast({ title: "Error", description: "UID must be 9 digits long", variant: "destructive" });
            return;
        }
        addGenshinMutation.mutate(genshinUID, {
            onSuccess: () => {
                setIsGenshinDialogOpen(false);
                setGenshinUID('');
                toast({ title: "Success", description: "Genshin Impact account added successfully" });
            },
            onError: (error) => {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            }
        });
    };

    const handleRemoveGenshin = () => {
        removeGenshinMutation.mutate(undefined, {
            onSuccess: () => {
                toast({ title: "Success", description: "Genshin Impact account removed successfully" });
            },
            onError: (error) => {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            }
        });
    };

    const handleAddHonkai = () => {
        if (honkaiUID.length !== 9) {
            toast({ title: "Error", description: "UID must be 9 digits long", variant: "destructive" });
            return;
        }
        addHonkaiMutation.mutate(honkaiUID, {
            onSuccess: () => {
                setIsHonkaiDialogOpen(false);
                setHonkaiUID('');
                toast({ title: "Success", description: "Honkai: Star Rail account added successfully" });
            },
            onError: (error) => {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            }
        });
    };

    const handleRemoveHonkai = () => {
        removeHonkaiMutation.mutate(undefined, {
            onSuccess: () => {
                toast({ title: "Success", description: "Honkai: Star Rail account removed successfully" });
            },
            onError: (error) => {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            }
        });
    };

    const handleConnectHoyolab = useCallback(() => {
        setIsConnectingHoyolab(true);
        const authWindow = window.open('https://www.hoyolab.com/home', '_blank', 'width=600,height=600');

        if (authWindow) {
            const checkConnection = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkConnection);
                    setIsConnectingHoyolab(false);
                    toast({ title: "Connection attempt closed", description: "Please try again if you didn't complete the process." });
                } else {
                    try {
                        authWindow.postMessage({ type: 'GET_HOYOLAB_TOKENS' }, 'https://www.hoyolab.com');
                    } catch (error) {
                        // Ignore cross-origin errors
                    }
                }
            }, 1000);
        }
    }, [toast]);

    const handleHoyolabAuth = useCallback((event: MessageEvent) => {
        if (event.origin !== 'https://www.hoyolab.com') return;

        if (event.data.type === 'HOYOLAB_TOKENS') {
            const { ltokenV2, ltuidV2 } = event.data;
            addHoyolabTokensMutation.mutate({ ltokenV2, ltuidV2 }, {
                onSuccess: () => {
                    toast({ title: "Success", description: "HoYoLAB account connected successfully" });
                    setIsConnectingHoyolab(false);
                },
                onError: (error) => {
                    toast({ title: "Error", description: error.message, variant: "destructive" });
                    setIsConnectingHoyolab(false);
                }
            });
        }
    }, [addHoyolabTokensMutation, toast]);

    useEffect(() => {
        window.addEventListener('message', handleHoyolabAuth);
        return () => {
            window.removeEventListener('message', handleHoyolabAuth);
        };
    }, [handleHoyolabAuth]);

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Genshin Impact</h3>
                    {userData.genshinUid ? (
                        <p className="text-sm text-gray-500">UID: {userData.genshinUid}</p>
                    ) : (
                        <p className="text-sm text-gray-500">Not connected</p>
                    )}
                </div>
                {userData.genshinUid ? (
                    <Button variant="outline" onClick={handleRemoveGenshin}>Disconnect</Button>
                ) : (
                    <Dialog open={isGenshinDialogOpen} onOpenChange={setIsGenshinDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Connect</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Connect Genshin Impact</DialogTitle>
                            </DialogHeader>
                            <Input
                                placeholder="Enter Genshin UID"
                                value={genshinUID}
                                onChange={(e) => setGenshinUID(e.target.value.slice(0, 9))}
                                maxLength={9}
                            />
                            <Button onClick={handleAddGenshin}>Add Account</Button>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Honkai: Star Rail</h3>
                    {userData.honkaiId ? (
                        <p className="text-sm text-gray-500">UID: {userData.honkaiId}</p>
                    ) : (
                        <p className="text-sm text-gray-500">Not connected</p>
                    )}
                </div>
                {userData.honkaiId ? (
                    <Button variant="outline" onClick={handleRemoveHonkai}>Disconnect</Button>
                ) : (
                    <Dialog open={isHonkaiDialogOpen} onOpenChange={setIsHonkaiDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Connect</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Connect Honkai: Star Rail</DialogTitle>
                            </DialogHeader>
                            <Input
                                placeholder="Enter Honkai UID"
                                value={honkaiUID}
                                onChange={(e) => setHonkaiUID(e.target.value.slice(0, 9))}
                                maxLength={9}
                            />
                            <Button onClick={handleAddHonkai}>Add Account</Button>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">HoYoLAB</h3>
                    {userData.hoyolabConnected ? (
                        <p className="text-sm text-gray-500">Connected</p>
                    ) : (
                        <p className="text-sm text-gray-500">Not connected</p>
                    )}
                </div>
                {userData.hoyolabConnected ? (
                    <Button variant="outline" onClick={() => {/* Handle disconnect */}}>Disconnect</Button>
                ) : (
                    <Button onClick={handleConnectHoyolab} disabled={isConnectingHoyolab}>
                        {isConnectingHoyolab ? 'Connecting...' : 'Connect HoYoLAB'}
                    </Button>
                )}
            </div>
        </>
    );
}
