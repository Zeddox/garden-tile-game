import { atom } from 'jotai';
import React from 'react';
import { GameCellState, getGameBoardCellsFromPlayerTurns } from './game';
import { IPlayerDto, ITurnDto, TileDto } from '../generated/backend';

export type GameBoardContextValue = ReturnType<typeof makeGameBoardAtoms>;

export const GameBoardContext = React.createContext<GameBoardContextValue | undefined>(undefined);

export const makeGameBoardAtoms = (state: {
    onPlacePiece: (placement: { x: number; y: number; layer: number }) => void;
    playerTurns: ITurnDto[];
    player: IPlayerDto;
    tileMap: Map<string, TileDto>;
}) => {
    const gameBoardCellMapAtom = atom<Map<number, Map<number, GameCellState>>>(
        getGameBoardCellsFromPlayerTurns(state.playerTurns, state.player, state.tileMap)
    );
    const placePieceCallbackAtom = atom<((placement: { x: number; y: number }) => void) | undefined>(undefined);

    const placePieceAtom = atom(null, (get, _, placement: { x: number; y: number; layer: number }) => {
        const callback = get(placePieceCallbackAtom);
        callback?.(placement);
    });

    return {
        gameBoardCellMapAtom,
        placePieceCallbackAtom,
        placePieceAtom
    };
};
