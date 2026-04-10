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
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
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

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('layout');
  const [selectedStyle, setSelectedStyle] = useState('formal');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [chartData, setChartData] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFile(null);

    // 模拟上传进度
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
          <TabsList className="mb-6 grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4 mr-2" />
              政务排版
            </TabsTrigger>
            <TabsTrigger value="chart">
              <BarChart3 className="h-4 w-4 mr-2" />
              数据可视化
            </TabsTrigger>
            <TabsTrigger value="distribute">
              <Share2 className="h-4 w-4 mr-2" />
              多平台分发
            </TabsTrigger>
          </TabsList>

          {/* Layout Tab */}
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
                        {/* Mock preview */}
                        <div className="text-center mb-6">
                          <Badge className="bg-red-600 mb-2">政务要闻</Badge>
                          <h2 className="text-xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                            XX单位2024年度工作总结
                          </h2>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="leading-relaxed">
                            2024年，在上级党委的正确领导下，我单位坚持以习近平新时代中国特色社会主义思想为指导...
                          </p>
                          <div className="border-l-4 border-red-500 pl-4 my-4">
                            <p className="text-orange-700 font-medium">
                              一、主要工作成效
                            </p>
                          </div>
                          <p className="leading-relaxed">
                            （一）强化理论武装，提升政治站位...
                          </p>
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

          {/* Chart Tab */}
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
                        placeholder={`示例数据格式：
2024年一季度 | 完成率
一月 | 85%
二月 | 92%
三月 | 88%`}
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

          {/* Distribute Tab */}
          <TabsContent value="distribute">
            <Card className="border-red-100">
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
                  <h3 className="font-semibold mb-4">发布设置</h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>发布平台</Label>
                      <Select defaultValue="wechat">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wechat">微信公众号</SelectItem>
                          <SelectItem value="all" disabled>全部平台 (敬请期待)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>发布时机</Label>
                      <Select defaultValue="now">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="now">立即发布</SelectItem>
                          <SelectItem value="schedule">定时发布</SelectItem>
                          <SelectItem value="draft">存为草稿</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">待发布内容</p>
                        <p className="text-sm text-amber-700">XX单位2024年度工作总结</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-red-600 to-orange-500">
                    <Share2 className="h-4 w-4 mr-2" />
                    一键发布至微信公众号
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Tools */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            快捷工具箱
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'SVG交互编辑器', desc: '制作动态宣传品', icon: Grid3X3 },
              { name: '一键长转短', desc: '公文转短视频脚本', icon: FileText },
              { name: '标题生成器', desc: '生成吸引人的标题', icon: Type },
              { name: '封面生成器', desc: 'AI智能生成封面', icon: Image },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.name} className="hover:shadow-lg transition-all cursor-pointer border-red-100">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">{tool.desc}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
