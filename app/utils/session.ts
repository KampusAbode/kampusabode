// /utils/session.ts
export interface SessionData {
  isAuthenticated: boolean;
  uid: string;
  role: string;
  expiry: number;
}

const SESSION_TTL = 3 * 24 * 60 * 60 * 1000; // 3 days

export const createSession = (uid: string, role: string): SessionData => {
  return {
    isAuthenticated: true,
    uid,
    role,
    expiry: Date.now() + SESSION_TTL,
  };
};


export const getSession = () => {
  const cookieKey = process.env.USERDATA_COOKIE_KEY!;
  const cookie = cookies().get(cookieKey);

  if (!cookie) return null;

  try {
    const session = JSON.parse(cookie.value);
    if (Date.now() > session.expiry) {
      cookies().delete(cookieKey);
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

