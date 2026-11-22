# CLAUDE.md

K-Shorts Studio: a Windows Electron app (`electron/main.ts`, `src/`) that turns a topic or script into a 9:16 Korean short. This repo also has a headless **shorts factory** that runs the same render engine in GitHub Actions.

## Shorts factory (쇼츠 자동 공장)

- `shorts/<slug>/job.json` (+ optional scene images and videos) → `.github/workflows/shorts-factory.yml` → mp4 in **Releases**.
- The job format and the allowed values are in `shorts/README.md`. Use only the values listed there.
- `factory/build.mjs` bundles `electron/main.ts` with a stub `electron` module (`factory/electron-stub.cjs`) into `dist-factory/engine.cjs`. `factory/render.mjs` reads the job folders and calls the exported `executeRenderPipeline`.
- Local run: `npm ci && node factory/build.mjs && node factory/render.mjs shorts/<slug>`. This needs Python 3 and ffmpeg, plus internet access for Edge-TTS and the free image engine.

### When the user asks to make a short from material ("쇼츠 만들어줘", "공장에 넣어줘")

1. Write the script and job.json following `claude-project/PROJECT_INSTRUCTIONS.md`: 5–8 scenes, one sentence each, 40–55 s, a hook first. Do not invent facts that the material does not contain.
2. Create `shorts/YYYY-MM-DD-english-keywords/`. Copy the user's images and videos into it as `01.jpg`, `02.png`, and so on, and reference them in `scenes[].image` or `scenes[].video`.
3. Validate the JSON with `node -e "JSON.parse(require('fs').readFileSync('shorts/<slug>/job.json','utf8'))"`.
4. Commit only that folder. The workflow runs on pushes to `master`, so a factory job must reach `master` to render. The user has authorized committing new `shorts/<slug>/` folders directly to `master` for this purpose. Anything else goes through the session's working branch as usual.
5. Tell the user the slug, and tell them that the result will appear in Releases as `short-<slug>-<run>`.

Folders that start with `_` (for example `shorts/_example`) are samples and never render.

## App development

- `npm run build`, `npx tsc --noEmit`, `node scripts/test-features-runtime.js`
- The bottom export in `electron/main.ts` is used by the factory. Keep `executeRenderPipeline`'s signature stable, or update `factory/render.mjs` along with it.
