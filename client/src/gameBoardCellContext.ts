import { atom } from 'jotai';
import React from 'react';
import { GameCellState } from './game';
import { GameBoardContextValue } from './gameBoardContext';

export type GameBoardCellContextValue = ReturnType<typeof makeGameBoardCellAtoms>;

export const GameBoardCellContext = React.createContext<GameBoardCellContextValue | undefined>(undefined);

export const makeGameBoardCellAtoms = (state: { x: number; y: number; gameBoardContext: GameBoardContextValue }) => {
    const { gameBoardCellMapAtom } = state.gameBoardContext;

    const gameCellStateAtom = atom(
        (get) => get(gameBoardCellMapAtom).get(state.x)!.get(state.y)!,
        (get, set, cellState: GameCellState) => {
            const next = new Map(get(gameBoardCellMapAtom));
            next.get(state.x)!.set(state.y, cellState);

            if (next.get(state.x + 1)) {
                const other = next.get(state.x + 1)!.get(state.y)!;
                other.isHighlighted = cellState.isHighlighted;
                next.get(state.x + 1)!.set(state.y, { ...other });
            }

            set(gameBoardCellMapAtom, next);
        }
    );

    return {
        gameCellStateAtom
    };
};
