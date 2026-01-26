export function irToMermaid(ir: {
  id: string;
  nodes: Record<string, { id: string; type: string; next?: string }>;
}): string {
  const lines: string[] = ['flowchart TD'];
  for (const node of Object.values(ir.nodes)) {
    lines.push(`${node.id}([${node.id}:${node.type}])`);
    if (node.next) lines.push(`${node.id} --> ${node.next}`);
  }
  return lines.join('\n');
}
