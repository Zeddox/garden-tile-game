import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { connectToGameHub } from './services/gameHub.ts';

const queryClient = new QueryClient();

const gameHubConnection = connectToGameHub(queryClient);
gameHubConnection.start().then(() => console.log('connected to game hub')).catch(reason => console.log('unable to connect to game hub', {reason}))

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);
