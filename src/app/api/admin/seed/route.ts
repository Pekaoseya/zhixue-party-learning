import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 模拟用户数据
const mockUsers = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@hongyun.cn',
    display_name: '系统管理员',
    is_active: true,
  },
  {
    username: 'user1',
    password: 'user123',
    email: 'zhangsan@example.com',
    display_name: '张三',
    is_active: true,
  },
  {
    username: 'user2',
    password: 'user123',
    email: 'lisi@example.com',
    display_name: '李四',
    is_active: true,
  },
  {
    username: 'user3',
    password: 'user123',
    email: 'wangwu@example.com',
    display_name: '王五',
    is_active: true,
  },
  {
    username: 'user4',
    password: 'user123',
    email: 'zhaoliu@example.com',
    display_name: '赵六',
    is_active: true,
  },
];

// 模拟诊断数据
const mockDiagnostics = [
  {
    user_idx: 1,
    roles: ['党支部书记'],
    topics: ['二十大精神', '党史学习'],
    difficulty: 'intermediate',
    completed: true,
  },
  {
    user_idx: 2,
    roles: ['普通党员'],
    topics: ['党章党规', '基层党务'],
    difficulty: 'beginner',
    completed: true,
  },
  {
    user_idx: 3,
    roles: ['党务工作者'],
    topics: ['基层党务', '乡村振兴'],
    difficulty: 'intermediate',
    completed: true,
  },
  {
    user_idx: 4,
    roles: ['入党积极分子'],
    topics: ['党章党规'],
    difficulty: 'beginner',
    completed: false,
  },
];

export async function POST() {
  try {
    const client = getSupabaseClient();

    // 检查是否已有数据
    const { count } = await client.from('users').select('*', { count: 'exact', head: true });
    
    if (count && count > 0) {
      return NextResponse.json({
        success: true,
        message: '数据已存在，无需重复初始化',
        userCount: count,
      });
    }

    // 插入用户数据
    const usersToInsert = mockUsers.map(user => ({
      ...user,
      created_at: new Date().toISOString(),
    }));

    const { data: insertedUsers, error: usersError } = await client
      .from('users')
      .insert(usersToInsert)
      .select('id, username');

    if (usersError) {
      console.error('插入用户失败:', usersError);
      return NextResponse.json(
        { error: '初始化用户数据失败' },
        { status: 500 }
      );
    }

    // 插入诊断数据
    const diagnosticsToInsert = mockDiagnostics.map((d, idx) => ({
      user_id: insertedUsers?.[d.user_idx]?.id || insertedUsers?.[0]?.id,
      roles: d.roles,
      topics: d.topics,
      difficulty: d.difficulty,
      completed: d.completed,
      created_at: new Date(Date.now() - (idx + 1) * 24 * 60 * 60 * 1000).toISOString(),
    }));

    const { error: diagnosticsError } = await client
      .from('user_diagnostics')
      .insert(diagnosticsToInsert);

    if (diagnosticsError) {
      console.error('插入诊断记录失败:', diagnosticsError);
      // 不影响整体返回
    }

    // 更新部分用户的最后登录时间
    const now = new Date();
    const usersToUpdate = [
      { idx: 0, hoursAgo: 1 },
      { idx: 1, hoursAgo: 3 },
      { idx: 2, hoursAgo: 24 },
    ];

    for (const { idx, hoursAgo } of usersToUpdate) {
      if (insertedUsers?.[idx]) {
        await client
          .from('users')
          .update({ last_login: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString() })
          .eq('id', insertedUsers[idx].id);
      }
    }

    return NextResponse.json({
      success: true,
      message: '模拟数据初始化成功',
      userCount: insertedUsers?.length || 0,
      diagnosticCount: mockDiagnostics.length,
    });
  } catch (err) {
    console.error('服务器错误:', err);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// GET 请求也触发初始化
export async function GET() {
  return POST();
}
