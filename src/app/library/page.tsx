import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  Search,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  Filter
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

const newsSources = [
  { name: '学习强国', count: 12580, color: 'bg-red-600' },
  { name: '人民日报', count: 8960, color: 'bg-orange-500' },
  { name: '求是网', count: 4520, color: 'bg-amber-600' },
  { name: '共产党员网', count: 3280, color: 'bg-yellow-500' },
];

const latestNews = [
  {
    id: 1,
    title: '习近平在学习贯彻习近平新时代中国特色社会主义思想主题教育工作会议上发表重要讲话',
    source: '学习强国',
    date: '2小时前',
    category: '重要讲话',
    hot: true,
  },
  {
    id: 2,
    title: '人民日报评论员：扎实推进高质量发展 奋力实现一季度经济开门红',
    source: '人民日报',
    date: '4小时前',
    category: '经济观察',
    hot: true,
  },
  {
    id: 3,
    title: '求是杂志发表习近平总书记重要文章《坚持和发展中国特色社会主义要一以贯之》',
    source: '求是网',
    date: '6小时前',
    category: '理论学习',
    hot: false,
  },
  {
    id: 4,
    title: '中组部召开基层党建工作重点任务推进会',
    source: '共产党员网',
    date: '8小时前',
    category: '党建工作',
    hot: false,
  },
  {
    id: 5,
    title: '国务院办公厅关于加强数字政府建设的指导意见',
    source: '人民日报',
    date: '1天前',
    category: '政策解读',
    hot: false,
  },
  {
    id: 6,
    title: '党的二十大报告学习辅导百问',
    source: '学习强国',
    date: '1天前',
    category: '理论学习',
    hot: false,
  },
];

const sampleArticles = [
  {
    id: 1,
    title: '2024年政府工作报告全文',
    type: '工作报告',
    author: '国务院',
    date: '2024-03-05',
    views: 125600,
    downloads: 8960,
  },
  {
    id: 2,
    title: '党委书记在党建工作会议上的讲话',
    type: '领导讲话',
    author: '某央企党委',
    date: '2024-02-28',
    views: 89600,
    downloads: 5680,
  },
  {
    id: 3,
    title: '关于加强和改进思想政治工作的调研报告',
    type: '调研报告',
    author: '某省宣传部',
    date: '2024-02-20',
    views: 72800,
    downloads: 4520,
  },
  {
    id: 4,
    title: '党风廉政建设半年工作总结',
    type: '工作总结',
    author: '某市纪委',
    date: '2024-02-15',
    views: 65400,
    downloads: 3890,
  },
  {
    id: 5,
    title: '党支部标准化规范化建设实施方案',
    type: '党建材料',
    author: '某国企党支部',
    date: '2024-02-10',
    views: 58200,
    downloads: 3250,
  },
];

const categories = [
  '全部', '重要讲话', '工作报告', '调研报告', '党建材料', '领导讲话', '学习心得', '制度文件'
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            权威智库
          </h1>
          <p className="text-muted-foreground">
            整合权威信息源，为您的写作提供坚实的理论支撑和丰富的素材积累
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 border-red-100">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索权威资讯、精品范文、政策文件..." 
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="来源" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部来源</SelectItem>
                    <SelectItem value="xxqg">学习强国</SelectItem>
                    <SelectItem value="rmrb">人民日报</SelectItem>
                    <SelectItem value="qs">求是网</SelectItem>
                    <SelectItem value="gcd">共产党员网</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="latest">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="排序" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">最新</SelectItem>
                    <SelectItem value="hot">最热</SelectItem>
                    <SelectItem value="related">相关度</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-gradient-to-r from-red-600 to-orange-500">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">权威来源</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newsSources.map((source) => (
              <Link key={source.name} href={`/library/news?source=${source.name}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-red-100 hover:border-red-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${source.color} flex items-center justify-center`}>
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{source.name}</div>
                        <div className="text-sm text-muted-foreground">{source.count.toLocaleString()} 篇</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="news" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="news">权威资讯</TabsTrigger>
            <TabsTrigger value="articles">精品范文</TabsTrigger>
            <TabsTrigger value="tools">理论溯源</TabsTrigger>
          </TabsList>

          {/* News Tab */}
          <TabsContent value="news">
            <div className="mb-4">
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Badge 
                    key={cat} 
                    variant={cat === '全部' ? 'default' : 'outline'}
                    className={cat === '全部' ? 'bg-red-600' : ''}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {latestNews.map((news) => (
                <Card key={news.id} className="hover:shadow-md transition-all border-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{news.source}</Badge>
                          <Badge variant="secondary" className="text-xs">{news.category}</Badge>
                          {news.hot && (
                            <Badge className="text-xs bg-orange-100 text-orange-700">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              热门
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold mb-2 hover:text-red-600 cursor-pointer">
                          {news.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {news.date}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" className="border-red-200 text-red-700">
                加载更多
              </Button>
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <div className="space-y-4">
              {sampleArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-all border-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-red-100 text-red-700">{article.type}</Badge>
                        </div>
                        <h3 className="font-semibold mb-2 hover:text-red-600 cursor-pointer">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.author}</span>
                          <span>{article.date}</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {article.views.toLocaleString()}
                          </span>
                          <span>{article.downloads.toLocaleString()} 下载</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-red-200">
                          预览
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-red-600 to-orange-500">
                          下载
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" className="border-red-200 text-red-700">
                查看更多范文
              </Button>
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools">
            <Card className="border-red-100">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Noto Serif SC, serif' }}>理论溯源工具</CardTitle>
                <CardDescription>
                  查询名句、典故、政治术语的出处和用法示例
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="输入要溯源的内容，如：不忘初心、两个确立、国之大者..." 
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4 mt-6">
                    <Card className="border-dashed">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-red-600" />
                        <div className="font-medium">名言警句</div>
                        <div className="text-sm text-muted-foreground">查找经典引用的出处</div>
                      </CardContent>
                    </Card>
                    <Card className="border-dashed">
                      <CardContent className="p-4 text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <div className="font-medium">典故溯源</div>
                        <div className="text-sm text-muted-foreground">了解历史典故的背景</div>
                      </CardContent>
                    </Card>
                    <Card className="border-dashed">
                      <CardContent className="p-4 text-center">
                        <Filter className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                        <div className="font-medium">术语解读</div>
                        <div className="text-sm text-muted-foreground">规范政治术语用法</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold mb-2">热门溯源词条</h4>
                    <div className="flex flex-wrap gap-2">
                      {['不忘初心', '牢记使命', '两个维护', '四个自信', '五位一体', '国之大者', '两个一百年'].map((term) => (
                        <Badge 
                          key={term} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-red-100"
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
