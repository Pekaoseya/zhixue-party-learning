'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  PenTool, 
  Share2, 
  Menu, 
  Sparkles,
  Home
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/library', label: '权威智库', icon: BookOpen },
  { href: '/create', label: '智能创作', icon: PenTool },
  { href: '/media', label: '新媒体赋能', icon: Share2 },
];

export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold text-xl sm:inline-block" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              红韵智创
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                    isActive
                      ? 'bg-red-50 text-red-700'
                      : 'text-muted-foreground hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all',
                          isActive
                            ? 'bg-red-50 text-red-700'
                            : 'text-muted-foreground hover:bg-gray-100'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
              登录
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600">
              立即体验
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
