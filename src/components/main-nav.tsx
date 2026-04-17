'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Home,
  Search,
  Bell,
  User,
  Library,
  Bookmark,
  PenTool,
  Star,
  Play
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', name: '首页', href: '/', icon: Home },
  { id: 'library', name: '知识库', href: '/library', icon: Library },
  { id: 'bookshelf', name: '书架', href: '/bookshelf', icon: Bookmark },
  { id: 'notes', name: '笔记', href: '/notes', icon: PenTool },
  { id: 'profile', name: '我的', href: '/profile', icon: User },
];

export function MainNav({ hideWelcome = false }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 检测引导完成状态
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    setHasCompletedOnboarding(completed === 'true');
  }, []);

  // 首页未完成引导：隐藏导航栏
  if (isHomePage && hasCompletedOnboarding === false) {
    return null;
  }

  // 首页 + 已完成引导 + 不隐藏欢迎区：显示欢迎区
  const showWelcome = isHomePage && hasCompletedOnboarding === true && !hideWelcome;

  return (
    <header className={cn(
      "w-full z-50 sticky top-0",
      showWelcome
        ? "bg-gradient-to-b from-orange-100/90 via-orange-50/80 to-transparent backdrop-blur-md" 
        : "bg-gradient-to-r from-red-700 via-red-600 to-orange-500"
    )}>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/icon.png" 
              alt="全省统一战线网络学院" 
              className="h-10 w-auto object-contain"
            />
            <span className={cn(
              "font-bold text-lg hidden md:block",
              showWelcome ? "text-gray-800" : "text-white"
            )}>全省统一战线网络学院</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link key={item.id} href={item.href}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn(
                      "gap-2",
                      showWelcome 
                        ? cn("text-gray-700 hover:text-orange-600 hover:bg-orange-50", isActive && "bg-orange-100 text-orange-600")
                        : cn("text-white/90 hover:text-white hover:bg-white/10", isActive && "bg-white/20 text-white font-medium")
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
              showWelcome ? "text-gray-400" : "text-white/70"
            )} />
            <input 
              type="text"
              placeholder="搜索内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-4 py-2 w-48 lg:w-64 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent",
                showWelcome 
                  ? "bg-white border border-orange-200 text-gray-900 placeholder:text-gray-400"
                  : "bg-white/20 border border-white/30 text-white placeholder:text-white/60"
              )}
            />
          </div>
          <Button variant="ghost" size="icon" className={cn("relative", showWelcome ? "text-gray-700 hover:text-orange-600" : "text-white/90 hover:text-white hover:bg-white/10")}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
          </Button>
          <Link href="/profile">
            <Avatar className="h-8 w-8 cursor-pointer border-2 border-white/50">
              <AvatarFallback className={showWelcome ? "bg-orange-500 text-white" : "bg-white text-red-600"} font-medium>
                党员
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
      
      {/* 欢迎区 - 仅首页已完成引导时显示 */}
      {showWelcome && (
        <div className="relative max-w-4xl mx-auto px-6 pb-6 flex flex-col items-center text-center">
          <img 
            src="/welcome-character.png" 
            alt="欢迎" 
            className="h-20 w-auto object-contain mb-2"
          />
          <h1 className="text-xl font-bold text-gray-800">欢迎来到全省统一战线网络学院</h1>
          <p className="text-gray-600 text-sm mb-3">开启您的党建学习之旅</p>
          <div className="relative w-full max-w-xl flex items-center">
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
      )}
    </header>
  );
}
