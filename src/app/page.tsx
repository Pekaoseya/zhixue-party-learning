import Link from 'next/link';
import { 
  BookOpen, 
  PenTool, 
  Share2, 
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: BookOpen,
    title: '权威智库',
    description: '整合学习强国、人民日报、求是网等权威资源，为写作提供坚实的理论支撑',
    href: '/library',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    icon: PenTool,
    title: '智能创作',
    description: 'AI公文助手快速生成初稿，智能校对润色确保文字精准规范',
    href: '/create',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    icon: Share2,
    title: '新媒体赋能',
    description: '一键排版、数据可视化、多平台分发，让政务宣传更高效',
    href: '/media',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
];

const scenarios = [
  { name: '两会宣传', count: '2,580+' },
  { name: '主题教育', count: '4,120+' },
  { name: '年终总结', count: '6,350+' },
  { name: '领导讲话', count: '3,890+' },
  { name: '调研报告', count: '2,150+' },
  { name: '党建材料', count: '5,670+' },
];

const testimonials = [
  {
    name: '张书记',
    role: '某市直机关宣传部主任',
    content: '红韵智创让我们的公文写作效率提升了3倍，AI生成的内容既规范又有深度。',
    avatar: '张',
  },
  {
    name: '李处长',
    role: '国有企业党群工作部',
    content: '精品范文库太实用了，找材料再也不用东奔西走，一个平台全搞定。',
    avatar: '李',
  },
  {
    name: '王秘书',
    role: '区委办公室',
    content: '智能校对功能帮我避免了很多低级错误，领导对我写的材料越来越满意了。',
    avatar: '王',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-red-100 text-red-700 hover:bg-red-100">
              <Sparkles className="mr-1 h-3 w-3" />
              党政内容创作者专属平台
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                红韵智创
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl mt-2 block">
                党政内容创作者的智能助手
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              集权威学习、智能创作、新媒体赋能于一体，为党政机关、事业单位及国企的宣传人员提供从理论学习到内容产出、再到多平台分发的全流程解决方案。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-lg shadow-red-500/25">
                立即开始创作
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-red-200 text-red-700 hover:bg-red-50">
                观看演示视频
              </Button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { label: '注册用户', value: '50,000+' },
                { label: '服务单位', value: '3,200+' },
                { label: 'AI生成文稿', value: '1,200,000+' },
                { label: '满意度', value: '99.5%' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              三大核心模块，全流程赋能
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              从&quot;学&quot;到&quot;创&quot;再到&quot;用&quot;，红韵智创覆盖党政内容创作的完整生命周期
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-red-100">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                        {feature.title}
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center text-sm font-medium text-red-600">
                        了解更多
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-red-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              覆盖各类工作场景
            </h2>
            <p className="text-muted-foreground">
              针对党政机关常见工作场景，提供一站式解决方案
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {scenarios.map((scenario) => (
              <div 
                key={scenario.name}
                className="bg-white rounded-xl p-4 text-center border border-red-100 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-lg font-semibold text-gray-900 mb-1">{scenario.name}</div>
                <div className="text-sm text-red-600">{scenario.count} 篇</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                为什么选择红韵智创？
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: '安全合规', desc: '所有AI生成内容经过严格合规性过滤，符合政务宣传要求' },
                  { icon: Zap, title: '高效便捷', desc: '一键生成、智能校对、多平台分发，大幅提升工作效率' },
                  { icon: Star, title: '权威资源', desc: '整合学习强国、人民日报等官方权威资源' },
                  { icon: Users, title: '社群互助', desc: '用户交流社区，分享心得，定期专家培训' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                限时免费体验
              </h3>
              <ul className="space-y-3 mb-6">
                {[
                  '7天全功能免费试用',
                  'AI公文助手无限次使用',
                  '精品范文库全站畅读',
                  '专业客服一对一指导',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="secondary" className="w-full bg-white text-red-600 hover:bg-gray-100">
                立即领取
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-red-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              用户真实反馈
            </h2>
            <p className="text-muted-foreground">
              听听党政工作者怎么说
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <Card key={item.name} className="border-red-100">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&ldquo;{item.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                      {item.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            开启智能创作之旅
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            加入红韵智创，让AI成为您的得力助手，创作更高效、内容更规范
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              免费注册
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              联系我们
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
