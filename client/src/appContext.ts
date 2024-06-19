import { atom } from 'jotai';
import React from 'react';


export const SELECTED_USER_ID_KEY = 'selected-user-id';

type AppContextValue = ReturnType<typeof makeAtoms>;

export const AppContext = React.createContext<AppContextValue | undefined>(undefined);
AppContext.displayName = 'AppContext';

export const makeAtoms = () => {
    const showGameCreationDialogAtom = atom<boolean>(false);

    const storedSelectedUserId = JSON.parse(window.sessionStorage.getItem(SELECTED_USER_ID_KEY) ?? JSON.stringify(null)) as string | null
    const selectedUserIdValueAtom = atom<string | null>(storedSelectedUserId)
    const selectedUserIdAtom = atom((get) => get(selectedUserIdValueAtom), (_get, set, selectedUserId: string) => {
        window.sessionStorage.setItem(SELECTED_USER_ID_KEY, JSON.stringify(selectedUserId));
        set(selectedUserIdValueAtom, selectedUserId)
    });

    return { showGameCreationDialogAtom, selectedUserIdAtom };
};
