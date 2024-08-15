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
import { ITileDto, TileShape } from './generated/backend';
import { GamePiece } from './gamePieces/GamePiece';
import { GameBoard } from './GameBoard';

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

    const currentPlayer = game?.players.find((x) => x.userId === selectedUser?.id);

    const opponents = useMemo(() => {
        return game?.players.filter((player) => player.userId !== selectedUser?.id) ?? [];
    }, [game, selectedUser]);

    const gamePieces: IGamePieces = useMemo(() => {
        return {
            singlePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Single) ?? [],
            doublePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Double) ?? [],
            triplePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Triple) ?? [],
            cornerPieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Corner) ?? [],
        }
    }, [game]);

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
                        <div className={'flex-auto w-3/4 h-full border-l border-white bg-slate'}>
                            <span className={'text-xl ml-5'}>Round 1</span>
                            <div className={'flex content-center mt-10'}>
                                {(Object.values(gamePieces) as ITileDto[][]).map((tiles) => (
                                    <div className={'w-1/4 flex flex-row justify-evenly flex-wrap'}>
                                        {tiles.map((tile) => (
                                            <GamePiece tileShape={TileShape.Single} size={10} tile={tile}/>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={'flex h-[55rem] gap-16'}>
                        <Carousel className={'flex-none'}>
                            <CarouselContent>
                                {opponents.map((player, index) => (
                                    <CarouselItem key={index}>
                                        <div className={'text-center'}>
                                            <Card
                                                className={
                                                    'mb-2 h-[55rem] w-[45rem] border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'
                                                }
                                            >
                                                <div className={'content-center h-[90%]'}>
                                                    <GameBoard size={11} />
                                                </div>
                                            </Card>
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
                        <div className={'flex-none text-center'}>
                            <Card
                                className={
                                    'mb-2 h-[55rem] w-[45rem] border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'
                                }
                            >
                                <div className={'content-center h-[90%]'}>
                                    <GameBoard size={1} />
                                </div>

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
