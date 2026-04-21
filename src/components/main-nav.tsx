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
  Layers3,
  Users,
  Star
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', name: '首页', href: '/', icon: Home },
  { id: 'library', name: '知识库', href: '/library', icon: Library },
  { id: 'ai-class', name: 'AI组班', href: '/training-candidates', icon: Users },
  { id: 'bookshelf', name: '书架', href: '/bookshelf', icon: Bookmark },
  { id: 'notes', name: '笔记', href: '/notes', icon: PenTool },
  { id: 'profile', name: '我的', href: '/profile', icon: User },
];

export function MainNav() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={cn(
      "w-full z-50 sticky top-0",
      isHomePage 
        ? "bg-gradient-to-b from-orange-100/90 via-orange-50/80 to-transparent backdrop-blur-md" 
        : "bg-gray-800 border-b border-gray-700"
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
              isHomePage ? "text-gray-800" : "text-white"
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
                      isHomePage 
                        ? cn("text-gray-700 hover:text-orange-600 hover:bg-orange-50", isActive && "bg-orange-100 text-orange-600")
                        : cn("text-gray-300 hover:text-white hover:bg-gray-700", isActive && "bg-gray-700 text-white")
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
              isHomePage ? "text-gray-400" : "text-gray-400"
            )} />
            <input 
              type="text"
              placeholder="搜索内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-4 py-2 w-48 lg:w-64 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent",
                isHomePage 
                  ? "bg-white border border-orange-200 text-gray-900 placeholder:text-gray-400"
                  : "bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400"
              )}
            />
          </div>
          <Button variant="ghost" size="icon" className={cn("relative", isHomePage ? "text-gray-700 hover:text-orange-600" : "text-gray-300 hover:text-white")}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Link href="/profile">
            <Avatar className="h-8 w-8 cursor-pointer border-2 border-orange-400">
              <AvatarFallback className="bg-orange-500 text-white font-medium">党员</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
