import { Router } from 'express';
import { login, logout, getCurrentAdmin } from '../controllers/admin/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.validator.js';
import { loginLimiter } from '../middleware/rateLimiters.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAdmin, getCurrentAdmin);

export default router;
