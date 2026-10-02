# create-uniapp-view

VSCode extension for uni-app: right-click a folder to scaffold page/component `.vue` files, and pages are auto-registered into the nearest `pages.json` (main `pages` or `subPackages`) with comments preserved. Repo is `uni-create-view` but the extension id is `mrmaoddxxaa.create-uniapp-view` — publisher `mrmaoddxxaa` (the original author), NOT `uni-helper`; marketplace/OpenVSX links and badges must use that id.

## Project

- **Language/runtime:** TypeScript (strict, ES2020 target, CommonJS modules) compiled with plain `tsc` to `out/` — no bundler (esbuild was removed in 2.2.0). Runtime deps (`comment-json`, `ejs`, `slash`) ship inside the VSIX via `node_modules` in the `files` field, so keep them lean.
- **Toolchain:** npm (lockfile committed; migrated from pnpm). ESLint 10 flat config via `@antfu/eslint-config` (`eslint.config.mjs`, ignores `out`, `dist`, `**/*.d.ts`). bumpp for releases. No test framework — CI (`.github/workflows/ci.yml`, `voidzero-dev/setup-vp`) runs `vpr lint` + `vpr compile` only, on Node 22/24/26 × ubuntu/macos/windows. No Node pin file; the consumer-facing pin is `engines.vscode: ^1.137.0`.
- **Artifact:** the VSIX ships `CHANGELOG.md`, `LICENSE`, `node_modules`, `out`, `public` (see `files` + `icon`). Published to both VSCode Marketplace and OpenVSX on `v*` tags.

## Commands

```bash
npm install
npm run compile      # tsc → out/
npm run watch        # tsc -watch; F5 "Run Extension" uses this as its preLaunchTask
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run lint:fix
npm run release      # bumpp — bump/commit/tag/push; the v* tag triggers .github/workflows/release.yml
```

Release workflow: `vpx @vscode/vsce publish` (VSCE_PAT) → `vpx ovsx publish` (OVSX_PAT) → changelogithub GitHub Release (GITHUB_TOKEN).

## Architecture

| File | Role |
|---|---|
| `src/extension.ts` | entry point; registers the three commands |
| `src/command.ts` | command wrapper: guards the no-URI case (command palette → error hint), shows the input box, splits input, funnels all generate errors into `logger` messages |
| `src/generate.ts` | core flow: validate target dir, sync-mkdir when `directory` is on, write the `.vue` file (modal overwrite confirm), then `writePagesJson` |
| `src/utils.ts` | `logger` (user-facing message boxes), `getConfiguration` (reads the full key including the `create-uniapp-view.` prefix), `confirmOverwrite` (modal; dismiss/Esc = refuse), `upwardSearchFile` |
| `src/template.ts` | picks one of six templates by `template` × `component`, renders with ejs; unknown template name throws |
| `src/templates/*.ts` | raw ejs template strings: page/component × vue2/vue3/composition-api |

### Behavior invariants (don't regress)

- The page path written to `pages.json` is relative to the directory containing `pages.json`, computed with `path.relative` — never the absolute right-clicked path, and never string `replace` (it no-ops when the right-clicked dir IS the project root and would write an absolute path; bug fixed in 2.2.0).
- Duplicate page entries are skipped, not re-appended.
- When the `.vue` file was already written but `pages.json` parse/write fails, the message must say so (half-done state), because the page file exists without its registration.
- Directory creation is synchronous (`mkdirSync`) — an async mkdir raced with `writeFileSync` and failed intermittently (bug fixed in 2.2.0).
- `upwardSearchFile` walks up from the right-clicked folder, stops at the filesystem root, and does not treat a directory named `pages.json` as a hit (lstat check).
- Input is split on whitespace: first token = file/folder name, the rest joined = `navigationBarTitleText` (title may contain spaces). Esc is a silent cancel; empty or whitespace-only input shows an error and aborts.
- `template.ts` defaults unknown/empty `template` handling: empty falls back to `vue3`, an unknown non-empty value throws — hand-edited settings can bypass the enum, so the throw is intentional.

## Conventions

- **User-facing strings are Simplified Chinese** — command titles, prompts, error/warning messages, the overwrite dialog.
- **Docs language:** README and CONTRIBUTING are Simplified Chinese; AGENTS.md is English (org convention). Source comments are Chinese.
- **Settings namespace:** every config key is `create-uniapp-view.*` and read with the full key. `contributes.configuration` / `contributes.commands` in `package.json` are the user contract — README's 「扩展设置」/「命令」tables must stay in sync with them.
- **Branches/commits:** `feat/xxx`, `fix/xxx`, `docs/xxx`; Conventional Commits.
- **Release coupling:** every release needs a CHANGELOG.md entry (commit it before `npm run release`); the VSIX bundles `node_modules` since there is no bundling step.
