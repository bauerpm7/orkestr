import type { IRGraph } from './ir';

export interface ExecutionTrace {
  path: string[];
}

export function simulate(ir: IRGraph): ExecutionTrace {
  const path: string[] = [];
  let current = ir.start;
  const guard = new Set<string>();
  while (current) {
    if (guard.has(current)) break; // prevent infinite loops in this naive simulator
    guard.add(current);
    path.push(current);
    const node = ir.nodes[current];
    if (!node) break;
    if (node.end) break;
    current = node.next ?? '';
  }
  return { path };
}
