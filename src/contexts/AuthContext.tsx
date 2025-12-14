import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  id?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🟡 Lấy user từ localStorage khi load trang
  useEffect(() => {
    // Ensure app starts signed-out: clear any session auth on load
    try {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('loggedInUser');
    } catch (e) {}

    // Seed localStorage users so login works when mock API isn't running
    const existing = localStorage.getItem('users');
    if (!existing) {
      const seed = [
        { id: 'u_admin', fullName: 'Administrator', email: 'admin@gmail.com', phone: '', password: '123456', role: 'admin' },
        { id: 'u_tanviet', fullName: 'Tan Viet', email: 'tanviet3105@gmail.com', phone: '', password: 'Tythemen@123', role: 'user' }
      ];
      localStorage.setItem('users', JSON.stringify(seed));
    }
  }, []);

  // 🟢 Xử lý đăng ký -> try API, fallback to localStorage
  const register = async (fullName: string, email: string, phone: string, password: string): Promise<boolean> => {
    const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setUser(data.user);
      try { sessionStorage.setItem('loggedInUser', JSON.stringify(data.user)); } catch (e) {}
      if (data.token) try { sessionStorage.setItem('authToken', data.token); } catch (e) {}

      // Persist profile data keyed by email so frontend-only profile can be shown
      try {
        const profilesRaw = localStorage.getItem('user_profiles') || '{}';
        const profiles = JSON.parse(profilesRaw || '{}');
        profiles[email] = { fullName, email, phone, avatar: '' };
        localStorage.setItem('user_profiles', JSON.stringify(profiles));
      } catch (e) {}
      return true;
    } catch (e) {
      // fallback to localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u: User) => u.email === email)) return false;
      const newUser: User = { fullName, email, phone, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      setUser(newUser);
      try { sessionStorage.setItem('loggedInUser', JSON.stringify(newUser)); } catch (e) {}

      // Persist profile locally for frontend-only profile display
      try {
        const profilesRaw = localStorage.getItem('user_profiles') || '{}';
        const profiles = JSON.parse(profilesRaw || '{}');
        profiles[email] = { fullName, email, phone, avatar: '' };
        localStorage.setItem('user_profiles', JSON.stringify(profiles));
      } catch (err) {}
      return true;
    }
  };

  // 🟢 Xử lý đăng nhập -> try API, fallback to localStorage
  const login = async (email: string, password: string): Promise<boolean> => {
    const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        // Check for admin fallback
        if (email === 'admin@gmail.com' && password === '123456') {
          const adminUser: User = { fullName: 'Administrator', email, phone: '', password };
          setUser(adminUser);
          try { sessionStorage.setItem('loggedInUser', JSON.stringify(adminUser)); } catch (e) {}
          return true;
        }
        return false;
      }
      const data = await res.json();
      setUser(data.user);
      try { sessionStorage.setItem('loggedInUser', JSON.stringify(data.user)); } catch (e) {}
      if (data.token) try { sessionStorage.setItem('authToken', data.token); } catch (e) {}

      // On login, if we have a stored profile for this email, keep it in localStorage.user_profiles (no-op otherwise)
      try {
        const profilesRaw = localStorage.getItem('user_profiles') || '{}';
        const profiles = JSON.parse(profilesRaw || '{}');
        if (!profiles[email]) {
          // If API returned no profile, create a minimal record
          profiles[email] = { fullName: data.user.fullName || '', email, phone: (data.user as any).phone || '', avatar: '' };
          localStorage.setItem('user_profiles', JSON.stringify(profiles));
        }
      } catch (e) {}
      return true;
    } catch (e) {
      // fallback to previous localStorage logic
      if (email === 'admin@gmail.com' && password === '123456') {
        const adminUser: User = { fullName: 'Administrator', email, phone: '', password };
        setUser(adminUser);
        try { sessionStorage.setItem('loggedInUser', JSON.stringify(adminUser)); } catch (e) {}
        return true;
      }
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: User) => u.email === email && u.password === password);
      if (foundUser) {
        setUser(foundUser);
        try { sessionStorage.setItem('loggedInUser', JSON.stringify(foundUser)); } catch (e) {}
        // Ensure local profile exists for fallback login
        try {
          const profilesRaw = localStorage.getItem('user_profiles') || '{}';
          const profiles = JSON.parse(profilesRaw || '{}');
          if (!profiles[email]) {
            profiles[email] = { fullName: foundUser.fullName || '', email, phone: foundUser.phone || '', avatar: '' };
            localStorage.setItem('user_profiles', JSON.stringify(profiles));
          }
        } catch (e) {}
        return true;
      }
      return false;
    }
  };

  // 🔴 Đăng xuất
  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem('loggedInUser');
      sessionStorage.removeItem('authToken');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
