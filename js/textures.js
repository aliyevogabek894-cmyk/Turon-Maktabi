import * as THREE from 'three';

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

function asTex(canvas, rx = 1, ry = 1, srgb = true) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function loadImgTex(url, fallbackTex) {
  const loader = new THREE.TextureLoader();
  const tex = loader.load(
    url,
    (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = 8;
      loaded.needsUpdate = true;
    },
    undefined,
    () => {
      if (fallbackTex && fallbackTex.image) {
        tex.image = fallbackTex.image;
        tex.needsUpdate = true;
      }
    }
  );
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createTextures() {
  const tex = {};

  // 1. Octagonal & diamond courtyard pavers (Photo 1 & 5)
  {
    const [c, g] = makeCanvas(512, 512);
    g.fillStyle = '#aeb3b8';
    g.fillRect(0, 0, 512, 512);
    const step = 128;
    for (let y = 0; y < 512; y += step) {
      for (let x = 0; x < 512; x += step) {
        const cx = x + step / 2, cy = y + step / 2, r = 56;
        g.fillStyle = '#c5c9cd';
        g.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4 + Math.PI / 8;
          const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
          i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
        }
        g.closePath();
        g.fill();
        g.strokeStyle = '#686e75';
        g.lineWidth = 3;
        g.stroke();

        g.strokeStyle = '#9aa0a6';
        g.lineWidth = 2;
        g.beginPath();
        g.arc(cx, cy, 34, 0, Math.PI * 2);
        g.stroke();
      }
    }
    g.fillStyle = '#333840';
    for (let y = 0; y <= 512; y += step) {
      for (let x = 0; x <= 512; x += step) {
        g.beginPath();
        g.moveTo(x, y - 22); g.lineTo(x + 22, y); g.lineTo(x, y + 22); g.lineTo(x - 22, y);
        g.closePath();
        g.fill();
      }
    }
    tex.bruschatka = asTex(c, 26, 18);
  }

  // 2. Black speckled polished granite (Tsokol & stairs)
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#1b1f25';
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1600; i++) {
      const v = 35 + Math.floor(Math.random() * 55);
      g.fillStyle = `rgb(${v},${v + 3},${v + 8})`;
      g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    g.strokeStyle = '#0f1216';
    g.lineWidth = 2;
    for (let x = 0; x < 256; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
    for (let y = 0; y < 256; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
    tex.granite = asTex(c, 10, 2);
  }

  // 3. Cream travertine / stucco facade
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#eeebe2';
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2000; i++) {
      const d = Math.random() > 0.5 ? 245 : 225;
      g.fillStyle = `rgba(${d},${d - 3},${d - 10},0.25)`;
      g.fillRect(Math.random() * 256, Math.random() * 256, 3, 2);
    }
    tex.stucco = asTex(c, 4, 4);
  }

  // 4. Dark charcoal metal cassette parapet (Photo 1 & 5)
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#31373e';
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = '#1d2228';
    g.lineWidth = 3;
    for (let x = 0; x < 256; x += 64) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke();
    }
    tex.parapet = asTex(c, 10, 1);
  }

  // 5. Corrugated dark charcoal spandrel for Innovation Hub (Photo 6)
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#2a2f35';
    g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 16) {
      g.fillStyle = '#1d2126';
      g.fillRect(x, 0, 6, 256);
    }
    tex.hubCorrugated = asTex(c, 2, 1);
  }

  // 6. Lobby & corridor white-black marble floor (0.60x0.60m tiles)
  {
    const [c, g] = makeCanvas(512, 512);
    g.fillStyle = '#f2f2ef';
    g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(170,175,180,0.35)';
    g.lineWidth = 2;
    for (let i = 0; i < 24; i++) {
      g.beginPath();
      const x = Math.random() * 512, y = Math.random() * 512;
      g.moveTo(x, y);
      g.bezierCurveTo(x + 40, y - 30, x + 80, y + 40, x + 130, y + 10);
      g.stroke();
    }
    g.strokeStyle = '#cfd4da';
    g.lineWidth = 2;
    for (let i = 0; i <= 512; i += 128) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke();
    }
    tex.whiteMarble = asTex(c, 12, 12);
  }

  // 7. Black marble border strip
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#202328';
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(220,210,190,0.28)';
    g.lineWidth = 1.5;
    for (let i = 0; i < 16; i++) {
      g.beginPath();
      const x = Math.random() * 256, y = Math.random() * 256;
      g.moveTo(x, y); g.lineTo(x + 60, y + 35); g.stroke();
    }
    tex.blackMarble = asTex(c, 4, 1);
  }

  // 8. Terracotta brick-tile klumba / Innovation Hub plinth
  {
    const [c, g] = makeCanvas(256, 128);
    const cols = ['#8c4f3b', '#b56e52', '#c8a98a', '#6e4537', '#a65d43'];
    const bw = 64, bh = 32;
    for (let r = 0; r < 4; r++) {
      const off = (r % 2) * 32;
      for (let k = -1; k < 5; k++) {
        g.fillStyle = cols[(r * 3 + k + 5) % cols.length];
        g.fillRect(k * bw + off + 2, r * bh + 2, bw - 4, bh - 4);
      }
    }
    tex.stoneBrick = asTex(c, 12, 1);
  }

  // 9. A-376 Asphalt road
  {
    const [c, g] = makeCanvas(512, 256);
    g.fillStyle = '#262a2f';
    g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 2000; i++) {
      const v = 30 + Math.floor(Math.random() * 25);
      g.fillStyle = `rgb(${v},${v + 1},${v + 3})`;
      g.fillRect(Math.random() * 512, Math.random() * 256, 2, 2);
    }
    g.fillStyle = '#e5e7eb';
    g.fillRect(0, 12, 512, 6);
    g.fillRect(0, 238, 512, 6);
    g.fillStyle = '#facc15';
    for (let x = 20; x < 512; x += 80) g.fillRect(x, 124, 44, 6);
    tex.road = asTex(c, 10, 1);
  }

  // 10. Uzbek Atlas / Adras valances (Photo 10)
  {
    const [c, g] = makeCanvas(256, 128);
    g.fillStyle = '#b91c1c';
    g.fillRect(0, 0, 256, 128);
    for (let x = 0; x < 256; x += 32) {
      g.fillStyle = '#f8fafc';
      g.beginPath(); g.ellipse(x + 16, 40, 10, 28, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#1e293b';
      g.beginPath(); g.ellipse(x + 16, 40, 4, 16, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#f8fafc';
      g.beginPath(); g.ellipse(x, 96, 8, 24, 0, 0, Math.PI * 2); g.fill();
    }
    tex.atlas = asTex(c, 8, 1);
  }

  // 11. Signage & Branding Textures
  function signTex(w, h, bg, fg, text, sub = '', border = null) {
    const [c, g] = makeCanvas(w, h);
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    if (border) {
      g.strokeStyle = border; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
    }
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    if (sub) {
      g.font = `900 ${Math.floor(h * 0.42)}px Arial, sans-serif`;
      g.fillText(text, w / 2, h * 0.36);
      g.font = `700 ${Math.floor(h * 0.22)}px Arial, sans-serif`;
      g.fillText(sub, w / 2, h * 0.72);
    } else {
      g.font = `900 ${Math.floor(h * 0.56)}px Arial, sans-serif`;
      g.fillText(text, w / 2, h / 2);
    }
    return asTex(c, 1, 1);
  }

  tex.signMain = signTex(1024, 160, '#2c3137', '#d9262e', 'TURON ODOB-ILM');
  tex.signSub = signTex(1024, 160, '#f3f4f6', '#d9262e', 'XUSUSIY MAKTABI');
  tex.signHub = signTex(1024, 160, '#282c32', '#f8fafc', 'INNOVATION HUB');
  tex.glassStripe = signTex(1024, 128, '#14171a', '#facc15', 'TURON ODOB-ILM', 'XUSUSIY MAKTABI', '#facc15');
  tex.doorB = signTex(256, 256, '#1c242b', '#e2e8f0', 'B', 'blok');

  // Oval winged emblem (Photo 1)
  {
    const [c, g] = makeCanvas(512, 280);
    g.fillStyle = '#181b20';
    g.beginPath(); g.ellipse(256, 140, 246, 130, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#e5e7eb'; g.lineWidth = 10; g.stroke();
    g.fillStyle = '#facc15';
    g.beginPath(); g.moveTo(256, 145); g.lineTo(195, 100); g.lineTo(256, 115); g.lineTo(317, 100); g.closePath(); g.fill();
    g.strokeStyle = '#facc15'; g.lineWidth = 6;
    for (let i = 0; i < 4; i++) {
      g.beginPath(); g.moveTo(185, 135 - i * 14); g.quadraticCurveTo(130, 120 - i * 16, 105, 85 - i * 10); g.stroke();
      g.beginPath(); g.moveTo(327, 135 - i * 14); g.quadraticCurveTo(382, 120 - i * 16, 407, 85 - i * 10); g.stroke();
    }
    g.fillStyle = '#ffffff';
    g.font = 'bold 28px Arial'; g.textAlign = 'center';
    g.fillText('TURON', 256, 60);
    g.font = 'bold 20px Arial';
    g.fillText('ODOB-ILM', 256, 212);
    tex.emblem = asTex(c, 1, 1);
  }

  // Real Cropped Photo Banners (with procedural fallback)
  const fallbackHubBanner = signTex(512, 640, '#161b22', '#38bdf8', 'IT SOHASI', 'SMM · DASTURLASH · 3D');
  const fallbackFence = signTex(512, 256, '#141923', '#f8fafc', 'TURON ODOB-ILM', 'ENDI XALQARO MAKTAB · 78 113 61 08', '#f59e0b');
  tex.hubBanner = loadImgTex('./assets/hub_banner.jpg', fallbackHubBanner);
  tex.fenceBanner1 = loadImgTex('./assets/fence_banner1.jpg', fallbackFence);
  tex.fenceBanner2 = loadImgTex('./assets/fence_banner2.jpg', fallbackFence);

  // Children's window decals (Photo 1 & 5 right/West wing lower panes)
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#3b2e27';
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(70, 170, 24, 0, Math.PI * 2); g.arc(95, 165, 28, 0, Math.PI * 2); g.arc(120, 172, 22, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#38bdf8';
    g.beginPath(); g.arc(190, 145, 28, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#facc15';
    g.beginPath(); g.arc(190, 145, 12, 0, Math.PI * 2); g.fill();
    tex.kidsDecal = asTex(c, 1, 1);
  }

  // Taekwondo 1x1m red-blue tatami checkerboard
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#2563eb'; g.fillRect(0, 0, 128, 128); g.fillRect(128, 128, 128, 128);
    g.fillStyle = '#dc2626'; g.fillRect(128, 0, 128, 128); g.fillRect(0, 128, 128, 128);
    tex.tatami = asTex(c, 11, 5);
  }

  // Oshxona pink-mint-white checkerboard wall
  {
    const [c, g] = makeCanvas(256, 256);
    const sq = ['#86efac', '#f8fafc', '#ec4899', '#86efac'];
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      g.fillStyle = sq[(y * 2 + x) % 4];
      g.fillRect(x * 128, y * 128, 128, 128);
    }
    tex.oshxonaWall = asTex(c, 4, 2);
  }

  // Dormitory Uzbek Carpet texture (tg_7058_5.jpg)
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#6b1d24';
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = '#e6c280';
    g.lineWidth = 8;
    g.strokeRect(14, 14, 228, 228);
    g.fillStyle = '#d4af6a';
    g.beginPath(); g.arc(128, 128, 48, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#6b1d24';
    g.beginPath(); g.arc(128, 128, 26, 0, Math.PI * 2); g.fill();
    tex.carpet = asTex(c, 1, 1);
  }

  // Flags: UZ, UK, RU
  function mkFlag(drawFn) {
    const [c, g] = makeCanvas(256, 140);
    drawFn(g);
    return asTex(c, 1, 1);
  }
  tex.flagUZ = mkFlag((g) => {
    g.fillStyle = '#0ea5e9'; g.fillRect(0, 0, 256, 44);
    g.fillStyle = '#dc2626'; g.fillRect(0, 44, 256, 4);
    g.fillStyle = '#ffffff'; g.fillRect(0, 48, 256, 44);
    g.fillStyle = '#dc2626'; g.fillRect(0, 92, 256, 4);
    g.fillStyle = '#16a34a'; g.fillRect(0, 96, 256, 44);
    g.fillStyle = '#ffffff'; g.beginPath(); g.arc(34, 22, 11, 0, Math.PI * 2); g.fill();
  });
  tex.flagUK = mkFlag((g) => {
    g.fillStyle = '#1e3a8a'; g.fillRect(0, 0, 256, 140);
    g.strokeStyle = '#ffffff'; g.lineWidth = 22;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(256, 140); g.moveTo(256, 0); g.lineTo(0, 140); g.stroke();
    g.strokeStyle = '#dc2626'; g.lineWidth = 10;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(256, 140); g.moveTo(256, 0); g.lineTo(0, 140); g.stroke();
    g.fillStyle = '#ffffff'; g.fillRect(108, 0, 40, 140); g.fillRect(0, 50, 256, 40);
    g.fillStyle = '#dc2626'; g.fillRect(116, 0, 24, 140); g.fillRect(0, 58, 256, 24);
  });
  tex.flagRU = mkFlag((g) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 47);
    g.fillStyle = '#2563eb'; g.fillRect(0, 47, 256, 47);
    g.fillStyle = '#dc2626'; g.fillRect(0, 94, 256, 46);
  });

  // IT Labs & Hubs
  tex.macWall = signTex(512, 256, '#16a34a', '#ffffff', 'Apple macOS', 'IT LABORATORIYA #1');
  tex.gptWall = signTex(512, 256, '#eab308', '#1e293b', 'ChatGPT · SMM', 'IT LABORATORIYA #2');

  return tex;
}
