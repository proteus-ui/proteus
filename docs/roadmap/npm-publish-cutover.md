# npm publish cutover (Proteus → job-inbox)

Until `@proteus-ui/*` is on npm, job-inbox consumes Proteus via a git submodule (`vendor/proteus`) and `file:` dependencies. This doc is the checklist for both repos when that changes.

Do Proteus first. Only then change job-inbox.

## Current state (pre-npm)

**Proteus**

- Packages: `@proteus-ui/tokens`, `@proteus-ui/core`, `@proteus-ui/theme-default` at `0.0.0`.
- Core depends on tokens with `workspace:*` (valid only inside this pnpm workspace).
- ESM/`types` export `src` so Next can compile a git checkout (no `dist` in git). CJS `require`/`main` still point at `dist`.
- `dist/` is gitignored. Local and CI must `pnpm --filter @proteus-ui/tokens --filter @proteus-ui/core build` before anything needs compiled JS.

**job-inbox**

- Submodule: `vendor/proteus` → `https://github.com/proteus-ui/proteus.git` (pin a SHA).
- Deps: `file:./vendor/proteus/packages/{core,tokens,theme-default}`.
- `overrides["@proteus-ui/tokens"]` same `file:` path so core’s `workspace:*` resolves.
- `transpilePackages` + `next build --webpack`. Vercel `buildCommand` is `bun run build`.
- Bun 1.4 cannot install a GitHub monorepo subdirectory (`#path:` is treated as a git ref). Do not switch back to `github:…#path:` unless Bun’s installer gains real subdirectory support.

## Proteus — before the first publish

1. **npm org.** Confirm you can publish public scoped packages as `proteus-ui` on [npmjs.com](https://www.npmjs.com) (`publishConfig.access` is already `"public"`).
2. **Version.** Bump `packages/{tokens,core,theme-default}/package.json` from `0.0.0` to the same first release (e.g. `0.1.0`). Keep the three in lockstep for the first cut.
3. **Exports for the tarball.** npm consumers get `dist`, not a Next transpile pass. Point published entries back at compiled output:

   ```json
   "main": "./dist/index.cjs",
   "module": "./dist/index.js",
   "types": "./dist/index.d.ts",
   "exports": {
     ".": {
       "types": "./dist/index.d.ts",
       "import": "./dist/index.js",
       "require": "./dist/index.cjs"
     }
   }
   ```

   CSS exports stay on `src` (`./styles.css`, `./tokens.css`, `./theme.css`). Shrink `files` to `dist` plus those CSS files if you do not want to ship all of `src`.
4. **`workspace:*`.** Leave it in the repo. `pnpm publish` rewrites it to the real version in the tarball. Do not replace it with a git URL.
5. **Build.** From the monorepo root:

   ```bash
   pnpm --filter @proteus-ui/tokens --filter @proteus-ui/core --filter @proteus-ui/theme-default build
   ```

   Confirm `packages/tokens/dist` and `packages/core/dist` exist. Theme-default is CSS-only (no-op build).
6. **Publish order.** tokens → theme-default → core (core depends on tokens).

   ```bash
   pnpm --filter @proteus-ui/tokens publish --access public
   pnpm --filter @proteus-ui/theme-default publish --access public
   pnpm --filter @proteus-ui/core publish --access public
   ```

7. **Tag.** Tag the release commit (e.g. `v0.1.0`) and push the tag. Later job-inbox pins that version, not a submodule SHA.

Do not publish `0.0.0`. Do not publish without `dist` for core and tokens.

## job-inbox — after the packages exist on npm

1. **Deps.** Replace `file:` with the published range. Drop the tokens override (npm core already depends on npm tokens).

   ```json
   "dependencies": {
     "@proteus-ui/core": "^0.1.0",
     "@proteus-ui/theme-default": "^0.1.0",
     "@proteus-ui/tokens": "^0.1.0"
   }
   ```

   Delete the entire `overrides` block if it only existed for the `file:` tokens path.
2. **Lockfile.** `bun install` and commit `bun.lock`.
3. **Remove the submodule.**

   ```bash
   git submodule deinit -f vendor/proteus
   git rm -f vendor/proteus
   rm -rf .git/modules/vendor/proteus
   ```

   Delete `.gitmodules` if it is empty. Commit the removal.
4. **Leave as-is unless something fights you.** `transpilePackages`, `next build --webpack`, and Vercel `buildCommand: bun run build` can stay. Webpack was required for Bun `file:` + Turbopack, not for npm. You can try dropping `--webpack` in a follow-up; do not couple that to the cutover.
5. **Vercel.** No install-command change. Default Bun install is enough. Submodule checkout is no longer required.
6. **Smoke.** Login, inbox, filters, applied on a preview deploy.

## Until then (still on the submodule)

To pick up a new Proteus commit in job-inbox:

```bash
git -C vendor/proteus fetch
git -C vendor/proteus checkout <sha>
bun install
```

Commit the updated submodule pointer.

## Done when

- `@proteus-ui/tokens`, `@proteus-ui/core`, and `@proteus-ui/theme-default` resolve from the npm registry in job-inbox.
- `vendor/proteus` and `.gitmodules` are gone.
- A Vercel preview installs and builds without cloning GitHub as a package source.
