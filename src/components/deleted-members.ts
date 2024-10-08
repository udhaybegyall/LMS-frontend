import { User } from '../types';
import { API_URL } from '../config';

export function renderDeletedMembers(container: HTMLDivElement): void {
    container.innerHTML = `
        <h2>Deleted Members</h2>
        <div class="deleted-members-list">
            <table class="deleted-members-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="deletedMembersTableBody"></tbody>
            </table>
        </div>
    `;

    fetchDeletedMembers();
}

async function fetchDeletedMembers(): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users?isDeleted=true`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const deletedMembers: User[] = await response.json();
            displayDeletedMembers(deletedMembers);
        } else {
            throw new Error('Failed to fetch deleted members');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch deleted members. Please try again.');
    }
}

function displayDeletedMembers(deletedMembers: User[]): void {
    const deletedMembersTableBody = document.getElementById('deletedMembersTableBody') as HTMLTableSectionElement;
    deletedMembersTableBody.innerHTML = '';

    deletedMembers.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.username}</td>
            <td>${member.role}</td>
            <td>
                <button class="activate-member-btn" data-id="${member.id}">Activate</button>
            </td>
        `;
        deletedMembersTableBody.appendChild(row);
    });

    const activateButtons = document.querySelectorAll('.activate-member-btn');
    activateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const memberId = (e.target as HTMLButtonElement).getAttribute('data-id');
            activateMember(parseInt(memberId!));
        });
    });
}

async function activateMember(memberId: number): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${memberId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isDeleted: false }),
        });

        if (response.ok) {
            alert('Member activated successfully');
            fetchDeletedMembers();
        } else {
            throw new Error('Failed to activate member');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to activate member. Please try again.');
    }
}