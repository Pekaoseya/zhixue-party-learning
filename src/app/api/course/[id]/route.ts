import { getNodeById, partyKnowledgeGraph } from '@/lib/knowledge-graph';
import type { KnowledgeNode } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const node = getNodeById(id, partyKnowledgeGraph);
  
  if (!node) {
    return Response.json({ error: 'Node not found' }, { status: 404 });
  }
  
  return Response.json({ node });
}
