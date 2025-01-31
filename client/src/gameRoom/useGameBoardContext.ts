import { useContext } from 'react';
import { GameBoardContext } from './gameBoardContext';

export const useGameBoardContext = () => {
    const context = useContext(GameBoardContext);
    if (context === undefined) {
        throw Error('No context for GameBoard found. Ensure component tree is wrapped in GameBoardContext.Provider.');
    }
    return context;
};
