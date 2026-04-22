import { KnowledgeNode, CourseContent, RelatedDoc } from './types';

// 数据库模型接口
export interface DBKnowledgeNode {
  id: string;
  name: string;
  description?: string;
  level: number;
  parent_id?: string;
}

export interface DBNodePrerequisite {
  node_id: string;
  prerequisite_node_id: string;
}

export interface DBCourseContent {
  id: string;
  node_id: string;
  title: string;
  type: 'video' | 'article' | 'quiz';
  duration?: number;
  url?: string;
  summary?: string;
}

export interface DBRelatedDoc {
  id: string;
  node_id: string;
  title: string;
  type: string;
  url?: string;
}

export interface DBKeyPoint {
  id: string;
  node_id: string;
  content: string;
  order_index: number;
}

// 转换结果接口
export interface GraphToDBResult {
  nodes: DBKnowledgeNode[];
  prerequisites: DBNodePrerequisite[];
  courseContents: DBCourseContent[];
  relatedDocs: DBRelatedDoc[];
  keyPoints: DBKeyPoint[];
}

// 将知识图谱转换为数据库格式
export function graphToDBFormat(rootNode: KnowledgeNode): GraphToDBResult {
  const result: GraphToDBResult = {
    nodes: [],
    prerequisites: [],
    courseContents: [],
    relatedDocs: [],
    keyPoints: []
  };

  // 递归处理节点
  function processNode(node: KnowledgeNode, parentId?: string) {
    // 创建节点记录
    const dbNode: DBKnowledgeNode = {
      id: node.id,
      name: node.name,
      description: node.description,
      level: node.level,
      parent_id: parentId
    };
    result.nodes.push(dbNode);

    // 处理前置条件
    if (node.prerequisites) {
      node.prerequisites.forEach(prerequisiteId => {
        const dbPrerequisite: DBNodePrerequisite = {
          node_id: node.id,
          prerequisite_node_id: prerequisiteId
        };
        result.prerequisites.push(dbPrerequisite);
      });
    }

    // 处理课程内容
    if (node.content) {
      const contentId = `${node.id}-content`;
      const dbContent: DBCourseContent = {
        id: contentId,
        node_id: node.id,
        title: node.content.title,
        type: node.content.type,
        duration: node.content.duration,
        url: node.content.url,
        summary: node.content.summary
      };
      result.courseContents.push(dbContent);
    }

    // 处理关联文档
    if (node.relatedDocuments) {
      node.relatedDocuments.forEach((doc, index) => {
        const docId = `${node.id}-doc-${index}`;
        const dbDoc: DBRelatedDoc = {
          id: docId,
          node_id: node.id,
          title: doc.title,
          type: doc.type,
          url: doc.url
        };
        result.relatedDocs.push(dbDoc);
      });
    }

    // 处理关键点
    if (node.keyPoints) {
      node.keyPoints.forEach((point, index) => {
        const pointId = `${node.id}-point-${index}`;
        const dbPoint: DBKeyPoint = {
          id: pointId,
          node_id: node.id,
          content: point,
          order_index: index
        };
        result.keyPoints.push(dbPoint);
      });
    }

    // 递归处理子节点
    if (node.children) {
      node.children.forEach(child => {
        processNode(child, node.id);
      });
    }
  }

  // 从根节点开始处理
  processNode(rootNode);

  return result;
}

// 从数据库格式还原知识图谱
export function dbToGraphFormat(
  nodes: DBKnowledgeNode[],
  prerequisites: DBNodePrerequisite[],
  courseContents: DBCourseContent[],
  relatedDocs: DBRelatedDoc[],
  keyPoints: DBKeyPoint[]
): KnowledgeNode {
  // 创建节点映射
  const nodeMap = new Map<string, KnowledgeNode>();
  
  // 首先创建所有节点
  nodes.forEach(dbNode => {
    const node: KnowledgeNode = {
      id: dbNode.id,
      name: dbNode.name,
      description: dbNode.description,
      level: dbNode.level,
      prerequisites: [],
      children: []
    };
    nodeMap.set(dbNode.id, node);
  });

  // 构建父子关系
  nodes.forEach(dbNode => {
    const node = nodeMap.get(dbNode.id);
    if (node && dbNode.parent_id) {
      const parentNode = nodeMap.get(dbNode.parent_id);
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(node);
      }
    }
  });

  // 添加前置条件
  const prerequisitesByNodeId = new Map<string, string[]>();
  prerequisites.forEach(prereq => {
    if (!prerequisitesByNodeId.has(prereq.node_id)) {
      prerequisitesByNodeId.set(prereq.node_id, []);
    }
    prerequisitesByNodeId.get(prereq.node_id)?.push(prereq.prerequisite_node_id);
  });
  
  prerequisitesByNodeId.forEach((prereqs, nodeId) => {
    const node = nodeMap.get(nodeId);
    if (node) {
      node.prerequisites = prereqs;
    }
  });

  // 添加课程内容
  courseContents.forEach(content => {
    const node = nodeMap.get(content.node_id);
    if (node) {
      node.content = {
        id: content.id,
        title: content.title,
        type: content.type,
        duration: content.duration,
        url: content.url,
        summary: content.summary
      };
    }
  });

  // 添加关联文档
  const docsByNodeId = new Map<string, RelatedDoc[]>();
  relatedDocs.forEach(doc => {
    if (!docsByNodeId.has(doc.node_id)) {
      docsByNodeId.set(doc.node_id, []);
    }
    docsByNodeId.get(doc.node_id)?.push({
      id: doc.id,
      title: doc.title,
      type: doc.type,
      url: doc.url
    });
  });
  
  docsByNodeId.forEach((docs, nodeId) => {
    const node = nodeMap.get(nodeId);
    if (node) {
      node.relatedDocuments = docs;
    }
  });

  // 添加关键点（按order_index排序）
  const pointsByNodeId = new Map<string, string[]>();
  // 先按node_id分组，再按order_index排序
  const groupedPoints = new Map<string, DBKeyPoint[]>();
  keyPoints.forEach(point => {
    if (!groupedPoints.has(point.node_id)) {
      groupedPoints.set(point.node_id, []);
    }
    groupedPoints.get(point.node_id)?.push(point);
  });
  
  // 对每个节点的关键点按order_index排序
  groupedPoints.forEach((points, nodeId) => {
    points.sort((a, b) => a.order_index - b.order_index);
    const sortedContents = points.map(point => point.content);
    pointsByNodeId.set(nodeId, sortedContents);
  });
  
  pointsByNodeId.forEach((points, nodeId) => {
    const node = nodeMap.get(nodeId);
    if (node) {
      node.keyPoints = points;
    }
  });

  // 找到根节点并返回
  const rootNode = nodes.find(node => !node.parent_id);
  if (!rootNode) {
    throw new Error('No root node found in database');
  }
  
  return nodeMap.get(rootNode.id) as KnowledgeNode;
}
