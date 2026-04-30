# NanoClaw Branch Workflow

Two branches, always:

| Branch | Purpose |
|--------|---------|
| `main` | Official NanoClaw - public features, skills, fixes |
| `personal` | Your personal install - Barwon Discord, groups config, private additions |

## Daily workflow

**Adding an official NanoClaw feature:**
```bash
git checkout main
# make changes, commit
git checkout personal
git rebase main        # bring the new feature into your personal install
```

**Adding personal/Barwon-specific stuff:**
```bash
git checkout personal
# make changes, commit
```

**Pulling updates from the future if a collaborator pushes to main:**
```bash
git checkout main
git pull
git checkout personal
git rebase main
```

## On a new machine

```bash
git clone git@github.com:alejandrofergu/nanoclaw.git
cd nanoclaw
git checkout personal
```

Run from the `personal` branch. Your Barwon config and Discord sync are there.

## What lives where

- `main`: anything you'd be fine making public or sharing as a NanoClaw skill
- `personal`: groups/barwon/, Discord category sync, client-specific config
