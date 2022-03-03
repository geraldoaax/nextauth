import { createContext } from "react";

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }) {
  const isAuthenticated = false;

  function signIn({ email, password }: SignInCredentials) {
    console.log(email, password);
  }

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
