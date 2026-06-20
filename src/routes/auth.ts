import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/authController';
import requireAuth from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// protected test route
router.get('/protected', requireAuth, (req, res) => {
	res.json({ ok: true, user: (req as any).user });
});

export default router;
