# Lessons log: read fully before every new video, append after every video

Each entry: what happened, the fix, and whether it is already applied in the engine (✅) or still a todo (⬜).

## v1 — Bhasmasur (2026-11-16) · 27 scenes · 2:05
**Owner feedback:** approved plan + stills first time; asked for only one subtitled MP4 (no clean version); asked Claude to add music + SFX (doesn't know how to do it manually).

- **Owner change (after delivery): remove the series name from the video**, both the hook title and the end-card text. ✅ `engine/render.js` now hides it by default (`SHOW_SERIES`), end card is the diya only; re-rendered v1.1.
- **Owner rule: never ask about parts.** Always render the full video for the whole voiceover + script; no भाग badge, no next-part tease, no series questions. ✅ PREFERENCES/WORKFLOW updated.

Technical
- ✅ Whisper / HuggingFace downloads are blocked in the sandbox → `tools/align.py` aligns phrases to silence-detected speech chunks (DP on text length). Chunk edges are exact; words inside a chunk are proportional. Write `hinglish.json` **one entry per speech chunk** (split long phrases at their internal pauses) so subtitles stay in sync.
- ✅ Piping frames from node: must `await 'drain'` on stdout (a sync loop truncated frames and ffmpeg failed).
- ✅ Speed: ~11 fps per worker at 1080×1920; 2 workers render 2:05 in ~3 min. `build.sh` uses up to 4 workers.
- ✅ Audio: synthesize everything (no downloads). Target music bed 11–16 dB under the VO; check with the bed-vs-VO measurement (see WORKFLOW step 6). First mix had dance/suspense/calm too quiet (−33 dB) and the opening boom too loud: fixed (tabla ×2.2, heartbeat ×2.4, calm pad 0.4 + bansuri repeats; boom at t=0 gain 0.55; fire burst 0.7).
- ✅ Final loudness via two-pass `loudnorm` linear → −16.0 LUFS, TP −1.5.

Drawing
- ✅ Gold armbands/bangles must use `butt` line caps (round caps looked like knobs).
- ✅ Bhasmasur hair polygon must stay above ear line or it makes a black box behind the head.
- ✅ Hand-on-head pose: IK target at the top-side of the head (≈ x+60, y−955) with elbow `out`, otherwise the forearm covers the face.
- ✅ Keep the **top text band (y≈200–420)** free of props (temple garlands overlapped the key phrase → moved down).
- ⬜ Subtitle band (y≈1330–1450) often crosses characters' torsos, which is acceptable, but try to keep faces above y≈1250 in close-ups.
- ⬜ Characters are front-facing only; add 3/4 / side-profile variants for chase and dialogue moments.
- ⬜ Scene cuts are hard cuts with a 4-frame dark dip; try crossfades on calm beats.
- ⬜ Fire in scene 22 sits slightly left of centre (random flame offsets); centre it.

Ideas backlog
- Add characters as stories need them: Hanuman, Ganesha, Krishna, Parvati, Shani, Ravana, Narad, Indra, a sage.
- Numbers on screen: big gold counters (108 flowers, 9 diyas) per WORKFLOW rules.

## v2 — Karna (2026-11-16) · 37 scenes + end card · 2:29.7
**Owner feedback:** approved the scene plan, then said "go, I'm going to bed, don't ask me to approve" → skipped the stills gate, self-checked the stills/grid and delivered the final. (Pending: morning feedback.)

- ✅ **Owner rule: if the owner says "go / don't ask", skip the remaining approval gates.** Self-check the scene grid and the 2/10/20/35 stills instead, then deliver. Added to PREFERENCES + WORKFLOW.
- ✅ New cast in `engine/chars_mb.js` (Mahabharata): `karna` (poses rest/bowDown/bow/raise/fists, `kneel`, `released`), `baby` (wrapped, gold kavach + kundal), `kunti`/`radha` (shared `lady` body: rest/namaste/hold+baby/reach/reachDown/heart/plead/palms), `durvasa`, `surya` (spiky sun halo, same kavach/kundal as Karna), `adhiratha` (also the generic silhouette crowd man: point/whisper/lift/hold). Props: `basket`, `horse`, `chariotWheel`, `bow`, `lotus`, `tear`. Check with `node tools/charsheet_mb.js <outDir>`.
- ✅ New scenery in `engine/fx_mb.js`: `river` (moving ripples + moon reflection), `lotusPad`, `reeds`, `palace`, `hut`, `crowd` (silhouettes with glowing eyes), `arrow`, `sparks`, `goldThread`, `om`, `haloRing`, `dust`, `flag`, `sunDisk`, `windowArch`.
- ✅ `chars.js` now exports `arm, eyes, brows, crossedLegs, lerp2, getSil` so new character files can reuse them.
- ✅ `render.js`: scene options `txtCol` (gold key phrase) and `bigAt` (big gold name appears exactly when spoken, e.g. वसुषेण mid-scene).
- ✅ Audio: moods `sad` (minor pad + low Sa + slow bansuri) and `war` (fast dhol-like drums); SFX `water`, `arrow`, `clang`, `conch`, `hooves`.
- ✅ **Music bed was 16–30 dB under the VO on the first mix (divine/magic pads far too quiet).** Added per-section gain `g` (dB) in `cues.json` → `section_gain()` in `audio.py`; measure, set g = −13.5 − measured, rebuild audio only. Final: every section 13–14 dB under the VO. Next time start from the Karna gains (divine ≈ +14…+17, warm/sad ≈ +10…+12, tense ≈ +11, suspense/war ≈ +3…+5).
- ✅ Palace pillars/beam and hut roof crossed the text band (y 200–420) → moved down to y ≥ 480.
- ✅ Crowd silhouettes in front of a small character hid her completely → ring of smaller silhouettes BEHIND the hero, only one big silhouette at each edge in front.
- ⬜ Big gold name (y≈420) sits close to the hut roof line in scene 27; keep big-name scenes' backgrounds clear down to y≈520.
- ⬜ Karna's bow pose keeps the arrow nocked until `released`; add an actual draw-back animation (string pull) for archery beats.
- ⬜ Front-facing only still (carried over): Kunti "turning away" was faked with flip + closed eyes.
- ⬜ Mid-scene measurement script for bed-vs-VO should live in `tools/` (now an inline snippet; see WORKFLOW step 6).
