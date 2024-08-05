import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const BookIndex = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [tbr, setTBR] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseUser = await fetch('/current_user');
                if (responseUser.ok) {
                    const user = await responseUser.json();
                    setCurrentUser(user);

                    const [tbrResponse, reviewsResponse] = await Promise.all([
                        fetch(`/users/${user.id}/tbr`),
                        fetch(`/users/${user.id}/reviews`)
                    ]);

                    if (tbrResponse.ok && reviewsResponse.ok) {
                        const tbrData = await tbrResponse.json();
                        const reviewsData = await reviewsResponse.json();
                        setTBR(tbrData);
                        setReviews(reviewsData);
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                } else {
                    throw new Error('No user logged in');
                }
            } catch (err) {
                setError(err.message);
                history.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [history]);

    const handleDelete = async (tbrId) => {
        try {
            const response = await fetch(`/users/${currentUser.id}/tbr/${tbrId}`, { method: 'DELETE' });
            if (response.ok) {
                setTBR(tbr.filter(book => book.id !== tbrId));
            } else {
                throw new Error('Failed to delete book from TBR');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReview = (bookId) => {
        history.push(`/review/${bookId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Your Books</h1>
            <h2>To Be Read</h2>
            {tbr.length > 0 ? (
                <ul>
                    {tbr.map(book => (
                        <li key={book.id}>
                            Title: {book.book_title}
                            <button onClick={() => handleDelete(book.id)}>Delete</button>
                            <button onClick={() => handleReview(book.book_id)}>Review</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>TBR currently empty</p>
            )}
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
                <ul>
                    {reviews.map(review => (
                        <li key={review.id}>
                            <p>{review.book_title}</p>
                            <p>{review.rating} stars</p>
                            <p>{review.review_text}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No books reviewed</p>
            )}
        </div>
    );
};

export default BookIndex;