// Gives the viewer page an NDI receiver as window.ndi. Frames stay in this process: the
// receiver hands the page a tightly packed RGBA buffer per frame and the page uploads it to
// the strip texture. No IPC, no copies beyond the repack when the NDI line stride has padding.
const grandi = require('grandi').default;

let finder = null;
async function sources() {
  if (!finder) finder = await grandi.find({ showLocalSources: true });
  await finder.wait(300);              // resolves early when the list changed, else after 300 ms
  return finder.sources();
}

function tight(f) {                   // RGBA rows without stride padding
  const row = f.xres * 4;
  if (f.lineStrideBytes === row) return { xres: f.xres, yres: f.yres, data: f.data };
  const out = Buffer.allocUnsafe(row * f.yres);
  for (let y = 0; y < f.yres; y++) f.data.copy(out, y * row, y * f.lineStrideBytes, y * f.lineStrideBytes + row);
  return { xres: f.xres, yres: f.yres, data: out };
}

async function open(name, onFrame) {
  const src = (await sources()).find(s => s.name === name);
  if (!src) throw new Error('NDI source not found: ' + name);
  const r = await grandi.receive({
    source: src, colorFormat: grandi.ColorFormat.RGBX_RGBA,
    bandwidth: grandi.Bandwidth.Highest, allowVideoFields: false, name: 'The Volume Preview',
  });
  let on = true;
  (async () => {
    while (on) {
      let f;
      try { f = await r.video(1000); } catch (e) { continue; }   // timeout: keep waiting
      if (on) onFrame(tight(f));
    }
    r.destroy();
  })();
  return () => { on = false; };
}

window.ndi = { sources, open };
