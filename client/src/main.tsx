import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';
import { connectToGameHub } from './services/gameHub.ts';

const queryClient = new QueryClient();

const gameHubConnection = connectToGameHub(queryClient);
gameHubConnection
    .start()
    .then(() => console.log('connected to game hub'))
    .catch((reason) => console.log('unable to connect to game hub', { reason }));

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
