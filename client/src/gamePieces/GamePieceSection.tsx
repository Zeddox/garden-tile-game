import { useGameRoomContext } from '@/gameRoom/useGameRoomContext';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { GamePiece } from '../gamePieces/GamePiece';
import { ITileDto, TileShape } from '../generated/backend';
import { GamePieces } from '@/gameRoom/game';

export const GamePieceSection = () => {
    const { gameAtom } = useGameRoomContext();
    const game = useAtomValue(gameAtom);

    const gamePieces: GamePieces = useMemo(() => {
        return {
            singlePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Single) ?? [],
            doublePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Double) ?? [],
            triplePieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Triple) ?? [],
            cornerPieces: game?.firstRoundTiles?.filter((piece) => piece.shape === TileShape.Corner) ?? []
        };
    }, [game]);
    return (
        <div className={'bg-slate h-full w-3/4 flex-auto border-l border-white'}>
            <span className={'ml-5 text-xl'}>{'Round 1'}</span>
            <div className={'mt-10 flex content-center'}>
                {(Object.values(gamePieces) as ITileDto[][]).map((tiles, i) => (
                    <div key={i} className={'flex w-1/4 flex-row flex-wrap justify-evenly'}>
                        {tiles.map((tile) => (
                            <GamePiece key={tile.id} tileShape={TileShape.Single} size={10} tile={tile} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
