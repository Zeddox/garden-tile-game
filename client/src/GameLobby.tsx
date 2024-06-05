import { useMemo, useState } from 'react';
import { Input } from './components/ui/input';
import { useGame, useGetPlayerByConnectionId, useUpdateGame, useUpdatePlayer } from './services/gameApi';
import { getRouteApi } from '@tanstack/react-router';
import { Button } from './components/ui/button';
import { GameStatus } from './generated/backend';
import { PlayerGameData } from './helpers';
import { Badge } from './components/ui/badge'
import { useConnectionContext } from './ConnectionProvider';
const route = getRouteApi('/game/$gameId/lobby');

export const GameLobby = () => {
    const { gameId } = route.useParams();
    const { connection } = useConnectionContext();
    const { data: game } = useGame(gameId);
    const { mutate: updateGame } = useUpdateGame();
    const { mutate: updatePlayer } = useUpdatePlayer();

    const [playerName, setPlayerName] = useState<string>('');

    // const currentPlayerId: string | undefined = useMemo(() => {
    //     const sessionData = sessionStorage.getItem('games');

    //     if (sessionData && game) {
    //         const parsedData = JSON.parse(sessionData) as PlayerGameData[];
    //         const currentGameData = parsedData.find((x) => x.gameId == game.id);

    //         return currentGameData ? currentGameData.playerId : undefined;
    //     }

    //     return undefined;
    // }, [game]);

    const { data: currentPlayer } = useGetPlayerByConnectionId(gameId, connection.connectionId ?? undefined);

    console.log(connection);
    
    return (
        <div>
            <div>{`Welcome to game ${game?.gameName} ${gameId}`}</div>
            <div className={'flex gap-2 items-center'}>
                <Input placeholder={'Enter Player Name'} value={playerName} onChange={(ev) => setPlayerName(ev.target.value)} />
                <Button
                    disabled={playerName.length === 0}
                    onClick={() => game && updateGame({ id: game.id, gameStatus: game.gameStatus, playerName, playerConnectionId: connection.connectionId ?? '' })}
                >
                    {'Join'}
                </Button>
            </div>

            <div>
                {game?.players?.map((player) => {
                    return (
                        <div>
                            <div className={'flex gap-2 items-center my-5'}>
                                <div>{player.name}</div>
                                {currentPlayer?.id !== player.id ? (
                                    <Badge variant={player.gameReady ? 'default' : 'secondary'}>{player.gameReady ? 'Ready' : 'Waiting...'}</Badge>
                                ) : (
                                    <div style={{ display: 'inline' }}>
                                        <Button
                                            variant='ghost'
                                            disabled={player.gameReady}
                                            onClick={() =>
                                                updatePlayer({ id: player.id, gameId: player.gameId!, gameReady: true })
                                            }
                                        >
                                            {'Ready'}
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            disabled={!player.gameReady}
                                            onClick={() =>
                                                updatePlayer({ id: player.id, gameId: player.gameId!, gameReady: false })
                                            }
                                        >
                                            {'Edit'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                <Button
                    disabled={!currentPlayer?.gameLeader || game?.players?.some((x) => !x.gameReady)}
                    onClick={() => game && updateGame({ id: game.id, gameStatus: GameStatus.InProgress })}
                >
                    {'Start'}
                </Button>
            </div>
        </div>
    );
};
