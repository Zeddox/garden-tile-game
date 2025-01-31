import { TileShape } from '@/generated/backend';
import { atom } from 'jotai';
import React from 'react';
import {
    GameCellState,
    getCellType,
    getCornerPieceRotatedOffsets,
    getDoublePieceRotatedOffsets,
    getTriplePieceRotatedOffsets
} from './game';
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
    const { gameBoardCellMapAtom, playerAtom } = state.gameBoardContext;
    const { selectedPieceAtom, selectedPieceRotationAtom, playerColumnStateAtom } = state.gameRoomContext;

    const gameCellStateAtom = atom(
        (get) => get(gameBoardCellMapAtom).get(state.x)!.get(state.y)!,
        (get, set, cellState: GameCellState) => {
            const selectedPiece = get(selectedPieceAtom);
            const selectedPieceRotation = get(selectedPieceRotationAtom);
            const playerColumnState = get(playerColumnStateAtom);
            const currentPlayer = get(playerAtom);
            const currentPlayerColumnState = playerColumnState.get(currentPlayer.id) ?? [];

            const cellType = getCellType(state.y);

            if (selectedPiece === undefined) {
                return;
            }

            const next = new Map(get(gameBoardCellMapAtom));
            next.get(state.x)!.set(state.y, cellState);

            const current = next.get(state.x)!.get(state.y)!;
            current.isValidForPlacement = cellType === selectedPiece.type && !currentPlayerColumnState.includes(state.x);

            if (selectedPiece.shape === TileShape.Double) {
                const offset = getDoublePieceRotatedOffsets(selectedPieceRotation);
                const otherX = next.get(state.x + offset.other[0]);
                const otherY = otherX?.get(state.y + offset.other[1]);

                if (otherX && otherY && otherY.layer === current.layer) {
                    const other = otherY;
                    other.isHighlighted = cellState.isHighlighted;
                    other.isValidForPlacement = current.isValidForPlacement && true;
                    otherX.set(state.y + offset.other[1], { ...other });
                } else {
                    current.isValidForPlacement = false;

                    if (otherX && otherY) {
                        otherY.isHighlighted = cellState.isHighlighted;
                        otherY.isValidForPlacement = false;

                        otherX.set(state.y + offset.other[1], { ...otherY });
                    }
                }
            }

            if (selectedPiece.shape === TileShape.Triple) {
                const offset = getTriplePieceRotatedOffsets(selectedPiece, selectedPieceRotation);

                const otherA = next.get(state.x + offset.otherA[0])?.get(state.y + offset.otherA[1]);
                const otherB = next.get(state.x + offset.otherB[0])?.get(state.y + offset.otherB[1]);

                if (otherA && otherB && current.layer === otherA.layer && current.layer === otherB.layer) {
                    otherA.isHighlighted = cellState.isHighlighted;
                    otherA.isValidForPlacement = current.isValidForPlacement && true;

                    otherB.isHighlighted = cellState.isHighlighted;
                    otherB.isValidForPlacement = current.isValidForPlacement && true;

                    next.get(state.x + offset.otherA[0])!.set(state.y + offset.otherA[1], { ...otherA });
                    next.get(state.x + offset.otherB[0])!.set(state.y + offset.otherB[1], { ...otherB });
                } else {
                    current.isValidForPlacement = false;

                    if (otherA) {
                        otherA.isHighlighted = cellState.isHighlighted;
                        otherA.isValidForPlacement = false;

                        next.get(state.x + offset.otherA[0])!.set(state.y + offset.otherA[1], { ...otherA });
                    }

                    if (otherB) {
                        otherB.isHighlighted = cellState.isHighlighted;
                        otherB.isValidForPlacement = false;

                        next.get(state.x + offset.otherB[0])!.set(state.y + offset.otherB[1], { ...otherB });
                    }
                }
            }

            if (selectedPiece.shape === TileShape.Corner) {
                const offset = getCornerPieceRotatedOffsets(selectedPieceRotation);
                const otherX = next.get(state.x + offset.otherX[0])?.get(state.y + offset.otherX[1]);
                const otherY = next.get(state.x + offset.otherY[0])?.get(state.y + offset.otherY[1]);

                if (otherX && otherY && current.layer === otherX.layer && current.layer === otherY.layer) {
                    otherY.isHighlighted = cellState.isHighlighted;
                    otherY.isValidForPlacement = current.isValidForPlacement && true;

                    otherX.isHighlighted = cellState.isHighlighted;
                    otherX.isValidForPlacement = current.isValidForPlacement && true;

                    next.get(state.x + offset.otherX[0])!.set(state.y + offset.otherX[1], { ...otherX });
                    next.get(state.x + offset.otherY[0])!.set(state.y + offset.otherY[1], { ...otherY });
                } else {
                    current.isValidForPlacement = false;

                    if (otherX) {
                        otherX.isHighlighted = cellState.isHighlighted;
                        otherX.isValidForPlacement = false;
                        next.get(state.x + offset.otherX[0])!.set(state.y + offset.otherX[1], { ...otherX });
                    }

                    if (otherY) {
                        otherY.isHighlighted = cellState.isHighlighted;
                        otherY.isValidForPlacement = false;
                        next.get(state.x + offset.otherY[0])!.set(state.y + offset.otherY[1], { ...otherY });
                    }
                }
            }

            set(gameBoardCellMapAtom, next);
        }
    );

    return {
        gameCellStateAtom
    };
};
