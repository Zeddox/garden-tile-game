import { QueryClient } from '@tanstack/react-query';
import * as signalR from '@microsoft/signalr';
import { GameDto } from '@/generated/backend';
import { gameApiQueryKeys } from './gameApi';

export const connectToGameHub = (queryClient: QueryClient) => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:8020/game-hub')
        .withAutomaticReconnect()
        .build();

    connection.on('NotifyGameCreated', (game: GameDto) => {
        console.log('gameCreated', { game });
        queryClient.setQueryData<GameDto[]>(gameApiQueryKeys.games, (prev) => {
            const next = [...(prev ?? [])];
            next.push(game);
            return next;
        });
    });
    return connection;
};
