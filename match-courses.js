const fs = require('fs');
const courses = JSON.parse(fs.readFileSync('backend-courses.json', 'utf8'));

// Define categories with keywords for each knowledge node
const categories = {
  'party-constitution': ['党章','共产党员','修养','党员义务','党员权利','入党誓词','党性','党员标准'],
  'party-history': ['党史','建党','百年','革命','南湖','红船','井冈山','改革开放','百年奋斗'],
  'party-theory': ['思想','理论','马克思','中国特色','新时代','十九大','精髓'],
  '20th-report': ['二十大','十九届','四中','全会','报告解读','五中全会'],
  'chinese-modernization': ['现代化','中国式','十三五','十四五','治理效能'],
  'comprehensive-strict-governance': ['从严治党','党的建设','伟大工程','治党','问责'],
  'membership-development': ['发展党员','入党','积极分子','预备党员','党员发展','发展对象','入党申请'],
  'party-life': ['组织生活','三会一课','主题党日','支部','党课','基层组织','支部大会'],
  'mass-work': ['群众','群众路线','调查研究','民心','民生'],
  'rural-policy': ['乡村振兴','农村','扶贫','脱贫','农业'],
  'rural-governance': ['治理','基层社会','基层治理','社会治理','新乡贤'],
  'integrity-education': ['廉政','反腐败','反腐','纪检','作风','四风','廉洁'],
  'supervision-discipline': ['监督','纪律','权力制约','监察','问责','巡视']
};

// Classify courses per category (no reuse)
const catCourses = {};
const usedCourseIds = new Set();

for (const cat of Object.keys(categories)) {
  const matched = courses.filter(c => {
    const name = c.Name || '';
    return categories[cat].some(kw => name.includes(kw)) && !usedCourseIds.has(c.Id);
  });
  
  // Take top 5 per category, mark as used
  const selected = matched.slice(0, 5);
  selected.forEach(c => usedCourseIds.add(c.Id));
  catCourses[cat] = selected;
}

// For categories with 0 courses, try again with broader keywords
const broadKeywords = {
  'membership-development': ['党员','入党','先锋','模范','积极分子'],
  'party-life': ['支部','组织','党课','基层','党务']
};

for (const cat of Object.keys(broadKeywords)) {
  if (catCourses[cat].length === 0) {
    const matched = courses.filter(c => {
      const name = c.Name || '';
      return broadKeywords[cat].some(kw => name.includes(kw)) && !usedCourseIds.has(c.Id);
    });
    const selected = matched.slice(0, 5);
    selected.forEach(c => usedCourseIds.add(c.Id));
    catCourses[cat] = selected;
  }
}

// Output results
console.log('=== Knowledge Node Course Mapping ===\n');

const nodeNames = {
  'party-constitution': '党章学习',
  'party-history': '党史学习',
  'party-theory': '党的创新理论',
  '20th-report': '二十大报告解读',
  'chinese-modernization': '中国式现代化',
  'comprehensive-strict-governance': '全面从严治党',
  'membership-development': '发展党员工作',
  'party-life': '党的组织生活',
  'mass-work': '群众工作方法',
  'rural-policy': '乡村振兴政策',
  'rural-governance': '乡村治理现代化',
  'integrity-education': '廉政教育',
  'supervision-discipline': '监督执纪体系'
};

for (const [cat, selected] of Object.entries(catCourses)) {
  console.log(`【${nodeNames[cat]}】(${selected.length} courses)`);
  selected.forEach((c, i) => {
    console.log(`  [${i+1}] ID:${c.Id} | ${c.Name} | ${c.Time}h | ${c.Teacher || ''}`);
  });
  console.log('');
}

// Save mapping as JSON for use in knowledge-graph.ts
const mapping = {};
for (const [cat, selected] of Object.entries(catCourses)) {
  mapping[cat] = selected.map(c => ({
    id: c.Id.toString(),
    title: c.Name,
    duration: Math.round((c.Time || 0) * 60), // convert hours to minutes
    teacher: c.Teacher || ''
  }));
}

fs.writeFileSync('course-mapping.json', JSON.stringify(mapping, null, 2));
console.log('Saved course mapping to course-mapping.json');
