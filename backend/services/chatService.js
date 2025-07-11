import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { loadQAStuffChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';

const createPrompt = () => {
    const template = `
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer

    Context:
    {context}

    Question: {question}

    Answer:
  `;

    return PromptTemplate.fromTemplate(template);
};

const createChain = () => {
    const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: "gemini-pro",
        temperature: 0.3,
    });

    const prompt = createPrompt();
    return loadQAStuffChain(model, { prompt });
};

export const getAnswer = async (question, vectorStore) => {
    const relevantDocs = await vectorStore.similaritySearch(question, 4);

    if (relevantDocs.length === 0) {
        return 'No relevant information found in the uploaded documents.';
    }

    const chain = createChain();
    const response = await chain.call({
        input_documents: relevantDocs,
        question: question,
    });

    return response.text || response.output_text;
};
