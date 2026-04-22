'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { NavBar } from '@/components/nav-bar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Clock,
  Users,
  Volume2,
  VolumeX,
  Maximize,
  List,
  ChevronRight,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { partyKnowledgeGraph } from '@/lib/knowledge-graph';
import type { KnowledgeNode, LearningProgress } from '@/lib/types';

// 从后端获取课程详情（通过代理）
async function fetchCourseDetail(courseId: string) {
  try {
    const response = await fetch(`/api/course?id=${courseId}`);
    return response.json();
  } catch (error) {
    console.error('Failed to fetch course detail:', error);
    return null;
  }
}

// 从后端获取视频播放地址（通过代理）
async function fetchVideoUrl(courseId: string) {
  try {
    const response = await fetch('/api/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    });
    const data = await response.json();
    // 后端返回格式：{ Data: { Url: "..." }, Code: 1 }
    console.log('fetchVideoUrl result for', courseId, ':', data);
    return data?.Data?.Url || data?.Data?.url || null;
  } catch (error) {
    console.error('Failed to fetch video URL:', error);
    return null;
  }
}

// 知识树大纲组件
function KnowledgeTreeOutline({
  currentNodeId,
  onNodeClick,
  progress = [],
}: {
  currentNodeId: string;
  onNodeClick: (node: KnowledgeNode) => void;
  progress: LearningProgress[];
}) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const getNodeStatus = (nodeId: string) => {
    const prog = progress.find(p => p.nodeId === nodeId);
    return prog?.status || 'locked';
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const renderNode = (node: KnowledgeNode, level: number = 0) => {
    const isCurrent = node.id === currentNodeId;
    const status = getNodeStatus(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id];

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            } else {
              onNodeClick(node);
            }
          }}
          className={`
            flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-all
            ${isCurrent
              ? 'bg-red-600 text-white shadow-sm'
              : 'hover:bg-gray-100 text-gray-700'
            }
            ${level > 0 ? 'ml-3' : ''}
          `}
        >
          <div className="flex-shrink-0">
            {status === 'completed' ? (
              <CheckCircle className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-green-500'}`} />
            ) : status === 'in_progress' ? (
              <Clock className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-amber-500'}`} />
            ) : (
              <Circle className={`w-3.5 h-3.5 ${isCurrent ? 'text-white/70' : 'text-gray-300'}`} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium truncate ${isCurrent ? 'text-white' : ''}`}>
              {node.name}
            </div>
          </div>
          {hasChildren && (
            <div
              className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              <ChevronRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-0.5">
      {partyKnowledgeGraph.children?.map(child => renderNode(child))}
    </div>
  );
}

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const courseId = params.id as string;
  const queryCourseId = searchParams?.get('courseId') || null;
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [courseDetail, setCourseDetail] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [currentNode, setCurrentNode] = useState<KnowledgeNode | null>(null);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);

  // 加载进度
  useEffect(() => {
    const saved = localStorage.getItem('learning_progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // 保存进度
  useEffect(() => {
    if (progress.length > 0) {
      localStorage.setItem('learning_progress', JSON.stringify(progress));
    }
  }, [progress]);

  // 加载课程详情和视频
  useEffect(() => {
    async function loadCourse() {
      setIsLoading(true);
      
      const node = findNodeById(courseId, partyKnowledgeGraph);
      if (node) {
        setCurrentNode(node);
        
        setProgress(prev => {
          const existing = prev.find(p => p.nodeId === courseId);
          if (!existing) {
            const updated = [...prev];
            const inProgressIndex = updated.findIndex(p => p.status === 'in_progress');
            if (inProgressIndex !== -1) {
              updated[inProgressIndex] = { ...updated[inProgressIndex], status: 'completed' };
            }
            updated.push({ nodeId: courseId, status: 'in_progress' });
            return updated;
          }
          return prev;
        });

        // 优先使用queryCourseId指定的课程，否则使用node.courses中的第一个
        if (node.courses && node.courses.length > 0) {
          let courseToPlay;
          if (queryCourseId) {
            const index = node.courses.findIndex(c => c.id === queryCourseId);
            if (index !== -1) {
              setSelectedCourseIndex(index);
              courseToPlay = node.courses[index];
            } else {
              courseToPlay = node.courses[0];
            }
          } else {
            courseToPlay = node.courses[0];
          }
          // 使用 courseToPlay.videoId 或 courseToPlay.id 作为 courseId 请求视频
          const targetId = courseToPlay.videoId || courseToPlay.id;
          const videoUrl = await fetchVideoUrl(targetId);
          if (videoUrl) {
            setVideoUrl(videoUrl);
          }
        } else if (node.videoId) {
          const videoUrl = await fetchVideoUrl(node.videoId);
          if (videoUrl) {
            setVideoUrl(videoUrl);
          }
        }
      }

      const detail = await fetchCourseDetail(courseId);
      if (detail) {
        setCourseDetail(detail);
      }

      setIsLoading(false);
    }
    
    loadCourse();
  }, [courseId, queryCourseId]);

  // 切换课程
  const switchCourse = async (courseIndex: number) => {
    if (!currentNode?.courses || courseIndex >= currentNode.courses.length) return;
    
    setSelectedCourseIndex(courseIndex);
    setIsLoading(true);
    
    const course = currentNode.courses[courseIndex];
    const targetId = course.videoId || course.id;
    const videoUrl = await fetchVideoUrl(targetId);
    if (videoUrl) {
      setVideoUrl(videoUrl);
    }
    
    setIsLoading(false);
  };

  // 视频时间更新
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // 自动保存进度
      if (currentNode) {
        setProgress(prev => {
          const currentIndex = prev.findIndex(p => p.nodeId === currentNode.id);
          if (currentIndex !== -1 && prev[currentIndex].status !== 'completed') {
            const updated = [...prev];
            // 如果播放超过90%，标记为完成
            if (videoRef.current!.duration && videoRef.current!.currentTime / videoRef.current!.duration >= 0.9) {
              updated[currentIndex] = { ...updated[currentIndex], status: 'completed' };
            }
            return updated;
          }
          return prev;
        });
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNodeClick = (node: KnowledgeNode) => {
    setCurrentNode(node);
    router.push(`/course/${node.id}`);
  };

  // 在知识图谱中查找节点（同时匹配节点id和courses中的course.id）
  function findNodeById(id: string, node: KnowledgeNode): KnowledgeNode | null {
    if (node.id === id) return node;
    // 匹配 courses 中的 course id
    if (node.courses && node.courses.some(c => c.id === id)) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(id, child);
        if (found) return found;
      }
    }
    return null;
  }

  // 获取学习进度
  const getNodeStatus = (nodeId: string) => {
    const prog = progress.find(p => p.nodeId === nodeId);
    return prog?.status || 'locked';
  };

  if (isLoading) {
    return (
      <NavBar activeTab="library">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">加载课程中...</p>
          </div>
        </div>
      </NavBar>
    );
  }

  return (
    <NavBar activeTab="library">
      <div className="max-w-[1280px] mx-auto py-6 px-8">
        <div className="flex gap-8">
          {/* 左侧：视频播放区 */}
          <div className="flex-1">
            {/* 视频播放器 */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video relative group">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-900">
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">暂无视频资源</p>
                    <p className="text-sm text-gray-500 mt-2">课程ID: {courseId}</p>
                  </div>
                </div>
              )}
              
              {/* 视频控制栏 */}
              {videoUrl && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* 进度条 */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer mb-3
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                      [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button onClick={toggleMute} className="text-white hover:text-red-500 transition-colors">
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 
                          [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <button className="text-white hover:text-red-500 transition-colors">
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 课程信息 */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentNode?.courses && currentNode.courses[selectedCourseIndex]
                  ? currentNode.courses[selectedCourseIndex].title
                  : currentNode?.name || courseDetail?.Title || '课程详情'}
              </h1>
              {currentNode?.courses && currentNode.courses.length > 1 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">关联课程 ({currentNode.courses.length})</h3>
                  <div className="space-y-2">
                    {currentNode.courses.map((course, index) => {
                      const isSelected = index === selectedCourseIndex;
                      return (
                        <button
                          key={course.id}
                          onClick={() => switchCourse(index)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-all text-sm flex items-center gap-2
                            ${isSelected
                              ? 'bg-red-50 border-2 border-red-500 text-red-700 font-medium'
                              : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50'
                            }`}
                        >
                          <span className={"flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold " + (isSelected ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600')}>
                            {index + 1}
                          </span>
                          <span className="flex-1 truncate">{course.title}</span>
                          <span className="flex-shrink-0 text-xs text-gray-500">{course.duration}分钟</span>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {courseDetail?.Description && (
                <p className="mt-4 text-gray-600">{courseDetail.Description}</p>
              )}
              
              {/* 学习进度 */}
              <div className="mt-4 flex items-center gap-4">
                <Button
                  onClick={() => {
                    if (currentNode) {
                      setProgress(prev => {
                        const currentIndex = prev.findIndex(p => p.nodeId === currentNode.id);
                        if (currentIndex !== -1) {
                          const updated = [...prev];
                          updated[currentIndex] = { ...updated[currentIndex], status: 'completed' };
                          return updated;
                        }
                        return [...prev, { nodeId: currentNode.id, status: 'completed' }];
                      });
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  标记完成
                </Button>
                <span className="text-sm text-gray-500">
                  学习状态: {getNodeStatus(courseId) === 'completed' ? '已完成' : getNodeStatus(courseId) === 'in_progress' ? '学习中' : '未开始'}
                </span>
              </div>
            </div>
          </div>

          {/* 右侧：知识树大纲 */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border-2 border-gray-200 p-5 sticky top-6">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                <List className="h-4 w-4 text-blue-500" />
                课程大纲
              </h3>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1 -mr-1">
                <KnowledgeTreeOutline
                  currentNodeId={courseId}
                  onNodeClick={handleNodeClick}
                  progress={progress}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </NavBar>
  );
}
