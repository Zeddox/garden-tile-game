import { useContext } from 'react';
import { GameRoomContext } from './gameRoomContext';

export const useGameRoomContext = () => {
    const context = useContext(GameRoomContext);
    if (context === undefined) {
        throw Error('No context for GameRoom found. Ensure component tree is wrapped in GameRoomContext.Provider.');
    }
    return context;
};
