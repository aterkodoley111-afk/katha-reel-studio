# Workflow: voiceover + script → one finished reel

Read `PREFERENCES.md` and **all of `LESSONS.md`** before starting. They override defaults below.

## Inputs
1. Voiceover MP3: never change, re-record, stretch or cut it. Only gain changes are allowed (for −16 LUFS).
2. Exact script: every line is one picture; nothing on screen may contradict it; never add dialogue.
3. (Optional) reference reel/images: copy mood, format and craft, not story.

## Output
ONE vertical MP4, 1080×1920, 30fps: burned-in Hinglish subtitles + synthesized music + SFX, VO untouched except gain, −16 LUFS (TP −1.5), 2-second end card (glowing diya only, no series name). No watermark. No clean version.

## Pipeline: do it in order, WAIT at the gates
0. **Setup**: `./tools/setup.sh`. Create `stories/<slug>/`, save `script.txt`, copy the VO to `build/<slug>/vo.mp3`.
1. **Time the voiceover**: `python3 tools/align.py <vo> stories/<slug>/script.txt stories/<slug>/timing.json`.
   Group phrases into one scene per script line/beat. Scene cut = mid-point of the silence before the line (`cuts` in timing.json). A scene never runs past its line. Dramatic pauses = cuts. End card = last 2 s after the VO ends (`TOTAL = vo_duration + 2`).
2. **Scene plan → WAIT.** Table per scene: time, line, picture, mood + exact colours, camera move, Hindi key phrase. Also list the character lock (new characters get a written design first). Ask only what is genuinely open. Never ask for a series name or about parts (भाग): always one full video. Save as `stories/<slug>/plan.md`.
3. **Build scenes**: write `stories/<slug>/scenes.js` (copy the pattern from `stories/bhasmasur/scenes.js`). Reuse `engine/chars.js` characters exactly; add new characters to `engine/chars.js` (same flat style: `shape`, `limb`, `arm` IK, black outlines `LW=7`, gold jewellery, big eyes) and render a character sheet to check them. Add reusable props/backgrounds to `engine/fx.js`.
   Write `hinglish.json` (one entry per speech chunk from `timing.json` → exact pause timing) and `cues.json` (music moods per section + SFX events at visual beats: flashes, impacts, transformations, fire, bells at temple/divine moments).
   Render a grid of one frame per scene mid-point and fix anything broken BEFORE showing stills.
4. **Preview stills → WAIT** (unless the owner said "go / don't ask": then check them yourself and continue). `./tools/stills.sh stories/<slug> "2,10,20,35"` and send `build/stills/prev_*.png` + `preview_sheet.png`.
5. **Full render**: `./tools/build.sh stories/<slug> build/<slug>/vo.mp3 <slug>` → `build/<slug>/<slug>_final.mp4`.
6. **Check before delivering**: duration, 1080×1920, 30fps, I = −16.0 LUFS; grab ~10 frames across the video into a grid and look at them; measure music bed vs VO per section (target bed 11–16 dB under the voice; set per-section `g` (dB) in `cues.json` sections, then rebuild audio only: audio.py → loudnorm → remux, no re-render). Then send the ONE final MP4.
7. **Improve (every time)**: ask the owner one short question for feedback. Then append a new entry to `LESSONS.md` (version, story, what broke, what was fixed, owner feedback, ⬜ todos), fix engine issues you can, update `PREFERENCES.md` if they stated a standing preference, commit and push to GitHub. If the workflow itself changed, propose an edit to the `katha-reel` skill.

## Style lock: the exact look, never drift
Flat 2D animation in traditional Indian art. Flat colours, clean black outlines, no gradients on characters, no 3D shading, no photorealism. Simple bold shapes, large expressive eyes. Divine figures: gold jewellery, crowns, halos. Gods and kings: tall gold crowns. Animals drawn the same way (e.g. crow: black with a small gold crown).

Locked characters (in `engine/chars.js`):
- **Shiva**: pale blue skin `#8DB6DE`, jata bun with crescent moon + Ganga stream, snake around neck, rudraksha mala, tiger-skin dhoti, trishul + damru, tripundra + third eye, gold halo.
- **Bhasmasur**: maroon-brown skin `#7E3B2C`, wild black spiky hair, two small ivory horns, fangs, handlebar moustache, gold collar/armbands, red dhoti; boon hand glows red-orange; evil = glowing white eyes.
- **Vishnu**: deep blue `#3C5FAE`, tall gold kirita crown, yellow pitambar, 4 arms, spinning chakra + shankh, vaijayanti mala, U-tilak.
- **Mohini**: warm skin `#E8B48C`, pink lehenga `#D8366A` with gold border, magenta choli, orange dupatta, long braid, maang tikka, bindi, jhumkas, nose ring.
- **Karna / Kunti / Surya / Durvasa / Adhiratha / Radha / baby Karna**: see `engine/chars_mb.js` (locked in v2, Karna story).
- **Shani** (when needed): dark blue-black skin, gold earrings and necklace, purple-blue dhoti.

Mood palettes: night/meditation indigo `#141B3D` + full pale moon + stars + one bare black tree + big empty sky; tension/omens dusky purple `#4A2B4A` + crows + cracked earth + distant hills; anger/curses deep maroon `#4A0E1E`, almost no scenery, figures low, cursed eyes glowing white; warm story ochre/gold `#C89B3C`, temple reds, earth `#6B4226`. Large negative space.
Light: divine = white flash + halo + god rays; tense = deep shadows/vignette; diyas flicker, embers float, petals fall, clouds drift. **Every scene moves**: camera push/pan/zoom + at least one moving element. Never a frozen still.
Text: Hindi key phrase only, white, top-centre (Rozha One). Never the full script. No series name anywhere in the video. Name reveals and morals in big gold. Numbers go big on screen (counters, diyas lit one by one). English on-screen text only if the script is English.
Subtitles: Hinglish, word-by-word, 2–3 words, spoken word gold, Poppins Black 100px at y≈1390 (clear of Instagram's caption bar).
Hook: every reel opens on the hook line (no series title). Ending: the script's own last line + end card. Never ask about parts or series, never add a भाग badge or a next-part tease; always one full video for the whole voiceover.

## Hard rules
Never change the voiceover. Never add dialogue. Never let a scene run past its line. Never use AI video clips. Never change a character's face, skin, outfit or crown between scenes. No watermark. If a scene feels empty add clouds, speed lines, birds, embers or a sunrise. Never leave dead space without a reason. One-line change requests change only that one thing.
