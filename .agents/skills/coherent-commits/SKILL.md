---
name: coherent-commits
description: Create small, coherent Git commits during authorized repository work without staging unrelated changes.
---

# Coherent Commits

Use this skill only when the user or repository instructions authorize commits.

- Inspect the working tree before changing or staging files.
- Commit short tasks as one coherent change.
- During longer tasks, commit at natural completed boundaries when groups can be understood and reverted independently.
- Do not split tightly coupled implementation, tests, or required documentation merely to increase the commit count.
- Do not combine unrelated changes into one commit.
- Stage only the exact files or hunks belonging to the current group. Never include pre-existing or unrelated work.
- Run the checks relevant to each group before committing it.
- Review the staged diff before every commit.
- Follow the repository's commit-message convention. Otherwise use a concise Conventional Commit message describing the completed change.
- Do not create empty, speculative, or knowingly broken commits.
- If overlapping changes cannot be isolated safely, leave them uncommitted and report the conflict.
- Do not push, merge, rebase, tag, or rewrite history unless explicitly requested.

At completion, report the commits created and any task changes intentionally left uncommitted.
