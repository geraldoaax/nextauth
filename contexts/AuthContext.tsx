import { createContext } from "react";

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials): Promise<void>;
};

const AuthContext = createContext({});
