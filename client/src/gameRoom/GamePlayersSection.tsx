import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { FaCrown } from 'react-icons/fa';
import { useGameRoomContext } from './useGameRoomContext';

export const GamePlayersSection = () => {
    const { gameAtom } = useGameRoomContext();
    const game = useAtomValue(gameAtom);

    const players = useMemo(() => {
        return game?.players ?? [];
    }, [game]);

    return (
        <div className={'bg-slate w-1/4 flex-auto border-slate-700/40'}>
            <span className={'text-xl'}>{'Players'}</span>
            <div className={'mt-4 grid auto-rows-auto'}>
                {players.map((player) => (
                    <div
                        key={player.id}
                        className={`flex items-center gap-3 ${player.gameLeader ? 'bg-[--primary-50] p-1' : ''}`}
                    >
                        <span>{player.name}</span>
                        <span className={'h-4 w-4 rounded-sm'} style={{ background: player.gamePieceColor }}></span>
                        {player.gameLeader ? <FaCrown /> : null}
                    </div>
                ))}
            </div>
        </div>
    );
};
