import { useRef } from 'react';
import { GameBoardCellContext, makeGameBoardCellAtoms } from './gameBoardCellContext';
import { useGameBoardContext } from './useGameBoardContext';
import { useGameBoardCellContext } from './useGameBoardCellState';
import { useAtom, useSetAtom } from 'jotai';

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
    const placePiece = useSetAtom(gameBoardContext.placePieceAtom);
    return (
        <div
            data-is-highlighted={cellState.isHighlighted}
            className={`w-24 border-white bg-[#d2b48c24] ${props.y < 5 ? 'border-b-2' : ''} ${props.x < 5 ? 'border-r-2' : ''} data-[is-highlighted="true"]:bg-red-200`}
            onMouseOver={() => {
                setCellState({ isHighlighted: true });
            }}
            onMouseLeave={() => {
                setCellState({ isHighlighted: false });
            }}
            onMouseDown={() => {
                placePiece({ x: props.x, y: props.y });
            }}
        ></div>
    );
};

const GameBoardCellContextProvider = (props: { x: number; y: number; children: React.ReactNode }) => {
    const gameBoardContext = useGameBoardContext();

    const atoms = useRef(makeGameBoardCellAtoms({ x: props.x, y: props.y, gameBoardContext }));

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
