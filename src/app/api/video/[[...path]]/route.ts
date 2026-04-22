import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 视频文件根目录配置
const VIDEO_BASE_PATH = process.env.VIDEO_BASE_PATH || 'E:\\社院课程stt';

// 视频 MIME 类型映射
const MIME_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    // 从 URL 路径构建视频文件路径
    const resolvedParams = await params;
    const videoPathSegments = resolvedParams.path || [];
    const videoRelativePath = decodeURIComponent(videoPathSegments.join('/'));
    const videoFullPath = path.join(VIDEO_BASE_PATH, videoRelativePath.replace(/\//g, path.sep));

    // 安全检查：防止目录遍历攻击
    const resolvedPath = path.resolve(videoFullPath);
    if (!resolvedPath.startsWith(path.resolve(VIDEO_BASE_PATH))) {
      return NextResponse.json(
        { error: '访问被拒绝' },
        { status: 403 }
      );
    }

    // 检查文件是否存在
    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json(
        { error: '视频文件不存在' },
        { status: 404 }
      );
    }

    // 获取文件统计信息
    const stat = fs.statSync(resolvedPath);
    const fileSize = stat.size;
    const ext = path.extname(resolvedPath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'video/mp4';

    // 处理 Range 请求（支持视频流和拖动）
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;

      const fileStream = fs.createReadStream(resolvedPath, { start, end });

      const headers = new Headers({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600',
      });

      return new NextResponse(fileStream as any, {
        status: 206,
        headers,
      });
    } else {
      // 完整文件返回
      const fileStream = fs.createReadStream(resolvedPath);

      const headers = new Headers({
        'Content-Length': fileSize.toString(),
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      });

      return new NextResponse(fileStream as any, {
        status: 200,
        headers,
      });
    }
  } catch (error) {
    console.error('[Video API] 错误:', error);
    return NextResponse.json(
      { error: '视频文件读取失败' },
      { status: 500 }
    );
  }
}
