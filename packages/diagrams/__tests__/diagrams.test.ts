import { irToMermaid } from '../src';

describe('diagrams.irToMermaid', () => {
  const ir = {
    id: 'order_fulfillment',
    nodes: {
      charge_card: { id: 'charge_card', type: 'task', next: 'reserve_inventory' },
      reserve_inventory: { id: 'reserve_inventory', type: 'task', next: 'ship_order' },
      ship_order: { id: 'ship_order', type: 'task' },
    },
  };

  it('renders flowchart header, nodes, and edges', () => {
    const mmd = irToMermaid(ir);
    expect(mmd).toContain('flowchart TD');
    expect(mmd).toContain('charge_card([charge_card:task])');
    expect(mmd).toContain('reserve_inventory([reserve_inventory:task])');
    expect(mmd).toContain('ship_order([ship_order:task])');
    expect(mmd).toContain('charge_card --> reserve_inventory');
    expect(mmd).toContain('reserve_inventory --> ship_order');
  });
});
