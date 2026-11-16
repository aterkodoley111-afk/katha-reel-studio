# Lessons log: read fully before every new video, append after every video

Each entry: what happened, the fix, and whether it is already applied in the engine (✅) or still a todo (⬜).

## v1 — Bhasmasur (2026-11-16) · 27 scenes · 2:05
**Owner feedback:** approved plan + stills first time; asked for only one subtitled MP4 (no clean version); asked Claude to add music + SFX (doesn't know how to do it manually).

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
