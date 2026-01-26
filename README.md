# Orkestr Monorepo

TypeScript workspaces for core tooling, CLI, diagram generation, and engine targets (Temporal first).

## Packages

- @orkestr/core — Spec, IR, validation, simulator
- @orkestr/cli — CLI commands
- @orkestr/diagrams — IR → Mermaid/DOT
- @orkestr/targets-temporal — Temporal artifact generation

## Quick Start

```bash
# Install deps
npm install

# Build all packages
npm run build

# Run CLI (after build)
node packages/cli/dist/index.js --help
```
