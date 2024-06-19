import { useMemo, useState } from 'react';
import { useGame, useUpdateGame, useUpdatePlayer } from './services/gameApi';
import { getRouteApi } from '@tanstack/react-router';
import { Button } from './components/ui/button';
import { GameStatus } from './generated/backend';
import { useConnectionContext } from './ConnectionProvider';
import { Card } from './components/ui/card';
import { useSelectedUser } from './useSelectedUser';
import { Badge } from './components/ui/badge';
const route = getRouteApi('/game/$gameId/lobby');

export const GameLobby = () => {
    const { gameId } = route.useParams();
    const { connection } = useConnectionContext();
    const selectedUser = useSelectedUser();
    const { data: game } = useGame(gameId);
    const { mutate: updateGame } = useUpdateGame();
    const { mutate: updatePlayer } = useUpdatePlayer();

    const currentPlayer = useMemo(() => {
        return game?.players?.find((x) => x.userId === selectedUser?.id);
    }, [game, selectedUser]);

    console.log(connection);

    console.log(currentPlayer);
    console.log({players:game?.players?.map(x => ({name:x.name, ready:x.gameReady}))});
    return (
        <div>
            <h1 className={'text-3xl font-semibold '}>{game?.gameName}</h1>
            {currentPlayer === undefined ? (
                <div className={'flex gap-2 items-center'}>
                    <Button
                        onClick={() =>
                            game &&
                            updateGame({
                                id: game.id,
                                gameStatus: game.gameStatus,
                                userId: selectedUser?.id,
                                playerName: selectedUser?.name,
                                connectionId: connection.connectionId!
                            })
                        }
                    >
                        {'Join'}
                    </Button>
                </div>
            ) : currentPlayer.gameReady === false ? (
                <div>
                    <Button onClick={() => game && updatePlayer({ gameId: game.id, id: currentPlayer.id, gameReady: true })}>
                        {'Ready'}
                    </Button>
                </div>
            ) : currentPlayer?.gameLeader && game?.players?.every((x) => x.gameReady) ? (
                <div>
                    <Button onClick={() => game && updateGame({ id: game.id, gameStatus: GameStatus.InProgress })}>
                        {'Start'}
                    </Button>
                </div>
            ) : (
                <div>{'Waiting on all players to be ready'}</div>
            )}
            <Card
                className={
                    'col-[2_/_6] flex flex-col gap-4 p-4  shadow-slate-950 shadow-md border-slate-700/40 bg-gradient-to-b from-slate-700/30 from-10% via-[#181b1a] via-60% to-[#181b1a] to-100%'
                }
            >
                <h2 className={'text-2xl font-semibold text-slate-300'}>{'Players'}</h2>
                <div className={'flex flex-col gap-1'}>
                    {game?.players?.map((player) => {
                        return (
                            <div key={player.id} className={'flex gap-2  p-1 pl-2 pr-2 items-center justify-between rounded-sm group'}>
                                {player.name}
                                <Badge>{player.gameReady ? 'Ready' : 'Waiting'}</Badge>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};
