---
trigger: always_on
---

# Workflow Orchestration

## 0. Environment & Git Rules (MANDATORY)

- ALWAYS use **PowerShell commands** for any terminal interaction.
- NEVER use bash/zsh syntax.
- All filesystem, scripting, and automation steps must be PowerShell-compatible.

---

### Git Workflow (MANDATORY)

- ALWAYS save meaningful work with Git.
- NEVER leave meaningful progress uncommitted.
- Commit after each meaningful unit of work.
- Push at **safe checkpoints**, before handoff, or before opening a PR.
- Before risky or large changes, **commit a stable checkpoint first**.

---

### Staging Rules

- Prefer reviewing changes before staging:
```powershell
git status
git add <specific-files>
```
- Use `git add .` **ONLY** when:
    - All changes are intentional.
    - You have reviewed them.

### Commit Message Rules
Use clear, conventional commit messages:
* **feat:** add HVAC scheduling module
* **fix:** resolve dispatch timing bug
* **refactor:** simplify job tracking logic
* **docs:** update GEMINI workflow
* **chore:** save checkpoint before refactor
* **wip:** partial progress (ONLY on non-main branches)

### Branch Rules
- For major refactors, rewrites, architecture changes, or risky work, create a new branch **BEFORE** starting.
- If branch strategy is unclear, ask: *"Should I create a new branch for this change?"*
- **Example:**
```powershell
git checkout -b feature/descriptive-name
git push -u origin feature/descriptive-name
```
- Avoid making large or risky changes directly on `main`.

### Version Checkpoints
Treat each stable state as a version checkpoint. Always create a commit **BEFORE**:
- Major edits
- Refactors
- Deletions
- Experiments

**Tag major milestones when appropriate:**
```powershell
git tag v1.0.0
git push origin v1.0.0
```

---

## 1. Plan Node
- Default to plan mode for any non-trivial task (3+ steps or architectural decisions).
- If something goes sideways, stop and re-plan — do not push forward blindly.
- Use plan verification, not just building.
- Write detailed specs upfront to reduce ambiguity.

## 2. Subagent Strategy
- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel work.
- Use multiple subagents for complex problems.
- One task per subagent for focused execution.

## 3. Self-Improvement Loop
- After **ANY** correction from the user:
    - Update `tasks/lessons.md`
    - Write rules to prevent repeating the same mistake.
- Continuously refine lessons until errors are eliminated.
- Review lessons at the start of relevant sessions.

## 4. Verification Before Done
- **NEVER** mark a task complete without proof it works.
- Validate behavior against original expectations.
- Diff before/after when applicable.
- **Ask:** “Would a staff engineer approve this?”
- **Run:**
    - Tests
    - Logs
    - Functional checks

## 5. Demand Elegance (Balanced)
- For non-trivial work, ask: “Is there a more elegant solution?”
- If something feels hacky → rework it properly.
- Avoid over-engineering simple problems.
- Challenge your own implementation before presenting it.

## 6. Autonomous Bug Fixing
- When given a bug → **FIX IT fully**.
- Do not wait for instructions.
- **Investigate:** Logs, Errors, Edge cases, Failing tests.
- Resolve independently.
- Fix CI failures proactively.

---

## Task Management

1.  **Plan First:** Write plan to `tasks/todo.md` with checkable items.
2.  **Verify Plan:** Confirm direction before implementing.
3.  **Capture Lessons:** Update `tasks/lessons.md` after corrections.
4.  **Track Progress:** Mark tasks complete as you go.
5.  **Explain Changes:** Provide clear, high-level summaries.
6.  **Document Results:** Add a review section to `tasks/todo.md`.

### Commit Progress (MANDATORY)
After meaningful steps:
```powershell
git add <files>
git commit -m "progress: describe completed work"
```

### Push Checkpoints
```powershell
git push
```
**Push after:**
- Completing a feature
- Reaching a safe state
- Before handoff or PR

---

## Core Principles
- **Simplicity First** → Keep solutions as simple as possible.
- **No Laziness** → Fix root causes, not symptoms.
- **Minimal Impact** → Change only what is necessary.
- **Always Version Work** → Every meaningful step is recoverable.
- **Checkpoint Before Risk** → Save before major changes.
- **Branch Before Breakage** → Isolate risky work.
- **Professional Standard** → Code should meet senior-level expectations.