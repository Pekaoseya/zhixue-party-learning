import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { User } from '@/storage/database/shared/schema';

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password }: LoginRequest = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 查询用户
    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('数据库查询错误:', error);
      return NextResponse.json(
        { error: '登录失败，请稍后重试' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 简单密码验证（生产环境应该使用更安全的方式）
    if (user.password !== password) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 更新最后登录时间
    await client
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // 返回用户信息（不包含密码）
    const { password: _, ...safeUser } = user as User & { password: string };

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (err) {
    console.error('登录错误:', err);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
