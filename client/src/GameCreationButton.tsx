import { useAtom } from 'jotai';
import { useContext } from 'react';
import { AppContext } from './appContext';
import { Button } from './components/ui/button';
import { useSelectedUser } from './useSelectedUser';

export const GameCreationButton = () => {
    const selectedUser = useSelectedUser();
    const [showDialog, setShowDialog] = useAtom(useContext(AppContext)!.showGameCreationDialogAtom);

    return (
        <Button
            variant={'outline'}
            size={'sm'}
            className={'hover:shadow-[--primary-50]/60 hover:border-primary/70 hover:bg-[--primary-30] hover:shadow-sm'}
            onClick={() => setShowDialog(true)}
            disabled={showDialog || selectedUser === undefined}
        >
            {'Create Game'}
        </Button>
    );
};
