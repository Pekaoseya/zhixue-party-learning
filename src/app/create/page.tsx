'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  PenTool, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  CheckCheck,
  Wand2,
  Lightbulb,
  FileText,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const documentTypes = [
  { value: 'work-summary', label: '工作总结' },
  { value: 'leader-speech', label: '领导讲话' },
  { value: 'news-release', label: '新闻通稿' },
  { value: 'research-report', label: '调研报告' },
  { value: 'party-building', label: '党建材料' },
  { value: 'meeting-minutes', label: '会议纪要' },
  { value: 'notice', label: '通知公告' },
  { value: 'study-report', label: '学习心得' },
];

const toneOptions = [
  { value: 'formal', label: '正式庄重' },
  { value: 'warm', label: '温暖亲切' },
  { value: 'energetic', label: '振奋有力' },
  { value: 'pragmatic', label: '务实求真' },
];

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [documentType, setDocumentType] = useState('work-summary');
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState('formal');
  const [length, setLength] = useState([1500]);
  const [creativity, setCreativity] = useState([0.7]);
  
  const [reviewText, setReviewText] = useState('');
  const [inspireContext, setInspireContext] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('请输入写作主题');
      return;
    }
    if (!keyPoints.trim()) {
      toast.error('请输入核心要点');
      return;
    }

    setIsLoading(true);
    setCurrentResponse('');
    
    const userMessage = `## 写作要求
- **文档类型**: ${documentTypes.find(t => t.value === documentType)?.label}
- **写作主题**: ${topic}
- **核心要点**: ${keyPoints}
- **文风语调**: ${tone === 'formal' ? '正式庄重' : tone === 'warm' ? '温暖亲切' : tone === 'energetic' ? '振奋有力' : '务实求真'}
- **预期字数**: 约 ${length[0]} 字`;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'assistant',
          messages: [
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) throw new Error('生成失败');

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
                setCurrentResponse(fullContent);
              }
              if (data.done) break;
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
    } catch (error) {
      toast.error('生成失败，请稍后重试');
      console.error(error);
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  };

  const handleReview = async () => {
    if (!reviewText.trim()) {
      toast.error('请输入需要校对的文稿');
      return;
    }

    setIsLoading(true);
    setCurrentResponse('');

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'review',
          messages: [
            { role: 'user', content: `请校对并润色以下文稿：\n\n${reviewText}` }
          ]
        })
      });

      if (!response.ok) throw new Error('校对失败');

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
                setCurrentResponse(fullContent);
              }
              if (data.done) break;
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
    } catch (error) {
      toast.error('校对失败，请稍后重试');
      console.error(error);
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  };

  const handleInspire = async () => {
    if (!inspireContext.trim()) {
      toast.error('请输入写作上下文');
      return;
    }

    setIsLoading(true);
    setCurrentResponse('');

    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inspire',
          messages: [
            { role: 'user', content: inspireContext }
          ]
        })
      });

      if (!response.ok) throw new Error('获取灵感失败');

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
                setCurrentResponse(fullContent);
              }
              if (data.done) break;
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
    } catch (error) {
      toast.error('获取灵感失败，请稍后重试');
      console.error(error);
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  };

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success('已复制到剪贴板');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setTopic('');
    setKeyPoints('');
    setReviewText('');
    setInspireContext('');
    setMessages([]);
    setCurrentResponse('');
    toast.success('已清空');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            智能创作
          </h1>
          <p className="text-muted-foreground">
            AI赋能高效产出，让公文写作更专业、更规范
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Tools */}
          <div className="lg:col-span-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="assistant" className="text-xs sm:text-sm">
                  <PenTool className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">AI助手</span>
                </TabsTrigger>
                <TabsTrigger value="review" className="text-xs sm:text-sm">
                  <CheckCheck className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">校对</span>
                </TabsTrigger>
                <TabsTrigger value="inspire" className="text-xs sm:text-sm">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">灵感</span>
                </TabsTrigger>
              </TabsList>

              {/* AI Assistant */}
              <TabsContent value="assistant">
                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-red-600" />
                      AI公文助手
                    </CardTitle>
                    <CardDescription>输入写作主题和要求，AI自动生成初稿</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>文档类型</Label>
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>写作主题</Label>
                      <Input 
                        placeholder="例如：2024年度党建工作总结" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>核心要点</Label>
                      <Textarea 
                        placeholder="请列出文稿需要涵盖的主要内容和重点..." 
                        className="min-h-[100px]"
                        value={keyPoints}
                        onChange={(e) => setKeyPoints(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>文风语调</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>预期字数：{length[0]} 字</Label>
                      <Slider 
                        value={length} 
                        onValueChange={setLength}
                        min={500}
                        max={5000}
                        step={100}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>创意程度：{Math.round(creativity[0] * 100)}%</Label>
                      <Slider 
                        value={creativity} 
                        onValueChange={setCreativity}
                        min={0.3}
                        max={1}
                        step={0.1}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>保守规范</span>
                        <span>丰富多样</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-500"
                        onClick={handleGenerate}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            立即生成
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleReset}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Review */}
              <TabsContent value="review">
                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CheckCheck className="h-5 w-5 mr-2 text-orange-600" />
                      智能校对润色
                    </CardTitle>
                    <CardDescription>自动检查错别字、语法错误，规范政治术语</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>待校对文稿</Label>
                      <Textarea 
                        placeholder="请粘贴需要校对的文稿内容..." 
                        className="min-h-[200px]"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-500"
                      onClick={handleReview}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          校对中...
                        </>
                      ) : (
                        <>
                          <CheckCheck className="h-4 w-4 mr-2" />
                          开始校对
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inspire */}
              <TabsContent value="inspire">
                <Card className="border-red-100">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                      灵感激发器
                    </CardTitle>
                    <CardDescription>当写作思路受阻时，获取相关金句、案例和建议</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>当前写作上下文</Label>
                      <Textarea 
                        placeholder="描述您当前正在撰写的内容或遇到的问题..." 
                        className="min-h-[150px]"
                        value={inspireContext}
                        onChange={(e) => setInspireContext(e.target.value)}
                      />
                    </div>

                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>提示：</strong>您可以描述当前文稿的主题、遇到的困难，或者说明需要哪方面的帮助
                      </p>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-500"
                      onClick={handleInspire}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          获取灵感中...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="h-4 w-4 mr-2" />
                          获取灵感
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Quick Templates */}
            <Card className="mt-4 border-red-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">快速模板</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: '两会宣传方案', icon: FileText },
                    { name: '主题教育简报', icon: FileText },
                    { name: '年终总结框架', icon: FileText },
                  ].map((template) => (
                    <Button 
                      key={template.name} 
                      variant="outline" 
                      className="w-full justify-start text-sm border-red-100"
                      onClick={() => {
                        setTopic(template.name);
                        setActiveTab('assistant');
                      }}
                    >
                      <template.icon className="h-4 w-4 mr-2" />
                      {template.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Output */}
          <div className="lg:col-span-2">
            <Card className="border-red-100 h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">生成结果</CardTitle>
                  <CardDescription>AI生成的内容将显示在这里</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-red-200">
                    <FileText className="h-4 w-4 mr-1" />
                    导出
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-200">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    重新生成
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                {messages.length === 0 && !currentResponse ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Sparkles className="h-12 w-12 mb-4 text-red-300" />
                    <p>填写左侧信息，点击生成按钮</p>
                    <p className="text-sm">AI将根据您的要求生成专业的公文初稿</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[85%] rounded-lg p-4 ${
                            message.role === 'user' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={message.role === 'user' ? 'border-white text-white' : ''}>
                              {message.role === 'user' ? '您' : 'AI助手'}
                            </Badge>
                            {message.role === 'assistant' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleCopy(message.content, index)}
                              >
                                {copiedIndex === index ? (
                                  <CheckCheck className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {currentResponse && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-lg p-4 bg-gray-100">
                          <div className="flex items-center mb-2">
                            <Badge variant="outline">AI助手</Badge>
                            <span className="ml-2 flex items-center text-sm text-muted-foreground">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              生成中...
                            </span>
                          </div>
                          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {currentResponse}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
