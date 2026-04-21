'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getNodeById, partyKnowledgeGraph } from '@/lib/knowledge-graph';
import type { KnowledgeNode } from '@/lib/types';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  BookOpen,
  FileText,
  ChevronLeft,
  CheckCircle2,
  Lightbulb,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [node, setNode] = useState<KnowledgeNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchedNode = getNodeById(courseId, partyKnowledgeGraph);
    if (fetchedNode) {
      setNode(fetchedNode);
    }
  }, [courseId]);

  if (!node) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">课程加载中...</p>
        </div>
      </div>
    );
  }

  const duration = node.content?.duration || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">{node.content?.title || node.name}</h1>
            <p className="text-sm text-gray-500">{node.description}</p>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            {duration}分钟
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* 左侧：视频播放器 */}
        <div className="flex-1">
          {/* 视频区域 */}
          <div className="bg-black rounded-xl overflow-hidden relative aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">{node.content?.title}</p>
                <p className="text-sm text-gray-400 mt-2">{node.content?.summary}</p>
              </div>
            </div>
            
            {/* 播放控制条 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* 进度条 */}
              <div className="mb-3">
                <Progress value={progress} className="h-1 [&>div]:bg-orange-500" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <span className="text-white text-sm">
                    {currentTime} / {duration}分钟
                  </span>
                </div>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* 标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">课程概述</TabsTrigger>
              <TabsTrigger value="chapters">章节目录</TabsTrigger>
              <TabsTrigger value="notes">学习笔记</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{node.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{node.description}</p>
                  <Separator className="my-4" />
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-orange-500" />
                    核心要点
                  </h3>
                  <ul className="space-y-2">
                    {node.keyPoints?.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  {node.relatedDocuments && (
                    <>
                      <Separator className="my-4" />
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        相关文档
                      </h3>
                      <ul className="space-y-2">
                        {node.relatedDocuments.map((doc) => (
                          <li key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm">{doc.title}</span>
                            <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chapters" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Play className="h-4 w-4 text-orange-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{node.content?.title}</p>
                        <p className="text-xs text-gray-500">{node.content?.duration}分钟</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        学习中
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无学习笔记</p>
                  <p className="text-sm mt-1">观看视频时可以添加笔记</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 右侧：课程目录 */}
        <aside className="w-80 flex-shrink-0">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">课程目录</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-4 space-y-2">
                  {node.children ? (
                    node.children.map((child) => {
                      const isCompleted = completedChapters.has(child.id);
                      const isActive = child.id === courseId;
                      return (
                        <div
                          key={child.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            isActive ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => router.push(`/course/${child.id}`)}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <Play className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${isActive ? 'font-medium text-orange-700' : ''}`}>
                              {child.name}
                            </p>
                            {child.content?.duration && (
                              <p className="text-xs text-gray-500">{child.content.duration}分钟</p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Play className="h-4 w-4 text-orange-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{node.name}</p>
                        <p className="text-xs text-gray-500">{duration}分钟</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
