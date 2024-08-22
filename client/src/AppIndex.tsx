import { Link } from '@tanstack/react-router';
import { useGames } from './services/gameApi';
import { GameCreationDialog } from './GameCreationDialog';
import { Card } from './components/ui/card';
import { useAtomValue } from 'jotai';
import { useContext } from 'react';
import { AppContext } from './appContext';
import { GameStatus } from './generated/backend';

export const AppIndex = () => {
    const selectedUserId = useAtomValue(useContext(AppContext)!.selectedUserIdAtom);

    return (
        <div className={'grid grid-cols-10 gap-8'}>
            {selectedUserId !== null ? (
                <>
                    <GameList />
                    <GameCreationDialog />
                </>
            ) : (
                <h2 className={'col-[-1] text-2xl font-semibold text-slate-300'}>{'Select a user to begin ↑'}</h2>
            )}
        </div>
    );
};

const GameList = () => {
    const selectedUserId = useAtomValue(useContext(AppContext)!.selectedUserIdAtom);
    const { data: games } = useGames();

    return (games?.length ?? 0) > 0 ? (
        <>
            <Card
                className={
                    'col-[2_/_6] flex flex-col gap-4 border-slate-700/40 bg-gradient-to-b from-slate-700/30 from-10% via-[#181b1a] via-60% to-[#181b1a] to-100% p-4 shadow-md shadow-slate-950'
                }
            >
                <h2 className={'text-2xl font-semibold text-slate-300'}>{'My Games'}</h2>
                <div className={'flex flex-col gap-1'}>
                    {games
                        ?.filter((x) => x.players?.find((x) => x.userId === selectedUserId) !== undefined)
                        ?.map((x) => (
                            <div
                                className={
                                    'group flex items-center justify-between gap-2 rounded-sm p-1 pl-2 pr-2 hover:bg-emerald-800 hover:shadow-sm hover:shadow-slate-950'
                                }
                                key={x.id}
                            >
                                <span>{x.gameName}</span>
                                <Link
                                    to={x.gameStatus === GameStatus.Setup ? '/game/$gameId/lobby' : '/game/$gameId/room'}
                                    params={{ gameId: x.id }}
                                    className={'text-slate-500 group-hover:text-slate-100'}
                                >
                                    {`Enter ${x.gameStatus === GameStatus.Setup ? 'Game Lobby' : 'Game Room'}`}
                                </Link>
                            </div>
                        ))}
                </div>
            </Card>
            <Card
                className={
                    'col-[6_/_10] flex flex-col gap-4 border-slate-700/40 bg-gradient-to-b from-slate-700/30 from-10% via-[#181b1a] via-60% to-[#181b1a] to-100% p-4 shadow-md shadow-slate-950'
                }
            >
                <h2 className={'text-2xl font-semibold text-slate-300'}>{'Games to Join'}</h2>
                <div className={'flex flex-col gap-1'}>
                    {games
                        ?.filter((x) => x.players?.find((x) => x.userId === selectedUserId) === undefined)
                        ?.map((x) => (
                            <div
                                className={
                                    'group flex items-center justify-between gap-2 rounded-sm p-1 pl-2 pr-2 hover:bg-primary hover:shadow-sm hover:shadow-slate-950'
                                }
                                key={x.id}
                            >
                                <span>{x.gameName}</span>
                                <Link
                                    to={'/game/$gameId/lobby'}
                                    params={{ gameId: x.id }}
                                    className={'text-slate-500 group-hover:text-slate-100'}
                                >
                                    {'Join'}
                                </Link>
                            </div>
                        ))}
                </div>
            </Card>
        </>
    ) : null;
};
