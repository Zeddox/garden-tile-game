import { useSetAtom } from 'jotai';
import React, { useEffect, useRef } from 'react';
import { GiCirclingFish, GiFlowers, GiFruitTree, GiLindenLeaf, GiMushroomHouse, GiStonePile } from 'react-icons/gi';
import { getGameBoardCellsFromPlayerTurns } from './game';
import { GameBoardCell } from './GameBoardCell';
import { GameBoardContext, makeGameBoardAtoms } from './gameBoardContext';
import { IGameDto, IPlayerDto, ITurnDto } from './generated/backend';
import { useGameBoardContext } from './useGameBoardContext';

export const GameBoard = (props: {
    game: IGameDto;
    player: IPlayerDto;
    onPlacePiece: (placement: { x: number; y: number }) => void;
}) => {
    const playerTurns = props.game.turns
        .filter((x) => x.playerId === props.player.id)
        .sort((a, b) => a.turnNumber - b.turnNumber);

    return (
        <GameBoardContextProvider playerTurns={playerTurns} onPlacePiece={props.onPlacePiece}>
            <GameBoardInner />
        </GameBoardContextProvider>
    );
};

const GameBoardInner = () => {
    const getRowIcon = (index: number) => {
        const styles = 'w-full h-full';

        switch (index) {
            case 0:
                return <GiFruitTree className={styles} />;
            case 1:
                return <GiMushroomHouse className={styles} />;
            case 2:
                return <GiCirclingFish className={styles} />;
            case 3:
                return <GiFlowers className={styles} />;
            case 4:
                return <GiLindenLeaf className={styles} />;
            default:
                return <GiStonePile className={styles} />;
        }
    };
    return (
        <div className={'flex w-full flex-col'}>
            <div className={'mb-5 ml-[7.25rem] grid w-fit grid-cols-6'}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className={`h-12 w-24 p-2`}>
                        <div className={'h-full w-full border-2 border-red-500 bg-[#d2b48c24]'}></div>
                    </div>
                ))}
            </div>
            <div className={'flex w-fit flex-row'}>
                <div className={'mr-4 grid grid-rows-6 border-2 border-red-500'}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className={`h-24 w-24 bg-[#d2b48c24] p-2 ${index !== 0 ? 'border-t-2 border-red-500' : ''}`}
                        >
                            {getRowIcon(index)}
                        </div>
                    ))}
                </div>
                <div className={`grid aspect-square w-fit grid-cols-6 border-2 border-white`}>
                    {Array.from({ length: 6 }).map((_, y) =>
                        Array.from({ length: 6 }).map((_, x) => <GameBoardCell key={`(${x}, ${y})`} x={x} y={y} />)
                    )}
                </div>
            </div>
        </div>
    );
};

const GameBoardContextProvider = (props: {
    playerTurns: ITurnDto[];
    onPlacePiece: (placement: { x: number; y: number }) => void;
    children: React.ReactNode;
}) => {
    const atoms = useRef(makeGameBoardAtoms({ playerTurns: props.playerTurns, onPlacePiece: props.onPlacePiece }));

    return (
        <GameBoardContext.Provider value={atoms.current}>
            <GameBoardContextUpdater playerTurns={props.playerTurns} onPlacePiece={props.onPlacePiece} />
            {props.children}
        </GameBoardContext.Provider>
    );
};

const GameBoardContextUpdater = (props: {
    playerTurns: ITurnDto[];
    onPlacePiece: (placement: { x: number; y: number }) => void;
}) => {
    const { gameBoardCellMapAtom, placePieceCallbackAtom } = useGameBoardContext();

    const setGameBoardCellMap = useSetAtom(gameBoardCellMapAtom);
    const setPlacePieceCallback = useSetAtom(placePieceCallbackAtom);

    useEffect(() => {
        setGameBoardCellMap(getGameBoardCellsFromPlayerTurns(props.playerTurns));
    }, [props.playerTurns, setGameBoardCellMap]);

    useEffect(() => {
        setPlacePieceCallback(() => props.onPlacePiece);
    }, [props.onPlacePiece, setPlacePieceCallback]);

    return null;
};
