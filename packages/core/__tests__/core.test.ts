import { parseSpec } from '../src/spec-format';
import { toIR } from '../src/ir';
import { validateIR } from '../src/validate';
import { simulate } from '../src/simulate';

const spec = {
  id: 'order_fulfillment',
  version: 'v1',
  start: 'charge_card',
  steps: {
    charge_card: { type: 'task', next: 'reserve_inventory' },
    reserve_inventory: { type: 'task', next: 'ship_order' },
    ship_order: { type: 'task', end: true },
  },
};

test('parse, IR, validate, simulate', () => {
  const parsed = parseSpec(spec);
  const ir = toIR(parsed);
  const diags = validateIR(ir);
  expect(diags.find((d) => d.severity === 'error')).toBeUndefined();
  const trace = simulate(ir);
  expect(trace.path).toEqual([
    'charge_card',
    'reserve_inventory',
    'ship_order',
  ]);
});
