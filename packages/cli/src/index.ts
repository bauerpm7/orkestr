#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { parseSpec, toIR, validateIR, simulate } from '@orkestr/core';
import { generateTemporalArtifacts } from '@orkestr/targets-temporal';

const program = new Command();
program.name('orkestr').description('Orkestr CLI').version('0.1.0');

function loadSpec(file: string) {
  const text = fs.readFileSync(file, 'utf8');
  const data =
    file.endsWith('.yaml') || file.endsWith('.yml') ? YAML.parse(text) : JSON.parse(text);
  return parseSpec(data);
}

program
  .command('validate')
  .argument('<spec...>', 'Spec files (yaml/json)')
  .action((specs: string[]) => {
    let hadError = false;
    for (const s of specs) {
      const spec = loadSpec(s);
      const ir = toIR(spec);
      const diags = validateIR(ir);
      if (diags.length) {
        console.log(`Diagnostics for ${s}:`);
        for (const d of diags) {
          console.log(`- [${d.severity}] ${d.id}: ${d.message}`);
          if (d.severity === 'error') hadError = true;
        }
      } else {
        console.log(`${s}: OK`);
      }
    }
    process.exit(hadError ? 1 : 0);
  });

program
  .command('test')
  .argument('<spec>', 'Spec file')
  .option('--update', 'Update snapshots (not implemented in CLI stub)')
  .action((specPath: string) => {
    const spec = loadSpec(specPath);
    const ir = toIR(spec);
    const trace = simulate(ir);
    console.log(JSON.stringify(trace, null, 2));
  });

program
  .command('diagram')
  .argument('<spec>', 'Spec file')
  .option('--out <dir>', 'Output directory', 'artifacts/diagrams')
  .action((specPath: string, opts: { out: string }) => {
    const spec = loadSpec(specPath);
    const ir = toIR(spec);
    const lines: string[] = ['flowchart TD'];
    for (const node of Object.values(ir.nodes)) {
      lines.push(`${node.id}([${node.id}:${node.type}])`);
      if (node.next) lines.push(`${node.id} --> ${node.next}`);
    }
    const outDir = path.resolve(opts.out);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${ir.id}.mmd`);
    fs.writeFileSync(outFile, lines.join('\n'));
    console.log(`Wrote ${outFile}`);
  });

program
  .command('build')
  .argument('<spec>', 'Spec file')
  .option('--target <name>', 'Target engine', 'temporal')
  .option('--out <dir>', 'Output directory', 'generated')
  .action((specPath: string, opts: { target: string; out: string }) => {
    const spec = loadSpec(specPath);
    const ir = toIR(spec);
    if (opts.target !== 'temporal') {
      console.error('Only temporal target is implemented in V1 stub');
      process.exit(1);
    }
    const result = generateTemporalArtifacts(ir as any, opts.out);
    console.log(`Generated Temporal artifacts at ${result.outDir}`);
  });

program.parse();
