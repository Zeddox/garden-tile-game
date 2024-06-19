import { ApiClient, IUserDto } from '@/generated/backend';
import { useQuery } from '@tanstack/react-query';

export const identityQueryKeys = {
    allUsers: ['all-users']
};

export const useAllUsers = () => {
    return useQuery<IUserDto[]>({
        queryKey: identityQueryKeys.allUsers,
        queryFn: () => new ApiClient('http://localhost:8020').game_GetAllUsers()
    });
};
