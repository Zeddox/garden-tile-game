export interface PlayerGameData {
    gameId: string;
    playerId: string;
};

export const saveGameDataToSessionStorage = (data: PlayerGameData) => {
    var sessionGameData = sessionStorage.getItem("games");

    if (sessionGameData) {
        const games = JSON.parse(sessionGameData) as PlayerGameData[];
        sessionStorage.setItem("games", JSON.stringify([...games, data]));
    } else {
        sessionStorage.setItem("games", JSON.stringify([data]));
    }
}