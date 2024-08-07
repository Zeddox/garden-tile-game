import { useMemo } from 'react';
import { Card } from './components/ui/card';
import { useGame } from './services/gameApi';
import { getRouteApi } from '@tanstack/react-router';
import { FaCrown } from 'react-icons/fa';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './components/ui/carousel';
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

    const players = useMemo(() => {
        return game?.players ?? [];
    }, [game]);

    const currentPlayer = game?.players?.find((x) => x.userId === selectedUser?.id);

    const opponents = useMemo(() => {
        return game?.players?.filter((player) => player.userId !== selectedUser?.id) ?? [];
    }, [game, selectedUser]);

    const gamePieces: IGamePieces = useMemo(() => {
        return {
            singlePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Single) ?? [],
            doublePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Double) ?? [],
            triplePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Triple) ?? [],
            cornerPieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Corner) ?? [],
        }
    }, [game]);

    return (
        <div>
            <div className={'h-[50rem] w-full max-w-screen-2xl mx-auto'}>
                <div className={'flex h-[15rem] mb-5 mt-5'}>
                    <div className='flex-auto w-1/4 border-slate-700/40 bg-slate'>
                        <span className={'text-xl'}>Players</span>
                        <div className={'grid auto-rows-auto mt-4'}>
                            {players.map((player) => (
                                <div className={`flex items-center gap-3 ${player.gameLeader ? 'bg-[--primary-50] p-1' : ''}`}>
                                    <span>{player.name}</span>
                                    <span
                                        className={'h-4 w-4 rounded-sm'}
                                        style={{ background: player.gamePieceColor }}
                                    ></span>
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
                    <Carousel className="flex-1">
                        <CarouselContent>
                            {opponents.map((player, index) => (
                                <CarouselItem key={index}>
                                    <div className={'text-center'}>
                                        <Card className={'h-[55rem] mb-2 border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'}>

                                        </Card>
                                        <span className={'text-3xl font-extralight tracking-wider text-muted-foreground'}>{player.name}</span>
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
                        <Card className={'h-[55rem] mb-2 border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'}>

                        </Card>
                        <span className={'text-3xl font-extralight tracking-wider text-[--primary-90]'}>{currentPlayer?.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
