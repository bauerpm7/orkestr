# Orkestr Monorepo

[![CI](https://github.com/bauerpm7/orkestr/actions/workflows/ci.yml/badge.svg)](https://github.com/bauerpm7/orkestr/actions/workflows/ci.yml)

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

## Project Guidance

- Copilot Instructions: [docs/Orkestr Copilot Instructions (V1).md](<docs/Orkestr%20Copilot%20Instructions%20(V1).md>)
- Product Requirements: [docs/Orkestr – Product Requirements Document (PRD).md](<docs/Orkestr%20%E2%80%93%20Product%20Requirements%20Document%20(PRD).md>)
- Technical Design: [docs/Orkestr Technical Design Architecture Spec.md](docs/Orkestr%20Technical%20Design%20Architecture%20Spec.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines, TDD workflow, and PR expectations.

## Code of Conduct

We follow a community Code of Conduct. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history and notes.
