import { TileShape } from '@/generated/backend';
import { atom } from 'jotai';
import React from 'react';
import { GameCellState, getCellType } from './game';
import { GameBoardContextValue } from './gameBoardContext';
import { GameRoomContextValue } from './gameRoomContext';

export type GameBoardCellContextValue = ReturnType<typeof makeGameBoardCellAtoms>;

export const GameBoardCellContext = React.createContext<GameBoardCellContextValue | undefined>(undefined);

export const makeGameBoardCellAtoms = (state: {
    x: number;
    y: number;
    gameBoardContext: GameBoardContextValue;
    gameRoomContext: GameRoomContextValue;
}) => {
    const { gameBoardCellMapAtom } = state.gameBoardContext;
    const { selectedPieceAtom } = state.gameRoomContext;

    const gameCellStateAtom = atom(
        (get) => get(gameBoardCellMapAtom).get(state.x)!.get(state.y)!,
        (get, set, cellState: GameCellState) => {
            const selectedPiece = get(selectedPieceAtom);
            const cellType = getCellType(state.y);

            if (selectedPiece) {
                const next = new Map(get(gameBoardCellMapAtom));
                next.get(state.x)!.set(state.y, cellState);

                const current = next.get(state.x)!.get(state.y)!;
                current.isValidForPlacement = cellType === selectedPiece.type;

                if (selectedPiece.shape === TileShape.Double) {
                    if (next.get(state.x + 1)) {
                        const other = next.get(state.x + 1)!.get(state.y)!;
                        other.isHighlighted = cellState.isHighlighted;
                        other.isValidForPlacement = current.isValidForPlacement && true;
                        next.get(state.x + 1)!.set(state.y, { ...other });
                    } else {
                        current.isValidForPlacement = false;
                    }
                }

                if (selectedPiece.shape === TileShape.Triple) {
                    const other = next.get(state.x)?.get(state.y + 1);
                    const nextOther = next.get(state.x)?.get(state.y + 2);

                    if (other && nextOther) {
                        other.isHighlighted = cellState.isHighlighted;
                        other.isValidForPlacement = current.isValidForPlacement && true;

                        nextOther.isHighlighted = cellState.isHighlighted;
                        nextOther.isValidForPlacement = current.isValidForPlacement && true;

                        next.get(state.x)!.set(state.y + 1, { ...other });
                        next.get(state.x)!.set(state.y + 2, { ...nextOther });
                    } else {
                        current.isValidForPlacement = false;

                        if (other) {
                            other.isHighlighted = cellState.isHighlighted;
                            other.isValidForPlacement = false;

                            next.get(state.x)!.set(state.y + 1, { ...other });
                        }
                    }
                }

                if (selectedPiece.shape === TileShape.Corner) {
                    const nextX = next.get(state.x + 1);
                    const otherY = next.get(state.x)?.get(state.y + 1);

                    if (nextX && otherY) {
                        const otherX = next.get(state.x + 1)!.get(state.y)!;
                        otherY.isHighlighted = cellState.isHighlighted;
                        otherY.isValidForPlacement = current.isValidForPlacement && true;

                        otherX.isHighlighted = cellState.isHighlighted;
                        otherX.isValidForPlacement = current.isValidForPlacement && true;

                        next.get(state.x + 1)!.set(state.y, { ...otherX });
                        next.get(state.x)!.set(state.y + 1, { ...otherY });
                    } else {
                        current.isValidForPlacement = false;

                        if (nextX) {
                            const otherX = next.get(state.x + 1)!.get(state.y)!;
                            otherX.isHighlighted = cellState.isHighlighted;
                            otherX.isValidForPlacement = false;
                            next.get(state.x + 1)!.set(state.y, { ...otherX });
                        }

                        if (otherY) {
                            otherY.isHighlighted = cellState.isHighlighted;
                            otherY.isValidForPlacement = false;
                            next.get(state.x)!.set(state.y + 1, { ...otherY });
                        }
                    }
                }

                set(gameBoardCellMapAtom, next);
            }
        }
    );

    return {
        gameCellStateAtom
    };
};
