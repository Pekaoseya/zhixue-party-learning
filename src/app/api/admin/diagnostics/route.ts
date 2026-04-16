import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const client = getSupabaseClient();

    const { data: diagnostics, error } = await client
      .from('user_diagnostics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查询诊断记录失败:', error);
      return NextResponse.json(
        { error: '获取诊断记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ diagnostics: diagnostics || [] });
  } catch (err) {
    console.error('服务器错误:', err);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
