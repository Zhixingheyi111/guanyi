---
name: phase-checkpoint
description: Use when a Phase or sub-phase of the 观易 App project is complete and ready to be tagged + backed up. Triggers on user mentions like "phase X 完成", "phase done", "可以 tag 了", "1.1 finished", "ready to checkpoint". Runs the end-of-phase ritual — verifies all sub-tasks done, runs lint+build, updates CHANGELOG/PROGRESS/PROJECT/ACTION_ITEMS, creates a Conventional commit, tags the version, and pushes to Forgejo. Different from safe-backup: this is the formal release ritual at Phase boundaries, not ad-hoc backups.
---

# Phase Checkpoint Skill

End-of-phase release ritual. The args (`$ARGUMENTS`) should be the phase number (e.g., `1.1`, `1.6`) or target tag (e.g., `v0.1.0-fortune`).

## Steps

1. **Get current timestamp**:
   ```bash
   date "+%Y-%m-%d %H:%M %Z"
   ```

2. **Verify phase completion** — read `PROJECT.md`:
   - Confirm all sub-tasks of the named Phase are ✅
   - If ANY are still 📋 or 🔄: STOP, list incomplete items, don't proceed.

3. **Code quality** (must pass; if not, STOP and report):
   - `npm run lint`
   - `npm run build`
   - Failed lint/build means we DON'T tag a release. Fix first, or invoke error-logger if root cause unclear.

4. **Update tracking files** (with timestamp from step 1):
   - **`CHANGELOG.md`**: insert new version entry at top of `## [Unreleased]`-just-promoted format. Include date+time, list of Added/Changed/Removed/Fixed.
   - **`PROGRESS.md`**: prepend new dated entry summarizing what completed this Phase.
   - **`PROJECT.md`**: in "当前任务" section, mark Phase complete; set next Phase as active.
   - **`ACTION_ITEMS.md`**: move completed Phase items to "已完成" with completion timestamp.

5. **Commit** with Conventional format:
   ```
   chore(release): Phase X.Y 完成 → vX.Y.Z-<slug>
   ```
   Body should include CHANGELOG summary.

6. **Tag**:
   ```bash
   git tag -a vX.Y.Z-<phase-slug> -m "<one-line description>"
   ```

7. **Push to Forgejo with tags**:
   ```bash
   git push forgejo claude/naughty-booth-4d532f --tags
   ```

8. **Verify** the tag is on Forgejo:
   ```bash
   git ls-remote forgejo --tags
   ```

9. **Report**:
   - Version + tag
   - CHANGELOG summary
   - Forgejo verification
   - **Next phase's first action item** (from ACTION_ITEMS.md)

## Strict Rules

- **Lint/build failure = STOP**. No "fix and squash" — surface the issue first.
- **Never push to `origin` (GitHub)** — that's `/premerge` only, used at the very end of the project. Phase checkpoints are Forgejo-only.
- **Tag once**: never reuse the same tag name (semantic versioning).
- Every timestamp HH:MM TZ.
- If `npm run lint` finds warnings (not errors): document in CHANGELOG, don't block.
