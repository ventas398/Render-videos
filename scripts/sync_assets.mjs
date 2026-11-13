// Copia al repo de la nube SOLO los assets que usa un episodio, no el public entero (3,2 GB).
// Uso:  node scripts/sync_assets.mjs EM-035            (lista lo que falta)
//       node scripts/sync_assets.mjs EM-035 --copy     (lo copia y prepara el audio)
//
// Como encuentra las imagenes: las escenas piden los ficheros con plantillas
// (staticFile(`illustrations/${k}.png`)), asi que buscar rutas en el codigo no vale.
// Se hace al reves: para cada fichero del public del proyecto se mira si su nombre
// (o su nombre sin el prefijo del episodio) aparece escrito en las escenas de ESE episodio.
// Colarse de mas solo cuesta unos MB; colarse de menos rompe el render, asi que el sesgo
// es deliberado hacia copiar alguno de sobra.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const COMP = process.argv[2];
const DO = process.argv.includes("--copy");
const STUDIO = process.env.EM_STUDIO || "C:/Proyectos/EVERYDAY_MYSTERY/everyday-mystery-studio";
const FFMPEG = process.env.EM_FFMPEG || "C:/Tools/ffmpeg/ffmpeg.exe";
const REPO = path.resolve(import.meta.dirname, "..");
if (!COMP) throw new Error("falta el id: node scripts/sync_assets.mjs EM-035");

const num = (COMP.match(/(\d{2,3})/) || [])[1] || "";
const read = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];

// 1. El texto donde se buscan los nombres: las escenas de este episodio y su JSON.
const own = walk(path.join(REPO, "src/compositions"))
  .filter((f) => /\.tsx?$/.test(f) && f.includes(num))
  .concat([path.join(REPO, `src/episodes/${COMP}.json`)]);
// 2. Lo compartido (marca, componentes): ahi solo vale el nombre exacto del fichero.
const shared = [...walk(path.join(REPO, "src/components")), ...walk(path.join(REPO, "src/themes")),
  ...walk(path.join(REPO, "src/covers-fx"))].filter((f) => /\.tsx?$/.test(f));
const textOwn = own.map(read).join("\n");
const textShared = shared.map(read).join("\n");
if (!textOwn.trim()) throw new Error(`no encuentro escenas de ${COMP} en src/compositions`);

// 3. Candidatos: todo lo que puede pedir una escena.
const dirs = ["illustrations", "images", "photos", "brandboard", "channelprop", "audio/sfx"];
const picked = [];
for (const d of dirs) {
  for (const f of walk(path.join(STUDIO, "public", d))) {
    const rel = path.relative(path.join(STUDIO, "public"), f).replaceAll("\\", "/");
    const key = path.basename(f).replace(/\.[^.]+$/, "");
    const bare = key.replace(/^em\d+[a-z]*\d*-/i, "");
    const hit = textOwn.includes(key) || textShared.includes(key) || textOwn.includes(rel) || textShared.includes(rel)
      || (bare !== key && bare.length >= 4 && textOwn.includes(bare));
    if (hit) picked.push({ rel, src: f, size: fs.statSync(f).size });
  }
}

// 4. El audio va por dos caminos:
//    - las maquinas que renderizan video piden el wav que nombra la escena, pero
//      rendering con --muted no usa el sonido: se les manda un wav MUDO de la misma
//      duracion (unos 5 MB en vez de 48) solo para que el fichero exista.
//    - el 'join' pega la pista buena al final, y se manda ya en aac (unos 12 MB).
// Los nombres literales que aparezcan, mas los dos que arma la plantilla de v2.tsx
// (`audio/${ep.id}-mix.wav`), que no se pueden encontrar leyendo el codigo.
const refs = [...new Set([...[...textOwn.matchAll(/audio\/([\w.-]+\.wav)/g)].map((m) => m[1]),
  `${COMP}.wav`, `${COMP}-mix.wav`])];
const wav = ["-mix.wav", ".wav"].map((s) => path.join(STUDIO, "public/audio", COMP + s)).find(fs.existsSync);
const m4a = path.join(REPO, "public/audio", `${COMP}.m4a`);
const mudos = refs.map((n) => ({ n, src: path.join(STUDIO, "public/audio", n) })).filter((x) => fs.existsSync(x.src));
let audioNote = wav ? `${path.basename(wav)} -> ${COMP}.m4a; mudos: ${mudos.map((x) => x.n).join(" ") || "ninguno"}`
  : "SIN AUDIO en el proyecto";

const falta = picked.filter((p) => !fs.existsSync(path.join(REPO, "public", p.rel)));
const mb = (n) => (n / 1048576).toFixed(1) + " MB";
console.log(`${COMP}: ${picked.length} assets usados, ${falta.length} no estan en el repo (${mb(falta.reduce((a, b) => a + b.size, 0))})`);
console.log(`audio: ${audioNote}`);
for (const p of falta.slice(0, 12)) console.log(`  ${p.rel} ${mb(p.size)}`);
if (falta.length > 12) console.log(`  ... y ${falta.length - 12} mas`);

if (!DO) { console.log("\n(solo lista; con --copy se copia)"); process.exit(0); }
for (const p of falta) {
  const dest = path.join(REPO, "public", p.rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(p.src, dest);
}
if (wav && !fs.existsSync(m4a)) {
  fs.mkdirSync(path.dirname(m4a), { recursive: true });
  execFileSync(FFMPEG, ["-y", "-v", "error", "-i", wav, "-c:a", "aac", "-b:a", "192k", m4a]);
}
for (const x of mudos) {
  const dest = path.join(REPO, "public/audio", x.n);
  if (fs.existsSync(dest)) continue;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  // volume=0 conserva la duracion exacta; 8 kHz mono de 8 bits pesa 10 veces menos.
  execFileSync(FFMPEG, ["-y", "-v", "error", "-i", x.src, "-af", "volume=0",
    "-c:a", "pcm_u8", "-ar", "8000", "-ac", "1", dest]);
  console.log(`  mudo ${x.n} ${mb(fs.statSync(dest).size)}`);
}
console.log(`copiados ${falta.length} ficheros${wav ? ` + audio (${mb(fs.statSync(m4a).size)})` : ""}`);
