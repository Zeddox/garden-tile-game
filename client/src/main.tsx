import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/loading/three-dots.css';
import { routeTree } from './routeTree.gen';
import { connectToGameHub } from './services/gameHub.ts';
import { ConnectionProvider } from './ConnectionProvider.tsx';
import { SELECTED_USER_ID_KEY } from './appContext.ts';
import { HubConnection } from '@microsoft/signalr';

const queryClient = new QueryClient();

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const notifyNewConnectionMade = (
    hubConnection: HubConnection,
    connectionType: 'connected' | 'reconnected' | 'onclose reconnected' = 'connected'
) => {
    const storedSelectedUserId = JSON.parse(window.sessionStorage.getItem(SELECTED_USER_ID_KEY) ?? JSON.stringify(null)) as
        | string
        | null;
    if (storedSelectedUserId) {
        hubConnection.send('NewConnectionMade', storedSelectedUserId);
    }
    console.log(`${connectionType} to game hub`);
};

const gameHubConnection = connectToGameHub(queryClient, router);

let retryTimer: NodeJS.Timeout | undefined = undefined;
const startHubConnection = (startType: 'connected' | 'onclose reconnected' = 'connected') =>
    gameHubConnection
        .start()
        .then(() => {
            notifyNewConnectionMade(gameHubConnection, startType);
        })
        .catch((reason) => {
            console.log('unable to connect to game hub', { reason });
            console.log('retrying connection in 5000ms');
            // if (retryTimer !== undefined) {
            //     clearTimeout(retryTimer);
            //     retryTimer = undefined;
            // }
            retryTimer = setTimeout(
                () =>
                    startHubConnection(startType).finally(() => {
                        // if (retryTimer !== undefined) {
                        //     clearTimeout(retryTimer);
                        retryTimer = undefined;
                        //}
                    }),
                5000
            );
        });

startHubConnection();

gameHubConnection.onclose((e) => {
    console.error('game hub connection closed', e?.message);
    startHubConnection('onclose reconnected');
});
gameHubConnection.onreconnected(() => {
    notifyNewConnectionMade(gameHubConnection, 'reconnected');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ConnectionProvider connection={gameHubConnection}>
                <RouterProvider router={router} />
            </ConnectionProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
