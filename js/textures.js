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

  // 1. Octagonal & diamond sun-lit courtyard pavers (DJI Drone 00:06-00:09 & Photos)
  {
    const [c, g] = makeCanvas(512, 512);
    g.fillStyle = '#c4bfb6';
    g.fillRect(0, 0, 512, 512);
    const step = 128;
    for (let y = 0; y < 512; y += step) {
      for (let x = 0; x < 512; x += step) {
        const cx = x + step / 2, cy = y + step / 2, r = 56;
        g.fillStyle = ((x + y) / step) % 2 === 0 ? '#d2cdc4' : '#c6c0b6';
        g.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4 + Math.PI / 8;
          const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
          i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
        }
        g.closePath();
        g.fill();
        g.strokeStyle = '#7b7871';
        g.lineWidth = 3;
        g.stroke();

        g.strokeStyle = '#aba59b';
        g.lineWidth = 2;
        g.beginPath();
        g.arc(cx, cy, 34, 0, Math.PI * 2);
        g.stroke();
      }
    }
    g.fillStyle = '#383d44';
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

  // 3. Natural sunlit warm ivory travertine stucco facade
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#f3efe6';
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2200; i++) {
      const d = Math.random() > 0.5 ? 248 : 228;
      g.fillStyle = `rgba(${d},${d - 4},${d - 12},0.24)`;
      g.fillRect(Math.random() * 256, Math.random() * 256, 4, 2);
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

  {
    const [c, g] = makeCanvas(1024, 160);
    g.clearRect(0, 0, 1024, 160);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '900 94px Arial, sans-serif';
    g.lineWidth = 10; g.strokeStyle = '#ffffff';
    g.strokeText('TURON ODOB-ILM', 512, 84);
    g.fillStyle = '#cf1b26';
    g.fillText('TURON ODOB-ILM', 512, 84);
    tex.signMain = asTex(c, 1, 1);
  }
  tex.signSub = signTex(1024, 160, '#f4f5f7', '#cf1b26', 'XUSUSIY MAKTABI');
  tex.signHub = signTex(1024, 160, '#282c32', '#f8fafc', 'INNOVATION HUB');
  tex.glassStripe = signTex(1024, 128, '#14171a', '#facc15', 'TURON ODOB-ILM', 'XUSUSIY MAKTABI', '#facc15');
  tex.doorB = signTex(256, 256, '#1c242b', '#e2e8f0', 'B', 'blok');
  tex.fenceBannerSAT = signTex(512, 256, '#17191d', '#f8fafc', 'SAT', 'TURON ODOB-ILM · XALQARO TAYYORLOV', '#ef4444');
  {
    const [c, g] = makeCanvas(512, 256);
    g.fillStyle = '#0369a1'; g.fillRect(0, 0, 512, 256);
    g.strokeStyle = '#ffffff'; g.lineWidth = 10; g.strokeRect(10, 10, 492, 236);
    g.fillStyle = '#f8fafc'; g.fillRect(253, 10, 6, 236);
    tex.pingPong = asTex(c, 1, 1);
  }

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

  // Taekwondo sky-blue EVA court with 2 pink/coral training lanes (Image 15)
  {
    const [c, g] = makeCanvas(512, 256);
    g.fillStyle = '#5bb7db';
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#e07b8e';
    g.fillRect(0, 52, 512, 42);
    g.fillRect(0, 162, 512, 42);
    g.strokeStyle = 'rgba(255,255,255,0.28)';
    g.lineWidth = 2;
    for (let x = 0; x <= 512; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
    for (let y = 0; y <= 256; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
    tex.tatami = asTex(c, 3, 2);
  }

  // Oshxona sage-green / pink / yellow / white walls (Image 14)
  {
    const [c, g] = makeCanvas(512, 256);
    g.fillStyle = '#d1d5db'; g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#7ea670'; g.fillRect(0, 0, 160, 210);
    g.fillStyle = '#e58aa8'; g.fillRect(160, 0, 90, 210);
    g.fillStyle = '#e5a93c'; g.fillRect(250, 0, 110, 210);
    g.fillStyle = '#6f9c64'; g.fillRect(360, 0, 152, 210);
    g.fillStyle = '#f8fafc'; g.fillRect(0, 210, 512, 46);
    tex.oshxonaWall = asTex(c, 2, 1);
  }

  // Oshxona far-end golden hourglass / diamond wall mural (Image 14)
  {
    const [c, g] = makeCanvas(512, 256);
    g.fillStyle = '#474c52';
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#e0ab2b';
    g.beginPath(); g.moveTo(0, 0); g.lineTo(256, 128); g.lineTo(0, 256); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(512, 0); g.lineTo(256, 128); g.lineTo(512, 256); g.closePath(); g.fill();
    tex.oshxonaBackMural = asTex(c, 1, 1);
  }

  // Taekwondo Club end wall banner mural (Image 15)
  {
    const [c, g] = makeCanvas(512, 256);
    g.fillStyle = '#f1f5f9'; g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#dc2626'; g.fillRect(0, 0, 512, 22);
    g.fillStyle = '#1e3a8a'; g.fillRect(0, 234, 512, 22);
    g.fillStyle = '#1e3a8a'; g.font = '900 44px Arial, sans-serif'; g.textAlign = 'center';
    g.fillText('TAEKWONDO CLUB', 256, 95);
    g.fillStyle = '#dc2626'; g.font = 'bold 24px Arial, sans-serif';
    g.fillText('TURON ODOB-ILM · 태권도', 256, 148);
    g.fillStyle = '#2563eb'; g.beginPath(); g.arc(110, 195, 22, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ef4444'; g.beginPath(); g.arc(402, 195, 22, 0, Math.PI * 2); g.fill();
    tex.taekwondoMural = asTex(c, 1, 1);
  }

  // Stairwell diagonal mint/white/steel-blue geometric wall (Image 7)
  {
    const [c, g] = makeCanvas(512, 512);
    g.fillStyle = '#f1f5f9'; g.fillRect(0, 0, 512, 512);
    g.fillStyle = '#2eb88a';
    g.beginPath(); g.moveTo(0, 0); g.lineTo(230, 0); g.lineTo(0, 310); g.closePath(); g.fill();
    g.fillStyle = '#4a88b5';
    g.beginPath(); g.moveTo(512, 180); g.lineTo(512, 512); g.lineTo(250, 512); g.closePath(); g.fill();
    tex.stairWall = asTex(c, 1, 1);
  }

  // 2F/3F Origami Geometric Corridor Wallpaper (Image 11)
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#f3f4f6'; g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 64) {
      for (let x = 0; x < 256; x += 64) {
        g.fillStyle = '#e5e7eb';
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + 64, y); g.lineTo(x + 32, y + 48); g.closePath(); g.fill();
        g.fillStyle = '#d1d5db';
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + 32, y + 48); g.lineTo(x, y + 64); g.closePath(); g.fill();
        g.strokeStyle = '#cbd5e1'; g.lineWidth = 1.5;
        g.strokeRect(x, y, 64, 64);
      }
    }
    tex.corridorOrigami = asTex(c, 10, 2);
  }

  // Podvol / Oshxona Checkered Black-and-White Marble Floor (Image 12 & 14)
  {
    const [c, g] = makeCanvas(256, 256);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        g.fillStyle = (x + y) % 2 === 0 ? '#f1f5f9' : '#26292e';
        g.fillRect(x * 64, y * 64, 64, 64);
      }
    }
    tex.podvolFloor = asTex(c, 7, 5);
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

  // --- REAR CAMPUS TEXTURES (From Videos + Image 1, 5, 6) ---
  // 12. Shirin Kulcha Bufet Bakery Glass Panel (Image 5!)
  {
    const [c, g] = makeCanvas(512, 512);
    g.fillStyle = '#e7dfd3';
    g.fillRect(0, 0, 512, 512);
    g.strokeStyle = '#334155'; g.lineWidth = 10; g.strokeRect(10, 10, 492, 492);
    g.fillStyle = '#d4b483'; g.strokeStyle = '#6b4f2a'; g.lineWidth = 4;
    [[140, 130, 62], [350, 140, 68], [160, 280, 58], [360, 285, 58]].forEach(([bx, by, br]) => {
      g.beginPath(); g.arc(bx, by, br, 0, Math.PI * 2); g.fill(); g.stroke();
      g.beginPath(); g.arc(bx, by, br * 0.45, 0, Math.PI * 2); g.stroke();
    });
    g.fillStyle = '#f8fafc';
    g.fillRect(20, 365, 310, 125);
    g.fillStyle = '#111827';
    g.font = '900 40px Arial, sans-serif';
    g.textAlign = 'left';
    g.fillText('SHIRIN', 36, 412);
    g.fillText('KULCHA', 36, 452);
    g.font = 'bold 16px Arial, sans-serif';
    g.fillText('(97) 811-10-59 · (97) 820-10-59', 36, 478);
    tex.shirinKulcha = asTex(c, 1, 1);
  }

  // 13. Red 2-Door Fire Cabinet on Boiler House (Video 1 00:01)
  {
    const [c, g] = makeCanvas(256, 320);
    g.fillStyle = '#7f1d1d'; g.fillRect(0, 0, 256, 320);
    g.strokeStyle = '#450a0a'; g.lineWidth = 8; g.strokeRect(6, 6, 244, 308);
    g.fillStyle = '#1e293b';
    g.fillRect(22, 24, 96, 170);
    g.fillRect(138, 24, 96, 170);
    g.fillStyle = '#991b1b';
    g.fillRect(18, 212, 220, 90);
    g.fillStyle = '#fca5a5'; g.font = 'bold 20px Arial'; g.textAlign = 'center';
    g.fillText('01 · PK', 128, 265);
    tex.fireCabinet = asTex(c, 1, 1);
  }

  // 14. Precast Concrete Panel Fence / Evrozabor (Video 2 00:02)
  {
    const [c, g] = makeCanvas(512, 256);
    g.fillStyle = '#9ca3af'; g.fillRect(0, 0, 512, 256);
    g.strokeStyle = '#6b7280'; g.lineWidth = 6;
    for (let x = 0; x < 512; x += 256) {
      g.fillStyle = '#b4bac2';
      g.fillRect(x + 12, 16, 232, 68); g.strokeRect(x + 12, 16, 232, 68);
      g.fillRect(x + 12, 94, 232, 68); g.strokeRect(x + 12, 94, 232, 68);
      g.fillRect(x + 12, 172, 232, 68); g.strokeRect(x + 12, 172, 232, 68);
    }
    tex.evrozabor = asTex(c, 10, 1);
  }

  // 15. Sports Hall Vertical Ribbed Gray Cladding (Video 2 00:00 & Video 4 00:00)
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#6b7280'; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 16) {
      g.fillStyle = '#4b5563'; g.fillRect(x, 0, 6, 256);
      g.fillStyle = '#9ca3af'; g.fillRect(x + 6, 0, 3, 256);
    }
    tex.sportRibbed = asTex(c, 14, 2);
  }

  // 16. Natural Sunlit Compacted Earth / Dry Turf Field (DJI Drone 00:00-00:06)
  {
    const [c, g] = makeCanvas(512, 512);
    g.fillStyle = '#a58d6b'; g.fillRect(0, 0, 512, 512);
    for (let p = 0; p < 36; p++) {
      g.fillStyle = p % 2 === 0 ? 'rgba(196,174,140,0.22)' : 'rgba(130,108,78,0.18)';
      g.beginPath();
      g.ellipse(Math.random() * 512, Math.random() * 512, 30 + Math.random() * 65, 20 + Math.random() * 45, Math.random() * 3, 0, Math.PI * 2);
      g.fill();
    }
    for (let i = 0; i < 4500; i++) {
      const d = Math.random();
      g.fillStyle = d > 0.65 ? '#bfa988' : d > 0.30 ? '#8c7456' : '#737f57';
      g.fillRect(Math.random() * 512, Math.random() * 512, 2 + (d > 0.8 ? 2 : 0), 2);
    }
    tex.dirtField = asTex(c, 8, 8);
  }

  // 17. Bright Silver-Zinc Standing-Seam Metal Profnastil Roof (DJI Drone 00:00-00:09)
  {
    const [c, g] = makeCanvas(512, 512);
    g.fillStyle = '#cfd5dc'; g.fillRect(0, 0, 512, 512);
    for (let x = 0; x < 512; x += 16) {
      g.fillStyle = '#aeb6c1'; g.fillRect(x, 0, 4, 512);
      g.fillStyle = '#eaedf2'; g.fillRect(x + 4, 0, 3, 512);
    }
    g.strokeStyle = 'rgba(155, 163, 175, 0.35)';
    g.lineWidth = 2;
    for (let y = 0; y < 512; y += 128) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
    tex.silverRoof = asTex(c, 18, 6);
  }

  // 18. Light Daylight Silver-Gray Corrugated Roof Sheets for Cottages & Gazebos
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#b9c0c8'; g.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 16) {
      g.fillStyle = '#9aa2ac'; g.fillRect(x, 0, 4, 256);
      g.fillStyle = '#d8dde4'; g.fillRect(x + 4, 0, 4, 256);
    }
    tex.slateRoof = asTex(c, 18, 4);
  }

  // 19. Natural Variegated Lawn Grass Texture (front lawns & gulzors)
  {
    const [c, g] = makeCanvas(256, 256);
    g.fillStyle = '#2d6c2c'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3200; i++) {
      const r = Math.random();
      g.fillStyle = r > 0.65 ? '#3a8235' : r > 0.3 ? '#245924' : '#4a8f41';
      g.fillRect(Math.random() * 256, Math.random() * 256, 2, 3);
    }
    tex.grassTex = asTex(c, 6, 4);
  }

  // 20. Neighboring 37-Maktab Green Artificial Turf Pitch (DJI Drone 00:00-00:04 Left)
  {
    const [c, g] = makeCanvas(512, 1024);
    g.fillStyle = '#2d7a36'; g.fillRect(0, 0, 512, 1024);
    for (let y = 0; y < 1024; y += 64) {
      if ((y / 64) % 2 === 0) {
        g.fillStyle = '#368a40'; g.fillRect(0, y, 512, 64);
      }
    }
    g.strokeStyle = 'rgba(248,250,252,0.85)'; g.lineWidth = 6;
    g.strokeRect(24, 24, 464, 976);
    g.beginPath(); g.moveTo(24, 512); g.lineTo(488, 512); g.stroke();
    g.beginPath(); g.arc(256, 512, 64, 0, Math.PI * 2); g.stroke();
    g.strokeRect(136, 24, 240, 120);
    g.strokeRect(136, 880, 240, 120);
    tex.neighborPitch = asTex(c, 1, 1);
  }

  // 21. White Mesh Volleyball Net (Video 2 00:02)
  {
    const [c, g] = makeCanvas(256, 128);
    g.clearRect(0, 0, 256, 128);
    g.fillStyle = '#f8fafc'; g.fillRect(0, 0, 256, 12);
    g.strokeStyle = 'rgba(248,250,252,0.85)'; g.lineWidth = 2;
    for (let x = 0; x <= 256; x += 16) { g.beginPath(); g.moveTo(x, 12); g.lineTo(x, 128); g.stroke(); }
    for (let y = 12; y <= 128; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
    tex.volleyballNet = asTex(c, 8, 1);
  }

  // 22. Outdoor Basketball Court Surface with White Markings
  {
    const [c, g] = makeCanvas(512, 256);
    g.fillStyle = '#3b4d63';
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#9a4d32';
    g.fillRect(24, 18, 464, 220);
    g.strokeStyle = '#ffffff';
    g.lineWidth = 4;
    g.strokeRect(24, 18, 464, 220);
    g.beginPath(); g.moveTo(256, 18); g.lineTo(256, 238); g.stroke();
    g.beginPath(); g.arc(256, 128, 34, 0, Math.PI * 2); g.stroke();
    // Left & right keys + 3pt arcs
    g.fillStyle = '#2563eb';
    g.fillRect(24, 86, 86, 84); g.strokeRect(24, 86, 86, 84);
    g.fillRect(402, 86, 86, 84); g.strokeRect(402, 86, 86, 84);
    g.beginPath(); g.arc(54, 128, 86, -Math.PI * 0.45, Math.PI * 0.45); g.stroke();
    g.beginPath(); g.arc(458, 128, 86, Math.PI * 0.55, Math.PI * 1.45); g.stroke();
    tex.basketballCourt = asTex(c, 1, 1);
  }

  return tex;
}
