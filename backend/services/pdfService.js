import { PDFExtract } from 'pdf.js-extract';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createVectorStore } from './vectorStore.js';

// Simple PDF text extraction using pdf.js-extract
const extractTextFromPDF = async (buffer) => {
    try {
        const pdfExtract = new PDFExtract();
        const options = {}; // No options needed for basic extraction

        // Convert buffer to temporary file path or use buffer directly
        const data = await new Promise((resolve, reject) => {
            pdfExtract.extractBuffer(buffer, options, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        // Extract text from all pages
        let fullText = '';
        data.pages.forEach(page => {
            page.content.forEach(item => {
                if (item.str) {
                    fullText += item.str + ' ';
                }
            });
            fullText += '\n';
        });

        return fullText.trim();
    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF');
    }
};

export const processPDFs = async (files) => {
    let allText = '';

    try {
        // Extract text from all PDFs
        for (const file of files) {
            console.log(`Processing ${file.originalname}...`);

            const pdfText = await extractTextFromPDF(file.buffer);
            if (pdfText && pdfText.trim()) {
                allText += pdfText + '\n\n';
                console.log(`Extracted ${pdfText.length} characters from ${file.originalname}`);
            } else {
                console.warn(`No text extracted from ${file.originalname}`);
            }
        }

        if (!allText.trim()) {
            throw new Error('No text could be extracted from the PDFs');
        }

        console.log(`Total text length: ${allText.length} characters`);

        // Split text into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 10000,
            chunkOverlap: 1000,
        });

        const textChunks = await splitter.splitText(allText);
        console.log(`Created ${textChunks.length} text chunks`);

        // Create vector store
        await createVectorStore(textChunks);

        return {
            success: true,
            message: 'PDFs processed successfully',
            chunksCount: textChunks.length,
            textLength: allText.length
        };

    } catch (error) {
        console.error('Error processing PDFs:', error);
        throw error;
    }
};
