import { getRouteApi } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { LoadingSpinner } from './components/loading/LoadingSpinner';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from './components/ui/carousel';
import { GameBoard } from './GameBoard';
import { GamePiece } from './gamePieces/GamePiece';
import { IGameDto, ITileDto, TileRotation, TileShape } from './generated/backend';
import { useGame, useRecordGameTurn } from './services/gameApi';
import { useSelectedUser } from './useSelectedUser';

const route = getRouteApi('/game/$gameId/room');

interface IGamePieces {
    singlePieces: ITileDto[];
    doublePieces: ITileDto[];
    triplePieces: ITileDto[];
    cornerPieces: ITileDto[];
}

export const GameRoom = () => {
    const { gameId } = route.useParams();
    const selectedUser = useSelectedUser();

    const { data: game } = useGame(gameId);
    const { mutate: recordTurn } = useRecordGameTurn(gameId);

    const players = useMemo(() => {
        return game?.players ?? [];
    }, [game]);

    const myPlayer = game?.players.find((x) => x.userId === selectedUser?.id);

    const currentPlayer = getCurrentPlayer(game);

    const opponents = useMemo(() => {
        return game?.players.filter((player) => player.userId !== selectedUser?.id) ?? [];
    }, [game, selectedUser]);

    const gamePieces: IGamePieces = useMemo(() => {
        return {
            singlePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Single) ?? [],
            doublePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Double) ?? [],
            triplePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Triple) ?? [],
            cornerPieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Corner) ?? []
        };
    }, [game]);

    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) {
            return;
        }
        currentPlayer !== undefined && api?.scrollTo(opponents.findIndex((x) => x.id === currentPlayer.id));
    }, [api, currentPlayer, opponents]);

    const onPlacePiece = useCallback(
        (placement: { x: number; y: number }) =>
            recordTurn({
                playerId: myPlayer!.id,
                round: 1,
                turnNumber: game!.turns!.length + 1,
                layer: 1,
                positionX: placement.x,
                positionY: placement.y,
                rotation: TileRotation.Zero,
                tileId: game!.firstRoundTiles[0].id
            }),
        [game, myPlayer, recordTurn]
    );

    return game === undefined || selectedUser === undefined || myPlayer === undefined ? (
        <div className={'flex items-center justify-center'}>
            <LoadingSpinner />
        </div>
    ) : (
        <div>
            <div className={'mx-auto h-[50rem] w-full max-w-screen-2xl'}>
                <div className={'mb-5 mt-5 flex h-[15rem]'}>
                    <div className={'bg-slate w-1/4 flex-auto border-slate-700/40'}>
                        <span className={'text-xl'}>{'Players'}</span>
                        <div className={'mt-4 grid auto-rows-auto'}>
                            {players.map((player) => (
                                <div
                                    key={player.id}
                                    className={`flex items-center gap-3 ${player.gameLeader ? 'bg-[--primary-50] p-1' : ''}`}
                                >
                                    <span>{player.name}</span>
                                    <span className={'h-4 w-4 rounded-sm'} style={{ background: player.gamePieceColor }}></span>
                                    {player.gameLeader ? <FaCrown /> : null}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={'bg-slate h-full w-3/4 flex-auto border-l border-white'}>
                        <span className={'ml-5 text-xl'}>{'Round 1'}</span>
                        <div className={'mt-10 flex content-center'}>
                            {(Object.values(gamePieces) as ITileDto[][]).map((tiles, i) => (
                                <div key={i} className={'flex w-1/4 flex-row flex-wrap justify-evenly'}>
                                    {tiles.map((tile) => (
                                        <GamePiece key={tile.id} tileShape={TileShape.Single} size={10} tile={tile} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={'flex h-[55rem] gap-16'}>
                    <Carousel className={'flex-none'} setApi={setApi}>
                        <CarouselContent>
                            {opponents.map((player, index) => (
                                <CarouselItem key={index}>
                                    <div className={'text-center'}>
                                        <Card
                                            className={
                                                'mb-2 h-[55rem] border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'
                                            }
                                        >
                                            <div className={'h-[90%] content-center'}>
                                                <GameBoard game={game} player={player} onPlacePiece={() => {}} />
                                            </div>
                                        </Card>
                                        <span className={'text-3xl font-extralight tracking-wider text-muted-foreground'}>
                                            {player.name}
                                        </span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className={'flex-none text-center'}>
                        <Card
                            className={
                                'mb-2 h-[55rem] border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'
                            }
                        >
                            <div className={'h-[90%] content-center'}>
                                <GameBoard game={game} player={myPlayer} onPlacePiece={onPlacePiece} />
                            </div>
                            {currentPlayer?.id === myPlayer?.id ? (
                                <Button
                                    onClick={() =>
                                        recordTurn({
                                            playerId: myPlayer!.id,
                                            round: 1,
                                            turnNumber: game!.turns!.length + 1,
                                            layer: 1,
                                            positionX: 1,
                                            positionY: 1,
                                            rotation: TileRotation.Zero,
                                            tileId: game.firstRoundTiles[0].id
                                        })
                                    }
                                >
                                    {'Take Turn'}
                                </Button>
                            ) : (
                                `Waiting for ${currentPlayer?.name} to take their turn...`
                            )}
                        </Card>
                        <span className={'text-3xl font-extralight tracking-wider text-[--primary-90]'}>{myPlayer?.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getCurrentPlayer = (game: IGameDto | undefined) => {
    const lastTurnPlayer = game?.players.find(
        (x) => x.id === game?.turns.sort((a, b) => b.turnNumber - a.turnNumber)[0]?.playerId
    );
    if (game === undefined) {
        return undefined;
    }
    if (lastTurnPlayer === undefined) {
        return game.players.find((x) => x.id === game.startingPlayerId);
    }
    if ((lastTurnPlayer.order ?? 0) < game.players.length) {
        return game.players.find((x) => x.order === (lastTurnPlayer.order ?? 0) + 1);
    } else {
        return game.players.find((x) => x.order === 1);
    }
};
