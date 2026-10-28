#!/usr/bin/env bash
# prepare-studio-audio.sh: turns the Invincible Battles master into the two web files the Studio
# channel uses, without touching the master itself.
#
#   bash scripts/prepare-studio-audio.sh "<path to master>" [start-seconds]
#
# Accepts WAV (preferred), FLAC, AIFF or a high-bitrate MP3/M4A of at least 30 seconds.
# start-seconds picks where the loop and preview begin (default 30, e.g. the first chorus).
#
# Outputs (committed):
#   assets/audio/studio.mp3            20 s loop for the Studio fader: 44.1 kHz stereo, 160 kbps,
#                                      -19 LUFS to sit level with the other six stems
#   assets/audio/invincible-clip.mp3   30 s preview: 44.1 kHz stereo, 192 kbps, -16 LUFS, fades
# Original (not committed, raw-audio/ is in .gitignore):
#   raw-audio/invincible-battles-master.<ext>   byte-for-byte copy, with its SHA-256 printed
# Needs ffmpeg and ffprobe.
set -euo pipefail

SRC="${1:-}"; START="${2:-30}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -n "$SRC" ] && [ -f "$SRC" ] || { echo "STOP: give the path to the master file"; exit 1; }
command -v ffmpeg >/dev/null && command -v ffprobe >/dev/null || { echo "STOP: ffmpeg/ffprobe not found"; exit 1; }

ext="${SRC##*.}"; ext="$(echo "$ext" | tr 'A-Z' 'a-z')"
case "$ext" in wav|flac|aif|aiff|mp3|m4a) ;; *) echo "STOP: .$ext is not a supported master format (use WAV, FLAC, AIFF, MP3 or M4A)"; exit 1;; esac

# 1. Inspect: must have audio and be long enough.
info="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels,bit_rate:format=duration -of default=nw=1 "$SRC")"
echo "$info"
dur="$(echo "$info" | awk -F= '/^duration=/{print int($2)}')"
[ -n "$dur" ] && [ "$dur" -ge 30 ] || { echo "STOP: no audio stream, or shorter than 30 seconds"; exit 1; }
if [ "$((START + 30))" -gt "$dur" ]; then START=0; echo "Start moved to 0 s: the track is only ${dur} s long"; fi
if [ "$ext" = "mp3" ] || [ "$ext" = "m4a" ]; then
  br="$(echo "$info" | awk -F= '/^bit_rate=/{print int($2/1000)}')"
  [ "${br:-0}" -ge 256 ] || echo "WARNING: lossy master at ${br:-?} kbps; a WAV export will sound better"
fi

# 2. Keep the original untouched.
mkdir -p "$ROOT/raw-audio" "$ROOT/assets/audio"
KEEP="$ROOT/raw-audio/invincible-battles-master.$ext"
[ -e "$KEEP" ] || cp -p "$SRC" "$KEEP"
echo "Original kept: $KEEP"
sha256sum "$SRC" "$KEEP"

# 3. The fader loop and the preview clip.
ffmpeg -v error -y -ss "$START" -t 20 -i "$SRC" \
  -af "afade=t=in:d=0.4,afade=t=out:st=19.4:d=0.6,loudnorm=I=-19:TP=-1.5:LRA=11" \
  -ar 44100 -ac 2 -c:a libmp3lame -b:a 160k "$ROOT/assets/audio/studio.mp3"
ffmpeg -v error -y -ss "$START" -t 30 -i "$SRC" \
  -af "afade=t=in:d=1,afade=t=out:st=28:d=2,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -ar 44100 -ac 2 -c:a libmp3lame -b:a 192k "$ROOT/assets/audio/invincible-clip.mp3"

# 4. Check what was written.
for f in studio invincible-clip; do
  out="$ROOT/assets/audio/$f.mp3"
  printf '%s: ' "$f.mp3"
  ffprobe -v error -show_entries format=duration,bit_rate -of csv=p=0 "$out" | tr '\n' ' '
  ffmpeg -nostats -i "$out" -af loudnorm=print_format=summary -f null - 2>&1 | grep "Input Integrated" || true
done
echo "Done. Test the Studio fader locally, then: git add assets/audio/studio.mp3 assets/audio/invincible-clip.mp3"
