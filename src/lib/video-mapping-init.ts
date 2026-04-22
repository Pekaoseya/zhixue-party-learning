/**
 * 视频映射初始化脚本
 * 在浏览器中运行，将课程到视频文件的映射保存到 localStorage
 * 
 * 使用方式：
 * 1. 在浏览器开发者工具中运行此脚本
 * 2. 或在页面加载时自动调用 initVideoMapping()
 */

import { courseVideoMapping } from '@/lib/video-mapping';

/**
 * 初始化视频映射到 localStorage
 * 这样课程学习页面就可以读取视频路径
 */
export function initVideoMapping(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // 保存课程到视频路径的映射
    localStorage.setItem('course_video_mapping', JSON.stringify(courseVideoMapping));
    
    console.log('[视频映射] 已初始化', Object.keys(courseVideoMapping).length, '个课程视频映射');
  } catch (error) {
    console.error('[视频映射] 初始化失败:', error);
  }
}

/**
 * 获取课程视频 URL
 * @param courseId 课程 ID
 * @returns 完整的视频 URL
 */
export function getCourseVideoUrl(courseId: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const mappingStr = localStorage.getItem('course_video_mapping');
    if (!mappingStr) return null;
    
    const mapping = JSON.parse(mappingStr);
    const videoPath = mapping[courseId];
    
    if (!videoPath) return null;
    
    // 将路径转换为 API URL
    // 例如: 政治理论/DSP210705.mp4 -> /api/video/政治理论/DSP210705.mp4
    return `/api/video/${videoPath.replace(/\\/g, '/')}`;
  } catch (error) {
    console.error('[视频映射] 读取失败:', error);
    return null;
  }
}

/**
 * 清除视频映射
 */
export function clearVideoMapping(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('course_video_mapping');
  console.log('[视频映射] 已清除');
}

// 自动初始化（仅在客户端）
if (typeof window !== 'undefined') {
  // 延迟初始化，确保页面加载完成
  setTimeout(() => {
    initVideoMapping();
  }, 100);
}
