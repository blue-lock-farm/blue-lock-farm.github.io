# Blue Lock Farm

Public starter source for Blue Lock Farm. It contains the selected visual skin, base site configuration, deployment files, and optional analytics configuration.

## Local development

```bash
npm ci
npm run dev
```

## Share a compact source ZIP

After local edits, run:

```bash
npm run package
```

The command creates a compact ZIP under `release/` and excludes dependencies, build output, Git history, caches, logs, existing archives, and private environment files.

## Before publishing

1. Replace the starter homepage and example `/wiki` copy with final content.
2. Add or remove routes as needed.
3. Confirm the public domain and analytics ID in the generated config.
4. Set `readyForLaunch` to `true` in `content/generated/site.json` only when the site is ready to be indexed.
5. Run `npm run typecheck`, `npm run lint`, and `npm run build`.

No private build metadata is required by this repository.
