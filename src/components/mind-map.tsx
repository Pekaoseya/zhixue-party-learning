'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { KnowledgeNode, LearningProgress } from '@/lib/types';
import { motion } from 'framer-motion';
import { Play, BookOpen, Circle, Target } from 'lucide-react';

interface MindMapProps {
  data: KnowledgeNode;
  progress?: LearningProgress[];
  onNodeClick?: (node: KnowledgeNode) => void;
  highlightedNodes?: string[];
  interactive?: boolean;
}

interface TreeNode extends d3.HierarchyPointNode<KnowledgeNode> {
  x0?: number;
  y0?: number;
}

export function MindMap({ data, progress = [], onNodeClick, highlightedNodes = [], interactive = true }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  // 响应式尺寸
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 获取节点状态
  const getNodeStatus = useCallback((nodeId: string) => {
    const prog = progress.find(p => p.nodeId === nodeId);
    if (prog) return prog.status;
    if (highlightedNodes.includes(nodeId)) return 'available';
    return 'locked';
  }, [progress, highlightedNodes]);

  // 渲染思维导图
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 80, right: 250, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 创建主容器
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 仅在交互模式下启用缩放行为
    if (interactive) {
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 2])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom);
    }

    // 创建树布局 - 水平方向
    const treeLayout = d3.tree<KnowledgeNode>()
      .size([innerHeight, innerWidth])
      .separation((a, b) => {
        // 检查是否为末尾节点（叶子节点）
        const isLeafA = !a.children || a.children.length === 0;
        const isLeafB = !b.children || b.children.length === 0;
        
        // 如果都是末尾节点且是兄弟节点，设置更大的间隔
        if (a.parent === b.parent && isLeafA && isLeafB) {
          return 2.2; // 末尾节点的间隔
        }
        // 兄弟节点的间隔
        if (a.parent === b.parent) {
          return 1.8;
        }
        // 非兄弟节点的间隔
        return 2.5;
      });

    // 创建层级数据
    const root = d3.hierarchy(data, d => d.children);
    const treeData = treeLayout(root);

    // 计算节点尺寸
    const getNodeWidth = (level: number) => {
      if (level === 0) return 140;
      if (level === 1) return 130;
      return 120;
    };
    
    // 动态计算节点高度，根据可用空间调整
    const getNodeHeight = (level: number) => {
      // 基础高度
      let baseHeight = 0;
      if (level === 0) baseHeight = 60;
      else if (level === 1) baseHeight = 50;
      else baseHeight = 44;
      
      // 根据可用高度调整节点高度，避免叠加
      const nodeCount = treeData.descendants().length;
      const estimatedHeightPerNode = innerHeight / (nodeCount * 0.8); // 预留20%空间
      
      // 确保节点高度不小于最小高度，同时不超过基础高度
      const minHeight = 30; // 最小节点高度
      const adjustedHeight = Math.min(baseHeight, Math.max(minHeight, estimatedHeightPerNode));
      
      return adjustedHeight;
    };

    // 绘制连接线（贝塞尔曲线）
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        const sourceX = (d.source as TreeNode).y;
        const sourceY = (d.source as TreeNode).x;
        const targetX = (d.target as TreeNode).y;
        const targetY = (d.target as TreeNode).x;
        const sourceNodeWidth = getNodeWidth((d.source.data as KnowledgeNode).level);
        
        return `M${sourceX + sourceNodeWidth},${sourceY}
                C${(sourceX + sourceNodeWidth + targetX) / 2},${sourceY}
                 ${(sourceX + sourceNodeWidth + targetX) / 2},${targetY}
                 ${targetX},${targetY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', d => {
        const sourceId = (d.source.data as KnowledgeNode).id;
        const targetId = (d.target.data as KnowledgeNode).id;
        const sourceStatus = getNodeStatus(sourceId);
        const targetStatus = getNodeStatus(targetId);
        if (sourceStatus === 'completed' && targetStatus !== 'locked') return '#22c55e';
        if (sourceStatus === 'completed' || targetStatus === 'available') return '#3b82f6';
        return '#e2e8f0';
      })
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.7);

    // 绘制节点组
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('pointer-events', 'all')
      .attr('transform', d => {
        const nodeHeight = getNodeHeight((d.data as KnowledgeNode).level);
        return `translate(${d.y},${d.x - nodeHeight / 2})`;
      })
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        const nodeData = d.data as KnowledgeNode;
        setSelectedNode(nodeData);
        onNodeClick?.(nodeData);
      });

    // 节点矩形背景
    nodes.append('rect')
      .attr('width', d => getNodeWidth((d.data as KnowledgeNode).level))
      .attr('height', d => getNodeHeight((d.data as KnowledgeNode).level))
      .attr('rx', d => (d.data as KnowledgeNode).level === 0 ? 12 : 8)
      .attr('fill', d => {
        const status = getNodeStatus((d.data as KnowledgeNode).id);
        const level = (d.data as KnowledgeNode).level;
        // 所有节点都有实心背景色
        if (level === 0) return '#991b1b'; // 根节点用最深红色
        if (level === 1) return '#b91c1c'; // 一级节点用深红色
        if (status === 'completed') return '#16a34a';
        if (status === 'available') return '#2563eb';
        if (status === 'in_progress') return '#d97706';
        return '#1e293b'; // locked 状态使用深蓝灰色，完全不透明
      })
      .attr('stroke', d => {
        const status = getNodeStatus((d.data as KnowledgeNode).id);
        const level = (d.data as KnowledgeNode).level;
        // 所有节点都有边框
        if (level === 0) return 'rgba(255,255,255,0.4)';
        if (level === 1) return 'rgba(255,255,255,0.5)';
        if (status === 'available') return '#60a5fa';
        if (status === 'in_progress') return '#fbbf24';
        if (status === 'completed') return '#4ade80';
        return 'rgba(255,255,255,0.6)'; // locked 节点边框更明显
      })
      .attr('stroke-width', d => (d.data as KnowledgeNode).level < 2 ? 3 : 2)
      .attr('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25))');

    // 节点文字（带阴影确保可读性）
    nodes.append('text')
      .attr('x', d => getNodeWidth((d.data as KnowledgeNode).level) / 2)
      .attr('y', d => getNodeHeight((d.data as KnowledgeNode).level) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', d => {
        const level = (d.data as KnowledgeNode).level;
        return level === 0 ? '15px' : level === 1 ? '13px' : '12px';
      })
      .attr('font-weight', d => (d.data as KnowledgeNode).level <= 1 ? 'bold' : '500')
      .attr('fill', '#ffffff')
      .attr('style', 'text-shadow: 0 1px 2px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)')
      .each(function(d) {
        const nodeWidth = getNodeWidth((d.data as KnowledgeNode).level);
        const text = (d.data as KnowledgeNode).name;
        const fontSize = (d.data as KnowledgeNode).level === 0 ? 15 : (d.data as KnowledgeNode).level === 1 ? 13 : 12;
        const maxChars = Math.floor(nodeWidth / (fontSize * 0.6));
        
        // 文字换行处理
        if (text.length > maxChars) {
          const words = text.split('');
          let line = '';
          let lineNumber = 0;
          const lines = [];
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            if (testLine.length > maxChars) {
              lines.push(line);
              line = words[i];
              lineNumber++;
            } else {
              line = testLine;
            }
          }
          lines.push(line);
          
          d3.select(this).selectAll('tspan').remove();
          lines.slice(0, 2).forEach((l, i) => {
            d3.select(this).append('tspan')
              .attr('x', getNodeWidth((d.data as KnowledgeNode).level) / 2)
              .attr('dy', i === 0 ? '0.3em' : '1.2em')
              .text(l);
          });
        } else {
          d3.select(this).text(text);
        }
      });

    // 添加进度指示器
    nodes.filter(d => !!(d.data as KnowledgeNode).content)
      .append('circle')
      .attr('cx', d => getNodeWidth((d.data as KnowledgeNode).level) - 8)
      .attr('cy', 8)
      .attr('r', 6)
      .attr('fill', d => {
        const status = getNodeStatus((d.data as KnowledgeNode).id);
        if (status === 'completed') return '#ffffff';
        if (status === 'in_progress') return '#f59e0b';
        return 'rgba(255,255,255,0.3)';
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

  }, [data, dimensions, getNodeStatus, highlightedNodes, onNodeClick, progress, interactive]);

  return (
    <div ref={containerRef} className="relative w-full h-full rounded-xl overflow-hidden">
      {/* SVG容器 */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        {/* 渐变定义 */}
        <defs>
          <linearGradient id="gradient0" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* 选中节点详情面板 */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border border-slate-200"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-slate-900">{selectedNode.name}</h3>
            {selectedNode.difficulty && (
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                <Target className="w-3 h-3 text-slate-500" />
                <span className="text-xs font-medium text-slate-700">
                  {selectedNode.difficulty === 1 ? '基础' : 
                   selectedNode.difficulty === 2 ? '中等' : '复杂'}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {/* 知识点 */}
            {selectedNode.keyPoints && selectedNode.keyPoints.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  核心知识点
                </h4>
                <ul className="space-y-1">
                  {selectedNode.keyPoints.slice(0, 4).map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <Circle className="w-1.5 h-1.5 fill-slate-400 text-slate-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 推荐课程 */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Play className="w-4 h-4" />
                推荐课程
              </h4>
              <div className="space-y-1.5">
                {selectedNode.courses && selectedNode.courses.length > 0 ? (
                  selectedNode.courses.map((course) => (
                    <a
                      key={course.id}
                      href={`/course/${course.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-orange-50 cursor-pointer transition-colors group"
                    >
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Play className="h-2.5 w-2.5 text-white ml-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate group-hover:text-orange-700">{course.title}</p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{course.duration}分钟</span>
                    </a>
                  ))
                ) : selectedNode.content ? (
                  <a
                    href={`/course/${selectedNode.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-orange-50 cursor-pointer transition-colors group"
                  >
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Play className="h-2.5 w-2.5 text-white ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate group-hover:text-orange-700">{selectedNode.content.title}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{selectedNode.content.duration}分钟</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white text-sm font-bold transition-colors"
            aria-label="关闭"
          >
            ×
          </button>
        </motion.div>
      )}
      
      {/* 图例 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-slate-400" />
            <span>未解锁</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-blue-500" />
            <span>可学习</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-amber-500" />
            <span>进行中</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-green-500" />
            <span>已完成</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          {interactive ? '点击节点查看详情 · 拖拽或滚轮缩放' : '点击节点查看详情'}
        </p>
      </div>
      
      {/* 难度级别说明 */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">难度级别说明</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-20">入门级：</span>
            <span>基础内容，适合初学者</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-20">进阶级：</span>
            <span>中等难度，适合有一定基础</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-20">深入级：</span>
            <span>全面内容，包括复杂主题</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default MindMap;
