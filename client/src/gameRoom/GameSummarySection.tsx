import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getFifthLayerBonusAmount, getGameBoardCellsFromPlayerTurns, getRoundTiles, getTileMap } from './game';
import { useGameRoomContext } from './useGameRoomContext';
import { GiFlowers, GiLindenLeaf, GiCirclingFish, GiFruitTree, GiMushroomHouse, GiStonePile } from 'react-icons/gi';

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

    const { mostQuantityBonuses, secondMostQuantityBonuses } = useMemo(() => {
        const mostQuantityBonuses = new Map<number, { quantity: number; playerIds: string[] }>();
        const secondMostQuantityBonuses = new Map<number, { quantity: number; playerIds: string[] }>();

        const sortedTypeQuantitiesMap = new Map<number, { quantity: number; playerId: string }[]>();
        visibleTypeQuantitiesMap.forEach((playerQuantities, playerId) => {
            playerQuantities.forEach((quantity, index) => {
                if (sortedTypeQuantitiesMap.get(index) === undefined) {
                    sortedTypeQuantitiesMap.set(index, [{ quantity, playerId }]);
                } else {
                    sortedTypeQuantitiesMap.get(index)!.push({ quantity, playerId });
                }
            });
        });

        sortedTypeQuantitiesMap.forEach((playerQuantities, index) => {
            playerQuantities.sort((a, b) => b.quantity - a.quantity);
            mostQuantityBonuses.set(index, {
                quantity: playerQuantities[0].quantity,
                playerIds: playerQuantities.filter((x) => x.quantity === playerQuantities[0].quantity).map((x) => x.playerId)
            });
            const awardSecondMostBonuses = !(mostQuantityBonuses.get(index)!.playerIds.length > 1);
            if (awardSecondMostBonuses) {
                const secondMostQuantity = playerQuantities.filter(
                    (x) => x.quantity < mostQuantityBonuses.get(index)!.quantity
                )[0].quantity;
                secondMostQuantityBonuses.set(index, {
                    quantity: secondMostQuantity,
                    playerIds: playerQuantities.filter((x) => x.quantity === secondMostQuantity).map((x) => x.playerId)
                });
            }
        });
        return { mostQuantityBonuses, secondMostQuantityBonuses };
    }, [visibleTypeQuantitiesMap]);

    return (
        <div className={'bg-slate w-1/4 flex-auto border-slate-700/40'}>
            <span className={'text-xl'}>{'Players'}</span>
            <div className={'mt-4 grid auto-rows-auto'}>
                <div className={'grid grid-cols-5 gap-2 font-semibold text-slate-400'}>
                    <div>{'Player'}</div>
                    <div>{'Final Score'}</div>
                    <div>{'Fifth Layer Bonuses'}</div>
                    <div>{'Most Type Bonuses'}</div>
                    <div>{'Rounds Points'}</div>
                </div>
                <div className={'grid grid-cols-5 gap-2 font-semibold text-slate-400'}>
                    <div></div>
                    <div></div>
                    <div className={'grid h-4 grid-cols-6 items-center gap-2'}>
                        <GiFruitTree />
                        <GiMushroomHouse />
                        <GiCirclingFish />
                        <GiFlowers />
                        <GiLindenLeaf />
                        <GiStonePile />
                    </div>
                    <div className={'grid h-4 grid-cols-6 items-center gap-2'}>
                        <GiFruitTree />
                        <GiMushroomHouse />
                        <GiCirclingFish />
                        <GiFlowers />
                        <GiLindenLeaf />
                        <GiStonePile />
                    </div>
                    <div></div>
                </div>
                {players.map((player) => (
                    <div key={player.id} className={'grid grid-cols-5 gap-2 data-[is-current-player="true"]:bg-[--primary-50]'}>
                        <div className={'flex items-center gap-3'}>
                            <span className={'h-4 w-4 rounded-sm'} style={{ background: player.gamePieceColor }}></span>
                            <span>{player.name}</span>
                        </div>
                        <div className={'flex items-center gap-2'}>
                            <div className={'font-semibold'}>{scores.get(player.id) ?? 0}</div>
                        </div>
                        <div className={'grid grid-cols-6 items-center gap-2'}>
                            {Array.from({ length: 6 }).map((_, index) => {
                                const bonus = fifthLayerBonuses.find((x) => x.playerId === player.id && x.tileType === index);
                                if (bonus) {
                                    return (
                                        <span key={`${player.id}_${index}`} className={'text-stone-500'}>
                                            {getFifthLayerBonusAmount(bonus.tileType)}
                                        </span>
                                    );
                                }
                                return <span key={`${player.id}_${index}`}></span>;
                            })}
                        </div>
                        <div className={'grid grid-cols-6 items-center gap-2'}>
                            {Array.from({ length: 6 }).map((_, index) => {
                                const most = mostQuantityBonuses.get(index);
                                const secondMost = secondMostQuantityBonuses.get(index);
                                if (most?.playerIds.includes(player.id) && most.quantity > 0) {
                                    return (
                                        <span key={`${player.id}_${index}`} className={'text-amber-400'}>
                                            {most.quantity}
                                        </span>
                                    );
                                } else if (secondMost?.playerIds.includes(player.id) && secondMost.quantity > 0) {
                                    return (
                                        <span key={`${player.id}_${index}`} className={'text-zinc-300'}>
                                            {secondMost.quantity}
                                        </span>
                                    );
                                }
                                return <span key={`${player.id}_${index}`}></span>;
                            })}
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
