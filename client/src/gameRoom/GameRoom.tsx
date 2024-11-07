import { GamePieceSection } from '@/gamePieces/GamePieceSection';
import { getRouteApi } from '@tanstack/react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LoadingSpinner } from '../components/loading/LoadingSpinner';
import { Card } from '../components/ui/card';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '../components/ui/carousel';
import { IGameDto, IUserDto, TileRotation } from '../generated/backend';
import { useGame, useRecordGameTurn } from '../services/gameApi';
import { useSelectedUser } from '../useSelectedUser';
import { getRoundAndRoundPiecesFromPlayerTurns } from './game';
import { GameBoard } from './GameBoard';
import { GamePlayersSection } from './GamePlayersSection';
import { GameRoomContext, makeGameRoomAtoms } from './gameRoomContext';
import { useGameRoomContext } from './useGameRoomContext';

const route = getRouteApi('/game/$gameId/room');

export const GameRoom = () => {
    const { gameId } = route.useParams();
    const selectedUser = useSelectedUser();

    const { data: game } = useGame(gameId);

    const myPlayer = game?.players.find((x) => x.userId === selectedUser?.id);

    return game === undefined || selectedUser === undefined || myPlayer === undefined ? (
        <div className={'flex items-center justify-center'}>
            <LoadingSpinner />
        </div>
    ) : (
        <GameRoomContextProvider game={game} selectedUser={selectedUser}>
            <GameRoomInner />
        </GameRoomContextProvider>
    );
};
const GameRoomInner = () => {
    const {
        gameAtom,
        myPlayerAtom,
        currentPlayerAtom,
        selectedPieceAtom,
        removePieceAtom,
        selectedPieceRotationAtom,
        roundAtom
    } = useGameRoomContext();
    const game = useAtomValue(gameAtom);
    const currentPlayer = useAtomValue(currentPlayerAtom);
    const round = useAtomValue(roundAtom);
    const selectedUser = useSelectedUser()!;
    const selectedPiece = useAtomValue(selectedPieceAtom);
    const selectedPieceRotation = useAtomValue(selectedPieceRotationAtom);
    const removePiece = useSetAtom(removePieceAtom);

    const { mutate: recordTurn } = useRecordGameTurn(game.id);

    const myPlayer = useAtomValue(myPlayerAtom);

    const opponents = useMemo(() => {
        return game?.players.filter((player) => player.userId !== selectedUser?.id) ?? [];
    }, [game, selectedUser]);

    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) {
            return;
        }
        currentPlayer !== undefined && api?.scrollTo(opponents.findIndex((x) => x.id === currentPlayer.id));
    }, [api, currentPlayer, opponents]);

    const onPlacePiece = useCallback(
        (placement: { x: number; y: number; layer: number }) => {
            if (selectedPiece !== undefined) {
                recordTurn(
                    {
                        playerId: myPlayer!.id,
                        round,
                        turnNumber: game!.turns!.length + 1,
                        layer: placement.layer,
                        positionX: placement.x,
                        positionY: placement.y,
                        rotation:
                            selectedPieceRotation === 0
                                ? TileRotation.Zero
                                : selectedPieceRotation === 90
                                  ? TileRotation.Ninety
                                  : selectedPieceRotation === 180
                                    ? TileRotation.OneHundredEighty
                                    : TileRotation.TwoHunderedSeventy,
                        tileId: selectedPiece!.id
                    },
                    {
                        onSuccess: () => {
                            removePiece(selectedPiece);
                        }
                    }
                );
            }
        },
        [game, myPlayer, recordTurn, removePiece, round, selectedPiece, selectedPieceRotation]
    );

    return (
        <div>
            <div className={'mx-auto h-[50rem] w-full max-w-screen-2xl'}>
                <div className={'mb-5 mt-5 flex h-[15rem]'}>
                    <GamePlayersSection />
                    <GamePieceSection />
                </div>
                <div className={'flex h-[55rem] gap-16'}>
                    <Carousel className={'flex-none'} setApi={setApi}>
                        <CarouselContent>
                            {opponents.map((player, index) => (
                                <CarouselItem key={index}>
                                    <div className={'text-center'}>
                                        <Card
                                            className={
                                                'mb-2 h-[55rem] border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'
                                            }
                                        >
                                            <div className={'h-[90%] content-center'}>
                                                <GameBoard game={game} player={player} onPlacePiece={() => {}} />
                                            </div>
                                        </Card>
                                        <span className={'text-3xl font-extralight tracking-wider text-muted-foreground'}>
                                            {player.name}
                                        </span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className={'flex-none text-center'}>
                        <Card
                            className={
                                'mb-2 h-[55rem] border-slate-700/40 bg-[#fcfaec] bg-gradient-to-b from-[#fffbed] from-10% via-[#e0d8b4a6] via-60% to-[#e0d8b4a6] to-100% p-2 shadow-md shadow-slate-950'
                            }
                        >
                            <div className={'h-[90%] content-center'}>
                                <GameBoard game={game} player={myPlayer} isMyPlayer onPlacePiece={onPlacePiece} />
                            </div>
                            <div className={'text-slate-500'}>
                                {currentPlayer?.id === myPlayer?.id
                                    ? 'Your turn'
                                    : `Waiting for ${currentPlayer?.name} to take their turn...`}
                            </div>
                        </Card>
                        <span className={'text-3xl font-extralight tracking-wider text-[--primary-90]'}>{myPlayer?.name}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GameRoomContextProvider = (props: { game: IGameDto; selectedUser: IUserDto; children: React.ReactNode }) => {
    const atoms = useRef(makeGameRoomAtoms({ game: props.game, selectedUser: props.selectedUser }));

    return (
        <GameRoomContext.Provider value={atoms.current}>
            <GameRoomContextUpdater game={props.game} />
            {props.children}
        </GameRoomContext.Provider>
    );
};

const GameRoomContextUpdater = (props: { game: IGameDto }) => {
    const { gameAtom, currentPlayerAtom, roundAtom, roundPiecesAtom, maxRoundAtom } = useGameRoomContext();

    const setGame = useSetAtom(gameAtom);
    const setCurrentPlayer = useSetAtom(currentPlayerAtom);
    const setRound = useSetAtom(roundAtom);
    const setRoundPieces = useSetAtom(roundPiecesAtom);
    const maxRound = useAtomValue(maxRoundAtom);

    const currentPlayer = getCurrentPlayer(props.game);

    useEffect(() => {
        setGame(props.game);
    }, [props.game, setGame]);

    useEffect(() => {
        setCurrentPlayer(currentPlayer);
    }, [currentPlayer, setCurrentPlayer]);

    useEffect(() => {
        const { round, roundPieces } = getRoundAndRoundPiecesFromPlayerTurns(props.game, props.game.turns, maxRound);
        setRound(round);
        setRoundPieces(roundPieces);
    }, [maxRound, props.game, setRound, setRoundPieces]);

    return null;
};

const getCurrentPlayer = (game: IGameDto | undefined) => {
    const lastTurnPlayer = game?.players.find(
        (x) => x.id === game?.turns.sort((a, b) => b.turnNumber - a.turnNumber)[0]?.playerId
    );
    if (game === undefined) {
        return undefined;
    }
    if (lastTurnPlayer === undefined) {
        return game.players.find((x) => x.id === game.startingPlayerId);
    }
    if ((lastTurnPlayer.order ?? 0) < game.players.length) {
        return game.players.find((x) => x.order === (lastTurnPlayer.order ?? 0) + 1);
    } else {
        return game.players.find((x) => x.order === 1);
    }
};
