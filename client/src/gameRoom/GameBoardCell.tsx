import { TileType } from '@/generated/backend';
import { useAtom, useSetAtom } from 'jotai';
import { useMemo, useRef } from 'react';
import { GiCirclingFish, GiFlowers, GiFruitTree, GiLindenLeaf, GiMushroomHouse, GiStonePile } from 'react-icons/gi';
import { GameBoardCellContext, makeGameBoardCellAtoms } from './gameBoardCellContext';
import { useGameBoardCellContext } from './useGameBoardCellState';
import { useGameBoardContext } from './useGameBoardContext';
import { useGameRoomContext } from './useGameRoomContext';

export const GameBoardCell = (props: { x: number; y: number }) => {
    return (
        <GameBoardCellContextProvider {...props}>
            <GameBoardCellInner {...props} />
        </GameBoardCellContextProvider>
    );
};

const GameBoardCellInner = (props: { x: number; y: number }) => {
    const gameBoardContext = useGameBoardContext();
    const cellContext = useGameBoardCellContext();
    const [cellState, setCellState] = useAtom(cellContext.gameCellStateAtom);
    const [columnData, setColumnData] = useAtom(gameBoardContext.columnDataAtom);
    const placePiece = useSetAtom(gameBoardContext.placePieceAtom);

    props.x === 3 && props.y === 3 && console.log({ cellState });

    const tileIcon = useMemo(() => {
        const styles = `w-full h-full`;

        switch (cellState?.tileType) {
            case TileType.AzaleaBush:
                return <GiFlowers className={styles} color={'white'} />;
            case TileType.Boxwood:
                return <GiLindenLeaf className={styles} color={'white'} />;
            case TileType.Fish:
                return <GiCirclingFish className={styles} color={'white'} />;
            case TileType.MapleTree:
                return <GiFruitTree className={styles} color={'white'} />;
            case TileType.Pagoda:
                return <GiMushroomHouse className={styles} color={'white'} />;
            case TileType.Stone:
                return <GiStonePile className={styles} color={'white'} />;
            default:
                return null;
        }
    }, [cellState.tileType]);

    return (
        <div
            data-is-highlighted={cellState.isHighlighted}
            data-is-valid={cellState.isValidForPlacement !== false}
            data-is-occupied={cellState.layer !== undefined}
            data-is-interior-x={props.x < 5}
            data-is-interior-y={props.y < 5}
            className={`h-24 w-24 border-white bg-[#d2b48c24] data-[is-interior-x="true"]:border-r-2 data-[is-interior-y="true"]:border-b-2 data-[is-highlighted="true"]:data-[is-valid="false"]:bg-red-200 data-[is-highlighted="true"]:data-[is-valid="true"]:bg-[--primary-150] data-[is-occupied="true"]:bg-[--primary-60]`}
            onMouseOver={() => {
                setCellState({ ...cellState, isHighlighted: true });
            }}
            onMouseLeave={() => {
                console.log('leaving');
                setCellState({ ...cellState, isHighlighted: false });
            }}
            onMouseDown={() => {
                placePiece({ x: props.x, y: props.y, layer: (cellState.layer ?? 0) + 1 });
                const placedColumn = columnData.find(x => x.index === props.x);
                placedColumn!.isUsed = true;
                setColumnData(columnData);
            }}
        >
            <div className={'relative flex items-center justify-center'}>
                {tileIcon}
                <span className={'absolute left-0 top-0'}>{cellState.layer}</span>
            </div>
        </div>
    );
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
