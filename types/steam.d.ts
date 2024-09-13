export interface SteamGame {
    appid: number;
    name?: string; // Name may not be present in the initial API response
    playtime_forever: number; // playtime in minutes
    imgUrl?: string; // You may want to fetch this later
    img_icon_url?: string;
}

export interface SteamGamesResponse {
    response: {
        game_count: number;
        games: SteamGame[];
    };
    nextCursor: string;
}
