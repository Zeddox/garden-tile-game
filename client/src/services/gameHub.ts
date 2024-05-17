import { QueryClient } from '@tanstack/react-query';
import * as signalR from '@microsoft/signalr';
import { GameDto, IGameDto, PlayerDto } from '@/generated/backend';
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

    connection.on('NotifyPlayerAdded', (player: PlayerDto) => {
        console.log('playerAdded', { player });
        queryClient.setQueryData<IGameDto>(gameApiQueryKeys.game(player.gameId!), (prev) => {
            const next = prev ? { ...prev } : new GameDto();
            next.players?.push(player);

            return next;
        });
    });
    
    return connection;
};
