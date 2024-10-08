import { User } from './types';
import { renderSidebar } from './components/sidebar';
import { renderLibrarianContent } from './components/librarian-content';
import { renderMemberContent } from './components/member-content';

export function renderDashboard(container: HTMLDivElement, user: User): void {
    container.innerHTML = `
        <div class="dashboard-container">
            <div id="sidebar" class="sidebar"></div>
            <div id="main-content" class="main-content"></div>
        </div>
    `;

    const sidebarContainer = document.getElementById('sidebar') as HTMLDivElement;
    const mainContentContainer = document.getElementById('main-content') as HTMLDivElement;

    renderSidebar(sidebarContainer, user);

    if (user.role === 'LIBRARIAN') {
        renderLibrarianContent(mainContentContainer);
    } else {
        renderMemberContent(mainContentContainer);
    }
}