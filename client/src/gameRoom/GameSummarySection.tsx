import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getFifthLayerBonusAmount, getGameBoardCellsFromPlayerTurns, getRoundTiles, getTileMap } from './game';
import { useGameRoomContext } from './useGameRoomContext';

export const GameSummarySection = () => {
    const { gameAtom, fifthLayerBonusesAtom } = useGameRoomContext();
    const game = useAtomValue(gameAtom);
    const fifthLayerBonuses = useAtomValue(fifthLayerBonusesAtom);

    const players = game.players;

    const scores = game.turns.reduce((scores, x) => {
        const tile = getRoundTiles(game, x.round).find((t) => t.id === x.tileId);
        if (tile) {
            const turnScore = tile.typeQuantity * x.layer;

            scores.set(x.playerId, (scores.get(x.playerId) ?? 0) + turnScore);
        }
        return scores;
    }, new Map<string, number>());

    fifthLayerBonuses.forEach((x) => {
        if (x.playerId !== undefined) {
            scores.set(x.playerId, (scores.get(x.playerId) ?? 0) + getFifthLayerBonusAmount(x.tileType));
        }
    });

    const visibleTypeQuantitiesMap = useMemo(() => {
        const visibleTypeQuantitiesMap = new Map<string, number[]>(players.map((player) => [player.id, new Array(6).fill(0)]));
        players.forEach((player) => {
            const gameBoardCellMap = getGameBoardCellsFromPlayerTurns(game.turns, player, getTileMap(game));
            gameBoardCellMap.forEach((x) => {
                x.forEach((y) => {
                    if (y.tileType !== undefined) {
                        visibleTypeQuantitiesMap.get(player.id)![y.tileType] += y.typeQuantity ?? 0;
                    }
                });
            });
        });
        return visibleTypeQuantitiesMap;
    }, [game, players]);

    return (
        <div className={'bg-slate w-1/4 flex-auto border-slate-700/40'}>
            <span className={'text-xl'}>{'Players'}</span>
            <div className={'mt-4 grid auto-rows-auto'}>
                <div>
                    <div>{'Player'}</div>
                    <div>{'Final Score'}</div>
                    <div>{'Fifth Layer Bonuses'}</div>
                    <div>{'Most Type Bonuses'}</div>
                    <div>{'Rounds Points'}</div>
                </div>
                {players.map((player) => (
                    <div
                        key={player.id}
                        className={'flex justify-between p-1 px-3 data-[is-current-player="true"]:bg-[--primary-50]'}
                    >
                        <div className={'flex items-center gap-3'}>
                            <span className={'h-4 w-4 rounded-sm'} style={{ background: player.gamePieceColor }}></span>
                            <span>{player.name}</span>
                        </div>
                        <div className={'flex items-center gap-2'}>
                            <div className={'font-semibold'}>{scores.get(player.id) ?? 0}</div>
                        </div>
                        <div className={'flex items-center gap-2'}>
                            {/* <div className={'font-semibold'}>{scores.get(player.id) ?? 0}</div> */}
                        </div>
                        <div className={'flex items-center gap-2'}>
                            {/* <div className={'font-semibold'}>{scores.get(player.id) ?? 0}</div>
                             */}
                            {visibleTypeQuantitiesMap.get(player.id)!.map((x) => (
                                <span key={`${player.id}_${x}`}>{x}</span>
                            ))}
                        </div>
                        <div className={'flex items-center gap-2'}>
                            {/* <div className={'font-semibold'}>{scores.get(player.id) ?? 0}</div> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
