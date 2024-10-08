export interface User {
    id: number;
    username: string;
    role: 'LIBRARIAN' | 'MEMBER';
    is_active: boolean;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    status: 'AVAILABLE' | 'BORROWED';
}

export interface BorrowHistory {
    id: number;
    book_id: number;
    borrowDate: string;
    returnDate: string | null;
}