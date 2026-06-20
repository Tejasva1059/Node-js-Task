import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'user exists' });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ email, password: hashed });
  await user.save();

  res.status(201).json({ ok: true, id: user._id });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'invalid credentials' });

  const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });

  // store refresh token with expiry
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  user.refreshTokens.push({ token: refreshToken, expiresAt, createdAt: new Date() } as any);
  await user.save();

  res.json({ accessToken, refreshToken, expiresIn: 60 });
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

  let payload: any;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    return res.status(401).json({ error: 'invalid refresh token' });
  }

  const userId = payload.sub as string;
  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ error: 'invalid token (user not found)' });

  // find token in user's stored tokens
  const stored = user.refreshTokens.find(rt => rt.token === refreshToken);
  if (!stored) return res.status(401).json({ error: 'refresh token not recognized' });

  if (new Date() > stored.expiresAt) {
    // remove expired token
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();
    return res.status(401).json({ error: 'refresh token expired' });
  }

  // rotate: remove old, add new
  user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
  const newRefreshToken = signRefreshToken({ sub: user._id.toString() });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  user.refreshTokens.push({ token: newRefreshToken, expiresAt, createdAt: new Date() } as any);
  await user.save();

  const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });

  res.json({ accessToken, refreshToken: newRefreshToken, expiresIn: 60 });
}

export async function logout(req: Request, res: Response) {
  // expects { refreshToken } in body and will remove it from the user's stored tokens
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

  try {
    const payload: any = verifyRefreshToken(refreshToken);
    const userId = payload.sub as string;
    const user = await User.findById(userId);
    if (!user) return res.status(200).json({ ok: true });

    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    // even if token invalid, respond OK to avoid token probing
    return res.json({ ok: true });
  }
}
