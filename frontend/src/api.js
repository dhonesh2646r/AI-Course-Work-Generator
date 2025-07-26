import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const generateFlashCards = async (concept, file, no_of_questions, question_type) => {
    const formData = new FormData();
    
    if (concept) formData.append("concept", concept);
    if (file) formData.append("file", file);
    if (no_of_questions) formData.append("no_of_questions", no_of_questions);
    if (question_type) formData.append("question_type", question_type);

    try {
        const response = await axios.post(`${API_URL}generateFlash/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });
        return response.data.message;
    } catch (error) {
        console.error("Error generating study material:", error);
        throw error;
    }
};
