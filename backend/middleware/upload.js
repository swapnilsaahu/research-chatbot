import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});
