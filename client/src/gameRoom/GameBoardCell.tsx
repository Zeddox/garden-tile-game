import { TileType } from '@/generated/backend';
import { useAtom, useSetAtom } from 'jotai';
import { useRef } from 'react';
import { GiCirclingFish, GiFlowers, GiFruitTree, GiLindenLeaf, GiMushroomHouse, GiStonePile } from 'react-icons/gi';
import { GameBoardCellContext, makeGameBoardCellAtoms } from './gameBoardCellContext';
import { useGameBoardCellContext } from './useGameBoardCellState';
import { useGameBoardContext } from './useGameBoardContext';
import { useGameRoomContext } from './useGameRoomContext';

type GameBoardCellProps = { x: number; y: number; viewOnly: boolean };

export const GameBoardCell = (props: GameBoardCellProps) => {
    return (
        <GameBoardCellContextProvider {...props}>
            <GameBoardCellInner {...props} />
        </GameBoardCellContextProvider>
    );
};

const GameBoardCellInner = (props: GameBoardCellProps) => {
    const gameBoardContext = useGameBoardContext();
    const cellContext = useGameBoardCellContext();
    const [cellState, setCellState] = useAtom(cellContext.gameCellStateAtom);
    const placePiece = useSetAtom(gameBoardContext.placePieceAtom);

    const interactionProps = props.viewOnly
        ? {}
        : {
              onMouseOver: () => {
                  setCellState({ ...cellState, isHighlighted: true });
              },
              onMouseLeave: () => {
                  setCellState({ ...cellState, isHighlighted: false });
              },
              onMouseDown: () => {
                  placePiece({ x: props.x, y: props.y, layer: (cellState.layer ?? 0) + 1 });
              }
          };

    return (
        <div
            data-is-highlighted={cellState.isHighlighted}
            data-is-valid={cellState.isValidForPlacement !== false}
            data-is-occupied={cellState.layer !== undefined}
            data-is-interior-x={props.x < 5}
            data-is-interior-y={props.y < 5}
            className={`h-24 w-24 border-white bg-[#d2b48c24] data-[is-interior-x="true"]:border-r-2 data-[is-interior-y="true"]:border-b-2 data-[is-highlighted="true"]:data-[is-valid="false"]:bg-red-200 data-[is-highlighted="true"]:data-[is-valid="true"]:bg-[--primary-150] data-[is-occupied="true"]:bg-[--primary-60]`}
            {...interactionProps}
        >
            <div className={'relative flex h-24 max-h-full items-center justify-center'}>
                <div className={'flex max-w-full flex-wrap items-center justify-center gap-0.5'}>
                    {Array.from({ length: cellState.typeQuantity ?? 0 }).map((_, i) => (
                        <TileIcon key={i} tileType={cellState.tileType} className={'h-8 w-8'} />
                    ))}
                </div>
                <span className={'absolute left-0 top-0'}>{cellState.layer}</span>
            </div>
        </div>
    );
};

const TileIcon = (props: { tileType: TileType | undefined; className: string }) => {
    switch (props.tileType) {
        case TileType.AzaleaBush:
            return <GiFlowers className={props.className} color={'white'} />;
        case TileType.Boxwood:
            return <GiLindenLeaf className={props.className} color={'white'} />;
        case TileType.Fish:
            return <GiCirclingFish className={props.className} color={'white'} />;
        case TileType.MapleTree:
            return <GiFruitTree className={props.className} color={'white'} />;
        case TileType.Pagoda:
            return <GiMushroomHouse className={props.className} color={'white'} />;
        case TileType.Stone:
            return <GiStonePile className={props.className} color={'white'} />;
        default:
            return null;
    }
};

const GameBoardCellContextProvider = (props: { x: number; y: number; children: React.ReactNode }) => {
    const gameBoardContext = useGameBoardContext();
    const gameRoomContext = useGameRoomContext();

    const atoms = useRef(makeGameBoardCellAtoms({ x: props.x, y: props.y, gameBoardContext, gameRoomContext }));

    return (
        <GameBoardCellContext.Provider value={atoms.current}>
            <GameBoardCellContextUpdater /> {props.children}
        </GameBoardCellContext.Provider>
    );
};

const GameBoardCellContextUpdater = () => {
    // const { gameBoardCellMapAtom } = ();

    // const setGameBoardCellMap = useSetAtom(gameBoardCellMapAtom);

    // useEffect(() => {
    //     setGameBoardCellMap(getGameBoardCellsFromPlayerTurns(props.playerTurns));
    // }, [props.playerTurns, setGameBoardCellMap]);

    return null;
};
