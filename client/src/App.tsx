import { Link, Outlet } from '@tanstack/react-router';
//import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import './App.css';
import { AppProvider } from './AppProvider';
import { GameCreationButton } from './GameCreationButton';
import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';

export const App = () => {
    return (
        <AppProvider>
            <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
                <div className={'grid grid-cols-12 grid-rows-[48px_minmax(0px,_1fr)] [--primary-color:hsl(var(--primary))]'}>
                    <div
                        className={
                            'flex w-full bg-[#1D5841] col-span-12 shadow-md shadow-[#152E23] border-t border-t-[#46A37D]/30 border-b border-b-[#1B4A37] pr-12 justify-between items-center'
                        }
                    >
                        <div className={'pl-12 h-full flex items-center'}>
                            <span className={' text-lg font-semibold '}>{'Garden Tile Game'}</span>
                        </div>
                        <div className={'flex items-center gap-4'}>
                            <Link to={'/'} activeProps={{ className: 'hidden' }}>
                                <Button variant={'ghost'} size={'sm'}>
                                    {'Game List'}
                                </Button>
                            </Link>
                            <GameCreationButton />
                        </div>
                    </div>
                    <div className={'col-span-10 col-start-2 p-6'}>
                        <Outlet />
                    </div>
                </div>
                {/* <TanStackRouterDevtools /> */}
            </ThemeProvider>
        </AppProvider>
    );
};
