import { TileType } from '@/generated/backend';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
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
    const gameRoomContext = useGameRoomContext();
    const cellContext = useGameBoardCellContext();
    const [cellState, setCellState] = useAtom(cellContext.gameCellStateAtom);
    const placePiece = useSetAtom(gameBoardContext.placePieceAtom);
    const selectedPiece = useAtomValue(gameRoomContext.selectedPieceAtom);

    const interactionProps = props.viewOnly
        ? {}
        : {
              onMouseOver: () => {
                  setCellState({ ...cellState, isHighlighted: true, isOrigin: true });
              },
              onMouseLeave: () => {
                  setCellState({ ...cellState, isHighlighted: false, isOrigin: false });
              },
              onMouseDown: () => {
                if (cellState.isValidForPlacement !== false) {
                    placePiece({ x: props.x, y: props.y, layer: (cellState.layer ?? 0) + 1 });
                }
              }
          };

    const typeQuantity = cellState.isOrigin
        ? selectedPiece?.typeQuantity
        : cellState.isHighlighted
          ? undefined
          : cellState.typeQuantity;
    const tileType = cellState.isOrigin ? selectedPiece?.type : cellState.isHighlighted ? undefined : cellState.tileType;

    const cssStyles: React.CSSProperties = {
        '--cell-layer': `${cellState.layer}`
    } as React.CSSProperties;

    return (
        <div style={cssStyles}>
            <div
                data-is-highlighted={cellState.isHighlighted}
                data-is-valid={cellState.isValidForPlacement !== false}
                data-is-occupied={cellState.layer !== undefined}
                data-is-interior-x={props.x < 5}
                data-is-interior-y={props.y < 5}
                className={`game-board-cell h-24 w-24 border-white bg-[#d2b48c24] shadow-[--cell-shadow] data-[is-interior-x="true"]:border-r-2 data-[is-interior-y="true"]:border-b-2 data-[is-highlighted="true"]:data-[is-valid="false"]:bg-red-200 data-[is-highlighted="true"]:data-[is-valid="true"]:bg-[--primary-150] data-[is-occupied="true"]:bg-[--occupied-cell-background]`}
                {...interactionProps}
            >
                <div className={'relative flex h-24 max-h-full items-center justify-center'}>
                    <div className={'flex max-w-full flex-wrap items-center justify-center gap-0.5'}>
                        {Array.from({ length: typeQuantity ?? 0 }).map((_, i) => (
                            <TileIcon key={i} tileType={tileType} className={'h-8 w-8'} />
                        ))}
                    </div>
                    <span className={'absolute left-0 top-0'}>{cellState.layer}</span>
                </div>
            </div>
        </div>
    );
};

const TileIcon = (props: { tileType: TileType | undefined; className: string }) => {
    switch (props.tileType) {
        case TileType.AzaleaBush:
            return <GiFlowers className={props.className} color={'var(--cell-color)'} />;
        case TileType.Boxwood:
            return <GiLindenLeaf className={props.className} color={'var(--cell-color)'} />;
        case TileType.Fish:
            return <GiCirclingFish className={props.className} color={'var(--cell-color)'} />;
        case TileType.MapleTree:
            return <GiFruitTree className={props.className} color={'var(--cell-color)'} />;
        case TileType.Pagoda:
            return <GiMushroomHouse className={props.className} color={'var(--cell-color)'} />;
        case TileType.Stone:
            return <GiStonePile className={props.className} color={'var(--cell-color)'} />;
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
