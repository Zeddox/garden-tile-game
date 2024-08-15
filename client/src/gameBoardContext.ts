import { atom } from 'jotai';
import React from 'react';
import { GameCellState, getGameBoardCellsFromPlayerTurns } from './game';
import { ITurnDto } from './generated/backend';

export type GameBoardContextValue = ReturnType<typeof makeGameBoardAtoms>;

export const GameBoardContext = React.createContext<GameBoardContextValue | undefined>(undefined);

export const makeGameBoardAtoms = (state: {
    onPlacePiece: (placement: { x: number; y: number }) => void;
    playerTurns: ITurnDto[];
}) => {
    const gameBoardCellMapAtom = atom<Map<number, Map<number, GameCellState>>>(
        getGameBoardCellsFromPlayerTurns(state.playerTurns)
    );
    const placePieceCallbackAtom = atom<((placement: { x: number; y: number }) => void) | undefined>(undefined);

    const placePieceAtom = atom(null, (get, _, placement: { x: number; y: number }) => {
        const callback = get(placePieceCallbackAtom);
        callback?.(placement);
    });

    return {
        gameBoardCellMapAtom,
        placePieceCallbackAtom,
        placePieceAtom
    };
};
