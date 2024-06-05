import { useRef } from 'react';
import { AppContext, makeAtoms } from './appContext';

export const AppProvider = (props: { children: React.ReactNode }) => {
    const atomsRef = useRef(makeAtoms());

    return <AppContext.Provider value={atomsRef.current}>{props.children}</AppContext.Provider>;
};
