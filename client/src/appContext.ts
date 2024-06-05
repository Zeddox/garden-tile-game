import { atom } from 'jotai';
import React from 'react';

type AppContextValue = ReturnType<typeof makeAtoms>;

export const AppContext = React.createContext<AppContextValue | undefined>(undefined);
AppContext.displayName = 'AppContext';

export const makeAtoms = () => {
    const showGameCreationDialogAtom = atom<boolean>(false);
    return { showGameCreationDialogAtom };
};
