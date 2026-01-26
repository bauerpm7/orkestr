# Orkestr Monorepo

TypeScript workspaces for core tooling, CLI, diagram generation, and engine targets (Temporal first).

## Packages

- @orkestr/core — Spec, IR, validation, simulator
- @orkestr/cli — CLI commands
- @orkestr/diagrams — IR → Mermaid/DOT
- @orkestr/targets-temporal — Temporal artifact generation

## Quick Start (pnpm)

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r run build

# Run tests
pnpm -r run test

# Run CLI (after build)
node packages/cli/dist/index.js --help
```
