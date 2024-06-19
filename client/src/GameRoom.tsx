import { useGame } from './services/gameApi';
import { getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/game/$gameId/room');

export const GameRoom = () => {
    const { gameId } = route.useParams();

    const { data: game } = useGame(gameId);

    return (
        <div>
            <div>{`${game?.gameName}`}</div>
        </div>
    );
};