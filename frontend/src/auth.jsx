import { createContext, useContext, useState } from "react";
import api from "./api";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const save = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };
  const login = async (identifier, password) =>
    save((await api.post("/auth/login", { identifier, password })).data);
  const register = async (form) =>
    save((await api.post("/auth/register", form)).data);
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  return (
    <Ctx.Provider value={{ user, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}
