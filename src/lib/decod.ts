import {jwtDecode} from 'jwt-decode';


type MyTokenPayload = {
  id: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
};

export function getUserFromToken() {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    localStorage.setItem('userId', decoded.id);
    localStorage.setItem('userEmail', decoded.email);
    localStorage.setItem('userName', decoded.name || '');
    console.log('Decoded token:', decoded);
    console.log(decoded)
    return decoded;
  } catch (err) {
    console.error('Invalid token', err);
    return null;
  }
}