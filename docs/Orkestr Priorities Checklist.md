# Orkestr — Priorities Checklist (V1)

Use this checklist to track V1 delivery. Mark items complete as you go. Priority labels: P0 (must-have), P1 (nice-to-have), P2 (later).

## Foundation

- [ ] P0: Define Spec schema (JSON Schema/zod) with versioning
- [ ] P0: Implement Spec → IR normalization (nodes, edges, labels)
- [ ] P0: Validation engine (initial rules + diagnostics API)
- [ ] P0: Deterministic simulator with trace recording
- [ ] P0: Golden test harness (Jest snapshots)

## CLI

- [ ] P0: `validate` — parse, IR, validations, non-zero on errors
- [ ] P0: `test` — scenarios + snapshots, `--update`
- [ ] P0: `diagram` — IR → Mermaid/DOT, `--out`
- [ ] P0: `build` — IR → target artifacts, `--target temporal`, `--out`
- [ ] P1: `--json` machine-readable output for all commands

## Temporal Target

- [ ] P0: Map core step types to Temporal TS scaffolds
- [ ] P0: Generate workflow file + activity skeletons
- [ ] P0: Emit compatibility diagnostics file (`orkestr-target.json`)
- [ ] P1: Configurable activity options via engine hints

## Diagrams

- [ ] P1: Mermaid output with step types + edge labels
- [ ] P2: DOT output + visual diff support

## Examples & Docs

- [ ] P0: Example workflows in `examples/workflows`
- [ ] P0: Docs for Spec, IR, CLI usage
- [ ] P1: Temporal artifact usage README in generated output

## CI Integration

- [ ] P0: Validate + test workflows in CI
- [ ] P1: Build artifacts in CI to verify generation

## Quality

- [ ] P0: Unit tests for normalization, validation, simulator
- [ ] P1: Snapshot tests for diagrams and artifacts
- [ ] P1: Code style + lint configuration

## Acceptance (V1)

- [ ] P0: Example workflows validate, test, diagram, and build to Temporal
- [ ] P0: No runtime/hosted services; tooling-only delivery
- [ ] P0: Clear diagnostics for validation and target compatibility
