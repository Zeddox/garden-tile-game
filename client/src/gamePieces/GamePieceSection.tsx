import { GamePieces } from '@/gameRoom/game';
import { useGameRoomContext } from '@/gameRoom/useGameRoomContext';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { GamePiece } from '../gamePieces/GamePiece';
import { ITileDto, TileShape } from '../generated/backend';
import { Button } from '@/components/ui/button';

export const GamePieceSection = () => {
    const gameRoomContext = useGameRoomContext();
    const roundPieces = useAtomValue(gameRoomContext.roundPiecesAtom);
    const round = useAtomValue(gameRoomContext.roundAtom);
    const selectedPiece = useAtomValue(gameRoomContext.selectedPieceAtom);
    const [selectedPieceRotation, setSelectedPieceRotation] = useAtom(gameRoomContext.selectedPieceRotationAtom);

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
            <div className={'flex h-6 justify-between'}>
                <span className={'ml-5 text-xl'}>{`Round ${round}`}</span>
                {selectedPiece && (
                    <div className={'flex gap-2'}>
                        <Button
                            onClick={() =>
                                setSelectedPieceRotation((prev) => (prev === 0 ? 270 : prev === 90 ? 0 : prev === 180 ? 90 : 180))
                            }
                        >
                            {'<-'}
                        </Button>
                        <Button
                            onClick={() =>
                                setSelectedPieceRotation((prev) => (prev === 0 ? 90 : prev === 90 ? 180 : prev === 180 ? 270 : 0))
                            }
                        >
                            {'->'}
                        </Button>
                    </div>
                )}
            </div>
            <div className={'mt-10 flex content-center'}>
                {(Object.values(gamePieces) as ITileDto[][]).map((tiles, i) => (
                    <div key={i} className={`flex w-1/4 flex-row flex-wrap justify-evenly`}>
                        {tiles.map((tile) => (
                            <GamePiece
                                key={tile.id}
                                tileShape={TileShape.Single}
                                size={10}
                                tile={tile}
                                rotation={selectedPiece?.id === tile.id ? selectedPieceRotation : 0}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
