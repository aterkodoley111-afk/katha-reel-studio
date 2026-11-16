# Katha Reel Studio

Code-drawn 2D mythological story reels in traditional Indian art style — from **your voiceover MP3 + your exact script** to **one finished vertical MP4** (1080×1920, 30fps) with burned-in Hinglish word-by-word subtitles, a synthesized Indian score (tanpura, bansuri, tabla, ghungroo, drums) and scene-synced SFX (temple bells, whooshes, fire, impacts), mastered to −16 LUFS.

No AI video clips: every character is drawn by the same code in every scene, so faces, skin, outfits and crowns never drift, and timing is frame-accurate to the voiceover.

## Use it from Claude
Type `/katha-reel` in a new chat, attach the voiceover MP3 and paste the script. The skill clones this repo and runs `WORKFLOW.md`.

## Layout
| Path | What |
|---|---|
| `WORKFLOW.md` | The full pipeline, approval gates, style lock and hard rules |
| `LESSONS.md` | What went wrong/right in every past video, read before each new one, appended after |
| `PREFERENCES.md` | The owner's standing preferences (delivery, series name, look) |
| `engine/chars.js` | Locked character library (Shiva, Bhasmasur, Vishnu, Mohini, …), add new characters here |
| `engine/fx.js` | Backgrounds & effects (sky, moon, stars, bare tree, hills, cracked earth, crows, clouds, embers, petals, god rays, diya, flame, ash, Kailash, Shivling, temple pillars, crown …) |
| `engine/render.js` | Frame renderer (stills + raw video), top Hindi key phrase, gold titles, end card |
| `tools/align.py` | Voiceover timing: silence detection + phrase alignment → scene cut points |
| `tools/subs.py` | Hinglish karaoke subtitles (2–3 words, spoken word gold) |
| `tools/audio.py` | Synthesized score + SFX from `cues.json`, ducked under the VO |
| `tools/stills.sh` | Preview stills with subtitles |
| `tools/build.sh` | Full render → one final MP4 |
| `renders/` | Finished videos (one MP4 per story) |
| `stories/<name>/` | Per-video: `script.txt`, `timing.json`, `plan.md`, `scenes.js`, `hinglish.json`, `cues.json` |

## Quick start
```bash
./tools/setup.sh
python3 tools/align.py vo.mp3 stories/<name>/script.txt stories/<name>/timing.json
./tools/stills.sh stories/<name> "2,10,20,35"
./tools/build.sh stories/<name> vo.mp3
```
