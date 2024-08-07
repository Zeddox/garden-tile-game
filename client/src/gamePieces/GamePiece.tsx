import { ITileDto, TileShape, TileType } from "@/generated/backend";
import { useMemo } from "react";
import { GiFruitTree, GiMushroomHouse, GiFlowers, GiLindenLeaf, GiStonePile, GiCirclingFish } from "react-icons/gi";

export const GamePiece = (props: { tileShape: TileShape, size: number, tile?: ITileDto }) => {
    const { size, tile } = props;

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
        const styles = 'w-full h-full';

        switch (tile?.type) {
            case TileType.AzaleaBush:
                return <GiFlowers className={styles}/>
            case TileType.Boxwood:
                return <GiLindenLeaf className={styles}/>
            case TileType.Fish:
                return <GiCirclingFish className={styles}/>
            case TileType.MapleTree:
                return <GiFruitTree className={styles}/>
            case TileType.Pagoda:
                return <GiMushroomHouse className={styles}/>
            default:
                return <GiStonePile className={styles}/>
        }
    }, [tile]);

    return (
        <div className={`grid grid-cols-${columnNumber} w-fit h-fit`}>

            {Array.from({ length: tile?.shape === TileShape.Corner ? 3 : columnNumber }).map((_, index) => (
                <div className={`w-${size} h-${size} bg-[--primary-130] ${tile?.shape === TileShape.Corner && index === 2 ? 'col-start-2' : ''}`}>
                    {index === tile?.typePositionY && tileIcon}
                </div>
            ))}
        </div>
    );
}