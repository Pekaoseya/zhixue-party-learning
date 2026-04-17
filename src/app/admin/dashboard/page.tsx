'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  LogOut, 
  ChevronRight,
  Loader2,
  UserCircle,
  Settings,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';

interface AdminUser {
  id: string;
  username: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  last_login: string | null;
  created_at: string;
}

interface DiagnosticRecord {
  id: string;
  user_id: string;
  roles: string[];
  topics: string[];
  difficulty: string;
  completed: boolean;
  created_at: string;
  username?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const storedUser = localStorage.getItem('admin_user');
    if (!storedUser) {
      router.push('/admin');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      router.push('/admin');
      return;
    }

    // 加载数据
    loadData();
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 并行加载用户和诊断数据
      const [usersRes, diagnosticsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/diagnostics'),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (diagnosticsRes.ok) {
        const diagnosticsData = await diagnosticsRes.json();
        setDiagnostics(diagnosticsData.diagnostics || []);
      }
    } catch (err) {
      console.error('加载数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('onboarding_completed');
    router.push('/admin');
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  // 计算统计数据
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.last_login).length;
  const completedDiagnostics = diagnostics.filter(d => d.completed).length;
  const recentLogins = users.filter(u => {
    if (!u.last_login) return false;
    const lastLogin = new Date(u.last_login);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return lastLogin > dayAgo;
  }).length;

  // 合并诊断记录与用户名
  const diagnosticsWithUsers = diagnostics.map(d => ({
    ...d,
    username: users.find(u => u.id === d.user_id)?.username || '未知',
    display_name: users.find(u => u.id === d.user_id)?.display_name || '未知',
  }));

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">红韵智学管理后台</h1>
                <p className="text-xs text-slate-500">党政学习平台数据管理</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="bg-red-100 text-red-600">
                  {user.display_name?.[0] || user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-slate-900">{user.display_name || user.username}</p>
                <p className="text-slate-500 text-xs">{user.email || user.username}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500">
                <LogOut className="w-4 h-4 mr-1" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">总用户数</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">活跃用户</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{activeUsers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">今日登录</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{recentLogins}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">完成诊断</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{completedDiagnostics}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 标签页 */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="users" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              用户管理
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              诊断记录
            </TabsTrigger>
          </TabsList>

          {/* 用户管理 */}
          <TabsContent value="users">
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>用户列表</CardTitle>
                  <CardDescription>管理所有注册用户</CardDescription>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-1" />
                  添加用户
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={u.avatar_url || undefined} />
                          <AvatarFallback className="bg-red-100 text-red-600">
                            {u.display_name?.[0] || u.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{u.display_name || u.username}</p>
                          <p className="text-sm text-slate-500">
                            @{u.username} · {u.email || '未设置邮箱'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={u.last_login ? 'default' : 'secondary'} className="bg-green-100 text-green-700">
                          {u.last_login ? '活跃' : '未登录'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <UserCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>暂无用户数据</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 诊断记录 */}
          <TabsContent value="diagnostics">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>诊断记录</CardTitle>
                <CardDescription>查看用户学习诊断完成情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diagnosticsWithUsers.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          d.completed ? 'bg-green-100' : 'bg-amber-100'
                        }`}>
                          {d.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {d.display_name || d.username}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {d.roles.slice(0, 2).map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                            {d.roles.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{d.roles.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-slate-500">
                            {new Date(d.created_at).toLocaleDateString('zh-CN')}
                          </p>
                          <p className="text-xs text-slate-400">
                            难度: {d.difficulty === 'beginner' ? '入门' : d.difficulty === 'intermediate' ? '进阶' : '深入'}
                          </p>
                        </div>
                        <Badge variant={d.completed ? 'default' : 'outline'} className="bg-green-100 text-green-700">
                          {d.completed ? '已完成' : '进行中'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {diagnostics.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>暂无诊断记录</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
