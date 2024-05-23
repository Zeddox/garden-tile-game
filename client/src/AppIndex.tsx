import { Link } from '@tanstack/react-router';
import './App.css';
import { GameCreationDialog } from './GameCreationDialog';
import { useGames } from './services/gameApi';
import { Card } from './components/ui/card';

export const AppIndex = () => {
    const { data: games } = useGames();

    return (
        <div className={'grid grid-cols-10 gap-8'}>
            {(games?.length ?? 0) > 0 ? <GameList /> : null}
            <GameCreationDialog />
        </div>
    );
};

const GameList = () => {
    const { data: games } = useGames();

    return (
        <>
            <Card
                className={
                    'col-[2_/_6] flex flex-col gap-4 p-4  shadow-slate-950 shadow-md border-slate-700/40 bg-gradient-to-b from-slate-700/30 from-10% via-[#181b1a] via-60% to-[#181b1a] to-100%'
                }
            >
                <h2 className={'text-2xl font-semibold text-slate-300'}>{'My Games'}</h2>
                <div className={'flex flex-col gap-1a '}>
                    {games?.map((x) => (
                        <div
                            className={
                                'flex gap-2 p-1 pl-2 pr-2 items-center justify-between hover:shadow-slate-950 hover:shadow-sm hover:bg-emerald-800 rounded-sm group '
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
            <Card
                className={
                    'col-[6_/_10] flex flex-col gap-4 p-4  shadow-slate-950 shadow-md border-slate-700/40 bg-gradient-to-b from-slate-700/30 from-10% via-[#181b1a] via-60% to-[#181b1a] to-100%'
                }
            >
                <h2 className={'text-2xl font-semibold text-slate-300'}>{'Games to Join'}</h2>
                <div className={'flex flex-col gap-1a '}>
                    {games?.map((x) => (
                        <div
                            className={
                                'flex gap-2 p-1 pl-2 pr-2 items-center justify-between hover:shadow-slate-950 hover:shadow-sm hover:bg-emerald-800 rounded-sm group '
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
    );
};
