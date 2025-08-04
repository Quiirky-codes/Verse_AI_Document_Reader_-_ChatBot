const API_BASE_URL = 'http://127.0.0.1:5001';

// A helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
    });
    return handleResponse(response);
};

export const performAction = async (action) => {
    const endpointMap = {
        summarize: 'summary',
        sections: 'section_summary',
        faqs: 'generate_faqs',
        extract: 'extract',
    };
    const response = await fetch(`${API_BASE_URL}/${endpointMap[action]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await handleResponse(response);

    // Normalize response shape
    if (action === 'summarize') return data.summary;
    if (action === 'sections') return data.sections.join('\n\n');
    if (action === 'faqs') return data.faqs;
    if (action === 'extract') return data.extraction;
    return "Action completed successfully.";
};


export const askQuestion = async (query) => {
    const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    });
    const data = await handleResponse(response);
    return data.answer;
};