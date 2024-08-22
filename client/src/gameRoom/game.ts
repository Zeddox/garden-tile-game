import { ITileDto, ITurnDto } from '@/generated/backend';

export type GameCellState = {
    isHighlighted: boolean;
    //isValidForPlacement: boolean;
};

export type GamePieces = {
    singlePieces: ITileDto[];
    doublePieces: ITileDto[];
    triplePieces: ITileDto[];
    cornerPieces: ITileDto[];
};

export const getGameBoardCellsFromPlayerTurns = (playerTurns: ITurnDto[]) => {
    const gameBoardCellsState = new Map<number, Map<number, GameCellState>>(
        new Map(
            Array.from({ length: 6 }).map((_, x) => [
                x,
                new Map(Array.from({ length: 6 }).map((_, y) => [y, { isHighlighted: false }]))
            ])
        )
    );

    return gameBoardCellsState;
};
