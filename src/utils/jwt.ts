import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES_IN = '1m';
const REFRESH_EXPIRES_IN = '7d';

export function signAccessToken(payload: object) {
  const secret = process.env.JWT_ACCESS_SECRET || 'access_secret';
  return jwt.sign(payload, secret, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: object) {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
  return jwt.sign(payload, secret, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyRefreshToken(token: string) {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
  return jwt.verify(token, secret) as any;
}

export function verifyAccessToken(token: string) {
  const secret = process.env.JWT_ACCESS_SECRET || 'access_secret';
  return jwt.verify(token, secret) as any;
}
