// electron-builder afterPack hook: ad-hoc sign the Mac app so Gatekeeper accepts it as intact.
// No Developer ID here; users still right-click → Open the first time (not notarized).
const { execFileSync } = require('child_process');
const path = require('path');
exports.default = async ctx => {
  if (ctx.electronPlatformName !== 'darwin') return;
  const app = path.join(ctx.appOutDir, `${ctx.packager.appInfo.productFilename}.app`);
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' });
};
