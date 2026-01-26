# Orkestr — Priorities Checklist (V1)

Use this checklist to track V1 delivery. Mark items complete as you go. Priority labels: P0 (must-have), P1 (nice-to-have), P2 (later).

## Updating Protocol

- Always check off completed tasks with `[x]` immediately after merging related changes.
- Do not check items that are only partially complete; add a brief note instead.
- Keep this checklist as the single source of progress; update it as part of PRs.

## Foundation

- [x] P0: Define Spec schema (JSON Schema/zod) with versioning
- [x] P0: Implement Spec → IR normalization (nodes, edges, labels)
- [x] P0: Validation engine (initial rules + diagnostics API)
- [x] P0: Deterministic simulator with trace recording
- [ ] P0: Golden test harness (Jest snapshots)

## CLI

- [x] P0: `validate` — parse, IR, validations, non-zero on errors
- [ ] P0: `test` — scenarios + snapshots, `--update`
- [x] P0: `diagram` — IR → Mermaid/DOT, `--out`
- [x] P0: `build` — IR → target artifacts, `--target temporal`, `--out`
- [ ] P1: `--json` machine-readable output for all commands

## Temporal Target

- [x] P0: Map core step types to Temporal TS scaffolds
- [x] P0: Generate workflow file + activity skeletons
- [x] P0: Emit compatibility diagnostics file (`orkestr-target.json`)
- [ ] P1: Configurable activity options via engine hints

## Diagrams

- [x] P1: Mermaid output with step types + edge labels
- [ ] P2: DOT output + visual diff support

## Examples & Docs

- [x] P0: Example workflows in `examples/workflows`
- [ ] P0: Docs for Spec, IR, CLI usage
- [ ] P1: Temporal artifact usage README in generated output

## CI Integration

- [x] P0: Validate + test workflows in CI
- [x] P1: Build artifacts in CI to verify generation

## Quality

- [x] P0: Unit tests for normalization, validation, simulator
- [ ] P1: Snapshot tests for diagrams and artifacts
- [x] P1: Code style + lint configuration

## Acceptance (V1)

- [x] P0: Example workflows validate, test, diagram, and build to Temporal
- [x] P0: No runtime/hosted services; tooling-only delivery
- [x] P0: Clear diagnostics for validation and target compatibility
