import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/authService';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('eh_token'),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('eh_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('eh_user');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persist(t: string, u: User) {
    localStorage.setItem('eh_token', t);
    localStorage.setItem('eh_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }

  async function login(payload: LoginPayload) {
    setLoading(true);
    try {
      const res = await authService.login(payload);
      persist(res.token, res.user);
    } finally {
      setLoading(false);
    }
  }

  async function register(payload: RegisterPayload) {
    setLoading(true);
    try {
      const res = await authService.register(payload);
      persist(res.token, res.user);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await authService.logout();
    localStorage.removeItem('eh_token');
    localStorage.removeItem('eh_user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
