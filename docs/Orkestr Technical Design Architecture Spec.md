# Orkestr Technical Design / Architecture Spec

Owner: Mike Bauer

# Orkestr Specification (Draft)

## 1. Overview

Orkestr is a **workflow developer tooling toolkit**.

It helps developers **design, validate, test, visualize, and generate** workflow definitions for one or more workflow engines (Temporal, Step Functions, Argo, etc.) **without Orkestr running a workflow runtime itself**.

Orkestr is closer to **TypeScript/ESLint/Jest** than it is to “another orchestrator.”

Orkestr is a developer tooling framework for designing, validating, testing, visualizing, and generating workflows across orchestration engines such as Temporal, AWS Step Functions, and Argo.

Orkestr does not execute workflows or replace existing workflow engines. Instead, it provides a higher-level workflow definition and tooling layer that makes workflows easier to reason about, safer to change, and more consistent across platforms.

Conceptually, Orkestr is closer to **TypeScript, ESLint, and Jest for workflows** than it is to another orchestrator: it improves correctness, clarity, and developer experience around workflows without owning runtime execution.

---

## 2. Problem Statement

Modern distributed systems increasingly rely on workflows to coordinate long-running, asynchronous, and failure-prone processes. While powerful workflow engines exist, the tooling around them remains fragmented and tightly coupled to individual platforms.

As a result:

- Workflow logic is embedded in engine-specific code or configuration, making it difficult to review and reason about
- Validation and testing approaches vary widely across engines, often leaving correctness to be discovered at runtime
- Teams duplicate tooling and patterns across different orchestration platforms
- Refactoring or evolving workflows is risky, discouraging improvement and leading to brittle systems

The industry has strong execution engines, but lacks a unified layer for **designing, validating, testing, and reasoning about workflows themselves**.

Orkestr exists to fill this gap.

---

## 3. Non-goals

Orkestr is designed to:

### Unify workflow tooling across engines

Provide a consistent framework for validating, testing, visualizing, and generating workflows regardless of the underlying orchestration platform.

### Make workflow design simpler and safer

Allow developers to express workflow logic in a clear, engine-neutral format that emphasizes business intent over platform syntax.

### Improve correctness and maintainability

Catch logical errors before deployment through static validation and deterministic simulation, reducing production risk.

### Enable workflows to be treated as first-class software artifacts

Make workflows reviewable, testable, and versionable like any other critical part of the system.

### Generate production-ready artifacts

Produce real, executable workflow definitions for supported engines, not just documentation or diagrams.

---

## 4. Non-Goals

Orkestr explicitly does not aim to:

- Execute workflows or act as a workflow runtime
- Provide a hosted service, control plane, or operational infrastructure
- Replace existing workflow engines such as Temporal or Step Functions
- Guarantee full semantic portability between all orchestration platforms
- Abstract away all engine-specific capabilities or differences
- Take on operational concerns such as scaling, uptime, or data persistence

Orkestr is intentionally scoped as a **tooling and design layer**, not a platform or service.

## 5. Core Concepts

Orkestr is built around a small set of core concepts that separate **workflow intent**, **workflow reasoning**, and **workflow execution**, allowing each to evolve independently.

### Orkestr Spec

The Orkestr Spec is a human-readable, engine-neutral format for defining workflow logic.

It is designed to:

- express business intent clearly
- avoid coupling to any specific orchestration engine
- prioritize readability and reviewability
- serve as the primary interface for developers

The spec describes *what should happen* in a workflow, without prescribing *how a specific engine must implement it*.

---

### Intermediate Representation (IR)

The Intermediate Representation (IR) is Orkestr’s internal, normalized model of a workflow derived from the Orkestr Spec.

The IR is:

- engine-agnostic
- structurally explicit (all nodes, transitions, and paths are fully defined)
- optimized for analysis rather than authoring

All validation, testing, simulation, visualization, and target generation in Orkestr operates on the IR, making it the foundation of Orkestr’s correctness guarantees.

---

### Targets

Targets are responsible for converting Orkestr’s IR into engine-specific workflow artifacts.

Each target:

- understands how to express a subset of IR constructs in a given engine
- emits production-ready definitions for that engine
- reports compatibility diagnostics when parts of the workflow cannot be faithfully represented

Targets isolate engine-specific logic from Orkestr’s core, allowing Orkestr to remain engine-neutral while still producing real, deployable outputs.

---

### Artifacts

Artifacts are the concrete, executable workflow definitions generated by Orkestr for a specific orchestration engine.

Examples include:

- Temporal workflow code
- AWS Step Functions state machine definitions
- Argo WorkflowTemplates

Artifacts are not documentation or visualizations — they are the files that get deployed and executed by workflow engines in production.

---

### Why this separation matters

By separating:

- Spec (developer intent)
- IR (workflow reasoning)
- Targets & Artifacts (engine execution)

Orkestr enables:

- unified tooling across platforms
- safer changes through centralized validation and testing
- portability of design without forcing portability of execution
- low operational and maintenance overhead

This separation is what allows Orkestr to improve workflow correctness and developer experience without becoming another workflow runtime.

---

## 6. Orkestr Spec Format

The Orkestr Spec defines how developers describe workflows in a clear, engine-neutral way.

It is intentionally designed to:

- emphasize business logic over platform mechanics
- be readable and reviewable by humans
- remain stable even as underlying workflow engines evolve
- serve as the primary input for all Orkestr tooling

The spec is expressed in YAML or JSON and models workflows as a directed graph of steps with explicit control flow.

---

### Design Principles

The Orkestr Spec is guided by the following principles:

**Clarity over completeness**

The spec prioritizes being easy to read and reason about over exposing every possible engine feature.

**Engine neutrality by default**

Core constructs are not tied to any orchestration platform. Engine-specific behavior is expressed only through explicit, optional hints.

**Explicit control flow**

All transitions between steps are visible and declared, avoiding implicit or hidden behavior.

**Composable structure**

Workflows can be broken into reusable subflows without duplicating logic.

---

### Core Step Types

The spec supports a small, expressive set of step types that map cleanly to most workflow engines:

- **Task** — perform a unit of work
- **Choice** — branch based on conditions
- **Parallel** — execute branches concurrently
- **Map** — apply a subflow to a collection
- **Wait** — delay or wait for an external signal
- **End / Fail** — terminate the workflow successfully or with error

This constrained set is intentional: it enables strong validation and predictable behavior across engines.

---

### Minimal Example

```yaml
id:order_fulfillment
start:charge_card

steps:
charge_card:
type:task
next:reserve_inventory

reserve_inventory:
type:task
next:ship_order

ship_order:
type:task
end:true

```

This example defines a simple, linear workflow with three steps and explicit control flow.

---

### Engine Hints

While the Orkestr Spec is engine-neutral by default, engine-specific behavior can be expressed through optional engine hints.

Example:

```yaml
charge_card:
type:task
next:reserve_inventory
engineHints:
temporal:
activity:
startToCloseTimeout:30s
taskQueue:payments

```

Engine hints:

- are scoped explicitly to a given engine
- do not affect Orkestr’s core validation or simulation
- allow advanced tuning without compromising portability

---

### Stability and Evolution

The Orkestr Spec is versioned and designed to evolve additively.

This ensures:

- older specs remain valid as Orkestr grows
- breaking changes are rare and intentional
- tooling can support multiple spec versions concurrently if needed

---

### Why this matters

By separating workflow intent from engine implementation details, the Orkestr Spec enables:

- safer workflow evolution
- clearer reviews and audits
- engine-agnostic validation and testing
- and more maintainable workflow systems overall

---

## 7. Validation & Testing Model

Orkestr treats workflows as first-class software artifacts that must be validated and tested with the same rigor as application code.

Rather than relying on runtime failures or engine-specific test harnesses, Orkestr provides a unified, engine-neutral framework for verifying workflow correctness before deployment.

---

### Static Validation

Orkestr performs static analysis on the workflow’s Intermediate Representation (IR) to identify logical errors and unsafe patterns early.

Examples of validations include:

- Missing or invalid start states
- References to undefined steps
- Unreachable or orphaned steps
- Steps with no valid exit paths
- Invalid branching logic (e.g., Choice without a default)
- Inconsistent termination (e.g., flows that never end)
- Cycles without explicit intent or safeguards

These checks are engine-agnostic and focus on workflow logic itself, not platform-specific constraints.

Static validation allows teams to catch entire classes of errors before a workflow is ever deployed or executed.

---

### Deterministic Simulation

In addition to static checks, Orkestr provides a deterministic local simulator that can execute workflows at the IR level.

The simulator:

- traverses the workflow graph deterministically
- executes steps using developer-provided stubs or mocks
- records execution traces including paths taken and outputs produced
- does not require any external services or workflow engines

This enables fast, repeatable testing of workflow behavior without running Temporal, Step Functions, or other platforms locally.

---

### Golden Tests

Orkestr supports “golden tests” for workflows, where expected execution paths and outcomes are captured as snapshots and verified in CI.

Golden tests allow teams to:

- assert which steps should or should not execute under given conditions
- validate error paths and compensations
- detect unintended behavioral changes during refactors
- treat workflow logic with the same discipline as application logic

This makes workflow changes reviewable, auditable, and safe to evolve over time.

---

### CI Integration

Orkestr is designed to integrate naturally into CI pipelines.

Typical CI usage includes:

```bash
orkestr validate workflows/*.yaml
orkestrtest workflows/*.yaml

```

This ensures that:

- broken workflows never reach production
- logical regressions are caught automatically
- workflow correctness becomes part of standard development workflows

---

### Why This Matters

By providing validation and testing at the workflow level, Orkestr shifts correctness from:

> “Hope the engine catches this at runtime”
> 
> 
> to
> 
> “Prove the workflow is correct before deployment”
> 

This dramatically reduces production risk, shortens feedback loops, and improves confidence when evolving complex distributed systems.

---

## 8. Artifact Generation & Targets

Orkestr bridges workflow design and workflow execution by generating real, engine-specific artifacts from a single, engine-neutral workflow definition.

Rather than being limited to analysis or documentation, Orkestr produces the concrete files that workflow engines actually execute in production.

---

### What Are Artifacts?

Artifacts are the executable workflow definitions generated by Orkestr for a specific orchestration engine.

Examples include:

- Temporal workflow code and activity interfaces
- AWS Step Functions state machine definitions (ASL JSON)
- Argo WorkflowTemplates for Kubernetes

Artifacts are not documentation or diagrams — they are production-ready outputs that are deployed and run by workflow engines.

---

### Targets

Targets are the mechanism by which Orkestr converts its engine-neutral Intermediate Representation (IR) into engine-specific artifacts.

Each target:

- understands how to express a subset of IR constructs in a given engine
- generates artifacts in the native format expected by that engine
- emits compatibility diagnostics when parts of the workflow cannot be faithfully represented

Targets isolate engine-specific logic from Orkestr’s core, allowing Orkestr to remain engine-neutral while still producing real, deployable outputs.

---

### Compatibility and Diagnostics

Not all workflow constructs map perfectly across engines. Orkestr is explicit about this.

When a workflow uses features not supported by a given target, Orkestr:

- surfaces clear errors or warnings during generation
- explains which constructs are incompatible and why
- avoids silently producing incorrect or misleading artifacts

This ensures that users understand the tradeoffs and limitations of each engine, rather than discovering issues at runtime.

---

### Deployment Models

Orkestr supports two primary models for artifact usage:

**Checked-in artifacts**

- Generated artifacts are committed to source control
- Makes workflows reviewable and easy to debug
- Suitable for early adoption and smaller teams

**CI/CD-generated artifacts**

- Artifacts are generated dynamically in CI pipelines
- Keeps repositories clean and eliminates drift
- Suitable for mature platform teams and automated environments

Orkestr is designed to support both models without imposing one.

---

### Initial and Future Targets

The initial target for Orkestr is **Temporal**, reflecting its maturity and expressiveness as a workflow engine.

Future targets may include:

- AWS Step Functions
- Argo Workflows
- Netflix Conductor
- Other orchestration platforms

Each target is implemented independently and may support different subsets of Orkestr’s IR.

---

### Why This Matters

By generating real, executable artifacts, Orkestr ensures that:

- workflow design and execution remain tightly connected
- tooling improvements directly impact production systems
- teams do not have to choose between better design and real deployment
- workflow logic can evolve safely without being locked into a single platform

---

## 9. CLI Interface

Orkestr is designed to integrate naturally into a developer’s daily workflow through a simple, composable command-line interface.

The CLI exposes Orkestr’s core capabilities — validation, testing, visualization, and artifact generation — in a way that fits both local development and CI/CD pipelines.

---

### Core Commands

### `orkestr validate`

Validates workflow logic using engine-neutral static analysis.

```bash
orkestr validate workflows/order.yaml

```

This command:

- checks for logical and structural errors
- reports clear, actionable diagnostics
- exits non-zero on errors for CI enforcement

Use cases:

- pre-commit validation
- CI gating
- early feedback during development

---

### `orkestr test`

Executes deterministic workflow simulations and verifies expected behavior.

```bash
orkestrtest workflows/order.yaml
orkestrtest workflows/order.yaml --update

```

This command:

- runs workflows through the local simulator
- compares execution traces against golden snapshots
- supports snapshot updates when behavior changes intentionally

Use cases:

- validating happy paths and failure paths
- regression testing workflow changes
- enforcing behavioral stability over time

---

### `orkestr diagram`

Generates visual representations of workflows from the Intermediate Representation.

```bash
orkestr diagram workflows/order.yaml --out artifacts/diagrams/

```

This command:

- produces diagrams in formats such as Mermaid or DOT
- enables easy review and documentation
- supports visual diffing between workflow versions

Use cases:

- design reviews
- documentation
- onboarding and knowledge sharing

---

### `orkestr build`

Generates engine-specific artifacts from Orkestr specs.

```bash
orkestr build workflows/order.yaml --target temporal --out generated/

```

This command:

- converts engine-neutral workflows into deployable artifacts
- surfaces compatibility diagnostics for the chosen target
- integrates cleanly into build and deployment pipelines

Use cases:

- producing production-ready workflow definitions
- enforcing consistency between spec and runtime
- enabling multi-engine support from a single source

---

### Developer Experience Principles

The CLI is designed around the following principles:

**Fast feedback**

Commands are optimized for local usage and quick iteration.

**Composable and scriptable**

All commands produce machine-readable output when needed and integrate cleanly into CI/CD pipelines.

**Predictable behavior**

No hidden side effects, no implicit runtime state, no environment coupling.

**Tooling, not infrastructure**

The CLI requires no servers, databases, or background services.

---

### Typical Developer Workflow

A common workflow using Orkestr looks like:

```bash
orkestr validate workflows/order.yaml
orkestrtest workflows/order.yaml
orkestr diagram workflows/order.yaml
orkestr build workflows/order.yaml --target temporal

```

This mirrors how developers already work with application code:

- validate
- test
- review
- build

---

### Why This Matters

By presenting workflows through familiar tooling patterns, Orkestr ensures that:

- workflows become part of standard development practice
- correctness is enforced early and continuously
- adoption requires minimal cultural change for teams
- workflow engineering feels like real software engineering

---

## 10. Maintenance Philosophy

---

## 10. Testing and Simulation (V1)

Orkestr is intentionally designed to minimize long-term maintenance burden while maximizing impact on workflow correctness and developer experience.

This philosophy informs nearly every architectural decision in the project.

---

### Tooling, Not a Runtime

Orkestr does not execute workflows, manage state, or operate as a control plane.

By remaining purely a tooling and design layer, Orkestr avoids:

- uptime and reliability obligations
- operational incidents
- data durability concerns
- performance tuning and scaling complexity

This keeps Orkestr lightweight, reliable, and sustainable as an open-source project.

---

### Engine Isolation Through Targets

All engine-specific logic is isolated behind targets.

This ensures that:

- changes in one engine (e.g., Temporal SDK updates) do not ripple through the entire system
- new engines can be added without destabilizing the core
- Orkestr’s core remains stable and engine-neutral

As a result, most maintenance is localized, predictable, and bounded.

---

### Stable Core, Additive Evolution

Orkestr favors:

- additive changes over breaking ones
- versioned specs
- gradual deprecation instead of abrupt removal

This allows:

- users to adopt Orkestr incrementally
- older workflows to remain valid
- the project to evolve without forcing constant migrations

---

### Clear Scope Boundaries

Orkestr deliberately avoids:

- becoming a full orchestration platform
- supporting every engine feature
- guaranteeing full semantic portability across engines

By maintaining strict Non-Goals, Orkestr protects itself from unbounded scope growth and unsustainable expectations.

---

### Predictable Maintenance Profile

Because Orkestr is:

- a CLI and libraries
- free of runtime responsibilities
- built on deterministic, testable components

Its maintenance primarily consists of:

- evolving the spec and validation rules
- updating engine targets for compatibility
- improving documentation and developer experience

There are no on-call rotations, production incidents, or infrastructure dependencies.

---

### Why This Matters

This philosophy ensures Orkestr remains:

- approachable for contributors
- sustainable as an open-source project
- valuable to users without becoming fragile
- aligned with long-term developer productivity rather than short-term feature accumulation

---

## **Roadmap** – shows vision without commitment overload

Orkestr’s roadmap is intentionally high-level and flexible. It is designed to guide the evolution of the project without locking it into rigid timelines or over-committing to scope.

The focus is on building a strong, sustainable foundation first, then expanding deliberately based on real usage and feedback.

---

### V1 — Foundation

The goal of V1 is to establish Orkestr as a credible, useful workflow tooling framework with minimal surface area and low maintenance overhead.

Key deliverables:

- Orkestr Spec and schema (versioned)
- Intermediate Representation (IR)
- Static validation engine
- Deterministic simulator and test harness
- Golden testing framework
- Temporal target for artifact generation
- Core CLI commands (`validate`, `test`, `diagram`, `build`)
- Documentation and usage examples

Success criteria:

- Workflows can be designed, validated, tested, and generated for Temporal using Orkestr
- No runtime infrastructure is required
- Tooling integrates cleanly into CI pipelines

---

### V2 — Usability & Visibility

Once the foundation is stable, the focus shifts to improving usability and visibility into workflows.

Potential areas of expansion:

- Workflow visualization (Mermaid / DOT / SVG)
- Visual diffing between workflow versions
- Enhanced diagnostics and error reporting
- CLI UX improvements
- Additional validation rules based on real usage patterns

These enhancements improve developer experience without increasing operational complexity.

---

### V3 — Additional Targets

After Orkestr has proven value with Temporal, additional workflow engines may be supported.

Potential targets include:

- AWS Step Functions
- Argo Workflows
- Netflix Conductor

Each target is:

- optional
- independently implemented
- allowed to support a subset of Orkestr’s IR

There is no requirement for full feature parity across targets.

---

### Future Considerations

Depending on adoption and interest, future areas of exploration may include:

- Best-effort import of engine-native workflows into Orkestr Spec
- Organization-specific validation plugins
- Custom target/plugin frameworks
- Deeper CI/CD integrations

These are explicitly not commitments, but areas of potential exploration.

---

### Guiding Principle

Features are added only when they:

- strengthen Orkestr’s core mission
- maintain low maintenance overhead
- improve workflow correctness and developer experience
- do not introduce runtime or operational responsibilities

---