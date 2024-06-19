import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';
import { connectToGameHub } from './services/gameHub.ts';
import { ConnectionProvider } from './ConnectionProvider.tsx';
import { SELECTED_USER_ID_KEY } from './appContext.ts';
//import { useUpdatePlayerConnectionId } from './services/gameApi.ts';

const queryClient = new QueryClient();

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

// const { mutate: updateConnectionId } = useUpdatePlayerConnectionId();

const gameHubConnection = connectToGameHub(queryClient, router);
gameHubConnection
    .start()
    .then(() => {
        const storedSelectedUserId = JSON.parse(window.sessionStorage.getItem(SELECTED_USER_ID_KEY) ?? JSON.stringify(null)) as string | null
        if (storedSelectedUserId) {
            gameHubConnection.send("NewConnectionMade", storedSelectedUserId);
        }
        console.log('connected to game hub')
    })
    .catch((reason) => console.log('unable to connect to game hub', { reason }));

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ConnectionProvider connection={gameHubConnection}>
                <RouterProvider router={router} />
            </ConnectionProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
