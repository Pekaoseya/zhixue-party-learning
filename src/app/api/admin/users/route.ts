import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const client = getSupabaseClient();

    const { data: users, error } = await client
      .from('users')
      .select('id, username, email, display_name, avatar_url, is_active, last_login, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查询用户失败:', error);
      return NextResponse.json(
        { error: '获取用户列表失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ users: users || [] });
  } catch (err) {
    console.error('服务器错误:', err);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
