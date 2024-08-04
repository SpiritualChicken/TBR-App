import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/books');
                if (response.ok) {
                    const data = await response.json();
                    setBooks(data);
                } else {
                    throw new Error('Failed to fetch books');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/current_user');
                if (response.ok) {
                    const data = await response.json();
                    setCurrentUser(data);
                } else {
                    history.push('/login'); // Redirect to login if no user is logged in
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBooks();
        fetchCurrentUser();
    }, [history]);

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, author })
            });
            if (response.ok) {
                const newBook = await response.json();
                setBooks([...books, newBook]);
                setTitle('');
                setAuthor('');
            } else {
                throw new Error('Failed to add book');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddToTBR = async (bookId) => {
        try {
            const response = await fetch(`/users/${currentUser.id}/tbr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_id: bookId })
            });
            if (response.ok) {
                alert('Book added to your TBR');
            } else {
                throw new Error('Failed to add book to TBR');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>All Books</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        {book.title} by {book.author}
                        {currentUser && (
                            <button onClick={() => handleAddToTBR(book.id)}>Add to TBR</button>
                        )}
                    </li>
                ))}
            </ul>
            <h2>Add a New Book</h2>
            <form onSubmit={handleAddBook}>
                <label>
                    Title:
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </label>
                <br />
                <label>
                    Author:
                    <input 
                        type="text" 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)} 
                        required 
                    />
                </label>
                <br />
                <button type="submit">Add Book</button>
            </form>
        </div>
    );
};

export default Home;
