import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

interface DiagnosticRequest {
  user_id: string;
  roles: string[];
  topics: string[];
  difficulty: string;
  learning_path_id?: string;
  completed?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: DiagnosticRequest = await request.json();

    const { user_id, roles, topics, difficulty, learning_path_id, completed = true } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 检查是否已有诊断记录
    const { data: existing, error: checkError } = await client
      .from('user_diagnostics')
      .select('id')
      .eq('user_id', user_id)
      .maybeSingle();

    if (checkError) {
      console.error('检查诊断记录失败:', checkError);
      return NextResponse.json(
        { error: '检查诊断记录失败' },
        { status: 500 }
      );
    }

    if (existing) {
      // 更新现有记录
      const { error: updateError } = await client
        .from('user_diagnostics')
        .update({
          roles,
          topics,
          difficulty,
          learning_path_id,
          completed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('更新诊断记录失败:', updateError);
        return NextResponse.json(
          { error: '更新诊断记录失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '诊断记录已更新',
        id: existing.id,
      });
    } else {
      // 创建新记录
      const { data, error: insertError } = await client
        .from('user_diagnostics')
        .insert({
          user_id,
          roles,
          topics,
          difficulty,
          learning_path_id,
          completed,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('创建诊断记录失败:', insertError);
        return NextResponse.json(
          { error: '创建诊断记录失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '诊断记录已保存',
        id: data.id,
      });
    }
  } catch (err) {
    console.error('服务器错误:', err);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    const { data, error } = await client
      .from('user_diagnostics')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('查询诊断记录失败:', error);
      return NextResponse.json(
        { error: '查询诊断记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ diagnostic: data });
  } catch (err) {
    console.error('服务器错误:', err);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
