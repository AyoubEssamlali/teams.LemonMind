const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

async function traceLogo() {
  const logoPath = path.join(__dirname, 'assets', 'logo.png');
  const { data, info } = await sharp(logoPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Create two bitmap buffers: one for yellow, one for dark (M, D, and text)
  const yellowBuf = Buffer.alloc(w * h);
  const darkBuf = Buffer.alloc(w * h);

  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (a > 30) {
      // Check if yellow: high red & green, low blue
      if (r > 160 && g > 130 && b < 120) {
        yellowBuf[i] = 0; // 0 = black pixel for potrace
      } else {
        yellowBuf[i] = 255;
      }

      // Check if dark (M, D, text):
      if (r < 120 && g < 120 && b < 120) {
        darkBuf[i] = 0;
      } else {
        darkBuf[i] = 255;
      }
    } else {
      yellowBuf[i] = 255;
      darkBuf[i] = 255;
    }
  }

  const tempYellow = path.join(__dirname, 'assets', 'temp-yellow.png');
  const tempDark = path.join(__dirname, 'assets', 'temp-dark.png');

  await sharp(yellowBuf, { raw: { width: w, height: h, channels: 1 } }).png().toFile(tempYellow);
  await sharp(darkBuf, { raw: { width: w, height: h, channels: 1 } }).png().toFile(tempDark);

  const tracePromise = (file, opt = {}) => new Promise((resolve, reject) => {
    potrace.trace(file, { optCurve: true, threshold: 128, ...opt }, (err, svg) => {
      if (err) reject(err);
      else resolve(svg);
    });
  });

  const [yellowSvg, darkSvg] = await Promise.all([
    tracePromise(tempYellow, { turnpolicy: potrace.Potrace.TURNPOLICY_MINORITY }),
    tracePromise(tempDark, { turnpolicy: potrace.Potrace.TURNPOLICY_MINORITY })
  ]);

  const extractPath = (svg) => {
    const match = svg.match(/<path\s+d="([^"]+)"/);
    return match ? match[1] : '';
  };

  const yellowPath = extractPath(yellowSvg);
  const darkPath = extractPath(darkSvg);

  // viewBox 0 0 w h
  const logoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <path d="${yellowPath}" fill="#FFD400"/>
  <path d="${darkPath}" fill="#FFFFFF"/>
</svg>
`;

  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <path d="${yellowPath}" fill="#FFD400"/>
  <path d="${darkPath}" fill="#191919"/>
</svg>
`;

  fs.writeFileSync(path.join(__dirname, 'assets', 'logo-white.svg'), logoWhiteSvg);
  fs.writeFileSync(path.join(__dirname, 'assets', 'logo.svg'), logoSvg);
  fs.writeFileSync(path.join(__dirname, 'public', 'logo-white.svg'), logoWhiteSvg);
  fs.writeFileSync(path.join(__dirname, 'public', 'logo.svg'), logoSvg);

  if (fs.existsSync(tempYellow)) fs.unlinkSync(tempYellow);
  if (fs.existsSync(tempDark)) fs.unlinkSync(tempDark);

  console.log('✅ Generated assets/logo-white.svg, assets/logo.svg, public/logo-white.svg, public/logo.svg');
}

traceLogo().catch(console.error);
