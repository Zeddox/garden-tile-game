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
            className={'hover:bg-[#152E23] hover:border-[#46A37D]/60 hover:shadow-sm hover:shadow-[#1B4A37]/60'}
            onClick={() => setShowDialog(true)}
            disabled={showDialog}
        >
            {'Create Game'}
        </Button>
    );
};
