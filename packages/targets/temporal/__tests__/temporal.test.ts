import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { generateTemporalArtifacts } from '@orkestr/targets-temporal';

describe('targets-temporal.generateTemporalArtifacts', () => {
  const ir = {
    id: 'order_fulfillment',
    nodes: {
      charge_card: { id: 'charge_card', type: 'task', next: 'reserve_inventory' },
      reserve_inventory: { id: 'reserve_inventory', type: 'task', next: 'ship_order' },
      ship_order: { id: 'ship_order', type: 'task', end: true },
    },
  };

  it('writes workflow, activities, and diagnostics', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'orkestr-temporal-'));
    const { outDir } = generateTemporalArtifacts(ir as any, tmp);

    const wfFile = path.join(outDir, 'workflows', `${ir.id}.ts`);
    const actCharge = path.join(outDir, 'activities', 'charge_card.ts');
    const actReserve = path.join(outDir, 'activities', 'reserve_inventory.ts');
    const actShip = path.join(outDir, 'activities', 'ship_order.ts');
    const diagFile = path.join(outDir, 'orkestr-target.json');

    expect(fs.existsSync(wfFile)).toBe(true);
    expect(fs.existsSync(actCharge)).toBe(true);
    expect(fs.existsSync(actReserve)).toBe(true);
    expect(fs.existsSync(actShip)).toBe(true);
    expect(fs.existsSync(diagFile)).toBe(true);

    const diag = JSON.parse(fs.readFileSync(diagFile, 'utf8'));
    expect(diag).toMatchObject({ target: 'temporal', workflow: ir.id });
  });
});
