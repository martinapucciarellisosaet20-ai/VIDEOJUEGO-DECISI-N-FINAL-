#!/usr/bin/env python3
# =========================================================
#  tools/build_music.py · Genera la música de fondo del juego
#
#  Composición ORIGINAL creada para "DF · Decisión Final"
#  (no usa samples ni fragmentos de obras de terceros).
#  Licencia: CC0 1.0 (dominio público) → libre de derechos.
#
#  Estilo: chiptune de "quiz" (8 bits, como los efectos del juego)
#  en Re menor, 120 BPM: bajo pulsante, tic-tac de reloj, acordes,
#  arpegios y una melodía de suspenso. 32 compases (64 s) que se
#  repiten sin cortes (loop).
#
#  Uso:   python3 tools/build_music.py
#  Salida: assets/audio/musica-quiz.ogg y assets/audio/musica-quiz.mp3
#  Requiere: numpy, scipy y ffmpeg (con libvorbis y libmp3lame).
# =========================================================
import os
import subprocess
import tempfile
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
BARS = 32
LENGTH = BARS * BAR
TAIL = 2 * BAR                      # colas de eco que se pliegan al inicio (loop perfecto)
N = int((LENGTH + TAIL) * SR)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'audio')

rng = np.random.default_rng(7)      # semilla fija: siempre genera el mismo archivo
L = np.zeros(N)
R = np.zeros(N)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env(n, a=0.004, d=0.0, s=1.0, r=0.03):
    """Envolvente ADSR simple (en segundos) para n muestras."""
    t = np.arange(n) / SR
    dur = n / SR
    e = np.ones(n)
    if a > 0:
        e = np.where(t < a, t / a, e)
    if d > 0:
        e = np.where((t >= a) & (t < a + d), 1 - (1 - s) * (t - a) / d, e)
        e = np.where(t >= a + d, s, e)
    if r > 0:
        e *= np.clip((dur - t) / r, 0, 1)
    return e


def pulse(f, n, duty=0.5):
    ph = (np.arange(n) * f / SR) % 1.0
    return np.where(ph < duty, 1.0, -1.0)


def tri(f, n):
    ph = (np.arange(n) * f / SR) % 1.0
    return 4 * np.abs(ph - 0.5) - 1


def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    gl = gain * np.sqrt((1 - pan) / 2)
    gr = gain * np.sqrt((1 + pan) / 2)
    L[i:i + len(sig)] += sig * gl
    R[i:i + len(sig)] += sig * gr


def note(m, start, dur, kind='pulse', duty=0.5, gain=0.2, pan=0.0, a=0.004, d=0.0, s=1.0, r=0.03, vib=0.0):
    n = int(dur * SR)
    f = hz(m)
    if vib:
        t = np.arange(n) / SR
        f = f * (1 + vib * np.sin(2 * np.pi * 5.5 * t) * np.clip(t / 0.25, 0, 1))
        ph = np.cumsum(f / SR) % 1.0
        w = np.where(ph < duty, 1.0, -1.0) if kind == 'pulse' else 4 * np.abs(ph - 0.5) - 1
    else:
        w = pulse(f, n, duty) if kind == 'pulse' else tri(f, n)
    add(w * env(n, a, d, s, r), start, gain, pan)


def noise_hit(start, dur, gain, lo, hi, pan=0.0, decay=30.0):
    n = int(dur * SR)
    x = rng.uniform(-1, 1, n)
    sos = butter(2, [lo, hi], btype='band', fs=SR, output='sos')
    x = sosfilt(sos, x)
    x /= (np.max(np.abs(x)) + 1e-9)
    t = np.arange(n) / SR
    add(x * np.exp(-t * decay), start, gain, pan)


def kick(start, gain=0.55):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t * 32)
    ph = np.cumsum(f / SR)
    add(np.sin(2 * np.pi * ph) * np.exp(-t * 18), start, gain)


def snare(start, gain=0.22):
    noise_hit(start, 0.14, gain, 1200, 7000, 0.0, 26)
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    add(np.sin(2 * np.pi * 185 * t) * np.exp(-t * 40), start, gain * 0.7)


def tick(start, high, gain):
    """Tic-tac de reloj (el cronómetro de las preguntas)."""
    noise_hit(start, 0.03, gain, 2600 if high else 1700, 6500 if high else 4200, -0.25, 140)


# ---------- armonía: Re menor (i · VI · iv · V) ----------
# cada acorde dura 2 compases; el ciclo de 8 compases se repite 4 veces
CHORDS = [  # (bajo, notas del acorde)
    (38, [62, 65, 69]),   # Dm
    (34, [58, 62, 65]),   # Bb
    (43, [55, 58, 62]),   # Gm
    (45, [57, 61, 64]),   # A (dominante: la sensible Do# da tensión)
]

# melodía de suspenso (corcheas, None = silencio) · 16 corcheas por acorde
MELODY = [
    [69, None, None, 69, 70, 69, None, 67, 65, None, None, None, 64, None, 65, None],
    [65, None, None, 65, 67, 65, None, 62, 62, None, None, None, 60, None, 62, None],
    [67, None, None, 67, 69, 67, None, 65, 62, None, None, None, 65, None, 67, None],
    [64, None, 65, 64, None, 61, None, 64, 69, None, None, None, None, None, 68, None],
]
MELODY_B = [  # variación (sección D): más aguda y cortada
    [74, None, 74, 73, 74, None, 77, None, 76, None, 74, None, 73, None, 74, None],
    [70, None, 70, 69, 70, None, 74, None, 72, None, 70, None, 69, None, 70, None],
    [67, None, 67, 69, 70, None, 72, None, 74, None, 72, None, 70, None, 69, None],
    [69, None, 73, None, 76, None, 73, None, 69, None, 76, None, 73, None, 81, None],
]

E8 = BEAT / 2
E16 = BEAT / 4

for bar in range(BARS):
    t0 = bar * BAR
    section = bar // 8                 # 0=A (calma tensa) 1=B (+arpegio) 2=C (+batería y melodía) 3=D (clímax)
    ci = (bar % 8) // 2
    bass, triad = CHORDS[ci]
    half = bar % 2                     # 1.º o 2.º compás del acorde

    # --- bajo pulsante en corcheas ---
    pattern = [0, 0, 12, 0, 0, 12, 0, 7]
    if half == 1 and ci == 3:
        pattern = [0, 0, 12, 0, 0, 12, 1, 2]   # aproximación cromática hacia el Re
    for i, off in enumerate(pattern):
        acc = 1.0 if i % 2 == 0 else 0.8
        note(bass + off, t0 + i * E8, E8 * 0.82, 'pulse', 0.25, 0.16 * acc, 0.0, r=0.04)
        note(bass + off - 12, t0 + i * E8, E8 * 0.9, 'tri', 0, 0.20 * acc, 0.0, r=0.04)

    # --- acordes sostenidos (pad) ---
    if half == 0:
        for k, m in enumerate(triad):
            note(m, t0, BAR * 2, 'tri', 0, 0.045, (-0.5, 0.0, 0.5)[k], a=0.35, r=0.35, vib=0.003)

    # --- tic-tac del reloj ---
    step = BEAT if section == 0 else E8
    k = 0
    tt = 0.0
    while tt < BAR - 1e-9:
        tick(t0 + tt, k % 2 == 0, 0.075 if section == 0 else 0.06)
        tt += step
        k += 1

    # --- arpegio en semicorcheas (con eco) ---
    if section >= 1:
        arp = [triad[0] + 12, triad[1] + 12, triad[2] + 12, triad[1] + 12]
        if section == 3:
            arp = [triad[0] + 12, triad[1] + 12, triad[2] + 12, triad[0] + 24]
        for i in range(16):
            m = arp[i % 4]
            g = 0.055 if section < 3 else 0.065
            note(m, t0 + i * E16, E16 * 0.7, 'pulse', 0.125, g, -0.45, r=0.02)
            note(m, t0 + i * E16 + E8 * 1.5, E16 * 0.7, 'pulse', 0.125, g * 0.35, 0.6, r=0.02)

    # --- batería ---
    if section >= 1:
        kick(t0)
    if section >= 2:
        kick(t0 + 2 * BEAT)
        kick(t0 + 2.5 * BEAT, 0.35)
        snare(t0 + BEAT)
        snare(t0 + 3 * BEAT)
    if bar == BARS - 1:                # redoble final que vuelve al principio
        for i in range(8):
            snare(t0 + 2 * BEAT + i * E16, 0.08 + i * 0.025)

    # --- melodía ---
    if section >= 2:
        mel = (MELODY if section == 2 else MELODY_B)[ci]
        for i in range(8):
            m = mel[half * 8 + i]
            if m is None:
                continue
            length = 1
            while half * 8 + i + length < 16 and length < 4 and mel[half * 8 + i + length] is None and (i + length) < 8:
                length += 1
            note(m, t0 + i * E8, E8 * length * 0.9, 'pulse', 0.5 if section == 2 else 0.25,
                 0.07, 0.25, a=0.01, d=0.12, s=0.7, r=0.05, vib=0.004)

# subida de ruido en los 2 últimos compases (expectativa antes de volver a empezar)
n = int(2 * BAR * SR)
t = np.arange(n) / SR
x = rng.uniform(-1, 1, n)
x = sosfilt(butter(2, [800, 6000], btype='band', fs=SR, output='sos'), x)
x = x / (np.max(np.abs(x)) + 1e-9) * (t / t[-1]) ** 2 * 0.06
add(x, (BARS - 2) * BAR, 1.0, 0.0)

# ---------- mezcla final ----------
stereo = np.stack([L, R])
loop = int(LENGTH * SR)
stereo[:, : stereo.shape[1] - loop] += stereo[:, loop:]   # pliega las colas al inicio → loop sin cortes
stereo = stereo[:, :loop]
sos = butter(2, 9000, btype='low', fs=SR, output='sos')  # suaviza el brillo de las ondas cuadradas
stereo = sosfilt(sos, stereo, axis=1)
stereo = np.tanh(stereo * 1.4) / np.tanh(1.4)
stereo *= 0.84 / np.max(np.abs(stereo))                   # pico a -1,5 dB

pcm = (stereo.T * 32767).astype('<i2')
os.makedirs(OUT, exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, 'musica.wav')
    with wave.open(wav, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    meta = ['-metadata', 'title=Decision Final - Tema de quiz', '-metadata', 'artist=DF Decision Final',
            '-metadata', 'copyright=CC0 1.0 - dominio publico', '-metadata', 'comment=Composicion original generada con tools/build_music.py']
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libvorbis', '-q:a', '3'] + meta
                   + [os.path.join(OUT, 'musica-quiz.ogg')], check=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '112k'] + meta
                   + [os.path.join(OUT, 'musica-quiz.mp3')], check=True)

print('Música generada: %.1f s · %s' % (LENGTH, OUT))
