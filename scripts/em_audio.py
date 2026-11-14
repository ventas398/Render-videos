"""Musica original + SFX sintetizados localmente (numpy/scipy, nada descargado) y mezcla voz+musica con ducking.
Uso (python del sistema, con scipy):  python scripts/em_audio.py sfx | loops | mix src/episodes/EM-023.json
 - sfx   -> public/audio/sfx/*.wav
 - loops -> public/audio/music/em-<estilo>.wav (4 compases, reutilizables en cualquier episodio)
 - mix   -> public/audio/music/<id>-music.wav y public/audio/<id>-mix.wav (voz + musica con ducking). Secciones: MAP_EM023 abajo.
"""
import json, os, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, resample_poly

SR, BPM = 44100, 100
BEAT = 60 / BPM
rng = np.random.default_rng(23)
T = lambda d: np.arange(int(d * SR)) / SR
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def filt(x, kind, f):
    return sosfilt(butter(2, f, kind, fs=SR, output="sos"), x)


def put(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n] * g


def pluck(f, d=0.5):
    t = T(d)
    x = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (5 + 4 * k)) for k, a in enumerate([1, .5, .25, .12], 1))
    return x * np.minimum(1, t / 0.004) * 0.5


def piano(f, d=1.6):
    t = T(d)
    x = sum(a * np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * t) * np.exp(-t * (1.6 + 1.3 * k)) for k, a in enumerate([1, .55, .3, .15, .08], 1))
    return x * np.minimum(1, t / 0.006) * 0.45


def glock(f, d=1.0):
    t = T(d)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t * 5) + .4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9)
    return x * np.minimum(1, t / 0.002) * 0.3


def bass(f, d=0.5):
    t = T(d)
    x = np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t)
    return x * np.exp(-t * 3.5) * np.minimum(1, t / 0.01) * 0.7


def pad(fs, d, bright=1500):
    t = T(d)
    x = 0
    for f in fs:
        for dt in (-0.004, 0, 0.004):
            x = x + 2 * (((f * (1 + dt)) * t) % 1) - 1
    x = filt(x / (3 * len(fs)), "low", bright)
    return x * np.minimum(1, t / 0.7) * np.minimum(1, (d - t) / 0.7)


def kick(d=0.35):
    t = T(d)
    return np.sin(2 * np.pi * np.cumsum(45 + 90 * np.exp(-t * 30)) / SR) * np.exp(-t * 11) * 0.9


def noise(d, kind, f, decay):
    t = T(d)
    return filt(rng.standard_normal(len(t)), kind, f) * np.exp(-t * decay)


hat = lambda: noise(0.09, "high", 7000, 55) * 0.25
clap = lambda: noise(0.22, "band", [1200, 4500], 22) * 0.5
shake = lambda: noise(0.07, "band", [4000, 9000], 70) * 0.2

# acordes: (nota de bajo, triada)
CH = dict(Am=(45, [57, 60, 64]), F=(41, [53, 57, 60]), C=(48, [60, 64, 67]), G=(43, [55, 59, 62]), E=(40, [56, 59, 64]), Dm=(50, [62, 65, 69]))
PROG = dict(
    curious=["Am", "F", "Am", "E"], bright=["C", "G", "Am", "F"], rhythmic=["F", "G", "Am", "C"],
    warm=["C", "Am", "F", "G"], resolve=["C", "G", "Am", "F"], burst=["F", "G", "C", "C"], tension=["Am"],
)


def section(style, dur, lift=False):
    """Musica de `style` de duracion dur (s), cuadricula de 100 bpm desde 0."""
    buf = np.zeros(int((dur + 2) * SR))
    prog = PROG[style]
    nb = int(dur / BEAT) + 4
    for b in range(0, nb, 4):
        bass_n, tri = CH[prog[(b // 4) % len(prog)]]
        t0 = b * BEAT
        last = b // 4 == int(dur / (4 * BEAT))
        if style in ("curious", "resolve", "bright", "burst"):
            put(buf, pad([hz(m) for m in tri], 4 * BEAT + .3, 900), t0, 0.35 if style != "burst" else .5)
        if style == "warm":
            put(buf, pad([hz(m - 12) for m in tri], 4 * BEAT + .3, 700), t0, 0.5)
        for i in range(8):  # corcheas
            tt = t0 + i * BEAT / 2
            if style in ("curious", "resolve"):
                put(buf, pluck(hz(tri[[0, 1, 2, 1, 0, 1, 2, 1][i]] + 12)), tt, 0.7)
                if style == "resolve":
                    put(buf, glock(hz(tri[[2, 0, 1, 0, 2, 0, 1, 0][i]] + 24)), tt + BEAT / 4, 0.5) if i % 2 else None
                put(buf, shake(), tt + BEAT / 4, 0.7)
            elif style in ("bright", "burst"):
                put(buf, pluck(hz(tri[[0, 2, 1, 2, 0, 2, 1, 2][i]] + 12)), tt, 0.6)
                put(buf, hat(), tt, 0.7)
                if i in (3, 7):
                    put(buf, piano(hz(tri[2] + 12), 0.8), tt, 0.6)
            elif style == "rhythmic":
                for j in range(2):
                    put(buf, pluck(hz(tri[(i + j * 2) % 3] + 12 + 12 * (j == 1 and i % 2 == 0)), 0.3), tt + j * BEAT / 4, 0.55)
                    put(buf, hat(), tt + j * BEAT / 4, 0.6 if j else 0.8)
                if i % 2:
                    put(buf, glock(hz(tri[1] + 24)), tt, 0.5)
            elif style == "warm":
                put(buf, piano(hz(tri[[0, 1, 2, 1, 2, 1, 0, 1][i]] + 12), 1.8), tt, 0.7)
        # bajo / percusion por pulso
        for q in range(4):
            tt = t0 + q * BEAT
            if style in ("curious",):
                if q % 2 == 0:
                    put(buf, bass(hz(bass_n)), tt, 0.8)
                if lift:
                    put(buf, kick(), tt, 0.7)
                    if q % 2:
                        put(buf, clap(), tt, 0.6)
            elif style in ("bright", "burst", "resolve"):
                put(buf, bass(hz(bass_n)), tt, 0.8) if q in (0, 2) else put(buf, bass(hz(bass_n + (7 if q == 1 else 12)), 0.3), tt + BEAT / 2 * (q == 3), 0.5)
                if q % 2 == 0 or style == "burst":
                    put(buf, kick(), tt, 0.8)
                if q % 2:
                    put(buf, clap(), tt, 0.7)
            elif style == "rhythmic":
                put(buf, kick(), tt, 0.7)
                put(buf, bass(hz(bass_n), 0.3), tt, 0.7)
                put(buf, bass(hz(bass_n + 12), 0.25), tt + BEAT / 2, 0.45)
                if q % 2:
                    put(buf, clap(), tt, 0.5)
            elif style == "warm":
                if q == 0:
                    put(buf, bass(hz(bass_n), 2.0), tt, 0.7)
                if q % 2:
                    put(buf, shake(), tt, 0.5)
    return buf[:int(dur * SR)]


def tension(dur):
    """Pad grave + pulso que se acelera + riser hasta el final."""
    buf = np.zeros(int(dur * SR))
    put(buf, pad([hz(45), hz(52), hz(46)], dur, 700), 0, 0.9)
    t, gap = 0.5, 1.1
    while t < dur - 0.4:
        put(buf, kick(0.3) * 0.6, t, 0.8 * (0.5 + 0.5 * t / dur))
        put(buf, glock(hz(81), 0.25), t + 0.02, 0.5 * t / dur)
        t += gap
        gap = max(0.3, gap * 0.93)
    n = int(min(4, dur) * SR)
    ris = filt(rng.standard_normal(n), "band", [300, 5000]) * np.linspace(0, 1, n) ** 2.2 * 0.5
    buf[-n:] += ris
    buf[-n:] += np.sin(2 * np.pi * np.cumsum(np.linspace(200, 1400, n)) / SR) * np.linspace(0, 1, n) ** 2 * 0.15
    return buf


def sfx():
    out = {}
    sm = lambda n, a=0.35: np.sin(np.pi * np.minimum(1, np.linspace(0, 1, n) / a) / 2) ** 2 * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.2

    def swish(d, f0, f1):  # aire filtrado paso-bajo, ataque suave, nada por encima de ~3 kHz
        n = int(d * SR)
        return filt(filt(rng.standard_normal(n), "band", [f0, f1]), "low", 2500) * sm(n)

    out["sw1"] = swish(0.22, 250, 2200)
    out["sw2"] = swish(0.18, 400, 1600)
    t = T(0.24)
    out["sw3"] = filt(np.sin(2 * np.pi * 196 * t) + 0.5 * np.sin(2 * np.pi * 294 * t), "low", 1200) * sm(len(t))  # pad suave
    t = T(0.09)
    out["paper"] = filt(rng.standard_normal(len(t)), "band", [600, 3000]) * sm(len(t), 0.15) * np.exp(-t * 18)  # tick de papel
    n = int(0.55 * SR)
    out["whoosh"] = filt(filt(rng.standard_normal(n), "band", [200, 3000]), "low", 3500) * sm(n, 0.5)
    t = T(0.12)
    out["pop"] = np.sin(2 * np.pi * (450 + 500 * np.exp(-t * 50)) * t) * np.exp(-t * 30) * np.minimum(1, t / 0.006)
    t = T(0.05)
    out["tick"] = filt(rng.standard_normal(len(t)), "band", [1000, 3200]) * np.exp(-t * 90) * np.minimum(1, t / 0.003)
    t = T(0.06)
    out["tock"] = filt(rng.standard_normal(len(t)), "band", [600, 2200]) * np.exp(-t * 70) * np.minimum(1, t / 0.003)
    t = T(1.0)
    vib = 1 + .004 * np.sin(2 * np.pi * 5 * t)
    horn = sum(2 * ((f * vib * t) % 1) - 1 for f in (392, 494)) * 0.5
    out["horn"] = filt(horn, "low", 1100) * np.minimum(1, t / 0.05) * np.minimum(1, (1 - t) / 0.1)
    t = T(0.4)
    out["thud"] = np.sin(2 * np.pi * (90 * np.exp(-t * 6)) * t * 3) * np.exp(-t * 14) * np.minimum(1, t / 0.01)
    t = T(1.2)
    out["ding"] = (np.sin(2 * np.pi * 1046 * t) + .3 * np.sin(2 * np.pi * 1046 * 2 * t)) * np.exp(-t * 4) * np.minimum(1, t / 0.008)
    n = int(2.0 * SR)
    out["swell"] = filt(filt(rng.standard_normal(n), "band", [150, 2500]), "low", 3000) * np.linspace(0, 1, n) ** 2
    os.makedirs("public/audio/sfx", exist_ok=True)
    for k in ("whoosh-s", "page"):
        f = f"public/audio/sfx/{k}.wav"
        if os.path.exists(f):
            os.remove(f)
    for k, x in out.items():
        x = x / max(1e-6, np.abs(x).max()) * 0.8
        wavfile.write(f"public/audio/sfx/{k}.wav", SR, (x * 32767).astype(np.int16))
        print(f"{k:6s} pico {20*np.log10(0.8):.1f} dBFS  rms {20*np.log10(np.sqrt(np.mean(x**2))+1e-9):.1f} dBFS")


def save(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    x = x / max(1e-6, np.abs(x).max()) * 0.9
    wavfile.write(path, SR, (x * 32767).astype(np.int16))


def loops():
    for s in ("curious", "bright", "rhythmic", "warm", "resolve"):
        save(f"public/audio/music/em-{s}.wav", section(s, 4 * 4 * BEAT, lift=s == "curious"))
    save("public/audio/music/em-tension.wav", tension(10.0))
    print("loops ok")


def smooth_env(x, a, r):
    """Seguidor de envolvente por muestras decimadas (1 ms)."""
    hop = SR // 1000
    n = len(x) // hop
    e = np.abs(x[: n * hop]).reshape(n, hop).max(1)
    y = np.zeros(n)
    ca, cr = np.exp(-1 / a), np.exp(-1 / r)
    for i in range(1, n):
        c = ca if e[i] > y[i - 1] else cr
        y[i] = c * y[i - 1] + (1 - c) * e[i]
    return np.interp(np.arange(len(x)) / hop, np.arange(n), y)


# Mapa de secciones EM-023: (estilo, parte inicial, ganancia dB). Fin = inicio de la siguiente. 'night' lleva logica propia.
MAP_EM023 = [("curious", 0, -2), ("bright", 4, 0), ("rhythmic", 13, 1), ("tension", 20, 0), ("burst", 24, 3), ("warm", 25, -2), ("resolve", 31, 1)]


MAP_EM022 = [("curious", 0, -2), ("bright", 3, 0), ("warm", 12, -1), ("rhythmic", 17, 1), ("resolve", 24, 0)]


MAP_EM004 = [("curious", 0, -2), ("bright", 5, 0), ("warm", 10, -1), ("rhythmic", 18, 1), ("warm", 27, -1), ("resolve", 34, 0)]


MAP_EM025 = [("curious", 0, -2), ("bright", 14, 0), ("warm", 25, -1), ("tension", 58, 0), ("curious", 69, -1), ("warm", 88, -1), ("rhythmic", 98, 1), ("curious", 113, -2), ("tension", 119, 0), ("warm", 132, -1), ("resolve", 147, 0)]


MAP_EM029 = [("curious", 0, -2), ("bright", 13, 0), ("warm", 21, -1), ("rhythmic", 49, 1), ("curious", 69, -1), ("warm", 90, -1), ("bright", 101, 0), ("warm", 115, -2), ("rhythmic", 133, 1), ("resolve", 143, 0)]
MAP_EM026 = [("curious", 0, -2), ("bright", 15, 0), ("warm", 26, -1), ("curious", 48, -1), ("warm", 60, -2), ("rhythmic", 76, 1), ("curious", 92, -1), ("warm", 104, -1), ("bright", 127, 0), ("resolve", 138, 0)]


ANCLA_025 = 102  # frase de EM-025 donde la voz dice "three solemn chords" (ver mix())
FFMPEG = next((f for f in ('C:\\Tools\\ffmpeg\\ffmpeg.exe', '/usr/bin/ffmpeg') if os.path.exists(f)), 'ffmpeg')  # en la nube (Linux) cae en el del sistema
CLIP_DB = 2.0  # v33 (orden de Javier 31/10, oido): valores de v31 (CLIP_DB 2,0; rampa entrada 0,02 s; salida 1,5 s). v32 usaba -1,0 / 0,7 / 2,0 y la flauta no se oia. NO regenerar EM-025 sin orden


def auto_map(ep):
    """Remake de terminados: un estilo por escena (curious al inicio, resolve en la ultima)."""
    st, g, sc = ["curious", "bright", "warm", "rhythmic", "warm", "bright", "rhythmic", "warm"], {"curious": -2, "warm": -1, "rhythmic": 1}, ep["scenes"]
    return [("resolve" if k == len(sc) - 1 else st[k % len(st)], x["fromPart"], g.get(st[k % len(st)], 0) if k < len(sc) - 1 else 0) for k, x in enumerate(sc)]


# EM_SECT_DB="49:-1.5,133:-1.5": dB extra por seccion (clave = parte inicial en el MAP). Opcional; sin definir no cambia nada.
SECT_DB = {int(k): float(v) for k, v in (x.split(":") for x in os.environ.get("EM_SECT_DB", "").split(",") if x)}


# ===================== EM-053 "El poder de la musica": 13 piezas propias (M1-M13) + caja de musica PD en M10 (docs/EM-053-MUSICA.md) =====================
# Estilos nuevos; los de arriba no cambian. Cada pieza con su tempo, instrumentos y dinamica propios (Javier: que no suene monotona).
saw = lambda f, t: 2 * ((f * t) % 1) - 1
cut_env = lambda t, d, a=0.01, r=0.08: np.minimum(1, t / a) * np.clip((d - t) / r, 0, 1)


def strings(f, d, bright=2200):
    t = T(d + 0.4)
    vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * t)
    x = sum(saw(f * (1 + dt) * vib, t) for dt in (-0.003, 0, 0.0035)) / 3
    return filt(x, "low", bright) * np.minimum(1, t / 0.25) * np.clip((d + 0.4 - t) / 0.4, 0, 1) * 0.5


def accordion(f, d):  # musette: 3 lenguetas desafinadas + fuelle
    t = T(d + 0.05)
    x = sum(np.sign(np.sin(2 * np.pi * f * (1 + dt) * t)) * 0.6 + saw(f * (1 + dt), t) * 0.4 for dt in (-0.006, 0, 0.007)) / 3
    return filt(x, "low", 2800) * cut_env(t, d + 0.05, 0.03, 0.06) * (1 + 0.08 * np.sin(2 * np.pi * 4 * t)) * 0.35


def brass(f, d, bright=1.0):  # el brillo se abre en el ataque
    t = T(d + 0.06)
    x = saw(f * (1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.3)), t)
    e = np.minimum(1, t / 0.06)
    return (filt(x, "low", 500 * bright) * (1 - e) + filt(x, "low", 2600 * bright) * e) * cut_env(t, d + 0.06, 0.02, 0.06) * 0.45


def epiano(f, d=1.5):
    t = T(d)
    x = np.sin(2 * np.pi * f * t + 1.2 * np.exp(-t * 4) * np.sin(2 * np.pi * f * t)) + 0.15 * np.sin(2 * np.pi * f * 7 * t) * np.exp(-t * 12)
    return x * np.exp(-t * 1.8) * np.minimum(1, t / 0.004) * 0.4


def snare(v=1.0):
    t = T(0.2)
    return (filt(rng.standard_normal(len(t)), "band", [1500, 7000]) * np.exp(-t * 25) * 0.6 + np.sin(2 * np.pi * 185 * t) * np.exp(-t * 30) * 0.5) * v


def timp(f=55, d=1.2):
    t = T(d)
    return np.sin(2 * np.pi * f * t * (1 + 0.03 * np.exp(-t * 8))) * np.exp(-t * 3) * np.minimum(1, t / 0.005) * 0.9 + filt(rng.standard_normal(len(t)), "low", 300) * np.exp(-t * 40) * 0.3


def gtr(fs, d):  # power chord distorsionado
    t = T(d)
    x = np.tanh(6 * filt(sum(saw(f * (1 + dt), t) for f in fs for dt in (-0.002, 0.002)), "low", 4000))
    return filt(filt(x, "band", [90, 3800]), "low", 3000) * cut_env(t, d, 0.005, 0.1) * 0.5


def sbass(f, d):
    t = T(d)
    return filt(saw(f, t), "low", 600) * cut_env(t, d, 0.004, 0.03) * np.exp(-t * 3) * 0.8


def lead(f, d, cut):
    t = T(d)
    return filt(saw(f, t) + saw(f * 1.005, t), "low", cut) * np.exp(-t * 9) * np.minimum(1, t / 0.003) * 0.3


ohat = lambda: noise(0.25, "high", 6000, 16) * 0.22
cymbal = lambda d=2.5: noise(d, "high", 4000, 1.6) * 0.5


def melody(buf, notes, b, inst, t0=0.0, g=1.0, oct=0, ln=1.0):
    """notes = [(midi o None, pulsos)]; devuelve el tiempo final."""
    at = t0
    for n, l in notes:
        if n is not None:
            put(buf, inst(hz(n + oct), l * b * ln), at, g)
        at += l * b
    return at


MEL1 = [(81, 1), (78, .5), (74, .5), (69, 1), (74, 1), (73, .5), (76, .5), (79, .5), (76, .5), (73, 1), (69, 1), (78, .5), (79, .5), (81, .5), (78, .5), (74, 1), (69, .5), (71, .5),
        (71, .5), (74, .5), (79, .5), (83, .5), (81, 1), (79, 1), (78, .5), (76, .5), (74, .5), (73, .5), (74, .5), (76, .5), (78, .5), (79, .5),
        (81, .5), (79, .5), (78, .5), (76, .5), (73, .5), (74, .5), (76, 1), (74, .5), (78, .5), (81, .5), (86, .5), (85, .5), (81, .5), (76, .5), (79, .5), (78, 1), (74, 1), (74, 2)]
CH1 = [(50, [62, 66, 69]), (45, [61, 64, 67]), (50, [62, 66, 69]), (43, [62, 67, 71]), (45, [62, 66, 69]), (45, [61, 64, 67]), (50, [62, 66, 69]), (50, [62, 66, 69])]


def m1(d, bpm=112, soft=False):
    """Piano 'a lo Mozart' original (re mayor): bajo Alberti + melodia; la 2.a vuelta suma un segundo piano en terceras."""
    b, bar = 60 / bpm, 240 / bpm
    buf = np.zeros(int((d + 3) * SR))
    for k in range(int(d / (8 * bar)) + 1):
        t0, g = k * 8 * bar, (0.55 if k % 2 == 0 else 0.8) * (0.7 if soft else 1)
        at = t0
        for n, l in MEL1:
            put(buf, piano(hz(n), max(0.5, l * b * 1.6)), at, g)
            if k % 2:  # segundo piano: nota del acorde por debajo
                tri = CH1[min(7, int((at - t0) / bar + 1e-6))][1]
                low = [m + 12 * o for o in (0, 1) for m in tri if m + 12 * o < n - 2]
                put(buf, piano(hz(max(low)), max(0.5, l * b * 1.4)), at, 0.45 * g) if low else None
            at += l * b
        for i, (bn, tri) in enumerate(CH1):
            for j in range(8):
                put(buf, piano(hz([tri[0], tri[2], tri[1], tri[2]][j % 4] - 12), b * 0.9), t0 + i * bar + j * b / 2, 0.3 * g)
            put(buf, piano(hz(bn - 12), bar), t0 + i * bar, 0.32 * g)
    return buf[: int(d * SR)]


def m2(d, solo):
    """Tension al escalofrio: cuerdas graves + latido que acelera y crece; 1 s de silencio y estallido en la mayor."""
    buf = np.zeros(int((d + solo + 3) * SR))
    put(buf, strings(hz(45), d, 900), 0, 0.6)
    put(buf, strings(hz(52), d, 1100), 0, 0.45)
    for i, m in enumerate([64, 65, 66, 67, 68]):
        put(buf, strings(hz(m), d / 5 + 0.3, 1600 + 300 * i), i * d / 5, 0.25 + 0.06 * i)
    t = 0.4
    while t < d - 0.3:
        v = 0.35 + 0.65 * t / d
        put(buf, timp(55, 0.9), t, v)
        put(buf, timp(55, 0.7), t + 0.22, 0.6 * v)
        t += 60 / (72 + 22 * t / d)
    n = int(d * SR)
    buf[:n] *= np.linspace(0.35, 1, n) ** 1.5
    buf[n - int(0.12 * SR): n] *= np.linspace(1, 0, int(0.12 * SR))
    buf[n:] = 0
    tb = d + 1.0
    for m in (45, 57, 61, 64, 69, 73, 76):
        put(buf, strings(hz(m), solo - 0.6, 3200), tb, 0.5)
    for m in (57, 61, 64):
        put(buf, brass(hz(m), solo - 1.2), tb, 0.35)
    put(buf, cymbal(3), tb, 0.9)
    put(buf, timp(45, 2), tb, 1.0)
    return buf[: int((d + solo) * SR)]


def m3(d, bpm=64):
    """Melancolia: piano en la menor con arpegios abiertos; cuerdas desde el 2.o compas."""
    b = 60 / bpm
    buf = np.zeros(int((d + 4) * SR))
    prog = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (40, [56, 59, 64])]
    top = [76, 72, 79, 71]
    for i in range(int(d / (4 * b)) + 1):
        bn, tri = prog[i % 4]
        t0 = i * 4 * b
        put(buf, piano(hz(bn), 4 * b), t0, 0.5)
        for j, m in enumerate([tri[0], tri[1], tri[2], tri[1] + 12, tri[2], tri[1], tri[0] + 12, tri[2]]):
            put(buf, piano(hz(m - 12), 2.0), t0 + j * b / 2, 0.35)
        put(buf, piano(hz(top[i % 4]), 3 * b), t0 + b * (i % 2), 0.5)
        if i >= 1:
            put(buf, strings(hz(tri[0] - 12), 4 * b, 1400), t0, 0.22)
            put(buf, strings(hz(tri[2]), 4 * b, 1600), t0, 0.14)
    return buf[: int(d * SR)]


MEL4 = [(67, .5), (72, .5), (76, 1), (79, 1), (77, 1.5), (76, .5), (74, 1), (71, .5), (74, .5), (77, 1), (81, 1), (79, 2), (76, 1),
        (76, .5), (79, .5), (84, 1), (83, 1), (81, 1.5), (79, .5), (77, 1), (74, .5), (77, .5), (83, 1), (81, .5), (79, .5), (84, 2), (None, 1)]
CH4 = [(48, [60, 64, 67]), (43, [59, 65, 67]), (43, [59, 65, 67]), (48, [60, 64, 67]), (48, [60, 64, 67]), (41, [60, 65, 69]), (43, [59, 65, 67]), (48, [60, 64, 67])]


def m4(d, bpm=90):
    """Vals musette (3/4): acordeon + bajo-acorde-acorde."""
    b = 60 / bpm
    buf = np.zeros(int((d + 3) * SR))
    for k in range(int(d / (24 * b)) + 1):
        t0 = k * 24 * b
        melody(buf, MEL4, b, accordion, t0, 0.9, ln=0.95)
        for i, (bn, tri) in enumerate(CH4):
            tb = t0 + i * 3 * b
            put(buf, bass(hz(bn - 12 + (7 if i % 2 else 0)), 0.5), tb, 0.9)
            for q in (1, 2):
                for m in tri:
                    put(buf, accordion(hz(m - 12), 0.22), tb + q * b, 0.32)
    return buf[: int(d * SR)]


MEL5 = [(74, .5), (77, .5), (82, 1), (81, .5), (79, .5), (77, .5), (75, .5), (72, .5), (75, .5), (81, 1), (82, 1), (77, 1),
        (74, .25), (75, .25), (77, .5), (74, .5), (70, .5), (79, .5), (82, .5), (79, .5), (75, .5), (77, .5), (81, .5), (84, .5), (81, .5), (82, 1), (None, 1)]
CH5 = [(46, [62, 65, 70]), (41, [57, 60, 63]), (41, [57, 60, 63]), (46, [62, 65, 70]), (46, [62, 65, 70]), (39, [58, 63, 67]), (41, [57, 60, 63]), (46, [62, 65, 70])]


def m5(d, bpm=116):
    """Oompah (2/4): tuba en el pulso, metales a contratiempo, trompeta y caja; redoble cada 8 compases."""
    b = 60 / bpm
    buf = np.zeros(int((d + 3) * SR))
    for k in range(int(d / (16 * b)) + 1):
        t0 = k * 16 * b
        melody(buf, MEL5, b, lambda f, l: brass(f, l, 1.3), t0, 0.8, ln=0.85)
        for i, (bn, tri) in enumerate(CH5):
            tb = t0 + i * 2 * b
            put(buf, brass(hz(bn - 12), 0.3, 0.6), tb, 0.9)
            put(buf, brass(hz(bn - 5), 0.3, 0.6), tb + b, 0.75)
            put(buf, kick(0.3), tb, 0.5)
            for h in (0.5, 1.5):
                for m in tri:
                    put(buf, brass(hz(m - 12), 0.16), tb + h * b, 0.28)
                put(buf, snare(0.35), tb + h * b, 0.6)
        for r in range(8):
            put(buf, snare(0.2 + 0.08 * r), t0 + 15 * b + r * b / 8, 0.7)
    return buf[: int(d * SR)]


GROOVE = {  # 16 pasos por compas a 120 BPM; mismo tempo y sonidos, solo cambia la sincopa (Witek 2014)
    "a": dict(K=[0, 4, 8, 12], S=[4, 12], G=[], H=list(range(0, 16, 2)), B=[(0, 40), (4, 40), (8, 40), (12, 40)]),
    "b": dict(K=[0, 3, 8, 10], S=[4, 12], G=[7, 9, 15], H=list(range(16)), B=[(0, 40), (3, 40), (6, 43), (8, 52), (10, 45), (13, 47), (14, 40)]),
    "c": dict(K=[1, 3, 6, 9, 11, 14], S=[2, 5, 7, 10, 13, 15], G=[], H=[1, 3, 5, 6, 9, 11, 12, 15], B=[(1, 40), (2, 43), (5, 40), (7, 52), (9, 45), (11, 47), (13, 40), (15, 43)]),
}


def m6(d, var, bpm=120):
    s = 15 / bpm
    p = GROOVE[var]
    buf = np.zeros(int((d + 2) * SR))
    for bar in range(int(d / (16 * s)) + 1):
        t0 = bar * 16 * s
        for k in p["K"]:
            put(buf, kick(0.3), t0 + k * s, 0.9)
        for k in p["S"]:
            put(buf, snare(1.0), t0 + k * s, 0.7)
        for k in p["G"]:
            put(buf, snare(0.25), t0 + k * s, 0.6)
        for k in p["H"]:
            put(buf, hat(), t0 + k * s, 0.9 if k % 4 == 0 else 0.5)
        for k, m in p["B"]:
            put(buf, sbass(hz(m), 0.22), t0 + k * s, 0.9)
    return buf[: int(d * SR)]


def m7(d, bpm=138, arp=True):
    """Electronica para correr: bombo 4/4, bajo a contratiempo, palmas; el arpegio entra al 3.er compas y su filtro se abre."""
    b = 60 / bpm
    buf = np.zeros(int((d + 2) * SR))
    prog = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (43, [55, 59, 62])]
    for bar in range(int(d / (4 * b)) + 1):
        bn, tri = prog[bar % 4]
        t0 = bar * 4 * b
        for q in range(4):
            tq = t0 + q * b
            put(buf, kick(0.3), tq, 1.0)
            put(buf, ohat(), tq + b / 2, 0.7)
            put(buf, sbass(hz(bn - 12), b * 0.45), tq + b / 2, 0.9)
            if q % 2:
                put(buf, clap(), tq, 0.6)
        if arp and bar >= 2:
            cut = 700 + 3300 * min(1, t0 / max(1, d))
            for j in range(16):
                put(buf, lead(hz(tri[j % 3] + (12 if j % 8 >= 4 else 0)), b / 4 * 1.5, cut), t0 + j * b / 4, 0.5)
    return buf[: int(d * SR)]


def m9(d, bpm=68):
    """Calma / esperanza: piano electrico + colchon calido, sin percusion; campana cada 2 compases, bajo desde el 3.o."""
    b = 60 / bpm
    buf = np.zeros(int((d + 4) * SR))
    prog = [(48, [60, 64, 67]), (47, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]
    for i in range(int(d / (4 * b)) + 1):
        bn, tri = prog[i % 4]
        t0 = i * 4 * b
        put(buf, pad([hz(m - 12) for m in tri], 4 * b + 0.4, 800), t0, 0.35)
        for j, m in enumerate([tri[0], tri[1], tri[2], tri[1] + 12 if i % 2 else tri[2]]):
            put(buf, epiano(hz(m), 2.2), t0 + j * b, 0.5)
        if i % 2 == 0:
            put(buf, glock(hz(tri[2] + 24), 1.6), t0, 0.35)
        if i >= 2:
            put(buf, bass(hz(bn - 12), 3 * b), t0, 0.45)
    return buf[: int(d * SR)]


def m11(d, bpm=124):
    """Cancion bailable (contraste de la nana): bombo, palmas, pluck brillante sincopado."""
    b = 60 / bpm
    buf = np.zeros(int((d + 2) * SR))
    prog = [(48, [64, 67, 72]), (43, [62, 67, 71]), (45, [64, 69, 72]), (41, [65, 69, 72])]
    for bar in range(int(d / (4 * b)) + 1):
        bn, tri = prog[bar % 4]
        t0 = bar * 4 * b
        for q in range(4):
            put(buf, kick(0.3), t0 + q * b, 0.9)
            put(buf, hat(), t0 + q * b + b / 2, 0.8)
            put(buf, clap(), t0 + q * b, 0.6) if q % 2 else None
            put(buf, bass(hz(bn - 12), 0.25), t0 + q * b + b / 2, 0.8)
        for st in (0, 3, 6):
            for m in tri:
                put(buf, pluck(hz(m), 0.3), t0 + st * b / 2, 0.45)
    return buf[: int(d * SR)]


def m12_sting(d=2.6, bpm=140):
    """Heavy metal (perros): chugs de power chord en Mi + bombo doble; acaba en acorde tenido."""
    s = 15 / bpm
    buf = np.zeros(int((d + 1) * SR))
    n = int((d - 0.9) / s)
    for k in range(n):
        put(buf, gtr([hz(40), hz(47), hz(52)], s * 0.8), k * s, 0.8 if k % 4 else 1.0)
        put(buf, kick(0.2), k * s, 0.7)
    put(buf, gtr([hz(40), hz(47), hz(52)], 0.9), n * s, 1.0)
    put(buf, cymbal(1.2), n * s, 0.6)
    return buf[: int(d * SR)]


def m13(d, bpm=84):
    """Cierre en suspenso: pulso grave en corcheas, ostinato de piano, colchon sus; las cuerdas entran a mitad. Corte seco."""
    b = 60 / bpm
    buf = np.zeros(int((d + 3) * SR))
    prog = [(38, [62, 69, 76]), (34, [62, 69, 74]), (43, [62, 67, 74]), (45, [62, 69, 76])]
    ost = [69, 74, 76, 77, 76, 74, 72, 74]
    for bar in range(int(d / (4 * b)) + 1):
        bn, tri = prog[bar % 4]
        t0 = bar * 4 * b
        put(buf, pad([hz(m - 12) for m in tri], 4 * b + 0.4, 1000), t0, 0.35)
        for j in range(8):
            put(buf, sbass(hz(bn - 12), b * 0.4), t0 + j * b / 2, 0.55)
            put(buf, piano(hz(ost[j] + (12 if bar % 4 == 3 else 0)), 0.9), t0 + j * b / 2, 0.3)
        for q in (0, 2):
            put(buf, kick(0.3), t0 + q * b, 0.45)
        if t0 > d / 2:
            put(buf, strings(hz(tri[1]), 4 * b, 1800), t0, 0.25)
    return buf[: int(d * SR)]


# ---- EM-053 v2 (calidad 09/11: M1/M3/M5/M9/M12/M13 sonaban parecidas): instrumentos y versiones nuevas; las de arriba no cambian ----
def ks(f, d, damp=0.996, bright=0.5):
    """Cuerda pulsada Karplus-Strong (guitarra / arpa / pizzicato); bright = mezcla de ruido vs. ruido filtrado."""
    N = max(2, int(SR / f))
    n = int(d * SR) + N
    y = np.zeros(n)
    y[:N] = rng.uniform(-1, 1, N) * bright + filt(rng.uniform(-1, 1, N), "low", 1500) * (1 - bright)
    for k in range(1, n // N):
        p = y[(k - 1) * N - 1: k * N - 1] if k > 1 else np.r_[0, y[: N - 1]]
        y[k * N: (k + 1) * N] = 0.5 * damp * (y[(k - 1) * N: k * N] + p)
    return y[: int(d * SR)] * cut_env(T(d), d, 0.001, 0.05) * 0.5


def tuba(f, d):  # fundamental fuerte + sub, ataque con "lengua"
    t = T(d + 0.05)
    s, e = saw(f, t), np.exp(-t * 12)
    x = 0.7 * np.sin(2 * np.pi * f * t) + 0.5 * (filt(s, "low", 1600) * e + filt(s, "low", 700) * (1 - e)) + 0.35 * np.sin(np.pi * f * t)
    return np.tanh(1.6 * x) * cut_env(t, d + 0.05, 0.015, 0.05) * 0.6


def trumpet(f, d):  # metal brillante y saturado
    return np.tanh(2.2 * brass(f, d, 2.2)) * 0.5


def flute(f, d):
    t = T(d + 0.1)
    vib = 1 + 0.005 * np.sin(2 * np.pi * 5 * t) * np.minimum(1, t / 0.4)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    x = np.sin(ph) + 0.12 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph) + 0.06 * filt(rng.standard_normal(len(t)), "band", [f, min(3 * f, 16000)])
    return x * cut_env(t, d + 0.1, 0.06, 0.12) * 0.35


def cello(f, d):
    t = T(d + 0.3)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5 * t) * np.minimum(1, t / 0.5)
    x = saw(f * vib, t) + saw(f * 1.002 * vib, t)
    return filt(filt(x, "band", [80, 1400]), "low", 1100) * cut_env(t, d + 0.3, 0.18, 0.3) * 0.35


def celesta(f, d=1.2):  # campana FM brillante
    t = T(d)
    return np.sin(2 * np.pi * f * t + 2.0 * np.exp(-t * 6) * np.sin(2 * np.pi * 3.5 * f * t)) * np.exp(-t * 3.5) * np.minimum(1, t / 0.002) * 0.3


def m1b(d, bpm=112, tex=("piano",), g0=1.0):
    """M1 con textura distinta en cada frase de 8 compases: piano | flauta + pizzicato + cuerdas | cuerdas + piano | flauta + arpa."""
    b, bar = 60 / bpm, 240 / bpm
    buf = np.zeros(int((d + 3) * SR))
    for k in range(int(d / (8 * bar)) + 1):
        t0, x = k * 8 * bar, tex[k % len(tex)]
        lead_i = {"piano": lambda f, l: piano(f, max(0.5, l * 1.6)), "flute": flute, "harp": lambda f, l: ks(f, max(0.6, l * 2), 0.999, 0.9), "strings": lambda f, l: strings(f, l, 3000)}[x]
        melody(buf, MEL1, b, lead_i, t0, 0.8 * g0 if x != "piano" else 0.6 * g0, -12 if x == "strings" else 0)
        for i, (bn, tri) in enumerate(CH1):
            ta = t0 + i * bar
            if x == "piano":
                for j in range(8):
                    put(buf, piano(hz([tri[0], tri[2], tri[1], tri[2]][j % 4] - 12), b * 0.9), ta + j * b / 2, 0.3 * g0)
                put(buf, piano(hz(bn - 12), bar), ta, 0.32 * g0)
            elif x in ("flute", "harp"):
                for j in range(4 if x == "flute" else 8):
                    m = [bn, tri[0], tri[1], tri[2]][j % 4] if x == "flute" else [tri[0], tri[1], tri[2], tri[1] + 12][j % 4] + 12 * (j >= 4) - 12
                    put(buf, ks(hz(m), b * 1.5, 0.993 if x == "flute" else 0.998, 0.3 if x == "flute" else 0.7), ta + j * b / (1 if x == "flute" else 2), 0.5 * g0)
                put(buf, strings(hz(tri[0] - 12), bar, 1200), ta, 0.12 * g0) if x == "flute" else None
            else:
                put(buf, strings(hz(bn - 12), bar, 900), ta, 0.25 * g0)
                for m in tri:
                    put(buf, piano(hz(m), 1.0), ta + 2 * b, 0.18 * g0)
    return buf[: int(d * SR)]


def m3b(d, bpm=64):
    """Melancolia v2: chelo con la melodia + cuerdas + arpa en arpegios (sin piano)."""
    b = 60 / bpm
    buf = np.zeros(int((d + 4) * SR))
    prog = [(45, [57, 60, 64]), (41, [57, 60, 65]), (48, [55, 60, 64]), (40, [56, 59, 64])]
    top = [64, 60, 67, 59]
    for i in range(int(d / (4 * b)) + 1):
        bn, tri = prog[i % 4]
        t0 = i * 4 * b
        put(buf, cello(hz(top[i % 4]), 3.6 * b), t0 + 0.2, 0.7)
        put(buf, strings(hz(bn - 12), 4 * b, 700), t0, 0.35)
        put(buf, strings(hz(tri[1]), 4 * b, 1300), t0, 0.12 * min(1, i))
        for j, m in enumerate([tri[0], tri[1], tri[2], tri[1] + 12, tri[2] + 12, tri[1] + 12]):
            put(buf, ks(hz(m), 2.0, 0.998, 0.6), t0 + j * b * 2 / 3, 0.3)
    return buf[: int(d * SR)]


def m5b(d, bpm=116):
    """Oompah v2: tuba con sub en el pulso, trompeta brillante, metales a contratiempo, caja y platillo cada 4 compases."""
    b = 60 / bpm
    buf = np.zeros(int((d + 3) * SR))
    for k in range(int(d / (16 * b)) + 1):
        t0 = k * 16 * b
        melody(buf, MEL5, b, trumpet, t0, 0.9, ln=0.8)
        put(buf, cymbal(1.5), t0, 0.5)
        for i, (bn, tri) in enumerate(CH5):
            tb = t0 + i * 2 * b
            put(buf, tuba(hz(bn - 12), 0.32), tb, 1.0)
            put(buf, tuba(hz(bn - 17), 0.32), tb + b, 0.85)
            put(buf, kick(0.3), tb, 0.6)
            for h in (0.5, 1.5):
                for m in tri:
                    put(buf, trumpet(hz(m - 12), 0.14), tb + h * b, 0.22)
                put(buf, snare(0.5), tb + h * b, 0.5)
        for r in range(8):
            put(buf, snare(0.2 + 0.08 * r), t0 + 15 * b + r * b / 8, 0.7)
    return buf[: int(d * SR)]


def m9b(d, bpm=68):
    """Calma / esperanza v2: guitarra acustica en arpegios (Karplus-Strong) + colchon calido + bajo suave; sin percusion."""
    b = 60 / bpm
    buf = np.zeros(int((d + 4) * SR))
    prog = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]
    for i in range(int(d / (4 * b)) + 1):
        bn, tri = prog[i % 4]
        t0 = i * 4 * b
        put(buf, pad([hz(m) for m in tri], 4 * b + 0.4, 1100), t0, 0.22)
        for j, m in enumerate([bn, tri[0], tri[1], tri[2], tri[1] + 12, tri[2], tri[1], tri[0]]):
            put(buf, ks(hz(m), 2.5, 0.997, 0.45), t0 + j * b / 2, 0.55)
        if i >= 2:
            put(buf, bass(hz(bn - 12), 3 * b), t0, 0.4)
    return buf[: int(d * SR)]


def m13b(d, bpm=84):
    """Cierre en suspenso v2: ostinato de celesta brillante, colchon agudo, tic de hat, pulso grave; corte seco."""
    b = 60 / bpm
    buf = np.zeros(int((d + 3) * SR))
    prog = [(38, [62, 69, 76]), (34, [62, 69, 74]), (43, [62, 67, 74]), (45, [62, 69, 76])]
    ost = [81, 86, 88, 89, 88, 86, 84, 86]
    for bar in range(int(d / (4 * b)) + 1):
        bn, tri = prog[bar % 4]
        t0 = bar * 4 * b
        put(buf, pad([hz(m + 12) for m in tri], 4 * b + 0.4, 4000), t0, 0.18)
        for j in range(8):
            put(buf, celesta(hz(ost[j] + (12 if bar % 4 == 3 else 0)), 1.0), t0 + j * b / 2, 0.45)
            put(buf, hat(), t0 + j * b / 2 + b / 4, 0.6)
        for q in (0, 2):
            put(buf, sbass(hz(bn - 12), b * 0.8), t0 + q * b, 0.5)
            put(buf, kick(0.3), t0 + q * b, 0.35)
    return buf[: int(d * SR)]


def mix053(ep):
    """EM-053: inserta los solos de musica (narrador callado) en la voz, escribe <timing>.mix.json con los tiempos desplazados y mezcla M1-M13."""
    tm = json.load(open(ep["timing"], encoding="utf-8"))
    ends, solo, TAIL = tm["ends"], {c["soloAfterPart"]: c["soloSeconds"] for c in ep["musicCues"] if "soloAfterPart" in c}, 3.0
    sr0, v = wavfile.read(ep["audio"])
    v = v.astype(np.float64) / 32768
    v = resample_poly(v, SR // 300, sr0 // 300) if sr0 != SR else v
    segs, ne, acc = [], [], 0.0
    for i, e in enumerate(ends):
        a = 0 if i == 0 else ends[i - 1]
        segs.append(v[int(a * SR): int(e * SR)])
        acc += solo.get(i, 0)
        ne.append(round(e + acc, 3))
        if i in solo:
            segs.append(np.zeros(int(solo[i] * SR)))
    json.dump({"ends": ne, "parts": tm["parts"], "solo": {str(k): s for k, s in solo.items()}}, open(ep["timing"].replace(".json", ".mix.json"), "w", encoding="utf-8"), indent=1)
    S = lambda i: 0 if i == 0 else ne[i - 1]  # inicio de la parte i (timeline nuevo)
    E = lambda i: ne[i] - solo.get(i, 0)  # fin de la voz de la parte i (sin el solo)
    total = ne[-1] + TAIL
    voice = np.zeros(int(total * SR))
    vv = np.concatenate(segs)
    voice[: len(vv)] = vv[: len(voice)]
    mus = np.zeros(len(voice))
    report = []

    def lay(name, buf, a, g, fi=0.3, fo=0.3):
        n = min(len(buf), len(mus) - int(a * SR))
        buf = buf[:n].copy()
        buf[: int(fi * SR)] *= np.linspace(0, 1, int(fi * SR))
        if fo:
            buf[-int(fo * SR):] *= np.linspace(1, 0, int(fo * SR))
        mus[int(a * SR): int(a * SR) + n] += buf / (np.sqrt(np.mean(buf ** 2)) + 1e-12) * 10 ** (g / 20)
        report.append((name, a, a + n / SR))

    clip = wavfile.read("public/audio/em053-m10-musicbox.wav")[1].astype(np.float64) / 32768
    clip = filt(clip, "high", 250)
    myth = S(1) + 0.75  # corte seco en "myth"
    b1 = m1(myth + 0.1)
    b1[: int(2 * SR)] *= np.linspace(0.3, 1, int(2 * SR))  # entra bajo y sube 2 s
    lay("M1", b1, 0, 0, 0.05, 0.03)
    lay("bed", section("curious", S(6) - E(1) - 0.3), E(1) + 0.3, -4, 0.8, 0.6)
    lay("M1", m1b(S(13) - S(6) + 0.4, 112, ("piano", "flute", "strings")), S(6), -1, 0.4, 0.5)  # v2: textura distinta en cada frase
    lay("M2", m2(E(17) - S(15), solo[17]), S(15), 1, 0.6, 0.4)
    lay("M3", m3b(S(21) - S(18) + 0.3), S(18), -1, 0.3, 0.6)
    lay("M4", m4(S(24) - S(22)), S(22), 1, 0.3, 0.15)
    lay("M5", m5b(S(27) - S(24) + 0.3), S(24), 1, 0.05, 0.6)
    g6 = S(29)
    lay("M6b", m6(E(30) - g6, "b"), g6, -1, 0.5, 0.05)
    for v6, a6, d6 in (("a", E(30), 3.0), ("c", E(30) + 3.0, 3.0), ("b", E(30) + 6.0, S(33) - E(30) - 6.0 + 0.2)):
        lay("M6" + v6, m6(d6, v6), a6, 2, 0.02, 0.05 if v6 != "b" else 0.5)
    lay("M7", m7(S(37) - S(34) + 0.2), S(34), 3, 0.3, 0.2)
    lay("M8", m7(S(39) - S(37) + 0.3, 96, False), S(37), 0, 0.1, 0.6)
    lay("M9", m9b(S(45) - S(39) + 0.5), S(39), -2, 1.0, 1.0)
    l1 = int((ne[46] - S(46)) * SR)
    lay("M10", clip[int(1.5 * SR): int(1.5 * SR) + l1 + int(0.3 * SR)], S(46), -1, 0.6, 0.3)  # v2: M10 4 dB mas baja
    lay("M11", m11(3.2), S(47), 3, 0.02, 0.15)
    r0 = int(1.5 * SR) + l1 + int(0.3 * SR)
    lay("M10", clip[r0: r0 + int((S(51) - S(47) - 3.0) * SR)], S(47) + 3.0, -1, 0.8, 1.2)
    hm = S(52) + 0.52 * (E(52) - S(52))  # "Heavy metal made them bark more"
    lay("M12", m1b(hm - S(52), 100, ("harp",)), S(52), -2, 0.5, 0.15)
    lay("M12gtr", m12_sting(2.6), hm, 0, 0.01, 0.3)
    lay("M12", m1b(S(56) - hm - 2.4, 100, ("harp",)), hm + 2.4, -3, 0.6, 0.8)
    lay("M13", m13b(total - S(56)), S(56), -1, 0.8, 2.6)  # v4 (calidad 09/11): la musica se apaga en la cola, sin 2,75 s de silencio
    # curva de mezcla (igual que mix(): base -13 dB, -8 dB mientras habla, +4 dB en silencios) + solos a ~-2 dB de la voz
    act = np.abs(voice) > 0.01
    base = np.sqrt(np.mean(voice[act] ** 2)) * 10 ** (-13 / 20)
    env = smooth_env(voice, 40, 450)
    gdb = -8 * np.clip(env / 0.02, 0, 1)
    q, n6 = np.cumsum(np.r_[0, (np.abs(voice) < 0.004).astype(float)]), int(0.6 * SR)
    quiet = np.zeros(len(voice), bool)
    quiet[n6 // 2: n6 // 2 + len(q) - 1 - n6 + 1] = (q[n6:] - q[:-n6]) / n6 > 0.97
    gdb += 4 * quiet
    sol = np.zeros(len(voice))
    for p, s in solo.items():
        sol[int(E(p) * SR): int((E(p) + s) * SR)] = 7
    k = int(0.15 * SR)
    gdb += np.convolve(sol, np.ones(k) / k, "same")
    music = mus * base * 10 ** (gdb / 20)
    save(f"public/audio/music/{ep['id']}-music.wav", music)
    final = voice + music
    pk = np.abs(final).max()
    wavfile.write(f"public/audio/{ep['id']}-mix.wav", SR, (final / pk * 0.89 * 32767).astype(np.int16))
    db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    print("total", round(total, 2), "s; solos", solo, "; pico antes de limitar", round(float(20 * np.log10(pk)), 1), "dBFS")
    for name, a, b in report:
        s_ = slice(int(a * SR), int(b * SR))
        print(f"{name:7s} {a:6.1f}-{b:6.1f}s  voz {db(voice[s_]):6.1f}  musica {db(music[s_]):6.1f} dB")


def mix(epfile):
    ep = json.load(open(epfile, encoding="utf-8"))
    if ep["id"] == "EM-053":
        return mix053(ep)
    MAP ={"EM-022": MAP_EM022, "EM-004": MAP_EM004, "EM-025": MAP_EM025, "EM-029": MAP_EM029, "EM-026": MAP_EM026, "EM-023": MAP_EM023}.get(ep["id"]) or auto_map(ep)
    tm = json.load(open(ep["timing"], encoding="utf-8"))
    ends = tm["ends"]
    start = lambda i: 0 if i == 0 else ends[i - 1]
    sr0, v = wavfile.read(ep["audio"])
    v = v.astype(np.float64) / 32768
    v = resample_poly(v, 147, 80)
    total = ends[-1] + 1.2
    voice = np.zeros(int(total * SR))
    voice[: len(v)] = v[: len(voice)]
    mus = np.zeros(len(voice))
    gain = np.ones(len(voice))
    for k, (style, p0, g) in enumerate(MAP):
        a = start(p0)
        b = start(MAP[k + 1][1]) if k + 1 < len(MAP) else total
        if style == "tension" and ep["id"] != "EM-025":
            # corta en la parada visual (final de la frase 21, "the traffic on the road stopped") y deja silencio hasta que arranca la parte 24
            b = start(21) + 2.7
        if style == "burst":
            a = start(24)
        buf = tension(b - a) if style == "tension" else section(style, b - a + 0.3, lift=False)
        buf = buf[: int((b - a + (0.3 if style != "tension" else 0)) * SR)]
        fi = int(0.05 * SR) if style in ("burst", "curious") else int(0.5 * SR)
        fo = int(0.04 * SR) if style == "tension" else int(0.3 * SR)
        buf[:fi] *= np.linspace(0, 1, fi)
        buf[-fo:] *= np.linspace(1, 0, fo)
        i = int(a * SR)
        n = min(len(buf), len(mus) - i)
        sec_rms = np.sqrt(np.mean(buf ** 2) + 1e-12)
        mus[i:i + n] += buf[:n] / sec_rms * 10 ** ((g * float(os.environ.get("EM_GSCALE", 1)) + SECT_DB.get(p0, 0)) / 20)  # EM_GSCALE<1 reduce los escalones entre secciones
        if style == "burst":  # estallido: platillo y golpe
            put(mus, noise(1.4, "high", 3000, 3) * 3.0, a, 1.0)
            put(mus, kick(0.5) * 3.0, a, 1.0)
    # EM-025: fragmento real de La flauta magica (solo si existe public/audio/em025-flauta-magica.*, grabacion libre: ver docs/EM-025-MUSICA.md)
    clip = next(iter(__import__("glob").glob("public/audio/em025-flauta-magica.*")), None) if ep["id"] == "EM-025" else None
    if clip:
        import subprocess
        raw = subprocess.run([FFMPEG, "-v", "error", "-i", clip, "-t", "20", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
        op = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
        # Orden de Javier 30/10: 20 s de obertura y los 3 grupos de acordes (0.19 / 3.59 / 7.49 s
        # del clip) sobre "three solemn chords", "Three ladies" y "Three temples". El instante
        # ya no va fijo (era 321.0 s, del timing de la voz vieja): se ancla a la frase 102, que
        # es donde la voz dice "three solemn chords", con los 0.98 s de adelanto que el aprobo.
        t0 = start(ANCLA_025) - 0.98
        t1 = t0 + 20.0
        i0, i1 = int(t0 * SR), int(t1 * SR)
        op = op[: i1 - i0]
        env = smooth_env(op, 300, 600)  # pasajes suaves (cuerdas, -30 dB) subidos hasta 20 dB para que se oigan bajo la voz
        up = np.clip(10 ** ((-12 - 20 * np.log10(env + 1e-9)) / 20), 1, 10 ** (20 / 20))
        op = op * up
        fx = lambda sec, up: np.linspace(0, 1, int(sec * SR)) if up else np.linspace(1, 0, int(sec * SR))
        op[: int(0.02 * SR)] *= fx(0.02, True)  # rampa de entrada 0,02 s (v31; v32: 0,7 s)
        op[-int(1.5 * SR):] *= fx(1.5, False)  # salida 1,5 s (v31; v32: 2,0 s)
        g = np.ones(len(mus))
        g[i0 - SR: i0] = fx(1.0, False)  # el fondo se apaga 1 s antes del primer acorde
        g[i0: i1] = 0
        g[i1: i1 + SR] = fx(1.0, True)  # y vuelve en 1 s tras el fragmento
        mus *= g
        mus[i0:i0 + len(op)] += op / (np.sqrt(np.mean(op ** 2)) + 1e-9) * 10 ** (CLIP_DB / 20)
    if os.environ.get("EM_LP"):  # EM_LP=3500: paso-bajo de la musica (suaviza el tintineo de pluck/glock/hat); sin definir no cambia nada
        mus = filt(mus, "low", float(os.environ["EM_LP"]))
    # la musica de la parte 31+ se apaga al final
    tail = int(3.0 * SR)
    mus[-tail:] *= np.linspace(1, 0, tail) ** 1.5
    # curva: nivel base = voz activa -13 dB, ducking -8 dB mientras habla (musica medida ~20 dB bajo la voz; decision de Javier 31/10; antes -7 => ~14 dB), +4 dB en silencios >0.6 s
    act = np.abs(voice) > 0.01
    vrms = np.sqrt(np.mean(voice[act] ** 2))
    base = vrms * 10 ** (float(os.environ.get("EM_BASE_DB", -13)) / 20)  # EM_BASE_DB/EM_DUCK_DB/EM_QUIET_DB: opcionales por episodio (defecto -13/-8/+4 = comportamiento de EM-010/021/025); p.ej. -17/-4/0 reduce el bombeo en pausas / np.sqrt(np.mean(mus ** 2) + 1e-12)
    env = smooth_env(voice, 40, 450)
    speak = np.clip(env / 0.02, 0, 1)
    gdb = float(os.environ.get("EM_DUCK_DB", -8)) * speak
    q, n6 = np.cumsum(np.r_[0, (np.abs(voice) < 0.004).astype(float)]), int(0.6 * SR)
    quiet = np.zeros(len(voice), bool)
    quiet[n6 // 2: n6 // 2 + len(q) - 1 - n6 + 1] = (q[n6:] - q[:-n6]) / n6 > 0.97
    gdb += float(os.environ.get("EM_QUIET_DB", 4)) * quiet
    music = mus * base * 10 ** (gdb / 20)
    save(f"public/audio/music/{ep['id']}-music.wav", music)
    final = voice + music
    pk = np.abs(final).max()
    final = final / pk * 0.89
    wavfile.write(f"public/audio/{ep['id']}-mix.wav", SR, (final * 32767).astype(np.int16))
    # informe: nivel de voz vs musica por escena
    print("pico antes de limitar", round(float(20 * np.log10(pk)), 1), "dBFS")
    for k, (style, p0, g) in enumerate(MAP):
        a, b = start(p0), (start(MAP[k + 1][1]) if k + 1 < len(MAP) else total)
        s = slice(int(a * SR), int(b * SR))
        mv, mm = voice[s], music[s]
        db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
        print(f"{style:9s} {a:6.1f}-{b:6.1f}s  voz {db(mv):6.1f} dB  musica {db(mm):6.1f} dB  (voz-musica {db(mv)-db(mm):4.1f} dB)")
        w = SR // 20
        k = len(mv) // w
        V = np.sqrt((mv[: k * w].reshape(k, w) ** 2).mean(1))
        M = np.sqrt((mm[: k * w].reshape(k, w) ** 2).mean(1))
        sp = V > 0.02
        if sp.any():
            print(f"          mientras habla: voz-musica {20 * np.log10(np.sqrt((V[sp] ** 2).mean()) / (np.sqrt((M[sp] ** 2).mean()) + 1e-9)):4.1f} dB; en silencios: musica {20 * np.log10(np.sqrt((M[V < 0.004] ** 2).mean() + 1e-12) / np.sqrt((V[sp] ** 2).mean())):5.1f} dB re voz")


if __name__ == "__main__":
    {"sfx": sfx, "loops": loops}.get(sys.argv[1], lambda: mix(sys.argv[2]))()
