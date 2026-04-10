'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Menu, 
  Sparkles,
  Home
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// 新版导航主要是Logo占位，内容全屏展示
export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sr-only">
      {/* 首页全屏模式不需要可见导航 */}
      {/* 辅助无障碍链接 */}
      <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-red-500">
        <span className="sr-only">红韵智学 - 首页</span>
      </Link>
      <Link href="/library" className="focus:outline-none focus:ring-2 focus:ring-red-500">
        <span className="sr-only">知识库</span>
      </Link>
    </header>
  );
}
