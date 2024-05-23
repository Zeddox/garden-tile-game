import { Link } from '@tanstack/react-router';
import './App.css';
import { GameCreationDialog } from './GameCreationDialog';
import { useGames } from './services/gameApi';

export const AppIndex = () => {
    const { data: games } = useGames();

    return (
        <div className={'grid grid-cols-5 gap-4'}>
            {(games?.length ?? 0) > 0 ? <GameList /> : null}

            <GameCreationDialog />
        </div>
    );
};

const GameList = () => {
    const { data: games } = useGames();

    return (
        <div className={'col-span-3'}>
            {games?.map((x) => (
                <div className={'flex gap-2 items-center'} key={x.id}>
                    <span>{x.gameName}</span>
                    <Link to={'/game/$gameId/lobby'} params={{ gameId: x.id }} className={'text-slate-500'}>
                        {'Join'}
                    </Link>
                </div>
            ))}
        </div>
    );
};
