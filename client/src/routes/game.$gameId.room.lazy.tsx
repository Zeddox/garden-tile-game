import { GameRoom } from '@/GameRoom';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/game/$gameId/room')({
    component: () => <GameRoom />
});