// src/components/ProductDescriptionGenerator.jsx
import React, { useState } from 'react';

const ProductDescriptionGenerator = () => {
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        features: ''
    });
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setDescription('');

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"}/api/ai/generate-description`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            
            if (result.success) {
                setDescription(result.description);
            } else {
                setError(result.error || 'Failed to generate description');
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
            <h2>AI Product Description Generator</h2>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Wireless Headphones"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Electronics"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label>Features:</label>
                    <textarea
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Noise-cancelling, Bluetooth 5.0, 30-hour battery"
                        rows="4"
                        style={styles.textarea}
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Generating...' : 'Generate Description'}
                </button>
            </form>

            {error && (
                <div style={styles.error}>
                    <p>{error}</p>
                </div>
            )}

            {description && (
                <div style={styles.result}>
                    <h3>Generated Description:</h3>
                    <p>{description}</p>
                    <button 
                        onClick={() => navigator.clipboard.writeText(description)}
                        style={styles.copyButton}
                    >
                        Copy to Clipboard
                    </button>
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
    input: {
        width: '100%',
        padding: '12px',
        border: '2px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
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
    copyButton: {
        marginTop: '10px',
        padding: '10px 20px',
        background: '#10B981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
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
        border: '1px solid #10B981',
    },
};

export default ProductDescriptionGenerator;
