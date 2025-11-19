import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export interface TokenPayload {
  id: string;
  email?: string;
}

export function generateToken(userId: string, email?: string, name?:string): string {
  const payload: TokenPayload = { id: userId };
  if (email) payload.email = email;
  if (name) (payload as any).name = name;
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
}

export function generateVerificationToken(userId: string): string {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '24h',
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}
