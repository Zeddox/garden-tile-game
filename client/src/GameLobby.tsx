import { useState } from 'react';
import { Input } from './components/ui/input';
import { useGame, useUpdateGame } from './services/gameApi';
import { getRouteApi } from '@tanstack/react-router';
import { Button } from './components/ui/button';

const route = getRouteApi('/game/$gameId/lobby');

export const GameLobby = () => {
    const { gameId } = route.useParams();

    const { data: game } = useGame(gameId);
    const { mutate: addPlayer } = useUpdateGame();

    const [playerName, setPlayerName] = useState<string>('');

    return (
        <div>
            <h2 className={'text-3xl'}>{game?.gameName}</h2>
            <div className={'flex gap-2 items-center'}>
                <Input placeholder={'Enter Player Name'} value={playerName} onChange={(ev) => setPlayerName(ev.target.value)} />
                <Button
                    disabled={playerName.length === 0}
                    onClick={() => game && addPlayer({ id: game.id, gameStatus: game.gameStatus, playerName })}
                >
                    {'Join'}
                </Button>
            </div>

            <div>
                {game?.players?.map((player) => {
                    return <div key={player.id}>{player.name}</div>;
                })}
            </div>
        </div>
    );
};
