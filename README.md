# The Volume Preview

Desktop app for previewing content on the walls of The Volume, the CSUSB xREAL Lab immersive
performance space, before load-in. It is the room's 3D viewer with an **NDI** input: send it your
Resolume output (or any NDI stream) and see it through the six projectors, landing on the doors,
speakers and mirror as it will in the room. Mac, Windows and Linux.

By Martim S. Galvão, 2026.

## Download

Grab the latest build from [Releases](https://github.com/martimgalvao/the-volume-preview/releases/latest):

- Mac: `The Volume Preview-<version>-arm64.dmg` (Apple Silicon) or `The Volume Preview-<version>.dmg` (Intel)
- Windows x64: `The Volume Preview Setup <version>.exe`, or the portable `-win.zip`
- Linux x64: `.AppImage` (make it executable and run) or `.deb`

The builds are not notarized or Authenticode-signed yet:

- **Mac**: right-click the app, Open, Open again the first time. If macOS calls it damaged:
  `xattr -dr com.apple.quarantine "/Applications/The Volume Preview.app"`.
- **Windows**: SmartScreen says "Windows protected your PC"; More info, Run anyway.
- **Linux**: NDI discovery needs `avahi-daemon` running.

## Feeding it

The picture is one strip around the room, NE · SE · SW · NW, **12000 × 1144 px** (8 px per inch),
from the top of the baseboard to the underside of the grid. Any smaller frame with the same aspect
works too (6000 × 572 is a fine preview size). The whole NDI frame is treated as that strip.

- **Resolume Arena**: composition at the strip size, Output → NDI. The app lists it by name.
- **Syphon (Mac)**: republish with NDI Syphon (Vidvox, free).
- **Spout (Windows)**: NDI Tools includes Spout to NDI.
- Anything else: Screen share of the output window, a virtual camera, or a video or image file,
  all under *Tools → Content on the walls*.

NDI works over the network, so Resolume on the media server and the app on a laptop is fine.

In the app: *Tools → Content on the walls*, pick the source, **NDI**. Switch the work light off
under *Layers* for show contrast. *Show projector slices* tints the six slices to check the blends.

Strip definition and template: [the-volume site](https://martimgalvao.github.io/the-volume/).

## Building

```
npm run deps          # npm install --force: also fetches the NDI addons for the other platforms
npm start             # run from source
npm run dist          # Mac (arm64 + x64), Windows x64, Linux x64 into dist/
```

`viewer.html` is the room viewer built by the spec kit (`build_viewer.py --no-treatment`);
`npm run sync-viewer` copies a fresh build in from `$VOLUME_ROOT` (default `~/the-volume`).

- `main.js` opens the window and picks the viewer file (`resources/viewer.html` when packaged).
- `preload.js` gives the page `window.ndi` (`sources()`, `open(name, onFrame)`) backed by
  [grandi](https://github.com/tux-tn/grandi), bindings to the NDI 6 SDK. Frames arrive as tightly
  packed RGBA and go straight into the viewer's strip texture.
- `sign.js` ad-hoc signs the Mac app after packaging. To sign properly, set `CSC_LINK` /
  `CSC_KEY_PASSWORD` and remove `identity: null` from `package.json`.
- `build/icon.png` is the app icon; electron-builder derives the platform formats from it.

NDI® is a registered trademark of Vizrt NDI AB.
