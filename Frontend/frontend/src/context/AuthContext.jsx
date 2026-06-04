import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '../services/api';

const AuthContext = createContext(null);
const USERS_KEY = 'foodOrderingUsers';
const SESSION_KEY = 'foodOrderingSession';
const TOKEN_KEY = 'foodOrderingToken';

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createToken() {
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(readStorage(SESSION_KEY, null));
  }, []);

  const register = async ({ name, email, password }) => {
    const users = readStorage(USERS_KEY, []);
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(existingUser => existingUser.email === cleanEmail)) {
      throw new Error('An account already exists for this email.');
    }

    try {
      const remoteSession = await registerUser({ name, email: cleanEmail, password });
      const sessionUser = {
        ...remoteSession.user,
        token: remoteSession.token,
        isGuest: false,
      };

      writeStorage(SESSION_KEY, sessionUser);
      localStorage.setItem(TOKEN_KEY, sessionUser.token);
      setUser(sessionUser);
      return sessionUser;
    } catch (error) {
      if (!String(error.message || '').includes('Failed to fetch')) {
        throw error;
      }
      console.warn('⚠️ Connection to backend failed during register. Falling back to offline localStorage mode:', error.message);
    }

    const nextUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      isGuest: false,
      token: createToken(),
    };

    writeStorage(USERS_KEY, [...users, nextUser]);
    writeStorage(SESSION_KEY, nextUser);
    localStorage.setItem(TOKEN_KEY, nextUser.token);
    setUser(nextUser);
    return nextUser;
  };

  const login = async ({ identifier, password }) => {
    try {
      const remoteSession = await loginUser({ identifier, password });
      const sessionUser = {
        ...remoteSession.user,
        token: remoteSession.token,
        isGuest: false,
      };

      writeStorage(SESSION_KEY, sessionUser);
      localStorage.setItem(TOKEN_KEY, sessionUser.token);
      setUser(sessionUser);
      return sessionUser;
    } catch (error) {
      if (!String(error.message || '').includes('Failed to fetch')) {
        throw error;
      }
      console.warn('⚠️ Connection to backend failed during login. Falling back to offline localStorage mode:', error.message);
    }

    const users = readStorage(USERS_KEY, []);
    const cleanIdentifier = identifier.trim().toLowerCase();
    const matchedUser = users.find(
      existingUser =>
        existingUser.email === cleanIdentifier ||
        existingUser.name.toLowerCase() === cleanIdentifier
    );

    if (!matchedUser || matchedUser.password !== password) {
      throw new Error('Invalid email/username or password.');
    }

    const sessionUser = { ...matchedUser, token: createToken() };
    writeStorage(
      USERS_KEY,
      users.map(existingUser =>
        existingUser.id === matchedUser.id ? sessionUser : existingUser
      )
    );
    writeStorage(SESSION_KEY, sessionUser);
    localStorage.setItem(TOKEN_KEY, sessionUser.token);
    setUser(sessionUser);
    return sessionUser;
  };

  const continueAsGuest = () => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: 'User',
      email: '',
      isGuest: true,
      token: null,
    };

    writeStorage(SESSION_KEY, guestUser);
    localStorage.removeItem(TOKEN_KEY);
    setUser(guestUser);
  };

  const logout = () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      logoutUser(token).catch(() => {});
    }

    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      username: user?.name || 'User',
      isAuthenticated: Boolean(user && !user.isGuest),
      register,
      login,
      continueAsGuest,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
