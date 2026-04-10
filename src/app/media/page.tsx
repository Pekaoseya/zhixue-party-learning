'use client';

import { useState } from 'react';
import { 
  Share2, 
  Layout, 
  BarChart3, 
  Image,
  Upload,
  Download,
  Wand2,
  Palette,
  Type,
  Grid3X3,
  FileText,
  PieChart,
  TrendingUp,
  Globe,
  Smartphone,
  CheckCircle2,
  Loader2,
  Sparkles,
  Copy,
  Eye,
  Share,
  Crop,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Minus,
  Plus,
  RotateCcw,
  Undo,
  Redo,
  Layers,
  MousePointer,
  Text,
  Square,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const templateStyles = [
  { id: 'formal', name: '正式庄重', color: 'bg-red-600', preview: 'red' },
  { id: 'modern', name: '现代简约', color: 'bg-blue-600', preview: 'blue' },
  { id: 'warm', name: '温暖亲切', color: 'bg-orange-500', preview: 'orange' },
  { id: 'vibrant', name: '活力清新', color: 'bg-green-500', preview: 'green' },
];

const chartTypes = [
  { id: 'bar', name: '柱状图', icon: BarChart3, desc: '展示数据对比' },
  { id: 'pie', name: '饼图', icon: PieChart, desc: '展示占比分布' },
  { id: 'line', name: '折线图', icon: TrendingUp, desc: '展示趋势变化' },
  { id: 'mixed', name: '组合图', icon: Grid3X3, desc: '综合数据展示' },
];

const platforms = [
  { id: 'wechat', name: '微信公众号', icon: Globe, connected: true },
  { id: 'weibo', name: '微博', icon: Globe, connected: false },
  { id: 'douyin', name: '抖音', icon: Smartphone, connected: false },
  { id: 'xiaohongshu', name: '小红书', icon: Image, connected: false },
];

// 新增：SVG交互编辑器预设模板
const svgTemplates = [
  { id: 'announcement', name: '政务公告', desc: '正式权威的通知公告样式', color: 'from-red-600 to-red-700' },
  { id: 'report', name: '工作汇报', desc: '清晰简洁的数据展示样式', color: 'from-blue-600 to-blue-700' },
  { id: 'propaganda', name: '宣传海报', desc: '活泼吸睛的宣传推广样式', color: 'from-orange-500 to-amber-500' },
  { id: 'infographic', name: '信息图谱', desc: '数据可视化的图表样式', color: 'from-green-500 to-emerald-500' },
];

// 新增：预设的一图流模板
const oneGraphTemplates = [
  { id: 'title-news', name: '标题新闻式', preview: '大标题+要点', elements: ['标题', '副标题', '要点列表'] },
  { id: 'data-highlight', name: '数据亮点式', preview: '数据突出展示', elements: ['核心数据', '说明文字', '来源标注'] },
  { id: 'timeline', name: '时间线式', preview: '时间轴展示', elements: ['时间点', '事件描述', '节点标记'] },
  { id: 'comparison', name: '对比展示式', preview: '左右对比', elements: ['对比项A', '对比项B', '结论'] },
];

// 内容转换预设
const contentFormats = [
  { 
    id: 'long-to-short', 
    name: '长文转短文', 
    icon: FileText,
    desc: '将长篇公文转化为适合新媒体的精简版本',
    inputPlaceholder: '请粘贴需要转化的长文内容...',
    outputExample: '转化后的短文（适合微博/朋友圈）：\n\n【核心要点】\n1. 要点一...\n2. 要点二...\n3. 要点三...\n\n#政务宣传 #工作动态'
  },
  { 
    id: 'article-to-card', 
    name: '文章转卡片', 
    icon: Layout,
    desc: '将文章内容拆分为精美的图文卡片',
    inputPlaceholder: '请粘贴文章内容...',
    outputExample: '生成的卡片系列：\n\n卡片1：[核心观点卡片]\n卡片2：[数据展示卡片]\n卡片3：[总结建议卡片]'
  },
  { 
    id: 'speech-to-points', 
    name: '讲话转金句', 
    icon: Sparkles,
    desc: '从领导讲话中提炼出精彩金句',
    inputPlaceholder: '请粘贴讲话内容...',
    outputExample: '提炼的金句：\n\n★ "奋斗是最靓丽的底色"\n\n★ "实干是最好的担当"\n\n★ "为民是最深的情怀"'
  },
  { 
    id: 'report-to-visuals', 
    name: '报告转图解', 
    icon: Image,
    desc: '将工作报告转化为直观的图解形式',
    inputPlaceholder: '请粘贴报告内容或关键数据...',
    outputExample: '生成的图解：\n\n[图表1] 年度目标完成率\n[图表2] 工作成效对比\n[图表3] 下一步计划'
  },
];

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('convert');
  const [selectedStyle, setSelectedStyle] = useState('formal');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [chartData, setChartData] = useState('');

  // 新增：内容转化状态
  const [convertType, setConvertType] = useState('long-to-short');
  const [inputContent, setInputContent] = useState('');
  const [convertedContent, setConvertedContent] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // 新增：SVG编辑器状态
  const [selectedTemplate, setSelectedTemplate] = useState('announcement');
  const [svgTitle, setSvgTitle] = useState('政务宣传标题');
  const [svgSubtitle, setSvgSubtitle] = useState('副标题说明文字');
  const [svgPoints, setSvgPoints] = useState('要点一\n要点二\n要点三');
  const [svgColor, setSvgColor] = useState('red');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(100);
      setUploadedFile(file.name);
      toast.success('文件上传成功！');
    }, 2500);
  };

  const handleAutoLayout = () => {
    toast.success('正在为您智能排版，请稍候...');
  };

  const handleGenerateChart = () => {
    if (!chartData.trim()) {
      toast.error('请输入数据或描述图表需求');
      return;
    }
    toast.success('正在生成可视化图表...');
  };

  // 内容转化处理
  const handleConvert = async () => {
    if (!inputContent.trim()) {
      toast.error('请输入需要转化的内容');
      return;
    }

    setIsConverting(true);
    setConvertedContent('');

    try {
      const format = contentFormats.find(f => f.id === convertType);
      
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'assistant',
          messages: [
            { 
              role: 'user', 
              content: `请将以下${format?.name}的内容进行转化：\n\n${inputContent}\n\n请严格按照${format?.desc}的要求进行转化，输出格式要清晰、美观，适合在新媒体平台发布。`
            }
          ]
        })
      });

      if (!response.ok) throw new Error('转化失败');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                setConvertedContent(fullContent);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      toast.error('转化失败，请稍后重试');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  // 生成SVG代码
  const generateSvgCode = () => {
    const colors: Record<string, string> = {
      red: '#dc2626',
      blue: '#2563eb',
      orange: '#ea580c',
      green: '#16a34a',
    };
    const color = colors[svgColor] || colors.red;
    const points = svgPoints.split('\n').filter(p => p.trim());
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}dd;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)" rx="20"/>
  <rect x="30" y="30" width="740" height="540" fill="white" rx="15"/>
  <text x="400" y="120" text-anchor="middle" font-size="48" font-weight="bold" fill="#1f2937" font-family="sans-serif">${svgTitle}</text>
  <text x="400" y="180" text-anchor="middle" font-size="24" fill="#6b7280" font-family="sans-serif">${svgSubtitle}</text>
  <line x1="200" y1="220" x2="600" y2="220" stroke="${color}" stroke-width="3"/>
  ${points.map((point, i) => `
  <circle cx="230" cy="${280 + i * 60}" r="8" fill="${color}"/>
  <text x="260" y="${285 + i * 60}" font-size="20" fill="#374151" font-family="sans-serif">${point}</text>
  `).join('')}
</svg>`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            新媒体赋能
          </h1>
          <p className="text-muted-foreground">
            将传统公文内容转化为适应新媒体平台传播的多样化形式
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="convert">
              <FileText className="h-4 w-4 mr-2" />
              内容转化
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4 mr-2" />
              政务排版
            </TabsTrigger>
            <TabsTrigger value="svg">
              <Image className="h-4 w-4 mr-2" />
              SVG编辑器
            </TabsTrigger>
            <TabsTrigger value="chart">
              <BarChart3 className="h-4 w-4 mr-2" />
              数据可视化
            </TabsTrigger>
          </TabsList>

          {/* 内容转化 Tab */}
          <TabsContent value="convert">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* 转化设置 */}
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-red-600" />
                    内容转化中心
                  </CardTitle>
                  <CardDescription>
                    将传统公文内容转化为适合新媒体传播的多种形式
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>选择转化类型</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {contentFormats.map((format) => {
                        const Icon = format.icon;
                        return (
                          <button
                            key={format.id}
                            onClick={() => setConvertType(format.id)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              convertType === format.id 
                                ? 'border-red-500 bg-red-50' 
                                : 'border-gray-200 hover:border-red-300'
                            }`}
                          >
                            <Icon className="h-6 w-6 mb-2 text-red-600" />
                            <div className="font-medium text-sm">{format.name}</div>
                            <div className="text-xs text-muted-foreground">{format.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>输入内容</Label>
                    <textarea
                      className="w-full min-h-[200px] p-3 border rounded-lg text-sm"
                      placeholder={contentFormats.find(f => f.id === convertType)?.inputPlaceholder}
                      value={inputContent}
                      onChange={(e) => setInputContent(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-500"
                      onClick={handleConvert}
                      disabled={isConverting}
                    >
                      {isConverting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          转化中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          开始转化
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => { setInputContent(''); setConvertedContent(''); }}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 转化结果 */}
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-orange-600" />
                    转化结果预览
                  </CardTitle>
                  <CardDescription>
                    {contentFormats.find(f => f.id === convertType)?.name}效果预览
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white min-h-[300px]">
                    {convertedContent || (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4 text-gray-300" />
                        <p>转化后的内容将显示在这里</p>
                        <p className="text-sm">支持直接复制到新媒体平台发布</p>
                      </div>
                    )}
                    {convertedContent && (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {convertedContent}
                      </div>
                    )}
                  </div>

                  {convertedContent && (
                    <div className="mt-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          navigator.clipboard.writeText(convertedContent);
                          toast.success('已复制到剪贴板');
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        复制内容
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-red-600 to-orange-500">
                        <Share className="h-4 w-4 mr-2" />
                        分享到平台
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 一图流模板 */}
            <Card className="mt-6 border-red-100">
              <CardHeader>
                <CardTitle className="text-lg">一图流模板</CardTitle>
                <CardDescription>快速生成适合朋友圈传播的精美图片</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {oneGraphTemplates.map((template) => (
                    <div 
                      key={template.id}
                      className="border-2 border-dashed rounded-lg p-4 text-center hover:border-red-400 transition-all cursor-pointer"
                    >
                      <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-lg p-4 mb-3 min-h-[120px] flex flex-col items-center justify-center">
                        <Layout className="h-8 w-8 text-red-600 mb-2" />
                        <span className="text-xs text-muted-foreground">{template.preview}</span>
                      </div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {template.elements.join(' + ')}
                      </div>
                      <Button size="sm" className="mt-2 w-full" variant="outline">
                        使用模板
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 政务排版 Tab */}
          <TabsContent value="layout">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-red-600" />
                    文档上传
                  </CardTitle>
                  <CardDescription>上传Word或PDF文档，AI自动识别内容并排版</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      isUploading ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-400'
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".doc,.docx,.pdf"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {isUploading ? (
                        <div className="space-y-4">
                          <Loader2 className="h-12 w-12 mx-auto animate-spin text-red-600" />
                          <p className="text-sm text-muted-foreground">正在上传并分析文档...</p>
                          <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">点击上传文档</p>
                            <p className="text-sm text-muted-foreground">支持 .doc, .docx, .pdf 格式</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="p-3 bg-green-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm">{uploadedFile}</span>
                      </div>
                      <Badge className="bg-green-600">已上传</Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>选择模板风格</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {templateStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            selectedStyle === style.id 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <div className={`w-8 h-8 mx-auto rounded-full ${style.color} mb-2`} />
                          <span className="text-xs">{style.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-orange-500"
                    onClick={handleAutoLayout}
                    disabled={!uploadedFile}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI一键排版
                  </Button>
                </CardContent>
              </Card>

              {/* Preview Section */}
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-orange-600" />
                    排版预览
                  </CardTitle>
                  <CardDescription>实时预览排版效果，支持自定义调整</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white min-h-[400px]">
                    {uploadedFile ? (
                      <div className="space-y-4">
                        <div className="text-center mb-6">
                          <Badge className="bg-red-600 mb-2">政务要闻</Badge>
                          <h2 className="text-xl font-bold">XX单位2024年度工作总结</h2>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="leading-relaxed">
                            2024年，在上级党委的正确领导下，我单位坚持以习近平新时代中国特色社会主义思想为指导...
                          </p>
                          <div className="border-l-4 border-red-500 pl-4 my-4">
                            <p className="text-orange-700 font-medium">一、主要工作成效</p>
                          </div>
                          <p className="leading-relaxed">（一）强化理论武装，提升政治站位...</p>
                        </div>
                        <div className="mt-6 pt-4 border-t flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Type className="h-4 w-4 mr-1" />
                            调整字体
                          </Button>
                          <Button size="sm" variant="outline">
                            <Palette className="h-4 w-4 mr-1" />
                            更换配色
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Layout className="h-12 w-12 mb-4 text-gray-300" />
                        <p>上传文档后查看预览</p>
                      </div>
                    )}
                  </div>

                  {uploadedFile && (
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        导出图片
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        分享
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SVG编辑器 Tab */}
          <TabsContent value="svg">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* 模板选择 */}
              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg">SVG交互模板</CardTitle>
                  <CardDescription>选择适合的一图流模板</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {svgTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedTemplate === template.id 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg bg-gradient-to-r ${template.color} mb-2`} />
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.desc}</div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* 编辑器 */}
              <Card className="lg:col-span-2 border-red-100">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MousePointer className="h-5 w-5 mr-2 text-red-600" />
                    交互设计编辑器
                  </CardTitle>
                  <CardDescription>自定义内容并生成SVG一图流</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>主标题</Label>
                      <Input 
                        value={svgTitle} 
                        onChange={(e) => setSvgTitle(e.target.value)}
                        placeholder="输入主标题"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>副标题</Label>
                      <Input 
                        value={svgSubtitle} 
                        onChange={(e) => setSvgSubtitle(e.target.value)}
                        placeholder="输入副标题"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>要点内容（每行一个）</Label>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                      value={svgPoints}
                      onChange={(e) => setSvgPoints(e.target.value)}
                      placeholder="要点一&#10;要点二&#10;要点三"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>主题颜色</Label>
                    <div className="flex gap-2">
                      {[
                        { id: 'red', color: 'bg-red-600' },
                        { id: 'blue', color: 'bg-blue-600' },
                        { id: 'orange', color: 'bg-orange-500' },
                        { id: 'green', color: 'bg-green-500' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSvgColor(c.id)}
                          className={`w-10 h-10 rounded-full ${c.color} border-2 ${
                            svgColor === c.id ? 'border-gray-900' : 'border-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-red-600 to-orange-500">
                    <Wand2 className="h-4 w-4 mr-2" />
                    生成SVG
                  </Button>

                  {/* SVG预览 */}
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <Label>SVG预览</Label>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    </div>
                    <div 
                      className="bg-gray-100 rounded-lg p-4 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: generateSvgCode() }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 数据可视化 Tab */}
          <TabsContent value="chart">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chart Types */}
              <div className="lg:col-span-1">
                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle className="text-lg">图表类型</CardTitle>
                    <CardDescription>选择适合的图表类型</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {chartTypes.map((chart) => {
                      const Icon = chart.icon;
                      return (
                        <button
                          key={chart.id}
                          className="w-full p-3 rounded-lg border hover:border-red-400 hover:bg-red-50 transition-all flex items-center gap-3 text-left"
                        >
                          <Icon className="h-8 w-8 text-red-600" />
                          <div>
                            <div className="font-medium">{chart.name}</div>
                            <div className="text-xs text-muted-foreground">{chart.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Data Input */}
              <div className="lg:col-span-2">
                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
                      数据可视化中心
                    </CardTitle>
                    <CardDescription>输入数据或描述需求，AI自动生成精美图表</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>输入数据</Label>
                      <p className="text-sm text-muted-foreground">
                        支持直接粘贴Excel数据、CSV格式，或用自然语言描述图表需求
                      </p>
                      <textarea
                        className="w-full min-h-[120px] p-3 border rounded-lg text-sm"
                        placeholder={`示例数据格式：\n2024年一季度 | 完成率\n一月 | 85%\n二月 | 92%\n三月 | 88%`}
                        value={chartData}
                        onChange={(e) => setChartData(e.target.value)}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>图表标题</Label>
                        <Input placeholder="例如：年度工作完成情况" />
                      </div>
                      <div className="space-y-2">
                        <Label>颜色主题</Label>
                        <Select defaultValue="official">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="official">政务红</SelectItem>
                            <SelectItem value="blue">科技蓝</SelectItem>
                            <SelectItem value="green">清新绿</SelectItem>
                            <SelectItem value="gradient">渐变</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-red-600 to-orange-500"
                      onClick={handleGenerateChart}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      生成图表
                    </Button>

                    {/* Chart Preview */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg min-h-[200px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>图表将在此预览</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        下载PNG
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        下载SVG
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 多平台分发 */}
        <Card className="mt-8 border-red-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Share2 className="h-5 w-5 mr-2 text-red-600" />
              多平台分发助手
            </CardTitle>
            <CardDescription>一键同步内容至多个新媒体平台</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div 
                    key={platform.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      platform.connected 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="h-8 w-8 text-gray-600" />
                      {platform.connected ? (
                        <Badge className="bg-green-600">已连接</Badge>
                      ) : (
                        <Badge variant="outline">未连接</Badge>
                      )}
                    </div>
                    <div className="font-medium mb-1">{platform.name}</div>
                    {!platform.connected && (
                      <Button size="sm" variant="outline" className="w-full">
                        授权连接
                      </Button>
                    )}
                    {platform.connected && (
                      <p className="text-xs text-muted-foreground">最近同步: 2小时前</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">快速发布</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input placeholder="输入要发布的内容摘要..." />
                </div>
                <Select defaultValue="wechat">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wechat">微信公众号</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-to-r from-red-600 to-orange-500">
                  <Share2 className="h-4 w-4 mr-2" />
                  一键发布
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
