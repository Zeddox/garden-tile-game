export type GameCellState = {
    isHighlighted: boolean;
    //isValidForPlacement: boolean;
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
