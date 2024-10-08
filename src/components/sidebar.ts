import { User } from '../types';

export function renderSidebar(container: HTMLDivElement, user: User): void {
    container.innerHTML = `
        <div class="sidebar-header">
            <h1 class="logo">LMS</h1>
            ${user.role === 'LIBRARIAN' ? '<p class="role">Librarian</p>' : ''}
        </div>
        <nav class="sidebar-nav">
            ${user.role === 'LIBRARIAN' ? renderLibrarianNavItems() : renderMemberNavItems()}
        </nav>
        <button id="logoutBtn" class="logout-btn">Logout</button>
    `;

    const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
    logoutBtn.addEventListener('click', logout);
}

function renderLibrarianNavItems(): string {
    return `
        <a href="#" class="nav-item" data-page="books">Manage Books</a>
        <a href="#" class="nav-item" data-page="members">Manage Members</a>
        <a href="#" class="nav-item" data-page="history">Borrow History</a>
        <a href="#" class="nav-item" data-page="deleted-members">Deleted Members</a>
    `;
}

function renderMemberNavItems(): string {
    return `
        <a href="#" class="nav-item" data-page="available-books">Available Books</a>
        <a href="#" class="nav-item" data-page="borrowed-books">Borrowed Books</a>
        <a href="#" class="nav-item" data-page="history">Borrow History</a>
    `;
}

function logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}