import type { IRGraph } from './ir';

export type Severity = 'error' | 'warn';

export interface Diagnostic {
  id: string;
  severity: Severity;
  message: string;
}

export function validateIR(ir: IRGraph): Diagnostic[] {
  const diags: Diagnostic[] = [];
  if (!ir.nodes[ir.start]) {
    diags.push({
      id: 'start',
      severity: 'error',
      message: 'Invalid start state: not found in steps',
    });
  }
  // Simple unreachable check (naive): ensure every node except start is referenced by some next
  const referenced = new Set<string>([ir.start]);
  for (const n of Object.values(ir.nodes)) {
    if (n.next) referenced.add(n.next);
  }
  for (const id of Object.keys(ir.nodes)) {
    if (!referenced.has(id)) {
      diags.push({ id, severity: 'warn', message: 'Step may be unreachable' });
    }
  }
  return diags;
}
