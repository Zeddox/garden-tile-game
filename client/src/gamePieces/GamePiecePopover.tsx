import { ITileDto, TileShape } from "@/generated/backend";
import { GamePiece } from "./GamePiece";

export const GamePiecePopover = (props: { tileShape: TileShape, tiles: ITileDto[] }) => {
    const { tileShape, tiles } = props;

    return (
        <div className={'flex justify-center gap-5'}>
            {tiles.map((tile) => (
                <GamePiece tileShape={tileShape} size={12} tile={tile}/>
            ))}
        </div>
    );
}