import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const ReviewForm = () => {
    const { bookId } = useParams();
    const history = useHistory();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/current_user');
                const data = await response.json();
                
                if (response.ok) {
                    setCurrentUser(data);
                } else {
                    throw new Error(data.error || 'Failed to fetch current user');
                }
            } catch (err) {
                setError(`Error: ${err.message}`);
                history.push('/login');
            }
        };

        fetchCurrentUser();
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setError('No current user');
            return;
        }

        try {
            const response = await fetch(`/users/${currentUser.id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: bookId,
                    rating: rating,
                    review_text: reviewText,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                history.push('/BookIndex');
            } else {
                throw new Error(data.error || 'Failed to submit review');
            }
        } catch (err) {
            setError(`Error submitting review: ${err.message}`);
        }
    };

    if (error) return <p>{error}</p>;
    if (!currentUser) return <p>Loading...</p>;

    return (
        <div>
            <h1>Review Book</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Rating:
                    <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        min="1"
                        max="5"
                        required
                    />
                </label>
                <br />
                <label>
                    Review:
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewForm;