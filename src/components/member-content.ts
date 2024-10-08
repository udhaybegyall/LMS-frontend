import { Book } from '../types';
import { API_URL } from '../config';

export function renderMemberContent(container: HTMLDivElement): void {
    container.innerHTML = `
        <div id="content" class="content">
            <h2>Welcome, Member</h2>
            <p>Select an option from the sidebar to get started.</p>
        </div>
    `;

    const sidebarNavItems = document.querySelectorAll('.nav-item');
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = (e.target as HTMLAnchorElement).getAttribute('data-page');
            switch (page) {
                case 'available-books':
                    renderAvailableBooks(container);
                    break;
                case 'borrowed-books':
                    // renderBorrowedBooks(container);
                    console.log("In work");
                    break;
                case 'history':
                    // renderBorrowHistory(container);
                    console.log("In work");
                    break;
            }
        });
    });
}

function renderAvailableBooks(container: HTMLDivElement): void {
    container.innerHTML = `
        <div class="content">
            <h2>Available Books</h2>
            <div id="bookList" class="book-list"></div>
        </div>
    `;

    fetchAvailableBooks();
}

async function fetchAvailableBooks(): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/books`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const books: Book[] = await response.json();
            displayAvailableBooks(books.filter(book => book.status === 'AVAILABLE'));
        } else {
            throw new Error('Failed to fetch books');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch books. Please try again.');
    }
}

function displayAvailableBooks(books: Book[]): void {
    const bookList = document.getElementById('bookList') as HTMLDivElement;
    bookList.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>ISBN: ${book.isbn}</p>
            <button class="borrow-book-btn" data-id="${book.id}">Borrow</button>
        `;
        bookList.appendChild(bookCard);
    });

    const borrowButtons = document.querySelectorAll('.borrow-book-btn');
    borrowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = (e.target as HTMLButtonElement).getAttribute('data-id');
            borrowBook(parseInt(bookId!));
        });
    });
}

async function borrowBook(bookId: number): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/books/${bookId}/borrow`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            alert('Book borrowed successfully');
            fetchAvailableBooks();
        } else {
            throw new Error('Failed to borrow book');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to borrow book. Please try again.');
    }
}

// function renderBorrowedBooks(container: HTMLDivElement): void {
//     // Implement borrowed books functionality
//     console.log('Borrowed books not implemented yet');
// }

// function renderBorrowHistory(container: HTMLDivElement): void {
//     // Implement borrow history functionality
//     console.log('Borrow history not implemented yet');
// }