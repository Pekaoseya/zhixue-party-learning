import { KnowledgeNode, LearningPath, DiagnosticOption } from './types';

// 核心知识图谱 - 党建知识体系
export const partyKnowledgeGraph: KnowledgeNode = {
  id: 'root',
  name: '党建理论学习体系',
  level: 0,
  children: [
    {
      id: 'party-building-basics',
      name: '党建基础理论',
      level: 1,
      description: '党的基本理论和基础知识',
      prerequisites: [],
      children: [
        {
          id: 'party-constitution',
          name: '党章学习',
          level: 2,
          description: '中国共产党的根本大法',
          videoId: '1482',
          courses: [
            { id: '1482', title: '终身课题、常炼常修——干部的修养修炼没有休止符（下）', duration: 28, videoId: '1482' },
            { id: '1481', title: '终身课题、常炼常修——干部的修养修炼没有休止符（上）', duration: 31, videoId: '1481' },
            { id: '1365', title: '重温《论共产党员的修养》的诞生历程', duration: 18, videoId: '1365' },
            { id: '1361', title: '从《我的修养要则》看周恩来的精神境界', duration: 13, videoId: '1361' },
            { id: '707', title: '古代官德与干部修养', duration: 60, videoId: '707' },
          ],
          keyPoints: [
            '党的性质和宗旨',
            '党员的权利和义务',
            '党的组织和纪律',
            '入党誓词解读'
          ],
          content: {
            id: 'c1',
            title: '党章精讲',
            type: 'video',
            duration: 45,
            summary: '系统讲解党章的总纲和条文，重点解读党员条件、义务与权利。'
          },
          relatedDocuments: [
            { id: 'd1', title: '中国共产党章程', type: '法规' },
            { id: 'd2', title: '党章修正案说明', type: '解读' }
          ]
        },
        {
          id: 'party-history',
          name: '党史学习',
          level: 2,
          description: '中国共产党百年奋斗历程',
          videoId: '1475',
          courses: [
            { id: '1475', title: '党的百年奋斗的历史意义——党的十九届六中全会精神解读（上）', duration: 28, videoId: '1475' },
            { id: '1474', title: '党的百年奋斗的历史意义——党的十九届六中全会精神解读（下）', duration: 29, videoId: '1474' },
            { id: '1469', title: '中国共产党百年奋斗的重大成就（一）', duration: 29, videoId: '1469' },
            { id: '1468', title: '中国共产党百年奋斗的重大成就（二）', duration: 26, videoId: '1468' },
            { id: '1467', title: '中国共产党百年奋斗的重大成就（三）', duration: 37, videoId: '1467' },
          ],
          keyPoints: [
            '建党初期革命历程',
            '新中国成立与社会主义建设',
            '改革开放的伟大成就',
            '新时代的历史性变革'
          ],
          content: {
            id: 'c2',
            title: '百年党史概览',
            type: 'video',
            duration: 60,
            summary: '回顾中国共产党从成立到新时代的伟大历程。'
          },
          relatedDocuments: [
            { id: 'd3', title: '中国共产党简史', type: '教材' }
          ]
        },
        {
          id: 'party-theory',
          name: '党的创新理论',
          level: 2,
          description: '马克思主义中国化的理论成果',
          videoId: '1487',
          courses: [
            { id: '1487', title: '习近平生态文明思想与浙江实践', duration: 88, videoId: '1487' },
            { id: '1460', title: '新时代新型政党制度的创新发展和浙江实践', duration: 32, videoId: '1460' },
            { id: '1457', title: '回眸党的百年海外统战史，开创新时代海外统战新局面', duration: 39, videoId: '1457' },
            { id: '1445', title: '新时代中国共产党领导实现中华民族伟大复兴的政治宣言和行动指南（上）', duration: 39, videoId: '1445' },
            { id: '1444', title: '新时代中国共产党领导实现中华民族伟大复兴的政治宣言和行动指南（中）', duration: 42, videoId: '1444' },
          ],
          keyPoints: [
            '毛泽东思想',
            '邓小平理论',
            '三个代表重要思想',
            '科学发展观',
            '习近平新时代中国特色社会主义思想'
          ],
          content: {
            id: 'c3',
            title: '理论发展脉络',
            type: 'video',
            duration: 50,
            summary: '梳理马克思主义中国化的理论演进历程。'
          }
        }
      ]
    },
    {
      id: 'party-20th-congress',
      name: '二十大精神学习',
      level: 1,
      description: '深入学习党的二十大精神',
      prerequisites: ['party-building-basics'],
      children: [
        {
          id: '20th-report',
          name: '二十大报告解读',
          level: 2,
          description: '党的二十大报告核心要义',
          videoId: '1465',
          courses: [
            { id: '1465', title: '以史为鉴、开创未来——学习党的十九届六中全会精神（上）', duration: 33, videoId: '1465' },
            { id: '1464', title: '以史为鉴、开创未来——学习党的十九届六中全会精神（下）', duration: 28, videoId: '1464' },
            { id: '1352', title: '党和国家历史上具有深远意义的伟大转折――党的十一届三中全会的召开（上）', duration: 44, videoId: '1352' },
            { id: '1351', title: '党和国家历史上具有深远意义的伟大转折――党的十一届三中全会的召开（下）', duration: 33, videoId: '1351' },
            { id: '1305', title: '夺取全面建设社会主义现代化强国新胜利——深入学习党的十九届五中全会精神（上）', duration: 32, videoId: '1305' },
          ],
          keyPoints: [
            '大会主题与历史意义',
            '过去五年的工作和新时代十年的伟大变革',
            '新时代新征程中国共产党的使命任务',
            '中国式现代化',
            '全面从严治党'
          ],
          content: {
            id: 'c4',
            title: '二十大报告全文解读',
            type: 'video',
            duration: 90,
            summary: '深入解读党的二十大报告的核心内容和重大部署。'
          },
          relatedDocuments: [
            { id: 'd4', title: '党的二十大报告', type: '文件' },
            { id: 'd5', title: '二十大党章修正案', type: '文件' }
          ]
        },
        {
          id: 'chinese-modernization',
          name: '中国式现代化',
          level: 2,
          description: '中国式现代化的中国特色和本质要求',
          videoId: '1304',
          courses: [
            { id: '1304', title: '夺取全面建设社会主义现代化强国新胜利——深入学习党的十九届五中全会精神（下）', duration: 28, videoId: '1304' },
            { id: '1303', title: '深入学习贯彻党的十九届五中全会精神，开启全面建设社会主义现代化国家新征程（上）', duration: 43, videoId: '1303' },
            { id: '1302', title: '深入学习贯彻党的十九届五中全会精神，开启全面建设社会主义现代化国家新征程（下）', duration: 40, videoId: '1302' },
            { id: '1040', title: '统一战线与国家治理现代化', duration: 24, videoId: '1040' },
            { id: '997', title: '推进新时代改革开放：化制度优势为治理效能（上）', duration: 35, videoId: '997' },
          ],
          keyPoints: [
            '中国式现代化的中国特色',
            '中国式现代化的本质要求',
            '中国式现代化的重大原则',
            '两步走战略安排'
          ],
          content: {
            id: 'c5',
            title: '中国式现代化专题',
            type: 'video',
            duration: 40,
            summary: '系统阐述中国式现代化的理论内涵和实践要求。'
          }
        },
        {
          id: 'comprehensive-strict-governance',
          name: '全面从严治党',
          level: 2,
          description: '新时代党的建设新的伟大工程',
          videoId: '1450',
          courses: [
            { id: '1450', title: '勇于自我革命——必须不断推进党的建设新的伟大工程', duration: 44, videoId: '1450' },
            { id: '1415', title: '学习政党理论，推进全面从严治党（上）', duration: 26, videoId: '1415' },
            { id: '1414', title: '学习政党理论，推进全面从严治党（下）', duration: 26, videoId: '1414' },
            { id: '793', title: '全面从严治党的基本功：思想建党、制度治党、法治权钱', duration: 60, videoId: '793' },
            { id: '784', title: '习近平总书记全面从严治党新思路', duration: 60, videoId: '784' },
          ],
          keyPoints: [
            '两个确立的决定性意义',
            '四个全面的战略布局',
            '党的自我革命',
            '政治建设摆在首位'
          ],
          content: {
            id: 'c6',
            title: '全面从严治党专题',
            type: 'video',
            duration: 35,
            summary: '解读新时代党的建设总要求。'
          }
        }
      ]
    },
    {
      id: 'grassroots-party-work',
      name: '基层党务工作',
      level: 1,
      description: '基层党组织实务操作',
      prerequisites: ['party-building-basics'],
      children: [
        {
          id: 'membership-development',
          name: '发展党员工作',
          level: 2,
          description: '党员发展规范化流程',
          videoId: '1381',
          courses: [
            { id: '1381', title: '《我说40年：先锋》', duration: 35, videoId: '1381' },
            { id: '903', title: '大数据时代如何提高党员干部的网络安全素养（一）', duration: 39, videoId: '903' },
            { id: '902', title: '大数据时代如何提高党员干部的网络安全素养（二）', duration: 39, videoId: '902' },
            { id: '901', title: '大数据时代如何提高党员干部的网络安全素养（三）', duration: 45, videoId: '901' },
            { id: '900', title: '大数据时代如何提高党员干部的网络安全素养（四）', duration: 45, videoId: '900' },
          ],
          keyPoints: [
            '入党申请与教育',
            '入党积极分子确定',
            '发展对象确定与培养',
            '预备党员接收',
            '预备党员教育考察转正'
          ],
          content: {
            id: 'c7',
            title: '发展党员工作实务',
            type: 'video',
            duration: 55,
            summary: '详解发展党员的五个阶段、二十五个关键环节。'
          },
          relatedDocuments: [
            { id: 'd6', title: '发展党员工作细则', type: '规定' }
          ]
        },
        {
          id: 'party-life',
          name: '党的组织生活',
          level: 2,
          description: '三会一课与主题党日',
          videoId: '1035',
          courses: [
            { id: '1035', title: '如何正确认识共产党领导与民主党派组织独立性之间的关系', duration: 14, videoId: '1035' },
            { id: '913', title: '减轻灾害风险 提升基层减灾综合防范能力（上）', duration: 40, videoId: '913' },
            { id: '912', title: '减轻灾害风险 提升基层减灾综合防范能力（下）', duration: 50, videoId: '912' },
            { id: '849', title: '中国共产党为什么"能"（上）', duration: 24, videoId: '849' },
            { id: '848', title: '中国共产党为什么"能"（下）', duration: 29, videoId: '848' },
          ],
          keyPoints: [
            '支部党员大会',
            '支部委员会',
            '党小组会',
            '党课',
            '主题党日活动'
          ],
          content: {
            id: 'c8',
            title: '组织生活质量提升',
            type: 'video',
            duration: 40,
            summary: '如何提高党的组织生活质量，增强党员参与感。'
          }
        },
        {
          id: 'mass-work',
          name: '群众工作方法',
          level: 2,
          description: '做好新时代的群众工作',
          videoId: '1405',
          courses: [
            { id: '1405', title: '意识形态工作如何凝民心聚共识——习近平总书记关于意识形态工作重要讲话精神解读（上）', duration: 43, videoId: '1405' },
            { id: '1404', title: '意识形态工作如何凝民心聚共识——习近平总书记关于意识形态工作重要讲话精神解读（中）', duration: 38, videoId: '1404' },
            { id: '1403', title: '意识形态工作如何凝民心聚共识——习近平总书记关于意识形态工作重要讲话精神解读（下）', duration: 35, videoId: '1403' },
            { id: '1350', title: '深入基层，提高调查研究能力（上）', duration: 26, videoId: '1350' },
            { id: '1349', title: '深入基层，提高调查研究能力（下）', duration: 33, videoId: '1349' },
          ],
          keyPoints: [
            '践行党的群众路线',
            '密切联系群众',
            '化解矛盾纠纷',
            '服务群众最后一公里'
          ],
          content: {
            id: 'c9',
            title: '群众工作艺术',
            type: 'video',
            duration: 35,
            summary: '掌握新形势下群众工作的方式方法。'
          }
        }
      ]
    },
    {
      id: 'rural-revitalization',
      name: '乡村振兴战略',
      level: 1,
      description: '乡村振兴战略部署与实践',
      prerequisites: [],
      children: [
        {
          id: 'rural-policy',
          name: '乡村振兴政策',
          level: 2,
          description: '乡村振兴总体要求和重点任务',
          videoId: '1501',
          courses: [
            { id: '1501', title: '法治建设护航乡村振兴的"余村样板"', duration: 31, videoId: '1501' },
            { id: '1055', title: '学习习近平总书记关于脱贫攻坚工作的重要指示精神', duration: 9, videoId: '1055' },
            { id: '951', title: '大力实施乡村振兴战略（上）', duration: 30, videoId: '951' },
            { id: '950', title: '大力实施乡村振兴战略（下）', duration: 30, videoId: '950' },
            { id: '919', title: '实施乡村振兴战略，着力推进"五个振兴"', duration: 65, videoId: '919' },
          ],
          keyPoints: [
            '产业兴旺',
            '生态宜居',
            '乡风文明',
            '治理有效',
            '生活富裕'
          ],
          content: {
            id: 'c10',
            title: '乡村振兴政策解读',
            type: 'video',
            duration: 45,
            summary: '全面解读乡村振兴战略的总体框架和五大目标。'
          }
        },
        {
          id: 'rural-governance',
          name: '乡村治理现代化',
          level: 2,
          description: '完善乡村治理体系',
          videoId: '1027',
          courses: [
            { id: '1027', title: '新乡贤与基层统战工作', duration: 123, videoId: '1027' },
            { id: '946', title: '打造共建共治共享的社会治理格局', duration: 20, videoId: '946' },
            { id: '938', title: '构建新型基层社会治理体系，打造扫黑除恶坚固防线（上）', duration: 40, videoId: '938' },
            { id: '937', title: '构建新型基层社会治理体系，打造扫黑除恶坚固防线（中）', duration: 45, videoId: '937' },
            { id: '936', title: '构建新型基层社会治理体系，打造扫黑除恶坚固防线（下）', duration: 45, videoId: '936' },
          ],
          keyPoints: [
            '党建引领乡村振兴',
            '村民自治制度完善',
            '法治乡村建设',
            '德治乡村建设'
          ],
          content: {
            id: 'c11',
            title: '乡村治理创新',
            type: 'video',
            duration: 40,
            summary: '探索党建引领下的乡村治理新模式。'
          }
        }
      ]
    },
    {
      id: 'disciplinary-style',
      name: '党风廉政建设',
      level: 1,
      description: '全面从严治党永远在路上',
      prerequisites: [],
      children: [
        {
          id: 'integrity-education',
          name: '廉政教育',
          level: 2,
          description: '廉洁自律警示教育',
          videoId: '1418',
          courses: [
            { id: '1418', title: '领导干部廉洁从政从业风险防范（上）', duration: 45, videoId: '1418' },
            { id: '1417', title: '领导干部廉洁从政从业风险防范（中）', duration: 40, videoId: '1417' },
            { id: '1416', title: '领导干部廉洁从政从业风险防范（下）', duration: 40, videoId: '1416' },
            { id: '1360', title: '走近抗大，弘扬艰苦奋斗的优良作风', duration: 15, videoId: '1360' },
            { id: '878', title: '廉政建设中正面引导的价值——以明代为例', duration: 35, videoId: '878' },
          ],
          keyPoints: [
            '中央八项规定精神',
            '反对四风',
            '廉洁自律准则',
            '警示案例剖析'
          ],
          content: {
            id: 'c12',
            title: '廉政教育专题',
            type: 'video',
            duration: 50,
            summary: '以案为鉴，筑牢拒腐防变的思想防线。'
          }
        },
        {
          id: 'supervision-system',
          name: '监督执纪体系',
          level: 2,
          description: '健全党和国家监督体系',
          videoId: '1345',
          courses: [
            { id: '1345', title: '党员领导干部要在执行党的纪律中作表率', duration: 77, videoId: '1345' },
            { id: '1342', title: '构建全方位、立体式、动态化干部大监督工作机制', duration: 50, videoId: '1342' },
            { id: '993', title: '坚持和完善党和国家监督体系，强化对权力运行的制约和监督（上）', duration: 40, videoId: '993' },
            { id: '992', title: '坚持和完善党和国家监督体系，强化对权力运行的制约和监督（下）', duration: 40, videoId: '992' },
            { id: '780', title: '《中国共产党问责条例》：全面从严治党、依规治党的新举措', duration: 50, videoId: '780' },
          ],
          keyPoints: [
            '党内监督',
            '国家监察',
            '民主监督',
            '审计监督',
            '社会监督'
          ],
          content: {
            id: 'c13',
            title: '监督体系建设',
            type: 'video',
            duration: 45,
            summary: '构建全方位、多层次的监督网络。'
          }
        }
      ]
    }
  ]
};

// 诊断问卷选项
export const diagnosticOptions: DiagnosticOption[] = [
  // 身份角色
  { id: 'r1', label: '党支部书记', category: 'role', tags: ['支部建设'] },
  { id: 'r2', label: '党务工作者', category: 'role', tags: ['组织工作'] },
  { id: 'r3', label: '普通党员', category: 'role', tags: ['个人学习'] },
  { id: 'r4', label: '入党积极分子', category: 'role', tags: ['入党教育'] },
  { id: 'r5', label: '预备党员', category: 'role', tags: ['党性修养'] },
  { id: 'r6', label: '群众', category: 'role', tags: ['了解党建'] },
  // 学习主题
  { id: 't1', label: '二十大精神', category: 'topic', tags: ['理论学习'] },
  { id: 't2', label: '党史学习', category: 'topic', tags: ['历史教育'] },
  { id: 't3', label: '党章党规', category: 'topic', tags: ['制度学习'] },
  { id: 't4', label: '基层党务', category: 'topic', tags: ['实务操作'] },
  { id: 't5', label: '乡村振兴', category: 'topic', tags: ['政策解读'] },
  { id: 't6', label: '党风廉政', category: 'topic', tags: ['警示教育'] },
];

// 主题映射到对应节点
export const topicNodeMap: Record<string, string> = {
  '二十大精神': 'party-20th-congress',
  '党史学习': 'party-history',
  '党章党规': 'party-constitution',
  '基层党务': 'grassroots-party-work',
  '乡村振兴': 'rural-revitalization',
  '党风廉政': 'disciplinary-style',
};

// 递归查找节点
export function getNodeById(id: string, node: KnowledgeNode): KnowledgeNode | null {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = getNodeById(id, child);
      if (found) return found;
    }
  }
  return null;
}

// 筛选节点
function filterNodes(
  node: KnowledgeNode,
  selectedIds: Set<string>,
  level: string
): KnowledgeNode | null {
  // 根据难度筛选
  if (level === 'beginner' && node.level > 2) {
    return null;
  }
  if (level === 'intermediate' && node.level > 3) {
    return null;
  }

  // 根节点始终保留
  if (node.level === 0) {
    const filteredChildren = node.children
      ?.map(child => filterNodes(child, selectedIds, level))
      .filter((child): child is KnowledgeNode => child !== null);
    return { ...node, children: filteredChildren };
  }

  // Level 1 知识模块：如果匹配，则保留该模块及其所有叶子课程节点
  if (node.level === 1) {
    const isMatched = selectedIds.has(node.id);
    if (isMatched) {
      // 匹配则保留所有子节点（Level 2 课程叶子节点）
      const allChildren = node.children || [];
      return { ...node, children: allChildren };
    }
    // 未匹配但子节点有匹配也保留
    const filteredChildren = node.children
      ?.map(child => filterNodes(child, selectedIds, level))
      .filter((child): child is KnowledgeNode => child !== null);
    if (filteredChildren?.length) {
      return { ...node, children: filteredChildren };
    }
    return null;
  }

  // Level 2 课程叶子节点：如果有内容/视频则直接返回（不再往下找子节点）
  if (node.level >= 2 && (node.content || node.videoId)) {
    return { ...node, children: undefined };
  }

  // 否则如果子节点有匹配则保留
  const filteredChildren = node.children
    ?.map(child => filterNodes(child, selectedIds, level))
    .filter((child): child is KnowledgeNode => child !== null);
  return filteredChildren?.length ? { ...node, children: filteredChildren } : null;
}

// 生成学习路径
export function generateLearningPath(profile: {
  roles: string[];
  topics: string[];
  level: string;
}): LearningPath {
  // 收集选中的节点ID
  const selectedIds = new Set<string>();
  
  // 角色映射到对应节点
  const roleNodeMap: Record<string, string[]> = {
    '党支部书记': ['grassroots-party-work', 'party-life'],
    '党务工作者': ['grassroots-party-work', 'membership-development'],
    '普通党员': ['party-constitution', 'party-history'],
    '入党积极分子': ['party-constitution', 'membership-development'],
    '预备党员': ['party-theory', 'integrity-education'],
  };

  // 主题映射到对应节点（使用全局映射）

  profile.roles.forEach(role => {
    const nodes = roleNodeMap[role];
    if (nodes) nodes.forEach(id => selectedIds.add(id));
  });

  profile.topics.forEach(topic => {
    const nodeId = topicNodeMap[topic];
    if (nodeId) selectedIds.add(nodeId);
  });

  // 添加父节点
  const parentMap: Record<string, string> = {
    'party-constitution': 'party-building-basics',
    'party-history': 'party-building-basics',
    'party-theory': 'party-building-basics',
    '20th-report': 'party-20th-congress',
    'chinese-modernization': 'party-20th-congress',
    'comprehensive-strict-governance': 'party-20th-congress',
    'membership-development': 'grassroots-party-work',
    'party-life': 'grassroots-party-work',
    'mass-work': 'grassroots-party-work',
    'rural-policy': 'rural-revitalization',
    'rural-governance': 'rural-revitalization',
    'integrity-education': 'disciplinary-style',
    'supervision-system': 'disciplinary-style',
  };
  
  selectedIds.forEach(id => {
    const parentId = parentMap[id];
    if (parentId) {
      selectedIds.add(parentId);
    }
  });
  
  // 筛选并构建学习路径
  const filteredRoot = filterNodes(partyKnowledgeGraph, selectedIds, profile.level);
  
  // 计算总时长
  let totalDuration = 0;
  function calcDuration(node: KnowledgeNode) {
    if (node.content?.duration) {
      totalDuration += node.content.duration;
    }
    if (node.children) {
      node.children.forEach(calcDuration);
    }
  }
  if (filteredRoot) {
    calcDuration(filteredRoot);
  }
  
  // 难度标题映射
  const difficultyLabels = {
    beginner: '入门级',
    intermediate: '进阶级',
    advanced: '深入级'
  };
  
  // 生成标题
  const selectedRole = profile.roles[0] || '党员';
  const selectedTopic = profile.topics[0] || '综合学习';
  
  return {
    id: `path-${Date.now()}`,
    title: `${selectedRole} · ${selectedTopic}`,
    description: `基于您的选择，为您规划了「${difficultyLabels[profile.level as keyof typeof difficultyLabels]}」学习方案`,
    rootNode: filteredRoot || partyKnowledgeGraph,
    totalDuration: totalDuration || 120,
    difficulty: profile.level as 'beginner' | 'intermediate' | 'advanced'
  };
}

// 模拟AI意图识别
export function analyzeIntent(userInput: string): { keywords: string[]; matchedPath: string } {
  const input = userInput.toLowerCase();
  const keywords: string[] = [];
  let matchedPath = '';
  
  // 关键词匹配
  const keywordMap: Record<string, string> = {
    '入党': 'membership-development',
    '党员': 'party-constitution',
    '发展': 'membership-development',
    '二十大': '20th-report',
    '现代化': 'chinese-modernization',
    '乡村': 'rural-revitalization',
    '振兴': 'rural-policy',
    '廉政': 'integrity-education',
    '监督': 'supervision-system',
    '党史': 'party-history',
    '党章': 'party-constitution',
    '群众': 'mass-work',
    '组织': 'party-life',
    '支部': 'party-life',
  };
  
  for (const [keyword, path] of Object.entries(keywordMap)) {
    if (input.includes(keyword)) {
      keywords.push(keyword);
      if (!matchedPath) matchedPath = path;
    }
  }
  
  return { keywords, matchedPath };
}

// 获取节点详情
export function getNodeDetails(nodeId: string): KnowledgeNode | null {
  return getNodeById(nodeId, partyKnowledgeGraph);
}
