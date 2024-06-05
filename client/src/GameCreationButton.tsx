import { useAtom } from 'jotai';
import { useContext } from 'react';
import { AppContext } from './appContext';
import { Button } from './components/ui/button';

export const GameCreationButton = () => {
    const [showDialog, setShowDialog] = useAtom(useContext(AppContext)!.showGameCreationDialogAtom);
    return (
        <Button
            variant={'outline'}
            size={'sm'}
            className={'hover:bg-[--primary-30] hover:border-primary/70 hover:shadow-sm hover:shadow-[--primary-50]/60'}
            onClick={() => setShowDialog(true)}
            disabled={showDialog}
        >
            {'Create Game'}
        </Button>
    );
};
