import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/game/$gameId/lobby')({
    component: () => <div>Hello /game/$gameId/lobby!</div>
});
