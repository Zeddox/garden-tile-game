import {
    ApiClient,
    CreateGameDto,
    ICreateGameDto,
    IGameDto,
    ITurnDto,
    IUpdateGameDto,
    IUpdatePlayerDto,
    TurnDto,
    UpdateGameDto,
    UpdatePlayerDto
} from '@/generated/backend';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface ConnectionIdDto {
    oldConnectionId: string;
    newConnectionId: string;
}

export const gameApiQueryKeys = {
    games: ['games'],
    game: (id: string) => ['game', id],
    playerByConnectionId: (id: string, gameId: string) => ['player', { id, gameId }]
};

export const useGames = () => {
    return useQuery<IGameDto[]>({
        queryKey: gameApiQueryKeys.games,
        queryFn: () => new ApiClient('http://localhost:8020').game_GetAllJoinableGames()
    });
};

export const useGame = (id: string) => {
    return useQuery<IGameDto>({
        queryKey: gameApiQueryKeys.game(id),
        queryFn: () => new ApiClient('http://localhost:8020').game_GetGameById(id)
    });
};

export const useCreateGame = () => {
    return useMutation<IGameDto, Error, ICreateGameDto>({
        mutationFn: (dto) => new ApiClient('http://localhost:8020').game_CreateNewGame(dto as CreateGameDto)
    });
};

export const useUpdateGame = () => {
    return useMutation<void, Error, IUpdateGameDto>({
        mutationFn: (dto) => new ApiClient('http://localhost:8020').game_UpdateGame(dto as UpdateGameDto)
    });
};

export const useUpdatePlayer = () => {
    return useMutation<void, Error, IUpdatePlayerDto>({
        mutationFn: (dto) => new ApiClient('http://localhost:8020').game_UpdatePlayer(dto as UpdatePlayerDto)
    });
};

export const useRecordGameTurn = (gameId: string) => {
    return useMutation<void, Error, ITurnDto>({
        mutationFn: (dto) => new ApiClient('http://localhost:8020').game_RecordGameTurn(gameId, dto as TurnDto)
    });
};
