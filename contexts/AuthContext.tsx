import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
import { setCookie, parseCookies, destroyCookie } from 'nookies'

type User = {
  email: string;
  permissions: string;
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data

        setUser({ email, permissions, roles })
      })
        .catch(() => {
          signOut()

        })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', { email, password })

      const { token, refreshToken, permissions, roles } = response.data

      //localstorage --fica disponivel em outras sessoes, no next fica no sserver e precisa adaptar
      //sessionStorage --nao fica disponivel em outras sessoes
      //cookies -- pode ser acessado dos dois lados

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      })
      setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
      })

      setUser({
        email,
        permissions,
        roles
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    } catch (err) {
      console.log(err)

    }
  }

  return <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>{children}</AuthContext.Provider>;
}
