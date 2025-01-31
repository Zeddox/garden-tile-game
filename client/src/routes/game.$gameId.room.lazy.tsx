import { GameRoom } from '@/gameRoom/GameRoom';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/game/$gameId/room')({
    component: () => <GameRoom />
});
