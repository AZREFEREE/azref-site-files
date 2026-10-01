# Read before editing (Oct 1, 2026)

A parallel Claude session made tester fixes and design changes directly in this repo and in the Wix CMS.
The full list is in the claude.ai project doc **claude/handoff-to-wix-build.md** (project "ASRA Website Redesign").

In short:
- js/kb-*.js are the live source. Make small targeted edits in place; never regenerate them.
- Keep the shared loader block (from `window.customElements.define(TAG, KBPage);` to the end) exactly as is.
- After changing js/: `bash tools/bump-version.sh`, commit, `git pull --rebase`, push, then purge jsDelivr for each changed file (see tools/README.md).
- Green is #8bc26a. External links open in a new tab. "Find an assignor" wording. 404 page = js/kb-notfound.js.
- Still to wire at launch: Wix 404 page -> element #kbPage + `renderPage($w('#kbPage'), 'kb-notfound')`.
