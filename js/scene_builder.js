import * as THREE from 'three';

export function buildTuronCampus(scene, tex) {
  const groups = {
    site: new THREE.Group(),
    bExterior: new THREE.Group(),
    bTsokol: new THREE.Group(),
    bFloor1: new THREE.Group(),
    bFloor2: new THREE.Group(),
    bRoof: new THREE.Group(),
    hubShell: new THREE.Group(),
    hubFloor1: new THREE.Group(),
    hubFloor2: new THREE.Group(),
    hubRoof: new THREE.Group(),
    cars: new THREE.Group(),
  };

  Object.values(groups).forEach((g) => scene.add(g));
  const interactiveZones = [];
  const animatedFlags = [];

  const M = {
    stucco: new THREE.MeshStandardMaterial({ map: tex.stucco, roughness: 0.78, metalness: 0.04 }),
    charcoal: new THREE.MeshStandardMaterial({ color: 0x343a40, roughness: 0.55, metalness: 0.25 }),
    parapet: new THREE.MeshStandardMaterial({ map: tex.parapet, roughness: 0.45, metalness: 0.35 }),
    granite: new THREE.MeshStandardMaterial({ map: tex.granite, roughness: 0.25, metalness: 0.15 }),
    whiteTrim: new THREE.MeshStandardMaterial({ color: 0xf4f5f7, roughness: 0.45 }),
    bronzeGlass: new THREE.MeshPhysicalMaterial({
      color: 0x4b382f, roughness: 0.12, metalness: 0.25,
      transmission: 0.35, transparent: true, opacity: 0.85, ior: 1.5
    }),
    clearGlass: new THREE.MeshPhysicalMaterial({
      color: 0xbfe3f7, roughness: 0.08, metalness: 0.1,
      transparent: true, opacity: 0.42
    }),
    frostedGlass: new THREE.MeshStandardMaterial({
      color: 0xd9e3ea, roughness: 0.5, transparent: true, opacity: 0.65
    }),
    whiteMarble: new THREE.MeshStandardMaterial({ map: tex.whiteMarble, roughness: 0.18, metalness: 0.08 }),
    blackMarble: new THREE.MeshStandardMaterial({ map: tex.blackMarble, roughness: 0.2, metalness: 0.1 }),
    woodCol: new THREE.MeshStandardMaterial({ color: 0xb9946b, roughness: 0.55 }),
    darkWood: new THREE.MeshStandardMaterial({ color: 0x4f3c2d, roughness: 0.55 }),
    orangeWall: new THREE.MeshStandardMaterial({ color: 0xf26522, roughness: 0.6 }),
    redAlu: new THREE.MeshStandardMaterial({ color: 0xba1d24, roughness: 0.35, metalness: 0.3 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xd0d7de, roughness: 0.25, metalness: 0.85 }),
    blackSteel: new THREE.MeshStandardMaterial({ color: 0x1d2126, roughness: 0.4, metalness: 0.7 }),
    greenLed: new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.3 }),
    warmLed: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff8e7, emissiveIntensity: 1.1 }),
    hubCream: new THREE.MeshStandardMaterial({ color: 0xdcd5be, roughness: 0.65 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x2f6b2f, roughness: 0.92 }),
    tree: new THREE.MeshStandardMaterial({ color: 0x1f4f24, roughness: 0.88 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 }),
    cinder: new THREE.MeshStandardMaterial({ color: 0x8e9399, roughness: 0.9 }),
    acWhite: new THREE.MeshStandardMaterial({ color: 0xe8eaed, roughness: 0.4 }),
  };

  function box(parent, w, h, d, mat, x, y, z, rx = 0, ry = 0, rz = 0, cast = true) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    if (rx || ry || rz) m.rotation.set(rx, ry, rz);
    m.castShadow = cast;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  function tagZone(mesh, title, dims, desc) {
    mesh.userData = { title, dims, desc };
    interactiveZones.push(mesh);
  }

  // =========================================================
  // 1. SITE & SURROUNDINGS (1:1 meters)
  // =========================================================
  // Ground grass / surround
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 200), new THREE.MeshStandardMaterial({ color: 0x3b4439, roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.04, 15);
  ground.receiveShadow = true;
  groups.site.add(ground);

  // Paved main front & side courtyard (58 x 43 m -> X in [-29, 29], Z in [-13.5, 29.5])
  const paveMat = new THREE.MeshStandardMaterial({ map: tex.bruschatka, roughness: 0.85 });
  const pave = new THREE.Mesh(new THREE.BoxGeometry(58, 0.08, 43), paveMat);
  pave.position.set(0, -0.02, 8.0);
  pave.receiveShadow = true;
  groups.site.add(pave);

  // Sidewalk & Parking apron north of fence (Z = 29.5 to 36.5)
  box(groups.site, 86, 0.06, 7.0, new THREE.MeshStandardMaterial({ color: 0x4b525a, roughness: 0.9 }), -4, -0.01, 33.0, 0, 0, 0, false);
  // Parking lines
  for (let px = -14; px <= 22; px += 3.2) {
    box(groups.site, 0.1, 0.02, 4.2, M.whiteTrim, px, 0.03, 33.5, 0, 0, 0, false);
  }
  // A-376 Highway (Z = 36.5 to 47.5)
  box(groups.site, 200, 0.05, 11.0, new THREE.MeshStandardMaterial({ map: tex.road, roughness: 0.85 }), 0, -0.02, 42.0, 0, 0, 0, false);

  // Front Brick-Pillar Fence & Banners along Z = 29.5 (X from -28 to +29, with Gate at [-27, -21.5])
  const klumbaMat = new THREE.MeshStandardMaterial({ map: tex.stoneBrick, roughness: 0.8 });
  box(groups.site, 49.0, 0.55, 0.55, klumbaMat, 4.5, 0.27, 30.2); // Terracotta stone planter outside fence
  for (let sx = -19; sx <= 28; sx += 2.2) {
    const bush = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), M.tree);
    bush.position.set(sx, 0.72, 30.2);
    bush.castShadow = true;
    groups.site.add(bush);
  }
  // Fence pillars & banners (east of gate: X = -20.5 to +28.5 step 4.9)
  const bannerMat = new THREE.MeshStandardMaterial({ map: tex.fenceBanner, roughness: 0.6 });
  for (let i = 0; i <= 10; i++) {
    const px = -20.5 + i * 4.9;
    box(groups.site, 0.45, 2.25, 0.45, M.stucco, px, 1.12, 29.5);
    box(groups.site, 0.54, 0.14, 0.54, M.charcoal, px, 2.28, 29.5);
    if (i < 10) {
      // Metal fence span + banner every other bay
      box(groups.site, 4.45, 0.35, 0.25, M.stucco, px + 2.45, 0.18, 29.5);
      box(groups.site, 4.45, 0.06, 0.06, M.blackSteel, px + 2.45, 1.95, 29.5);
      box(groups.site, 4.45, 0.06, 0.06, M.blackSteel, px + 2.45, 0.85, 29.5);
      if (i % 2 === 0 && i < 8) {
        box(groups.site, 4.2, 1.45, 0.06, bannerMat, px + 2.45, 1.15, 29.52);
      }
    }
  }
  // Open metal gate leaf at X = -26.5..-21.0 (Photo 4)
  box(groups.site, 0.45, 2.5, 0.45, M.stucco, -26.5, 1.25, 29.5);
  box(groups.site, 0.1, 2.1, 3.8, M.charcoal, -26.5, 1.05, 27.6); // Open swinging gate leaf

  // Side fences (East & West)
  box(groups.site, 0.35, 2.2, 43, M.stucco, 29.0, 1.1, 8.0);
  box(groups.site, 0.35, 2.2, 43, M.stucco, -29.0, 1.1, 8.0);

  // Front Lawns (Left East & Right West of central stairs, Photo 1 & 5)
  [-15.2, 15.2].forEach((lx) => {
    box(groups.site, 12.2, 0.1, 4.2, M.grass, lx, 0.03, 12.2, 0, 0, 0, false);
    // Low perimeter wire posts
    for (let px = lx - 5.8; px <= lx + 5.8; px += 3.8) {
      box(groups.site, 0.06, 0.9, 0.06, M.steel, px, 0.45, 14.2);
    }
    // Park bench
    box(groups.site, 1.8, 0.1, 0.5, M.woodCol, lx, 0.48, 11.2);
    box(groups.site, 1.8, 0.42, 0.08, M.woodCol, lx, 0.78, 10.98);
    // Conifers & round shrubs
    for (let sx = -4.5; sx <= 4.5; sx += 3.0) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 2.0, 10), M.tree);
      cone.position.set(lx + sx, 1.0, 11.5);
      cone.castShadow = true;
      groups.site.add(cone);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), M.tree);
      ball.position.set(lx + sx + 1.2, 0.45, 13.0);
      ball.castShadow = true;
      groups.site.add(ball);
    }
  });

  // 3 Tall Flagpoles (West front lawn, X = -10.2, -12.4, -14.6, Z = 15.6)
  const flagTexs = [tex.flagUZ, tex.flagUK, tex.flagRU];
  flagTexs.forEach((ft, idx) => {
    const fx = -10.5 - idx * 2.1, fz = 15.6;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 9.5, 10), M.steel);
    pole.position.set(fx, 4.75, fz);
    pole.castShadow = true;
    groups.site.add(pole);
    const flagGeo = new THREE.PlaneGeometry(1.9, 1.05, 10, 4);
    const flagMat = new THREE.MeshStandardMaterial({ map: ft, side: THREE.DoubleSide, roughness: 0.7 });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(fx + 0.95, 8.75, fz);
    groups.site.add(flag);
    animatedFlags.push(flag);
  });

  // Outdoor Drinking / Handwashing Fountain (Tashna, Photo 2, East courtyard X = 23.0, Z = 19.5)
  const tashna = new THREE.Group();
  box(tashna, 3.2, 1.7, 0.9, M.whiteMarble, 0, 0.85, 0);
  box(tashna, 3.25, 0.75, 1.25, M.whiteMarble, 0, 0.37, 0.2);
  box(tashna, 1.0, 0.5, 0.06, M.steel, 0, 1.25, 0.46); // Mirror
  box(tashna, 0.08, 3.2, 0.08, M.charcoal, 1.7, 1.6, -0.3); // Light pole
  tashna.position.set(22.5, 0, 18.5);
  tashna.rotation.y = -0.35;
  tagZone(tashna.children[0], 'Tashqi qo‘l yuvish (Tashna)', '3.2 × 1.1 × 1.75 m', '2-rasmdagi oq kafelli ikki jo‘mrakli yuvinish joyi.');
  groups.site.add(tashna);

  // Back Courtyard / Sports field (27.5 x 45.6 m south of B blok, Z = -13.5 to -48)
  box(groups.site, 56, 0.05, 36, new THREE.MeshStandardMaterial({ color: 0x3f4c39, roughness: 0.95 }), 0, -0.02, -31.5, 0, 0, 0, false);
  // Gray cinder-block rear & east perimeter fence (Photo p11142_1)
  box(groups.site, 58, 2.8, 0.35, M.cinder, 0, 1.4, -49.5);
  box(groups.site, 0.35, 2.8, 36, M.cinder, 29.0, 1.4, -31.5);
  box(groups.site, 0.35, 2.8, 36, M.cinder, -29.0, 1.4, -31.5);
  // Soccer goal in back yard
  box(groups.site, 0.1, 2.1, 0.1, M.whiteTrim, -3.5, 1.05, -47.5);
  box(groups.site, 0.1, 2.1, 0.1, M.whiteTrim, 3.5, 1.05, -47.5);
  box(groups.site, 7.1, 0.1, 0.1, M.whiteTrim, 0, 2.1, -47.5);
  // Tall poplar trees along East border with 37-maktab
  for (let tz = -45; tz <= -5; tz += 5.5) {
    box(groups.site, 0.3, 3.0, 0.3, M.trunk, 30.8, 1.5, tz);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(1.6, 9.5, 8), M.tree);
    crown.position.set(30.8, 7.5, tz);
    crown.castShadow = true;
    groups.site.add(crown);
  }

  // =========================================================
  // 2. MAIN SCHOOL BUILDING (B BLOK) — 43.37 x 18.94 m, 11.35 m
  // =========================================================
  // Tsokol (-1.70 m to +1.45 m -> height 3.15 m; visible granite plinth 0.00 to +1.45 m)
  // Core footprint: X in [-21.685, 21.685], Z in [-9.47, 9.47]
  // Central projection: X in [-8.40, 8.40] chamfering to X in [-5.32, 5.32] at Z = +13.67
  const portalShape = new THREE.Shape();
  portalShape.moveTo(-21.685, -9.47);
  portalShape.lineTo(21.685, -9.47);
  portalShape.lineTo(21.685, 9.47);
  portalShape.lineTo(8.40, 9.47);
  portalShape.lineTo(5.32, 13.67);
  portalShape.lineTo(-5.32, 13.67);
  portalShape.lineTo(-8.40, 9.47);
  portalShape.lineTo(-21.685, 9.47);
  portalShape.closePath();

  function extrudePlan(parent, height, yBottom, mat) {
    const geo = new THREE.ExtrudeGeometry(portalShape, { depth: height, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2); // XY -> XZ (wait: rotateX(-PI/2) sends +Y to -Z! So invert Z or use rotateX(PI/2) carefully)
    // Correction: rotateX(Math.PI/2) maps (x, y, z) -> (x, -z, y). Let's flip Y in shape or scale Z by -1!
    geo.scale(1, 1, -1);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = yBottom;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // Note on ExtrudeGeometry orientation:
  // After rotateX(-PI/2): (x, y, depth) -> (x, depth, -y). Scaling (1, 1, -1) makes -y -> +y, so shape Y becomes +Z and extrusion depth becomes +Y!
  // Let's verify: shape y=+13.67 -> rotateX(-PI/2) -> z=-13.67 -> scale(1,1,-1) -> z=+13.67! And depth=1.45 -> y=+1.45! Exact!

  // ---- B BLOK SHELL & FLOOR SLABS ----
  // Tsokol floor slab (-1.70 m) & Black Granite Plinth walls (0.00 to +1.45 m)
  const tsokolSlab = extrudePlan(groups.bTsokol, 0.25, -1.70, M.charcoal);
  tagZone(tsokolSlab, 'Tsokol qavati (-1.70 m)', '43.37 × 18.94 m (856 m²)', 'Taekwondo zali, 500 o‘rinli oshxona va yordamchi xonalar.');

  // Granite exterior plinth (0.00 to +1.45 m) — split around perimeter so interior tsokol is visible in cutaway
  box(groups.bExterior, 13.3, 1.45, 0.45, M.granite, -15.05, 0.725, 9.25); // West wing plinth
  box(groups.bExterior, 13.3, 1.45, 0.45, M.granite, 15.05, 0.725, 9.25);  // East wing plinth
  box(groups.bExterior, 43.37, 1.45, 0.45, M.granite, 0, 0.725, -9.25);    // South plinth
  box(groups.bExterior, 0.45, 1.45, 18.94, M.granite, -21.46, 0.725, 0);   // West side plinth
  box(groups.bExterior, 0.45, 1.45, 18.94, M.granite, 21.46, 0.725, 0);    // East side plinth
  // Portal plinth walls
  box(groups.bExterior, 10.64, 1.45, 0.45, M.granite, 0, 0.725, 13.45);
  box(groups.bExterior, 5.2, 1.45, 0.45, M.granite, -6.86, 0.725, 11.57, 0, Math.atan2(4.2, 3.08));
  box(groups.bExterior, 5.2, 1.45, 0.45, M.granite, 6.86, 0.725, 11.57, 0, -Math.atan2(4.2, 3.08));

  // Tsokol exterior basement windows (4 per front wing + 2 per chamfer)
  [-19.5, -16.4, -13.3, -10.2, 10.2, 13.3, 16.4, 19.5].forEach((wx) => {
    box(groups.bExterior, 1.35, 0.52, 0.52, M.bronzeGlass, wx, 0.85, 9.25);
    box(groups.bExterior, 1.45, 0.62, 0.48, M.darkWood, wx, 0.85, 9.24);
  });

  // ---- TSOKOL INTERIOR ROOMS (-1.70 m to +1.45 m) ----
  // Taekwondo Hall (West half: X = -21.2 to -1.2, Z = -8.8 to +1.0)
  const tkMat = new THREE.MeshStandardMaterial({ map: tex.tatami, roughness: 0.7 });
  const tkFloor = box(groups.bTsokol, 19.8, 0.08, 9.6, tkMat, -11.2, -1.42, -3.9, 0, 0, 0, false);
  tagZone(tkFloor, 'Taekwondo / Sport zali (Tsokol)', '~20.0 × 9.5 m (~190 m²)', 'Qizil-ko‘k 1×1 m tatami to‘shalmali zal, yashil-ko‘k devorlar va LED shift.');
  box(groups.bTsokol, 19.8, 2.8, 0.25, new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.7 }), -11.2, -0.05, -8.7);
  box(groups.bTsokol, 0.35, 2.8, 0.35, new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 }), -11.2, -0.05, -3.9);

  // 500-seat Oshxona (East half: X = +1.0 to +17.0, Z = -8.8 to +2.5)
  const oshFloor = box(groups.bTsokol, 16.0, 0.08, 11.2, M.whiteMarble, 9.0, -1.42, -3.2, 0, 0, 0, false);
  tagZone(oshFloor, '500 o‘rinli Oshxona (Tsokol)', '~16.0 × 11.2 m (~180 m²)', 'Pushti-yalpiz devorlar, ko‘k ustunlar, marmar-ko‘k stol-skameykalar.');
  box(groups.bTsokol, 16.0, 2.8, 0.25, new THREE.MeshStandardMaterial({ map: tex.oshxonaWall, roughness: 0.7 }), 9.0, -0.05, -8.7);
  // Dining tables & benches
  const tableBlue = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
  for (let tx = 3.0; tx <= 14.5; tx += 3.8) {
    for (let tz = -6.5; tz <= 0.5; tz += 2.6) {
      box(groups.bTsokol, 2.2, 0.06, 0.9, M.whiteMarble, tx, -0.68, tz);
      box(groups.bTsokol, 2.0, 0.68, 0.75, tableBlue, tx, -1.05, tz);
      box(groups.bTsokol, 2.2, 0.05, 0.35, M.whiteMarble, tx, -0.95, tz - 0.75);
      box(groups.bTsokol, 2.2, 0.05, 0.35, M.whiteMarble, tx, -0.95, tz + 0.75);
    }
  }
  // Kitchen prep room (Far East tsokol)
  box(groups.bTsokol, 0.2, 2.8, 11.2, M.whiteTrim, 17.2, -0.05, -3.2);

  // ---- 1-QAVAT SLAB & INTERIOR (+1.45 m to +5.25 m) ----
  const f1Slab = extrudePlan(groups.bFloor1, 0.22, 1.30, M.whiteMarble);
  tagZone(f1Slab, '1-qavat (+1.45 m)', '856 m² (Shift 3.40 m)', 'Markaziy foye, kema maketi, resepshn, vitraj shisha sinflar va 2.6 m yo‘laklar.');

  // Black marble strips on 1st floor foye & corridors (Photos 10-12)
  box(groups.bFloor1, 0.6, 0.02, 13.5, M.blackMarble, -2.1, 1.53, 5.5, 0, 0, 0, false);
  box(groups.bFloor1, 0.6, 0.02, 13.5, M.blackMarble, 2.1, 1.53, 5.5, 0, 0, 0, false);
  for (let bx = -20.5; bx <= 20.5; bx += 3.2) {
    if (Math.abs(bx) > 3.0) box(groups.bFloor1, 0.6, 0.02, 2.5, M.blackMarble, bx, 1.53, 0, 0, 0, 0, false);
  }

  // Foye wooden columns (4 square wood-clad pillars)
  [[-4.2, 4.5], [4.2, 4.5], [-4.2, 9.2], [4.2, 9.2]].forEach(([cx, cz]) => {
    box(groups.bFloor1, 0.58, 3.4, 0.58, M.woodCol, cx, 3.22, cz);
  });
  // Orange accent wall (West side of Foye, Photo 11)
  box(groups.bFloor1, 0.25, 3.4, 6.0, M.orangeWall, -5.2, 3.22, 4.6);
  // Reception Desk (Photo 10 right side = West side of Foye)
  const recMesh = box(groups.bFloor1, 1.1, 1.05, 5.4, M.darkWood, -4.4, 2.05, 6.2);
  tagZone(recMesh, 'Markaziy Foye va Resepshn (1-qavat)', '10.6 × 15.6 m (~165 m²)', 'Oq-qora marmar pol, yog‘och ustunlar, kema maketi, rangli papkali resepshn va atlas bezaklar.');
  // Colorful folders behind reception
  [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e].forEach((fc, idx) => {
    box(groups.bFloor1, 0.35, 0.35, 4.4, new THREE.MeshStandardMaterial({ color: fc }), -5.0, 2.7 + idx * 0.42, 6.2);
  });
  // Wooden Sailing Ship Model (East side of Foye, Photo 10 left)
  const ship = new THREE.Group();
  box(ship, 0.55, 0.45, 2.3, M.woodCol, 0, 0.4, 0);
  [-0.6, 0, 0.6].forEach((mz) => {
    box(ship, 0.06, 2.0, 0.06, M.woodCol, 0, 1.4, mz);
    box(ship, 0.85, 0.45, 0.04, M.whiteTrim, 0, 1.1, mz);
    box(ship, 0.65, 0.4, 0.04, M.whiteTrim, 0, 1.75, mz);
  });
  ship.position.set(4.1, 1.52, 10.6);
  groups.bFloor1.add(ship);

  // Atlas draped valances along Foye beams (Photo 10)
  const atlasMat = new THREE.MeshStandardMaterial({ map: tex.atlas, side: THREE.DoubleSide, roughness: 0.7 });
  box(groups.bFloor1, 8.8, 0.65, 0.08, atlasMat, 0, 4.55, 9.2);
  box(groups.bFloor1, 8.8, 0.65, 0.08, atlasMat, 0, 4.55, 4.5);
  // Green LED cove ceiling strips in Foye
  box(groups.bFloor1, 8.2, 0.06, 0.14, M.greenLed, 0, 4.88, 7.0);
  box(groups.bFloor1, 0.14, 0.06, 7.5, M.greenLed, -2.5, 4.88, 6.8);
  box(groups.bFloor1, 0.14, 0.06, 7.5, M.greenLed, 2.5, 4.88, 6.8);

  // Glass Classroom Corridor Partitions (South side of corridor Z = -1.35, Photos 11-12)
  const glassLogoMat = new THREE.MeshStandardMaterial({ map: tex.glassStripe, roughness: 0.4 });
  [-18.4, -13.1, -7.8, 7.8, 13.1, 18.4].forEach((cx, i) => {
    // Glass wall (upper clear, lower frosted, middle gold-black logo stripe)
    box(groups.bFloor1, 5.0, 1.4, 0.08, M.clearGlass, cx, 4.15, -1.35);
    box(groups.bFloor1, 5.0, 1.4, 0.08, M.frostedGlass, cx, 2.25, -1.35);
    box(groups.bFloor1, 5.0, 0.34, 0.11, glassLogoMat, cx, 3.12, -1.35);
    box(groups.bFloor1, 0.25, 3.4, 0.3, M.woodCol, cx - 2.55, 3.22, -1.35);

    // Classroom interior partition walls & desks
    box(groups.bFloor1, 0.16, 3.4, 7.8, M.whiteTrim, cx - 2.65, 3.22, -5.3);
    const roomColors = [0x9333ea, 0x16a34a, 0x0284c7, 0xd97706, 0x0f766e, 0x4f46e5];
    box(groups.bFloor1, 4.9, 3.4, 0.16, new THREE.MeshStandardMaterial({ color: roomColors[i] }), cx, 3.22, -9.15);
    // Desks inside each classroom
    for (let dx = -1.4; dx <= 1.4; dx += 1.4) {
      for (let dz = -7.2; dz <= -3.2; dz += 1.6) {
        box(groups.bFloor1, 0.9, 0.06, 0.55, new THREE.MeshStandardMaterial({ color: i < 3 ? 0x84cc16 : 0xf59e0b }), cx + dx, 2.22, dz);
        box(groups.bFloor1, 0.8, 0.68, 0.45, new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }), cx + dx, 1.86, dz);
      }
    }
    if (i === 1) {
      tagZone(groups.bFloor1.children[groups.bFloor1.children.length - 1], '1-qavat vitraj sinflari (3 ta g‘arbiy qanot)', 'Har biri ~5.3 × 7.5 m (~40 m²)', '11-rasmda ko‘ringan vitraj shisha devorli, rangli partali boshlang‘ich sinfxonalar.');
    }
  });
  // North corridor wall (with whiteboard & classroom partitions behind)
  box(groups.bFloor1, 15.6, 3.4, 0.18, M.whiteTrim, -13.3, 3.22, 1.35);
  box(groups.bFloor1, 15.6, 3.4, 0.18, M.whiteTrim, 13.3, 3.22, 1.35);
  box(groups.bFloor1, 0.18, 3.4, 7.8, M.whiteTrim, -13.5, 3.22, 5.3);
  box(groups.bFloor1, 0.18, 3.4, 7.8, M.whiteTrim, 13.5, 3.22, 5.3);

  // ---- 2-QAVAT SLAB & INTERIOR (+5.25 m to +9.10 m) ----
  const f2Slab = extrudePlan(groups.bFloor2, 0.22, 5.15, M.whiteMarble);
  tagZone(f2Slab, '2-qavat (+5.25 m)', '856 m² (Shift 3.45 m)', 'Kutubxona (markazda), 2 ta IT xonasi (macOS, ChatGPT), Kimyo/Biologiya/Fizika laboratoriyalari va yuqori sinflar.');
  // Corridor & partitions on 2nd floor
  box(groups.bFloor2, 42.5, 3.45, 0.16, M.clearGlass, 0, 7.1, -1.35);
  box(groups.bFloor2, 15.6, 3.45, 0.16, M.whiteTrim, -13.3, 7.1, 1.35);
  box(groups.bFloor2, 15.6, 3.45, 0.16, M.whiteTrim, 13.3, 7.1, 1.35);
  // IT Lab #1 (macOS green wall) & IT Lab #2 (ChatGPT yellow wall)
  const macWall = box(groups.bFloor2, 7.2, 3.3, 0.2, new THREE.MeshStandardMaterial({ map: tex.macWall }), -17.5, 7.05, 8.8);
  tagZone(macWall, 'IT Laboratoriya #1 (macOS / Apple)', '~8.0 × 7.5 m (~60 m²)', 'Yashil Apple/macOS devorli, IMMER kompyuterli dasturlash xonasi.');
  const gptWall = box(groups.bFloor2, 7.2, 3.3, 0.2, new THREE.MeshStandardMaterial({ map: tex.gptWall }), -9.5, 7.05, 8.8);
  tagZone(gptWall, 'IT Laboratoriya #2 (ChatGPT / SMM)', '~8.0 × 7.5 m (~60 m²)', 'Sariq motivatsion devorli, IMMER monitorli IT va SMM xonasi.');
  // Computer desks in IT labs
  for (let ix = -20; ix <= -7; ix += 3.2) {
    for (let iz = 3.0; iz <= 7.2; iz += 2.0) {
      box(groups.bFloor2, 2.2, 0.06, 0.8, M.whiteTrim, ix, 6.1, iz);
      box(groups.bFloor2, 0.55, 0.36, 0.05, M.blackSteel, ix - 0.5, 6.38, iz);
      box(groups.bFloor2, 0.55, 0.36, 0.05, M.blackSteel, ix + 0.5, 6.38, iz);
    }
  }
  // Central Library (2nd floor portal)
  for (let bx = -4.2; bx <= 4.2; bx += 2.8) {
    box(groups.bFloor2, 1.8, 2.2, 0.45, M.whiteTrim, bx, 6.45, 7.5);
  }
  box(groups.bFloor2, 3.6, 0.06, 1.4, M.woodCol, 0, 6.1, 10.2);

  // ---- B BLOK EXTERIOR WALLS, PORTICO, 4+4 WINDOWS & PARAPET ----
  // Wing Front Cream Stucco & Dark Spandrel (Y = 1.45 to 9.10)
  function buildWingFacade(startX, dir) {
    // 4 vertical glass bays spaced ~3.20m apart across 13.285m wing
    for (let b = 0; b < 4; b++) {
      const cx = startX + dir * (1.8 + b * 3.15);
      // Cream pier between bays
      box(groups.bExterior, 1.65, 6.5, 0.42, M.stucco, cx - dir * 1.55, 4.7, 9.26);
      // Dark top spandrel band under parapet
      box(groups.bExterior, 3.25, 1.15, 0.44, M.charcoal, cx, 8.52, 9.26);
      // Vertical 2-story bronze glass window
      box(groups.bExterior, 1.42, 7.15, 0.22, M.bronzeGlass, cx, 5.2, 9.26);
      // Mullion dividers (white/gray frame + floor divider bar)
      box(groups.bExterior, 1.52, 0.14, 0.3, M.charcoal, cx, 5.25, 9.28);
      box(groups.bExterior, 0.1, 7.15, 0.3, M.whiteTrim, cx - 0.72, 5.2, 9.28);
      box(groups.bExterior, 0.1, 7.15, 0.3, M.whiteTrim, cx + 0.72, 5.2, 9.28);
    }
    // Outer corner cream pier
    box(groups.bExterior, 1.4, 6.5, 0.42, M.stucco, startX + dir * 12.6, 4.7, 9.26);
    // Wing dark charcoal parapet (+9.10 to +10.70 m)
    box(groups.bExterior, 13.35, 1.60, 0.52, M.parapet, startX + dir * 6.65, 9.90, 9.30);
    // AC outdoor units (from Photo 1)
    box(groups.bExterior, 0.75, 0.52, 0.32, M.acWhite, startX + dir * 3.35, 6.65, 9.58);
    box(groups.bExterior, 0.75, 0.52, 0.32, M.acWhite, startX + dir * 3.35, 4.55, 9.58);
  }
  buildWingFacade(-8.40, -1); // West Wing (4 bays)
  buildWingFacade(8.40, 1);   // East Wing (4 bays)

  // Central Projecting Semi-Octagonal Portal (Y = 1.45 to 11.35 m)
  // Front wall (X in [-5.32, 5.32], Z = 13.67)
  box(groups.bExterior, 2.2, 7.65, 0.44, M.charcoal, -4.22, 5.27, 13.45);
  box(groups.bExterior, 2.2, 7.65, 0.44, M.charcoal, 4.22, 5.27, 13.45);
  box(groups.bExterior, 6.24, 7.65, 0.40, M.stucco, 0, 5.27, 13.45);
  // Central entrance glass doors ("B blok")
  box(groups.bExterior, 4.6, 2.65, 0.25, M.bronzeGlass, 0, 2.78, 13.50);
  box(groups.bExterior, 0.65, 0.65, 0.05, new THREE.MeshStandardMaterial({ map: tex.doorB }), 0, 3.1, 13.64);
  // 2nd Floor 3-pane upper bronze window
  box(groups.bExterior, 3.2, 2.65, 0.25, M.bronzeGlass, 0, 7.3, 13.52);
  box(groups.bExterior, 0.08, 2.65, 0.3, M.charcoal, -0.53, 7.3, 13.54);
  box(groups.bExterior, 0.08, 2.65, 0.3, M.charcoal, 0.53, 7.3, 13.54);
  // Central taller parapet (+9.10 to +11.35 m)
  box(groups.bExterior, 10.72, 2.25, 0.52, M.parapet, 0, 10.22, 13.48);

  // Chamfered 45° corner walls + 2 tall vertical glass strips each (Photo 1 & 5)
  [-1, 1].forEach((s) => {
    const ang = -s * Math.atan2(4.2, 3.08);
    box(groups.bExterior, 5.25, 7.65, 0.44, M.charcoal, s * 6.86, 5.27, 11.57, 0, ang, 0);
    box(groups.bExterior, 5.30, 2.25, 0.52, M.parapet, s * 6.86, 10.22, 11.57, 0, ang, 0);
    // 2 vertical glass strips on chamfer
    [-0.75, 0.75].forEach((off) => {
      const lx = s * 6.86 + off * Math.cos(ang);
      const lz = 11.57 - off * Math.sin(ang);
      box(groups.bExterior, 0.85, 6.9, 0.48, M.bronzeGlass, lx, 5.1, lz, 0, ang, 0);
    });
  });

  // Entrance Portico Canopy, 2 White Columns, 9 Steps & Ramp (Photo 1)
  const portico = box(groups.bExterior, 10.80, 1.15, 3.45, M.whiteTrim, 0, 5.18, 15.38);
  tagZone(portico, 'Markaziy kirish portali (B blok)', '10.64 m kenglik · +11.35 m balandlik', '9 ta qora granit zina, pandus, 2 ta oq ustun va TURON ODOB-ILM XUSUSIY MAKTABI yozuvi.');
  box(groups.bExterior, 10.85, 0.25, 3.5, M.charcoal, 0, 5.88, 15.38);
  box(groups.bExterior, 0.44, 3.25, 0.44, M.whiteTrim, -4.90, 3.05, 16.82); // Left column
  box(groups.bExterior, 0.44, 3.25, 0.44, M.whiteTrim, 4.90, 3.05, 16.82);  // Right column
  // Signage plaques
  box(groups.bExterior, 8.6, 0.72, 0.08, new THREE.MeshStandardMaterial({ map: tex.signSub }), 0, 5.18, 17.13);
  box(groups.bExterior, 7.2, 0.82, 0.14, new THREE.MeshStandardMaterial({ map: tex.signMain }), 1.0, 6.45, 16.88);
  box(groups.bExterior, 1.45, 0.82, 0.12, new THREE.MeshStandardMaterial({ map: tex.emblem }), -3.75, 6.45, 16.88);

  // Porch Deck + 9 Granite Steps + West Ramp + Handrails
  box(groups.bExterior, 10.64, 1.45, 3.30, M.granite, 0, 0.725, 15.32);
  for (let st = 0; st < 9; st++) {
    const sh = 1.45 - st * (1.45 / 9);
    const sz = 16.97 + st * 0.30;
    box(groups.bExterior, 9.80, sh, 0.32, M.granite, 0, sh / 2, sz);
  }
  // White ramp on West (right when facing building = -X side!)
  // Wait: in Photo 1 facing the building, the ramp is on the RIGHT side of the stairs.
  // Looking South (-Z) from the road (+Z), RIGHT side of the photo is WEST (-X)! Let's verify: Photo 5 shows the West wing and flagpoles on the right when facing front! Yes: -X is West!
  const rampGeo = new THREE.BoxGeometry(1.1, 0.18, 2.95);
  const rampMesh = new THREE.Mesh(rampGeo, M.whiteTrim);
  rampMesh.position.set(-4.35, 0.76, 18.25);
  rampMesh.rotation.x = Math.atan2(1.45, 2.70);
  rampMesh.castShadow = true;
  groups.bExterior.add(rampMesh);
  // Stainless steel railings
  [-4.95, 4.95].forEach((rx) => {
    box(groups.bExterior, 0.05, 0.95, 3.0, M.steel, rx, 1.92, 15.3);
  });

  // West, East & South Exterior Walls
  // West Gable Wall (X = -21.46, Photo 5: central vertical 2-story stairwell window + SW glazed vestibule)
  box(groups.bExterior, 0.42, 7.65, 8.6, M.stucco, -21.47, 5.27, 5.15);
  box(groups.bExterior, 0.42, 7.65, 8.6, M.stucco, -21.47, 5.27, -5.15);
  box(groups.bExterior, 0.42, 1.15, 18.94, M.charcoal, -21.47, 8.52, 0);
  box(groups.bExterior, 0.44, 1.60, 18.94, M.parapet, -21.47, 9.90, 0);
  box(groups.bExterior, 0.25, 6.8, 1.65, M.bronzeGlass, -21.47, 5.1, 0); // West gable window
  // SW Glazed Exit Vestibule (Tamburlar, Photo 5 right bottom)
  box(groups.bExterior, 2.2, 2.8, 2.8, M.clearGlass, -22.55, 1.4, -7.2);
  box(groups.bExterior, 2.3, 0.2, 2.9, M.whiteTrim, -22.55, 2.85, -7.2);

  // East Wall + East 1-story Annex (Photo 2 & sat_verified)
  box(groups.bExterior, 0.42, 7.65, 18.94, M.stucco, 21.47, 5.27, 0);
  box(groups.bExterior, 0.44, 1.60, 18.94, M.parapet, 21.47, 9.90, 0);
  const eastAnnex = box(groups.bExterior, 5.7, 3.8, 9.0, M.stucco, 24.5, 1.9, -3.0);
  tagZone(eastAnnex, 'Sharqiy 1-qavatli qanot', '5.7 × 9.0 × 3.8 m (~51 m²)', '2-rasmda ko‘ringan 2 ta derazali qo‘shimcha ma’muriy/yordamchi qanot.');
  box(groups.bExterior, 5.8, 0.45, 9.1, M.charcoal, 24.5, 3.9, -3.0);
  box(groups.bExterior, 1.3, 1.2, 0.15, M.bronzeGlass, 23.6, 2.2, 1.52);
  box(groups.bExterior, 1.3, 1.2, 0.15, M.bronzeGlass, 25.4, 2.2, 1.52);

  // South (Rear) Facade (X in [-21.685, 21.685], Z = -9.26) — architectural window bays matching 2 floors
  box(groups.bExterior, 43.37, 7.65, 0.42, M.stucco, 0, 5.27, -9.26);
  box(groups.bExterior, 43.45, 1.60, 0.48, M.parapet, 0, 9.90, -9.26);
  for (let rx = -18.5; rx <= 18.5; rx += 5.25) {
    box(groups.bExterior, 1.6, 2.3, 0.22, M.bronzeGlass, rx, 3.2, -9.28);
    box(groups.bExterior, 1.6, 2.3, 0.22, M.bronzeGlass, rx, 6.9, -9.28);
  }

  // Roof Deck (B blok)
  extrudePlan(groups.bRoof, 0.25, 9.10, new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.9 }));

  // =========================================================
  // 3. INNOVATION HUB (West of Main Gate, Photos 4, 6, 7, 8, 9)
  // =========================================================
  // Position: X = -31.5 (width 11.0 m), Z = +22.0 (length 16.2 m along gate/driveway), facing East (+X)
  const hubX = -32.0, hubZ = 21.5; // Hub center
  const hubBase = box(groups.hubFloor1, 11.0, 0.2, 16.2, M.whiteMarble, hubX, 0.1, hubZ, 0, 0, 0, false);
  tagZone(hubBase, 'INNOVATION HUB (2 qavatli IT Markaz)', '16.2 × 11.0 × 7.2 m (~275 m² / ~1 280 m³)', '2026-yil 28-yanvarda ochilgan; konferens-zal, resepshn, qora metall zina va 2-qavat antresol IT sinfxona.');

  // Hub Exterior Shell (East face facing driveway X = hubX + 5.5 = -26.5)
  // South brick-plinth section (Z = hubZ + 4.0 to +8.1 -> closest to gate in Photo 6)
  box(groups.hubShell, 11.0, 0.65, 4.2, new THREE.MeshStandardMaterial({ map: tex.stoneBrick }), hubX, 0.325, hubZ + 6.0);
  box(groups.hubShell, 0.35, 6.55, 4.2, M.charcoal, hubX + 5.32, 3.92, hubZ + 6.0);
  // 1st floor 2-pane window & giant IT banner on top
  box(groups.hubShell, 0.2, 1.85, 1.65, M.bronzeGlass, hubX + 5.42, 1.9, hubZ + 6.0);
  box(groups.hubShell, 0.08, 3.2, 3.2, new THREE.MeshStandardMaterial({ map: tex.hubBanner }), hubX + 5.52, 4.9, hubZ + 6.0);
  // 3 Crimson-red & black curtain glass bays along East facade (Z = hubZ - 7.5 to +3.8)
  for (let b = 0; b < 3; b++) {
    const bz = hubZ + 2.0 - b * 3.85;
    box(groups.hubShell, 0.4, 6.2, 0.65, M.redAlu, hubX + 5.3, 3.1, bz + 1.8);
    box(groups.hubShell, 0.22, 6.0, 3.15, M.clearGlass, hubX + 5.32, 3.0, bz);
    box(groups.hubShell, 0.36, 1.15, 3.15, M.charcoal, hubX + 5.35, 3.55, bz); // Corrugated spandrel
  }
  box(groups.hubShell, 0.4, 6.2, 0.65, M.redAlu, hubX + 5.3, 3.1, hubZ - 7.75);
  // Hub Top Parapet + "INNOVATION HUB" sign
  box(groups.hubShell, 11.1, 1.0, 16.3, M.parapet, hubX, 6.70, hubZ);
  box(groups.hubShell, 0.14, 0.85, 8.8, new THREE.MeshStandardMaterial({ map: tex.signHub }), hubX + 5.56, 6.72, hubZ - 0.5);
  // Hub Back (West), North & South walls
  box(groups.hubShell, 0.35, 6.2, 16.2, M.charcoal, hubX - 5.32, 3.1, hubZ);
  box(groups.hubShell, 11.0, 6.2, 0.35, M.charcoal, hubX, 3.1, hubZ - 7.92);
  box(groups.hubShell, 11.0, 6.2, 0.35, M.charcoal, hubX, 3.1, hubZ + 7.92);

  // Hub Interior (Photos 7-9): Cream paneled walls, auditorium chairs, reception, steel stairs, 2F mezzanine!
  box(groups.hubFloor1, 0.2, 6.0, 15.6, M.hubCream, hubX - 5.1, 3.1, hubZ);
  box(groups.hubFloor1, 10.2, 6.0, 0.2, M.hubCream, hubX, 3.1, hubZ - 7.7);
  // Gray conference armchairs (5 rows × 6 chairs)
  const chairMat = new THREE.MeshStandardMaterial({ color: 0xb0b5ba, roughness: 0.8 });
  for (let rz = 0; rz < 5; rz++) {
    for (let cx = 0; cx < 6; cx++) {
      const chx = hubX - 3.6 + cx * 1.1 + (cx >= 3 ? 0.8 : 0);
      const chz = hubZ + 4.5 - rz * 1.5;
      box(groups.hubFloor1, 0.55, 0.45, 0.52, chairMat, chx, 0.35, chz);
      box(groups.hubFloor1, 0.55, 0.65, 0.14, chairMat, chx, 0.72, chz + 0.2);
    }
  }
  // Back Reception Desk (Z = hubZ - 5.2)
  box(groups.hubFloor1, 5.2, 1.05, 0.9, M.woodCol, hubX - 0.8, 0.62, hubZ - 5.0);
  // Black Steel Staircase along West wall (Photos 7 & 9)
  for (let st = 0; st < 12; st++) {
    box(groups.hubFloor1, 1.2, 0.08, 0.32, M.blackSteel, hubX - 4.4, 0.3 + st * 0.26, hubZ - 2.0 + st * 0.35);
  }
  // 2nd Floor Mezzanine Slab + Catwalk + Overhead Glass IT Classroom (Y = +3.35 m)
  box(groups.hubFloor2, 8.4, 0.24, 5.2, M.whiteTrim, hubX + 0.9, 3.35, hubZ - 5.2);
  box(groups.hubFloor2, 1.5, 0.24, 10.4, M.whiteTrim, hubX - 4.3, 3.35, hubZ + 2.4);
  box(groups.hubFloor2, 8.4, 2.7, 0.08, M.clearGlass, hubX + 0.9, 4.82, hubZ - 2.65);
  box(groups.hubFloor2, 8.4, 0.24, 0.1, glassLogoMat, hubX + 0.9, 4.75, hubZ - 2.62);
  box(groups.hubFloor2, 0.08, 0.95, 10.4, M.blackSteel, hubX - 3.6, 3.95, hubZ + 2.4); // Mezzanine railing
  // Hub Roof
  box(groups.hubRoof, 11.1, 0.25, 16.3, M.whiteTrim, hubX, 6.25, hubZ);

  // =========================================================
  // 4. SCALE VEHICLES (Orange VAZ-2106 & School Bus ISUZU)
  // =========================================================
  // Orange VAZ-2106 parked right beside stairs (Photo 1: 4.1 × 1.61 × 1.446 m!)
  const lada = new THREE.Group();
  const ladaOrange = new THREE.MeshStandardMaterial({ color: 0xe66418, roughness: 0.3, metalness: 0.2 });
  box(lada, 1.61, 0.62, 4.10, ladaOrange, 0, 0.56, 0);
  box(lada, 1.46, 0.62, 2.05, ladaOrange, 0, 1.13, -0.1); // Cabin up to 1.44 m!
  box(lada, 1.38, 0.50, 1.85, M.bronzeGlass, 0, 1.12, -0.1);
  [[-0.75, 1.28], [0.75, 1.28], [-0.75, -1.25], [0.75, -1.25]].forEach(([wx, wz]) => {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16), M.blackSteel);
    wh.rotation.z = Math.PI / 2;
    wh.position.set(wx, 0.28, wz);
    lada.add(wh);
  });
  lada.position.set(6.7, 0, 16.9);
  tagZone(lada.children[0], 'VAZ-2106 (1:1 Masshtab etaloni)', '4.10 × 1.61 × 1.446 m', '1-rasmda zinalar yonida turgan olovrang avtomobil: tom balandligi 1-qavat poli (1.45 m) bilan teng.');
  groups.cars.add(lada);

  // ISUZU NP37 School Bus (White + Blue/Yellow brand stripe, Photo 7058_4)
  const bus = new THREE.Group();
  box(bus, 2.35, 2.35, 7.2, M.whiteTrim, 0, 1.55, 0);
  box(bus, 2.38, 0.72, 7.22, new THREE.MeshStandardMaterial({ color: 0x0284c7 }), 0, 1.0, 0);
  box(bus, 2.38, 0.85, 5.8, M.bronzeGlass, 0, 2.15, -0.2);
  [[-1.12, 2.1], [1.12, 2.1], [-1.12, -2.0], [1.12, -2.0]].forEach(([wx, wz]) => {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 16), M.blackSteel);
    wh.rotation.z = Math.PI / 2;
    wh.position.set(wx, 0.42, wz);
    bus.add(wh);
  });
  bus.position.set(-14.0, 0, 23.5);
  bus.rotation.y = Math.PI / 2;
  groups.cars.add(bus);

  // =========================================================
  // 5. INTERIOR LIGHTS (Visible in Night / Evening mode)
  // =========================================================
  const interiorLights = [];
  [[0, 4.4, 7.0, 0x22c55e, 1.8], [0, 8.2, 6.0, 0xfff3d6, 1.5], [hubX, 5.6, hubZ, 0xfff3d6, 2.0]].forEach(([lx, ly, lz, col, inten]) => {
    const pl = new THREE.PointLight(col, inten, 24);
    pl.position.set(lx, ly, lz);
    scene.add(pl);
    interiorLights.push(pl);
  });

  return { groups, interactiveZones, animatedFlags, interiorLights };
}
