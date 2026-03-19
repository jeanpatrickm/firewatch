"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "operator" | "viewer"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular verificação de sessão
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("firewatch_user") : null
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    // Simulação de login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: "1",
        name: email.split("@")[0],
        email,
        role: "admin",
      }
      setUser(mockUser)
      localStorage.setItem("firewatch_user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (name && email && password.length >= 6) {
      const mockUser: User = {
        id: "1",
        name,
        email,
        role: "operator",
      }
      setUser(mockUser)
      localStorage.setItem("firewatch_user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("firewatch_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
