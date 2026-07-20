import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// AuthContext stores the logged-in user in localStorage so the session
// survives page refreshes. Registration also writes to localStorage.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load any saved session on first render
  useEffect(() => {
    const saved = localStorage.getItem('flipkart_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Register a new user. Returns an error string on failure, null on success.
  function register({ fullName, email, password }) {
    const users = JSON.parse(localStorage.getItem('flipkart_users') || '[]');
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return 'An account with this email already exists.';
    }
    const newUser = { fullName, email, password };
    users.push(newUser);
    localStorage.setItem('flipkart_users', JSON.stringify(users));
    return null;
  }

  // Log in an existing user. Returns an error string on failure, null on success.
  function login({ email, password }) {
    const users = JSON.parse(localStorage.getItem('flipkart_users') || '[]');
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) return 'Invalid email or password.';
    const session = { fullName: found.fullName, email: found.email };
    localStorage.setItem('flipkart_user', JSON.stringify(session));
    setUser(session);
    return null;
  }

  function logout() {
    localStorage.removeItem('flipkart_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook so components don't import the context object directly.
export function useAuth() {
  return useContext(AuthContext);
}
