import type { Metadata } from 'next';
import { Noto_Serif_SC } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { MainNav } from '@/components/main-nav';
import { ThemeWrapper } from '@/components/theme-wrapper';

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '红韵智创 - 党政内容创作者专属平台',
    template: '%s | 红韵智创',
  },
  description:
    '集权威学习、智能创作、新媒体赋能于一体的党政内容创作者专属平台，为党政机关、事业单位及国企的宣传人员提供从理论学习到内容产出、再到多平台分发的全流程解决方案。',
  keywords: [
    '红韵智创',
    '党政内容创作',
    '公文写作',
    'AI公文助手',
    '政务新媒体',
    '党建材料',
    '学习强国',
    '人民日报',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={notoSerifSC.variable}>
      <body className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 antialiased">
        <ThemeWrapper>
          <div className="relative flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-white/80 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  <div>
                    <h3 className="mb-4 font-bold text-lg text-red-700">红韵智创</h3>
                    <p className="text-sm text-muted-foreground">
                      党政内容创作者专属平台<br />
                      助力政务宣传高质量发展
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-4 font-semibold text-sm">权威智库</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/library/news" className="hover:text-red-600 transition-colors">权威资讯聚合</a></li>
                      <li><a href="/library/articles" className="hover:text-red-600 transition-colors">精品范文库</a></li>
                      <li><a href="/library/tools" className="hover:text-red-600 transition-colors">理论溯源工具</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4 font-semibold text-sm">智能创作</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/create/assistant" className="hover:text-red-600 transition-colors">AI公文助手</a></li>
                      <li><a href="/create/review" className="hover:text-red-600 transition-colors">智能校对润色</a></li>
                      <li><a href="/create/inspire" className="hover:text-red-600 transition-colors">灵感激发器</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4 font-semibold text-sm">新媒体赋能</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/media/layout" className="hover:text-red-600 transition-colors">政务排版工具</a></li>
                      <li><a href="/media/chart" className="hover:text-red-600 transition-colors">数据可视化</a></li>
                      <li><a href="/media/distribute" className="hover:text-red-600 transition-colors">多平台分发</a></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                  <p>红韵智创 {new Date().getFullYear()} - 党政内容创作者专属平台</p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeWrapper>
      </body>
    </html>
  );
}
