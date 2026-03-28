# Workflow Orchestration

## 1. Plan Node
- Default to **plan mode** for any non-trivial task (3+ steps or architectural decisions).
- If something goes sideways, **stop and re-plan** — don’t keep pushing.
- Use plan verification, not just building.
- Write detailed specs upfront to reduce ambiguity.

## 2. Subagent Strategy
- Use subagents liberally to keep the main context window clear.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, use multiple subagents for more compute.
- One task per subagent for focused execution.

## 3. Self-Improvement Loop
- After **any** correction from the user, update `tasks/lessons.md`.
- Write rules to prevent repeating the same mistake.
- Ruthlessly iterate on lessons until error rate drops.
- Review lessons at session start for relevant projects.

## 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between original and new changes when relevant.
- Ask: *“Would a staff engineer approve this?”*
- Run tests, check logs, and demonstrate correctness.

## 5. Demand Elegance (Balanced)
- For non-trivial changes, ask: *“Is there a more elegant way?”*
- If a fix feels hacky, re-implement properly.
- Skip over-engineering for simple, obvious fixes.
- Challenge your own work before presenting it.

## 6. Autonomous Bug Fixing
- When given a bug report: fix it. No hand-holding.
- Investigate logs, errors, and failing tests.
- Resolve issues independently.
- Fix failing CI without being told how.

# Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items.
2. **Verify Plan**: Check in before implementation.
3. **Capture Lessons**: Update `tasks/lessons.md` after corrections.
4. **Track Progress**: Mark items complete as you go.
5. **Explain Changes**: Provide high-level summaries.
6. **Document Results**: Add a review section to `tasks/todo.md`.

# Core Principles

- **Simplicity First**: Make every change as simple as possible.
- **No Laziness**: Find root causes. No temporary fixes. Maintain senior developer standards.
- **Minimal Impact**: Change only what’s necessary. Avoid introducing bugs.
