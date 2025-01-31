import { QueryClient } from '@tanstack/react-query';
import * as signalR from '@microsoft/signalr';
import { GameDto, IGameDto, PlayerDto, TurnDto } from '@/generated/backend';
import { gameApiQueryKeys } from './gameApi';
import { AnyRoute, Router } from '@tanstack/react-router';
import { TrailingSlashOption } from 'node_modules/@tanstack/react-router/dist/esm/router';

export const connectToGameHub = (
    queryClient: QueryClient,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router: Router<AnyRoute, TrailingSlashOption, Record<string, any>, Record<string, any>>
) => {
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
            next.players = [...(next.players ?? []), player];

            return next;
        });
    });

    connection.on('NotifyGameStart', (game: GameDto) => {
        console.log('game start');
        router.navigate({ to: `/game/$gameId/room`, params: { gameId: game.id } });
        queryClient.setQueryData<GameDto[]>(gameApiQueryKeys.games, (prev) => {
            const next = [...(prev ?? [])];
            const gameIndex = next.findIndex((x) => x.id === game.id);
            if (gameIndex > -1) {
                next[gameIndex] = game;
            }
            return next;
        });
    });

    connection.on('NotifyPlayerUpdated', (player: PlayerDto) => {
        console.log('playerUpdated', { player });
        queryClient.setQueryData<IGameDto>(gameApiQueryKeys.game(player.gameId!), (prev) => {
            const next = prev ? { ...prev } : new GameDto();
            next.players = [...(next.players ?? [])];
            next.players.splice(
                next.players.findIndex((x) => x.id === player.id),
                1,
                player
            );

            return next;
        });
    });

    connection.on('NotifyGameTurnRecorded', (gameId: string, turn: TurnDto) => {
        console.log('turn recorded', { gameId, turn });
        queryClient.setQueryData<IGameDto>(gameApiQueryKeys.game(gameId), (prev) => {
            const next = prev ? { ...prev } : new GameDto();
            next.turns = [...next.turns, turn];
            return next;
        });
    });

    return connection;
};
