import { GamePieces } from '@/gameRoom/game';
import { useGameRoomContext } from '@/gameRoom/useGameRoomContext';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { GamePiece } from '../gamePieces/GamePiece';
import { ITileDto, TileShape } from '../generated/backend';

export const GamePieceSection = () => {
    const gameRoomContext = useGameRoomContext();
    const roundPieces = useAtomValue(gameRoomContext.roundPiecesAtom);

    const gamePieces: GamePieces = useMemo(() => {
        return {
            singlePieces: roundPieces.filter((piece) => piece.shape === TileShape.Single) ?? [],
            doublePieces: roundPieces.filter((piece) => piece.shape === TileShape.Double) ?? [],
            triplePieces: roundPieces.filter((piece) => piece.shape === TileShape.Triple) ?? [],
            cornerPieces: roundPieces.filter((piece) => piece.shape === TileShape.Corner) ?? []
        };
    }, [roundPieces]);

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
