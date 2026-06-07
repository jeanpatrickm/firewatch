"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Substitua pela URL base correta da sua API Gateway
const API_BASE_URL = "https://3qigbzusxi.execute-api.sa-east-1.amazonaws.com"; 

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
    // Verifica se o usuário já estava logado e possui um token
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("firewatch_user") : null
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    } else {
      // Limpa os resquícios caso o token tenha sido apagado
      localStorage.removeItem("firewatch_user")
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Fazendo a chamada real para o ECS através do API Gateway
      // Nota: Verifique se o seu ECS espera "email" ou "username" no body
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // Mudamos a chave para "username" e passamos o valor da variável email
        body: JSON.stringify({ username: email, password }) 
      })

      if (response.ok) {
        // Tenta ler o token da resposta. Pode vir como JSON { token: "..." } ou Texto puro
        let token = "";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          token = data.token || data.jwt || data.access_token; // Ajuste para a chave que o seu ECS retorna
        } else {
          token = await response.text(); 
        }

        if (!token) throw new Error("Token não retornado pelo backend");

        const loggedUser: User = {
          id: "1", // Você pode pegar o ID e Nome de dentro da resposta ou do JWT decodificado
          name: email.split("@")[0],
          email,
          role: "admin",
        }
        
        setUser(loggedUser)
        // Salva os dados do usuário E O TOKEN REAL no localStorage
        localStorage.setItem("firewatch_user", JSON.stringify(loggedUser))
        localStorage.setItem("token", token)
        
        setIsLoading(false)
        return true
      } else {
        console.error("Falha no login. Status:", response.status);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API de login:", error);
    }
    
    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Construindo a Query String exigida pela lbd-cadastra-usuario
      const params = new URLSearchParams({
        username: name,
        email: email,
        password: password
      })

      const response = await fetch(`${API_BASE_URL}/cadastra-usuario?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      // O seu backend retorna status 201 quando o cadastro dá certo
      if (response.status === 201) {
        // Loga o usuário automaticamente após o sucesso no cadastro
        const loginSuccess = await login(email, password);
        return loginSuccess;
      } else {
        const errorData = await response.json();
        console.error("Falha no cadastro:", errorData);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API de cadastro:", error);
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    // Limpa ambos os dados
    localStorage.removeItem("firewatch_user")
    localStorage.removeItem("token")
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