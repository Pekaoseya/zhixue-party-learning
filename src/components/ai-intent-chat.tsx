'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { analyzeIntent } from '@/lib/knowledge-graph';
import { Sparkles, Send, Bot, User, Lightbulb, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  keywords?: string[];
  suggestedPath?: string;
}

interface AIIntentChatProps {
  onIntentDetected?: (keywords: string[], path: string) => void;
}

export function AIIntentChat({ onIntentDetected }: AIIntentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是您的智能学习助手。请告诉我您想学习什么内容，例如："我想学习发展党员的流程"或"二十大精神有哪些要点"'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // 模拟AI分析延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 分析用户意图
    const result = analyzeIntent(userMessage.content);
    
    let response: Message;
    
    if (result.keywords.length > 0) {
      response = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `我理解了！您的需求涉及以下关键词：${result.keywords.join('、')}。让我为您推荐相关学习内容。`,
        keywords: result.keywords,
        suggestedPath: result.matchedPath
      };
    } else {
      response = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，我目前对这个问题还不够了解。您可以尝试询问以下话题：\n• 入党流程\n• 二十大精神\n• 乡村振兴政策\n• 党史学习\n• 基层党务工作'
      };
    }
    
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
    
    // 触发意图检测回调
    if (result.keywords.length > 0) {
      onIntentDetected?.(result.keywords, result.matchedPath);
    }
  };

  const quickQuestions = [
    '如何发展党员？',
    '二十大报告要点',
    '乡村振兴战略',
    '党支部工作实务'
  ];

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-blue-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">智能学习助手</h3>
            <p className="text-xs text-white/70">AI驱动 · 精准匹配</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-0">
        {/* 消息区域 */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-blue-500' : 'bg-slate-700'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-800 text-slate-100'
                    }`}>
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                      ))}
                    </div>
                    
                    {/* 关键词标签 */}
                    {message.keywords && message.keywords.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-wrap gap-2"
                      >
                        {message.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                          >
                            <Lightbulb className="w-3 h-3" />
                            {kw}
                          </span>
                        ))}
                      </motion.div>
                    )}
                    
                    {/* 推荐路径 */}
                    {message.suggestedPath && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => onIntentDetected?.(message.keywords || [], message.suggestedPath || '')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full text-white text-sm hover:opacity-90 transition-opacity"
                      >
                        <Sparkles className="w-4 h-4" />
                        查看推荐学习路径
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-slate-400"
            >
              <Bot className="w-5 h-5" />
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* 快捷问题 */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        
        {/* 输入区域 */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入您想学习的内容..."
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
