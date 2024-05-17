import { AppIndex } from '@/AppIndex';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: () => <AppIndex />
});
