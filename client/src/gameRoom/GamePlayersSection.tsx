import { useAtomValue } from 'jotai';
import { FaCrown } from 'react-icons/fa';
import { useGameRoomContext } from './useGameRoomContext';
import { IGameDto } from '@/generated/backend';

export const GamePlayersSection = () => {
    const { gameAtom, currentPlayerAtom } = useGameRoomContext();
    const game = useAtomValue(gameAtom);
    const currentPlayer = useAtomValue(currentPlayerAtom);

    const players = game.players;

    const scores = game.turns.reduce((scores, x) => {
        const tile = getRoundTiles(game, x.round).find((t) => t.id === x.tileId);
        if (tile) {
            const turnScore = tile.typeQuantity * x.layer;

            scores.set(x.playerId, (scores.get(x.playerId) ?? 0) + turnScore);
        }
        return scores;
    }, new Map<string, number>());

    return (
        <div className={'bg-slate w-1/4 flex-auto border-slate-700/40'}>
            <span className={'text-xl'}>{'Players'}</span>
            <div className={'mt-4 grid auto-rows-auto'}>
                {players.map((player) => (
                    <div
                        key={player.id}
                        data-is-current-player={player.id === currentPlayer?.id}
                        className={'flex justify-between p-1 px-3 data-[is-current-player="true"]:bg-[--primary-50]'}
                    >
                        <div className={'flex items-center gap-3'}>
                            <span className={'h-4 w-4 rounded-sm'} style={{ background: player.gamePieceColor }}></span>
                            <span>{player.name}</span>
                            {player.gameLeader ? <FaCrown /> : null}
                        </div>
                        <div className={'font-semibold'}>{scores.get(player.id) ?? 0}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getRoundTiles = (game: IGameDto, round: number) => {
    switch (round) {
        case 1:
            return game.firstRoundTiles;
        case 2:
            return game.secondRoundTiles;
        case 3:
            return game.thirdRoundTiles;
        case 4:
            return game.fourthRoundTiles;
        case 5:
            return game.fifthRoundTiles;
        case 6:
            return game.sixthRoundTiles;
        default:
            return [];
    }
};
