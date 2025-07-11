import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';

let vectorStore = null;
let embeddings = null;

const initializeEmbeddings = () => {
    if (!embeddings) {
        embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "models/embedding-001",
        });
    }
    return embeddings;
};

export const createVectorStore = async (textChunks) => {
    const embeddings = initializeEmbeddings();
    vectorStore = await FaissStore.fromTexts(textChunks, {}, embeddings);
    return vectorStore;
};

export const getVectorStore = () => {
    return vectorStore;
};
