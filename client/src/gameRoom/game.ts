import { IGameDto, IPlayerDto, ITileDto, ITurnDto, TileDto, TileShape, TileType } from '@/generated/backend';

export type GameCellState = {
    isHighlighted: boolean;
    isValidForPlacement?: boolean;
    layer?: number;
    tileType?: TileType;
    typeQuantity?: number;
};

export type GamePieces = {
    singlePieces: ITileDto[];
    doublePieces: ITileDto[];
    triplePieces: ITileDto[];
    cornerPieces: ITileDto[];
};

export const getGameBoardCellsFromPlayerTurns = (playerTurns: ITurnDto[], player: IPlayerDto, tileMap: Map<string, TileDto>) => {
    const gameBoardCellsState = new Map<number, Map<number, GameCellState>>(
        new Map(
            Array.from({ length: 6 }).map((_, x) => [
                x,
                new Map(Array.from({ length: 6 }).map((_, y) => [y, { isHighlighted: false }]))
            ])
        )
    );

    const turns = playerTurns.filter((x) => x.playerId === player?.id).sort((a, b) => a.layer - b.layer);
    for (const turn of turns) {
        const cellState = gameBoardCellsState.get(turn.positionX)?.get(turn.positionY);
        if (cellState) {
            cellState.layer = turn.layer;

            const tile = tileMap.get(turn.tileId);
            if (tile) {
                if (tile.typePositionX === 0 && tile.typePositionY === 0) {
                    cellState.tileType = tile.type;
                    cellState.typeQuantity = tile.typeQuantity;
                }

                if (tile.shape === TileShape.Double) {
                    const other = gameBoardCellsState.get(turn.positionX + 1)!.get(turn.positionY);
                    if (other) {
                        other.layer = turn.layer;
                    }
                }

                if (tile.shape === TileShape.Triple) {
                    const other = gameBoardCellsState.get(turn.positionX)?.get(turn.positionY + 1);
                    const gameBoardCellsStateOther = gameBoardCellsState.get(turn.positionX)?.get(turn.positionY + 2);

                    if (other) {
                        if (tile.typePositionX === 0 && tile.typePositionY === 1) {
                            other.tileType = tile.type;
                            other.typeQuantity = tile.typeQuantity;
                        }
                        other.layer = turn.layer;
                    }
                    if (gameBoardCellsStateOther) {
                        gameBoardCellsStateOther.layer = turn.layer;
                    }
                }

                if (tile.shape === TileShape.Corner) {
                    const otherX = gameBoardCellsState.get(turn.positionX + 1)?.get(turn.positionY);
                    const otherY = gameBoardCellsState.get(turn.positionX)?.get(turn.positionY + 1);

                    if (otherX) {
                        otherX.layer = turn.layer;
                    }
                    if (otherY) {
                        otherY.layer = turn.layer;
                    }
                }
            }
        }
    }

    return gameBoardCellsState;
};

export const getRoundAndRoundPiecesFromPlayerTurns = (game: IGameDto, playerTurns: ITurnDto[], maxRound: number) => {
    const turns = playerTurns.sort((a, b) => a.turnNumber - b.turnNumber);
    const round = turns.reduce((round, turn) => {
        if (turn.round > round) {
            return round + 1;
        }
        return round;
    }, 1);
    const result = { round: round, roundPieces: getRoundTiles(game, round) };
    for (const turn of turns.filter((x) => x.round === round)) {
        const pieceIndex = result.roundPieces.findIndex((x) => x.id === turn.tileId);
        if (pieceIndex >= 0) {
            result.roundPieces.splice(pieceIndex, 1);
        }
    }

    if (result.roundPieces.length === 0) {
        if (result.round < maxRound) {
            result.round += 1;
            result.roundPieces = getRoundTiles(game, result.round);
        } else {
            console.log('GAME OVER');
        }
    }

    return result;
};

export const getRoundTiles = (game: IGameDto, round: number) => {
    switch (round) {
        case 1:
            return [...game.firstRoundTiles];
        case 2:
            return [...game.secondRoundTiles];
        case 3:
            return [...game.thirdRoundTiles];
        case 4:
            return [...game.fourthRoundTiles];
        case 5:
            return [...game.fifthRoundTiles];
        case 6:
            return [...game.sixthRoundTiles];
        default:
            return [];
    }
};

export const getTileMap = (game: IGameDto) => {
    const tileMap = new Map<string, TileDto>();
    [
        ...game.firstRoundTiles,
        ...game.secondRoundTiles,
        ...game.thirdRoundTiles,
        ...game.fourthRoundTiles,
        ...game.fifthRoundTiles,
        ...game.sixthRoundTiles
    ].forEach((x) => tileMap.set(x.id, x));
    return tileMap;
};

export const getCellType = (y: number) => {
    switch (y) {
        case 0:
            return TileType.MapleTree;
        case 1:
            return TileType.Pagoda;
        case 2:
            return TileType.Fish;
        case 3:
            return TileType.AzaleaBush;
        case 4:
            return TileType.Boxwood;
        case 5:
            return TileType.Stone;
        default:
            throw new Error('Invalid y for determining cell type');
    }
};
