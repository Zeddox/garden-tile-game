import { ApiClient, CreateGameDto, ICreateGameDto, IGameDto, IUpdateGameDto, UpdateGameDto } from '@/generated/backend';
import { useMutation, useQuery } from '@tanstack/react-query';

export const gameApiQueryKeys = {
    games: ['games'],
    game: (id:string ) => ['game', id]
};

export const useGames = () => {
    return useQuery<IGameDto[]>({
        queryKey: gameApiQueryKeys.games,
        queryFn: () => new ApiClient('http://localhost:8020').game_GetAllJoinableGames()
    });
};

export const useGame = (id:string) => {
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
}