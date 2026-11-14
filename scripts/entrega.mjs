// Entrega lista desde la nube: master normalizado + copia ligera de movil + portada.
// Uso: node scripts/entrega.mjs <COMP> <entrada.mp4>
// Salidas (en el directorio actual): <COMP>.mp4 (master -16 LUFS, pico -2 dBTP, video sin recodificar),
//   <COMP>-movil.mp4 (<=MB MB, lado largo 1280, 24 fps, pico <= -2,5 dBTP tras AAC) y <COMP>-portada.png (fotograma 0).
// Mismos criterios que scripts/normalize.mjs y scripts/movil.mjs del estudio, pero con ffmpeg de Linux.
import { spawnSync } from "node:child_process";
import { renameSync } from "node:fs";

const [comp, src] = process.argv.slice(2);
const MB = +(process.env.MB ?? 20); // tope de envio por el chat: 25 MB
const run = (exe, args) => spawnSync(exe, ["-hide_banner", ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
const note = (s) => console.log(`::notice::${s}`);

// 1) Master: loudnorm de dos pasadas a -16 LUFS con pico -2 dBTP (deja margen al AAC).
const T = "I=-16:TP=-2:LRA=7";
const p1 = run("ffmpeg", ["-i", src, "-vn", "-af", `loudnorm=${T}:print_format=json`, "-f", "null", "-"]);
const m = JSON.parse(p1.stderr.slice(p1.stderr.lastIndexOf("{"), p1.stderr.lastIndexOf("}") + 1));
const af = `loudnorm=${T}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
const master = `${comp}-master.mp4`;
const p2 = run("ffmpeg", ["-y", "-i", src, "-c:v", "copy", "-af", af, "-c:a", "aac", "-ar", "48000", "-b:a", "192k", "-shortest", master]);
if (p2.status !== 0) {
  console.log(`::error::entrega: loudnorm fallo :: ${p2.stderr.slice(-700).replace(/\n/g, " ")}`);
  process.exit(1);
}
note(`master ok: antes ${m.input_i} LUFS pico ${m.input_tp} dBTP -> -16 LUFS / -2 dBTP`);
renameSync(master, `${comp}.mp4`); // el master normalizado sustituye al bruto

// 2) Copia ligera de movil: lado largo 1280 (vale para vertical y horizontal), 24 fps, dos pasadas al tamano objetivo.
const dur = parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `${comp}.mp4`]).stdout);
const abr = 96;
const vkbps = Math.max(200, Math.floor((MB * 1e6 * 8) / dur / 1000 - abr - 4));
const vf = "scale=w=1280:h=1280:force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos,fps=24,format=yuv420p";
const v = ["-vf", vf, "-c:v", "libx264", "-preset", "slow", "-b:v", `${vkbps}k`, "-maxrate", `${Math.round(vkbps * 1.5)}k`, "-bufsize", `${vkbps * 2}k`, "-pix_fmt", "yuv420p", "-passlogfile", "movil2p"];
const nulo = process.platform === "win32" ? "NUL" : "/dev/null"; // la nube es Linux; en Windows se puede probar igual
run("ffmpeg", ["-y", "-i", `${comp}.mp4`, ...v, "-pass", "1", "-an", "-f", "mp4", nulo]);
const mv = run("ffmpeg", ["-y", "-i", `${comp}.mp4`, ...v, "-pass", "2", "-af", `alimiter=limit=${process.env.LIM ?? "0.63"}:attack=5:release=60:level=disabled`, "-c:a", "aac", "-b:a", `${abr}k`, "-ar", "48000", "-ac", "2", "-movflags", "+faststart", `${comp}-movil.mp4`]);
if (mv.status !== 0) console.log(`::notice::entrega: sin copia de movil :: ${mv.stderr.slice(-400).replace(/\n/g, " ")}`);

// 3) Portada: fotograma 0 del master.
run("ffmpeg", ["-y", "-i", `${comp}.mp4`, "-frames:v", "1", `${comp}-portada.png`]);

const medida = run("ffprobe", ["-v", "error", "-show_entries", "format=duration,size:stream=width,height", "-of", "default=nw=1", `${comp}-movil.mp4`]).stdout.replace(/\n/g, " ");
note(`entrega: movil a ${vkbps}k :: ${medida}`);
