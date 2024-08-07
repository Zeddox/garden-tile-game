import { getRouteApi } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import { LoadingSpinner } from './components/loading/LoadingSpinner';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './components/ui/carousel';
import { IGameDto, TileRotation } from './generated/backend';
import { useGame, useRecordGameTurn } from './services/gameApi';
import { useSelectedUser } from './useSelectedUser';
import { ITileDto, TileShape } from './generated/backend';
import { GamePiece } from './gamePieces/GamePiece';

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
    console.log({ currentPlayer });

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

    return game === undefined || selectedUser === undefined ? (
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
                            {(Object.values(gamePieces) as ITileDto[][]).map((tiles) => (
                                <div className={'flex w-1/4 flex-row flex-wrap justify-evenly'}>
                                    {tiles.map((tile) => (
                                        <GamePiece tileShape={TileShape.Single} size={10} tile={tile} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={'flex h-[55rem] gap-16'}>
                    <Carousel className={'flex-1'} setApi={setApi}>
                        <CarouselContent>
                            {opponents.map((player, index) => (
                                <CarouselItem key={index}>
                                    <div className={'text-center'}>
                                        <Card
                                            className={
                                                'mb-2 h-[55rem] border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'
                                            }
                                        ></Card>
                                        <span className={'text-3xl font-extralight tracking-wider text-muted-foreground'}>
                                            {player.name}
                                        </span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {opponents.length > 1 && (
                            <div>
                                <CarouselPrevious />
                                <CarouselNext />
                            </div>
                        )}
                    </Carousel>
                    <div className={'flex-1 text-center'}>
                        <Card
                            className={
                                'mb-2 h-[55rem] border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'
                            }
                        >
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
    console.log({ game, last: game?.turns.sort((a, b) => b.turnNumber - a.turnNumber)[0].playerId });
    const lastTurnPlayer = game?.players.find(
        (x) => x.id === game?.turns.sort((a, b) => b.turnNumber - a.turnNumber)[0].playerId
    );
    console.log({ lastTurnPlayer, orderEq: (lastTurnPlayer?.order ?? 0) < (game?.players.length ?? 0) });
    if (lastTurnPlayer === undefined || game === undefined) {
        return undefined;
    }
    if ((lastTurnPlayer.order ?? 0) < game.players.length) {
        return game.players.find((x) => x.order === (lastTurnPlayer.order ?? 0) + 1);
    } else {
        return game.players.find((x) => x.order === 1);
    }
};
