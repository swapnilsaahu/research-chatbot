import { getAnswer } from '../services/chatService.js';
import { getVectorStore } from '../services/vectorStore.js';

export const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const vectorStore = getVectorStore();
        if (!vectorStore) {
            return res.status(400).json({ error: 'No PDFs have been processed. Please upload PDFs first.' });
        }

        const answer = await getAnswer(question, vectorStore);
        res.json({ answer });
    } catch (error) {
        console.error('Error answering question:', error);
        res.status(500).json({ error: `Failed to answer question: ${error.message}` });
    }
};

export const getStatus = (req, res) => {
    const vectorStore = getVectorStore();
    res.json({
        vectorStoreReady: vectorStore !== null,
        message: vectorStore ? 'Ready to answer questions' : 'No PDFs processed yet'
    });
};
