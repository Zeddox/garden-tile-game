import { IGameDto, IPlayerDto, ITileDto, ITurnDto, TileDto, TileRotation, TileShape, TileType } from '@/generated/backend';

export type GameCellState = {
    isHighlighted: boolean;
    isOrigin: boolean;
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

export type GameboardDoublePieceOffsets = {
    origin: [number, number];
    other: [number, number];
};

export type GameboardTriplePieceOffsets = {
    origin: [number, number];
    otherA: [number, number]; //in the case of type being in the middle, other is always to the right
    otherB: [number, number];
};

export type GameboardCornerPieceOffsets = {
    origin: [number, number];
    otherX: [number, number];
    otherY: [number, number];
};

export type ColumnData = {
    index: number;
    isUsed: boolean;
};

export type RowState = {
    layers: number;
    tileQuantity: number;
};

export const getGameBoardCellsFromPlayerTurns = (playerTurns: ITurnDto[], player: IPlayerDto, tileMap: Map<string, TileDto>) => {
    const gameBoardCellsState = new Map<number, Map<number, GameCellState>>(
        new Map(
            Array.from({ length: 6 }).map((_, x) => [
                x,
                new Map(Array.from({ length: 6 }).map((_, y) => [y, { isHighlighted: false, isOrigin: false }]))
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
                cellState.tileType = tile.type;
                cellState.typeQuantity = tile.typeQuantity;

                const rotation = getRotationFromTileRotationEnum(turn.rotation);

                if (tile.shape === TileShape.Double) {
                    const offset = getDoublePieceRotatedOffsets(rotation);
                    const other = gameBoardCellsState
                        .get(turn.positionX + offset.other[0])!
                        .get(turn.positionY + offset.other[1]);
                    if (other) {
                        other.tileType = undefined;
                        other.typeQuantity = undefined;
                        other.layer = turn.layer;
                    }
                }

                if (tile.shape === TileShape.Triple) {
                    const offset = getTriplePieceRotatedOffsets(tile, rotation);
                    const otherA = gameBoardCellsState
                        .get(turn.positionX + offset.otherA[0])
                        ?.get(turn.positionY + offset.otherA[1]);
                    const otherB = gameBoardCellsState
                        .get(turn.positionX + offset.otherB[0])
                        ?.get(turn.positionY + offset.otherB[1]);

                    if (otherA && otherB) {
                        otherA.tileType = undefined;
                        otherA.typeQuantity = undefined;
                        otherA.layer = turn.layer;

                        otherB.tileType = undefined;
                        otherB.typeQuantity = undefined;
                        otherB.layer = turn.layer;
                    }
                }

                if (tile.shape === TileShape.Corner) {
                    const offset = getCornerPieceRotatedOffsets(rotation);
                    const otherX = gameBoardCellsState
                        .get(turn.positionX + offset.otherX[0])
                        ?.get(turn.positionY + offset.otherX[1]);
                    const otherY = gameBoardCellsState
                        .get(turn.positionX + offset.otherY[0])
                        ?.get(turn.positionY + offset.otherY[1]);

                    if (otherX) {
                        otherX.tileType = undefined;
                        otherX.typeQuantity = undefined;
                        otherX.layer = turn.layer;
                    }
                    if (otherY) {
                        otherY.tileType = undefined;
                        otherY.typeQuantity = undefined;
                        otherY.layer = turn.layer;
                    }
                }
            }
        }
    }

    return gameBoardCellsState;
};

type GameRoomState = {
    round: number;
    roundPieces: TileDto[];
    playerColumnState: Map<string, number[]>;
    fifthLayerBonuses: { tileType: TileType; playerId?: string }[];
    playState: 'inProgress' | 'gameOver';
};

export const getRoundAndRoundPiecesFromPlayerTurns = (game: IGameDto, playerTurns: ITurnDto[], maxRound: number) => {
    const turns = playerTurns.sort((a, b) => a.turnNumber - b.turnNumber);

    const result: GameRoomState = {
        playState: 'inProgress',
        round: 1,
        roundPieces: getRoundTiles(game, 1),
        playerColumnState: new Map<string, number[]>(),
        fifthLayerBonuses: [
            { tileType: TileType.MapleTree },
            { tileType: TileType.Pagoda },
            { tileType: TileType.Fish },
            { tileType: TileType.AzaleaBush },
            { tileType: TileType.Boxwood },
            { tileType: TileType.Stone }
        ]
    };

    const round = turns.reduce((round, turn) => {
        if (turn.layer === 5) {
            const tileType = getRoundTiles(game, turn.round).find((x) => x.id === turn.tileId)?.type;
            if (tileType) {
                const fifthLayerBonus = result.fifthLayerBonuses.find((x) => x.tileType === tileType);
                if (fifthLayerBonus !== undefined && fifthLayerBonus.playerId === undefined) {
                    fifthLayerBonus.playerId = turn.playerId;
                }
            }
        }
        if (turn.round > round) {
            return round + 1;
        }
        return round;
    }, 1);

    result.round = round;
    result.roundPieces = getRoundTiles(game, round);

    const roundTurns = turns.filter((x) => x.round === round);

    for (const turn of roundTurns) {
        if (!result.playerColumnState.has(turn.playerId)) {
            result.playerColumnState.set(turn.playerId, []);
        }
        const playerColumnState = result.playerColumnState.get(turn.playerId);
        playerColumnState!.push(turn.positionX);

        const pieceIndex = result.roundPieces.findIndex((x) => x.id === turn.tileId);
        if (pieceIndex >= 0) {
            result.roundPieces.splice(pieceIndex, 1);
        }
    }
    
    const playerPasses = new Set<string>();
    const reversedTurns = roundTurns.reverse();
    
    for (const turn of reversedTurns) {
        if (turn.rotation === TileRotation.Pass || result.playerColumnState.get(turn.playerId)?.length === 6) {
            playerPasses.add(turn.playerId);
         }
         else {
            break;
         }
    }
    
    if (result.roundPieces.length === 0 || playerPasses.size === game.players.length) {
        if (result.round < maxRound) {
            result.round += 1;
            result.roundPieces = getRoundTiles(game, result.round);
            result.playerColumnState.clear();
        } else {
            console.log('GAME OVER');
            result.playState = 'gameOver';
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

export const getDoublePieceRotatedOffsets: (selectedPieceRotation: 0 | 90 | 180 | 270 | 360) => GameboardDoublePieceOffsets = (
    selectedPieceRotation: 0 | 90 | 180 | 270 | 360
) => {
    switch (selectedPieceRotation) {
        case 0:
        case 360:
            return {
                origin: [0, 0],
                other: [1, 0]
            };
        case 90:
            return {
                origin: [0, 0],
                other: [0, 1]
            };
        case 180:
            return {
                origin: [0, 0],
                other: [-1, 0]
            };
        case 270:
            return {
                origin: [0, 0],
                other: [0, -1]
            };
        default:
            return {
                origin: [0, 0],
                other: [1, 0]
            };
    }
};

export const getTriplePieceRotatedOffsets: (
    selectedPiece: ITileDto,
    selectedPieceRotation: 0 | 90 | 180 | 270 | 360
) => GameboardTriplePieceOffsets = (selectedPiece, selectedPieceRotation) => {
    const isMiddlePiece = selectedPiece.typePositionY === 1;

    switch (selectedPieceRotation) {
        case 0:
        case 360:
            return {
                origin: [0, 0],
                otherA: [0, 1],
                otherB: !isMiddlePiece ? [0, 2] : [0, -1]
            };
        case 90:
            return {
                origin: [0, 0],
                otherA: [-1, 0],
                otherB: !isMiddlePiece ? [-2, 0] : [1, 0]
            };
        case 180:
            return {
                origin: [0, 0],
                otherA: [0, -1],
                otherB: !isMiddlePiece ? [0, -2] : [0, 1]
            };
        case 270:
            return {
                origin: [0, 0],
                otherA: [1, 0],
                otherB: !isMiddlePiece ? [2, 0] : [-1, 0]
            };
        default:
            return {
                origin: [0, 0],
                otherA: [0, 1],
                otherB: [0, 2]
            };
    }
};

export const getCornerPieceRotatedOffsets: (selectedPieceRotation: 0 | 90 | 180 | 270 | 360) => GameboardCornerPieceOffsets = (
    selectedPieceRotation
) => {
    switch (selectedPieceRotation) {
        case 0:
        case 360:
            return {
                origin: [0, 0],
                otherX: [1, 0],
                otherY: [0, 1]
            };
        case 90:
            return {
                origin: [0, 0],
                otherX: [-1, 0],
                otherY: [0, 1]
            };
        case 180:
            return {
                origin: [0, 0],
                otherX: [-1, 0],
                otherY: [0, -1]
            };
        case 270:
            return {
                origin: [0, 0],
                otherX: [1, 0],
                otherY: [0, -1]
            };
        default:
            return {
                origin: [0, 0],
                otherX: [0, 1],
                otherY: [0, 2]
            };
    }
};

export const getRotationFromTileRotationEnum = (tileRotation: TileRotation) => {
    switch (tileRotation) {
        case TileRotation.Zero:
            return 0;
        case TileRotation.Ninety:
            return 90;
        case TileRotation.OneHundredEighty:
            return 180;
        case TileRotation.TwoHunderedSeventy:
            return 270;
        default:
            return 0;
    }
};

export const initColumnData: () => ColumnData[] = () => {
    return Array.from({ length: 6 }).map((_, i) => ({
        index: i,
        isUsed: false
    }));
};

export const getFifthLayerBonusAmount = (tileType: TileType) => {
    switch (tileType) {
        case TileType.MapleTree:
            return 10;
        case TileType.Pagoda:
            return 9;
        case TileType.Fish:
            return 8;
        case TileType.AzaleaBush:
            return 7;
        case TileType.Boxwood:
            return 6;
        case TileType.Stone:
            return 5;
        default:
            return 0;
    }
};

export const getMostQuantityBonuses = (tileType: TileType) => {
    switch (tileType) {
        case TileType.MapleTree:
            return 15;
        case TileType.Pagoda:
            return 12;
        case TileType.Fish:
            return 9;
        case TileType.AzaleaBush:
            return 8;
        case TileType.Boxwood:
            return 7;
        case TileType.Stone:
            return 6;
        default:
            return 0;
    }
 };

 export const getSecondMostQuantityBonuses = (tileType: TileType) => {
    switch (tileType) {
        case TileType.MapleTree:
            return 7;
        case TileType.Pagoda:
            return 6;
        case TileType.Fish:
            return 4;
        case TileType.AzaleaBush:
            return 4;
        case TileType.Boxwood:
            return 3;
        case TileType.Stone:
            return 3;
        default:
            return 0;
    }
 };