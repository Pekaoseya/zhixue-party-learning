import { KnowledgeNode, LearningPath, DiagnosticOption, CourseInfo } from './types';

// 模拟课程数据 - 与知识图谱节点对应的真实课程
const courseDatabase: Record<string, CourseInfo[]> = {
  'party-constitution': [
    { id: '1283', title: '中国共产党章程（总纲）', duration: 45 },
    { id: '1284', title: '中国共产党章程（第一章 党员）', duration: 38 },
    { id: '1285', title: '中国共产党章程（第二章至第十一章）', duration: 52 },
    { id: '1286', title: '党章修正案解读（上）', duration: 40 },
    { id: '1287', title: '党章修正案解读（下）', duration: 42 },
  ],
  'party-history': [
    { id: '1288', title: '中国共产党简史（上）—— 新民主主义革命时期', duration: 55 },
    { id: '1289', title: '中国共产党简史（中）—— 社会主义革命和建设时期', duration: 50 },
    { id: '1290', title: '中国共产党简史（下）—— 改革开放和社会主义现代化建设新时期', duration: 48 },
    { id: '1291', title: '百年党史重大事件回顾', duration: 42 },
  ],
  'party-theory': [
    { id: '1292', title: '马克思主义中国化的理论成果（上）', duration: 45 },
    { id: '1293', title: '马克思主义中国化的理论成果（下）', duration: 48 },
    { id: '1294', title: '习近平新时代中国特色社会主义思想概论', duration: 55 },
    { id: '1295', title: '新时代中国特色社会主义思想的核心要义', duration: 40 },
  ],
  '20th-report': [
    { id: '1300', title: '二十大报告辅导读本（上）—— 过去五年工作和新时代十年伟大变革', duration: 60 },
    { id: '1301', title: '二十大报告辅导读本（中）—— 新时代新征程党的使命任务', duration: 55 },
    { id: '1302', title: '二十大报告辅导读本（下）—— 中国式现代化与高质量发展', duration: 58 },
    { id: '1303', title: '以史为鉴、开创未来—— 学习贯彻党的二十大精神（上）', duration: 45 },
    { id: '1304', title: '以史为鉴、开创未来—— 学习贯彻党的二十大精神（下）', duration: 48 },
    { id: '1305', title: '党和国家历史上具有深远意义的伟大转折', duration: 42 },
  ],
  'chinese-modernization': [
    { id: '1306', title: '中国式现代化的中国特色（上）', duration: 42 },
    { id: '1307', title: '中国式现代化的中国特色（下）', duration: 45 },
    { id: '1308', title: '中国式现代化的本质要求', duration: 38 },
    { id: '1309', title: '夺取全面建设社会主义现代化国家新胜利', duration: 50 },
  ],
  'comprehensive-strict-governance': [
    { id: '1310', title: '全面从严治党永远在路上（上）', duration: 40 },
    { id: '1311', title: '全面从严治党永远在路上（下）', duration: 43 },
    { id: '1312', title: '以党的自我革命引领社会革命', duration: 38 },
    { id: '1313', title: '新时代党的建设新的伟大工程', duration: 45 },
  ],
  'membership-development': [
    { id: '1320', title: '发展党员工作流程详解（上）—— 申请入党到确定积极分子', duration: 40 },
    { id: '1321', title: '发展党员工作流程详解（中）—— 确定发展对象到预备党员', duration: 45 },
    { id: '1322', title: '发展党员工作流程详解（下）—— 预备党员教育考察到转正', duration: 42 },
    { id: '1323', title: '入党申请书撰写规范', duration: 30 },
  ],
  'party-life': [
    { id: '1330', title: '三会一课制度规范（上）—— 支委会与党员大会', duration: 38 },
    { id: '1331', title: '三会一课制度规范（下）—— 党小组会与党课', duration: 35 },
    { id: '1332', title: '主题党日活动设计与实施', duration: 40 },
    { id: '1333', title: '组织生活会和民主评议党员', duration: 42 },
  ],
  'mass-work': [
    { id: '1340', title: '意识形态工作如何凝民心聚共识（上）', duration: 43 },
    { id: '1341', title: '意识形态工作如何凝民心聚共识（下）', duration: 45 },
    { id: '1342', title: '新时代群众工作方法与实践', duration: 38 },
    { id: '1343', title: '基层矛盾化解与信访工作', duration: 40 },
  ],
  'rural-policy': [
    { id: '1350', title: '乡村振兴战略解读（上）—— 总体要求与目标任务', duration: 45 },
    { id: '1351', title: '乡村振兴战略解读（下）—— 五大振兴路径', duration: 48 },
    { id: '1352', title: '产业振兴与农业现代化', duration: 40 },
    { id: '1353', title: '乡村治理与文化建设', duration: 42 },
  ],
  'rural-governance': [
    { id: '1360', title: '党建引领乡村治理（上）—— 组织体系建设', duration: 42 },
    { id: '1361', title: '党建引领乡村治理（下）—— 自治法治德治融合', duration: 45 },
    { id: '1362', title: '新时代"枫桥经验"与基层社会治理', duration: 40 },
    { id: '1363', title: '村规民约与乡村文明建设', duration: 35 },
  ],
  'integrity-education': [
    { id: '1370', title: '中国共产党纪律处分条例解读（上）—— 总则与政治纪律', duration: 50 },
    { id: '1371', title: '中国共产党纪律处分条例解读（中）—— 组织纪律与廉洁纪律', duration: 48 },
    { id: '1372', title: '中国共产党纪律处分条例解读（下）—— 群众纪律工作纪律生活纪律', duration: 45 },
    { id: '1373', title: '新时代廉洁自律准则学习', duration: 35 },
    { id: '1374', title: '典型案例警示教育', duration: 42 },
  ],
  'supervision-system': [
    { id: '1380', title: '党和国家监督体系构建（上）—— 党内监督与国家监察', duration: 45 },
    { id: '1381', title: '党和国家监督体系构建（下）—— 民主监督与社会监督', duration: 42 },
    { id: '1382', title: '巡视巡察工作实务', duration: 48 },
    { id: '1383', title: '审计监督与财经纪律', duration: 40 },
  ],
};

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
          difficulty: 1,
          description: '中国共产党的根本大法',
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
          courses: [
            { id: '1283', title: '中国共产党章程（总纲）', duration: 45 },
            { id: '1284', title: '中国共产党章程（第一章 党员）', duration: 38 },
            { id: '1285', title: '中国共产党章程（第二章至第十一章）', duration: 52 },
            { id: '1286', title: '党章修正案解读（上）', duration: 40 },
            { id: '1287', title: '党章修正案解读（下）', duration: 42 },
          ],
          relatedDocuments: [
            { id: 'd1', title: '中国共产党章程', type: '法规' },
            { id: 'd2', title: '党章修正案说明', type: '解读' }
          ]
        },
        {
          id: 'party-history',
          name: '党史学习',
          level: 2,
          difficulty: 1,
          description: '中国共产党百年奋斗历程',
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
          courses: [
            { id: '1288', title: '中国共产党简史（上）—— 新民主主义革命时期', duration: 55 },
            { id: '1289', title: '中国共产党简史（中）—— 社会主义革命和建设时期', duration: 50 },
            { id: '1290', title: '中国共产党简史（下）—— 改革开放和社会主义现代化建设新时期', duration: 48 },
            { id: '1291', title: '百年党史重大事件回顾', duration: 42 },
          ],
          relatedDocuments: [
            { id: 'd3', title: '中国共产党简史', type: '教材' }
          ]
        },
        {
          id: 'party-theory',
          name: '党的创新理论',
          level: 2,
          difficulty: 2,
          description: '马克思主义中国化的理论成果',
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
          },
          courses: [
            { id: '1292', title: '马克思主义中国化时代化的理论逻辑', duration: 48 },
            { id: '1293', title: '毛泽东思想概论（上）', duration: 52 },
            { id: '1294', title: '毛泽东思想概论（下）', duration: 46 },
            { id: '1295', title: '邓小平理论专题', duration: 44 },
            { id: '1296', title: '习近平新时代中国特色社会主义思想概论', duration: 55 },
          ],
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
          difficulty: 2,
          description: '党的二十大报告核心要义',
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
          courses: [
            { id: '1297', title: '党的二十大报告导读（上）', duration: 55 },
            { id: '1298', title: '党的二十大报告导读（中）', duration: 50 },
            { id: '1299', title: '党的二十大报告导读（下）', duration: 48 },
            { id: '1300', title: '新时代新征程中国共产党的使命任务', duration: 42 },
          ],
          relatedDocuments: [
            { id: 'd4', title: '党的二十大报告', type: '文件' },
            { id: 'd5', title: '二十大党章修正案', type: '文件' }
          ]
        },
        {
          id: 'chinese-modernization',
          name: '中国式现代化',
          level: 2,
          difficulty: 2,
          description: '中国式现代化的中国特色和本质要求',
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
          },
          courses: [
            { id: '1301', title: '中国式现代化的中国特色和本质要求', duration: 45 },
            { id: '1302', title: '中国式现代化的重大原则', duration: 38 },
            { id: '1303', title: '两步走战略安排解读', duration: 42 },
          ],
        },
        {
          id: 'comprehensive-strict-governance',
          name: '全面从严治党',
          level: 2,
          difficulty: 2,
          description: '新时代党的建设新的伟大工程',
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
          },
          courses: [
            { id: '1304', title: '全面从严治党十年回顾', duration: 48 },
            { id: '1305', title: '党的自我革命与历史主动', duration: 44 },
            { id: '1306', title: '新时代政治建设新要求', duration: 40 },
            { id: '1307', title: '四个全面战略布局深度解读', duration: 52 },
          ],
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
          difficulty: 2,
          description: '党员发展规范化流程',
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
          courses: [
            { id: '1308', title: '发展党员工作流程详解（上）', duration: 48 },
            { id: '1309', title: '发展党员工作流程详解（下）', duration: 46 },
            { id: '1310', title: '入党积极分子培养教育', duration: 40 },
            { id: '1311', title: '预备党员转正程序规范', duration: 38 },
          ],
          relatedDocuments: [
            { id: 'd6', title: '发展党员工作细则', type: '规定' }
          ]
        },
        {
          id: 'party-life',
          name: '党的组织生活',
          level: 2,
          difficulty: 1,
          description: '三会一课与主题党日',
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
          },
          courses: [
            { id: '1312', title: '三会一课规范化建设', duration: 45 },
            { id: '1313', title: '主题党日活动创新与实践', duration: 38 },
            { id: '1314', title: '组织生活会与民主评议党员', duration: 42 },
          ],
        },
        {
          id: 'mass-work',
          name: '群众工作方法',
          level: 2,
          difficulty: 1,
          description: '做好新时代的群众工作',
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
          },
          courses: [
            { id: '1315', title: '新时代群众工作方法论', duration: 42 },
            { id: '1316', title: '基层矛盾纠纷调解技巧', duration: 38 },
            { id: '1317', title: '践行党的群众路线', duration: 44 },
            { id: '1318', title: '服务群众最后一公里', duration: 36 },
          ],
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
          difficulty: 1,
          description: '乡村振兴总体要求和重点任务',
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
          },
          courses: [
            { id: '1319', title: '乡村振兴战略总体要求解读', duration: 45 },
            { id: '1320', title: '产业兴旺——乡村振兴的核心动力', duration: 42 },
            { id: '1321', title: '生态宜居与乡风文明建设', duration: 38 },
          ],
        },
        {
          id: 'rural-governance',
          name: '乡村治理现代化',
          level: 2,
          difficulty: 2,
          description: '完善乡村治理体系',
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
          },
          courses: [
            { id: '1322', title: '党建引领乡村治理新模式', duration: 44 },
            { id: '1323', title: '村民自治制度完善与实践', duration: 40 },
            { id: '1324', title: '法治乡村与德治乡村建设', duration: 42 },
          ],
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
          difficulty: 2,
          description: '廉洁自律警示教育',
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
          },
          courses: [
            { id: '1325', title: '中央八项规定精神解读', duration: 46 },
            { id: '1326', title: '反对四风典型案例剖析', duration: 48 },
            { id: '1327', title: '廉洁自律准则学习', duration: 40 },
            { id: '1328', title: '警示教育片精选', duration: 52 },
          ],
        },
        {
          id: 'supervision-system',
          name: '监督执纪体系',
          level: 2,
          difficulty: 3,
          description: '健全党和国家监督体系',
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
          },
          courses: [
            { id: '1329', title: '党内监督体系与实施', duration: 48 },
            { id: '1330', title: '国家监察体制改革解读', duration: 44 },
            { id: '1331', title: '民主监督与审计监督实践', duration: 42 },
            { id: '1332', title: '社会监督与群众监督', duration: 38 },
          ],
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



/**
 * 提取课程标题前缀（去掉括号及其内容）
 */
function extractCoursePrefix(title: string): string {
  const idx = title.indexOf('（');
  return idx >= 0 ? title.substring(0, idx).trim() : title.trim();
}

/**
 * 为知识节点注入课程数据
 * - 每个底层节点插入 3-5 门课程
 * - 如果课程名包含上/中/下，则将该系列全部纳入（可以短暂超出上限）
 */
function injectCoursesToNode(node: KnowledgeNode): KnowledgeNode {
  const dbCourses = courseDatabase[node.id];
  if (!dbCourses || dbCourses.length === 0) {
    return node;
  }

  // 按前缀分组
  const prefixMap = new Map<string, CourseInfo[]>();
  dbCourses.forEach(course => {
    const prefix = extractCoursePrefix(course.title);
    if (!prefixMap.has(prefix)) {
      prefixMap.set(prefix, []);
    }
    prefixMap.get(prefix)!.push(course);
  });

  // 判断哪些组包含 上/中/下 系列
  const hasSeriesParts = (courses: CourseInfo[]) => {
    return courses.some(c => c.title.includes('（上）') || c.title.includes('（中）') || c.title.includes('（下）'));
  };

  // 选择课程：优先选择完整系列，再填充普通课程到 3-5 门
  const selected: CourseInfo[] = [];
  const usedPrefixes = new Set<string>();

  // 第一遍：收集所有含 上/中/下 的系列（全部纳入）
  for (const [prefix, courses] of prefixMap) {
    if (hasSeriesParts(courses)) {
      selected.push(...courses);
      usedPrefixes.add(prefix);
    }
  }

  // 第二遍：从剩余课程中挑选，凑够 3-5 门
  const remaining = dbCourses.filter(c => !usedPrefixes.has(extractCoursePrefix(c.title)));
  let idx = 0;
  while (selected.length < 5 && idx < remaining.length) {
    selected.push(remaining[idx]);
    idx++;
  }

  // 如果选了超过 5 门但有连续系列，保留；如果没连续系列且超过 5 门，截断到 5 门
  const hasContinuousSeries = [...prefixMap.values()].some(courses => 
    hasSeriesParts(courses) && courses.length >= 2
  );
  const finalCourses = (hasContinuousSeries || selected.length <= 5) ? selected : selected.slice(0, 5);

  return {
    ...node,
    courses: finalCourses.length > 0 ? finalCourses : node.courses,
  };
}

/**
 * 深度遍历，为所有叶子节点注入课程
 */
function injectCoursesRecursive(node: KnowledgeNode): KnowledgeNode {
  if (node.children && node.children.length > 0) {
    return {
      ...node,
      children: node.children.map(child => injectCoursesRecursive(child)),
    };
  }
  // 叶子节点：注入课程
  return injectCoursesToNode(node);
}

// 筛选节点
function filterNodes(
  node: KnowledgeNode,
  selectedIds: Set<string>,
  level: string
): KnowledgeNode | null {
  // 递归过滤子节点
  const filteredChildren = node.children
    ?.map(child => filterNodes(child, selectedIds, level))
    .filter((child): child is KnowledgeNode => child !== null);

  const isSelected = selectedIds.has(node.id);

  // Level 0 根节点：始终保留
  if (node.level === 0) {
    return { ...node, children: filteredChildren };
  }

  // Level 1 一级分类节点：只要有子节点就保留（不做难度筛选）
  if (node.level === 1) {
    if ((filteredChildren && filteredChildren.length > 0) || isSelected) {
      return { ...node, children: filteredChildren };
    }
    return null;
  }

  // Level 2+ 节点：根据难度和选中状态筛选
  const complexity = node.difficulty;
  if (isSelected) {
    // 用户选中的节点始终保留
    return { ...node, children: undefined };
  }
  if (complexity) {
    // 根据难度筛选
    if (level === 'beginner' && complexity > 1) return null;
    if (level === 'intermediate' && complexity > 2) return null;
  }

  // 叶子节点未被选中且有难度限制时移除
  if (!filteredChildren?.length && !isSelected) {
    return null;
  }

  return { ...node, children: filteredChildren };
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
    rootNode: injectCoursesRecursive(filteredRoot || partyKnowledgeGraph),
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
