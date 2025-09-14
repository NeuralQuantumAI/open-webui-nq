// Node.js script to create PWA icons
const fs = require('fs');
const path = require('path');

// SVG template for the icon
const createSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#007AFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#AF52DE;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#gradient)"/>
  <text x="50%" y="50%" font-family="-apple-system, BlinkMacSystemFont, sans-serif" 
        font-size="${size * 0.5}" font-weight="bold" fill="white" 
        text-anchor="middle" dominant-baseline="middle">V</text>
</svg>`;

// Icon sizes
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// Generate SVG icons
sizes.forEach(size => {
    const svg = createSVG(size);
    const filename = path.join(iconsDir, `icon-${size}.svg`);
    fs.writeFileSync(filename, svg);
    console.log(`Created ${filename}`);
});

// Create a simple HTML fallback for PNG generation
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>VibeCaaS Icons</title>
    <style>
        body { 
            font-family: -apple-system, sans-serif; 
            padding: 20px;
            background: #f0f0f0;
        }
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 20px;
        }
        .icon-item {
            background: white;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <h1>VibeCaaS PWA Icons</h1>
    <p>These are SVG icons that will be used for the PWA. Modern browsers support SVG icons in manifests.</p>
    <div class="icon-grid">
        ${sizes.map(size => `
        <div class="icon-item">
            <img src="icons/icon-${size}.svg" alt="${size}x${size}">
            <p>${size}x${size}</p>
        </div>
        `).join('')}
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'icons-preview.html'), htmlContent);
console.log('Created icons-preview.html');

console.log('\nAll icons created successfully!');
console.log('Note: These are SVG icons which are supported by modern browsers.');
console.log('For older browser support, you may need to convert them to PNG.');