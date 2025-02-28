import { useAtomValue } from 'jotai';
import { FaCrown } from 'react-icons/fa';
import { getRoundTiles } from './game';
import { useGameRoomContext } from './useGameRoomContext';
import { TileType } from '@/generated/backend';
import { GiFlowers, GiLindenLeaf, GiCirclingFish, GiFruitTree, GiMushroomHouse, GiStonePile } from 'react-icons/gi';

export const GamePlayersSection = () => {
    const { gameAtom, currentPlayerAtom, fifthLayerBonusesAtom } = useGameRoomContext();
    const game = useAtomValue(gameAtom);
    const currentPlayer = useAtomValue(currentPlayerAtom);
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
                        <div className={'flex items-center gap-2'}>
                            {fifthLayerBonuses
                                .filter((x) => x.playerId === player.id)
                                .map((x) => (
                                    <span key={x.tileType} className={'h-4 w-4 rounded-sm'}>
                                        {getTileTypeIcon(x.tileType)}
                                    </span>
                                ))}
                            <div className={'font-semibold'}>{scores.get(player.id) ?? 0}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getTileTypeIcon = (tileType: TileType) => {
    switch (tileType) {
        case TileType.AzaleaBush:
            return <GiFlowers />;
        case TileType.Boxwood:
            return <GiLindenLeaf />;
        case TileType.Fish:
            return <GiCirclingFish />;
        case TileType.MapleTree:
            return <GiFruitTree />;
        case TileType.Pagoda:
            return <GiMushroomHouse />;
        default:
            return <GiStonePile />;
    }
};

const getFifthLayerBonusAmount = (tileType: TileType) => {
    switch (tileType) {
        case TileType.MapleTree:
            return 10;
        case TileType.Pagoda:
            return 9;
        case TileType.Fish:
            return 8;
        case TileType.AzaleaBush:
            return 7;
        case TileType.Boxwood:
            return 6;
        case TileType.Stone:
            return 5;
        default:
            return 0;
    }
};
