import * as THREE from 'three';

/**
 * Corrected Non-Mirrored Campus Coordinate System (1 unit = 1 meter):
 *   +Z = North (A-376 Highway, Front of BOTH B blok and Innovation Hub)
 *   -Z = South (Backyard + Yotoqxona Dormitory Complex)
 *   -X = East (Screen LEFT when facing school from road: 37-maktab side, Orange Lada, 1-story East Annex, Tashna fountain, Foye Ship)
 *   +X = West (Screen RIGHT when facing school from road: Ramp, 3 Flagpoles, Children's Stickers, Reception & Orange Wall, West Corridor, Open Gate, Innovation Hub!)
 */
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
    dormExterior: new THREE.Group(),
    dormFloor1: new THREE.Group(),
    dormFloor2: new THREE.Group(),
    dormRoof: new THREE.Group(),
    cars: new THREE.Group(),
  };

  Object.values(groups).forEach((g) => scene.add(g));
  const interactiveZones = [];
  const animatedFlags = [];

  const M = {
    stucco: new THREE.MeshStandardMaterial({ map: tex.stucco, roughness: 0.76, metalness: 0.04 }),
    charcoal: new THREE.MeshStandardMaterial({ color: 0x333940, roughness: 0.52, metalness: 0.25 }),
    parapet: new THREE.MeshStandardMaterial({ map: tex.parapet, roughness: 0.42, metalness: 0.35 }),
    hubCorrugated: new THREE.MeshStandardMaterial({ map: tex.hubCorrugated, roughness: 0.45, metalness: 0.4 }),
    granite: new THREE.MeshStandardMaterial({ map: tex.granite, roughness: 0.22, metalness: 0.16 }),
    whiteTrim: new THREE.MeshStandardMaterial({ color: 0xf4f5f7, roughness: 0.45 }),
    grayTrim: new THREE.MeshStandardMaterial({ color: 0xb0b5bc, roughness: 0.5 }),
    bronzeGlass: new THREE.MeshPhysicalMaterial({
      color: 0x45342b, roughness: 0.12, metalness: 0.28,
      transparent: true, opacity: 0.84
    }),
    clearGlass: new THREE.MeshPhysicalMaterial({
      color: 0xc2e6fa, roughness: 0.08, metalness: 0.1,
      transparent: true, opacity: 0.38
    }),
    frostedGlass: new THREE.MeshStandardMaterial({
      color: 0xdbe5ec, roughness: 0.48, transparent: true, opacity: 0.68
    }),
    whiteMarble: new THREE.MeshStandardMaterial({ map: tex.whiteMarble, roughness: 0.18, metalness: 0.08 }),
    blackMarble: new THREE.MeshStandardMaterial({ map: tex.blackMarble, roughness: 0.2, metalness: 0.1 }),
    woodCol: new THREE.MeshStandardMaterial({ color: 0xb9946b, roughness: 0.55 }),
    darkWood: new THREE.MeshStandardMaterial({ color: 0x4f3c2d, roughness: 0.55 }),
    orangeWall: new THREE.MeshStandardMaterial({ color: 0xf26522, roughness: 0.6 }),
    redAlu: new THREE.MeshStandardMaterial({ color: 0xb91c22, roughness: 0.32, metalness: 0.32 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xd4dbe2, roughness: 0.25, metalness: 0.85 }),
    blackSteel: new THREE.MeshStandardMaterial({ color: 0x1d2126, roughness: 0.38, metalness: 0.72 }),
    greenLed: new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.3 }),
    warmLed: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff8e7, emissiveIntensity: 1.1 }),
    hubCream: new THREE.MeshStandardMaterial({ color: 0xdcd5be, roughness: 0.65 }),
    dormMint: new THREE.MeshStandardMaterial({ color: 0x81d8d0, roughness: 0.7 }),
    dormCream: new THREE.MeshStandardMaterial({ color: 0xf0e1b9, roughness: 0.75 }),
    bunkTeal: new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.4, metalness: 0.4 }),
    carpet: new THREE.MeshStandardMaterial({ map: tex.carpet, roughness: 0.9 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x2d6b2d, roughness: 0.92 }),
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
  // 1. SITE & SURROUNDINGS (Larger campus scale)
  // =========================================================
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(280, 220), new THREE.MeshStandardMaterial({ color: 0x3b4439, roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(8, -0.05, 5);
  ground.receiveShadow = true;
  groups.site.add(ground);

  // Main courtyard paving (X in [-33, +32], Z in [-24, +33])
  const paveMat = new THREE.MeshStandardMaterial({ map: tex.bruschatka, roughness: 0.85 });
  const pave = box(groups.site, 66, 0.08, 58, paveMat, -0.5, -0.02, 4.5, 0, 0, 0, false);

  // Sidewalk & Parking apron north of fence (Z = +33.0 to +40.0) spanning both B blok & Innovation Hub!
  box(groups.site, 110, 0.06, 7.2, new THREE.MeshStandardMaterial({ color: 0x4b525a, roughness: 0.9 }), 10, -0.01, 36.6, 0, 0, 0, false);
  for (let px = -26; px <= 52; px += 3.4) {
    box(groups.site, 0.1, 0.02, 4.2, M.whiteTrim, px, 0.03, 37.2, 0, 0, 0, false);
  }
  // A-376 Highway (Z = +40.2 to +52.2)
  box(groups.site, 240, 0.05, 12.0, new THREE.MeshStandardMaterial({ map: tex.road, roughness: 0.85 }), 8, -0.02, 46.2, 0, 0, 0, false);

  // Front Fence along Z = +33.0 (East -32 to West gate +27.5; Gate opening at +27.5 to +33.0!)
  const klumbaMat = new THREE.MeshStandardMaterial({ map: tex.stoneBrick, roughness: 0.8 });
  box(groups.site, 59.5, 0.58, 0.58, klumbaMat, -2.25, 0.29, 33.8);
  for (let sx = -30.5; sx <= 26.5; sx += 2.3) {
    const bush = new THREE.Mesh(new THREE.SphereGeometry(0.40, 12, 10), M.tree);
    bush.position.set(sx, 0.78, 33.8);
    bush.castShadow = true;
    groups.site.add(bush);
  }
  // Fence pillars & real photo banners (East -31.5 to +27.0)
  const bMat1 = new THREE.MeshStandardMaterial({ map: tex.fenceBanner1, roughness: 0.55 });
  const bMat2 = new THREE.MeshStandardMaterial({ map: tex.fenceBanner2, roughness: 0.55 });
  for (let i = 0; i <= 11; i++) {
    const px = -31.5 + i * 5.3;
    box(groups.site, 0.48, 2.35, 0.48, M.stucco, px, 1.18, 33.0);
    box(groups.site, 0.58, 0.15, 0.58, M.charcoal, px, 2.38, 33.0);
    if (i < 11) {
      box(groups.site, 4.82, 0.36, 0.25, M.stucco, px + 2.65, 0.18, 33.0);
      box(groups.site, 4.82, 0.06, 0.06, M.blackSteel, px + 2.65, 2.02, 33.0);
      box(groups.site, 4.82, 0.06, 0.06, M.blackSteel, px + 2.65, 0.90, 33.0);
      if (i >= 7) {
        box(groups.site, 4.5, 1.55, 0.06, i % 2 === 0 ? bMat1 : bMat2, px + 2.65, 1.25, 33.04);
      }
    }
  }
  // Open West Gate leaf at +32.5 (Photo 4 right side, swinging inward next to Innovation Hub!)
  box(groups.site, 0.48, 2.5, 0.48, M.stucco, 32.8, 1.25, 33.0);
  box(groups.site, 0.12, 2.2, 4.2, M.charcoal, 32.8, 1.1, 30.8); // Open dark metal gate leaf

  // Side perimeter walls
  box(groups.site, 0.38, 2.4, 78, M.cinder, -33.0, 1.2, -5.0);
  box(groups.site, 0.38, 2.4, 78, M.cinder, 32.5, 1.2, -5.0);

  // Front Grass Lawns (East -16.8, West +16.8, Photos 1 & 5)
  [-16.8, 16.8].forEach((lx) => {
    box(groups.site, 13.6, 0.1, 4.5, M.grass, lx, 0.03, 14.2, 0, 0, 0, false);
    for (let px = lx - 6.4; px <= lx + 6.4; px += 4.2) {
      box(groups.site, 0.06, 0.9, 0.06, M.steel, px, 0.45, 16.4);
    }
    // Streetlight pole in lawn (Photo 1 & 5)
    box(groups.site, 0.1, 3.6, 0.1, M.grayTrim, lx + (lx > 0 ? 5.2 : -5.2), 1.8, 16.2);
    // Park bench
    box(groups.site, 1.9, 0.1, 0.55, M.woodCol, lx, 0.48, 13.0);
    box(groups.site, 1.9, 0.44, 0.08, M.woodCol, lx, 0.80, 12.75);
    // Shrubs
    for (let sx = -4.8; sx <= 4.8; sx += 3.2) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.45, 2.2, 10), M.tree);
      cone.position.set(lx + sx, 1.1, 13.4);
      cone.castShadow = true;
      groups.site.add(cone);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.48, 10, 8), M.tree);
      ball.position.set(lx + sx + 1.2, 0.48, 15.0);
      ball.castShadow = true;
      groups.site.add(ball);
    }
  });

  // 3 Tall Flagpoles ON WEST (+X, SCREEN RIGHT in Photo 1 & 5!)
  [tex.flagUZ, tex.flagUK, tex.flagRU].forEach((ft, idx) => {
    const fx = 11.8 + idx * 2.3, fz = 17.6;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 10.2, 10), M.steel);
    pole.position.set(fx, 5.1, fz);
    pole.castShadow = true;
    groups.site.add(pole);
    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 1.15, 10, 4),
      new THREE.MeshStandardMaterial({ map: ft, side: THREE.DoubleSide, roughness: 0.7 })
    );
    flag.position.set(fx + 1.05, 9.3, fz);
    groups.site.add(flag);
    animatedFlags.push(flag);
  });

  // Outdoor Washing Station (Tashna, Photo 2: ON EAST -X SIDE, screen left!)
  const tashna = new THREE.Group();
  box(tashna, 3.4, 1.8, 0.95, M.whiteMarble, 0, 0.9, 0);
  box(tashna, 3.45, 0.8, 1.35, M.whiteMarble, 0, 0.4, 0.22);
  box(tashna, 1.05, 0.52, 0.06, M.steel, 0, 1.3, 0.49);
  box(tashna, 0.09, 3.4, 0.09, M.charcoal, 1.8, 1.7, -0.3);
  tashna.position.set(-25.5, 0, 21.0);
  tashna.rotation.y = 0.32;
  tagZone(tashna.children[0], 'Tashqi qo‘l yuvish (Tashna)', '3.4 × 1.1 × 1.8 m', '2-rasmda chap tomonda ko‘ringan oq kafelli ikki jo‘mrakli yuvinish joyi.');
  groups.site.add(tashna);

  // Rear Backyard & Poplar trees (between B blok Z=-11 and Dormitory Z=-35)
  box(groups.site, 65, 0.05, 28, new THREE.MeshStandardMaterial({ color: 0x3b4837, roughness: 0.95 }), 0, -0.02, -25.0, 0, 0, 0, false);
  box(groups.site, 12.0, 0.04, 24.0, paveMat, 0, 0.01, -23.0, 0, 0, 0, false); // Walkway from B blok rear exit to Dormitory!
  for (let tz = -45; tz <= 5; tz += 6.0) {
    box(groups.site, 0.35, 3.2, 0.35, M.trunk, -35.0, 1.6, tz);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(1.8, 10.5, 8), M.tree);
    crown.position.set(-35.0, 8.2, tz);
    crown.castShadow = true;
    groups.site.add(crown);
  }

  // =========================================================
  // 2. MAIN SCHOOL BUILDING (B BLOK) — Enlarged 48.0 x 21.0 m, 12.30 m tall!
  //    With OPEN walkable doorways & working staircases!
  // =========================================================
  // Dimensions:
  //   X in [-24.0, +24.0] (48.0 m)
  //   Z in [-10.5, +10.5] (21.0 m)
  //   Portal: X in [-9.2, +9.2] tapering to [-6.0, +6.0] at Z = +15.1 m
  //   Levels: Tsokol (-1.80 -> +1.50m), 1-qavat (+1.50 -> +5.60m), 2-qavat (+5.60 -> +9.70m)
  //   Parapets: Wings +11.50 m, Portal +12.30 m
  const portalShape = new THREE.Shape();
  portalShape.moveTo(-24.0, -10.5);
  portalShape.lineTo(24.0, -10.5);
  portalShape.lineTo(24.0, 10.5);
  portalShape.lineTo(9.2, 10.5);
  portalShape.lineTo(6.0, 15.1);
  portalShape.lineTo(-6.0, 15.1);
  portalShape.lineTo(-9.2, 10.5);
  portalShape.lineTo(-24.0, 10.5);
  portalShape.closePath();

  function extrudePlan(parent, height, yBottom, mat) {
    const geo = new THREE.ExtrudeGeometry(portalShape, { depth: height, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.scale(1, 1, -1);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = yBottom;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // ---- TSOKOL (-1.80 m to +1.50 m) ----
  const tsokolSlab = extrudePlan(groups.bTsokol, 0.25, -1.80, M.charcoal);
  tagZone(tsokolSlab, 'Tsokol qavati (-1.80 m)', '48.0 × 21.0 m (1 060 m²)', 'Taekwondo zali, 500 o‘rinli oshxona va zina yo‘lagi.');

  // Granite Exterior Plinth (0.00 to +1.50 m)
  box(groups.bExterior, 14.8, 1.50, 0.48, M.granite, -16.6, 0.75, 10.26); // East wing plinth
  box(groups.bExterior, 14.8, 1.50, 0.48, M.granite, 16.6, 0.75, 10.26);  // West wing plinth
  box(groups.bExterior, 48.0, 1.50, 0.48, M.granite, 0, 0.75, -10.26);    // South plinth
  box(groups.bExterior, 0.48, 1.50, 21.0, M.granite, -23.76, 0.75, 0);    // East side plinth
  box(groups.bExterior, 0.48, 1.50, 21.0, M.granite, 23.76, 0.75, 0);     // West side plinth
  box(groups.bExterior, 12.0, 1.50, 0.48, M.granite, 0, 0.75, 14.86);     // Portal front plinth
  const chamAng = Math.atan2(4.6, 3.2);
  [-1, 1].forEach((s) => {
    box(groups.bExterior, 5.65, 1.50, 0.48, M.granite, s * 7.6, 0.75, 12.8, 0, -s * chamAng, 0);
  });

  // Basement windows in plinth
  [-21.8, -18.3, -14.8, -11.3, 11.3, 14.8, 18.3, 21.8].forEach((wx) => {
    box(groups.bExterior, 1.45, 0.56, 0.56, M.bronzeGlass, wx, 0.88, 10.26);
    box(groups.bExterior, 1.56, 0.66, 0.50, M.darkWood, wx, 0.88, 10.25);
  });

  // Tsokol Rooms: Taekwondo Hall (West +X side) & 500-seat Oshxona (East -X side)
  const tkFloor = box(groups.bTsokol, 21.0, 0.08, 10.4, new THREE.MeshStandardMaterial({ map: tex.tatami, roughness: 0.7 }), 12.5, -1.52, -4.4, 0, 0, 0, false);
  tagZone(tkFloor, 'Taekwondo / Sport zali (Tsokol)', '~21.0 × 10.4 m (~218 m²)', 'Qizil-ko‘k 1×1 m tatami to‘shalgan zal.');
  box(groups.bTsokol, 21.0, 2.95, 0.25, new THREE.MeshStandardMaterial({ color: 0x2563eb }), 12.5, -0.05, -9.8);
  box(groups.bTsokol, 0.38, 2.95, 0.38, new THREE.MeshStandardMaterial({ color: 0x22c55e }), 12.5, -0.05, -4.4);

  const oshFloor = box(groups.bTsokol, 18.0, 0.08, 11.8, M.whiteMarble, -11.0, -1.52, -3.8, 0, 0, 0, false);
  tagZone(oshFloor, '500 o‘rinli Oshxona (Tsokol)', '~18.0 × 11.8 m (~212 m²)', 'Pushti-yalpiz-oq devorlar, ko‘k ustunlar va marmar-ko‘k stollar.');
  box(groups.bTsokol, 18.0, 2.95, 0.25, new THREE.MeshStandardMaterial({ map: tex.oshxonaWall }), -11.0, -0.05, -9.8);
  const tableBlue = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
  for (let tx = -17.5; tx <= -4.5; tx += 4.2) {
    for (let tz = -7.5; tz <= 0.0; tz += 2.8) {
      box(groups.bTsokol, 2.3, 0.06, 0.95, M.whiteMarble, tx, -0.78, tz);
      box(groups.bTsokol, 2.1, 0.70, 0.78, tableBlue, tx, -1.16, tz);
    }
  }

  // ---- 1-QAVAT (+1.50 m to +5.60 m) — WITH OPEN WALKABLE DOORWAYS & STAIRS! ----
  const f1Slab = extrudePlan(groups.bFloor1, 0.22, 1.38, M.whiteMarble);
  tagZone(f1Slab, '1-qavat (+1.50 m)', '1 060 m² (Shift 3.80 m)', 'Keng foye, kema maketi, resepshn, vitraj shisha sinflar va ochiq eshiklar.');

  // Black marble strips
  box(groups.bFloor1, 0.65, 0.02, 14.5, M.blackMarble, -2.3, 1.62, 6.2, 0, 0, 0, false);
  box(groups.bFloor1, 0.65, 0.02, 14.5, M.blackMarble, 2.3, 1.62, 6.2, 0, 0, 0, false);
  for (let bx = -22.5; bx <= 22.5; bx += 3.5) {
    if (Math.abs(bx) > 3.5) box(groups.bFloor1, 0.65, 0.02, 2.9, M.blackMarble, bx, 1.62, 0, 0, 0, 0, false);
  }

  // Foye 4 wood-clad columns
  [[-4.8, 5.0], [4.8, 5.0], [-4.8, 10.2], [4.8, 10.2]].forEach(([cx, cz]) => {
    box(groups.bFloor1, 0.62, 3.8, 0.62, M.woodCol, cx, 3.5, cz);
  });

  // Wooden Sailing Ship Model on EAST (-X, left when entering South!) — Photo 10!
  const ship = new THREE.Group();
  box(ship, 0.60, 0.48, 2.6, M.woodCol, 0, 0.42, 0);
  [-0.7, 0, 0.7].forEach((mz) => {
    box(ship, 0.06, 2.1, 0.06, M.woodCol, 0, 1.45, mz);
    box(ship, 0.90, 0.48, 0.04, M.whiteTrim, 0, 1.15, mz);
    box(ship, 0.68, 0.42, 0.04, M.whiteTrim, 0, 1.82, mz);
  });
  ship.position.set(-4.6, 1.62, 11.8);
  groups.bFloor1.add(ship);

  // Reception Desk + Orange Accent Wall on WEST (+X, right when entering South!) — Photo 10 & 11!
  const recMesh = box(groups.bFloor1, 1.15, 1.08, 5.8, M.darkWood, 4.9, 2.14, 7.0);
  tagZone(recMesh, 'Markaziy Foye va Resepshn (1-qavat)', '12.0 × 17.5 m (~210 m²)', '10-rasmdagi oq-qora marmar pol, chapda kema maketi, o‘ngda rangli papkali resepshn va to‘q sariq devor.');
  [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e].forEach((fc, idx) => {
    box(groups.bFloor1, 0.35, 0.36, 4.8, new THREE.MeshStandardMaterial({ color: fc }), 5.6, 2.85 + idx * 0.44, 7.0);
  });
  box(groups.bFloor1, 0.25, 3.8, 6.2, M.orangeWall, 5.75, 3.5, 4.8);

  // Atlas draped valances & Green LED ceiling strips
  const atlasMat = new THREE.MeshStandardMaterial({ map: tex.atlas, side: THREE.DoubleSide, roughness: 0.7 });
  box(groups.bFloor1, 9.6, 0.68, 0.08, atlasMat, 0, 5.05, 10.2);
  box(groups.bFloor1, 9.6, 0.68, 0.08, atlasMat, 0, 5.05, 5.0);
  box(groups.bFloor1, 9.0, 0.06, 0.16, M.greenLed, 0, 5.36, 7.6);
  box(groups.bFloor1, 0.16, 0.06, 8.2, M.greenLed, -2.8, 5.36, 7.5);
  box(groups.bFloor1, 0.16, 0.06, 8.2, M.greenLed, 2.8, 5.36, 7.5);

  // Glass Classroom Corridor Partitions WITH OPEN WALKABLE DOORWAYS (South side Z = -1.55)
  const glassLogoMat = new THREE.MeshStandardMaterial({ map: tex.glassStripe, roughness: 0.4 });
  [-20.4, -14.2, -8.0, 8.0, 14.2, 20.4].forEach((cx, i) => {
    // Leave a 1.5m OPEN doorway on the left/right of each classroom bay so user can walk inside!
    box(groups.bFloor1, 4.2, 1.5, 0.08, M.clearGlass, cx - 0.75, 4.55, -1.55);
    box(groups.bFloor1, 4.2, 1.5, 0.08, M.frostedGlass, cx - 0.75, 2.45, -1.55);
    box(groups.bFloor1, 4.2, 0.36, 0.11, glassLogoMat, cx - 0.75, 3.38, -1.55);
    // Open doorway transom above (Y = 4.0 to 5.4)
    box(groups.bFloor1, 1.6, 1.4, 0.08, M.clearGlass, cx + 2.15, 4.7, -1.55);
    // Wood slat pillar
    box(groups.bFloor1, 0.28, 3.8, 0.32, M.woodCol, cx - 2.98, 3.5, -1.55);

    // Classroom dividing walls & back wall
    box(groups.bFloor1, 0.18, 3.8, 8.6, M.whiteTrim, cx - 3.08, 3.5, -6.0);
    const roomColors = [0x9333ea, 0x16a34a, 0x0284c7, 0xd97706, 0x0f766e, 0x4f46e5];
    if (i !== 2 && i !== 3) {
      box(groups.bFloor1, 5.8, 3.8, 0.18, new THREE.MeshStandardMaterial({ color: roomColors[i] }), cx, 3.5, -10.2);
    } else {
      // Leave central rear exit gap open between central classrooms!
      box(groups.bFloor1, 2.5, 3.8, 0.18, new THREE.MeshStandardMaterial({ color: roomColors[i] }), cx + (i === 2 ? -1.6 : 1.6), 3.5, -10.2);
    }
    // Student desks inside each classroom
    for (let dx = -1.6; dx <= 1.6; dx += 1.6) {
      for (let dz = -8.0; dz <= -3.8; dz += 1.8) {
        box(groups.bFloor1, 0.95, 0.06, 0.58, new THREE.MeshStandardMaterial({ color: i >= 3 ? 0x84cc16 : 0xf59e0b }), cx + dx, 2.34, dz);
        box(groups.bFloor1, 0.85, 0.70, 0.46, new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }), cx + dx, 1.96, dz);
      }
    }
    if (i === 4) {
      tagZone(groups.bFloor1.children[groups.bFloor1.children.length - 1], '1-qavat vitraj sinflari (G‘arbiy qanot)', 'Har biri ~6.1 × 8.6 m (~52 m²)', '11-rasmdagi ochiq eshikli shisha devorli boshlang‘ich sinflar (ichkariga kirib yurish mumkin!).');
    }
  });

  // North corridor wall (with open doorways into North classrooms & Stairwells at X = ±21.5)
  box(groups.bFloor1, 13.0, 3.8, 0.18, M.whiteTrim, -12.5, 3.5, 1.55);
  box(groups.bFloor1, 13.0, 3.8, 0.18, M.whiteTrim, 12.5, 3.5, 1.55);

  // WALKABLE INTERIOR STAIRCASES at West (+X = +21.5) and East (-X = -21.5)!
  [-21.8, 21.8].forEach((sx) => {
    // Steps up from 1F (+1.50) to 2F (+5.60): 16 steps from Z = +2.2 to +8.6
    for (let st = 0; st < 16; st++) {
      const sy = 1.62 + st * (4.10 / 16.0);
      const sz = 2.2 + st * 0.40;
      box(groups.bFloor1, 2.6, 0.14, 0.44, M.whiteMarble, sx, sy, sz);
    }
    // Steps down from 1F (+1.50) to Tsokol (-1.80): 13 steps from Z = -2.2 to -7.4
    for (let st = 0; st < 13; st++) {
      const sy = 1.40 - st * (3.30 / 13.0);
      const sz = -2.2 - st * 0.40;
      box(groups.bTsokol, 2.4, 0.14, 0.44, M.granite, sx, sy, sz);
    }
  });

  // ---- 2-QAVAT (+5.60 m to +9.70 m) WITH STAIRWELL CUTOUTS ----
  // Floor 2 slab with stairwell openings on far East/West ends (X in [-20.0, +20.0] solid + narrow south corridor)
  box(groups.bFloor2, 40.0, 0.22, 20.6, M.whiteMarble, 0, 5.50, 0);
  box(groups.bFloor2, 12.0, 0.22, 4.6, M.whiteMarble, 0, 5.50, 12.6);
  const f2Ref = box(groups.bFloor2, 3.6, 0.22, 10.6, M.whiteMarble, 21.8, 5.50, -5.0);
  box(groups.bFloor2, 3.6, 0.22, 10.6, M.whiteMarble, -21.8, 5.50, -5.0);
  tagZone(f2Ref, '2-qavat (+5.60 m)', '1 060 m² (Shift 3.80 m)', 'Kutubxona, macOS va ChatGPT IT laboratoriyalari, Kimyo/Biologiya/Fizika xonalari.');

  // 2F Corridor & IT Labs (on West +X side: macOS & ChatGPT!)
  box(groups.bFloor2, 44.0, 3.8, 0.16, M.clearGlass, 0, 7.5, -1.55);
  box(groups.bFloor2, 13.5, 3.8, 0.16, M.whiteTrim, 12.5, 7.5, 1.55);
  box(groups.bFloor2, 13.5, 3.8, 0.16, M.whiteTrim, -12.5, 7.5, 1.55);
  const macWall = box(groups.bFloor2, 7.8, 3.6, 0.2, new THREE.MeshStandardMaterial({ map: tex.macWall }), 18.0, 7.4, 10.0);
  tagZone(macWall, 'IT Laboratoriya #1 (macOS / Apple)', '~8.5 × 8.5 m', 'Yashil Apple/macOS devorli, IMMER kompyuterli IT xonasi.');
  const gptWall = box(groups.bFloor2, 7.8, 3.6, 0.2, new THREE.MeshStandardMaterial({ map: tex.gptWall }), 10.0, 7.4, 10.0);
  tagZone(gptWall, 'IT Laboratoriya #2 (ChatGPT / SMM)', '~8.5 × 8.5 m', 'Sariq ChatGPT/SMM devorli IT laboratoriyasi.');
  for (let ix = 8.0; ix <= 20.0; ix += 3.5) {
    for (let iz = 3.5; iz <= 8.0; iz += 2.2) {
      box(groups.bFloor2, 2.4, 0.06, 0.85, M.whiteTrim, ix, 6.45, iz);
      box(groups.bFloor2, 0.6, 0.38, 0.05, M.blackSteel, ix - 0.55, 6.75, iz);
      box(groups.bFloor2, 0.6, 0.38, 0.05, M.blackSteel, ix + 0.55, 6.75, iz);
    }
  }
  // Central Library (2F front portal)
  for (let bx = -4.5; bx <= 4.5; bx += 3.0) {
    box(groups.bFloor2, 2.0, 2.4, 0.5, M.whiteTrim, bx, 6.8, 8.5);
  }
  box(groups.bFloor2, 4.0, 0.06, 1.5, M.woodCol, 0, 6.45, 11.4);

  // ---- B BLOK EXTERIOR FACADE (Matched to Photo 1 & Photo 5!) ----
  function buildWingFacade(startX, dir) {
    const isWest = dir > 0; // +X is West (with children's stickers!)
    for (let b = 0; b < 4; b++) {
      const cx = startX + dir * (2.05 + b * 3.55);
      // Cream stucco pier
      box(groups.bExterior, 1.9, 7.0, 0.44, M.stucco, cx - dir * 1.78, 5.0, 10.28);
      // Stepped gray architectural trim framing pier & window bay (Photo 1!)
      box(groups.bExterior, 2.05, 0.16, 0.50, M.grayTrim, cx - dir * 1.78, 8.55, 10.30);
      box(groups.bExterior, 0.12, 7.8, 0.50, M.grayTrim, cx - 0.85, 5.4, 10.30);
      box(groups.bExterior, 0.12, 7.8, 0.50, M.grayTrim, cx + 0.85, 5.4, 10.30);
      // Dark top spandrel band under parapet
      box(groups.bExterior, 3.62, 1.18, 0.46, M.charcoal, cx, 9.11, 10.28);
      // Vertical 3-tier bronze glass strip
      box(groups.bExterior, 1.56, 7.75, 0.22, M.bronzeGlass, cx, 5.45, 10.28);
      if (isWest && b >= 1) {
        // Children's colorful cartoon decals on 1st-floor lower panes (Photo 1 & 5!)
        box(groups.bExterior, 1.52, 2.2, 0.24, new THREE.MeshStandardMaterial({ map: tex.kidsDecal, transparent: true, opacity: 0.9 }), cx, 2.7, 10.30);
      }
      // Horizontal mullions dividing 1F / 2F / transoms
      box(groups.bExterior, 1.66, 0.14, 0.30, M.charcoal, cx, 5.55, 10.32);
      box(groups.bExterior, 1.66, 0.10, 0.30, M.charcoal, cx, 3.75, 10.32);
      box(groups.bExterior, 1.66, 0.10, 0.30, M.charcoal, cx, 7.45, 10.32);
    }
    // Outer corner pier + wing parapet (+9.70 to +11.50 m)
    box(groups.bExterior, 1.6, 7.0, 0.44, M.stucco, startX + dir * 14.0, 5.0, 10.28);
    box(groups.bExterior, 14.85, 1.80, 0.54, M.parapet, startX + dir * 7.4, 10.60, 10.32);
    // AC outdoor units (Photo 1)
    box(groups.bExterior, 0.82, 0.55, 0.34, M.acWhite, startX + dir * 3.85, 7.2, 10.62);
    box(groups.bExterior, 0.82, 0.55, 0.34, M.acWhite, startX + dir * 3.85, 5.0, 10.62);
    box(groups.bExterior, 0.82, 0.55, 0.34, M.acWhite, startX + dir * 11.2, 7.2, 10.62);
  }
  buildWingFacade(-9.2, -1); // East Wing (Screen Left)
  buildWingFacade(9.2, 1);   // West Wing (Screen Right)

  // Central Portal (+1.50 to +12.30 m) WITH OPEN GLASS ENTRANCE DOORS!
  box(groups.bExterior, 2.5, 8.2, 0.46, M.charcoal, -4.75, 5.6, 14.88);
  box(groups.bExterior, 2.5, 8.2, 0.46, M.charcoal, 4.75, 5.6, 14.88);
  box(groups.bExterior, 7.0, 3.6, 0.42, M.stucco, 0, 7.9, 14.88); // 2F stucco wall around upper window
  // 1F entrance wall side piers + sidelights + OPEN 2.8m central doorway!
  box(groups.bExterior, 1.1, 3.4, 0.42, M.stucco, -2.95, 3.2, 14.88);
  box(groups.bExterior, 1.1, 3.4, 0.42, M.stucco, 2.95, 3.2, 14.88);
  // Open double glass doors swung inward (with "B blok" sticker!)
  box(groups.bExterior, 0.08, 2.55, 1.25, M.bronzeGlass, -1.35, 2.78, 14.25, 0, 0.25, 0);
  box(groups.bExterior, 0.08, 2.55, 1.25, M.bronzeGlass, 1.35, 2.78, 14.25, 0, -0.25, 0);
  box(groups.bExterior, 0.55, 0.55, 0.04, new THREE.MeshStandardMaterial({ map: tex.doorB }), 1.30, 3.05, 14.25, 0, -0.25, 0);
  // Entrance glass transom + 2 white digital posters beside door (Photo 1)
  box(groups.bExterior, 5.0, 0.65, 0.24, M.charcoal, 0, 4.35, 14.90);
  box(groups.bExterior, 1.1, 1.5, 0.08, M.whiteTrim, -2.15, 3.0, 15.15);
  box(groups.bExterior, 1.1, 1.5, 0.08, M.whiteTrim, 2.15, 3.0, 15.15);

  // 2F 3-pane upper bronze window + Taller central parapet (+9.70 to +12.30 m)
  box(groups.bExterior, 3.6, 2.9, 0.25, M.bronzeGlass, 0, 7.85, 14.94);
  box(groups.bExterior, 0.08, 2.9, 0.30, M.charcoal, -0.60, 7.85, 14.96);
  box(groups.bExterior, 0.08, 2.9, 0.30, M.charcoal, 0.60, 7.85, 14.96);
  box(groups.bExterior, 12.1, 2.60, 0.54, M.parapet, 0, 11.00, 14.90);

  // Chamfered 45° corners + 2 tall vertical glass strips each
  [-1, 1].forEach((s) => {
    const ang = -s * Math.atan2(4.6, 3.2);
    box(groups.bExterior, 5.65, 8.2, 0.46, M.charcoal, s * 7.6, 5.6, 12.8, 0, ang, 0);
    box(groups.bExterior, 5.70, 2.60, 0.54, M.parapet, s * 7.6, 11.00, 12.8, 0, ang, 0);
    [-0.82, 0.82].forEach((off) => {
      const lx = s * 7.6 + off * Math.cos(ang);
      const lz = 12.8 - off * Math.sin(ang);
      box(groups.bExterior, 0.92, 7.4, 0.50, M.bronzeGlass, lx, 5.3, lz, 0, ang, 0);
    });
  });

  // Entrance Portico Canopy, Columns, 9 White-Edged Granite Steps, Ramp on +X (West/Screen Right!)
  const portico = box(groups.bExterior, 12.2, 1.25, 3.85, M.whiteTrim, 0, 5.55, 17.02);
  tagZone(portico, 'Markaziy kirish portali (B blok)', '12.0 m eni · +12.30 m balandlik', '9 ta oq chiziqli granit zina, o‘ngda pandus, 2 ta oq ustun va ochiq B blok eshigi.');
  box(groups.bExterior, 12.25, 0.28, 3.90, M.charcoal, 0, 6.28, 17.02);
  box(groups.bExterior, 0.48, 3.5, 0.48, M.whiteTrim, -5.45, 3.25, 18.68);
  box(groups.bExterior, 0.48, 3.5, 0.48, M.whiteTrim, 5.45, 3.25, 18.68);
  // Signage plaques
  box(groups.bExterior, 9.6, 0.78, 0.08, new THREE.MeshStandardMaterial({ map: tex.signSub }), 0, 5.55, 18.98);
  box(groups.bExterior, 7.8, 0.88, 0.14, new THREE.MeshStandardMaterial({ map: tex.signMain }), 1.2, 6.92, 18.68);
  box(groups.bExterior, 1.6, 0.88, 0.12, new THREE.MeshStandardMaterial({ map: tex.emblem }), -4.1, 6.92, 18.68);

  // Porch Deck + 9 Steps with white nosing lines + Wheelchair Ramp on +X (Screen Right in Photo 1!)
  box(groups.bExterior, 12.0, 1.50, 3.70, M.granite, 0, 0.75, 16.95);
  for (let st = 0; st < 9; st++) {
    const sh = 1.50 - st * (1.50 / 9);
    const sz = 18.80 + st * 0.32;
    box(groups.bExterior, 11.0, sh, 0.34, M.granite, 0, sh / 2, sz);
    box(groups.bExterior, 9.6, 0.03, 0.05, M.whiteTrim, -0.6, sh + 0.01, sz + 0.14); // White step nosing edge (Photo 1 & 2!)
  }
  // White Ramp on +X side (Screen Right in Photo 1!)
  const rampMesh = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 3.15), M.whiteTrim);
  rampMesh.position.set(4.85, 0.78, 20.2);
  rampMesh.rotation.x = Math.atan2(1.50, 2.88);
  rampMesh.castShadow = true;
  groups.bExterior.add(rampMesh);
  // Stainless steel railings & 2 black trash bins
  [-5.55, 5.55].forEach((rx) => {
    box(groups.bExterior, 0.06, 0.95, 3.3, M.steel, rx, 1.98, 16.95);
    box(groups.bExterior, 0.42, 0.72, 0.42, M.blackSteel, rx, 0.36, 21.4);
  });

  // West (+X) Side Wall (Photo 5: central vertical stairwell window + SW glazed vestibule WITH OPEN DOOR!)
  box(groups.bExterior, 0.44, 8.2, 9.4, M.stucco, 23.78, 5.6, 5.8);
  box(groups.bExterior, 0.44, 8.2, 9.4, M.stucco, 23.78, 5.6, -5.8);
  box(groups.bExterior, 0.44, 1.2, 21.0, M.charcoal, 23.78, 9.1, 0);
  box(groups.bExterior, 0.46, 1.8, 21.0, M.parapet, 23.78, 10.6, 0);
  box(groups.bExterior, 0.25, 7.2, 1.85, M.bronzeGlass, 23.78, 5.4, 0);
  // SW Vestibule (Tamburlar) with open glass doorway
  box(groups.bExterior, 2.4, 3.0, 0.15, M.clearGlass, 25.0, 1.5, -5.8);
  box(groups.bExterior, 2.4, 3.0, 0.15, M.clearGlass, 25.0, 1.5, -8.8);
  box(groups.bExterior, 2.5, 0.22, 3.2, M.whiteTrim, 25.0, 3.05, -7.3);

  // East (-X) Side Wall + East 1-Story Annex (Photo 2, Screen Left!)
  box(groups.bExterior, 0.44, 8.2, 21.0, M.stucco, -23.78, 5.6, 0);
  box(groups.bExterior, 0.46, 1.8, 21.0, M.parapet, -23.78, 10.6, 0);
  const eastAnnex = box(groups.bExterior, 6.2, 4.1, 10.0, M.stucco, -27.1, 2.05, -3.5);
  tagZone(eastAnnex, 'Sharqiy 1-qavatli qanot', '6.2 × 10.0 × 4.1 m (~62 m²)', '2-rasmda chap tomonda ko‘ringan 2 derazali yordamchi/ma’muriy qanot.');
  box(groups.bExterior, 6.3, 0.5, 10.1, M.charcoal, -27.1, 4.25, -3.5);
  box(groups.bExterior, 1.4, 1.3, 0.15, M.bronzeGlass, -26.0, 2.35, 1.52);
  box(groups.bExterior, 1.4, 1.3, 0.15, M.bronzeGlass, -28.2, 2.35, 1.52);

  // South (Rear) Facade WITH OPEN REAR DOOR TO YOTOQXONA COURTYARD!
  box(groups.bExterior, 22.0, 8.2, 0.44, M.stucco, -13.0, 5.6, -10.28);
  box(groups.bExterior, 22.0, 8.2, 0.44, M.stucco, 13.0, 5.6, -10.28);
  box(groups.bExterior, 4.0, 4.8, 0.44, M.stucco, 0, 7.3, -10.28); // Above rear courtyard exit
  box(groups.bExterior, 48.1, 1.80, 0.50, M.parapet, 0, 10.60, -10.30);
  for (let rx = -20.5; rx <= 20.5; rx += 5.8) {
    if (Math.abs(rx) > 2.5) {
      box(groups.bExterior, 1.8, 2.5, 0.22, M.bronzeGlass, rx, 3.4, -10.30);
      box(groups.bExterior, 1.8, 2.5, 0.22, M.bronzeGlass, rx, 7.3, -10.30);
    }
  }
  // Rear exit steps down to backyard (-Z = -10.5 to -13.5)
  for (let st = 0; st < 7; st++) {
    const sh = 1.50 - st * (1.50 / 7);
    box(groups.bExterior, 4.2, sh, 0.38, M.granite, 0, sh / 2, -10.7 - st * 0.38);
  }

  // B blok Roof Deck
  extrudePlan(groups.bRoof, 0.28, 9.70, new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.9 }));

  // =========================================================
  // 3. INNOVATION HUB — ON THE OTHER SIDE (+X, BEYOND GATE), FACING NORTH (+Z, STREET!)
  //    Matched 100% to Photo 4 & Photo 6–9!
  // =========================================================
  // Position: X in [+34.0, +52.0] (18.0 m wide along A-376 street!), Z in [+20.0, +32.5] (12.5 m deep)
  // Front facade at Z = +32.5 facing NORTH (+Z) directly toward A-376!
  const hubX = 43.0, hubZ = 26.25;
  const hubBase = box(groups.hubFloor1, 18.0, 0.22, 12.5, M.whiteMarble, hubX, 0.11, hubZ, 0, 0, 0, false);
  tagZone(hubBase, 'INNOVATION HUB (2 qavat, ko‘chaga qaragan)', '18.0 × 12.5 × 7.8 m (~310 m² / ~1 755 m³)', '4- va 6-rasmdagidek darvozaning nargi tarafida, A-376 ko‘chasiga qarab turgan 2 qavatli zamonaviy IT markaz.');

  // Hub Front Facade (Z = +32.5, East-to-West: +34.0 to +52.0):
  // Left section closest to school gate (+34.0 to +38.8 m = 4.8 m wide): Brick plinth + Charcoal + 2-pane window + Real IT Banner!
  box(groups.hubShell, 4.8, 0.72, 0.42, new THREE.MeshStandardMaterial({ map: tex.stoneBrick }), 36.4, 0.36, 32.35);
  box(groups.hubShell, 4.8, 6.08, 0.38, M.charcoal, 36.4, 3.76, 32.35);
  box(groups.hubShell, 1.8, 2.0, 0.24, M.clearGlass, 36.4, 2.05, 32.38);
  box(groups.hubShell, 1.96, 0.14, 0.28, M.grayTrim, 36.4, 3.10, 32.38);
  box(groups.hubShell, 1.96, 0.14, 0.28, M.grayTrim, 36.4, 1.02, 32.38);
  // Real cropped "IT SOHASI BIZ BILAN OSON!" banner + AC unit (Photo 6!)
  box(groups.hubShell, 3.4, 3.4, 0.08, new THREE.MeshStandardMaterial({ map: tex.hubBanner }), 36.4, 5.15, 32.58);
  box(groups.hubShell, 0.85, 0.58, 0.35, M.acWhite, 38.0, 2.95, 32.72);

  // Right section (+38.8 to +52.0 m): 4 Crimson-Red Alucobond columns + 3 Tall Curtain Glass Bays!
  for (let b = 0; b < 4; b++) {
    const rx = 39.0 + b * 4.25;
    box(groups.hubShell, 0.68, 6.8, 0.45, M.redAlu, rx, 3.4, 32.35);
    if (b < 3) {
      const gx = rx + 2.125;
      // 2nd floor glass + black corrugated spandrel
      box(groups.hubShell, 3.55, 2.4, 0.20, M.clearGlass, gx, 5.4, 32.35);
      box(groups.hubShell, 3.58, 1.25, 0.38, M.hubCorrugated, gx, 3.6, 32.38);
      if (b === 0) {
        // Bay 1 has OPEN entrance glass doors! (1.5m open gap on right half of bay!)
        box(groups.hubShell, 1.75, 2.95, 0.20, M.clearGlass, gx - 0.88, 1.5, 32.35);
      } else {
        box(groups.hubShell, 3.55, 2.95, 0.20, M.clearGlass, gx, 1.5, 32.35);
      }
    }
  }
  // Hub Top Parapet + "INNOVATION HUB" Sign (facing North +Z street!)
  box(groups.hubShell, 18.1, 1.05, 12.6, M.parapet, hubX, 7.28, hubZ);
  box(groups.hubShell, 10.5, 0.90, 0.14, new THREE.MeshStandardMaterial({ map: tex.signHub }), 45.2, 7.30, 32.60);
  // Hub East (gate-side, seen in Photo 4), West & South walls
  box(groups.hubShell, 0.38, 6.8, 12.5, M.charcoal, 34.18, 3.4, hubZ);
  box(groups.hubShell, 0.38, 6.8, 12.5, M.charcoal, 51.82, 3.4, hubZ);
  box(groups.hubShell, 18.0, 6.8, 0.38, M.charcoal, hubX, 3.4, 20.18);

  // Hub Interior (Walkable 1F Conference Hall + Reception + Black Steel Stairs + 2F Mezzanine IT Room!)
  box(groups.hubFloor1, 17.3, 6.6, 0.2, M.hubCream, hubX, 3.4, 20.42);
  box(groups.hubFloor1, 0.2, 6.6, 11.8, M.hubCream, 51.55, 3.4, hubZ);
  // Gray padded auditorium armchairs (5 rows × 6 chairs facing back Reception)
  const chairMat = new THREE.MeshStandardMaterial({ color: 0xb0b5ba, roughness: 0.8 });
  for (let rz = 0; rz < 5; rz++) {
    for (let cx = 0; cx < 6; cx++) {
      const chx = 40.5 + cx * 1.25 + (cx >= 3 ? 0.9 : 0);
      const chz = 29.8 - rz * 1.4;
      box(groups.hubFloor1, 0.58, 0.45, 0.54, chairMat, chx, 0.42, chz);
      box(groups.hubFloor1, 0.58, 0.65, 0.14, chairMat, chx, 0.78, chz + 0.22);
    }
  }
  // Back Reception Desk (Z = 22.0)
  box(groups.hubFloor1, 5.6, 1.08, 0.95, M.woodCol, 43.0, 0.75, 22.0);
  // Black Steel Staircase along West wall (X = 50.6, Z = 28.0 going South to Z = 23.0!)
  for (let st = 0; st < 14; st++) {
    box(groups.hubFloor1, 1.4, 0.08, 0.34, M.blackSteel, 50.6, 0.35 + st * (3.30 / 14), 28.5 - st * 0.36);
  }
  // 2nd Floor Mezzanine Slab (Y = +3.65 m) + Catwalk + Overhead Glass IT Classroom (with open doorway!)
  box(groups.hubFloor2, 13.5, 0.24, 4.8, M.whiteTrim, 42.5, 3.65, 22.6);
  box(groups.hubFloor2, 1.8, 0.24, 7.6, M.whiteTrim, 50.5, 3.65, 28.6);
  // Glass partition on mezzanine (with open 1.4m doorway at X = 48.2)
  box(groups.hubFloor2, 11.4, 2.9, 0.08, M.clearGlass, 41.5, 5.2, 24.95);
  box(groups.hubFloor2, 11.4, 0.24, 0.1, new THREE.MeshStandardMaterial({ map: tex.glassStripe }), 41.5, 5.1, 24.97);
  box(groups.hubFloor2, 0.08, 0.95, 7.6, M.blackSteel, 49.65, 4.25, 28.6); // Mezzanine railing
  // Hub Roof
  box(groups.hubRoof, 18.1, 0.26, 12.6, M.whiteTrim, hubX, 6.75, hubZ);

  // =========================================================
  // 4. REAR DORMITORY BUILDING (YOTOQXONA KORPUSI — South Back Courtyard!)
  //    46.0 x 11.0 x 7.8 m (2 stories, walkable rooms with bunk beds!)
  // =========================================================
  // Z in [-46.0, -35.0], X in [-23.0, +23.0], facing North (+Z) toward B blok across courtyard!
  const dormZ = -40.5;
  const dormFloorSlab = box(groups.dormFloor1, 46.0, 0.45, 11.0, M.whiteMarble, 0, 0.225, dormZ, 0, 0, 0, false);
  tagZone(dormFloorSlab, 'Yotoqxona korpusi (144 o‘rinli, Orqa bino)', '46.0 × 11.0 × 7.8 m (2 qavat)', 'Asosiy bino orqasidagi hovliga qaragan 2 qavatli yotoqxona: firuza devorli 4 o‘rinli xonalar (2 tadan ikki qavatli karavot) va kechki dars zali.');

  // Dormitory Exterior (Cream-yellow stucco, granite plinth, dark charcoal parapet, open courtyard entrance!)
  box(groups.dormExterior, 46.0, 0.65, 11.0, M.granite, 0, 0.325, dormZ);
  // Front wall facing courtyard (+Z = -35.0) with OPEN central & side doorways
  box(groups.dormExterior, 20.8, 6.8, 0.35, M.dormCream, -12.6, 3.85, -35.15);
  box(groups.dormExterior, 20.8, 6.8, 0.35, M.dormCream, 12.6, 3.85, -35.15);
  box(groups.dormExterior, 4.4, 3.8, 0.35, M.dormCream, 0, 5.35, -35.15); // Over central open doorway!
  // Back & side walls
  box(groups.dormExterior, 46.0, 6.8, 0.35, M.dormCream, 0, 3.85, -45.82);
  box(groups.dormExterior, 0.35, 6.8, 11.0, M.dormCream, -22.82, 3.85, dormZ);
  box(groups.dormExterior, 0.35, 6.8, 11.0, M.dormCream, 22.82, 3.85, dormZ);
  // Dormitory windows + Parapet
  for (let wx = -20.0; wx <= 20.0; wx += 5.0) {
    if (Math.abs(wx) > 2.2) {
      box(groups.dormExterior, 1.8, 1.5, 0.22, M.clearGlass, wx, 2.1, -35.12);
      box(groups.dormExterior, 1.8, 1.5, 0.22, M.clearGlass, wx, 5.4, -35.12);
    }
  }
  box(groups.dormExterior, 46.2, 0.95, 11.2, M.parapet, 0, 7.65, dormZ);
  box(groups.dormRoof, 46.0, 0.25, 11.0, M.whiteTrim, 0, 7.25, dormZ);

  // Dormitory Interior (1F & 2F Corridors + Furnished 4-Bed Rooms, matched to tg_7058_5.jpg!)
  box(groups.dormFloor2, 45.4, 0.22, 10.4, M.whiteMarble, 0, 3.85, dormZ);
  function populateDormLevel(parent, baseY) {
    // Central corridor (Z = -39.5..-37.5) with rooms on South side (-45.5..-39.5) and Study rooms on North side (-37.5..-35.3)
    for (let rx = -19.5; rx <= 19.5; rx += 6.5) {
      // Room dividing walls & front corridor wall with OPEN 1.2m door!
      box(parent, 0.16, 3.1, 6.0, M.dormMint, rx - 3.2, baseY + 1.55, -42.7);
      box(parent, 4.9, 3.1, 0.16, M.dormMint, rx - 0.65, baseY + 1.55, -39.7);
      // Carpet
      box(parent, 3.4, 0.03, 3.6, M.carpet, rx, baseY + 0.02, -42.8, 0, 0, 0, false);
      // 2 Turquoise 2-tier Bunk Beds in L-configuration (tg_7058_5.jpg!)
      // Bed 1 along back wall
      box(parent, 2.0, 1.75, 0.95, M.bunkTeal, rx - 1.6, baseY + 0.9, -44.8);
      box(parent, 1.85, 0.16, 0.85, M.whiteTrim, rx - 1.6, baseY + 0.55, -44.8);
      box(parent, 1.85, 0.16, 0.85, M.whiteTrim, rx - 1.6, baseY + 1.45, -44.8);
      // Bed 2 along side wall
      box(parent, 0.95, 1.75, 2.0, M.bunkTeal, rx + 2.2, baseY + 0.9, -43.5);
      box(parent, 0.85, 0.16, 1.85, M.whiteTrim, rx + 2.2, baseY + 0.55, -43.5);
      box(parent, 0.85, 0.16, 1.85, M.whiteTrim, rx + 2.2, baseY + 1.45, -43.5);
      // Wardrobe
      box(parent, 0.9, 1.9, 0.6, M.woodCol, rx - 2.3, baseY + 0.95, -41.2);
    }
  }
  populateDormLevel(groups.dormFloor1, 0.45);
  populateDormLevel(groups.dormFloor2, 3.96);

  // =========================================================
  // 5. SCALE VEHICLES (Orange VAZ-2106 on EAST -X = screen left in Photo 1!)
  // =========================================================
  const lada = new THREE.Group();
  const ladaOrange = new THREE.MeshStandardMaterial({ color: 0xe66418, roughness: 0.3, metalness: 0.2 });
  box(lada, 1.61, 0.62, 4.10, ladaOrange, 0, 0.56, 0);
  box(lada, 1.46, 0.62, 2.05, ladaOrange, 0, 1.13, -0.1);
  box(lada, 1.38, 0.50, 1.85, M.bronzeGlass, 0, 1.12, -0.1);
  [[-0.75, 1.28], [0.75, 1.28], [-0.75, -1.25], [0.75, -1.25]].forEach(([wx, wz]) => {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16), M.blackSteel);
    wh.rotation.z = Math.PI / 2;
    wh.position.set(wx, 0.28, wz);
    lada.add(wh);
  });
  lada.position.set(-7.3, 0, 18.8); // East (-X) = Screen Left of stairs, exact Photo 1 position!
  tagZone(lada.children[0], 'VAZ-2106 (1:1 Masshtab etaloni)', '4.10 × 1.61 × 1.446 m', '1-rasmdagi chap tomonda turgan olovrang avtomobil.');
  groups.cars.add(lada);

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
  bus.position.set(14.5, 0, 26.5);
  bus.rotation.y = Math.PI / 2;
  groups.cars.add(bus);

  // =========================================================
  // 6. INTERIOR LIGHTS
  // =========================================================
  const interiorLights = [];
  [[0, 4.8, 7.5, 0x22c55e, 1.8], [0, 8.8, 6.0, 0xfff3d6, 1.6], [hubX, 6.0, hubZ, 0xfff3d6, 2.2], [0, 3.2, dormZ, 0xfff3d6, 1.4]].forEach(([lx, ly, lz, col, inten]) => {
    const pl = new THREE.PointLight(col, inten, 28);
    pl.position.set(lx, ly, lz);
    scene.add(pl);
    interiorLights.push(pl);
  });

  return { groups, interactiveZones, animatedFlags, interiorLights };
}
