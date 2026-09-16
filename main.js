// The Volume Preview: the built web viewer in a window, plus NDI input (see preload.js).
//   npm start                 opens viewer.html (the room as built, from the spec kit's builder)
//   npm start -- path.html    opens another build (e.g. the treated room)
// A packaged app carries the viewer as resources/viewer.html.
const { app, BrowserWindow } = require('electron');
const path = require('path');

function viewerPath() {
  const arg = process.argv.slice(app.isPackaged ? 1 : 2).find(a => a.endsWith('.html'));
  if (arg) return path.resolve(arg);
  if (app.isPackaged) return path.join(process.resourcesPath, 'viewer.html');
  return path.join(__dirname, 'viewer.html');
}

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1600, height: 1000, title: 'The Volume Preview', backgroundColor: '#0b0b0d',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false, contextIsolation: false, nodeIntegration: false,
      backgroundThrottling: false,
    },
  });
  win.loadFile(viewerPath());
});
app.on('window-all-closed', () => app.quit());
