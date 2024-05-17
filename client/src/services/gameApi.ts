import { ApiClient, GameDto, IGameDto } from '@/generated/backend';
import { useMutation, useQuery } from '@tanstack/react-query';

export const gameApiQueryKeys = {
    games: ['games']
};

export const useGames = () => {
    return useQuery<IGameDto[]>({
        queryKey: gameApiQueryKeys.games,
        queryFn: () => new ApiClient('http://localhost:8020').game_GetAllJoinableGames()
    });
};

export const useCreateGame = () => {
    return useMutation<IGameDto, Error, IGameDto>({
        mutationFn: (dto) => new ApiClient('http://localhost:8020').game_CreateNewGame(dto as GameDto)
    });
};
