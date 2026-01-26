# Contributing to Orkestr

Thanks for your interest in contributing! This project aims to provide developer tooling to design, validate, test, visualize, and generate workflow artifacts (Temporal first) with no runtime services.

## Prerequisites

- Node.js 20+
- pnpm (preferred) — see packageManager in the root package.json
- macOS/Linux recommended; Windows may work with WSL

## Getting Started

1. Fork the repo and create a feature branch:
   - Branch naming: feat/..., fix/..., chore/..., docs/...
2. Install and build:
   ```bash
   pnpm install
   pnpm -r run build
   ```
3. Run tests and checks:
   ```bash
   pnpm -r run test
   pnpm -r run lint
   pnpm run format:check
   ```

## Development Workflow (TDD)

- Write tests first for new functionality (unit or integration as appropriate).
- Add minimal implementation to pass tests.
- Prefer pure functions and deterministic outputs; use snapshots only when representation stability is intentional.
- Keep changes aligned with the PRD and Technical Design specs in docs/.

## Project Structure

- packages/core: Spec, IR, validation, simulator
- packages/cli: CLI entry points (validate, test, diagram, build)
- packages/diagrams: IR → Mermaid/DOT
- packages/targets/temporal: Temporal artifact generator
- examples/workflows: Example specs

## Commit & PR Guidelines

- Use clear, conventional commit messages (suggested):
  - feat(core): add validation rule for unreachable steps
  - fix(cli): correct exit code on errors
  - docs: add contribution guide
- Keep PRs focused and small; include tests and docs updates.
- Update the priorities checklist when completing tasks: see docs/Orkestr Priorities Checklist.md.
- Link PRs to relevant sections in the PRD and Technical Design.

## Testing & Coverage

- Jest is configured with ts-jest; minimal global coverage thresholds are enforced.
- Run tests locally and ensure coverage passes:
  ```bash
  pnpm -r run test
  ```
- CLI integration tests run the built binary; ensure pnpm -r run build succeeds before testing.

## Linting & Formatting

- ESLint (flat config) and Prettier are enforced; CI runs lint and format checks.
- Format locally before committing:
  ```bash
  pnpm run format
  ```

## Diagrams & Artifacts

- Diagrams: ensure deterministic Mermaid output in packages/diagrams.
- Temporal target: generator writes workflow/activity stubs and orkestr-target.json; tests verify files and JSON shape.

## Opening Issues

- Use GitHub Issues for bugs and feature requests.
- Provide reproduction steps and reference spec/IR when relevant.

## Code of Conduct

- Be respectful and collaborative. A formal Code of Conduct may be added; until then, follow the spirit of the Contributor Covenant.

## License

- License will be defined upon open sourcing. Until then, contributions are assumed under the repository’s future license.
