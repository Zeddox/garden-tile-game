import { useAtomValue, useSetAtom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import React, { useEffect, useMemo, useRef } from 'react';
import { GiCirclingFish, GiFlowers, GiFruitTree, GiLindenLeaf, GiMushroomHouse, GiStonePile } from 'react-icons/gi';
import { IGameDto, IPlayerDto, ITurnDto } from '../generated/backend';
import { getGameBoardCellsFromPlayerTurns, getTileMap } from './game';
import { GameBoardCell } from './GameBoardCell';
import { GameBoardContext, makeGameBoardAtoms } from './gameBoardContext';
import { useGameBoardContext } from './useGameBoardContext';
import { useGameRoomContext } from './useGameRoomContext';

type GameBoardProps = {
    game: IGameDto;
    player: IPlayerDto;
    isMyPlayer?: boolean;
    onPlacePiece: (placement: { x: number; y: number; layer: number }) => void;
};

export const GameBoard = (props: GameBoardProps) => {
    const playerTurns = props.game.turns
        .filter((x) => x.playerId === props.player.id)
        .sort((a, b) => a.turnNumber - b.turnNumber);

    return (
        <GameBoardContextProvider player={props.player} playerTurns={playerTurns} onPlacePiece={props.onPlacePiece}>
            <GameBoardInner {...props} />
        </GameBoardContextProvider>
    );
};

const GameBoardInner = (props: GameBoardProps) => {
    const { playerColumnStateAtom } = useGameRoomContext();
    const { playerRowStateAtom } = useGameBoardContext();

    const playerColumnState = useAtomValue(
        useMemo(() => {
            return selectAtom(playerColumnStateAtom, (columnStateMap) => columnStateMap.get(props.player.id));
        }, [playerColumnStateAtom, props.player.id])
    );

    const playerRowState = useAtomValue(playerRowStateAtom);

    const getRowIcon = (index: number) => {
        const styles = 'w-full h-full text-slate-500';

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
                        <div
                            data-is-used={playerColumnState?.includes(index)}
                            className={
                                'h-full w-full border-2 border-red-500 data-[is-used="false"]:bg-[#d2b48c24] data-[is-used="true"]:bg-[--primary-150]'
                            }
                        ></div>
                    </div>
                ))}
            </div>
            <div className={'flex w-fit flex-row'}>
                <div className={'mr-4 grid grid-rows-6 border-2 border-[--primary-60]'}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className={'relative flex h-24 max-h-full items-center justify-center'}>
                            <div
                                key={index}
                                className={`h-24 w-24 bg-[#d2b48c24] p-2 ${index !== 0 ? 'border-t-2 border-[--primary-60]' : ''}`}
                            >
                                {getRowIcon(index)}
                            </div>
                            {playerRowState.get(index) !== undefined && (
                                <>
                                    <span className={'absolute left-0 top-0 text-gray-600'}>
                                        {playerRowState?.get(index)!.layers}
                                    </span>
                                    <span className={'absolute right-0 top-0 text-gray-600'}>
                                        {playerRowState?.get(index)!.tileQuantity}
                                    </span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className={`grid aspect-square w-fit grid-cols-6 border-2 border-white`}>
                    {Array.from({ length: 6 }).map((_, y) =>
                        Array.from({ length: 6 }).map((_, x) => (
                            <GameBoardCell key={`(${x}, ${y})`} x={x} y={y} viewOnly={props.isMyPlayer !== true} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const GameBoardContextProvider = (props: {
    player: IPlayerDto;
    playerTurns: ITurnDto[];
    onPlacePiece: (placement: { x: number; y: number; layer: number }) => void;
    children: React.ReactNode;
}) => {
    const game = useAtomValue(useGameRoomContext().gameAtom);
    const atoms = useRef(
        makeGameBoardAtoms({
            playerTurns: props.playerTurns,
            onPlacePiece: props.onPlacePiece,
            player: props.player,
            tileMap: getTileMap(game)
        })
    );

    return (
        <GameBoardContext.Provider value={atoms.current}>
            <GameBoardContextUpdater player={props.player} playerTurns={props.playerTurns} onPlacePiece={props.onPlacePiece} />
            {props.children}
        </GameBoardContext.Provider>
    );
};

const GameBoardContextUpdater = (props: {
    player: IPlayerDto;
    playerTurns: ITurnDto[];
    onPlacePiece: (placement: { x: number; y: number; layer: number }) => void;
}) => {
    const { gameAtom } = useGameRoomContext();
    const { gameBoardCellMapAtom, placePieceCallbackAtom } = useGameBoardContext();

    const setGameBoardCellMap = useSetAtom(gameBoardCellMapAtom);
    const setPlacePieceCallback = useSetAtom(placePieceCallbackAtom);
    const game = useAtomValue(gameAtom);

    useEffect(() => {
        setGameBoardCellMap(getGameBoardCellsFromPlayerTurns(props.playerTurns, props.player, getTileMap(game)));
    }, [game, props.player, props.playerTurns, setGameBoardCellMap]);

    useEffect(() => {
        setPlacePieceCallback(() => props.onPlacePiece);
    }, [props.onPlacePiece, setPlacePieceCallback]);

    return null;
};
