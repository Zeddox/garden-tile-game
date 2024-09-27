import { useGameRoomContext } from '@/gameRoom/useGameRoomContext';
import { ITileDto, TileShape, TileType } from '@/generated/backend';
import { useAtom, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { GiFruitTree, GiMushroomHouse, GiFlowers, GiLindenLeaf, GiStonePile, GiCirclingFish } from 'react-icons/gi';

export const GamePiece = (props: { tileShape: TileShape; size: number; tile?: ITileDto }) => {
    const { size, tile } = props;

    const { selectedPieceAtom } = useGameRoomContext();

    const [selectedPiece, setSelectedPiece] = useAtom(selectedPieceAtom);

    const columnNumber = useMemo(() => {
        switch (tile?.shape) {
            case TileShape.Single:
                return 1;
            case TileShape.Double:
            case TileShape.Corner:
                return 2;
            case TileShape.Triple:
                return 3;
            default:
                return 0;
        }
    }, [tile]);

    const tileIcon = useMemo(() => {
        const styles = `w-full h-full`;

        switch (tile?.type) {
            case TileType.AzaleaBush:
                return <GiFlowers className={styles} color={selectedPiece?.id === tile?.id ? '#7dbd9f' : 'white'}/>;
            case TileType.Boxwood:
                return <GiLindenLeaf className={styles} color={selectedPiece?.id === tile?.id ? '#7dbd9f' : 'white'}/>;
            case TileType.Fish:
                return <GiCirclingFish className={styles} color={selectedPiece?.id === tile?.id ? '#7dbd9f' : 'white'}/>;
            case TileType.MapleTree:
                return <GiFruitTree className={styles} color={selectedPiece?.id === tile?.id ? '#7dbd9f' : 'white'}/>;
            case TileType.Pagoda:
                return <GiMushroomHouse className={styles} color={selectedPiece?.id === tile?.id ? '#7dbd9f' : 'white'}/>;
            default:
                return <GiStonePile className={styles} color={selectedPiece?.id === tile?.id ? '#7dbd9f' : 'white'}/>;
        }
    }, [tile, selectedPiece]);

    return (
        <div className={`grid grid-cols-${columnNumber} h-fit w-fit`} onClick={() => setSelectedPiece(tile)}>
            {Array.from({ length: tile?.shape === TileShape.Corner ? 3 : columnNumber }).map((_, index) => (
                <div
                    key={index}
                    className={`w-${size} h-${size} ${selectedPiece?.id === tile?.id ? 'bg-white' : 'bg-[--primary-130]'} ${tile?.shape === TileShape.Corner && index === 2 ? 'col-start-2' : ''}`}
                >
                    {index === tile?.typePositionY && tileIcon}
                </div>
            ))}
        </div>
    );
};
