import type { OrkestrSpec } from './spec';

export type IRNodeType = 'task' | 'choice' | 'parallel' | 'map' | 'wait' | 'end' | 'fail';

export interface IRNode {
  id: string;
  type: IRNodeType;
  next?: string;
  end?: boolean;
}

export interface IRGraph {
  id: string;
  start: string;
  nodes: Record<string, IRNode>;
}

export function toIR(spec: OrkestrSpec): IRGraph {
  const nodes: Record<string, IRNode> = {};
  for (const id of Object.keys(spec.steps)) {
    const step = spec.steps[id];
    nodes[id] = {
      id,
      type: step.type as IRNodeType,
      next: step.next,
      end: step.end,
    };
  }
  return { id: spec.id, start: spec.start, nodes };
}
