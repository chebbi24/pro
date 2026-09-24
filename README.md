# Gotham Birthday Journey

A mobile-first retro narrative birthday website. It behaves like a short browser game: a Gotham-like encounter, playful dialogue, secret identity check, mask reveal, noir supercar transition, her life journey, memory fragments, birthday letter, gift reveal, and finale.

It is designed to run as a **static GitHub Pages site** with no backend, account, install, or download.

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run preview
```

## Personalize it in 10 minutes

### 1. Change every important text
Open `src/content/story.ts`.

That file contains all Batman/Catwoman dialogue, accepted secret names, life-story chapters, meeting date placeholder, birthday message, gift, and finale credits.

### 2. Replace photos
Open `public/assets/photos/`.

The current files are designed placeholders so the site already looks intentional before real photos are added. You may overwrite them with SVGs using the same filename, or add JPG/PNG/WebP files and change the path in `src/content/media.ts`.

### 3. Face reveal
Replace `public/assets/photos/rayan-face-placeholder.svg` with a square portrait of Rayan. The game clips it into the face area automatically.

### 4. Add music
Put a personal/licensed MP3 at `public/assets/audio/theme.mp3`.

### 5. Change secret answers
In `src/content/story.ts` edit `acceptedNames: ['rayan', 'rayane']`.

### 6. Add/remove timeline chapters
Every entry in `story.chapters` is one stop. Available memory layouts: `polaroid`, `film`, `evidence`.

### 7. Change the gift
Edit the `gift` section in `src/content/story.ts`.

### 8. GitHub Pages deployment
This repo is configured for `https://chebbi24.github.io/pro/`.

In GitHub:
1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Push to `main`.
4. The included workflow builds and deploys the site.

## Project structure

```text
src/content/story.ts       ← texts, chapters, gift, secret answers
src/content/media.ts       ← image/audio paths
src/content/theme.ts       ← visual settings reference
src/content/README_EDIT_ME.md
src/game/GameStage.tsx     ← Phaser game scenes
src/App.tsx                ← story/state flow
src/styles.css             ← visual design
public/assets/photos/      ← replaceable memories
public/assets/audio/       ← optional music
public/assets/characters/  ← future custom sprites
```

## Artwork note
The repository intentionally does **not** bundle official DC movie/game art, logos, soundtrack, or ripped sprites. The current characters and city are original geometric noir artwork intended to be replaceable later.
