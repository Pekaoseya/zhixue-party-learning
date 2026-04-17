'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Library, Bookmark, PenTool, User } from 'lucide-react';
import { ReactNode } from 'react';

type NavTab = 'home' | 'library' | 'bookshelf' | 'notes' | 'profile';

interface NavBarProps {
  activeTab?: NavTab;
  children?: ReactNode;
}

const navItems = [
  { id: 'library' as NavTab, label: '知识库', icon: Library, path: '/library' },
  { id: 'bookshelf' as NavTab, label: '书架', icon: Bookmark, path: '/bookshelf' },
  { id: 'notes' as NavTab, label: '笔记', icon: PenTool, path: '/notes' },
  { id: 'profile' as NavTab, label: '我的', icon: User, path: '/profile' },
];

export function NavBar({ activeTab = 'home', children }: NavBarProps) {
  const pathname = usePathname();
  
  // 根据路径自动判断当前激活的tab
  const currentTab = navItems.find(item => pathname.startsWith(item.path))?.id || activeTab;

  return (
    <div className="flex flex-col h-screen">
      {/* 顶部横幅区域 - 欢迎信息 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-100 to-white">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-pink-50" />
        
        {/* 内容层 */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-6 flex flex-col items-center text-center">
          {/* 欢迎角色 */}
          <img 
            src="/welcome-character.png" 
            alt="欢迎" 
            className="h-20 w-auto object-contain mb-2"
          />
          
          {/* 欢迎文字 */}
          <h1 className="text-xl font-bold text-gray-800 mb-1">欢迎来到全省统一战线网络学院</h1>
          <p className="text-gray-600 text-sm">开启您的党建学习之旅</p>
        </div>
      </div>
      
      {/* 顶部导航标签 */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex justify-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'text-orange-500 font-medium bg-orange-50' 
                      : 'text-gray-500 hover:text-orange-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default NavBar;
