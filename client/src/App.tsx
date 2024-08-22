import { Link, Outlet } from '@tanstack/react-router';
//import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AppProvider } from './AppProvider';
import { GameCreationButton } from './GameCreationButton';
import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';
import { UserSelection } from './UserSelection';

export const App = () => {
    return (
        <AppProvider>
            <ThemeProvider defaultTheme={'dark'} storageKey={'ui-theme'}>
                <div className={'grid grid-cols-12 grid-rows-[48px_minmax(0px,_1fr)] [--primary-color:hsl(var(--primary))]'}>
                    <div
                        className={
                            'border-t-[--primary-110]/30 col-span-12 flex w-full items-center justify-between border-b border-t border-b-[--primary-50] bg-[--primary-60] pr-12 shadow-md shadow-[--primary-30]'
                        }
                    >
                        <div className={'flex h-full items-center pl-12'}>
                            <span className={'text-lg font-semibold'}>{'Garden Tile Game'}</span>
                        </div>
                        <div className={'flex items-center gap-4'}>
                            <Link to={'/'} activeProps={{ className: 'hidden' }}>
                                <Button variant={'ghost'} size={'sm'}>
                                    {'< Game List'}
                                </Button>
                            </Link>
                            <GameCreationButton />
                            <UserSelection />
                        </div>
                    </div>
                    <div className={'col-span-10 col-start-2 h-full w-full pt-6'}>
                        <Outlet />
                    </div>
                </div>
                {/* <TanStackRouterDevtools /> */}
            </ThemeProvider>
        </AppProvider>
    );
};
