"""Narra un episodio con Kokoro (ejecutar con el python de kokoro_env).
Uso: <kokoro_env>\\Scripts\\python.exe scripts\\kokoro_synth.py src\\episodes\\EM-001.json
Cada "part" se narra por separado. Escribe el WAV (episode["audio"]) y el timing (episode["timing"])
= {"ends": [...], "parts": [...]}: ends[i] = instante en que empieza el trozo i+1 (incluye el hueco).
Voz por KOKORO_VOICE o episode["voice"]; velocidad por KOKORO_SPEED o episode["speed"].
Opcional "gap" (s entre trozos, defecto 0.15) y "squeeze": true (recorta silencios: los del interior a <=0.1 s, los de los extremos a 0; los tiempos por palabra se ajustan; el timing lleva "gap").
KOKORO_ONLY="5,22,29": solo re-narra esas partes y reutiliza el resto del WAV/timing existente (el texto de las demas no debe haber cambiado).
"""
import json, os, re, sys
os.environ.setdefault("HF_HOME", r"C:\Proyectos\YOUTUBE_RADAR\kokoro_env\hf_cache")
os.environ.setdefault("HF_HUB_OFFLINE", "1")
import numpy as np, soundfile as sf
from kokoro import KPipeline

SR, GAP = 24000, 0.15   # silencio entre trozos (s); debe coincidir con GAP de src/utils/timing.ts (o con timing["gap"])
def squeeze(a, maxs=0.1, thr=0.004):
    """Silencios (RMS de 10 ms < thr) mas largos que maxs se acortan a maxs; los de los extremos se quitan. Devuelve (audio, mapa t_viejo->t_nuevo)."""
    w = SR // 100
    quiet = np.array([np.sqrt(np.mean(a[i:i + w] ** 2)) < thr for i in range(0, len(a) - w + 1, w)])
    segs, i = [], 0   # (inicio_viejo, fin_viejo, largo_nuevo) en muestras
    while i < len(quiet):
        j = i
        while j < len(quiet) and quiet[j] == quiet[i]: j += 1
        n = (j - i) * w
        if quiet[i]: n = 0 if i == 0 or j == len(quiet) else min(n, int(maxs * SR))
        segs.append((i * w, j * w, n, quiet[i])); i = j
    segs[-1] = (segs[-1][0], len(a), segs[-1][2], segs[-1][3])
    out, new_at = [], []
    pos = 0
    for s0, s1, n, q in segs:
        out.append(a[s0:s0 + n] if q else a[s0:s1]); new_at.append((s0, s1, pos, len(out[-1]))); pos += len(out[-1])
    def mp(t):
        x = t * SR
        for s0, s1, p0, n in new_at:
            if x < s1: return (p0 + min(max(x - s0, 0), n)) / SR
        return pos / SR
    return np.concatenate(out), mp
def respell(text, pron):
    """{"palabra": "fonemas"}: solo para la voz, el texto en pantalla no cambia. Palabra entera (no 'sou' dentro de 'soup'), la mas larga primero, una sola pasada; una clave en minuscula vale tambien con mayuscula inicial ('ergot' -> 'Ergot')."""
    keys = dict(pron)
    for w, ph in pron.items():
        if w[:1].islower():
            keys.setdefault(w[0].upper() + w[1:], ph)
    if not keys:
        return text
    rx = re.compile(r"(?<!\w)(" + "|".join(re.escape(k) for k in sorted(keys, key=len, reverse=True)) + r")(?!\w)")
    return rx.sub(lambda m: f"[{m.group(1)}](/{keys[m.group(1)]}/)", text)

ep = json.load(open(sys.argv[1], encoding="utf-8"))
voice = os.environ.get("KOKORO_VOICE", ep.get("voice", "am_liam"))
speed = float(os.environ.get("KOKORO_SPEED", ep.get("speed", 1.0)))
pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
gap = np.zeros(int(GAP * SR), dtype=np.float32)
chunks, ends, total, words = [], [], 0, []
only = {int(x) for x in os.environ.get("KOKORO_ONLY", "").split(",") if x}
if only:
    old_a, old_t = sf.read(ep["audio"], dtype="float32")[0], json.load(open(ep["timing"], encoding="utf-8"))
    assert all(old_t["parts"][n] == ep["parts"][n] for n in range(len(ep["parts"])) if n not in only), "cambio texto fuera de KOKORO_ONLY"
GAP = ep.get("gap", GAP)
gap = np.zeros(int(GAP * SR), dtype=np.float32)
pads = ep.get("pads", {})   # {"indice": segundos}: pausa extra tras ese trozo (no afecta a episodios sin "pads")
for n, part in enumerate(ep["parts"]):
    g = np.concatenate([gap, np.zeros(int(pads[str(n)] * SR), dtype=np.float32)]) if str(n) in pads else gap
    if only and n not in only:
        a = old_a[round(old_t["ends"][n - 1] * SR) if n else 0: round(old_t["ends"][n] * SR) - len(g)]
    else:
        say = respell(part, ep.get("pronounce", {}))
        res = list(pipe(say, voice=voice, speed=speed))
        a = np.concatenate([r.audio.numpy() for r in res])
        mp = None
        if ep.get("squeeze"): a, mp = squeeze(a)
        if ep.get("words"):   # "words": true -> tiempos por palabra (s desde el inicio del trozo) en timing["words"]; solo con pasada completa
            wt, off = [], 0.0
            for r in res:
                cur = None
                for t in r.tokens:
                    if t.start_ts is not None and cur is not None and cur[1] is None: cur[1] = off + t.start_ts
                    if cur is None: cur = [t.text, off + (t.start_ts or 0), None]
                    else: cur[0] += t.text
                    if t.end_ts is not None: cur[2] = off + t.end_ts
                    if t.whitespace: wt.append(cur); cur = None
                if cur: wt.append(cur)
                off += len(r.audio) / SR
            f = mp or (lambda t: t)
            words.append([[w, round(f(s), 3), round(f(e if e is not None else s), 3)] for w, s, e in wt])
    chunks += [a, g]
    total += len(a) + len(g)
    ends.append(round(total / SR, 3))
audio = np.concatenate(chunks[:-1])   # sin silencio final
os.makedirs(os.path.dirname(os.path.abspath(ep["audio"])), exist_ok=True)
sf.write(ep["audio"], audio, SR, subtype="PCM_16")
json.dump({"ends": ends, "parts": ep["parts"], **({"gap": GAP} if GAP != 0.15 else {}), **({"words": words} if words else {})}, open(ep["timing"], "w", encoding="utf-8"), indent=1)
print(ep["id"], voice, speed, f"{len(audio)/SR:.1f}s", flush=True)
