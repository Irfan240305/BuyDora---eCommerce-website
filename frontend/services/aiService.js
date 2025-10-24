const API_BASE_URL = 'http://localhost:9000/api/ai';

export const generateProductDescription = async (productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-description`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating description:', error);
        throw error;
    }
};

export const analyzeReviewSentiment = async (reviewText) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze-sentiment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reviewText }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        throw error;
    }
};
