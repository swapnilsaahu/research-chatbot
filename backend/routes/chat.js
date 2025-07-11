import express from 'express';
import { askQuestion, getStatus } from '../controllers/chatController.js';

const router = express.Router();

router.post('/ask', askQuestion);
router.get('/status', getStatus);

export default router;
