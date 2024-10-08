import { renderManageBooks } from './manage-books';
import { renderManageMembers } from './manage-members';
import { renderDeletedMembers } from './deleted-members';

export function renderLibrarianContent(container: HTMLDivElement): void {
    container.innerHTML = `
        <div id="content" class="content">
            <h2>Welcome, Librarian</h2>
            <p>Select an option from the sidebar to get started.</p>
        </div>
    `;

    const sidebarNavItems = document.querySelectorAll('.nav-item');
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = (e.target as HTMLAnchorElement).getAttribute('data-page');
            const contentContainer = document.getElementById('content') as HTMLDivElement;
            switch (page) {
                case 'books':
                    renderManageBooks(contentContainer);
                    break;
                case 'members':
                    renderManageMembers(contentContainer);
                    break;
                case 'deleted-members':
                    renderDeletedMembers(contentContainer);
                    break;
            }
        });
    });
}