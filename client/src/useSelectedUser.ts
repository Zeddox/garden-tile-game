import { useAtomValue } from 'jotai';
import { useContext, useMemo } from 'react';
import { AppContext } from './appContext';
import { useAllUsers } from './services/identityApi';

export const useSelectedUser = () => {
    const { data: users } = useAllUsers();
    const selectedUserId = useAtomValue(useContext(AppContext)!.selectedUserIdAtom);

    return useMemo(() => users?.find((x) => x.id === selectedUserId), [users, selectedUserId]);
};
