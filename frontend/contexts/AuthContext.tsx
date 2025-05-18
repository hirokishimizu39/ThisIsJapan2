'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// ユーザー情報の型定義
export interface User {
  id: number;
  username: string;
  email: string;
  profile_image?: string;
  japanese_level?: string;
  english_level?: string;
}

// 認証コンテキストの型定義
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// 登録データの型定義
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  japanese_level?: string;
  english_level?: string;
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認証プロバイダーのProps型
interface AuthProviderProps {
  children: ReactNode;
}

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // ユーザーが認証されているかどうか
  const isAuthenticated = !!user;
  
  // 初期化時にユーザー情報を取得
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const userData = await fetchCurrentUser();
        
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // 現在のユーザー情報を取得
  const fetchCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };
  
  // ログイン処理
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      
      // デバッグ用
      console.log('AuthContext - 送信データ:', { email, password });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ログインに失敗しました');
      }
      
      // ログイン成功後にユーザー情報を取得
      const userData = await fetchCurrentUser();
      
      if (userData) {
        setUser(userData);
        router.push('/');
        router.refresh();
      } else {
        throw new Error('ユーザー情報の取得に失敗しました');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // ログアウト処理
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ユーザー登録処理
  const register = async (registerData: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '登録に失敗しました');
      }
      
      // 登録成功後、ログインページへリダイレクト
      router.push('/auth/login?registered=true');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // トークンリフレッシュ処理
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        setUser(null);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      return false;
    }
  };
  
  // ユーザー情報更新処理
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ユーザー情報の更新に失敗しました');
      }
      
      const updatedUserData = await response.json();
      setUser(updatedUserData);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        register,
        refreshToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 認証コンテキストを使用するためのフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// ユーザーがログインしている場合に子コンポーネントを表示するコンポーネント
export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : null;
};

export default AuthContext; 