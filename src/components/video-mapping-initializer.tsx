'use client';

import { useEffect } from 'react';
import { courseVideoMapping } from '@/lib/video-mapping';

/**
 * 视频映射初始化组件
 * 在应用启动时将课程到视频文件的映射保存到 localStorage
 * 这样课程学习页面就可以读取视频路径
 */
export default function VideoMappingInitializer() {
  useEffect(() => {
    try {
      // 保存课程到视频路径的映射
      localStorage.setItem('course_video_mapping', JSON.stringify(courseVideoMapping));
      
      console.log('[视频映射] 已初始化', Object.keys(courseVideoMapping).length, '个课程视频映射');
    } catch (error) {
      console.error('[视频映射] 初始化失败:', error);
    }
  }, []);

  // 这个组件不渲染任何内容
  return null;
}
