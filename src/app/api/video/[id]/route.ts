import { getNodeById, partyKnowledgeGraph } from '@/lib/knowledge-graph';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const node = getNodeById(id, partyKnowledgeGraph);
  
  if (!node?.content) {
    return Response.json({ error: 'Video not found' }, { status: 404 });
  }
  
  return Response.json({
    id: node.content.id,
    title: node.content.title,
    type: node.content.type,
    duration: node.content.duration,
    summary: node.content.summary,
    url: node.content.url,
  });
}
