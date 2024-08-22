import { atom } from 'jotai';
import React from 'react';
import { IGameDto, IPlayerDto, IUserDto } from '../generated/backend';

export type GameRoomContextValue = ReturnType<typeof makeGameRoomAtoms>;

export const GameRoomContext = React.createContext<GameRoomContextValue | undefined>(undefined);

export const makeGameRoomAtoms = (state: { game: IGameDto; selectedUser: IUserDto }) => {
    const gameAtom = atom(state.game);

    const myPlayerAtom = atom(state.game.players.find((x) => x.userId === state.selectedUser.id)!);
    const currentPlayerAtom = atom<IPlayerDto | undefined>(undefined);

    return {
        gameAtom,
        myPlayerAtom,
        currentPlayerAtom
    };
};
