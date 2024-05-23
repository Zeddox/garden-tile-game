import { useAtom } from 'jotai';
import { useContext } from 'react';
import { AppContext } from './appContext';
import { Button } from './components/ui/button';

export const GameCreationButton = () => {
    const [showDialog, setShowDialog] = useAtom(useContext(AppContext)!.showGameCreationDialogAtom);
    return (
        <Button variant={'outline'} size={'sm'} onClick={() => setShowDialog(true)} disabled={showDialog}>
            {'Create Game'}
        </Button>
    );
};
