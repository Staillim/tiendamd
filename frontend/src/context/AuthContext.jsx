import { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
        if (firebaseUser) {
          firebaseUser.getIdToken().then((token) => {
            localStorage.setItem('marketplay_token', token);
          }).catch(() => {});
        } else {
          localStorage.removeItem('marketplay_token');
        }
      }, (error) => {
        console.error('Auth error:', error);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error('Firebase auth init error:', e);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    localStorage.setItem('marketplay_token', token);
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('marketplay_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
