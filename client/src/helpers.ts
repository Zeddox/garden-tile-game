import { ITileDto, TileShape } from "./generated/backend";

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

export const getGridCellFillColor = (tileShape: TileShape, index: number, tile?: ITileDto) => {
    const color = 'bg-green-500';

    if (tileShape !== TileShape.Corner) {
        return 'bg-[--primary-130]';
    }
    if (tileShape === TileShape.Corner && index !== 2) {
        return 'bg-[--primary-130]'

    } else {
        return 
    }
    if (tileShape === TileShape.Single && index === 4) {
        return tile === undefined ? 'bg-yellow-100 border-2 border-white' : color;
    } else if (tileShape === TileShape.Double && (index === 3 || index === 4)) {
        return tile === undefined ? 'bg-indigo-400 border-2 border-white' : color;
    } else if (tileShape === TileShape.Triple && (index <= 5 && index >= 3)) {
        return tile === undefined ? 'bg-green-400 border-2 border-white' : color;
    } else if (tileShape === TileShape.Corner && (index === 3 || index === 4 || index === 7)) {
        return tile === undefined ? 'bg-pink-400 border-2 border-white': color;
    } else {
        return ''
    }
}