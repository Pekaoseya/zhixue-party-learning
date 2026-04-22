const fs = require('fs');

// Read course mapping
const mapping = JSON.parse(fs.readFileSync('course-mapping.json', 'utf8'));

// Read current knowledge-graph.ts
const kgPath = 'src/lib/knowledge-graph.ts';
let content = fs.readFileSync(kgPath, 'utf8');

// Helper to generate courses array
function genCourses(nodeId) {
  const courses = mapping[nodeId] || [];
  if (courses.length === 0) return '';
  const items = courses.map(c => 
    `            { id: '${c.id}', title: '${c.title.replace(/'/g, "\\'")}', duration: ${c.duration}, videoId: '${c.id}' }`
  ).join(',\n');
  return `\n          courses: [\n${items}\n          ],`;
}

// Update each leaf node with courses
const nodes = [
  'party-constitution', 'party-history', 'party-theory',
  '20th-report', 'chinese-modernization', 'comprehensive-strict-governance',
  'membership-development', 'party-life', 'mass-work',
  'rural-policy', 'rural-governance',
  'integrity-education', 'supervision-discipline'
];

for (const nodeId of nodes) {
  // Find the node definition pattern
  const pattern = new RegExp(`(id: '${nodeId}',[^}]*?)(keyPoints:)`, 's');
  const match = content.match(pattern);
  
  if (match) {
    const before = match[1];
    const after = match[2];
    const coursesBlock = genCourses(nodeId);
    
    // Insert courses before keyPoints
    const replacement = before + coursesBlock + '\n          ' + after;
    content = content.replace(pattern, replacement);
  }
}

// Write updated content
fs.writeFileSync(kgPath, content);
console.log('Updated knowledge-graph.ts with courses for all leaf nodes');
