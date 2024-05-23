import { Outlet } from '@tanstack/react-router';
//import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import './App.css';
import { ThemeProvider } from './components/theme-provider';
import { GameCreationButton } from './GameCreationButton';
import { AppProvider } from './AppProvider';

export const App = () => {
    return (
        <AppProvider>
            <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
                <div className={'grid grid-cols-12 grid-rows-[48px_minmax(0px,_1fr)]'}>
                    <div
                        className={
                            'flex w-full bg-primary col-span-12 shadow-sm shadow-primary pl-12 pr-12 justify-between items-center'
                        }
                    >
                        <span className={'text-lg'}>{'Garden Tile Game'}</span>
                        <GameCreationButton />
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
