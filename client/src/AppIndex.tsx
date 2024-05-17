import { useEffect, useState } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { GameStatus } from './generated/backend';
import { useCreateGame, useGames } from './services/gameApi';
import { Link, useNavigate } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

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
                    <Link to={'/game/$gameId/lobby'} params={{ gameId: x.id }}>
                        {'Join'}
                    </Link>
                </div>
            ))}
        </div>
    );
};

const GameCreation = () => {
    const navigate = useNavigate();
    const { data: games } = useGames();
    const { mutate: createGame } = useCreateGame();

    const [gameName, setGameName] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [gameId, setGameId] = useState<number>(1);

    const canCreateGame = gameName.length > 0 && playerName.length > 0;

    useEffect(() => {
        if (games !== undefined && games.length > 0) {
            setGameId(games[games.length - 1].id + 1);
        }
    }, [games]);

    return (
        <div className={'col-span-2 flex flex-col gap-2'}>
            <Input placeholder={'Enter Player Name'} value={playerName} onChange={(ev) => setPlayerName(ev.target.value)} />
            <Input placeholder={'Enter Game Name'} value={gameName} onChange={(ev) => setGameName(ev.target.value)} />
            <Button
                onClick={() => {
                    createGame(
                        { id: gameId, gameName, gameStatus: GameStatus.Setup },
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
        </div>
    );
};
