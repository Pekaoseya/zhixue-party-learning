'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  whitelist?: string[];
}

export const ProtectedRoute = ({ children, whitelist = ['/login', '/reset'] }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // 检查当前路径是否在白名单中
  const isWhitelisted = () => {
    if (!pathname) return false;
    
    return whitelist.some((path) => {
      // 支持通配符路径，如 /api/*
      if (path.endsWith('*')) {
        const basePath = path.slice(0, -1);
        return pathname.startsWith(basePath);
      }
      return pathname === path;
    });
  };

  // 立即检查并重定向（不等待 useEffect）
  if (typeof window !== 'undefined' && pathname && !loading && !user && !isWhitelisted()) {
    router.push('/login');
    return <div className="flex items-center justify-center h-screen">重定向中...</div>;
  }

  // 在路径未加载或白名单路径下，直接渲染子组件
  if (!pathname || isWhitelisted()) {
    return <>{children}</>;
  }

  // 加载状态下显示加载中
  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  // 未登录且不在白名单中，返回 null
  if (!user) {
    return null;
  }

  return <>{children}</>;
};