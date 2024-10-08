import './style.css';
import { renderDashboard } from './dashboard';
import { renderLoginForm } from './login';
import { User } from './types';

const app = document.getElementById('app') as HTMLDivElement;

function checkAuthAndRender(): void {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user: User | null = userString ? JSON.parse(userString) : null;

    if (token && user) {
        renderDashboard(app, user);
    } else {
        renderLoginForm(app);
    }
}

checkAuthAndRender();