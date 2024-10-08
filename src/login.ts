import { API_URL } from './config';

export function renderLoginForm(container: HTMLDivElement): void {
    container.innerHTML = `
        <div class="container">
            <div class="card">
                <h1 class="title">Library Management System</h1>
                <div id="loginForm" class="form">
                    <h2>Login</h2>
                    <input type="text" id="loginUsername" placeholder="Username" required>
                    <input type="password" id="loginPassword" placeholder="Password" required>
                    <button id="loginButton">Login</button>
                    <p>Don't have an account? <a href="#" id="showSignup">Sign up</a></p>
                </div>
                <div id="signupForm" class="form hidden">
                    <h2>Sign Up</h2>
                    <input type="text" id="signupUsername" placeholder="Username" required>
                    <input type="password" id="signupPassword" placeholder="Password" required>
                    <select id="signupRole">
                        <option value="MEMBER">Member</option>
                        <option value="LIBRARIAN">Librarian</option>
                    </select>
                    <button id="signupButton">Sign Up</button>
                    <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
                </div>
            </div>
        </div>
    `;

    const loginForm = document.getElementById('loginForm') as HTMLDivElement;
    const signupForm = document.getElementById('signupForm') as HTMLDivElement;
    const showSignup = document.getElementById('showSignup') as HTMLAnchorElement;
    const showLogin = document.getElementById('showLogin') as HTMLAnchorElement;
    const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
    const signupButton = document.getElementById('signupButton') as HTMLButtonElement;

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    loginButton.addEventListener('click', login);
    signupButton.addEventListener('click', signup);
}

async function login(): Promise<void> {
    const username = (document.getElementById('loginUsername') as HTMLInputElement).value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.reload();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

async function signup(): Promise<void> {
    const username = (document.getElementById('signupUsername') as HTMLInputElement).value;
    const password = (document.getElementById('signupPassword') as HTMLInputElement).value;
    const role = (document.getElementById('signupRole') as HTMLSelectElement).value as 'LIBRARIAN' | 'MEMBER';

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.reload();
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}