import { Provider } from 'jotai';
import { useRef } from 'react';
import { AppContext, makeAtoms } from './appContext';

export const AppProvider = (props: { children: React.ReactNode }) => {
    const atomsRef = useRef(makeAtoms());

    return (
        <Provider>
            <AppContext.Provider value={atomsRef.current}>{props.children}</AppContext.Provider>
        </Provider>
    );
};
