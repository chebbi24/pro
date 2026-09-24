# EDIT ME FIRST

You should be able to personalize almost the whole experience without touching the game code.

## 1. Change text, names, dates, gift and timeline
Edit `src/content/story.ts`.

Important fields:
- `story.access.acceptedNames` — secret answers, e.g. `['rayan', 'rayane']`
- `story.chapters` — every life-story stop
- `story.birthday.message` — the birthday letter
- `story.gift` — gift card and real surprise
- `story.finale` — final screen and credits

To add a chapter, copy one chapter object and give it a unique `id`.

## 2. Replace photos
Go to `public/assets/photos/`.
You can either:
- replace an SVG file with another SVG using the same filename, or
- add a JPG/PNG/WebP and update the matching path in `src/content/media.ts`.

The layouts already crop and frame images. You do not need to pre-design the photo itself.

## 3. Replace Rayan face reveal
Replace `public/assets/photos/rayan-face-placeholder.svg` with a cropped portrait. A square image works best. If you use another filename, update `media.photos.rayanFace`.

## 4. Add music
Put an MP3 at `public/assets/audio/theme.mp3`.
If no file is present, the site still works silently.

## 5. Change colors
Edit `src/content/theme.ts` and the CSS variables near the top of `src/styles.css`.

## 6. Change character artwork later
The current game characters are original geometric noir silhouettes drawn in Phaser. If you later want custom sprites, use `public/assets/characters/` and replace the drawing code in `src/game/GameStage.tsx`.

## 7. GitHub Pages
This repository is configured for the repo name `pro`, so the Vite base is `/pro/`.
If you rename the repo, update `vite.config.ts` or set `VITE_BASE_PATH` in the workflow.
