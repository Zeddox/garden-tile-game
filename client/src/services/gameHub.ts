import { QueryClient } from '@tanstack/react-query';
import * as signalR from '@microsoft/signalr';
import { GameDto, IGameDto, PlayerDto } from '@/generated/backend';
import { gameApiQueryKeys } from './gameApi';
import { AnyRoute, Router } from '@tanstack/react-router';
import { TrailingSlashOption } from 'node_modules/@tanstack/react-router/dist/esm/router';

export const connectToGameHub = (queryClient: QueryClient, router: Router<AnyRoute, TrailingSlashOption, Record<string, any>, Record<string, any>>) => {
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
            next.players = [...(next.players ?? []), player]

            return next;
        });
    });

    connection.on('NotifyGameStart', (gameId: string) => {
        console.log('game start');
        router.navigate({ to: `/game/$gameId/room`, params: { gameId: gameId } });
    });

    connection.on('NotifyPlayerUpdated', (player: PlayerDto) => {
        console.log('playerUpdated', { player });
        queryClient.setQueryData<IGameDto>(gameApiQueryKeys.game(player.gameId!), (prev) => {

            const next = prev ? { ...prev } : new GameDto();
            console.log({next, prev})

            next.players = next.players?.map(x => ({...x, gameReady: player.gameReady}) as PlayerDto) ?? []

            return next;
        });
    });

    return connection;
};
