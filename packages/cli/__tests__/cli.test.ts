import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

describe('CLI integration', () => {
  const distBin = path.resolve(__dirname, '../../cli/dist/index.js');

  it('validate returns OK and exit code 0', () => {
    const spec = path.resolve(__dirname, '../../../examples/workflows/order_fulfillment.yaml');
    const result = spawnSync('node', [distBin, 'validate', spec], {
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('OK');
  });

  it('diagram writes mermaid file to output dir', () => {
    const spec = path.resolve(__dirname, '../../../examples/workflows/order_fulfillment.yaml');
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'orkestr-cli-diagram-'));
    const result = spawnSync('node', [distBin, 'diagram', spec, '--out', tmp], {
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    // expect a file ending with .mmd under tmp
    const files = fs.readdirSync(tmp);
    const hasMmd = files.some((f) => f.endsWith('.mmd'));
    expect(hasMmd).toBe(true);
  });
});
