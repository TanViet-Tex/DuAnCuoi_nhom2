import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (fullName: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🟡 Lấy user từ localStorage khi load trang
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🟢 Xử lý đăng ký
  const register = (fullName: string, email: string, phone: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Email trùng
    if (users.some((u: User) => u.email === email)) return false;

    const newUser: User = { fullName, email, phone, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return true;
  };

  // 🟢 Xử lý đăng nhập
  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find(
      (u: User) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser)); // Lưu lại
      return true;
    }

    return false;
  };

  // 🔴 Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
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
