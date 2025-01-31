import { useContext } from 'react';
import { GameBoardCellContext } from './gameBoardCellContext';

export const useGameBoardCellContext = () => {
    const context = useContext(GameBoardCellContext);
    if (context === undefined) {
        throw Error('No context for GameBoardCell found. Ensure component tree is wrapped in GameBoardCellContext.Provider.');
    }
    return context;
};
