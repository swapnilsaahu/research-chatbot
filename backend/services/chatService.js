import { GoogleGenerativeAI } from '@google/generative-ai';

const createPrompt = (context, question) => {
    return `
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer
    
    Context:
    ${context}
    
    Question: ${question}
    
    Answer:
    `;
};

export const getAnswer = async (question, vectorStore) => {
    try {
        console.log('Getting answer for question:', question);

        const relevantDocs = await vectorStore.similaritySearch(question, 4);
        console.log('Found relevant docs:', relevantDocs.length);

        if (relevantDocs.length === 0) {
            return 'No relevant information found in the uploaded documents.';
        }

        // Check if API key exists
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY is not set in environment variables');
        }

        // Create context from relevant documents
        const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');

        // Initialize Google AI
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Create prompt
        const prompt = createPrompt(context, question);

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Response received:', text);

        return text || 'No response generated';
    } catch (error) {
        console.error('Error in getAnswer:', error);
        throw error;
    }
};
