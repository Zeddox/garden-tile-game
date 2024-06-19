import { useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import './App.css';
import { AppContext } from './appContext';
import { Button } from './components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { useCreateGame } from './services/gameApi';
import { useSelectedUser } from './useSelectedUser';
import { useConnectionContext } from './ConnectionProvider';

export const GameCreationDialog = () => {
    const navigate = useNavigate();
    const selectedUser = useSelectedUser();
    const { connection } = useConnectionContext();
    const { mutate: createGame, error } = useCreateGame();
    const [showDialog, setShowDialog] = useAtom(useContext(AppContext)!.showGameCreationDialogAtom);

    const [gameName, setGameName] = useState('');
    const [playerName, setPlayerName] = useState('');

    const canCreateGame = gameName.length > 0 && playerName.length > 0;

    return (
        <Dialog open={showDialog} onOpenChange={(open) => setShowDialog(open)}>
            <DialogContent className={'flex flex-col gap-4 p-4 pt-12'}>
                <DialogHeader className={''}>
                    <span>{'Create New Game'}</span>
                </DialogHeader>
                <Input placeholder={'Enter Player Name'} value={playerName} onChange={(ev) => setPlayerName(ev.target.value)} />
                <Input placeholder={'Enter Game Name'} value={gameName} onChange={(ev) => setGameName(ev.target.value)} />

                {error !== undefined ? <div className={'text-red-800'}>{error?.message}</div> : null}
                <DialogFooter className='justify-end'>
                    <Button
                        onClick={() => {
                            createGame(
                                { gameName, playerName, userId: selectedUser!.id, connectionId: connection.connectionId! },
                                {
                                    onSuccess: (dto) => {
                                        setShowDialog(false);
                                        navigate({ to: `/game/$gameId/lobby`, params: { gameId: dto.id } });
                                    }
                                }
                            );
                        }}
                        disabled={!canCreateGame}
                    >
                        {'Create Game'}
                    </Button>
                    <DialogClose asChild>
                        <Button type='button' variant='secondary'>
                            {'Close'}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
