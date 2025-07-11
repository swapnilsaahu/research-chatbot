import multer from 'multer';

export const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);

    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large (max 10MB)' });
        }
        return res.status(400).json({ error: 'File upload error' });
    }

    if (error.message === 'Only PDF files are allowed') {
        return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    res.status(500).json({ error: 'Internal server error' });
};
