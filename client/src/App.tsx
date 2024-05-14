import { useEffect, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { GameStatus } from './generated/backend';
import { useCreateGame, useGames } from './services/gameApi';

export const App = () => {
    const { data: games } = useGames();
    const { mutate: createGame } = useCreateGame();

    const [gameName, setGameName] = useState('');
    const [gameId, setGameId] = useState<number>(1);

    useEffect(() => {
        if (games !== undefined && games.length > 0) {
            setGameId(games[games.length - 1].id + 1);
        }
    }, [games])

    return (
        <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
            <div className={'flex flex-col gap-2'}>
                <Input placeholder={'Enter Game Name'} value={gameName} onChange={(ev) => setGameName(ev.target.value)} />
                <Button
                    onClick={() => {
                        createGame({ id: gameId, gameName, gameStatus: GameStatus.Setup });
                    }}
                >
                    {'Create Game'}
                </Button>
            </div>
            <div>
                {games?.map((x) => (
                    <div key={x.id}>{x.gameName}</div>
                ))}
            </div>
        </ThemeProvider>
    );
};
