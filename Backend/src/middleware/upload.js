import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 8;

const storage = multer.memoryStorage();

function imageFileFilter(req, file, cb) {
  if (!ALLOWED_IMAGE_MIME.has(file.mimetype)) {
    return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
  }
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
});

// Generic small-attachment uploader for enquiry brand assets (images + pdf).
const ALLOWED_BRIEF_MIME = new Set([...ALLOWED_IMAGE_MIME, 'application/pdf']);
export const uploadBriefFiles = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_BRIEF_MIME.has(file.mimetype)) {
      return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
    }
    cb(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
});
