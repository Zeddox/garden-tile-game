import { atom } from 'jotai';
import React from 'react';
import { IGameDto, IPlayerDto, ITileDto, IUserDto } from '../generated/backend';

export type GameRoomContextValue = ReturnType<typeof makeGameRoomAtoms>;

export const GameRoomContext = React.createContext<GameRoomContextValue | undefined>(undefined);

export const makeGameRoomAtoms = (state: { game: IGameDto; selectedUser: IUserDto }) => {
    const gameAtom = atom(state.game);

    const myPlayerAtom = atom(state.game.players.find((x) => x.userId === state.selectedUser.id)!);
    const currentPlayerAtom = atom<IPlayerDto | undefined>(undefined);
    
    const selectedPieceAtom = atom<ITileDto | undefined>(undefined);
    // const selectedPieceAtom = atom((get) => get(selectedPieceValueAtom), (_get, set, selectedPiece: ITileDto | undefined) => {
    //     console.log(selectedPiece);
    //     set(selectedPieceValueAtom, selectedPiece)
    // });

    return {
        gameAtom,
        myPlayerAtom,
        currentPlayerAtom,
        selectedPieceAtom
    };
};
