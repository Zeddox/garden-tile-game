import { atom } from 'jotai';
import React from 'react';
import { IPlayerDto, ITurnDto, TileDto } from '../generated/backend';
import { GameCellState, getGameBoardCellsFromPlayerTurns, RowState } from './game';

export type GameBoardContextValue = ReturnType<typeof makeGameBoardAtoms>;

export const GameBoardContext = React.createContext<GameBoardContextValue | undefined>(undefined);

export const makeGameBoardAtoms = (state: {
    onPlacePiece: (placement: { x: number; y: number; layer: number }) => void;
    playerTurns: ITurnDto[];
    player: IPlayerDto;
    tileMap: Map<string, TileDto>;
}) => {
    const gameBoardCells = getGameBoardCellsFromPlayerTurns(state.playerTurns, state.player, state.tileMap);

    const gameBoardCellMapAtom = atom<Map<number, Map<number, GameCellState>>>(gameBoardCells);

    // Derived atom
    // Derived from gameBoardCellMapAtom, changes to this atom will trigger changes to playerRowStateAtom
    const playerRowStateAtom = atom<Map<number, RowState>>((get) => getPlayerRowState(get(gameBoardCellMapAtom)));

    const placePieceCallbackAtom = atom<((placement: { x: number; y: number }) => void) | undefined>(undefined);

    const placePieceAtom = atom(null, (get, _, placement: { x: number; y: number; layer: number }) => {
        const callback = get(placePieceCallbackAtom);
        callback?.(placement);
    });

    const playerAtom = atom(state.player);

    return {
        gameBoardCellMapAtom,
        placePieceCallbackAtom,
        placePieceAtom,
        playerAtom,
        playerRowStateAtom
    };
};

export const getPlayerRowState = (gameBoardCells: ReturnType<typeof getGameBoardCellsFromPlayerTurns>) => {
    const rowState = new Map<number, RowState>();

    gameBoardCells.forEach((x) => {
        x.forEach((y, i) => {
            if (!rowState.has(i)) {
                rowState.set(i, { layers: 0, tileQuantity: 0 });
            }

            const state = rowState.get(i)!;

            if ((y.layer ?? 0) > state.layers && y.tileType !== undefined) {
                state.layers = y.layer!;
            }

            state.tileQuantity += y.typeQuantity ?? 0;
        });
    });

    return rowState;
};
