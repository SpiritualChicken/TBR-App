import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const BookIndex = () => {
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
                    const currentUser = await responseUser.json();

                    const [tbrResponse, reviewsResponse] = await Promise.all([
                        fetch(`/users/${currentUser.id}/tbr`),
                        fetch(`/users/${currentUser.id}/reviews`)
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
                    history.push('/login'); // Redirect to login if no user is logged in
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [history]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Your Books</h1>
            <h2>To Be Read</h2>
            {tbr.length > 0 ? (
                <ul>
                    {tbr.map(book => (
                        <li key={book.id}>{book.title}</li>
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
