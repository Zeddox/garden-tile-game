import { useState } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useCreateGame, useGames } from './services/gameApi';
import { Link, useNavigate } from '@tanstack/react-router';

export const AppIndex = () => {
    return (
        <div className={'grid grid-cols-5 gap-4'}>
            <GameList />
            <GameCreation />
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

const GameCreation = () => {
    const navigate = useNavigate();
    const { mutate: createGame, error } = useCreateGame();

    const [gameName, setGameName] = useState('');
    const [playerName, setPlayerName] = useState('');

    const canCreateGame = gameName.length > 0 && playerName.length > 0;

    return (
        <div className={'col-span-2 flex flex-col gap-2'}>
            <Input placeholder={'Enter Player Name'} value={playerName} onChange={(ev) => setPlayerName(ev.target.value)} />
            <Input placeholder={'Enter Game Name'} value={gameName} onChange={(ev) => setGameName(ev.target.value)} />
            <Button
                onClick={() => {
                    createGame(
                        { gameName, playerName },
                        {
                            onSuccess: (dto) => {
                                navigate({ to: `/game/$gameId/lobby`, params: { gameId: dto.id } });
                            }
                        }
                    );
                }}
                disabled={!canCreateGame}
            >
                {'Create Game'}
            </Button>
            {error !== undefined ? <div className={'text-red-800'}>{error?.message}</div> : null}
        </div>
    );
};
