'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  Home,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  User,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  FileText,
  Video,
  Image as ImageIcon,
  Layers,
  Notebook,
  Settings,
  Bell,
  Search,
  MoreHorizontal,
  List,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// 内容类型
type ContentType = 'video' | 'image' | 'longvideo';

// 内容项
interface ContentItem {
  id: number;
  type: ContentType;
  title: string;
  subtitle?: string;
  source: string;
  author: string;
  authorAvatar?: string;
  duration?: string;
  category: string;
  tags: string[];
  description: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isCompleted: boolean;
  progress?: number;
  videoUrl?: string;
  imageUrl?: string;
  relatedCourseId?: number;
  knowledgePoints?: string[];
  createdAt: string;
}

// 课程项
interface CourseItem {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  progress?: number;
}

// 模拟数据
const feedContents: ContentItem[] = [
  {
    id: 1,
    type: 'video',
    title: '3分钟读懂新质生产力',
    subtitle: '2024年最重要的经济概念',
    source: '学习强国',
    author: '权威解读',
    duration: '3:24',
    category: '时政',
    tags: ['新质生产力', '经济', '高质量发展'],
    description: '新质生产力是由技术革命性突破、生产要素创新性配置、产业深度转型升级而催生的先进生产力。本视频用通俗易懂的方式，为您解读这一重要概念。',
    likeCount: 12580,
    commentCount: 856,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false,
    progress: 0,
    knowledgePoints: [
      '新质生产力：由技术革命性突破催生的先进生产力',
      '核心要素：高科技、高效能、高质量',
      '与传统生产力的区别：创新驱动而非资源驱动'
    ],
    relatedCourseId: 101,
    createdAt: '2小时前',
  },
  {
    id: 2,
    type: 'image',
    title: '二十大报告金句',
    subtitle: '收藏！二十大报告中的经典论述',
    source: '人民日报',
    author: '人民日报',
    duration: '3秒',
    category: '时政',
    tags: ['二十大', '金句', '重要论述'],
    description: '二十大报告中这些金句，字字珠玑，值得收藏转发！',
    likeCount: 45600,
    commentCount: 2340,
    isLiked: true,
    isBookmarked: true,
    isCompleted: false,
    knowledgePoints: [
      '"江山就是人民，人民就是江山"',
      '"我们党立志于中华民族千秋伟业"',
      '"以中国式现代化全面推进中华民族伟大复兴"'
    ],
    createdAt: '4小时前',
  },
  {
    id: 3,
    type: 'video',
    title: '中国共产党纪律处分条例解读',
    subtitle: '第1集：总则与六大纪律',
    source: '中央纪委国家监委',
    author: '中央纪委',
    duration: '12:35',
    category: '党史',
    tags: ['党纪', '条例', '纪律建设'],
    description: '新修订的《中国共产党纪律处分条例》是规范党组织和党员行为的基础性法规。本课程深入解读总则部分及六大纪律要求。',
    likeCount: 8900,
    commentCount: 567,
    isLiked: false,
    isBookmarked: true,
    isCompleted: false,
    progress: 65,
    knowledgePoints: [
      '党的纪律处分工作遵循原则：党要管党、从严治党',
      '六大纪律：政治纪律、组织纪律、廉洁纪律、群众纪律、工作纪律、生活纪律',
      '监督执纪"四种形态"'
    ],
    relatedCourseId: 102,
    createdAt: '1天前',
  },
  {
    id: 4,
    type: 'image',
    title: '四个意识',
    subtitle: '政治意识、大局意识、核心意识、看齐意识',
    source: '理论学习',
    author: '红韵智学',
    duration: '5秒',
    category: '党史',
    tags: ['四个意识', '政治建设'],
    description: '党员干部必须增强的四个意识，你记住了吗？',
    likeCount: 28900,
    commentCount: 1230,
    isLiked: false,
    isBookmarked: true,
    isCompleted: true,
    knowledgePoints: [
      '政治意识：坚定政治方向，站稳政治立场',
      '大局意识：自觉服从大局，坚决贯彻落实',
      '核心意识：在思想上政治上行动上同党中央保持高度一致',
      '看齐意识：经常、主动、坚决向党中央看齐'
    ],
    createdAt: '2天前',
  },
  {
    id: 5,
    type: 'longvideo',
    title: '中国共产党百年奋斗史',
    subtitle: '完整版讲座（可加入书架观看）',
    source: '中央党校',
    author: '中央党校教授',
    duration: '45:00',
    category: '实务',
    tags: ['党史', '党课', '完整课程'],
    description: '系统讲述中国共产党百年奋斗的光辉历程，从建党初期的筚路蓝缕到新时代的伟大成就。',
    likeCount: 15600,
    commentCount: 890,
    isLiked: true,
    isBookmarked: false,
    isCompleted: false,
    progress: 0,
    knowledgePoints: [
      '党的百年奋斗的四个历史时期',
      '伟大建党精神',
      '十个明确、两个确立'
    ],
    relatedCourseId: 103,
    createdAt: '3天前',
  },
  {
    id: 6,
    type: 'video',
    title: '基层党建工作实务指南',
    subtitle: '三会一课、主题党日、组织生活会',
    source: '党建工作实务',
    author: '党务专家',
    duration: '8:20',
    category: '实务',
    tags: ['基层党建', '三会一课', '实务'],
    description: '详细讲解基层党建工作的规范流程，支委会、党员大会、党课、组织生活会的正确打开方式。',
    likeCount: 6780,
    commentCount: 456,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false,
    progress: 0,
    knowledgePoints: [
      '三会一课：支部委员会、党员大会、党小组会、党课',
      '主题党日：每月固定一天开展党的活动',
      '组织生活会：党员交流思想、开展批评与自我批评'
    ],
    relatedCourseId: 104,
    createdAt: '5天前',
  },
  {
    id: 7,
    type: 'image',
    title: '廉洁自律准则',
    subtitle: '党员领导干部廉洁自律规范',
    source: '中央纪委',
    author: '中央纪委',
    duration: '4秒',
    category: '时政',
    tags: ['廉洁', '自律', '准则'],
    description: '党员领导干部必须遵守的廉洁自律规范，记得收藏！',
    likeCount: 19800,
    commentCount: 567,
    isLiked: false,
    isBookmarked: true,
    isCompleted: false,
    knowledgePoints: [
      '坚持公私分明，先公后私，克己奉公',
      '坚持崇廉拒腐，清白做人，干净做事',
      '坚持尚俭戒奢，艰苦朴素，勤俭节约',
      '坚持吃苦在前，享受在后，甘于奉献'
    ],
    createdAt: '1周前',
  },
  {
    id: 8,
    type: 'video',
    title: '习近平新时代中国特色社会主义思想',
    subtitle: '世界观和方法论专题',
    source: '中央党校',
    author: '中央党校教授',
    duration: '25:30',
    category: '党史',
    tags: ['思想', '世界观', '方法论'],
    description: '深入学习习近平新时代中国特色社会主义思想的世界观和方法论，坚持好运用好贯穿其中的立场观点方法。',
    likeCount: 23400,
    commentCount: 1567,
    isLiked: false,
    isBookmarked: false,
    isCompleted: false,
    progress: 30,
    knowledgePoints: [
      '必须坚持人民至上',
      '必须坚持自信自立',
      '必须坚持守正创新',
      '必须坚持问题导向',
      '必须坚持系统观念',
      '必须坚持胸怀天下'
    ],
    relatedCourseId: 105,
    createdAt: '2周前',
  },
];

// 当前课程章节
const courseChapters: CourseItem[] = [
  { id: 1, title: '第一讲：总则概述', duration: '15:00', isCompleted: true, isLocked: false, progress: 100 },
  { id: 2, title: '第二讲：政治纪律', duration: '20:00', isCompleted: true, isLocked: false, progress: 100 },
  { id: 3, title: '第三讲：组织纪律', duration: '18:00', isCompleted: false, isLocked: false, progress: 65 },
  { id: 4, title: '第四讲：廉洁纪律', duration: '22:00', isCompleted: false, isLocked: false, progress: 0 },
  { id: 5, title: '第五讲：群众纪律', duration: '16:00', isCompleted: false, isLocked: false, progress: 0 },
  { id: 6, title: '第六讲：工作纪律', duration: '19:00', isCompleted: false, isLocked: true, progress: 0 },
  { id: 7, title: '第七讲：生活纪律', duration: '17:00', isCompleted: false, isLocked: true, progress: 0 },
  { id: 8, title: '第八讲：典型案例分析', duration: '25:00', isCompleted: false, isLocked: true, progress: 0 },
];

// 全屏内容卡片组件
function ContentCard({ 
  item, 
  onLike, 
  onBookmark, 
  onShare,
  isActive 
}: { 
  item: ContentItem; 
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isActive: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showKnowledgeCard, setShowKnowledgeCard] = useState(false);

  // 自动播放逻辑
  useEffect(() => {
    if (isActive && item.type === 'video') {
      const timer = setTimeout(() => setIsPlaying(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [isActive, item.type]);

  // 显示知识胶囊
  useEffect(() => {
    if (isActive && item.knowledgePoints && item.knowledgePoints.length > 0) {
      const timer = setTimeout(() => setShowKnowledgeCard(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, item.id]);

  return (
    <div className={`relative w-full h-full bg-black ${isActive ? 'block' : 'hidden'}`}>
      {/* 主内容区 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {item.type === 'video' && (
          <div className="relative w-full h-full bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center">
            {/* 模拟视频封面 */}
            <div className="text-center text-white p-8 max-w-2xl">
              <Badge className="mb-4 bg-white/20 text-white">
                <Video className="h-3 w-3 mr-1" />
                微课 · {item.duration}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              {item.subtitle && <p className="text-white/80 text-lg mb-4">{item.subtitle}</p>}
              
              {/* 播放按钮 */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors mx-auto"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </button>
              
              {/* 进度条 */}
              {item.progress !== undefined && item.progress > 0 && (
                <div className="mt-6 max-w-md mx-auto">
                  <Progress value={item.progress} className="h-1 bg-white/20" />
                  <p className="text-sm text-white/60 mt-1">已观看 {item.progress}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        {item.type === 'image' && (
          <div className="relative w-full h-full bg-gradient-to-br from-red-600 via-orange-500 to-amber-400 flex items-center justify-center p-8">
            <div className="text-center text-white max-w-2xl">
              <Badge className="mb-4 bg-white/30 text-white">
                <ImageIcon className="h-3 w-3 mr-1" />
                金句 · {item.duration || '停留即可'}
              </Badge>
              <h1 className="text-4xl font-bold mb-6 leading-tight">{item.title}</h1>
              {item.subtitle && <p className="text-xl text-white/90 mb-8">{item.subtitle}</p>}
              
              {/* 装饰 */}
              <div className="flex justify-center gap-4 mb-8">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-white/20 text-white border-white/40">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-lg leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        )}

        {item.type === 'longvideo' && (
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <div className="text-center text-white p-8 max-w-2xl">
              <Badge className="mb-4 bg-red-600 text-white">
                <FileText className="h-3 w-3 mr-1" />
                长课 · {item.duration}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              {item.subtitle && <p className="text-white/80 text-lg mb-4">{item.subtitle}</p>}
              <p className="text-white/60 mb-6">{item.description}</p>
              
              <div className="flex justify-center gap-4">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Play className="h-4 w-4 mr-2" />
                  开始学习
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Bookmark className="h-4 w-4 mr-2" />
                  加入书架
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 右侧交互栏 */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4">
        <button 
          onClick={onLike}
          className="flex flex-col items-center"
        >
          <div className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center ${item.isLiked ? 'text-red-500' : 'text-white'}`}>
            <Heart className={`h-6 w-6 ${item.isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-white text-xs mt-1">{item.likeCount >= 1000 ? `${(item.likeCount/1000).toFixed(1)}w` : item.likeCount}</span>
        </button>

        <button 
          onClick={onBookmark}
          className="flex flex-col items-center"
        >
          <div className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center ${item.isBookmarked ? 'text-amber-400' : 'text-white'}`}>
            <Bookmark className={`h-6 w-6 ${item.isBookmarked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-white text-xs mt-1">收藏</span>
        </button>

        <button 
          onClick={onShare}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
            <Share2 className="h-6 w-6" />
          </div>
          <span className="text-white text-xs mt-1">分享</span>
        </button>

        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
            <MessageCircle className="h-6 w-6" />
          </div>
          <span className="text-white text-xs mt-1">{item.commentCount >= 1000 ? `${(item.commentCount/1000).toFixed(1)}w` : item.commentCount}</span>
        </button>
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-20 left-4 right-20">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarFallback className="bg-red-600 text-white">{item.author.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-semibold">{item.author}</p>
            <p className="text-white/60 text-sm">{item.source}</p>
          </div>
        </div>
        <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>
        
        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mt-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-white/10 text-white border-white/20 text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* 知识胶囊 */}
      {showKnowledgeCard && item.knowledgePoints && (
        <div className="absolute left-4 top-1/4 bg-white/95 backdrop-blur rounded-xl p-4 max-w-xs shadow-2xl animate-in slide-in-from-left">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-sm">知识点</span>
          </div>
          <ul className="space-y-2">
            {item.knowledgePoints.slice(0, 3).map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
          {item.knowledgePoints.length > 3 && (
            <Button variant="link" size="sm" className="text-red-600 mt-2 p-0 h-auto">
              查看全部 {item.knowledgePoints.length} 个知识点
            </Button>
          )}
        </div>
      )}

      {/* 上滑提示 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60">
        <ChevronDown className="h-6 w-6 animate-bounce" />
        <span className="text-xs">上滑切换下一个</span>
      </div>
    </div>
  );
}

// 课程抽屉组件
function CourseDrawer({ 
  isOpen, 
  onClose, 
  courseTitle,
  chapters 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  courseTitle: string;
  chapters: CourseItem[];
}) {
  const completedCount = chapters.filter(c => c.isCompleted).length;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[350px] sm:w-[400px] p-0">
        <SheetHeader className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">{courseTitle}</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Progress value={(completedCount / chapters.length) * 100} className="flex-1 h-2" />
            <span>{completedCount}/{chapters.length}</span>
          </div>
        </SheetHeader>
        
        <div className="p-4 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
          {chapters.map((chapter, idx) => (
            <div 
              key={chapter.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                chapter.isLocked 
                  ? 'opacity-50' 
                  : chapter.isCompleted 
                    ? 'bg-green-50' 
                    : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                chapter.isCompleted 
                  ? 'bg-green-500 text-white' 
                  : chapter.isLocked 
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-red-100 text-red-600'
              }`}>
                {chapter.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : chapter.isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-semibold">{idx + 1}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${chapter.isLocked ? 'text-gray-400' : ''}`}>
                  {chapter.title}
                </p>
                {chapter.progress !== undefined && chapter.progress > 0 && !chapter.isCompleted && (
                  <div className="mt-1">
                    <Progress value={chapter.progress} className="h-1" />
                  </div>
                )}
              </div>
              
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {chapter.duration}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t sticky bottom-0 bg-white">
          <Button className="w-full bg-gradient-to-r from-red-600 to-orange-500">
            <BookOpen className="h-4 w-4 mr-2" />
            进入系统学习模式
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// 关联课程卡片
function RelatedCourseCard({ 
  courseId, 
  title, 
  chapterInfo 
}: { 
  courseId: number; 
  title: string; 
  chapterInfo: string;
}) {
  return (
    <Card className="absolute bottom-28 left-4 right-4 bg-white/95 backdrop-blur shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">关联课程</Badge>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{chapterInfo}</p>
        <Button size="sm" className="mt-2 w-full bg-gradient-to-r from-red-600 to-orange-500">
          <Play className="h-3 w-3 mr-1" />
          点击解锁全章
        </Button>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contents, setContents] = useState(feedContents);
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('recommend');
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // 监听滚轮切换内容
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.deltaY > 30 && currentIndex < contents.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsScrolled(true);
    } else if (e.deltaY < -30 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsScrolled(true);
    }
    
    // 重置滚动状态
    setTimeout(() => setIsScrolled(false), 100);
  }, [currentIndex, contents.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // 触摸滑动支持
  const touchStartY = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    
    if (diff > 50 && currentIndex < contents.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // 交互处理
  const handleLike = () => {
    setContents(prev => prev.map((item, idx) => 
      idx === currentIndex ? { ...item, isLiked: !item.isLiked, likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1 } : item
    ));
  };

  const handleBookmark = () => {
    setContents(prev => prev.map((item, idx) => 
      idx === currentIndex ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  const handleShare = () => {
    // 分享逻辑
  };

  const currentContent = contents[currentIndex];

  // 频道定义
  const channels = [
    { id: 'recommend', name: '推荐', icon: Sparkles },
    { id: 'politics', name: '时政', icon: TrendingUp },
    { id: 'party', name: '党史', icon: BookOpen },
    { id: 'practice', name: '实务', icon: Star },
    { id: 'mycourse', name: '我的课表', icon: User },
  ];

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-hidden bg-black flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 顶部导航 */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-black/80 backdrop-blur' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">红韵智学</span>
          </div>

          {/* 频道Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-[60%]">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeChannel === channel.id 
                      ? 'bg-red-600 text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {channel.name}
                </button>
              );
            })}
          </div>

          {/* 右侧按钮 */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区 - 全屏刷内容 */}
      <main className="flex-1 relative">
        {contents.map((item, idx) => (
          <ContentCard
            key={item.id}
            item={item}
            isActive={idx === currentIndex}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        ))}

        {/* 关联课程卡片 */}
        {currentContent.relatedCourseId && (
          <RelatedCourseCard 
            courseId={currentContent.relatedCourseId}
            title="中国共产党纪律处分条例解读"
            chapterInfo="共8章 · 已学习2章"
          />
        )}

        {/* 课程目录按钮 */}
        {currentContent.relatedCourseId && (
          <Button
            onClick={() => setIsCourseDrawerOpen(true)}
            className="absolute bottom-4 right-4 bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30"
            size="sm"
          >
            <List className="h-4 w-4 mr-1" />
            课程目录
          </Button>
        )}
      </main>

      {/* 底部导航 */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-all ${isScrolled ? 'bg-black/80 backdrop-blur' : 'bg-gradient-to-t from-black/80 to-transparent'}`}>
        <div className="flex items-center justify-around py-3">
          {[
            { id: 'home', name: '首页', icon: Home, active: true },
            { id: 'discover', name: '发现', icon: Search, active: false },
            { id: 'bookshelf', name: '书架', icon: BookOpen, active: false },
            { id: 'notes', name: '笔记', icon: Notebook, active: false },
            { id: 'profile', name: '我的', icon: User, active: false },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`flex flex-col items-center gap-1 px-4 py-1 ${
                  item.active ? 'text-white' : 'text-white/60'
                }`}
              >
                <Icon className={`h-5 w-5 ${item.active ? 'text-red-500' : ''}`} />
                <span className="text-xs">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 继续学习悬浮条 */}
      {currentIndex > 0 && (
        <div className="fixed top-20 left-4 right-4 z-40 hidden md:block">
          <Card className="bg-white/95 backdrop-blur shadow-lg">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center">
                  <Play className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">继续学习</p>
                  <p className="text-xs text-muted-foreground">{currentContent.title}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-red-200 text-red-600">
                <SkipBack className="h-3 w-3 mr-1" />
                返回
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 课程抽屉 */}
      <CourseDrawer 
        isOpen={isCourseDrawerOpen}
        onClose={() => setIsCourseDrawerOpen(false)}
        courseTitle="中国共产党纪律处分条例解读"
        chapters={courseChapters}
      />

      {/* 进度指示器 */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1">
        {contents.map((_, idx) => (
          <div 
            key={idx}
            className={`w-1 rounded-full transition-all ${
              idx === currentIndex 
                ? 'h-4 bg-white' 
                : idx < currentIndex 
                  ? 'h-2 bg-white/50' 
                  : 'h-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
