'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Play, Library, Bookmark, PenTool, User, ChevronDown, ChevronUp } from 'lucide-react';
import { ReactNode, useState } from 'react';

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
  const [isExpanded, setIsExpanded] = useState(true);
  
  // 根据路径自动判断当前激活的tab
  const currentTab = navItems.find(item => pathname.startsWith(item.path))?.id || activeTab;

  return (
    <div className="flex flex-col h-screen">
      {/* 顶部横幅区域 - 可折叠 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white transition-all duration-300">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-pink-50" />
        
        {/* 内容层 */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
          {/* 展开/收起按钮 */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-4 top-4 z-20 p-1 text-gray-400 hover:text-orange-500 transition-colors"
            aria-label={isExpanded ? '收起' : '展开'}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          
          {/* 展开状态 - 显示完整内容 */}
          {isExpanded ? (
            <div className="w-full py-6">
              {/* 欢迎角色 */}
              <img 
                src="/welcome-character.png" 
                alt="欢迎" 
                className="h-20 w-auto object-contain mb-3 mx-auto"
              />
              
              {/* 欢迎文字 */}
              <h1 className="text-xl font-bold text-gray-800 mb-2">欢迎来到全省统一战线网络学院</h1>
              <p className="text-gray-600 text-sm mb-4">开启您的党建学习之旅</p>
              
              {/* 搜索框 */}
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="h-5 w-5 text-orange-500" />
                </div>
                <input 
                  type="text"
                  placeholder="需要我帮您查点什么..."
                  className="w-full pl-12 pr-24 py-3 rounded-full border-2 border-orange-400 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 shadow-lg transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-500 transition-all">
                  <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                </button>
              </div>
            </div>
          ) : (
            /* 收起状态 - 只显示一行 */
            <div className="w-full py-3 flex items-center justify-center gap-3">
              <img 
                src="/welcome-character.png" 
                alt="欢迎" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-sm font-medium text-gray-700">全省统一战线网络学院</span>
              <Search className="h-4 w-4 text-orange-500" />
            </div>
          )}
        </div>
      </div>
      
      {/* 主内容区域 */}
      <div className="flex flex-1 overflow-hidden pb-16">
        {children}
      </div>
      
      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-orange-500' 
                    : 'text-gray-400 hover:text-orange-400'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-2' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
