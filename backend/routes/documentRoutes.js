import express from 'express';
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument
} from '../controllers/documentController.js';

import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload document
//router.post('/upload', upload.single('file'), uploadDocument);
router.post(
    '/upload',
    (req, res, next) => {
        console.log("🔥 BEFORE MULTER");

        upload.single('file')(req, res, (err) => {
            if (err) {
                console.log("🔥 MULTER RAW ERROR");
                console.log(err);
                console.log("TYPE:", typeof err);
                console.log("JSON:", JSON.stringify(err));

                return res.status(500).json({
                    success: false,
                    multerError: String(err),
                    multerErrorObject: err
                });
            }

            console.log("🔥 AFTER MULTER");
            next();
        });
    },
    uploadDocument
);
// Get all documents
router.get('/', getDocuments);

// Get single document
router.get('/:id', getDocument);

// Delete document
router.delete('/:id', deleteDocument);

export default router;
