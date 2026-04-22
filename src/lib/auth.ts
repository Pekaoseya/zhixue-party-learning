import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// 全局用户状态管理
let globalUser: any = null;

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const callbackRef = useRef<(() => void) | undefined>();

  useEffect(() => {
    // 只在客户端执行，避免服务器端渲染时的 localStorage 错误
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        globalUser = parsedUser;
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current();
      callbackRef.current = undefined;
    }
  }, [user]);

  const login = (userData: any, callback?: () => void) => {
    localStorage.setItem('user', JSON.stringify(userData));
    // 同时存储userId到localStorage
    if (userData.UserId) {
      localStorage.setItem('userId', userData.UserId);
    }
    // 更新全局用户状态
    globalUser = userData;
    // 更新状态
    setUser(userData);
    // 触发登录成功事件，通知其他组件更新状态
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
    }
    // 强制刷新页面，确保导航栏立即显示用户信息
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    // 清空全局用户状态
    globalUser = null;
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
};