import './App.css';
import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

export const App = () => {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
            <div className={'flex flex-col gap-2'}>
                <Input placeholder={'Enter Game Name'} />
                <Button>{'Create Game'}</Button>
            </div>
        </ThemeProvider>
    );
};
