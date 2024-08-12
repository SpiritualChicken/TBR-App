import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const EditReview = () => {
    const { reviewId } = useParams();
    const [review, setReview] = useState(null);
    const [rating, setRating] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await fetch(`/reviews/${reviewId}`);
                if (response.ok) {
                    const data = await response.json();
                    setReview(data);
                    setRating(data.rating);
                    setReviewText(data.review_text);
                } else {
                    throw new Error('Failed to fetch review');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [reviewId]);

    const handleSave = async () => {
        try {
            const response = await fetch(`/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review_text: reviewText }),
            });
            if (response.ok) {
                history.push('/bookindex'); 
            } else {
                throw new Error('Failed to save review');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Edit Review for {review?.book_title}</h1>
            <div>
                <label>
                    Rating:
                    <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        max="5"
                        min="0"
                    />
                </label>
            </div>
            <div>
                <label>
                    Review:
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default EditReview;
