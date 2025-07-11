import { processPDFs } from '../services/pdfService.js';

export const uploadPDFs = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No PDF files uploaded' });
        }

        const result = await processPDFs(req.files);
        res.json(result);
    } catch (error) {
        console.error('Error processing PDFs:', error);
        res.status(500).json({ error: `Failed to process PDFs: ${error.message}` });
    }
};
