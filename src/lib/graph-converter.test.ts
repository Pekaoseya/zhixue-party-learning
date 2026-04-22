import { partyKnowledgeGraph } from './knowledge-graph';
import { graphToDBFormat, dbToGraphFormat, GraphToDBResult } from './graph-converter';

// 测试转换和还原功能
function testGraphConversion() {
  console.log('=== 开始测试知识图谱转换功能 ===');
  
  // 1. 转换为数据库格式
  console.log('1. 将知识图谱转换为数据库格式...');
  const dbFormat: GraphToDBResult = graphToDBFormat(partyKnowledgeGraph);
  
  console.log(`   - 生成的节点数量: ${dbFormat.nodes.length}`);
  console.log(`   - 生成的课程内容数量: ${dbFormat.courseContents.length}`);
  console.log(`   - 生成的关联文档数量: ${dbFormat.relatedDocs.length}`);
  console.log(`   - 生成的关键点数量: ${dbFormat.keyPoints.length}`);
  
  // 2. 从数据库格式还原
  console.log('\n2. 从数据库格式还原知识图谱...');
  const restoredGraph = dbToGraphFormat(
    dbFormat.nodes,
    dbFormat.prerequisites,
    dbFormat.courseContents,
    dbFormat.relatedDocs,
    dbFormat.keyPoints
  );
  
  // 3. 验证还原结果
  console.log('\n3. 验证还原结果...');
  
  // 验证根节点
  const rootMatches = partyKnowledgeGraph.id === restoredGraph.id &&
                     partyKnowledgeGraph.name === restoredGraph.name &&
                     partyKnowledgeGraph.level === restoredGraph.level;
  console.log(`   - 根节点匹配: ${rootMatches}`);
  
  // 验证节点数量
  function countNodes(node: any): number {
    let count = 1;
    if (node.children) {
      for (const child of node.children) {
        count += countNodes(child);
      }
    }
    return count;
  }
  
  const originalCount = countNodes(partyKnowledgeGraph);
  const restoredCount = countNodes(restoredGraph);
  console.log(`   - 原始节点数量: ${originalCount}`);
  console.log(`   - 还原节点数量: ${restoredCount}`);
  console.log(`   - 节点数量匹配: ${originalCount === restoredCount}`);
  
  // 验证课程内容
  function countCourseContents(node: any): number {
    let count = node.content ? 1 : 0;
    if (node.children) {
      for (const child of node.children) {
        count += countCourseContents(child);
      }
    }
    return count;
  }
  
  const originalContentCount = countCourseContents(partyKnowledgeGraph);
  const restoredContentCount = countCourseContents(restoredGraph);
  console.log(`   - 原始课程内容数量: ${originalContentCount}`);
  console.log(`   - 还原课程内容数量: ${restoredContentCount}`);
  console.log(`   - 课程内容数量匹配: ${originalContentCount === restoredContentCount}`);
  
  console.log('\n=== 测试完成 ===');
  
  // 检查是否所有测试都通过
  const allTestsPassed = rootMatches &&
                         originalCount === restoredCount &&
                         originalContentCount === restoredContentCount;
  
  if (allTestsPassed) {
    console.log('✅ 所有测试通过！知识图谱转换和还原功能正常。');
  } else {
    console.log('❌ 测试失败！知识图谱转换和还原功能存在问题。');
  }
  
  return allTestsPassed;
}

// 运行测试
testGraphConversion();
