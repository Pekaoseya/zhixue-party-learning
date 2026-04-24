'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainNav } from '@/components/main-nav';
import { 
  BookOpen, 
  Search,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  Filter,
  Video,
  Image as ImageIcon,
  FileText,
  ChevronRight,
  Play,
  Lock,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Home,
  Eye,
  Edit3,
  Save,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

// 课程分类
const categories = [
  { id: 'politics', name: '时政要闻', count: 12580, color: 'bg-red-600' },
  { id: 'party', name: '党史学习', count: 8960, color: 'bg-orange-500' },
  { id: 'theory', name: '理论学习', count: 4520, color: 'bg-amber-600' },
  { id: 'practice', name: '实务技能', count: 3280, color: 'bg-yellow-500' },
  { id: 'spirit', name: '会议精神', count: 2580, color: 'bg-green-600' },
  { id: 'ai-course', name: 'AI生成课程', count: '智能生成', color: 'bg-purple-600' },
];

// 课程列表
const courses = [
  {
    id: 1,
    title: '中国共产党纪律处分条例解读',
    category: '党史学习',
    chapterCount: 8,
    completedChapter: 2,
    totalDuration: '2小时30分',
    progress: 25,
    level: '必修',
    chapters: [
      { id: 1, title: '第一讲：总则概述', duration: '15:00', isCompleted: true },
      { id: 2, title: '第二讲：政治纪律', duration: '20:00', isCompleted: true },
      { id: 3, title: '第三讲：组织纪律', duration: '18:00', isCompleted: false },
    ]
  },
  {
    id: 2,
    title: '习近平新时代中国特色社会主义思想概论',
    category: '理论学习',
    chapterCount: 12,
    completedChapter: 8,
    totalDuration: '4小时',
    progress: 67,
    level: '必修',
    chapters: [
      { id: 1, title: '第一讲：思想概述', duration: '20:00', isCompleted: true },
      { id: 2, title: '第二讲：十个明确', duration: '25:00', isCompleted: true },
    ]
  },
  {
    id: 3,
    title: '基层党建工作实务指南',
    category: '实务技能',
    chapterCount: 6,
    completedChapter: 0,
    totalDuration: '1小时45分',
    progress: 0,
    level: '选修',
    chapters: []
  },
  {
    id: 4,
    title: '2024年全国两会精神解读',
    category: '会议精神',
    chapterCount: 4,
    completedChapter: 4,
    totalDuration: '1小时20分',
    progress: 100,
    level: '热门',
    chapters: []
  },
];

// 精选内容
const featuredContents = [
  {
    id: 1,
    type: 'video',
    title: '3分钟读懂新质生产力',
    duration: '3:24',
    views: 12580,
  },
  {
    id: 2,
    type: 'image',
    title: '二十大报告金句摘录',
    duration: '停留阅读',
    views: 45600,
  },
  {
    id: 3,
    type: 'video',
    title: '四个意识 flashcard',
    duration: '5:00',
    views: 28900,
  },
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseTopic, setCourseTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(() => {
    const saved = localStorage.getItem('ai_generated_course');
    return !!saved;
  });
  const [generatedCourse, setGeneratedCourse] = useState<any>(() => {
    const saved = localStorage.getItem('ai_generated_course');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem('ai_generated_course');
    return saved ? 'ai-course' : 'courses';
  });

  // 保存AI生成课程到localStorage
  useEffect(() => {
    if (generatedCourse) {
      localStorage.setItem('ai_generated_course', JSON.stringify(generatedCourse));
    }
  }, [generatedCourse]);

  // 页面重新激活时重新读取localStorage
  useEffect(() => {
    const restoreState = () => {
      const saved = localStorage.getItem('ai_generated_course');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setGeneratedCourse(parsed);
          setShowResult(true);
          setActiveTab('ai-course');
        } catch { /* ignore */ }
      }
    };
    // 初始读取
    restoreState();
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', restoreState);
    // 监听窗口焦点
    window.addEventListener('focus', restoreState);
    return () => {
      document.removeEventListener('visibilitychange', restoreState);
      window.removeEventListener('focus', restoreState);
    };
  }, []);
  const [editMode, setEditMode] = useState(false);
  const [editedChapters, setEditedChapters] = useState<any[]>([]);
  // 诊断数据
  const [diagnosticData, setDiagnosticData] = useState<{ roles: string[]; topics: string[]; difficulty: string } | null>(null);
  // 生成逻辑说明（动态）
  const [generationLogic, setGenerationLogic] = useState<any>(null);

  const presetCourseTopics = [
    {
      key: 'xjp_thought',
      name: '习近平新时代中国特色社会主义思想专题',
      data: {
        courseName: '习近平新时代中国特色社会主义思想专题课程',
        courseType: '理论课程',
        totalHours: 12,
        difficulty: '高级',
        targetAudience: '全省统战系统干部',
        chapters: [
          { id: 1, title: '课程目标与课程概述', duration: '30分钟', type: 'video', content: '本课程旨在引导学员深刻领悟党的创新理论的核心要义、精神实质和实践要求，使学员成为习近平新时代中国特色社会主义思想的坚定信仰者和忠实实践者。' },
          { id: 2, title: '第一讲：习近平新时代中国特色社会主义思想的形成背景与历史地位', duration: '45分钟', type: 'video', content: '系统学习习近平新时代中国特色社会主义思想的创立背景、理论渊源、实践基础，深刻理解其作为当代中国马克思主义、二十一世纪马克思主义的理论定位，掌握"两个结合"的理论创新路径。' },
          { id: 3, title: '第二讲：核心要义与科学体系——"十个明确"与"十四个坚持"', duration: '60分钟', type: 'video', content: '深入学习"十个明确"的核心要义、"十四个坚持"的基本方略、"十三个方面成就"的历史贡献，系统把握这一思想的科学体系和理论框架。' },
          { id: 4, title: '第三讲："两个确立"的决定性意义', duration: '50分钟', type: 'video', content: '深刻领悟"两个确立"的历史必然性、政治内涵和实践要求，增强"四个意识"、坚定"四个自信"、做到"两个维护"，自觉在思想上政治上行动上同以习近平同志为核心的党中央保持高度一致。' },
          { id: 5, title: '第四讲：世界观和方法论——"六个必须坚持"', duration: '55分钟', type: 'video', content: '深刻理解"六个必须坚持"的内涵要义，掌握习近平新时代中国特色社会主义思想的世界观和方法论，运用这一思想的立场观点方法分析和解决实际问题。' },
          { id: 6, title: '第五讲：新时代统一战线工作的根本遵循', duration: '60分钟', type: 'video', content: '深入学习习近平总书记关于做好新时代党的统一战线工作的重要思想，理解统一战线是凝聚人心、汇聚力量的强大法宝，掌握促进政党关系、民族关系、宗教关系、阶层关系、海内外同胞关系和谐的要求。' },
          { id: 7, title: '实践应用方法与案例分析', duration: '70分钟', type: 'video', content: '通过具体案例分析，学习将党的创新理论转化为工作思路和举措的方法，提升运用理论指导实践的能力，推动工作高质量发展。' },
          { id: 8, title: '最新发展动态与总结思考', duration: '50分钟', type: 'video', content: '学习党的二十大以来党的创新理论的最新发展，总结课程学习收获，思考如何在实际工作中贯彻落实，增强干事创业的责任感、使命感和紧迫感。' },
        ],
        description: '本课程系统讲授习近平新时代中国特色社会主义思想的科学体系、核心要义和实践要求，特别聚焦统一战线工作的重要论述，引导学员深刻领悟党的创新理论的真理力量和实践伟力。课程涵盖理论渊源、实践基础、核心要义、历史地位等内容，帮助学员全面把握这一当代中国马克思主义、二十一世纪马克思主义。',
        learningObjectives: [
          '深刻理解习近平新时代中国特色社会主义思想的丰富内涵',
          '准确把握十个明确、十四个坚持的核心要义',
          '深刻领悟两个确立的决定性意义',
          '熟练掌握新时代统一战线工作的理论方针政策',
          '提升运用党的创新理论指导实践的能力水平',
        ],
      }
    },
    {
      key: 'united_front',
      name: '新时代统一战线工作实务',
      data: {
        courseName: '新时代统一战线工作实务课程',
        courseType: '实务课程',
        totalHours: 16,
        difficulty: '中级',
        targetAudience: '基层统战干部',
        chapters: [
          { id: 1, title: '课程概述与理论基础', duration: '30分钟', type: 'video', content: '本课程围绕新时代统一战线各领域工作，从理论基础、制度设计、政策要求到实践操作进行全链条讲解，特别注重案例教学和经验分享。' },
          { id: 2, title: '第一讲：新时代统一战线的历史方位与重要作用', duration: '45分钟', type: 'video', content: '深入学习习近平总书记关于做好新时代党的统一战线工作的重要思想，理解统一战线是凝聚人心、汇聚力量的强大法宝，掌握"十二个必须"的核心要义。' },
          { id: 3, title: '第二讲：中国新型政党制度与多党合作', duration: '55分钟', type: 'video', content: '系统学习中国共产党领导的多党合作和政治协商制度，掌握民主党派和无党派人士工作的方法，做好政治协商、民主监督、参政议政工作，加强中国特色社会主义参政党建设。' },
          { id: 4, title: '第三讲：铸牢中华民族共同体意识——民族工作实务', duration: '60分钟', type: 'video', content: '深入学习以铸牢中华民族共同体意识为主线的党的民族工作，掌握全面推进中华民族共有精神家园建设、推动各民族共同走向社会主义现代化、促进各民族交往交流交融、提升民族事务治理体系和治理能力现代化水平的方法。' },
          { id: 5, title: '第四讲：坚持我国宗教中国化方向——宗教工作实务', duration: '55分钟', type: 'video', content: '完整准确全面贯彻党的宗教信仰自由政策，依法管理宗教事务，坚持独立自主自办原则，积极引导宗教与社会主义社会相适应，以社会主义核心价值观为引领，用中华优秀传统文化浸润宗教。' },
          { id: 6, title: '第五讲：促进"两个健康"——民营经济统战工作', duration: '50分钟', type: 'video', content: '深入学习促进非公有制经济健康发展和非公有制经济人士健康成长的要求，构建亲清政商关系，加强民营经济人士思想政治建设，发挥工商联和商会作用。' },
          { id: 7, title: '第六讲：新的社会阶层人士统战工作', duration: '50分钟', type: 'video', content: '认识新的社会阶层人士的构成和特点，加强对新的社会阶层人士的政治引领，发挥新的社会阶层人士作用，创新新的社会阶层人士统战工作方法，加强平台建设。' },
          { id: 8, title: '第七讲：港澳台海外统战工作', duration: '55分钟', type: 'video', content: '坚持和完善"一国两制"制度体系，做好港澳统战工作，做好对台工作，做好海外统战工作，凝聚侨心侨力侨智。' },
          { id: 9, title: '第八讲：党外代表人士队伍建设', duration: '45分钟', type: 'video', content: '加强党外代表人士的发现培养、教育引导、选拔使用和管理服务，建设一支高素质的党外代表人士队伍。' },
          { id: 10, title: '实践应用与案例研讨', duration: '90分钟', type: 'discussion', content: '通过具体案例分析，学习基层统战工作创新实践，掌握正确处理一致性和多样性关系、尊重维护照顾同盟者利益的方法，提升实际工作能力。' },
        ],
        description: '本课程围绕新时代统一战线各领域工作，从理论基础、制度设计、政策要求到实践操作进行全链条讲解，特别注重案例教学和经验分享，提升基层统战干部的实际工作能力。课程涵盖统一战线基本理论、各领域工作实务、工作方法创新等内容，帮助学员全面掌握新时代统战工作的核心要义、政策要求和实践方法。',
        learningObjectives: [
          '掌握新时代统一战线各领域工作的基本理论',
          '熟悉多党合作、民族宗教、民营经济等领域政策',
          '了解基层统战工作创新发展的方向路径',
          '提升解决实际问题的能力水平',
          '增强做好新时代统战工作的责任感使命感',
        ],
      }
    },
    {
      key: 'party_style',
      name: '党风廉政建设专题',
      data: {
        courseName: '党风廉政建设专题课程',
        courseType: '廉政课程',
        totalHours: 10,
        difficulty: '中级',
        targetAudience: '党员干部',
        chapters: [
          { id: 1, title: '课程概述与党的自我革命重要思想', duration: '30分钟', type: 'video', content: '本课程聚焦党风廉政建设，通过系统讲授全面从严治党要求、党纪党规、警示案例，引导党员干部知敬畏、存戒惧、守底线。' },
          { id: 2, title: '第一讲：党的自我革命与全面从严治党战略方针', duration: '50分钟', type: 'video', content: '深入学习习近平总书记关于党的自我革命的重要思想，理解全面从严治党是新时代党的自我革命的伟大实践，深刻认识党风廉政建设和反腐败斗争的极端重要性。' },
          { id: 3, title: '第二讲：党的纪律建设与《中国共产党纪律处分条例》解读', duration: '60分钟', type: 'video', content: '系统学习党的纪律的主要内容，重点解读《中国共产党纪律处分条例》，掌握政治纪律、组织纪律、廉洁纪律、群众纪律、工作纪律、生活纪律的具体要求。' },
          { id: 4, title: '第三讲：中央八项规定精神与作风建设', duration: '55分钟', type: 'video', content: '深入学习中央八项规定及其实施细则精神，掌握持之以恒纠治"四风"、反对特权思想和特权现象、树立新风正气的要求，保持同人民群众的血肉联系。' },
          { id: 5, title: '第四讲：一体推进不敢腐、不能腐、不想腐', duration: '55分钟', type: 'video', content: '深入学习一体推进不敢腐、不能腐、不想腐的重要方略，理解不敢腐是前提、不能腐是关键、不想腐是根本，掌握同时发力、同向发力、综合发力的方法。' },
          { id: 6, title: '第五讲：警示教育典型案例分析', duration: '60分钟', type: 'video', content: '通过典型案例分析，用身边事教育身边人，增强警示教育的针对性和实效性，深刻认识违纪违法的严重后果。' },
          { id: 7, title: '第六讲：廉洁自律与党性修养', duration: '50分钟', type: 'video', content: '增强廉洁自律意识，树立正确的权力观、地位观、利益观，做到廉洁从政、廉洁用权、廉洁修身、廉洁齐家，保持共产党人的政治本色，加强党性修养。' },
          { id: 8, title: '专题研讨与总结思考', duration: '60分钟', type: 'discussion', content: '专题讨论如何做到廉洁自律，总结课程学习收获，思考如何在实际工作中贯彻落实，增强管党治党政治责任，落实"两个责任"。' },
        ],
        description: '本课程聚焦党风廉政建设，通过系统讲授全面从严治党要求、党纪党规、警示案例，引导党员干部知敬畏、存戒惧、守底线，增强廉洁自律意识。课程涵盖党的自我革命、全面从严治党、党的纪律建设、廉洁自律、反腐败斗争等内容，帮助学员深刻认识党风廉政建设和反腐败斗争的重要意义，系统掌握党纪党规的具体要求，增强廉洁自律意识和拒腐防变能力。',
        learningObjectives: [
          '深刻领会全面从严治党的重大意义',
          '熟练掌握党纪党规的具体要求',
          '通过案例警示增强廉洁自律意识',
          '树立正确的权力观、地位观、利益观',
          '增强管党治党政治责任，落实"两个责任"',
        ],
      }
    },
  ];

  const router = useRouter();

  const thinkingSteps = [
    '正在读取您的知识图谱诊断结果...',
    '正在分析课程需求与目标受众...',
    '正在检索相关知识点与资料...',
    '正在设计课程结构与章节安排...',
    '正在生成课程内容与学习目标...',
    '正在优化课程大纲与教学设计...',
    '课程生成完成！',
  ];

  // 根据诊断结果动态生成课程生成逻辑说明
  const generateLogicExplanation = (topic: string, diagnostic: { roles: string[]; topics: string[]; difficulty: string } | null) => {
    const hasDiag = diagnostic && (diagnostic.roles.length > 0 || diagnostic.topics.length > 0);
    
    // 角色解读
    const roleInterpretation = hasDiag ? (
      diagnostic!.roles.length > 0 
        ? `根据您在学习诊断中选择的身份「${diagnostic!.roles.join('、')}」，系统判断您需要侧重${diagnostic!.roles.includes('党支部书记') || diagnostic!.roles.includes('党务工作者') ? '实务操作和基层党建方法' : '理论学习和思想武装'}方面的内容。`
        : '系统根据您的身份标签，判断了适合您的内容深度和学习方向。'
    ) : '由于暂未完成学习诊断，系统默认以中级难度和综合受众为标准生成课程。';

    // 主题关联解读
    const topicConnection = hasDiag ? (
      diagnostic!.topics.length > 0
        ? `您在学习诊断中感兴趣的主题「${diagnostic!.topics.join('、')}」与本课程内容高度关联。AI已将相关知识点融入章节设计中，确保内容与您的学习偏好相匹配。`
        : '系统根据课程主题自动匹配了相关知识模块。'
    ) : '系统根据课程主题自动匹配了相关知识模块。';

    // 难度匹配解读
    const difficultyMatch = hasDiag ? (
      `您选择的难度等级「${diagnostic!.difficulty === 'beginner' ? '入门' : diagnostic!.difficulty === 'intermediate' ? '进阶' : '深入'}」决定了课程的深度和广度。AI已据此调整章节数量和理论深度。`
    ) : '系统默认以中级难度生成课程，包含适中的理论深度和实践内容。';

    // 综合推荐逻辑
    const recommendation = hasDiag
      ? `综上，AI根据您完整的诊断画像（身份 + 主题偏好 + 难度等级），为您智能生成了这套课程。所有章节、时长、学习目标均经过个性化匹配，旨在最大化您的学习效率。`
      : `当前课程基于通用标准生成。建议前往引导页完成学习诊断，获取更精准的个性化课程推荐。`;

    return {
      roleInterpretation,
      topicConnection,
      difficultyMatch,
      recommendation,
      hasDiagnosis: hasDiag,
    };
  };

  const handlePresetClick = (plan: any) => {
    setCourseTopic(plan.name);
    handleGenerate(plan.data);
  };

  const handleGenerate = (presetData?: any) => {
    if (!courseTopic.trim() && !presetData) return;

    // 读取诊断数据（同步读取，确保在生成逻辑中使用最新数据）
    let currentDiagnostic: { roles: string[]; topics: string[]; difficulty: string } | null = null;
    try {
      const saved = localStorage.getItem('user_diagnostic');
      console.log('[课程生成] localStorage中的诊断数据:', saved);
      if (saved) {
        const parsed = JSON.parse(saved);
        currentDiagnostic = {
          roles: parsed.roles || [],
          topics: parsed.topics || [],
          difficulty: parsed.difficulty || 'intermediate',
        };
        setDiagnosticData(currentDiagnostic);
        console.log('[课程生成] 诊断数据解析成功:', currentDiagnostic);
      } else {
        console.log('[课程生成] localStorage中没有诊断数据');
      }
    } catch (e) {
      console.error('[课程生成] 读取诊断数据失败:', e);
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setShowResult(false);
    setGenerationLogic(null);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= thinkingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    setTimeout(() => {
      const topic = presetData ? presetData.courseName : courseTopic;
      const courseData = presetData || {
        courseName: `${courseTopic}专题课程`,
        courseType: '专题课程',
        totalHours: Math.floor(Math.random() * 8) + 4,
        difficulty: '中级',
        targetAudience: '统战系统干部',
        chapters: generateChapters(courseTopic),
        description: `本课程围绕"${courseTopic}"主题，系统讲解相关理论知识和实践方法，帮助学员全面掌握核心要义，提升业务能力。`,
        learningObjectives: [
          `深刻理解${courseTopic}的核心内涵`,
          `掌握相关的政策要求和工作方法`,
          `提升解决实际问题的能力`,
          `推动工作创新发展`,
        ],
      };
      setGeneratedCourse(courseData);
      setEditedChapters([...courseData.chapters]);
      // 使用局部变量currentDiagnostic，而不是状态变量diagnosticData（setState是异步的）
      console.log('[课程生成] 生成逻辑说明使用的诊断数据:', currentDiagnostic);
      setGenerationLogic(generateLogicExplanation(topic, currentDiagnostic));
      setIsGenerating(false);
      setShowResult(true);
    }, 2500);
  };

  const generateChapters = (topic: string) => {
    const chapterCount = Math.floor(Math.random() * 4) + 4;
    return Array.from({ length: chapterCount }, (_, i) => ({
      id: i + 1,
      title: `第${i + 1}讲：${topic}核心知识点${i + 1}`,
      duration: `${Math.floor(Math.random() * 30) + 20}分钟`,
      type: Math.random() > 0.7 ? 'discussion' : 'video',
      content: `本章节将深入学习${topic}的相关内容，帮助学员掌握核心知识点，提升理论水平和实践能力。`,
    }));
  };

  const handleChapterEdit = (index: number, field: string, value: any) => {
    const newChapters = [...editedChapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    setEditedChapters(newChapters);
  };

  const handleAddChapter = () => {
    setEditedChapters([
      ...editedChapters,
      {
        id: editedChapters.length + 1,
        title: '新增章节',
        duration: '30分钟',
        type: 'video',
        content: '',
      },
    ]);
  };

  const handleDeleteChapter = (index: number) => {
    const newChapters = editedChapters.filter((_, i) => i !== index);
    setEditedChapters(newChapters);
  };

  const handleSave = () => {
    setGeneratedCourse({ ...generatedCourse, chapters: editedChapters });
    setEditMode(false);
  };

  // 进入课程学习
  const handleStartLearn = (chapterId: number) => {
    // 保存当前课程到localStorage供学习页使用
    if (generatedCourse) {
      localStorage.setItem('current_ai_course', JSON.stringify(generatedCourse));
    }
    router.push(`/library/course-learn/${chapterId}`);
  };

  return (
      <div className="container mx-auto px-4 py-8 flex-1 overflow-y-auto">
        {/* 搜索栏 */}
        <Card className="mb-8 border-orange-100">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索课程、知识点..." 
                  className="pl-10 border-orange-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="hot">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="排序" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">最热</SelectItem>
                  <SelectItem value="latest">最新</SelectItem>
                  <SelectItem value="progress">我的进度</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="courses">系统课程</TabsTrigger>
            <TabsTrigger value="micro">微课速学</TabsTrigger>
            <TabsTrigger value="quotes">金句收藏</TabsTrigger>
            <TabsTrigger value="ai-course">AI生成课程</TabsTrigger>
          </TabsList>

          {/* 系统课程 */}
          <TabsContent value="courses">
            {/* 分类浏览 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">分类浏览</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.filter(cat => cat.id !== 'ai-course').map((cat) => (
                  <Link key={cat.id} href={`/?channel=${cat.id}`}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer border-red-100 hover:border-red-300">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center`}>
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{cat.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {typeof cat.count === 'number' ? `${cat.count.toLocaleString()} 课程` : cat.count}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* 我的课程 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">我的课程</h2>
                <Button variant="ghost" size="sm">
                  查看全部
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="border-red-100">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* 封面 */}
                        <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                          {course.level === '必修' && (
                            <Badge className="absolute -top-2 -left-2 bg-red-600 text-xs">必修</Badge>
                          )}
                          <Play className="h-8 w-8 text-white/80" />
                        </div>
                        
                        {/* 信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{course.category}</Badge>
                            {course.level === '热门' && (
                              <Badge className="text-xs bg-amber-100 text-amber-700">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                热门
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm line-clamp-1">{course.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {course.chapterCount}章 · {course.totalDuration}
                          </p>
                          
                          {/* 进度 */}
                          {course.progress > 0 && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">学习进度</span>
                                <span className="text-red-600">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-1" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 章节列表 */}
                      {course.progress > 0 && course.chapters.length > 0 && (
                        <div className="mt-4 pt-4 border-t space-y-2">
                          {course.chapters.map((chapter, idx) => (
                            <div key={chapter.id} className="flex items-center gap-2 text-sm">
                              {chapter.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                              )}
                              <span className={chapter.isCompleted ? 'text-muted-foreground' : ''}>
                                {chapter.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Button size="sm" className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-500">
                        {course.progress > 0 ? '继续学习' : '开始学习'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 微课速学 */}
          <TabsContent value="micro">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredContents.map((content) => (
                <Card key={content.id} className="border-red-100 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center relative">
                    {content.type === 'video' && (
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    )}
                    {content.type === 'image' && (
                      <ImageIcon className="h-12 w-12 text-white/80" />
                    )}
                    <Badge className="absolute top-2 right-2 bg-black/50 text-white text-xs">
                      {content.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2">{content.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Eye className="h-3 w-3 inline mr-1" />
                      {content.views >= 1000 ? `${(content.views/1000).toFixed(1)}k` : content.views}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 金句收藏 */}
          <TabsContent value="quotes">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                  <CardContent className="p-6">
                    <Lightbulb className="h-6 w-6 text-amber-500 mb-3" />
                    <blockquote className="text-sm italic text-gray-700 mb-3">
                      "奋斗是青春最亮丽的底色，行动是青年最有效的磨砺。有责任有担当，青春才会闪光。"
                    </blockquote>
                    <p className="text-xs text-muted-foreground">—— 习近平</p>
                    <Button variant="ghost" size="sm" className="mt-3 w-full text-amber-700">
                      <Star className="h-4 w-4 mr-1" />
                      收藏金句
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI生成课程 */}
          <TabsContent value="ai-course">
            {/* 顶部横幅导航区 */}
            <div className="mb-6 border-2 border-black bg-amber-400 px-5 py-3 flex items-center justify-between" style={{ boxShadow: '4px 4px 0 0 #000' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </div>
                <span className="text-lg font-black text-black tracking-tight">AI课程生成控制台</span>
              </div>
              <div className="flex items-center gap-2">
                {['平台总览', '课程库', '生成记录', '模板中心'].map((label) => (
                  <button
                    key={label}
                    className="px-4 py-1.5 bg-white border-2 border-black text-xs font-bold hover:bg-black hover:text-amber-400 transition-colors"
                    style={{ boxShadow: '2px 2px 0 0 #000' }}
                    disabled
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 主视觉标题区 + 右侧信息面板 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* 左侧：超大标题区 */}
              <div className="lg:col-span-2 border-2 border-black bg-white p-8 relative" style={{ boxShadow: '4px 4px 0 0 #000' }}>
                <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 border-2 border-black" style={{ boxShadow: '2px 2px 0 0 #000', transform: 'rotate(2deg)' }}>
                  AI DRIVEN
                </div>
                <h1 className="text-5xl font-black text-black mb-4 leading-none tracking-tighter" style={{ textShadow: '2px 2px 0 #e0e0e0' }}>
                  AI智能<br/>生成课程
                </h1>
                <p className="text-base text-gray-600 mb-6 max-w-lg leading-relaxed">
                  输入课程主题，AI自动设计课程结构、生成章节内容、匹配学习目标，让课程创作效率提升10倍。
                </p>
                {/* 输入区 */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="输入课程主题，如：习近平关于宗教工作的重要论述..."
                      className="pl-10 h-12 text-base border-2 border-black font-medium"
                      style={{ borderRadius: '0' }}
                      value={courseTopic}
                      onChange={(e) => setCourseTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                  </div>
                  <Button
                    className="h-12 px-8 bg-amber-400 hover:bg-amber-500 text-black font-bold border-2 border-black text-base"
                    style={{ borderRadius: '0', boxShadow: '3px 3px 0 0 #000' }}
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !courseTopic.trim()}
                  >
                    {isGenerating ? '生成中...' : '🚀 开始生成'}
                  </Button>
                </div>

                {/* 预设主题 - 标签式按钮 */}
                <div className="mt-6 border-2 border-black bg-white p-5" style={{ boxShadow: '4px 4px 0 0 #000' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-600 flex items-center justify-center border-2 border-black" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                      <span className="text-white text-xs font-black">热</span>
                    </div>
                    <span className="font-bold text-black">热门预设主题</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {presetCourseTopics.map(plan => (
                      <Button
                        key={plan.key}
                        className="px-5 py-2 border-2 border-black font-bold text-sm hover:bg-black hover:text-white transition-colors"
                        style={{
                          borderRadius: '0',
                          boxShadow: '2px 2px 0 0 #000',
                          backgroundColor: plan.key === 'xjp_thought' ? '#fbbf24' : plan.key === 'united_front' ? '#c084fc' : '#fb7185',
                        }}
                        onClick={() => handlePresetClick(plan)}
                        disabled={isGenerating}
                      >
                        {plan.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 生成逻辑说明 */}
                <div className="mt-6 pt-6 border-t-2 border-black">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 bg-amber-400 flex items-center justify-center border-2 border-black" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                      <Lightbulb className="h-4 w-4 text-black" />
                    </div>
                    <span className="font-black text-sm text-black">
                      {generationLogic ? '本次生成逻辑解读' : '课程生成逻辑说明'}
                    </span>
                    {generationLogic && !generationLogic.hasDiagnosis && (
                      <span className="text-[10px] text-gray-500 ml-2">（通用模式）</span>
                    )}
                  </div>

                  {generationLogic ? (
                    /* 动态生成逻辑说明 - 基于诊断结果 */
                    <div className="space-y-3">
                      {/* 角色解读 */}
                      <div className="flex items-start gap-3 p-3 border-2 border-black bg-red-50 relative" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                        <div className="absolute -top-2.5 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5">身份匹配</div>
                        <div className="mt-1">
                          <div className="text-[12px] text-gray-800 leading-relaxed">{generationLogic.roleInterpretation}</div>
                        </div>
                      </div>
                      {/* 主题关联 */}
                      <div className="flex items-start gap-3 p-3 border-2 border-black bg-purple-50 relative" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                        <div className="absolute -top-2.5 left-2 bg-purple-600 text-white text-[10px] font-black px-2 py-0.5">主题关联</div>
                        <div className="mt-1">
                          <div className="text-[12px] text-gray-800 leading-relaxed">{generationLogic.topicConnection}</div>
                        </div>
                      </div>
                      {/* 难度匹配 */}
                      <div className="flex items-start gap-3 p-3 border-2 border-black bg-amber-50 relative" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                        <div className="absolute -top-2.5 left-2 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5">难度适配</div>
                        <div className="mt-1">
                          <div className="text-[12px] text-gray-800 leading-relaxed">{generationLogic.difficultyMatch}</div>
                        </div>
                      </div>
                      {/* 综合推荐 */}
                      <div className="flex items-start gap-3 p-3 border-2 border-black bg-emerald-50 relative" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                        <div className="absolute -top-2.5 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5">综合推荐</div>
                        <div className="mt-1">
                          <div className="text-[12px] text-gray-800 leading-relaxed font-medium">{generationLogic.recommendation}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 通用5步流程说明 - 未生成课程时显示 */
                    <>
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          { step: '01', title: '诊断读取', desc: '读取您的知识图谱诊断结果' },
                          { step: '02', title: '需求分析', desc: '理解您的课程主题与目标受众' },
                          { step: '03', title: '知识检索', desc: '从党建知识库中匹配相关内容' },
                          { step: '04', title: '结构设计', desc: '自动编排章节顺序与课时分配' },
                          { step: '05', title: '目标匹配', desc: '输出学习目标与课程简介' },
                        ].map((item) => (
                          <div key={item.step} className="border-2 border-black bg-gray-50 p-3 relative" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                            <div className="absolute -top-2.5 left-2 bg-black text-amber-400 text-[10px] font-black px-2 py-0.5">
                              {item.step}
                            </div>
                            <div className="font-black text-sm text-black mb-1 mt-1">{item.title}</div>
                            <div className="text-[11px] text-gray-600 leading-snug">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-1 h-3 bg-purple-600 rounded-full"></span>
                        基于大语言模型 + 党建知识图谱 + 您的诊断结果 · 生成结果可编辑后确认创建
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 右侧信息面板 */}
              <div className="border-2 border-black bg-purple-600 p-6 text-white relative" style={{ boxShadow: '4px 4px 0 0 #000' }}>
                <div className="absolute top-3 right-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 border-2 border-black" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                  平台能力
                </div>
                <div className="mt-4">
                  <div className="text-6xl font-black mb-1" style={{ textShadow: '3px 3px 0 #000' }}>
                    {isGenerating ? `${currentStep + 1}` : '5'}
                  </div>
                  <div className="text-sm font-bold mb-4">大步骤智能生成</div>
                  <div className="space-y-2 mb-5">
                    {thinkingSteps.slice(0, isGenerating ? currentStep + 1 : 5).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs bg-white/20 px-3 py-1.5 border border-white/30">
                        {idx < currentStep || !isGenerating ? (
                          <CheckCircle2 className="h-3 w-3 text-amber-400 flex-shrink-0" />
                        ) : (
                          <span className="w-3 h-3 flex-shrink-0 animate-pulse text-amber-400">●</span>
                        )}
                        <span className="truncate">{step.replace('正在', '').replace('...', '')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-white/60 border-t border-white/20 pt-3">
                    基于大语言模型与知识图谱驱动
                  </div>
                </div>
              </div>
            </div>

            {/* AI思考过程（生成中显示） */}
            {isGenerating && (
              <div className="border-2 border-black bg-gray-900 p-5 mb-6 text-white" style={{ boxShadow: '4px 4px 0 0 #000' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="animate-pulse text-2xl">🤖</span>
                  <span className="font-bold text-amber-400">AI正在生成课程</span>
                  <span className="text-xs text-gray-400 ml-auto">Step {currentStep + 1}/{thinkingSteps.length}</span>
                </div>
                <div className="space-y-1.5">
                  {thinkingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm pl-4 relative">
                      {idx < currentStep ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 absolute left-0" />
                      ) : idx === currentStep ? (
                        <span className="absolute left-0 animate-pulse text-amber-400">▶</span>
                      ) : (
                        <span className="absolute left-0 text-gray-600">○</span>
                      )}
                      <span className={idx <= currentStep ? 'text-white' : 'text-gray-600'}>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-purple-600 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / thinkingSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}



            {/* 生成结果 */}
            {showResult && generatedCourse && (
              <>
                {/* 功能统计卡片行 */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: '课程类型', value: generatedCourse.courseType, color: 'bg-purple-500', icon: '📋' },
                    { label: '总学时', value: `${generatedCourse.totalHours}学时`, color: 'bg-amber-400', icon: '⏱' },
                    { label: '难度等级', value: generatedCourse.difficulty, color: 'bg-pink-500', icon: '📊' },
                    { label: '章节数', value: `${editMode ? editedChapters.length : generatedCourse.chapters.length}章`, color: 'bg-emerald-500', icon: '📑' },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className={`${stat.color} border-2 border-black p-5 relative text-white`}
                      style={{ boxShadow: '4px 4px 0 0 #000' }}
                    >
                      <div className="absolute top-2 right-2 text-xl">{stat.icon}</div>
                      <div className="text-3xl font-black mb-1" style={{ textShadow: '2px 2px 0 #000' }}>{stat.value}</div>
                      <div className="text-sm font-bold opacity-80">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* 课程基本信息卡片 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* 左侧：课程简介 */}
                  <div className="border-2 border-black bg-white p-6 relative" style={{ boxShadow: '4px 4px 0 0 #000' }}>
                    <div className="absolute -top-3 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 border-2 border-black" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                      01 · 课程简介
                    </div>
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <h3 className="font-black text-xl text-black">{generatedCourse.courseName}</h3>
                      <div className="flex gap-2">
                        {editMode ? (
                          <>
                            <Button size="sm" variant="outline" className="border-2 border-black" style={{ borderRadius: '0' }} onClick={() => setEditMode(false)}>
                              取消
                            </Button>
                            <Button size="sm" className="bg-green-500 text-white font-bold border-2 border-black" style={{ borderRadius: '0', boxShadow: '2px 2px 0 0 #000' }} onClick={handleSave}>
                              <Save className="h-4 w-4 mr-1" />
                              保存
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" className="border-2 border-black font-bold" style={{ borderRadius: '0' }} onClick={() => setEditMode(true)}>
                            <Edit3 className="h-4 w-4 mr-1" />
                            编辑
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{generatedCourse.description}</p>
                    <div className="mt-4 pt-4 border-t-2 border-black">
                      <div className="text-sm font-bold text-black mb-2">学习目标</div>
                      <ul className="space-y-1.5">
                        {generatedCourse.learningObjectives.map((obj: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 右侧：目标受众 */}
                  <div className="border-2 border-black bg-emerald-500 p-6 text-white relative" style={{ boxShadow: '4px 4px 0 0 #000' }}>
                    <div className="absolute -top-3 right-4 bg-amber-400 text-black text-xs font-black px-3 py-1 border-2 border-black" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                      02 · 受众分析
                    </div>
                    <div className="mt-2">
                      <div className="text-4xl font-black mb-2" style={{ textShadow: '2px 2px 0 #000' }}>
                        {generatedCourse.targetAudience}
                      </div>
                      <div className="text-sm opacity-90 mb-6">目标受众群体</div>
                      <div className="bg-white text-black p-4 border-2 border-black" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                        <div className="font-bold text-sm mb-2">课程信息</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">类型</span>
                            <span className="font-bold">{generatedCourse.courseType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">学时</span>
                            <span className="font-bold">{generatedCourse.totalHours}学时</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">难度</span>
                            <span className="font-bold">{generatedCourse.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 课程章节列表 */}
                <div className="border-2 border-black bg-white p-6 relative mb-6" style={{ boxShadow: '4px 4px 0 0 #000' }}>
                  <div className="absolute -top-3 left-4 bg-purple-600 text-white text-xs font-black px-3 py-1 border-2 border-black" style={{ boxShadow: '2px 2px 0 0 #000' }}>
                    03 · 课程章节
                  </div>
                  <div className="flex items-center justify-between mb-5 mt-2">
                    <h3 className="font-black text-xl text-black">
                      共{editMode ? editedChapters.length : generatedCourse.chapters.length}章
                    </h3>
                    {editMode && (
                      <Button size="sm" className="bg-amber-400 text-black font-bold border-2 border-black" style={{ borderRadius: '0', boxShadow: '2px 2px 0 0 #000' }} onClick={handleAddChapter}>
                        <Plus className="h-4 w-4 mr-1" />
                        添加章节
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(editMode ? editedChapters : generatedCourse.chapters).map((chapter: any, idx: number) => (
                      <div key={chapter.id} className="p-4 border-2 border-black bg-white relative" style={{ boxShadow: '3px 3px 0 0 #000' }}>
                        <div className="flex items-center gap-4">
                          {/* 彩色封面块 + 编号角标 */}
                          <div className="relative flex-shrink-0">
                            <div className={`w-14 h-14 flex items-center justify-center border-2 border-black font-black text-2xl text-white ${
                              idx % 5 === 0 ? 'bg-red-500' : idx % 5 === 1 ? 'bg-purple-600' : idx % 5 === 2 ? 'bg-amber-400 text-black' : idx % 5 === 3 ? 'bg-emerald-500' : 'bg-pink-500'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                              {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                          {editMode ? (
                            <div className="space-y-2">
                              <Input
                                value={chapter.title}
                                onChange={(e) => handleChapterEdit(idx, 'title', e.target.value)}
                                className="font-bold border-2 border-black"
                                style={{ borderRadius: '0' }}
                              />
                              <div className="flex gap-2">
                                <Input
                                  value={chapter.duration}
                                  onChange={(e) => handleChapterEdit(idx, 'duration', e.target.value)}
                                  className="w-32 text-sm border-2 border-black"
                                  style={{ borderRadius: '0' }}
                                  placeholder="学时"
                                />
                                <select
                                  value={chapter.type}
                                  onChange={(e) => handleChapterEdit(idx, 'type', e.target.value)}
                                  className="border-2 border-black px-3 py-2 text-sm font-medium"
                                  style={{ borderRadius: '0' }}
                                >
                                  <option value="video">视频课</option>
                                  <option value="discussion">研讨课</option>
                                  <option value="mixed">图文课</option>
                                </select>
                              </div>
                              <textarea
                                value={chapter.content || ''}
                                onChange={(e) => handleChapterEdit(idx, 'content', e.target.value)}
                                className="w-full text-sm border-2 border-black p-3"
                                style={{ borderRadius: '0' }}
                                placeholder="输入章节内容..."
                                rows={3}
                              />
                            </div>
                          ) : (
                            <>
                              <div className="font-bold text-black text-base">{chapter.title}</div>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs bg-gray-100 border border-black px-2 py-0.5 font-bold flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {chapter.duration}
                                </span>
                                <span className={`text-xs px-2 py-0.5 font-bold border border-black ${
                                  chapter.type === 'video' ? 'bg-red-100' :
                                  chapter.type === 'mixed' ? 'bg-blue-100' :
                                  'bg-purple-100'
                                }`}>
                                    {chapter.type === 'video' ? '📹 视频课' :
                                     chapter.type === 'mixed' ? '📑 图文课' :
                                     '💬 研讨课'}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          {!editMode && (
                            <Button size="sm" className="bg-amber-400 text-black font-bold border-2 border-black hover:bg-amber-500" style={{ borderRadius: '0', boxShadow: '2px 2px 0 0 #000' }} onClick={() => handleStartLearn(chapter.id)}>
                              <Play className="h-4 w-4 mr-1" />
                              学习
                            </Button>
                          )}
                          {editMode && (
                            <Button
                              size="sm"
                              className="bg-red-500 text-white font-bold border-2 border-black hover:bg-red-600"
                              style={{ borderRadius: '0', boxShadow: '2px 2px 0 0 #000' }}
                              onClick={() => handleDeleteChapter(idx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {/* 章节内容详情展示 */}
                        {!editMode && chapter.content && (
                          <div className="mt-4 pt-4 border-t-2 border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-bold text-gray-700">章节内容</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{chapter.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 底部操作栏 */}
                <div className="border-2 border-black bg-gray-900 p-5 flex items-center justify-between text-white" style={{ boxShadow: '4px 4px 0 0 #000' }}>
                  <div className="text-sm">
                    课程已生成：<span className="font-bold text-amber-400">{generatedCourse.courseName}</span> ·
                    共<span className="font-bold text-amber-400">{editMode ? editedChapters.length : generatedCourse.chapters.length}</span>章节 ·
                    <span className="font-bold text-amber-400">{generatedCourse.totalHours}</span>学时
                  </div>
                  <div className="flex gap-3">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white font-bold hover:bg-white hover:text-black" style={{ borderRadius: '0' }}>
                      收藏课程
                    </Button>
                    <Button size="lg" className="bg-green-500 text-white font-bold border-2 border-black hover:bg-green-600" style={{ borderRadius: '0', boxShadow: '3px 3px 0 0 #000' }} onClick={() => {
                      if (generatedCourse) {
                        localStorage.setItem('current_ai_course', JSON.stringify(generatedCourse));
                        router.push('/library/course-learn/1');
                      }
                    }}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      确认创建并学习
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
}
