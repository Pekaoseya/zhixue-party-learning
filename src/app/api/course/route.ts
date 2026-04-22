// 课程 API 代理路由 - 连接 Frontend8082 后端服务
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = 'http://192.168.1.244:8082';
const API_URL = `${BACKEND_BASE_URL}/api`;

// 后端 Session Cookie 缓存（服务端内存中共享）
let backendSessionCookie: string | null = null;
// 防伪造 Token（从后端获取）
let antiForgeryToken: Record<string, string> | null = null;
let isAuthenticating = false;
let authQueue: Array<() => void> = [];

/**
 * 获取后端认证 Cookie + AntiForgeryToken
 */
async function ensureAuth(): Promise<{ cookie: string | null; token: Record<string, string> | null }> {
  if (backendSessionCookie && antiForgeryToken) {
    console.log('[Backend Auth] Using cached credentials');
    return { cookie: backendSessionCookie, token: antiForgeryToken };
  }

  if (isAuthenticating) {
    return new Promise((resolve) => {
      authQueue.push(() => resolve({ cookie: backendSessionCookie, token: antiForgeryToken }));
    });
  }

  isAuthenticating = true;
  try {
    console.log('[Backend Auth] Attempting login as yyf...');
    const loginResponse = await fetch(`${API_URL}/Page/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams({
        Account: 'yyf',
        PassWord: 'JYZXyyf@2026',
        RememberMe: 'true',
      }),
    });

    const loginData = await loginResponse.json();
    console.log('[Backend Auth] Login response:', JSON.stringify(loginData).slice(0, 300));

    // 提取 Set-Cookie
    const setCookie = loginResponse.headers.getSetCookie
      ? loginResponse.headers.getSetCookie()
      : loginResponse.headers.get('set-cookie');

    console.log('[Backend Auth] Set-Cookie:', setCookie);

    if (setCookie) {
      backendSessionCookie = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
    }

    // 获取防伪造 Token（需要先有 Session）
    if (backendSessionCookie) {
      const tokenResponse = await fetch(`${API_URL}/Page/AntiForgeryToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Cookie': backendSessionCookie,
        },
      });
      const tokenHtml = await tokenResponse.text();
      console.log('[Backend Auth] AntiForgeryToken HTML:', tokenHtml.slice(0, 500));

      // 从 HTML 中提取 token: <input type="hidden" name="__RequestVerificationToken" value="xxx" />
      const nameMatch = tokenHtml.match(/name="([^"]+)"/);
      const valueMatch = tokenHtml.match(/value="([^"]+)"/);
      if (nameMatch && valueMatch) {
        antiForgeryToken = { [nameMatch[1]]: valueMatch[1] };
        console.log('[Backend Auth] AntiForgeryToken extracted:', antiForgeryToken);
      }
    }

    authQueue.forEach(fn => fn());
    authQueue = [];
    return { cookie: backendSessionCookie, token: antiForgeryToken };
  } catch (error) {
    console.error('[Backend Auth] Login failed:', error);
    authQueue.forEach(fn => fn());
    authQueue = [];
    return { cookie: null, token: null };
  } finally {
    isAuthenticating = false;
  }
}

// 课程列表 API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('id');
  const page = searchParams.get('page') || '1';
  const rows = searchParams.get('rows') || '10';
  const channelCode = searchParams.get('channelCode') || '';

  try {
    if (courseId) {
      const response = await fetch(`${API_URL}/Page/CourseContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ Id: courseId, titleNav: '课程详情' }),
      });
      return NextResponse.json(await response.json());
    }

    const response = await fetch(`${API_URL}/Page/CourseList`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams({
        page, rows, sort: 'Sort', order: 'desc',
        courseType: 'All', channelId: '', channelCode, title: '',
        titleNav: '课程中心', wordLimt: '35', teacher: '', TagId: '', channelIds: '',
      }),
    });
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Failed to fetch course data:', error);
    return NextResponse.json({ error: 'Failed to fetch course data' }, { status: 500 });
  }
}

// 获取视频播放地址
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { courseId, playType = 'Single' } = body;

  try {
    let apiUrl: string;
    if (playType === 'JY') {
      apiUrl = `${API_URL}/Home/PlayJY`;
    } else if (playType === 'Office') {
      apiUrl = `${API_URL}/Home/PlayOffice`;
    } else {
      apiUrl = `${API_URL}/Home/PlaySingle`;
    }

    // 获取认证信息
    const { cookie, token } = await ensureAuth();

    const requestBody = new URLSearchParams({ courseId });
    
    // 添加防伪造 Token
    if (token) {
      Object.entries(token).forEach(([key, value]) => {
        requestBody.set(key, value);
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    console.log('[Play API] Calling:', apiUrl, 'with cookie:', !!cookie, 'token:', JSON.stringify(token));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: requestBody,
    });

    const data = await response.json();
    console.log('[Play API] Response for', courseId, ':', JSON.stringify(data).slice(0, 300));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to get video URL:', error);
    return NextResponse.json({ error: 'Failed to get video URL' }, { status: 500 });
  }
}
