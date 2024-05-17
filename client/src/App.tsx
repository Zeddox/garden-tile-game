import { useEffect, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { GameStatus } from './generated/backend';
import { useCreateGame, useGames } from './services/gameApi';

export const App = () => {
    const { mutate: createGame } = useCreateGame();

    const [gameName, setGameName] = useState('');

    return (
        <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
            <div className={'flex flex-col gap-2'}>
                <Input placeholder={'Enter Game Name'} value={gameName} onChange={(ev) => setGameName(ev.target.value)} />
                <Button
                    onClick={() => {
                        createGame({ id: gameName, gameStatus: GameStatus.Setup });
                    }}
                >
                    {'Create Game'}
                </Button>
            </div>
        </ThemeProvider>
    );
};


const GameList = () => {
    const { data: games } = useGames();

    return 
    <div>
        {games?.map((x) => (
            <div key={x.id}>{x.gameName}</div>
        ))}
    </div>

}