import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const _filename = fileURLToPath(import.meta.url); // extracting path of this file in url form, then changing it into system path form.
const _dirname = path.dirname(_filename); // path of the folder containing this file.

const uploadDir = path.join(_dirname, '../uploads/documents'); // deciding and storing it s path, where pdf files will be uploaded..


// if there is directory such as in uploadDir.
if (!fs.existsSync(uploadDir)) {
fs.mkdirSync(uploadDir, { recursive: true }); //making the upload directory to store uploaded pdf file.
}

// Configure storage
// multer get to know where to store : disc.
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, uploadDir);
},
filename: (req, file, cb) => {
const uniqueSuffix = Date. now() + '-' + Math.round (Math. random() * 1E9);
cb(null, `${uniqueSuffix}-${file.originalname}`);
}
});



// File filter - only PDFs
const fileFilter = (req, file, cb) => {
if (file.mimetype === 'application/pdf') {
cb(null, true);
} else {
cb(new Error('Only PDF files are allowed!'), false);
}
};

// Configure multer
const upload = multer({
storage: storage,
fileFilter: fileFilter,
limits:{
fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
}
});

export default upload;