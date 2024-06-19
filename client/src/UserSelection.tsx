import { useAllUsers } from './services/identityApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { AppContext } from './appContext';

export const UserSelection = () => {
    const { data: users } = useAllUsers();
    const [selectedUserId, setSelectedUserId] = useAtom(useContext(AppContext)!.selectedUserIdAtom);

    return (
        <Select onValueChange={(value) => setSelectedUserId(value)} defaultValue={selectedUserId ?? undefined} >
            <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select a user' />
            </SelectTrigger>
            <SelectContent>
                {users?.map((x) => (
                    <SelectItem key={x.id} value={x.id}>
                        {x.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
