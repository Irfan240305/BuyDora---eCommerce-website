// src/components/ReviewSentimentAnalyzer.jsx
import React, { useState } from 'react';

const ReviewSentimentAnalyzer = () => {
    const [reviewText, setReviewText] = useState('');
    const [sentiment, setSentiment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSentiment(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"}/api/ai/analyze-sentiment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewText }),
            });

            const result = await response.json();
            
            if (result.success) {
                setSentiment(result.sentiment);
            } else {
                setError(result.error || 'Failed to analyze sentiment');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Review Sentiment Analyzer</h2>
            
            <form onSubmit={handleAnalyze} style={styles.form}>
                <div style={styles.formGroup}>
                    <label>Customer Review:</label>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                        placeholder="Enter a customer review to analyze..."
                        rows="5"
                        style={styles.textarea}
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Analyzing...' : 'Analyze Sentiment'}
                </button>
            </form>

            {error && (
                <div style={styles.error}>
                    <p>{error}</p>
                </div>
            )}

            {sentiment && (
                <div style={styles.result}>
                    <h3>Sentiment Result:</h3>
                    <div style={{
                        ...styles.badge,
                        ...(sentiment[0].label === 'POSITIVE' ? styles.positive : styles.negative)
                    }}>
                        <strong>{sentiment[0].label}</strong>
                    </div>
                    <p style={{fontSize: '18px', marginTop: '10px'}}>
                        Confidence: {(sentiment[0].score * 100).toFixed(2)}%
                    </p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '40px auto',
        padding: '30px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '20px',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    button: {
        padding: '14px',
        background: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    },
    error: {
        marginTop: '20px',
        padding: '15px',
        background: '#FEE2E2',
        border: '1px solid #EF4444',
        borderRadius: '6px',
        color: '#DC2626',
    },
    result: {
        marginTop: '20px',
        padding: '20px',
        background: '#F0FDF4',
        borderRadius: '6px',
        textAlign: 'center',
    },
    badge: {
        display: 'inline-block',
        padding: '12px 30px',
        borderRadius: '25px',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    positive: {
        background: '#D1FAE5',
        color: '#065F46',
    },
    negative: {
        background: '#FEE2E2',
        color: '#991B1B',
    },
};

export default ReviewSentimentAnalyzer;
