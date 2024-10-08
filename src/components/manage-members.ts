import { User, BorrowHistory } from '../types';
import { API_URL } from '../config';

export function renderManageMembers(container: HTMLDivElement): void {
    container.innerHTML = `
        <h2>Manage Members</h2>
        <div class="member-list">
            <table class="member-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="memberTableBody"></tbody>
            </table>
        </div>
        <div id="memberModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="memberModalBody"></div>
            </div>
        </div>
    `;

    fetchMembers();
}

async function fetchMembers(): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const members: User[] = await response.json();
            displayMembers(members);
        } else {
            throw new Error('Failed to fetch members');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch members. Please try again.');
    }
}

function displayMembers(members: User[]): void {
    const memberTableBody = document.getElementById('memberTableBody') as HTMLTableSectionElement;
    memberTableBody.innerHTML = '';

    members.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.username}</td>
            <td>${member.is_active ? 'Active' : 'Deleted'}</td>
            <td>
                <button class="view-details-btn" data-id="${member.id}">View Details</button>
                <button class="update-member-btn" data-id="${member.id}">Update</button>
                <button class="toggle-member-btn" data-id="${member.id}">${member.is_active ? 'Deactivate' : 'Activate'}</button>
            </td>
        `;
        memberTableBody.appendChild(row);
    });

    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const memberId = (e.target as HTMLButtonElement).getAttribute('data-id');
            showMemberDetails(parseInt(memberId!));
        });
    });

    const updateButtons = document.querySelectorAll('.update-member-btn');
    updateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const memberId = (e.target as HTMLButtonElement).getAttribute('data-id');
            showUpdateMemberModal(parseInt(memberId!));
        });
    });

    const toggleButtons = document.querySelectorAll('.toggle-member-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const memberId = (e.target as HTMLButtonElement).getAttribute('data-id');
            const isDeleted = (e.target as HTMLButtonElement).textContent === 'Activate';
            toggleMemberStatus(parseInt(memberId!), isDeleted);
        });
    });
}

async function showMemberDetails(memberId: number): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const [memberResponse, historyResponse] = await Promise.all([
            fetch(`${API_URL}/users/${memberId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            }),
            fetch(`${API_URL}/users/${memberId}/history`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
        ]);

        if (memberResponse.ok && historyResponse.ok) {
            const member: User = await memberResponse.json();
            const history: BorrowHistory[] = await historyResponse.json();
            displayMemberDetails(member, history);
        } else {
            throw new Error('Failed to fetch member details or history');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch member details. Please try again.');
    }
}

function displayMemberDetails(member: User, history: BorrowHistory[]): void {
    const modal = document.getElementById('memberModal') as HTMLDivElement;
    const modalBody = document.getElementById('memberModalBody') as HTMLDivElement;
    
    modalBody.innerHTML = `
        <h2>Member Details: ${member.username}</h2>
        <p><strong>Role:</strong> ${member.role}</p>
        <p><strong>Status:</strong> ${member.is_active ? 'Deleted' : 'Active'}</p>
        <h3>Borrow History</h3>
        <table class="borrow-history-table">
            <thead>
                <tr>
                    <th>Book Title</th>
                    <th>Borrow Date</th>
                    <th>Return Date</th>
                </tr>
            </thead>
            <tbody>
                ${history.map(entry => `
                    <tr>
                        <td>${entry.book_id}</td>
                        <td>${new Date(entry.borrowDate).toLocaleDateString()}</td>
                        <td>${entry.returnDate ? new Date(entry.returnDate).toLocaleDateString() : 'Not returned'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close') as HTMLSpanElement;
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function showUpdateMemberModal(memberId: number): void {
    const modal = document.getElementById('memberModal') as HTMLDivElement;
    const modalBody = document.getElementById('memberModalBody') as HTMLDivElement;
    modalBody.innerHTML = `
        <h2>Update Member</h2>
        <form id="updateMemberForm" class="member-form">
            <input type="text" id="updateUsername" placeholder="Username" required>
            <input type="email" id="updateEmail" placeholder="Email" required>
            <select id="updateRole" required>
                <option value="MEMBER">Member</option>
                <option value="LIBRARIAN">Librarian</option>
            </select>
            <button type="submit">Update Member</button>
        </form>
    `;

    fetchMemberDetails(memberId);

    const updateMemberForm = document.getElementById('updateMemberForm') as HTMLFormElement;
    updateMemberForm.addEventListener('submit', (e) => updateMember(e, memberId));

    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close') as HTMLSpanElement;
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

async function fetchMemberDetails(memberId: number): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${memberId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const member: User = await response.json();
            (document.getElementById('updateUsername') as HTMLInputElement).value = member.username;
            (document.getElementById('updateRole') as HTMLSelectElement).value = member.role;
        } else {
            throw new Error('Failed to fetch member details');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch member details. Please try again.');
    }
}

async function updateMember(e: Event, memberId: number): Promise<void> {
    e.preventDefault();
    const username = (document.getElementById('updateUsername') as HTMLInputElement).value;
    const email = (document.getElementById('updateEmail') as HTMLInputElement).value;
    const role = (document.getElementById('updateRole') as HTMLSelectElement).value;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${memberId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, role }),
        });

        if (response.ok) {
            alert('Member updated successfully');
            const modal = document.getElementById('memberModal') as HTMLDivElement;
            modal.style.display = 'none';
            fetchMembers();
        } else {
            throw new Error('Failed to update member');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update member. Please try again.');
    }
}

async function toggleMemberStatus(memberId: number, isDeleted: boolean): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/${memberId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isDeleted: !isDeleted }),
        });

        if (response.ok) {
            alert(`Member ${isDeleted ? 'activated' : 'deactivated'} successfully`);
            fetchMembers();
        } else {
            throw new Error(`Failed to ${isDeleted ? 'activate' : 'deactivate'} member`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to ${isDeleted ? 'activate' : 'deactivate'} member. Please try again.`);
    }
}

// ... keep other existing functions (showUpdateMemberModal, updateMember, toggleMemberStatus) ...