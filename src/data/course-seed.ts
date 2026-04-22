// 课程内容数据类型
export interface CourseContentData {
  id: string;
  title: string;
  type: 'video' | 'article';
  duration?: number;
  content: string;
  videoUrl?: string;
  videoId?: string;
}

// 课程章节数据类型
export interface SectionNode {
  id: string;
  nodeId?: string;
  title: string;
  name?: string;
  duration?: number;
  completed: boolean;
  type: 'video' | 'article';
  summary?: string;
  keyPoints?: string[];
  resources?: { title: string; url: string }[];
  timeRange?: [number, number];
}

export interface CourseSectionData {
  id: string;
  title: string;
  sections: SectionNode[];
}

// 根据节点ID获取课程内容
export function getCourseContentByNodeId(nodeId: string): CourseContentData | null {
  // 模拟数据
  return {
    id: nodeId,
    title: '课程内容',
    type: 'video',
    duration: 15 * 60,
    content: '<p>这是课程的详细内容</p>',
    videoUrl: 'https://example.com/video.mp4',
  };
}

// 根据节点ID获取课程章节
export function getCourseSectionsByNodeId(nodeId: string): CourseSectionData[] {
  // 模拟数据
  return [
    {
      id: 'section-1',
      title: '第一章：课程简介',
      sections: [
        {
          id: 'sec-1-1',
          title: '课程介绍',
          duration: 5 * 60,
          completed: true,
          type: 'video',
        },
        {
          id: 'sec-1-2',
          title: '学习目标',
          duration: 3 * 60,
          completed: true,
          type: 'article',
        },
      ],
    },
    {
      id: 'section-2',
      title: '第二章：核心内容',
      sections: [
        {
          id: 'sec-2-1',
          title: '核心概念',
          duration: 10 * 60,
          completed: false,
          type: 'video',
        },
        {
          id: 'sec-2-2',
          title: '实操练习',
          duration: 15 * 60,
          completed: false,
          type: 'article',
        },
      ],
    },
  ];
}
