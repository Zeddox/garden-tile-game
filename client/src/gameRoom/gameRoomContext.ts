import { atom } from 'jotai';
import React from 'react';
import { IGameDto, IPlayerDto, ITileDto, IUserDto, TileType } from '../generated/backend';
import { getRoundTiles } from './game';

export type GameRoomContextValue = ReturnType<typeof makeGameRoomAtoms>;

export const GameRoomContext = React.createContext<GameRoomContextValue | undefined>(undefined);

export const makeGameRoomAtoms = (state: { game: IGameDto; selectedUser: IUserDto }) => {
    const gameAtom = atom(state.game);

    const myPlayerAtom = atom(state.game.players.find((x) => x.userId === state.selectedUser.id)!);
    const currentPlayerAtom = atom<IPlayerDto | undefined>(undefined);

    const selectedPieceAtom = atom<ITileDto | undefined>(undefined);
    const selectedPieceRotationAtom = atom<0 | 90 | 180 | 270>(0);
    const roundAtom = atom<number>(1);
    const maxRoundAtom = atom<number>(state.game.players.length >= 4 ? 4 : state.game.players.length >= 3 ? 5 : 6);
    const roundPiecesAtom = atom<ITileDto[]>(getRoundTiles(state.game, 1));
    const removePieceAtom = atom(null, (get, set, piece: ITileDto) => {
        const next = [...get(roundPiecesAtom)];
        const pieceIndex = next.findIndex((x) => x.id === piece.id);
        if (pieceIndex >= 0) {
            next.splice(pieceIndex, 1);
        }
        if (next.length === 0) {
            const round = get(roundAtom);
            if (round < get(maxRoundAtom)) {
                set(roundAtom, round + 1);
                set(roundPiecesAtom, getRoundTiles(get(gameAtom), round + 1));
            } else {
                // TODO: Game Over
                console.log('GAME OVER');
            }
        } else {
            set(roundPiecesAtom, next);
        }
        set(selectedPieceAtom, undefined);
        set(selectedPieceRotationAtom, 0);
    });

    const playerColumnStateAtom = atom(new Map<string, number[]>());

    const fifthLayerBonusesAtom = atom<{ tileType: TileType; playerId?: string }[]>([]);

    return {
        gameAtom,
        myPlayerAtom,
        currentPlayerAtom,
        selectedPieceAtom,
        roundAtom,
        maxRoundAtom,
        roundPiecesAtom,
        removePieceAtom,
        selectedPieceRotationAtom,
        playerColumnStateAtom,
        fifthLayerBonusesAtom
    };
};
