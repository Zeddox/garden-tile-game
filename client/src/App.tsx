import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import './App.css';
import { ThemeProvider } from './components/theme-provider';

export const App = () => {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
            <Outlet />
            <TanStackRouterDevtools />
        </ThemeProvider>
    );
};
