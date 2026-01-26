# Orkestr — Copilot Implementation Instructions (V1)

Owner: Mike Bauer

Purpose: Implement Orkestr as a developer tooling framework to design, validate, test, visualize, and generate workflow artifacts — Temporal first — without introducing any runtime or hosted services.

Scope: V1 foundation only. Focus on Spec + IR, validation, deterministic simulator + golden tests, CLI, basic diagramming, Temporal target artifact generation, and documentation.

---

## Guiding Principles

- Tooling over runtime: no servers, no control plane.
- Engine-neutral core; engine-specific logic isolated behind targets.
- Explicit control flow; predictable behavior; fast feedback.
- Additive evolution: versioned spec, minimal breaking changes.

## Test-Driven Development (TDD)

- Write failing unit tests first for new behavior, then implement the minimum code to pass.
- Cover core transformations (`parseSpec()`, `toIR()`, `validateIR()`, `simulate()`) with focused tests.
- Add artifact generation tests (e.g., Temporal) that verify files and machine-readable diagnostics.
- Prefer deterministic, pure functions; use snapshots only where representation stability is intended.
- CI gates must run `build`, `test`, `lint`, and `format:check` and fail on test changes without explicit `--update` when snapshots are introduced.

## Source of Truth

- The PRD and Technical Design Architecture Spec are the authoritative source of truth for scope, requirements, and implementation details.
- If any ambiguity or conflict arises, defer to these documents and request clarification rather than guessing.
- Keep implementations aligned with the product principles and V1 scope defined in these docs.

## Recommended Stack (V1)

- Language: TypeScript (Node 18+)
- Monorepo: pnpm (or npm) workspaces
- CLI: `commander` or `bunyan`-style logging; prefer `commander`
- Parsing: `yaml` (for YAML), `ajv` or `zod` for schema validation
- Graph modeling: `graphlib` or lightweight in-house
- Testing: `jest` + snapshot tests (golden tests)
- Diagrams: output Mermaid (`.md` or `.mmd`) and optional DOT

Directory layout (suggested):

```
packages/
  core/               # Spec, IR, validation, simulator
  cli/                # CLI commands; thin wrappers over core
  targets/temporal/   # Temporal artifact generator
  diagrams/           # IR → Mermaid/DOT
examples/
  workflows/          # Example specs + tests
```

---

## Deliverables (V1)

- Orkestr Spec definition + schema (YAML/JSON, versioned)
- IR model + normalization (engine-agnostic graph)
- Static validation engine (diagnostics)
- Deterministic simulator with execution traces
- Golden test harness (snapshot-based)
- CLI commands: `validate`, `test`, `diagram`, `build`
- Temporal target: generate minimal TS workflow/activity skeletons
- Documentation + examples; CI usage

---

## Spec (Authoring Format)

- Format: YAML or JSON.
- Top-level fields: `id`, `version` (spec version), `start`, `steps`.
- `steps`: map keyed by step id.
- Core step types: `task`, `choice`, `parallel`, `map`, `wait`, `end`, `fail`.
- Transitions: `next`, `branches` (parallel), `cases` + `default` (choice), `end: true`.
- Engine hints: optional `engineHints.<engine>` object; ignored by core validation/simulation.

Example (minimal):

```yaml
id: order_fulfillment
version: v1
start: charge_card
steps:
  charge_card:
    type: task
    next: reserve_inventory
  reserve_inventory:
    type: task
    next: ship_order
  ship_order:
    type: task
    end: true
```

Schema: implement JSON Schema (or zod) for structural checks and versioning.

---

## IR (Intermediate Representation)

- Normalize Spec → IR graph:
  - Nodes: `id`, `type`, `metadata`, `engineHints` (opaque), `params`.
  - Edges: explicit transitions with labels (e.g., choice case labels).
  - Subflows: represent composition via nested graphs or explicit boundaries.
- Properties:
  - Engine-agnostic; fully explicit transitions; no implicit defaults.
  - Stable for analysis/testing; independent of authoring conveniences.

Implementation: TypeScript interfaces + pure transformation functions from Spec → IR.

---

## Validation Engine

Return diagnostics with shape: `{ id, severity: 'error'|'warn', message, location? }`.

- Rules (initial set):
  - Missing/invalid `start` state.
  - Undefined step references (`next`, `cases`, `branches`).
  - Unreachable/orphaned steps.
  - Steps with no valid exit paths.
  - `choice` without `default` case.
  - Flows that never terminate.
  - Cycles without explicit intent/safeguards.
- Design:
  - Operate on IR; pure functions; no I/O.
  - Machine-readable output (`--json`) option via CLI.

---

## Deterministic Simulator

- Input: IR + stubs/mocks for `task` steps.
- Behavior:
  - Deterministic traversal; record execution trace: `{path: [stepIds], outputs, timestamps?}`.
  - Support control flow for `choice`, `parallel` (serializable strategy), `map`, `wait` (mocked), `end/fail`.
- Golden tests:
  - Snapshot expected trace(s) per scenario.
  - `--update` to refresh snapshots intentionally.

---

## CLI Commands

- `orkestr validate <specs...>`: parse → IR → validate → print diagnostics; non-zero exit on errors.
- `orkestr test <spec> [--update] [--scenario <name>]`: run simulator; compare to snapshots.
- `orkestr diagram <spec> --out <dir>`: IR → Mermaid/DOT; write files.
- `orkestr build <spec> --target temporal --out <dir> [--json]`: IR → Target → artifacts + compatibility diagnostics.
- Common flags: `--json`, `--verbose`, `--fail-on-warn`.

Implementation: Thin CLI that delegates to `packages/core` APIs.

---

## Commit & PR Etiquette

- Copilot must not commit or push changes autonomously.
- Copilot can suggest commit points and provide exact commands, but a human must execute them.
- Suggested flow:
  1. Stage changes:

  ```bash
  git add -A
  ```

  2. Commit with a clear message:

  ```bash
  git commit -m "feat(core): add IR validation rules (P0)"
  ```

  3. Create a branch and push:

  ```bash
  git checkout -b feat/ir-validation
  git push -u origin feat/ir-validation
  ```

  4. Open a PR and link to relevant sections in the PRD and Technical Spec.

## Temporal Target (Initial)

- Map IR constructs to Temporal TypeScript SDK scaffolds:
  - Generate workflow file with states and transitions.
  - Generate activity interfaces/skeletons for `task` nodes.
  - Emit diagnostics when IR cannot be faithfully mapped.
- Output structure:

```
<out>/temporal/
  workflows/<id>.ts
  activities/<id>.ts     # per task step
  orkestr-target.json    # mapping & diagnostics
```

- Note: do not execute workflows; generation only.

---

## Diagram Generation

- IR → Mermaid (`flowchart TD`) with explicit edges and labels.
- Optional DOT output.
- Include step type and termination markers.

---

## CI Integration

- Usage in CI:

```
orkestr validate examples/workflows/*.yaml
orkestr test examples/workflows/*.yaml
orkestr build examples/workflows/order.yaml --target temporal --out generated/
```

- Enforce non-zero exit on validation errors and test failures.

---

## Quality & Maintenance

- Prefer pure functions; isolate I/O in CLI and target writers.
- Additive evolution: versioned spec; avoid breaking IR APIs.
- Clear scope boundaries; no runtime execution.
- Diagnostics over silent fallback when incompatibilities are found.

---

## Milestone Acceptance (V1)

- Validates and tests example workflows in `examples/workflows`.
- Generates Temporal artifacts for core step types.
- Produces diagrams for examples.
- Documented CLI usage; passes unit + snapshot tests.

---

## Notes

- Keep engine hints opaque in core; targets may interpret them.
- Favor machine-readable outputs alongside human-readable logs.
- Diagrams are supportive; correctness comes from validation/tests.
