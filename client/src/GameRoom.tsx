import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';
import { FaCrown } from 'react-icons/fa';
import { LoadingSpinner } from './components/loading/LoadingSpinner';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './components/ui/carousel';
import { TileRotation } from './generated/backend';
import { useGame, useRecordGameTurn } from './services/gameApi';
import { useSelectedUser } from './useSelectedUser';

const route = getRouteApi('/game/$gameId/room');

export const GameRoom = () => {
    const { gameId } = route.useParams();
    const selectedUser = useSelectedUser();

    const { data: game } = useGame(gameId);
    const { mutate: recordTurn } = useRecordGameTurn(gameId);

    const players = useMemo(() => {
        return game?.players ?? [];
    }, [game]);

    const currentPlayer = game?.players.find((x) => x.userId === selectedUser?.id);

    const opponents = useMemo(() => {
        return game?.players.filter((player) => player.userId !== selectedUser?.id) ?? [];
    }, [game, selectedUser]);

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
                    <div className={'bg-slate w-3/4 flex-auto border-l border-white'}>
                        <span className={'ml-5 text-xl'}>{'Round 1'}</span>
                    </div>
                </div>
                <div className={'flex h-[55rem] gap-16'}>
                    <Carousel className={'flex-1'}>
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
                            <Button
                                onClick={() =>
                                    recordTurn({
                                        playerId: currentPlayer!.id,
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
                        </Card>
                        <span className={'text-3xl font-extralight tracking-wider text-[--primary-90]'}>
                            {currentPlayer?.name}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
