import express from 'express';
import { uploadPDFs } from '../controllers/pdfController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', upload.array('pdfs'), uploadPDFs);

export default router;
