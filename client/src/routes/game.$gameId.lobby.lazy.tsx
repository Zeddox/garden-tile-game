import { GameLobby } from '@/GameLobby';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/game/$gameId/lobby')({
    component: () => <GameLobby/>
});
