import { getRouteApi } from '@tanstack/react-router';
import { useConnectionContext } from './ConnectionProvider';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { GameStatus, IPlayerDto, IUserDto } from './generated/backend';
import { useGame, useUpdateGame, useUpdatePlayer } from './services/gameApi';
import { useSelectedUser } from './useSelectedUser';
import { useId, useState } from 'react';
import { Input } from './components/ui/input';
import { ColorPicker } from './components/ui/color-picker';
import { LoadingSpinner } from './components/loading/LoadingSpinner';
import { Label } from './components/ui/label';
import { FaCrown } from 'react-icons/fa';

const route = getRouteApi('/game/$gameId/lobby');

export const GameLobby = () => {
    const { gameId } = route.useParams();
    const { connection } = useConnectionContext();
    const selectedUser = useSelectedUser();
    const { data: game } = useGame(gameId);
    const { mutate: updateGame } = useUpdateGame();
    const { mutate: updatePlayer } = useUpdatePlayer();

    const currentPlayer = game?.players?.find((x) => x.userId === selectedUser?.id);

    return game === undefined || selectedUser === undefined ? (
        <div className={'flex items-center justify-center'}>
            <LoadingSpinner />
        </div>
    ) : (
        <div className={'flex flex-col gap-8'}>
            <h1 className={'text-3xl font-semibold'}>{game.gameName}</h1>
            <div className={'grid grid-cols-2 items-start gap-6'}>
                {currentPlayer === undefined ? (
                    <Join
                        selectedUser={selectedUser}
                        players={game.players ?? []}
                        onJoin={(playerName) => {
                            updateGame({
                                id: game.id,
                                gameStatus: game.gameStatus,
                                userId: selectedUser.id,
                                playerName,
                                connectionId: connection.connectionId!
                            });
                        }}
                    />
                ) : (
                    <Joined
                        currentPlayer={currentPlayer}
                        players={game.players ?? []}
                        onUpdate={(name, gamePieceColor) =>
                            updatePlayer({
                                ...currentPlayer,
                                gameId: game.id,
                                name,
                                gamePieceColor
                            })
                        }
                        onToggleReady={(ready) =>
                            updatePlayer({
                                ...currentPlayer,
                                gameId: game.id,
                                gameReady: ready
                            })
                        }
                    />
                )}
                <Card
                    className={
                        'flex flex-col gap-4 border-slate-700/40 bg-gradient-to-b from-slate-700/30 from-10% via-[#181b1a] via-60% to-[#181b1a] to-100% p-4 shadow-md shadow-slate-950'
                    }
                >
                    <h2 className={'text-2xl font-semibold text-slate-300'}>{'Players'}</h2>
                    <div className={'flex flex-col gap-1'}>
                        {game.players?.map((player) => {
                            return (
                                <div
                                    key={player.id}
                                    className={'group flex items-center justify-between gap-2 rounded-sm p-1 pl-2 pr-2'}
                                >
                                    <div className={'flex items-center gap-3'}>
                                        <span>{player.name}</span>
                                        <span
                                            className={'h-4 w-4 rounded-sm'}
                                            style={{ background: player.gamePieceColor }}
                                        ></span>
                                        {player.gameLeader ? <FaCrown /> : null}
                                    </div>
                                    <Badge>{player.gameReady ? 'Ready' : 'Waiting'}</Badge>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
            {currentPlayer?.gameLeader === true && (game.players?.length ?? 0) > 1 ? (
                <div className={'flex w-full items-center justify-center'}>
                    <Button
                        disabled={game.players?.every((x) => x.gameReady) === false}
                        onClick={() => updateGame({ id: game.id, gameStatus: GameStatus.InProgress })}
                    >
                        {game.players?.every((x) => x.gameReady) ? 'Start Game' : 'Waiting for all to be ready...'}
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

const Join = (props: { selectedUser: IUserDto | undefined; players: IPlayerDto[]; onJoin: (playerName: string) => void }) => {
    const [playerName, setPlayerName] = useState(props.selectedUser?.name ?? '');

    return (
        <Card
            className={
                'flex flex-col gap-4 border-slate-700/40 bg-gradient-to-b from-slate-700/30 from-10% via-[#181b1a] via-60% to-[#181b1a] to-100% p-4 shadow-md shadow-slate-950'
            }
        >
            <Input placeholder={'Enter Player Name'} value={playerName} onChange={(ev) => setPlayerName(ev.target.value)} />
            <Button
                disabled={
                    playerName.length === 0 || props.players.find((x) => x.name.toLowerCase().includes(playerName)) !== undefined
                }
                onClick={() => props.onJoin(playerName)}
            >
                {'Join'}
            </Button>
        </Card>
    );
};

const Joined = (props: {
    currentPlayer: IPlayerDto;
    players: IPlayerDto[];
    onUpdate: (name: string, gamePieceColor: string) => void;
    onToggleReady: (ready: boolean) => void;
}) => {
    const { currentPlayer } = props;
    const [playerName, setPlayerName] = useState(currentPlayer.name);
    const [gamePieceColor, setGamePieceColor] = useState(currentPlayer.gamePieceColor ?? '');
    const playerNameId = useId();
    const gamePieceColorId = useId();

    return (
        <Card
            className={
                'flex flex-col gap-4 border-slate-700/40 bg-gradient-to-b from-slate-700/30 from-10% via-[#181b1a] via-60% to-[#181b1a] to-100% p-4 shadow-md shadow-slate-950'
            }
        >
            <div>
                <Label htmlFor={playerNameId}>{'Player Name'}</Label>
                <Input placeholder={'Enter Player Name'} value={playerName} onChange={(ev) => setPlayerName(ev.target.value)} />
            </div>
            <div>
                <Label htmlFor={gamePieceColorId}>{'Game Piece Color'}</Label>
                <ColorPicker
                    id={gamePieceColorId}
                    onChange={(color) => {
                        setGamePieceColor(color);
                    }}
                    value={gamePieceColor}
                />
            </div>
            <div className={'flex justify-between'}>
                <Button
                    size={'sm'}
                    disabled={
                        playerName.length === 0 ||
                        props.players.find(
                            (x) =>
                                x.name.toLowerCase().includes(playerName) &&
                                x.gamePieceColor.toLowerCase().includes(gamePieceColor)
                        ) !== undefined
                    }
                    onClick={() => props.onUpdate(playerName, gamePieceColor)}
                >
                    {'Update'}
                </Button>
                <Button size={'sm'} onClick={() => props.onToggleReady(!currentPlayer.gameReady)}>
                    {currentPlayer.gameReady ? 'Wait' : 'Ready'}
                </Button>
            </div>
        </Card>
    );
};
