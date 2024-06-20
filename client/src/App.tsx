import { Link, Outlet } from '@tanstack/react-router';
//import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import './App.css';
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
                            'flex w-full bg-[--primary-60] col-span-12 shadow-md shadow-[--primary-30] border-t border-t-[--primary-110]/30 border-b border-b-[--primary-50] pr-12 justify-between items-center'
                        }
                    >
                        <div className={'pl-12 h-full flex items-center'}>
                            <span className={' text-lg font-semibold '}>{'Garden Tile Game'}</span>
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
                    <div className={'col-span-10 col-start-2 pt-6 w-full h-full'}>
                        <Outlet />
                    </div>
                </div>
                {/* <TanStackRouterDevtools /> */}
            </ThemeProvider>
        </AppProvider>
    );
};
