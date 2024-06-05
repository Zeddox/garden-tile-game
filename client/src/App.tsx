import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import { useEffect } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { useUpdatePlayerConnectionId } from './services/gameApi';
import { IPlayerDto } from './generated/backend';

export const App = () => {
    const { connection } = useConnectionContext();
    // const { mutate: updateConnectionId } = useUpdatePlayerConnectionId();
    
    // useEffect(() => {
    //     if (connection.connectionId !== null) {
    //         var oldConnectionId = sessionStorage.getItem('connectionId');
    //         var newConnectionId = connection.connectionId;

    //         if (oldConnectionId && oldConnectionId !== newConnectionId) {
    //             updateConnectionId({ oldConnectionId: oldConnectionId, newConnectionId: newConnectionId })
    //         }

    //         sessionStorage.setItem('connectionId', connection.connectionId ?? '')
    //     }
    // }, [connection]);
    
    return (
        <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
            <Outlet />
            <TanStackRouterDevtools />
        </ThemeProvider>
    );
};