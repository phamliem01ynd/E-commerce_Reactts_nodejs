import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface AuthUserState{
  id: number | null,
  name: string | null,
  email: string | null,
  phone: string | null,
}

interface AuthState{
  isAuthenticated: boolean,
  user: AuthUserState,
}

interface AuthContentType{
  auth: AuthState,
  setAuth: Dispatch<SetStateAction<AuthState>>
}

interface AuthWrapperProps{
  children: ReactNode
}
const defaultAuth: AuthContentType = {
  auth: {
    isAuthenticated: false,
    user: { id: null, name: null, email: null, phone: null }
  },
  setAuth: () => {} 
};

export const AuthService = createContext<AuthContentType>(defaultAuth);

export const AuthWrapper =  ({ children } : AuthWrapperProps) => {
  const [ auth, setAuth ] = useState<AuthState>({
    isAuthenticated: false,
    user:{
      id: null,
      name: null,
      email:null,
      phone:null,
    }
  })


  return <AuthService.Provider value = {{ auth, setAuth}}>
    { children }
  </AuthService.Provider>
}

