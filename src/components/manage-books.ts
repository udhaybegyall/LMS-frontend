import { Book } from '../types';
import { API_URL } from '../config';

export function renderManageBooks(container: HTMLDivElement): void {
    container.innerHTML = `
        <h2>Manage Books</h2>
        <button id="addBookBtn" class="action-btn">Add New Book</button>
        <div class="book-list">
            <table class="book-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="bookTableBody"></tbody>
            </table>
        </div>
        <div id="bookModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="bookModalBody"></div>
            </div>
        </div>
    `;

    const addBookBtn = document.getElementById('addBookBtn') as HTMLButtonElement;
    addBookBtn.addEventListener('click', showAddBookModal);

    fetchBooks();
}

async function fetchBooks(): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/books`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const books: Book[] = await response.json();
            displayBooks(books);
        } else {
            throw new Error('Failed to fetch books');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch books. Please try again.');
    }
}

function displayBooks(books: Book[]): void {
    const bookTableBody = document.getElementById('bookTableBody') as HTMLTableSectionElement;
    bookTableBody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.status}</td>
            <td>
                <button class="update-book-btn" data-id="${book.id}">Update</button>
                <button class="remove-book-btn" data-id="${book.id}">Remove</button>
            </td>
        `;
        bookTableBody.appendChild(row);
    });

    const updateButtons = document.querySelectorAll('.update-book-btn');
    updateButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = (e.target as HTMLButtonElement).getAttribute('data-id');
            showUpdateBookModal(parseInt(bookId!));
        });
    });

    const removeButtons = document.querySelectorAll('.remove-book-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = (e.target as HTMLButtonElement).getAttribute('data-id');
            removeBook(parseInt(bookId!));
        });
    });
}

function showAddBookModal(): void {
    const modal = document.getElementById('bookModal') as HTMLDivElement;
    const modalBody = document.getElementById('bookModalBody') as HTMLDivElement;
    modalBody.innerHTML = `
        <h2>Add New Book</h2>
        <form id="addBookForm" class="book-form">
            <input type="text" id="title" placeholder="Title" required>
            <input type="text" id="author" placeholder="Author" required>
            <input type="text" id="isbn" placeholder="ISBN" required>
            <button type="submit">Add Book</button>
        </form>
    `;

    const addBookForm = document.getElementById('addBookForm') as HTMLFormElement;
    addBookForm.addEventListener('submit', addBook);

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

async function addBook(e: Event): Promise<void> {
    e.preventDefault();
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const author = (document.getElementById('author') as HTMLInputElement).value;
    const isbn = (document.getElementById('isbn') as HTMLInputElement).value;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, isbn }),
        });

        if (response.ok) {
            const newBook: Book = await response.json();
            alert('Book added successfully');
            const modal = document.getElementById('bookModal') as HTMLDivElement;
            modal.style.display = 'none';
            addBookToTable(newBook);
        } else {
            throw new Error('Failed to add book');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add book. Please try again.');
    }
}

function addBookToTable(book: Book): void {
    const bookTableBody = document.getElementById('bookTableBody') as HTMLTableSectionElement;
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.status}</td>
        <td>
            <button class="update-book-btn" data-id="${book.id}">Update</button>
            <button class="remove-book-btn" data-id="${book.id}">Remove</button>
        </td>
    `;
    bookTableBody.appendChild(row);

    const updateButton = row.querySelector('.update-book-btn') as HTMLButtonElement;
    updateButton.addEventListener('click', () => showUpdateBookModal(book.id));

    const removeButton = row.querySelector('.remove-book-btn') as HTMLButtonElement;
    removeButton.addEventListener('click', () => removeBook(book.id));
}

function showUpdateBookModal(bookId: number): void {
    const modal = document.getElementById('bookModal') as HTMLDivElement;
    const modalBody = document.getElementById('bookModalBody') as HTMLDivElement;
    modalBody.innerHTML = `
        <h2>Update Book</h2>
        <form id="updateBookForm" class="book-form">
            <input type="text" id="updateTitle" placeholder="Title" required>
            <input type="text" id="updateAuthor" placeholder="Author" required>
            <input type="text" id="updateIsbn" placeholder="ISBN" required>
            <button type="submit">Update Book</button>
        </form>
    `;

    fetchBookDetails(bookId);

    const updateBookForm = document.getElementById('updateBookForm') as HTMLFormElement;
    updateBookForm.addEventListener('submit', (e) => updateBook(e, bookId));

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

async function fetchBookDetails(bookId: number): Promise<void> {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const book: Book = await response.json();
            (document.getElementById('updateTitle') as HTMLInputElement).value = book.title;
            (document.getElementById('updateAuthor') as HTMLInputElement).value = book.author;
            (document.getElementById('updateIsbn') as HTMLInputElement).value = book.isbn;
        } else {
            throw new Error('Failed to fetch book details');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch book details. Please try again.');
    }
}

async function updateBook(e: Event, bookId: number): Promise<void> {
    e.preventDefault();
    const title = (document.getElementById('updateTitle') as HTMLInputElement).value;
    const author = (document.getElementById('updateAuthor') as HTMLInputElement).value;
    const isbn = (document.getElementById('updateIsbn') as HTMLInputElement).value;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, isbn }),
        });

        if (response.ok) {
            const updatedBook: Book = await response.json();
            alert('Book updated successfully');
            const modal = document.getElementById('bookModal') as HTMLDivElement;
            modal.style.display = 'none';
            updateBookInTable(updatedBook);
        } else {
            throw new Error('Failed to update book');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update book. Please try again.');
    }
}

function updateBookInTable(book: Book): void {
    const bookRow = document.querySelector(`button[data-id="${book.id}"]`)?.closest('tr') as HTMLTableRowElement;
    if (bookRow) {
        bookRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.status}</td>
            <td>
                <button class="update-book-btn" data-id="${book.id}">Update</button>
                <button class="remove-book-btn" data-id="${book.id}">Remove</button>
            </td>
        `;

        const updateButton = bookRow.querySelector('.update-book-btn') as HTMLButtonElement;
        updateButton.addEventListener('click', () => showUpdateBookModal(book.id));

        const removeButton = bookRow.querySelector('.remove-book-btn') as HTMLButtonElement;
        removeButton.addEventListener('click', () => removeBook(book.id));
    }
}

async function removeBook(bookId: number): Promise<void> {
    if (confirm('Are you sure you want to remove this book?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Book removed successfully');
                removeBookFromTable(bookId);
            } else {
                throw new Error('Failed to remove book');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to remove book. Please try again.');
        }
    }
}

function removeBookFromTable(bookId: number): void {
    const bookRow = document.querySelector(`button[data-id="${bookId}"]`)?.closest('tr') as HTMLTableRowElement;
    if (bookRow) {
        bookRow.remove();
    }
}