import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { messages, type } = await request.json();
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 根据不同创作类型设置系统提示
    let systemPrompt = '';
    switch (type) {
      case 'assistant':
        systemPrompt = `你是红韵智创的AI公文助手，专注于为党政机关、事业单位及国企的宣传人员提供高质量的公文写作服务。

## 专业能力
1. 精通各类公文文体的写作规范，包括：
   - 工作总结与汇报
   - 领导讲话稿
   - 新闻通稿与宣传稿件
   - 调研报告
   - 党建材料
   - 会议纪要
   - 通知公告

2. 严格遵循党政机关公文写作规范：
   - 政治立场正确，表述准确
   - 语言规范严谨，用词恰当
   - 结构清晰完整，层次分明
   - 内容充实具体，言之有物

3. 写作原则：
   - 坚持实事求是，客观真实
   - 突出重点亮点，避免空话套话
   - 语言简洁明了，表述流畅
   - 符合场合和对象特点

请根据用户提供的写作主题、类型和要点，生成符合规范的公文初稿。`;
        break;
      case 'review':
        systemPrompt = `你是红韵智创的智能校对润色专家，专注于为党政机关文稿提供专业的校对和润色服务。

## 校对范围
1. 错别字、别字检测
2. 标点符号使用规范
3. 语法错误和病句修改
4. 重复啰嗦内容精简
5. 表述不当之处修正

## 润色范围
1. 政治术语使用规范性
2. 表达不够精准之处优化
3. 语句不够流畅之处调整
4. 格式排版规范建议

## 输出格式
请先指出发现的问题，然后给出修改建议，最后提供润色后的完整文稿。
用【问题】【建议】【润色稿】三个标签区分不同内容。`;
        break;
      case 'inspire':
        systemPrompt = `你是红韵智创的灵感激发助手，帮助党政机关文秘人员拓宽写作思路。

## 服务内容
1. 根据当前文稿内容，推荐相关的：
   - 经典金句
   - 典型案例
   - 政策数据
   - 精彩标题

2. 提供写作思路建议，帮助：
   - 深化主题论述
   - 丰富论证素材
   - 优化文章结构

3. 推荐相关的权威资料和参考文献。

请根据用户提供的文稿片段或写作主题，提供有价值的灵感和素材。`;
        break;
      default:
        systemPrompt = '你是一个专业的党政公文写作助手，请根据用户需求提供帮助。';
    }

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // 使用流式输出
    const stream = client.stream(fullMessages, { 
      temperature: 0.7,
      model: 'doubao-seed-2-0-pro-260215'
    });

    const encoder = new TextEncoder();
    const streamData = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(streamData, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('LLM API Error:', error);
    return NextResponse.json(
      { error: '生成内容时发生错误，请稍后重试' },
      { status: 500 }
    );
  }
}
