import { LoadingSpinner } from './components/loading/LoadingSpinner';
import { useGame } from './services/gameApi';
import { getRouteApi } from '@tanstack/react-router';
import { useSelectedUser } from './useSelectedUser';

const route = getRouteApi('/game/$gameId/room');

export const GameRoom = () => {
    const { gameId } = route.useParams();
    const selectedUser = useSelectedUser();

    const { data: game } = useGame(gameId);

    console.log({ game });

    return game === undefined || selectedUser === undefined ? (
        <div className={'flex items-center justify-center'}>
            <LoadingSpinner />
        </div>
    ) : (
        <div>
            <div>{`${game.gameName}`}</div>
        </div>
    );
};
