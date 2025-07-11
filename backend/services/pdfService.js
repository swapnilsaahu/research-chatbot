import pdf from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createVectorStore } from './vectorStore.js';

export const processPDFs = async (files) => {
    let allText = '';

    // Extract text from all PDFs
    for (const file of files) {
        const pdfText = await pdf(file.buffer);
        allText += pdfText.text + '\n';
    }

    if (!allText.trim()) {
        throw new Error('No text could be extracted from the PDFs');
    }

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 10000,
        chunkOverlap: 1000,
    });

    const textChunks = await splitter.splitText(allText);

    // Create vector store
    await createVectorStore(textChunks);

    return {
        message: 'PDFs processed successfully',
        chunksCount: textChunks.length,
        textLength: allText.length
    };
};
