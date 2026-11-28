import * as THREE from 'three';

/**
 * Corrected Non-Mirrored Campus Coordinate System (1 unit = 1 meter):
 *   +Z = North (A-376 Highway, Front of BOTH B blok and Innovation Hub)
 *   -Z = South (Back Garden, Qozonxona, 3 Gazebos, Open Walkway, Turnik, 2 N-S Yotoqxona Wings + 2 E-W Twin Boys' Yotoqxona Wings with Gulzor, Plain Dirt Field)
 *   -X = East (Screen LEFT facing school: 37-maktab, Evrozabor, Oshxona Podvol Wing, Tashna, Orange Lada, 1F East Annex, Foye Ship)
 *   +X = West (Screen RIGHT facing school: Ramp, 3 Flagpoles, Reception, Open Gate, Innovation Hub, Sportzal Podvol Wing, Twin Yotoqxona Complex)
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
    taupeTrim: new THREE.MeshStandardMaterial({ color: 0xd8cfbe, roughness: 0.68 }),
    charcoal: new THREE.MeshStandardMaterial({ color: 0x333940, roughness: 0.52, metalness: 0.25 }),
    podvolWall: new THREE.MeshStandardMaterial({ color: 0x585c60, roughness: 0.65 }),
    limeGreen: new THREE.MeshStandardMaterial({ color: 0x45c438, roughness: 0.55 }),
    parapet: new THREE.MeshStandardMaterial({ map: tex.parapet, roughness: 0.42, metalness: 0.35 }),
    hubCorrugated: new THREE.MeshStandardMaterial({ map: tex.hubCorrugated, roughness: 0.45, metalness: 0.4 }),
    granite: new THREE.MeshStandardMaterial({ map: tex.granite, roughness: 0.22, metalness: 0.16 }),
    whiteTrim: new THREE.MeshStandardMaterial({ color: 0xf4f5f7, roughness: 0.45 }),
    grayTrim: new THREE.MeshStandardMaterial({ color: 0xb0b5bc, roughness: 0.5 }),
    bronzeGlass: new THREE.MeshPhysicalMaterial({
      color: 0x1e293b, roughness: 0.08, metalness: 0.42,
      envMapIntensity: 1.45, reflectivity: 0.9,
      transparent: true, opacity: 0.88
    }),
    clearGlass: new THREE.MeshPhysicalMaterial({
      color: 0xc2e6fa, roughness: 0.08, metalness: 0.12,
      envMapIntensity: 1.35,
      transparent: true, opacity: 0.36
    }),
    frostedGlass: new THREE.MeshStandardMaterial({
      color: 0xdbe5ec, roughness: 0.48, transparent: true, opacity: 0.68
    }),
    whiteMarble: new THREE.MeshStandardMaterial({ map: tex.whiteMarble, roughness: 0.18, metalness: 0.08 }),
    blackMarble: new THREE.MeshStandardMaterial({ map: tex.blackMarble, roughness: 0.2, metalness: 0.1 }),
    podvolFloor: new THREE.MeshStandardMaterial({ map: tex.podvolFloor, roughness: 0.22, metalness: 0.08 }),
    woodCol: new THREE.MeshStandardMaterial({ color: 0xb9946b, roughness: 0.55 }),
    darkWood: new THREE.MeshStandardMaterial({ color: 0x4f3c2d, roughness: 0.55 }),
    beechDesk: new THREE.MeshStandardMaterial({ color: 0xe5dcc8, roughness: 0.5 }),
    orangeWall: new THREE.MeshStandardMaterial({ color: 0xf26522, roughness: 0.6 }),
    coralWall: new THREE.MeshStandardMaterial({ color: 0xeb7c52, roughness: 0.65 }),
    mintPanel: new THREE.MeshStandardMaterial({ color: 0x9ad47c, roughness: 0.65 }),
    ceilTriangle: new THREE.MeshStandardMaterial({ color: 0x5eb857, roughness: 0.5 }),
    powderBlue: new THREE.MeshStandardMaterial({ color: 0x74a4bf, roughness: 0.55 }),
    royalBlue: new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.45 }),
    tkLimeBeam: new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.45 }),
    orangeBars: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.38, metalness: 0.45 }),
    redAlu: new THREE.MeshStandardMaterial({ color: 0xb91c22, roughness: 0.32, metalness: 0.32 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xd8dfe6, roughness: 0.24, metalness: 0.86 }),
    blackSteel: new THREE.MeshStandardMaterial({ color: 0x1d2126, roughness: 0.38, metalness: 0.72 }),
    wroughtIron: new THREE.MeshStandardMaterial({ color: 0x3b2820, roughness: 0.45, metalness: 0.6 }),
    greenLed: new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.3 }),
    warmLed: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff8e7, emissiveIntensity: 1.25 }),
    hubCream: new THREE.MeshStandardMaterial({ color: 0xdcd5be, roughness: 0.65 }),
    dormMint: new THREE.MeshStandardMaterial({ color: 0x81d8d0, roughness: 0.7 }),
    goldenOchre: new THREE.MeshStandardMaterial({ color: 0xdfa84e, roughness: 0.72 }),
    dormCream: new THREE.MeshStandardMaterial({ color: 0xede3cc, roughness: 0.75 }),
    bunkTeal: new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.4, metalness: 0.4 }),
    carpet: new THREE.MeshStandardMaterial({ map: tex.carpet, roughness: 0.9 }),
    grass: new THREE.MeshStandardMaterial({ map: tex.grassTex, roughness: 0.90 }),
    redTape: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 }),
    flowerPink: new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.75 }),
    flowerGold: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.75 }),
    tree: new THREE.MeshStandardMaterial({ color: 0x255326, roughness: 0.86 }),
    treeMid: new THREE.MeshStandardMaterial({ color: 0x2f682f, roughness: 0.86 }),
    treeLight: new THREE.MeshStandardMaterial({ color: 0x3d7a39, roughness: 0.86 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.92 }),
    cinder: new THREE.MeshStandardMaterial({ color: 0x94999f, roughness: 0.9 }),
    acWhite: new THREE.MeshStandardMaterial({ color: 0xe8eaed, roughness: 0.4 }),
    yellowGas: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.25 }),
    evrozabor: new THREE.MeshStandardMaterial({ map: tex.evrozabor, roughness: 0.88 }),
    dirtField: new THREE.MeshStandardMaterial({ map: tex.dirtField, roughness: 0.95 }),
    silverRoof: new THREE.MeshStandardMaterial({ map: tex.silverRoof, roughness: 0.34, metalness: 0.52, side: THREE.DoubleSide }),
    slateRoof: new THREE.MeshStandardMaterial({ map: tex.slateRoof, roughness: 0.38, metalness: 0.48 }),
    neighborPitch: new THREE.MeshStandardMaterial({ map: tex.neighborPitch, roughness: 0.88 }),
    batutBlue: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.42 }),
    batutRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.42 }),
    batutYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.42 }),
    canopyBlue: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.55 }),
    parkWood: new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.7 }),
    gazeboRoof: new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.6 }),
    gazeboMesh: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.85, transparent: true, opacity: 0.72, side: THREE.DoubleSide }),
    shirinKulcha: new THREE.MeshStandardMaterial({ map: tex.shirinKulcha, roughness: 0.35 }),
    fireCabinet: new THREE.MeshStandardMaterial({ map: tex.fireCabinet, roughness: 0.4 }),
    concretePath: new THREE.MeshStandardMaterial({ color: 0xa6acb2, roughness: 0.86 }),
    stairWall: new THREE.MeshStandardMaterial({ map: tex.stairWall, roughness: 0.65 }),
    origamiWall: new THREE.MeshStandardMaterial({ map: tex.corridorOrigami, roughness: 0.68 }),
    oshWall: new THREE.MeshStandardMaterial({ map: tex.oshxonaWall, roughness: 0.65 }),
    oshMural: new THREE.MeshStandardMaterial({ map: tex.oshxonaBackMural, roughness: 0.65 }),
    tkMural: new THREE.MeshStandardMaterial({ map: tex.taekwondoMural, roughness: 0.55 }),
    tatamiMat: new THREE.MeshStandardMaterial({ map: tex.tatami, roughness: 0.65 }),
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

  function addPoplar(parent, x, z, h = 12.2, seed = 0) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);
    const trunkH = h * 0.36;
    const tMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, trunkH, 7), M.trunk);
    tMesh.position.y = trunkH / 2;
    tMesh.castShadow = true;
    grp.add(tMesh);
    const leafMats = [M.tree, M.treeMid, M.treeLight];
    [
      [0.38, 1.55, 0.30, 0.0, 0.14],
      [0.54, 1.48, 0.42, 0.24, -0.10],
      [0.72, 1.32, 0.55, -0.18, 0.16],
      [0.88, 1.05, 0.65, 0.10, -0.12],
    ].forEach(([hf, radF, scY, ox, oz], i) => {
      const tuft = new THREE.Mesh(new THREE.DodecahedronGeometry(radF * (h / 12.0), 1), leafMats[(i + seed) % 3]);
      tuft.scale.set(0.95, 1.85 * scY * 2.1, 0.95);
      tuft.position.set(ox, h * hf, oz);
      tuft.rotation.y = (seed + i) * 0.9;
      tuft.castShadow = true;
      tuft.receiveShadow = true;
      grp.add(tuft);
    });
    parent.add(grp);
  }

  function addCypress(parent, x, z, s = 1.0, seed = 0) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * s, 0.10 * s, 0.9 * s, 6), M.trunk);
    stem.position.y = 0.45 * s;
    grp.add(stem);
    const mats = [M.tree, M.treeMid, M.treeLight];
    [[0.85, 0.56, 1.25], [1.45, 0.44, 1.35], [2.05, 0.28, 1.45]].forEach(([py, rad, sy], i) => {
      const tier = new THREE.Mesh(new THREE.DodecahedronGeometry(rad * s, 1), mats[(i + seed) % 3]);
      tier.scale.set(1.0, sy, 1.0);
      tier.position.y = py * s;
      tier.rotation.y = (seed + i) * 1.1;
      tier.castShadow = true;
      tier.receiveShadow = true;
      grp.add(tier);
    });
    parent.add(grp);
  }

  function addBroadTree(parent, x, z, s = 1.0, seed = 0) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * s, 0.17 * s, 2.2 * s, 7), M.trunk);
    st.position.y = 1.1 * s;
    st.castShadow = true;
    grp.add(st);
    const mats = [M.treeMid, M.treeLight, M.tree, M.treeMid];
    [[-0.55, 2.75, 0.35, 1.15], [0.60, 2.85, -0.35, 1.05], [0.05, 3.45, 0.15, 1.20], [-0.25, 3.15, -0.55, 0.95]].forEach(([ox, oy, oz, r], i) => {
      const b = new THREE.Mesh(new THREE.DodecahedronGeometry(r * s, 1), mats[(i + seed) % 4]);
      b.position.set(ox * s, oy * s, oz * s);
      b.scale.set(1.08, 0.88, 1.05);
      b.rotation.y = (seed + i) * 0.7;
      b.castShadow = true;
      b.receiveShadow = true;
      grp.add(b);
    });
    parent.add(grp);
  }

  // =========================================================
  // 1. SITE & SURROUNDINGS (DJI Drone Natural Atmosphere!)
  // =========================================================
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(340, 340), new THREE.MeshStandardMaterial({ color: 0x59624f, roughness: 0.96 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(8, -0.05, -28);
  ground.receiveShadow = true;
  groups.site.add(ground);

  const paveMat = new THREE.MeshStandardMaterial({ map: tex.bruschatka, roughness: 0.84 });
  box(groups.site, 65, 0.08, 45.5, paveMat, -1.0, -0.02, 10.25, 0, 0, 0, false);

  // West Driveway + Concrete Shirin Kulcha Court Slab (Image 1 foreground!)
  box(groups.site, 8.8, 0.05, 54.0, M.concretePath, 28.4, 0.0, 6.0, 0, 0, 0, false);
  box(groups.site, 36.5, 0.05, 12.6, M.concretePath, 21.0, 0.0, -24.2, 0, 0, 0, false);
  box(groups.site, 11.5, 0.05, 7.5, M.concretePath, 8.8, 0.0, -30.5, 0, 0, 0, false);

  // A-376 Concrete Drop-off Parking Apron + Street Highway
  box(groups.site, 116, 0.06, 7.2, new THREE.MeshStandardMaterial({ color: 0x7c8289, roughness: 0.88 }), 10, -0.01, 36.6, 0, 0, 0, false);
  for (let px = -26; px <= 52; px += 3.4) {
    box(groups.site, 0.1, 0.02, 4.2, M.whiteTrim, px, 0.03, 37.2, 0, 0, 0, false);
  }
  box(groups.site, 240, 0.05, 12.0, new THREE.MeshStandardMaterial({ map: tex.road, roughness: 0.85 }), 8, -0.02, 46.2, 0, 0, 0, false);

  // Front Fence along Z = +33.0
  const klumbaMat = new THREE.MeshStandardMaterial({ map: tex.stoneBrick, roughness: 0.8 });
  box(groups.site, 59.5, 0.58, 0.58, klumbaMat, -2.25, 0.29, 33.8);
  for (let sx = -30.5; sx <= 26.5; sx += 2.3) {
    const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 1), sx % 2 === 0 ? M.treeMid : M.treeLight);
    bush.position.set(sx, 0.78, 33.8);
    bush.castShadow = true;
    groups.site.add(bush);
  }
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
      if (i >= 7) box(groups.site, 4.5, 1.55, 0.06, i % 2 === 0 ? bMat1 : bMat2, px + 2.65, 1.25, 33.04);
    }
  }
  box(groups.site, 0.48, 2.5, 0.48, M.stucco, 32.8, 1.25, 33.0);
  box(groups.site, 0.12, 2.2, 4.2, M.charcoal, 32.8, 1.1, 30.8);

  box(groups.site, 0.38, 2.4, 44, M.cinder, -33.0, 1.2, 11.0);
  box(groups.site, 0.32, 2.4, 82, M.evrozabor, -27.5, 1.2, -50.5);
  box(groups.site, 0.38, 2.4, 14, M.cinder, 32.8, 1.2, 13.0);
  box(groups.site, 0.38, 2.4, 88, M.cinder, 40.4, 1.2, -40.0);

  // Neighbor 37-Maktab Building + Green Artificial Turf Football Pitch (-X side in Drone Video 00:00-00:05!)
  box(groups.site, 10.0, 9.8, 22.0, M.goldenOchre, -41.0, 4.9, -24.0);
  for (let nbz = -31; nbz <= -16; nbz += 4.5) {
    [2.2, 5.2, 8.0].forEach((nby) => box(groups.site, 0.25, 1.6, 2.0, M.bronzeGlass, -35.95, nby, nbz));
  }
  box(groups.site, 16.0, 0.06, 32.0, M.neighborPitch, -40.5, 0.01, -55.0, 0, 0, 0, false);
  [-48.5, -32.5].forEach((fx) => box(groups.site, 0.12, 3.2, 32.0, M.cinder, fx, 1.6, -55.0));
  box(groups.site, 4.2, 2.0, 0.14, M.whiteTrim, -40.5, 1.0, -39.6);
  box(groups.site, 4.2, 2.0, 0.14, M.whiteTrim, -40.5, 1.0, -70.4);

  // Tall Organic Poplar Treeline along East Fence (-X = -29.2, matching Drone Video 00:00-00:05)
  let popIdx = 0;
  for (let tz = -88; tz <= 5; tz += 5.0) {
    addPoplar(groups.site, -29.2, tz, 11.8 + (popIdx % 3) * 0.9, popIdx);
    popIdx++;
  }
  // Street sidewalk shade trees outside entrance (-X..+X, Z = 39.2)
  [-28.5, -2.5, 29.0, 54.0].forEach((tx, idx) => addBroadTree(groups.site, tx, 39.2, 1.15, idx));

  // Front Ornamental Lawns (Granite curb borders, tubular steel rails, 6 organic cypresses each, rose bushes & benches!)
  [-16.8, 16.8].forEach((lx, sideIdx) => {
    box(groups.site, 13.6, 0.14, 4.5, M.grass, lx, 0.05, 14.2, 0, 0, 0, false);
    box(groups.site, 13.8, 0.22, 0.18, M.granite, lx, 0.11, 16.45);
    box(groups.site, 13.8, 0.22, 0.18, M.granite, lx, 0.11, 11.95);
    box(groups.site, 0.18, 0.22, 4.5, M.granite, lx - 6.8, 0.11, 14.2);
    box(groups.site, 0.18, 0.22, 4.5, M.granite, lx + 6.8, 0.11, 14.2);
    for (let px = lx - 6.5; px <= lx + 6.6; px += 3.25) {
      box(groups.site, 0.06, 0.9, 0.06, M.steel, px, 0.45, 16.48);
    }
    box(groups.site, 13.6, 0.05, 0.05, M.steel, lx, 0.88, 16.48);
    box(groups.site, 0.1, 3.6, 0.1, M.grayTrim, lx + (lx > 0 ? 5.2 : -5.2), 1.8, 16.2);
    // Park bench beside walkway
    box(groups.site, 2.0, 0.10, 0.56, M.parkWood, lx, 0.48, 17.2);
    box(groups.site, 2.0, 0.42, 0.08, M.parkWood, lx, 0.78, 16.95);
    [-0.8, 0.8].forEach((bx) => box(groups.site, 0.08, 0.48, 0.48, M.blackSteel, lx + bx, 0.24, 17.2));

    [-5.5, -3.3, -1.1, 1.1, 3.3, 5.5].forEach((sx, cIdx) => {
      addCypress(groups.site, lx + sx, 13.5, 0.95 + (cIdx % 2) * 0.14, cIdx + sideIdx);
      const ball = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 1), cIdx % 2 === 0 ? M.treeLight : M.treeMid);
      ball.position.set(lx + sx + 0.5, 0.42, 15.3);
      ball.castShadow = true;
      groups.site.add(ball);
      if (cIdx % 2 === 0) {
        const flw = new THREE.Mesh(new THREE.SphereGeometry(0.20, 8, 6), sideIdx === 0 ? M.flowerPink : M.flowerGold);
        flw.position.set(lx + sx - 0.5, 0.35, 15.6);
        groups.site.add(flw);
      }
    });
  });

  // Front-Left Colorful Inflatable Bouncy Castle / Batut (Visible in Drone Video 00:00-00:07!)
  const batut = new THREE.Group();
  const batutBase = box(batut, 7.0, 0.65, 4.6, M.batutBlue, 0, 0.325, 0);
  tagZone(batutBase, 'Bolalar Batuti (Puflanma o‘yin majmuasi)', '7.0 × 4.6 × 4.2 m', 'Dron videosining chap old hovlisida (00:00–00:06) ko‘ringan havorang-qizil-sariq batut.');
  box(batut, 7.0, 1.25, 0.45, M.batutBlue, 0, 1.25, -2.05);
  box(batut, 0.55, 1.25, 4.2, M.batutBlue, -3.2, 1.25, 0);
  box(batut, 0.55, 1.25, 4.2, M.batutBlue, 3.2, 1.25, 0);
  // Bright red castle towers & slide arch
  [[-3.0, -1.9], [3.0, -1.9], [-3.0, 1.9], [3.0, 1.9]].forEach(([tx, tz]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 3.6, 12), M.batutRed);
    pillar.position.set(tx, 1.8, tz);
    pillar.castShadow = true;
    batut.add(pillar);
    const dome = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.85, 12), M.batutYellow);
    dome.position.set(tx, 3.85, tz);
    batut.add(dome);
  });
  box(batut, 5.6, 0.85, 0.70, M.batutRed, 0, 3.2, 1.9);
  box(batut, 2.8, 0.25, 3.2, M.batutYellow, -1.1, 1.45, 0.4, -0.45, 0, 0);
  box(batut, 2.2, 0.25, 3.2, M.batutRed, 1.5, 1.45, 0.4, -0.45, 0, 0);
  batut.position.set(-20.5, 0, 25.0);
  groups.site.add(batut);

  // Front-Right Blue Canopy Kiosk (Visible at right front driveway in Drone Video 00:07-00:09!)
  const frontKiosk = new THREE.Group();
  [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]].forEach(([kx, kz]) => {
    box(frontKiosk, 0.06, 2.3, 0.06, M.steel, kx, 1.15, kz);
  });
  const kRoof = new THREE.Mesh(new THREE.ConeGeometry(1.95, 0.78, 4), M.canopyBlue);
  kRoof.rotation.y = Math.PI / 4;
  kRoof.position.y = 2.65;
  kRoof.castShadow = true;
  frontKiosk.add(kRoof);
  const kTable = box(frontKiosk, 1.4, 0.75, 0.8, M.whiteTrim, 0, 0.375, 0);
  tagZone(kTable, 'Old Hovli Soyaboni va Axborot Nuqtasi', '2.6 × 2.6 × 3.0 m', 'Dron videosida o‘ng old maydonchada ko‘ringan havorang soyabon.');
  frontKiosk.position.set(20.8, 0, 20.6);
  groups.site.add(frontKiosk);

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

  const tashna = new THREE.Group();
  box(tashna, 3.4, 1.8, 0.95, M.whiteMarble, 0, 0.9, 0);
  box(tashna, 3.45, 0.8, 1.35, M.whiteMarble, 0, 0.4, 0.22);
  box(tashna, 1.05, 0.52, 0.06, M.steel, 0, 1.3, 0.49);
  box(tashna, 0.09, 3.4, 0.09, M.charcoal, 1.8, 1.7, -0.3);
  tashna.position.set(-25.5, 0, 21.0);
  tashna.rotation.y = 0.32;
  tagZone(tashna.children[0], 'Tashqi qo‘l yuvish (Tashna)', '3.4 × 1.1 × 1.8 m', '2-rasmda chap tomonda ko‘ringan oq kafelli ikki jo‘mrakli yuvinish joyi.');
  groups.site.add(tashna);

  // =========================================================
  // 2. MAIN SCHOOL BUILDING (B BLOK — 48.0 x 21.0 x 12.3 m)
  // =========================================================
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

  // ---- PODVOL / TSOKOL (Images 12, 13, 14, 15!) ----
  const tsokolSlab = extrudePlan(groups.bTsokol, 0.25, -1.80, M.podvolFloor);
  tagZone(tsokolSlab, 'Podvol / Tsokol qavati (-1.52 m)', '48.0 × 21.0 m (1 060 m²)', 'Shaxmat polli kulrang-yashil karidor, chapda Oshxona va Razdacha, o‘ngda Taekwondo Sport zali.');

  // Plinth skirt (Rear South wall 0.55m skirt matching Image 4!)
  box(groups.bExterior, 14.8, 1.50, 0.48, M.granite, -16.6, 0.75, 10.26);
  box(groups.bExterior, 14.8, 1.50, 0.48, M.granite, 16.6, 0.75, 10.26);
  box(groups.bExterior, 48.0, 0.55, 0.48, M.granite, 0, 0.275, -10.26);
  box(groups.bExterior, 0.48, 1.50, 14.0, M.granite, -23.76, 0.75, 3.5);
  box(groups.bExterior, 0.48, 1.50, 10.0, M.granite, 23.76, 0.75, 5.5);
  box(groups.bExterior, 0.48, 0.55, 11.0, M.granite, 23.76, 0.275, -5.0);
  box(groups.bExterior, 12.0, 1.50, 0.48, M.granite, 0, 0.75, 14.86);
  const chamAng = Math.atan2(4.6, 3.2);
  [-1, 1].forEach((s) => {
    box(groups.bExterior, 5.65, 1.50, 0.48, M.granite, s * 7.6, 0.75, 12.8, 0, -s * chamAng, 0);
  });

  [-21.8, -18.3, -14.8, -11.3, 11.3, 14.8, 18.3, 21.8].forEach((wx) => {
    box(groups.bExterior, 1.45, 0.56, 0.56, M.bronzeGlass, wx, 0.88, 10.26);
    box(groups.bExterior, 1.56, 0.66, 0.50, M.darkWood, wx, 0.88, 10.25);
  });

  // Podvol Central Checkered Corridor (Image 12: X in [-2.4, +2.4], Z in [-10.0, +10.0])
  // Charcoal-gray walls + lime-green door trim + OPEN Left Door #1 (Oshxona) & Right Door #2 (Sportzal)!
  [-2.45, 2.45].forEach((cxWall) => {
    box(groups.bTsokol, 0.22, 3.05, 9.0, M.podvolWall, cxWall, -0.02, 5.5);
    box(groups.bTsokol, 0.22, 3.05, 8.2, M.podvolWall, cxWall, -0.02, -5.8);
    // Lime green trim around open doorway at Z = -0.35
    box(groups.bTsokol, 0.26, 3.05, 0.35, M.limeGreen, cxWall, -0.02, 0.85);
    box(groups.bTsokol, 0.26, 3.05, 0.35, M.limeGreen, cxWall, -0.02, -1.55);
    box(groups.bTsokol, 0.26, 0.65, 2.1, M.whiteTrim, cxWall, 1.15, -0.35);
  });

  // Podvol Door #1 LEFT (-X Wing): Oshxona Razdacha + Ovqatlanish zali (Images 13 & 14!)
  const oshFloor = box(groups.bTsokol, 20.8, 0.08, 19.6, M.podvolFloor, -13.0, -1.52, 0.0, 0, 0, 0, false);
  tagZone(oshFloor, 'Oshxona va Razdacha (Podvol chap eshik)', '20.8 × 19.6 m (~407 m²)', '15–17-rasmlardagi nerjaveyka razdacha, oq-qora shaxmat pol, to‘q ko‘k ustunlar, dumaloq LED shift va tillarang geometrik devor.');
  box(groups.bTsokol, 20.8, 2.95, 0.24, M.oshWall, -13.0, -0.05, -9.8);
  box(groups.bTsokol, 0.24, 2.95, 19.6, M.oshMural, -23.3, -0.05, 0.0);
  // Royal-blue structural beams & columns + 6 circular LED ceiling rings
  [-6.5, -14.5, -20.5].forEach((bx) => {
    box(groups.bTsokol, 0.48, 2.95, 0.48, M.royalBlue, bx, -0.05, -2.5);
    box(groups.bTsokol, 0.50, 0.42, 19.4, M.royalBlue, bx, 1.18, 0.0);
    [-5.0, 2.5].forEach((lz) => {
      const ledRing = new THREE.Mesh(new THREE.RingGeometry(0.65, 0.88, 24), M.warmLed);
      ledRing.rotation.x = Math.PI / 2;
      ledRing.position.set(bx + 2.5, 1.32, lz);
      groups.bTsokol.add(ledRing);
    });
  });
  // Stainless Steel Razdacha Counter + Red Stripe + White Water Heaters + Teapot (Image 13!)
  box(groups.bTsokol, 1.15, 0.95, 4.6, M.steel, -5.2, -1.04, 3.2);
  box(groups.bTsokol, 1.20, 0.14, 4.64, M.redAlu, -5.2, -1.36, 3.2);
  box(groups.bTsokol, 0.16, 0.34, 0.16, M.redAlu, -5.2, -0.40, 2.2); // Red teapot
  box(groups.bTsokol, 4.8, 1.45, 0.16, M.whiteMarble, -7.2, -0.80, 9.6);
  [-8.0, -6.4].forEach((wx) => {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.95, 14), M.whiteTrim);
    wh.position.set(wx, 0.55, 9.2);
    groups.bTsokol.add(wh);
  });
  // Dining Tables (Royal-blue legs + light marble tops + blue benches, Image 14)
  for (let tx = -20.0; tx <= -8.0; tx += 4.2) {
    for (let tz = -7.5; tz <= -0.5; tz += 2.8) {
      box(groups.bTsokol, 2.3, 0.06, 0.95, M.whiteMarble, tx, -0.78, tz);
      box(groups.bTsokol, 2.1, 0.70, 0.78, M.royalBlue, tx, -1.16, tz);
    }
  }
  // Stainless steel handrail by Podvol entry (Image 14 foreground)
  box(groups.bTsokol, 3.2, 0.06, 0.06, M.steel, -4.6, -0.55, -7.5);
  [-6.0, -3.2].forEach((px) => box(groups.bTsokol, 0.06, 0.98, 0.06, M.steel, px, -1.02, -7.5));

  // Podvol Door #2 RIGHT (+X Wing): Taekwondo / Sport Zali (Image 15!)
  const tkFloor = box(groups.bTsokol, 20.8, 0.08, 19.6, M.tatamiMat, 13.0, -1.52, 0.0, 0, 0, 0, false);
  tagZone(tkFloor, 'Taekwondo / Sport zali (Podvol o‘ng eshik)', '20.8 × 19.6 m (~407 m²)', '18–19-rasmlardagi havorang tatami + 2 ta pushti yo‘lakli zal, salatoviy ustun, Taekwondo panno va boks qopi.');
  box(groups.bTsokol, 0.24, 2.95, 19.6, M.tkMural, 23.3, -0.05, 0.0); // Taekwondo end wall mural
  box(groups.bTsokol, 20.8, 0.45, 0.45, M.tkLimeBeam, 13.0, 1.15, -3.8); // Lime-green beam
  box(groups.bTsokol, 0.56, 2.95, 0.56, M.tkLimeBeam, 9.2, -0.05, -3.8); // Lime-green column
  box(groups.bTsokol, 0.64, 1.45, 0.64, M.orangeBars, 9.2, -0.78, -3.8); // Padded lower column protector
  // Yellow hanging punching bag
  const bag = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.35, 14), M.yellowGas);
  bag.position.set(21.2, 0.15, -7.2);
  groups.bTsokol.add(bag);

  // ---- 1-QAVAT (+1.50 m to +5.60 m) ----
  const f1Slab = extrudePlan(groups.bFloor1, 0.22, 1.38, M.whiteMarble);
  tagZone(f1Slab, '1-qavat (+1.50 m)', '1 060 m² (Shift 3.80 m)', 'Keng foye, kema maketi, resepshn, vitraj shisha sinflar va ochiq eshiklar.');

  box(groups.bFloor1, 0.65, 0.02, 14.5, M.blackMarble, -2.3, 1.62, 6.2, 0, 0, 0, false);
  box(groups.bFloor1, 0.65, 0.02, 14.5, M.blackMarble, 2.3, 1.62, 6.2, 0, 0, 0, false);
  for (let bx = -22.5; bx <= 22.5; bx += 3.5) {
    if (Math.abs(bx) > 3.5) box(groups.bFloor1, 0.65, 0.02, 2.9, M.blackMarble, bx, 1.62, 0, 0, 0, 0, false);
  }
  [[-4.8, 5.0], [4.8, 5.0], [-4.8, 10.2], [4.8, 10.2]].forEach(([cx, cz]) => {
    box(groups.bFloor1, 0.62, 3.8, 0.62, M.woodCol, cx, 3.5, cz);
  });

  const ship = new THREE.Group();
  box(ship, 0.60, 0.48, 2.6, M.woodCol, 0, 0.42, 0);
  [-0.7, 0, 0.7].forEach((mz) => {
    box(ship, 0.06, 2.1, 0.06, M.woodCol, 0, 1.45, mz);
    box(ship, 0.90, 0.48, 0.04, M.whiteTrim, 0, 1.15, mz);
    box(ship, 0.68, 0.42, 0.04, M.whiteTrim, 0, 1.82, mz);
  });
  ship.position.set(-4.6, 1.62, 11.8);
  groups.bFloor1.add(ship);

  const recMesh = box(groups.bFloor1, 1.15, 1.08, 5.8, M.darkWood, 4.9, 2.14, 7.0);
  tagZone(recMesh, 'Markaziy Foye va Resepshn (1-qavat)', '12.0 × 17.5 m (~210 m²)', '10-rasmdagi oq-qora marmar pol, chapda kema maketi, o‘ngda rangli papkali resepshn va to‘q sariq devor.');
  [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e].forEach((fc, idx) => {
    box(groups.bFloor1, 0.35, 0.36, 4.8, new THREE.MeshStandardMaterial({ color: fc }), 5.6, 2.85 + idx * 0.44, 7.0);
  });
  box(groups.bFloor1, 0.25, 3.8, 6.2, M.orangeWall, 5.75, 3.5, 4.8);

  const atlasMat = new THREE.MeshStandardMaterial({ map: tex.atlas, side: THREE.DoubleSide, roughness: 0.7 });
  box(groups.bFloor1, 9.6, 0.68, 0.08, atlasMat, 0, 5.05, 10.2);
  box(groups.bFloor1, 9.6, 0.68, 0.08, atlasMat, 0, 5.05, 5.0);
  box(groups.bFloor1, 9.0, 0.06, 0.16, M.greenLed, 0, 5.36, 7.6);
  box(groups.bFloor1, 0.16, 0.06, 8.2, M.greenLed, -2.8, 5.36, 7.5);
  box(groups.bFloor1, 0.16, 0.06, 8.2, M.greenLed, 2.8, 5.36, 7.5);

  const glassLogoMat = new THREE.MeshStandardMaterial({ map: tex.glassStripe, roughness: 0.4 });
  [-20.4, -14.2, -8.0, 8.0, 14.2, 20.4].forEach((cx, i) => {
    box(groups.bFloor1, 4.2, 1.5, 0.08, M.clearGlass, cx - 0.75, 4.55, -1.55);
    box(groups.bFloor1, 4.2, 1.5, 0.08, M.frostedGlass, cx - 0.75, 2.45, -1.55);
    box(groups.bFloor1, 4.2, 0.36, 0.11, glassLogoMat, cx - 0.75, 3.38, -1.55);
    box(groups.bFloor1, 1.6, 1.4, 0.08, M.clearGlass, cx + 2.15, 4.7, -1.55);
    box(groups.bFloor1, 0.28, 3.8, 0.32, M.woodCol, cx - 2.98, 3.5, -1.55);
    box(groups.bFloor1, 0.18, 3.8, 8.6, M.whiteTrim, cx - 3.08, 3.5, -6.0);
    const roomColors = [0x9333ea, 0x16a34a, 0x0284c7, 0xd97706, 0x0f766e, 0x4f46e5];
    if (i !== 2 && i !== 3) {
      box(groups.bFloor1, 5.8, 3.8, 0.18, new THREE.MeshStandardMaterial({ color: roomColors[i] }), cx, 3.5, -10.2);
    } else {
      box(groups.bFloor1, 2.5, 3.8, 0.18, new THREE.MeshStandardMaterial({ color: roomColors[i] }), cx + (i === 2 ? -1.6 : 1.6), 3.5, -10.2);
    }
    for (let dx = -1.6; dx <= 1.6; dx += 1.6) {
      for (let dz = -8.0; dz <= -3.8; dz += 1.8) {
        box(groups.bFloor1, 0.95, 0.06, 0.58, new THREE.MeshStandardMaterial({ color: i >= 3 ? 0x84cc16 : 0xf59e0b }), cx + dx, 2.34, dz);
        box(groups.bFloor1, 0.85, 0.70, 0.46, new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }), cx + dx, 1.96, dz);
      }
    }
  });

  box(groups.bFloor1, 13.0, 3.8, 0.18, M.whiteTrim, -12.5, 3.5, 1.55);
  box(groups.bFloor1, 13.0, 3.8, 0.18, M.whiteTrim, 12.5, 3.5, 1.55);

  // WALKABLE DIAGONAL-STRIPED STAIRWELLS (Image 7: Mint/White/Blue walls + Wrought-Iron Banisters!)
  [-21.8, 21.8].forEach((sx) => {
    const innerSide = sx < 0 ? sx + 1.6 : sx - 1.6;
    const stairWallMesh = box(groups.bFloor1, 0.16, 7.6, 17.5, M.stairWall, innerSide, 3.6, 0.5);
    if (sx > 0) tagZone(stairWallMesh, 'Qavatlararo Zinapoya (7-rasm)', 'Granit zina · Yashil-oq-ko‘k devor', '7-rasmdagi diagonal chiziqli zinapoya devori, jigarrang temir panjara va barcha qavatlarni bog‘lovchi granit zina.');
    for (let st = 0; st < 16; st++) {
      box(groups.bFloor1, 2.6, 0.14, 0.44, M.whiteMarble, sx, 1.62 + st * (4.10 / 16.0), 2.2 + st * 0.40);
      if (st % 2 === 0) box(groups.bFloor1, 0.06, 0.95, 0.06, M.wroughtIron, sx + (sx > 0 ? -1.1 : 1.1), 2.1 + st * (4.10 / 16.0), 2.2 + st * 0.40);
    }
    for (let st = 0; st < 13; st++) {
      box(groups.bTsokol, 2.4, 0.14, 0.44, M.granite, sx, 1.40 - st * (3.30 / 13.0), -2.2 - st * 0.40);
      if (st % 2 === 0) box(groups.bTsokol, 0.06, 0.92, 0.06, M.wroughtIron, sx + (sx > 0 ? -1.0 : 1.0), 1.85 - st * (3.30 / 13.0), -2.2 - st * 0.40);
    }
  });

  // ---- 2-QAVAT (+5.60 m to +9.70 m) — CORRIDORS & CLASSROOMS (Images 9, 10, 11!) ----
  box(groups.bFloor2, 40.0, 0.22, 20.6, M.whiteMarble, 0, 5.50, 0);
  box(groups.bFloor2, 12.0, 0.22, 4.6, M.whiteMarble, 0, 5.50, 12.6);
  const f2Ref = box(groups.bFloor2, 3.6, 0.22, 10.6, M.whiteMarble, 21.8, 5.50, -5.0);
  box(groups.bFloor2, 3.6, 0.22, 10.6, M.whiteMarble, -21.8, 5.50, -5.0);
  tagZone(f2Ref, '2-qavat (+5.60 m)', '1 060 m² (Shift 3.80 m)', '9–13-rasmlardagi olovrang-yashil sinfxona, uchburchak shiftli LED, o‘tirish stollari va origami geometrik koridor.');

  // Black marble stripe down 2F corridors (Images 10 & 11)
  box(groups.bFloor2, 42.0, 0.02, 0.24, M.blackMarble, 0, 5.62, 0, 0, 0, 0, false);

  // West 2F Corridor (Image 11: 3D Geometric Origami Wallpaper + Powder-Blue Tray Ceiling!)
  const westCorrWall = box(groups.bFloor2, 16.5, 3.8, 0.16, M.origamiWall, 11.8, 7.5, -1.55);
  tagZone(westCorrWall, '2/3-qavat Origami Koridori (12–13-rasm)', '16.5 × 3.1 m', 'Geometrik 3D oq devor gulqog‘ozi, havorang hoshiyali shift va qora chiziqli marmar pol.');
  box(groups.bFloor2, 16.5, 3.8, 0.16, M.origamiWall, 11.8, 7.5, 1.55);
  box(groups.bFloor2, 16.5, 0.12, 0.65, M.powderBlue, 11.8, 9.48, -1.25);
  box(groups.bFloor2, 16.5, 0.12, 0.65, M.powderBlue, 11.8, 9.48, 1.25);

  // East 2F Corridor (Image 10: Cream Stucco + White Wall Shelves + Bench Study Tables!)
  const eastCorrWall = box(groups.bFloor2, 16.5, 3.8, 0.16, M.stucco, -11.8, 7.5, -1.55);
  tagZone(eastCorrWall, '2-qavat Koridor va O‘quv Stollari (10–11-rasm)', '16.5 × 3.1 m', 'O‘rtada parta-skameykalar va devorda oq javonlar joylashgan keng koridor.');
  box(groups.bFloor2, 16.5, 3.8, 0.16, M.stucco, -11.8, 7.5, 1.55);
  [-16.0, -10.5, -6.5].forEach((sx) => {
    box(groups.bFloor2, 1.1, 0.75, 0.22, M.whiteTrim, sx, 7.6, -1.42);
    box(groups.bFloor2, 1.8, 0.06, 0.75, M.beechDesk, sx, 6.42, 0.1);
    box(groups.bFloor2, 1.7, 0.45, 0.45, M.whiteTrim, sx, 5.95, 0.4);
  });

  // 2F Coral-Orange & Mint-Green Classrooms with 3D Triangular Green Ceiling Panels (Image 9!)
  [-14.5, 14.5].forEach((rx) => {
    // Alternating Coral pilasters & Mint wall panels on rear wall Z = -10.1
    [-3.0, 0.0, 3.0].forEach((off) => box(groups.bFloor2, 0.9, 3.7, 0.18, M.coralWall, rx + off, 7.45, -10.05));
    [-1.5, 1.5].forEach((off) => box(groups.bFloor2, 2.1, 3.7, 0.14, M.mintPanel, rx + off, 7.45, -10.12));
    // Triangular green ceiling panels + round LEDs + light beechwood student desks
    [-2.0, 2.0].forEach((cx) => {
      [-7.5, -4.5].forEach((cz) => {
        const tri = new THREE.Mesh(new THREE.ConeGeometry(1.15, 0.14, 3), M.ceilTriangle);
        tri.position.set(rx + cx, 9.48, cz);
        groups.bFloor2.add(tri);
        box(groups.bFloor2, 1.05, 0.05, 0.55, M.beechDesk, rx + cx, 6.38, cz);
        box(groups.bFloor2, 0.95, 0.65, 0.08, M.blackSteel, rx + cx, 5.98, cz);
      });
    });
  });

  box(groups.bFloor2, 7.8, 3.6, 0.2, new THREE.MeshStandardMaterial({ map: tex.macWall }), 18.0, 7.4, 10.0);
  box(groups.bFloor2, 7.8, 3.6, 0.2, new THREE.MeshStandardMaterial({ map: tex.gptWall }), 10.0, 7.4, 10.0);
  for (let ix = 8.0; ix <= 20.0; ix += 3.5) {
    for (let iz = 3.5; iz <= 8.0; iz += 2.2) {
      box(groups.bFloor2, 2.4, 0.06, 0.85, M.whiteTrim, ix, 6.45, iz);
      box(groups.bFloor2, 0.6, 0.38, 0.05, M.blackSteel, ix - 0.55, 6.75, iz);
      box(groups.bFloor2, 0.6, 0.38, 0.05, M.blackSteel, ix + 0.55, 6.75, iz);
    }
  }
  for (let bx = -4.5; bx <= 4.5; bx += 3.0) {
    box(groups.bFloor2, 2.0, 2.4, 0.5, M.whiteTrim, bx, 6.8, 8.5);
  }
  box(groups.bFloor2, 4.0, 0.06, 1.5, M.woodCol, 0, 6.45, 11.4);

  // ---- B BLOK EXTERIOR ----
  function buildWingFacade(startX, dir) {
    const isWest = dir > 0;
    for (let b = 0; b < 4; b++) {
      const cx = startX + dir * (2.05 + b * 3.55);
      box(groups.bExterior, 1.9, 7.0, 0.44, M.stucco, cx - dir * 1.78, 5.0, 10.28);
      box(groups.bExterior, 2.05, 0.16, 0.50, M.grayTrim, cx - dir * 1.78, 8.55, 10.30);
      box(groups.bExterior, 0.12, 7.8, 0.50, M.grayTrim, cx - 0.85, 5.4, 10.30);
      box(groups.bExterior, 0.12, 7.8, 0.50, M.grayTrim, cx + 0.85, 5.4, 10.30);
      box(groups.bExterior, 3.62, 1.18, 0.46, M.charcoal, cx, 9.11, 10.28);
      box(groups.bExterior, 1.56, 7.75, 0.22, M.bronzeGlass, cx, 5.45, 10.28);
      if (isWest && b >= 1) {
        box(groups.bExterior, 1.52, 2.2, 0.24, new THREE.MeshStandardMaterial({ map: tex.kidsDecal, transparent: true, opacity: 0.9 }), cx, 2.7, 10.30);
      }
      box(groups.bExterior, 1.66, 0.14, 0.30, M.charcoal, cx, 5.55, 10.32);
      box(groups.bExterior, 1.66, 0.10, 0.30, M.charcoal, cx, 3.75, 10.32);
      box(groups.bExterior, 1.66, 0.10, 0.30, M.charcoal, cx, 7.45, 10.32);
    }
    box(groups.bExterior, 1.6, 7.0, 0.44, M.stucco, startX + dir * 14.0, 5.0, 10.28);
    box(groups.bExterior, 14.85, 1.80, 0.54, M.parapet, startX + dir * 7.4, 10.60, 10.32);
    box(groups.bExterior, 14.95, 0.16, 0.60, M.whiteTrim, startX + dir * 7.4, 11.54, 10.32);
    box(groups.bExterior, 14.95, 0.14, 0.58, M.whiteTrim, startX + dir * 7.4, 9.72, 10.32);
    box(groups.bExterior, 0.82, 0.55, 0.34, M.acWhite, startX + dir * 3.85, 7.2, 10.62);
    box(groups.bExterior, 0.82, 0.55, 0.34, M.acWhite, startX + dir * 3.85, 5.0, 10.62);
    box(groups.bExterior, 0.82, 0.55, 0.34, M.acWhite, startX + dir * 11.2, 7.2, 10.62);
  }
  buildWingFacade(-9.2, -1);
  buildWingFacade(9.2, 1);

  box(groups.bExterior, 2.5, 8.2, 0.46, M.charcoal, -4.75, 5.6, 14.88);
  box(groups.bExterior, 2.5, 8.2, 0.46, M.charcoal, 4.75, 5.6, 14.88);
  box(groups.bExterior, 7.0, 3.6, 0.42, M.stucco, 0, 7.9, 14.88);
  box(groups.bExterior, 1.1, 3.4, 0.42, M.stucco, -2.95, 3.2, 14.88);
  box(groups.bExterior, 1.1, 3.4, 0.42, M.stucco, 2.95, 3.2, 14.88);
  box(groups.bExterior, 0.08, 2.55, 1.25, M.bronzeGlass, -1.35, 2.78, 14.25, 0, 0.25, 0);
  box(groups.bExterior, 0.08, 2.55, 1.25, M.bronzeGlass, 1.35, 2.78, 14.25, 0, -0.25, 0);
  box(groups.bExterior, 0.55, 0.55, 0.04, new THREE.MeshStandardMaterial({ map: tex.doorB }), 1.30, 3.05, 14.25, 0, -0.25, 0);
  box(groups.bExterior, 5.0, 0.65, 0.24, M.charcoal, 0, 4.35, 14.90);
  box(groups.bExterior, 1.1, 1.5, 0.08, M.whiteTrim, -2.15, 3.0, 15.15);
  box(groups.bExterior, 1.1, 1.5, 0.08, M.whiteTrim, 2.15, 3.0, 15.15);
  box(groups.bExterior, 3.6, 2.9, 0.25, M.bronzeGlass, 0, 7.85, 14.94);
  box(groups.bExterior, 0.08, 2.9, 0.30, M.charcoal, -0.60, 7.85, 14.96);
  box(groups.bExterior, 0.08, 2.9, 0.30, M.charcoal, 0.60, 7.85, 14.96);
  box(groups.bExterior, 12.1, 2.60, 0.54, M.parapet, 0, 11.00, 14.90);
  box(groups.bExterior, 12.2, 0.16, 0.62, M.whiteTrim, 0, 12.34, 14.90);

  [-1, 1].forEach((s) => {
    const ang = -s * Math.atan2(4.6, 3.2);
    box(groups.bExterior, 5.65, 8.2, 0.46, M.charcoal, s * 7.6, 5.6, 12.8, 0, ang, 0);
    box(groups.bExterior, 5.70, 2.60, 0.54, M.parapet, s * 7.6, 11.00, 12.8, 0, ang, 0);
    box(groups.bExterior, 5.75, 0.16, 0.62, M.whiteTrim, s * 7.6, 12.34, 12.8, 0, ang, 0);
    [-0.82, 0.82].forEach((off) => {
      const lx = s * 7.6 + off * Math.cos(ang);
      const lz = 12.8 - off * Math.sin(ang);
      box(groups.bExterior, 0.92, 7.4, 0.50, M.bronzeGlass, lx, 5.3, lz, 0, ang, 0);
    });
  });

  const portico = box(groups.bExterior, 12.2, 1.25, 3.85, M.whiteTrim, 0, 5.55, 17.02);
  tagZone(portico, 'Markaziy kirish portali (B blok)', '12.0 m eni · +12.30 m balandlik', '9 ta oq chiziqli granit zina, o‘ngda pandus, 4 ta oq ustun va ochiq B blok eshigi.');
  box(groups.bExterior, 12.25, 0.28, 3.90, M.charcoal, 0, 6.28, 17.02);
  box(groups.bExterior, 0.48, 3.5, 0.48, M.whiteTrim, -5.45, 3.25, 18.68);
  box(groups.bExterior, 0.48, 3.5, 0.48, M.whiteTrim, 5.45, 3.25, 18.68);
  [-2.15, 2.15].forEach((colX) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.20, 3.5, 14), M.whiteTrim);
    col.position.set(colX, 3.25, 18.68);
    col.castShadow = true;
    groups.bExterior.add(col);
  });
  box(groups.bExterior, 9.6, 0.78, 0.08, new THREE.MeshStandardMaterial({ map: tex.signSub }), 0, 5.55, 18.98);
  box(groups.bExterior, 7.8, 0.88, 0.14, new THREE.MeshStandardMaterial({ map: tex.signMain }), 1.2, 6.92, 18.68);
  box(groups.bExterior, 1.6, 0.88, 0.12, new THREE.MeshStandardMaterial({ map: tex.emblem }), -4.1, 6.92, 18.68);

  box(groups.bExterior, 12.0, 1.50, 3.70, M.granite, 0, 0.75, 16.95);
  [-5.72, 5.72].forEach((cx) => box(groups.bExterior, 0.46, 1.15, 2.9, M.granite, cx, 0.575, 20.2));
  for (let st = 0; st < 9; st++) {
    const sh = 1.50 - st * (1.50 / 9);
    const sz = 18.80 + st * 0.32;
    box(groups.bExterior, 11.0, sh, 0.34, M.granite, 0, sh / 2, sz);
    box(groups.bExterior, 9.6, 0.03, 0.05, M.whiteTrim, -0.6, sh + 0.01, sz + 0.14);
  }
  const rampMesh = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 3.15), M.whiteTrim);
  rampMesh.position.set(4.85, 0.78, 20.2);
  rampMesh.rotation.x = Math.atan2(1.50, 2.88);
  rampMesh.castShadow = true;
  groups.bExterior.add(rampMesh);
  [-5.55, 5.55].forEach((rx) => {
    box(groups.bExterior, 0.06, 0.95, 3.3, M.steel, rx, 1.98, 16.95);
    box(groups.bExterior, 0.42, 0.72, 0.42, M.blackSteel, rx, 0.36, 21.4);
  });

  // West (+X) Side Wall + Exterior Black Steel Stairs
  box(groups.bExterior, 0.44, 9.15, 9.4, M.stucco, 23.78, 5.12, 5.8);
  box(groups.bExterior, 0.44, 9.15, 9.4, M.stucco, 23.78, 5.12, -5.8);
  box(groups.bExterior, 0.44, 1.2, 21.0, M.charcoal, 23.78, 9.1, 0);
  box(groups.bExterior, 0.46, 1.8, 21.0, M.parapet, 23.78, 10.6, 0);
  box(groups.bExterior, 0.52, 0.16, 21.1, M.whiteTrim, 23.78, 11.54, 0);
  box(groups.bExterior, 0.25, 7.6, 1.85, M.bronzeGlass, 23.78, 5.4, 0);
  [-4.2, -8.2].forEach((wz) => {
    [1.45, 4.35, 7.35].forEach((wy) => {
      box(groups.bExterior, 0.28, 1.65, 1.55, M.bronzeGlass, 23.82, wy, wz);
      box(groups.bExterior, 0.32, 1.82, 1.72, M.grayTrim, 23.78, wy, wz);
    });
  });
  box(groups.bExterior, 2.4, 3.0, 0.15, M.clearGlass, 25.0, 1.5, -5.8);
  box(groups.bExterior, 2.4, 3.0, 0.15, M.clearGlass, 25.0, 1.5, -8.8);
  box(groups.bExterior, 2.5, 0.22, 3.2, M.whiteTrim, 25.0, 3.05, -7.3);
  for (let st = 0; st < 10; st++) {
    box(groups.bExterior, 1.15, 0.10, 0.42, M.blackSteel, 24.45, 0.16 + st * 0.18, -9.8 + st * 0.44);
  }
  box(groups.bExterior, 0.08, 1.0, 4.5, M.blackSteel, 25.02, 1.6, -7.8, Math.atan2(1.8, 4.4), 0, 0);

  // East (-X) Side Wall + 1F Annex (Image 4 right!)
  box(groups.bExterior, 0.44, 9.15, 21.0, M.stucco, -23.78, 5.12, 0);
  box(groups.bExterior, 0.46, 1.8, 21.0, M.parapet, -23.78, 10.6, 0);
  box(groups.bExterior, 0.52, 0.16, 21.1, M.whiteTrim, -23.78, 11.54, 0);
  const eastAnnex = box(groups.bExterior, 6.2, 4.1, 10.0, M.stucco, -27.1, 2.05, -3.5);
  tagZone(eastAnnex, 'Sharqiy 1-qavatli qanot', '6.2 × 10.0 × 4.1 m (~62 m²)', '4-rasm o‘ng chetidagi 1-qavatli qanot (2 ta oq deraza va konditsioner bilan).');
  box(groups.bExterior, 6.3, 0.5, 10.1, M.charcoal, -27.1, 4.25, -3.5);
  box(groups.bExterior, 1.4, 1.3, 0.15, M.bronzeGlass, -26.0, 2.35, -8.52);
  box(groups.bExterior, 1.4, 1.3, 0.15, M.bronzeGlass, -28.2, 2.35, -8.52);
  box(groups.bExterior, 0.80, 0.52, 0.34, M.acWhite, -29.4, 3.0, -8.62);

  // South (Rear) Facade of B blok — 11 Bays + Stepped Pilasters + Slim White Roof Cornice (Image 4!)
  box(groups.bExterior, 22.0, 9.15, 0.44, M.stucco, -13.0, 5.12, -10.28);
  box(groups.bExterior, 22.0, 9.15, 0.44, M.stucco, 13.0, 5.12, -10.28);
  box(groups.bExterior, 4.0, 5.2, 0.44, M.stucco, 0, 7.1, -10.28);
  // 2 vertical stepped taupe pilasters dividing 3+4+4 bays & slim overhanging roof cornice
  [-8.0, 8.0].forEach((px) => box(groups.bExterior, 0.65, 9.2, 0.52, M.taupeTrim, px, 5.12, -10.30));
  box(groups.bExterior, 48.6, 0.42, 0.85, M.whiteTrim, 0, 9.95, -10.45);
  box(groups.bExterior, 2.4, 1.60, 0.52, M.charcoal, -22.8, 10.75, -10.30);
  box(groups.bExterior, 2.4, 1.60, 0.52, M.charcoal, 22.8, 10.75, -10.30);

  for (let i = 0; i < 11; i++) {
    const rx = -20.5 + i * 4.1;
    if (Math.abs(rx) < 1.8) continue;
    // Bottom Tsokol narrow window + 1F window + 2F square window
    box(groups.bExterior, 1.95, 0.92, 0.48, M.taupeTrim, rx, 0.92, -10.28);
    box(groups.bExterior, 1.68, 0.68, 0.52, M.bronzeGlass, rx, 0.92, -10.28);
    [4.0, 7.45].forEach((ry) => {
      box(groups.bExterior, 2.05, 1.92, 0.48, M.taupeTrim, rx, ry, -10.28);
      box(groups.bExterior, 1.75, 1.66, 0.52, M.bronzeGlass, rx, ry, -10.28);
      box(groups.bExterior, 0.07, 1.66, 0.54, M.darkWood, rx - 0.30, ry, -10.28);
      box(groups.bExterior, 0.07, 1.66, 0.54, M.darkWood, rx + 0.30, ry, -10.28);
      box(groups.bExterior, 1.75, 0.06, 0.54, M.darkWood, rx, ry + 0.32, -10.28);
    });
    if (i % 2 === 0) {
      box(groups.bExterior, 0.76, 0.50, 0.32, M.acWhite, rx + 1.35, 3.4, -10.60);
      box(groups.bExterior, 0.76, 0.50, 0.32, M.acWhite, rx - 1.35, 6.6, -10.60);
    }
  }
  for (let st = 0; st < 7; st++) {
    const sh = 1.50 - st * (1.50 / 7);
    box(groups.bExterior, 4.2, sh, 0.36, M.granite, 0, sh / 2, -10.65 - st * 0.36);
  }
  // B blok Base Deck + Bright Silver Ribbed Pitched Roof & 4 Triangular Attic Dormers (DJI Drone 00:05-00:09!)
  extrudePlan(groups.bRoof, 0.22, 9.72, new THREE.MeshStandardMaterial({ color: 0xbec5cd, roughness: 0.85 }));
  {
    const yE = 9.96, yR = 12.36;
    const verts = [], uvs = [];
    const pushTri = (a, b, c) => {
      verts.push(...a, ...b, ...c);
      uvs.push(a[0] * 0.05, a[2] * 0.05, b[0] * 0.05, b[2] * 0.05, c[0] * 0.05, c[2] * 0.05);
    };
    const pushQuad = (a, b, c, d) => { pushTri(a, b, c); pushTri(a, c, d); };
    // Main E-W Hipped Roof Slopes
    pushQuad([-23.85, yE, -10.35], [23.85, yE, -10.35], [16.2, yR, 0], [-16.2, yR, 0]);
    pushQuad([23.85, yE, 10.35], [-23.85, yE, 10.35], [-16.2, yR, 0], [16.2, yR, 0]);
    pushTri([-23.85, yE, 10.35], [-23.85, yE, -10.35], [-16.2, yR, 0]);
    pushTri([23.85, yE, -10.35], [23.85, yE, 10.35], [16.2, yR, 0]);
    // Central Projection Hipped Roof
    pushQuad([-9.1, yE, 10.35], [-5.9, yE, 14.8], [0, 12.05, 11.2], [0, yR, 0]);
    pushQuad([5.9, yE, 14.8], [9.1, yE, 10.35], [0, yR, 0], [0, 12.05, 11.2]);
    pushTri([-5.9, yE, 14.8], [5.9, yE, 14.8], [0, 12.05, 11.2]);

    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    rGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    rGeo.computeVertexNormals();
    const bSilverRoof = new THREE.Mesh(rGeo, M.silverRoof);
    bSilverRoof.castShadow = true;
    bSilverRoof.receiveShadow = true;
    groups.bRoof.add(bSilverRoof);
    tagZone(bSilverRoof, 'B blok Kumush Profnastil Tomi', '48.0 × 21.0 m · 4 ta uchburchak fonar', 'Dron videosidagi och kumushrang qiya profnastil tom va 4 ta uchburchak shamollatish fonarchasi.');

    // Main Ridge Cap (Konyok) & Portal Ridge Cap
    box(groups.bRoof, 32.6, 0.14, 0.28, M.steel, 0, yR + 0.04, 0);
    box(groups.bRoof, 0.28, 0.14, 11.4, M.steel, 0, 12.22, 5.6, 0.028, 0, 0);

    // 4 Triangular Silver Attic Dormer Vents on Front Slope (DJI Drone 00:06-00:09!)
    [-15.6, -5.8, 5.8, 15.6].forEach((dx) => {
      const dGrp = new THREE.Group();
      dGrp.position.set(dx, 11.48, 3.7);
      const lSlope = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.75), M.silverRoof);
      lSlope.position.set(-0.42, 0.22, 0); lSlope.rotation.z = 0.56;
      const rSlope = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.75), M.silverRoof);
      rSlope.position.set(0.42, 0.22, 0); rSlope.rotation.z = -0.56;
      const ventFace = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.78, 3), M.charcoal);
      ventFace.rotation.x = Math.PI / 2; ventFace.rotation.y = Math.PI / 6;
      ventFace.scale.set(1.2, 0.15, 0.72);
      ventFace.position.set(0, -0.02, 0.85);
      dGrp.add(lSlope, rSlope, ventFace);
      groups.bRoof.add(dGrp);
    });
  }

  // =========================================================
  // 3. INNOVATION HUB (+X Beyond Gate, Facing North +Z Street)
  // =========================================================
  const hubX = 43.0, hubZ = 26.25;
  const hubBase = box(groups.hubFloor1, 18.0, 0.22, 12.5, M.whiteMarble, hubX, 0.11, hubZ, 0, 0, 0, false);
  tagZone(hubBase, 'INNOVATION HUB (2 qavat, ko‘chaga qaragan)', '18.0 × 12.5 × 7.8 m', '4- va 6-rasmdagidek darvozaning nargi tarafida, A-376 ko‘chasiga qarab turgan zamonaviy IT markaz.');
  box(groups.hubShell, 4.8, 0.72, 0.42, new THREE.MeshStandardMaterial({ map: tex.stoneBrick }), 36.4, 0.36, 32.35);
  box(groups.hubShell, 4.8, 6.08, 0.38, M.charcoal, 36.4, 3.76, 32.35);
  box(groups.hubShell, 1.8, 2.0, 0.24, M.clearGlass, 36.4, 2.05, 32.38);
  box(groups.hubShell, 1.96, 0.14, 0.28, M.grayTrim, 36.4, 3.10, 32.38);
  box(groups.hubShell, 1.96, 0.14, 0.28, M.grayTrim, 36.4, 1.02, 32.38);
  box(groups.hubShell, 3.4, 3.4, 0.08, new THREE.MeshStandardMaterial({ map: tex.hubBanner }), 36.4, 5.15, 32.58);
  box(groups.hubShell, 0.85, 0.58, 0.35, M.acWhite, 38.0, 2.95, 32.72);

  for (let b = 0; b < 4; b++) {
    const rx = 39.0 + b * 4.25;
    box(groups.hubShell, 0.68, 6.8, 0.45, M.redAlu, rx, 3.4, 32.35);
    if (b < 3) {
      const gx = rx + 2.125;
      box(groups.hubShell, 3.55, 2.4, 0.20, M.clearGlass, gx, 5.4, 32.35);
      box(groups.hubShell, 3.58, 1.25, 0.38, M.hubCorrugated, gx, 3.6, 32.38);
      if (b === 0) box(groups.hubShell, 1.75, 2.95, 0.20, M.clearGlass, gx - 0.88, 1.5, 32.35);
      else box(groups.hubShell, 3.55, 2.95, 0.20, M.clearGlass, gx, 1.5, 32.35);
    }
  }
  box(groups.hubShell, 18.1, 1.05, 12.6, M.parapet, hubX, 7.28, hubZ);
  box(groups.hubShell, 10.5, 0.90, 0.14, new THREE.MeshStandardMaterial({ map: tex.signHub }), 45.2, 7.30, 32.60);
  box(groups.hubShell, 0.38, 6.8, 12.5, M.charcoal, 34.18, 3.4, hubZ);
  box(groups.hubShell, 0.38, 6.8, 12.5, M.charcoal, 51.82, 3.4, hubZ);
  box(groups.hubShell, 18.0, 6.8, 0.38, M.charcoal, hubX, 3.4, 20.18);

  box(groups.hubFloor1, 17.3, 6.6, 0.2, M.hubCream, hubX, 3.4, 20.42);
  box(groups.hubFloor1, 0.2, 6.6, 11.8, M.hubCream, 51.55, 3.4, hubZ);
  const chairMat = new THREE.MeshStandardMaterial({ color: 0xb8bec6, roughness: 0.7 });
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const chx = 37.0 + col * 1.65, chz = 29.8 - row * 1.45;
      box(groups.hubFloor1, 0.58, 0.45, 0.54, chairMat, chx, 0.42, chz);
      box(groups.hubFloor1, 0.58, 0.65, 0.14, chairMat, chx, 0.78, chz + 0.22);
    }
  }
  box(groups.hubFloor1, 5.6, 1.08, 0.95, M.woodCol, 43.0, 0.75, 22.0);
  for (let st = 0; st < 14; st++) {
    box(groups.hubFloor1, 1.4, 0.08, 0.34, M.blackSteel, 50.6, 0.35 + st * (3.30 / 14), 28.5 - st * 0.36);
  }
  box(groups.hubFloor2, 13.5, 0.24, 4.8, M.whiteTrim, 42.5, 3.65, 22.6);
  box(groups.hubFloor2, 1.8, 0.24, 7.6, M.whiteTrim, 50.5, 3.65, 28.6);
  box(groups.hubFloor2, 11.4, 2.9, 0.08, M.clearGlass, 41.5, 5.2, 24.95);
  box(groups.hubFloor2, 11.4, 0.24, 0.1, new THREE.MeshStandardMaterial({ map: tex.glassStripe }), 41.5, 5.1, 24.97);
  box(groups.hubFloor2, 0.08, 0.95, 7.6, M.blackSteel, 49.65, 4.25, 28.6);
  box(groups.hubRoof, 17.8, 0.24, 12.2, M.silverRoof, hubX, 7.12, hubZ);
  box(groups.hubRoof, 18.1, 0.28, 0.28, M.charcoal, hubX, 7.72, 20.12);
  box(groups.hubRoof, 18.1, 0.28, 0.28, M.charcoal, hubX, 7.72, 32.38);
  box(groups.hubRoof, 0.28, 0.28, 12.2, M.charcoal, 34.12, 7.72, hubZ);
  box(groups.hubRoof, 0.28, 0.28, 12.2, M.charcoal, 51.88, 7.72, hubZ);
  [39.8, 46.2].forEach((hx) => {
    box(groups.hubRoof, 1.85, 0.78, 1.25, M.acWhite, hx, 7.62, 25.0);
    box(groups.hubRoof, 0.72, 0.12, 0.72, M.charcoal, hx - 0.42, 8.05, 25.0);
    box(groups.hubRoof, 0.72, 0.12, 0.72, M.charcoal, hx + 0.42, 8.05, 25.0);
  });

  // =========================================================
  // 4. REAR CAMPUS (MATCHING DRONE VIDEO + ALL 15 PHOTOS + 4 VIDEOS!)
  // =========================================================
  box(groups.site, 51.5, 0.05, 2.2, M.concretePath, -1.2, 0.01, -11.4, 0, 0, 0, false);

  const qozon = box(groups.dormExterior, 6.7, 3.25, 4.8, M.stucco, 18.15, 1.625, -15.0);
  tagZone(qozon, 'Qozonxona va Qizil o‘t o‘chirish shiti', '6.7 × 4.8 × 3.25 m', '1-videodagi 2 ta baland mo‘ri, sariq gaz trubasi va qizil o‘t o‘chirish shiti.');
  box(groups.dormExterior, 6.8, 0.45, 4.9, M.granite, 18.15, 0.225, -15.0);
  box(groups.dormExterior, 6.9, 0.18, 5.0, M.grayTrim, 18.15, 3.30, -15.0);
  [16.5, 19.9].forEach((cx) => {
    const chim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 8.2, 16), M.steel);
    chim.position.set(cx, 4.1, -14.2);
    chim.castShadow = true;
    groups.dormExterior.add(chim);
  });
  const gasPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.6, 12), M.yellowGas);
  gasPipe.rotation.x = Math.PI / 2;
  gasPipe.position.set(16.8, 2.95, -11.4);
  groups.dormExterior.add(gasPipe);
  box(groups.dormExterior, 6.0, 0.18, 0.18, M.yellowGas, 19.8, 2.95, -10.55);
  box(groups.dormExterior, 0.36, 1.45, 1.15, M.fireCabinet, 21.65, 1.15, -15.0);

  // 3 Green Gazebos in Fenced Garden (Image 4 + Broadleaf courtyard trees!)
  box(groups.site, 41.0, 0.05, 5.0, M.grass, -6.0, 0.01, -15.2, 0, 0, 0, false);
  [-16.5, -7.2, 2.2, 11.8].forEach((tx, tIdx) => addBroadTree(groups.site, tx, -13.2, 0.92, tIdx));
  box(groups.site, 49.0, 0.42, 0.30, M.cinder, -2.5, 0.21, -17.8);
  box(groups.site, 49.0, 0.05, 0.05, M.grayTrim, -2.5, 1.75, -17.8);
  box(groups.site, 49.0, 0.05, 0.05, M.grayTrim, -2.5, 0.90, -17.8);
  for (let fx = -26.5; fx <= 22.0; fx += 1.6) {
    box(groups.site, 0.05, 1.5, 0.05, M.grayTrim, fx, 1.15, -17.8);
  }
  [7.0, -2.5, -12.0].forEach((gx, idx) => {
    const gz = -15.2;
    [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]].forEach(([px, pz]) => {
      box(groups.dormExterior, 0.09, 2.55, 0.09, M.blackSteel, gx + px, 1.28, gz + pz);
    });
    box(groups.dormExterior, 3.25, 2.0, 3.25, M.gazeboMesh, gx, 1.15, gz);
    box(groups.dormExterior, 2.2, 0.10, 0.55, M.woodCol, gx, 0.50, gz);
    const roofCone = new THREE.Mesh(new THREE.ConeGeometry(2.75, 1.45, 4), M.gazeboRoof);
    roofCone.rotation.y = Math.PI / 4;
    roofCone.position.set(gx, 3.22, gz);
    roofCone.castShadow = true;
    groups.dormRoof.add(roofCone);
    if (idx === 1) {
      tagZone(groups.dormExterior.children[groups.dormExterior.children.length - 2], '3 ta Yashil Shiypon (Besedka)', 'Har biri 3.3 × 3.3 × 3.9 m', '4-rasmdagi panjarali bog‘ ichidagi 3 ta yashil to‘rli besedka.');
    }
  });

  // Rear Steel Arch Gate + Golden-Ochre Utility Building (Image 3 right!)
  box(groups.site, 0.16, 3.9, 0.16, M.blackSteel, 24.2, 1.95, -21.0);
  box(groups.site, 0.16, 3.9, 0.16, M.blackSteel, 31.2, 1.95, -21.0);
  box(groups.site, 7.2, 0.12, 0.14, M.blackSteel, 27.7, 3.9, -21.0);
  box(groups.site, 0.08, 1.9, 2.8, M.blackSteel, 24.3, 0.95, -22.4);
  box(groups.site, 0.08, 1.9, 2.8, M.blackSteel, 31.1, 0.95, -22.4);
  const utilHouse = box(groups.dormExterior, 4.8, 2.55, 3.6, M.goldenOchre, 37.2, 1.275, -20.8);
  tagZone(utilHouse, 'Ochre / Sariq Yordamchi Bino', '4.8 × 3.6 × 2.55 m', '3-rasmdagi darvoza o‘ng tarafidagi och sariq bino.');

  // Detailed Turnik Workout Complex on Gravel Bed (Exact match to Image 1 & Image 5!)
  box(groups.site, 7.2, 0.06, 5.4, M.cinder, 9.75, 0.015, -21.6, 0, 0, 0, false);
  const gymBase = box(groups.site, 0.10, 2.55, 0.10, M.orangeBars, 12.6, 1.27, -23.4);
  tagZone(gymBase, 'Turnik & Sport Majmuasi (1- va 5-rasm)', '~6.8 × 5.0 m', '1-rasmdagi shag‘al ustidagi shved narvoni, qiya press doskasi, yuqori turniklar va brusya.');
  [12.6, 11.4].forEach((tx) => {
    [-23.4, -20.0].forEach((tz) => {
      box(groups.site, 0.10, 2.55, 0.10, M.orangeBars, tx, 1.27, tz);
    });
    for (let ry = 0.45; ry <= 2.35; ry += 0.38) {
      box(groups.site, 0.06, 0.05, 3.4, M.orangeBars, tx, ry, -21.7);
    }
    box(groups.site, 1.25, 0.07, 0.07, M.orangeBars, 12.0, 2.50, -23.4);
    box(groups.site, 1.25, 0.07, 0.07, M.orangeBars, 12.0, 2.50, -20.0);
  });
  [9.8, 7.8].forEach((tx) => {
    [-23.4, -20.0].forEach((tz) => box(groups.site, 0.10, 2.45, 0.10, M.orangeBars, tx, 1.22, tz));
    box(groups.site, 0.08, 0.08, 3.5, M.orangeBars, tx, 2.42, -21.7);
  });
  box(groups.site, 4.9, 0.08, 0.08, M.orangeBars, 10.2, 2.42, -23.4);
  box(groups.site, 4.9, 0.08, 0.08, M.orangeBars, 10.2, 2.42, -20.0);
  box(groups.site, 2.1, 0.12, 0.65, M.orangeBars, 9.6, 0.72, -19.2, 0, 0, -0.42);
  [6.6, 7.4].forEach((tx) => {
    [-22.4, -20.8].forEach((tz) => box(groups.site, 0.08, 1.35, 0.08, M.orangeBars, tx, 0.68, tz));
    box(groups.site, 1.2, 0.06, 0.06, M.orangeBars, 7.0, 1.32, -22.4);
    box(groups.site, 1.2, 0.06, 0.06, M.orangeBars, 7.0, 1.32, -20.8);
  });

  // Pair 1 (N-S): Twin Golden-Ochre/Cream Yotoqxona Wings + Red-Ribbon Gulzor (Image 2 & 3!)
  box(groups.site, 8.6, 0.05, 36.0, M.concretePath, 28.25, 0.0, -48.5, 0, 0, 0, false);
  box(groups.site, 1.85, 0.08, 33.0, M.grass, 28.25, 0.03, -48.5, 0, 0, 0, false);
  [-0.95, 0.95].forEach((gxOff) => {
    box(groups.site, 0.04, 0.04, 33.0, M.redTape, 28.25 + gxOff, 0.78, -48.5);
    box(groups.site, 0.04, 0.04, 33.0, M.redTape, 28.25 + gxOff, 0.35, -48.5);
    for (let pz = -64.5; pz <= -32.5; pz += 4.0) {
      box(groups.site, 0.06, 0.90, 0.06, M.blackSteel, 28.25 + gxOff, 0.45, pz);
    }
  });
  box(groups.site, 1.9, 0.04, 0.04, M.redTape, 28.25, 0.78, -32.0);
  for (let az = -63, gIdx = 0; az <= -33; az += 5.0, gIdx++) {
    addCypress(groups.site, 28.25, az, 0.78, gIdx);
  }

  // "SHIRIN KULCHA" Bufet (Images 1, 3, 5!)
  const bufetBase = box(groups.dormFloor1, 4.4, 0.22, 4.5, M.whiteMarble, 14.8, 0.11, -32.75, 0, 0, 0, false);
  tagZone(bufetBase, '“SHIRIN KULCHA” Maktab Bufeti (5-rasm)', '4.4 × 4.5 × 3.0 m', '5-rasmdagi oq romli vitraj bufet pavilyoni: SHIRIN KULCHA non bezagi va (97) 811-10-59 raqami.');
  box(groups.dormExterior, 4.4, 1.15, 0.12, M.whiteTrim, 14.8, 0.65, -30.55);
  box(groups.dormExterior, 2.5, 1.45, 0.10, M.clearGlass, 13.85, 1.95, -30.55);
  box(groups.dormExterior, 1.65, 2.55, 0.12, M.shirinKulcha, 15.95, 1.40, -30.53);
  box(groups.dormExterior, 0.12, 2.55, 4.5, M.shirinKulcha, 12.66, 1.40, -32.75);
  box(groups.dormExterior, 0.12, 1.15, 2.8, M.whiteTrim, 16.94, 0.65, -33.5);
  box(groups.dormFloor1, 2.8, 0.95, 0.65, new THREE.MeshStandardMaterial({ color: 0x0284c7 }), 14.8, 0.70, -32.4);
  const bufetRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 1.1, 4), M.slateRoof);
  bufetRoof.rotation.y = Math.PI / 4;
  bufetRoof.position.set(14.8, 3.25, -32.75);
  groups.dormRoof.add(bufetRoof);

  // Pair 1 Twin N-S Cottages — RICH GOLDEN-OCHRE FIELD EXTERIOR + CREAM ALLEY + TRASH BINS + 4 SAWTOOTH SKYLIGHTS (Images 2, 6, 8!)
  function buildTwinNSWing(cx, width, isEastWing) {
    const len = 36.0, cz = -48.5;
    const hw = width / 2;
    const slab = box(groups.dormFloor1, width, 0.25, len, M.whiteMarble, cx, 0.125, cz, 0, 0, 0, false);
    if (isEastWing) {
      tagZone(slab, '1-juftlik Yotoqxona (Kotejlar · 2-, 3-, 6-rasm)', 'Har biri 36.0 × 7.0 m', '6-rasmdagi tilla-ochiq sariq devorli uzun kotejlar, tomida 4 ta oyna fonar va o‘rtasida yashil gulzor.');
    }
    box(groups.dormExterior, width + 0.08, 0.42, len + 0.08, M.granite, cx, 0.21, cz);
    // Warm Golden-Ochre front & end walls
    box(groups.dormExterior, width, 2.9, 0.24, M.goldenOchre, cx, 1.80, -30.62);
    box(groups.dormExterior, 2.2, 1.45, 0.28, M.whiteTrim, cx, 1.85, -30.60);
    box(groups.dormExterior, 1.9, 1.25, 0.30, M.clearGlass, cx, 1.85, -30.60);

    const outerX = isEastWing ? cx - hw + 0.12 : cx + hw - 0.12;
    const innerX = isEastWing ? cx + hw - 0.12 : cx - hw + 0.12;
    // Field-facing outer wall = Golden-Ochre (Image 6!); inner gulzor alley wall = Cream with Golden-Ochre corner pilasters (Image 2!)
    box(groups.dormExterior, 0.24, 2.9, len, M.goldenOchre, outerX, 1.80, cz);
    box(groups.dormExterior, 0.30, 2.9, 2.6, M.goldenOchre, innerX, 1.80, -31.8);
    box(groups.site, 1.1, 0.14, len, M.concretePath, innerX + (isEastWing ? 0.55 : -0.55), 0.07, cz, 0, 0, 0, false);

    for (let s = 0; s < 6; s++) {
      const rz = -33.5 - s * 6.0;
      box(groups.dormExterior, 0.22, 2.9, 4.6, M.dormCream, innerX, 1.80, rz + 0.7);
      box(groups.dormExterior, 0.28, 1.45, 1.85, M.whiteTrim, innerX, 1.85, rz + 1.1);
      box(groups.dormExterior, 0.30, 1.25, 1.65, M.clearGlass, innerX, 1.85, rz + 1.1);
      box(groups.dormExterior, 0.28, 1.45, 1.85, M.whiteTrim, outerX, 1.85, rz);
      box(groups.dormExterior, 0.30, 1.25, 1.65, M.clearGlass, outerX, 1.85, rz);
      box(groups.dormExterior, 0.35, 0.48, 0.72, M.acWhite, outerX + (isEastWing ? -0.3 : 0.3), 2.55, rz - 1.5);
      // Gray plastic trash bin along alley walkway (Image 2)
      if (s % 2 === 0) box(groups.dormExterior, 0.48, 0.78, 0.56, M.grayTrim, innerX + (isEastWing ? 0.45 : -0.45), 0.42, rz - 0.5);

      // Furnished 4-bed dorm room interior
      box(groups.dormFloor1, width - 0.6, 2.9, 0.14, M.dormMint, cx, 1.65, rz - 2.9);
      box(groups.dormFloor1, 2.8, 0.03, 3.2, M.carpet, cx, 0.27, rz, 0, 0, 0, false);
      const bedOff = isEastWing ? -1.4 : 1.4;
      box(groups.dormFloor1, 1.95, 1.75, 0.92, M.bunkTeal, cx + bedOff, 1.12, rz - 1.9);
      box(groups.dormFloor1, 1.80, 0.16, 0.84, M.whiteTrim, cx + bedOff, 0.78, rz - 1.9);
      box(groups.dormFloor1, 1.80, 0.16, 0.84, M.whiteTrim, cx + bedOff, 1.68, rz - 1.9);
      box(groups.dormFloor1, 0.92, 1.75, 1.95, M.bunkTeal, cx - bedOff * 0.9, 1.12, rz - 0.8);
      box(groups.dormFloor1, 0.84, 0.16, 1.80, M.whiteTrim, cx - bedOff * 0.9, 0.78, rz - 0.8);
      box(groups.dormFloor1, 0.84, 0.16, 1.80, M.whiteTrim, cx - bedOff * 0.9, 1.68, rz - 0.8);
    }

    const pitchAng = 0.28;
    const slopeW = (width + 1.1) / 2 / Math.cos(pitchAng);
    box(groups.dormRoof, slopeW, 0.14, len, M.silverRoof, cx - width * 0.26, 3.68, cz, 0, 0, pitchAng);
    box(groups.dormRoof, slopeW, 0.14, len, M.silverRoof, cx + width * 0.26, 3.68, cz, 0, 0, -pitchAng);
    box(groups.dormRoof, 0.30, 0.22, len, M.steel, cx, 4.20, cz);

    // 6 bright sawtooth roof skylights above East Cottage (matching DJI Drone 00:00-00:07 & Photos 2, 6, 8!)
    if (isEastWing) {
      for (let sk = 0; sk < 6; sk++) {
        box(groups.dormRoof, 4.6, 0.95, 1.15, M.silverRoof, cx - 0.8, 4.55, -34.0 - sk * 2.1, 0.44, 0, 0);
        box(groups.dormRoof, 4.4, 0.55, 0.12, M.clearGlass, cx - 0.8, 4.75, -33.42 - sk * 2.1);
      }
    }
  }
  buildTwinNSWing(20.5, 7.0, true);
  buildTwinNSWing(36.0, 7.0, false);

  // PAIR 2 (E-W Twin Boys' Yotoqxona Wings spanning to +39.5 + Gulzor Garden in center!)
  const boysLen = 66.7, boysCx = 6.15, boysW = 7.0;
  const gulzorAlley = box(groups.site, boysLen, 0.05, 8.6, M.concretePath, boysCx, 0.0, -77.75, 0, 0, 0, false);
  tagZone(gulzorAlley, 'Bolalar Yotoqxonasi O‘rta Gulzori', '66.7 × 8.5 m', '2 ta yonma-yon Bolalar yotoqxonasi orasidagi ko‘kalamzor gulzor va yurish yo‘lagi.');
  box(groups.site, 61.0, 0.08, 1.65, M.grass, boysCx, 0.03, -77.75, 0, 0, 0, false);
  [-0.90, 0.90].forEach((gzOff) => {
    box(groups.site, 61.0, 0.04, 0.04, M.redTape, boysCx, 0.78, -77.75 + gzOff);
    for (let px = -24.0; px <= 36.0; px += 5.0) {
      box(groups.site, 0.06, 0.90, 0.06, M.blackSteel, px, 0.45, -77.75 + gzOff);
    }
  });
  for (let gx = -22.5, bgIdx = 0; gx <= 34.5; gx += 5.2, bgIdx++) {
    addCypress(groups.site, gx, -77.75, 0.78, bgIdx);
  }

  function buildBoysEWWing(cz, isNorthWing) {
    const slab = box(groups.dormFloor1, boysLen, 0.25, boysW, M.whiteMarble, boysCx, 0.125, cz, 0, 0, 0, false);
    if (isNorthWing) {
      tagZone(slab, 'O‘g‘il Bolalar Yotoqxonasi (2 ta yonma-yon + O‘rta gulzor)', '2 × (66.7 × 7.0 m)', '2-yotoqxonaning chekkasigacha (X = +39.5 m) yetkazilgan, tilla-ochiq sariq devorli va o‘rtasida gulzorli 2 ta bino.');
    }
    box(groups.dormExterior, boysLen + 0.08, 0.42, boysW + 0.08, M.granite, boysCx, 0.21, cz);
    box(groups.dormExterior, 0.24, 2.9, boysW, M.goldenOchre, -27.08, 1.80, cz);
    box(groups.dormExterior, 0.24, 2.9, boysW, M.goldenOchre, 39.38, 1.80, cz);
    box(groups.dormExterior, 0.28, 1.45, 2.2, M.whiteTrim, -27.06, 1.85, cz);
    box(groups.dormExterior, 0.30, 1.25, 1.9, M.clearGlass, -27.06, 1.85, cz);
    box(groups.dormExterior, 0.28, 1.45, 2.2, M.whiteTrim, 39.36, 1.85, cz);
    box(groups.dormExterior, 0.30, 1.25, 1.9, M.clearGlass, 39.36, 1.85, cz);

    const alleyZ = isNorthWing ? cz - 3.38 : cz + 3.38;
    const outerZ = isNorthWing ? cz + 3.38 : cz - 3.38;
    box(groups.dormExterior, boysLen, 2.9, 0.24, M.goldenOchre, boysCx, 1.80, outerZ);
    box(groups.site, boysLen, 0.14, 1.1, M.concretePath, boysCx, 0.07, alleyZ + (isNorthWing ? -0.55 : 0.55), 0, 0, 0, false);

    for (let bx = -24.5; bx <= 35.5; bx += 6.0) {
      box(groups.dormExterior, 4.6, 2.9, 0.22, M.dormCream, bx + 0.7, 1.80, alleyZ);
      box(groups.dormExterior, 1.85, 1.45, 0.28, M.whiteTrim, bx + 1.1, 1.85, alleyZ);
      box(groups.dormExterior, 1.65, 1.25, 0.30, M.clearGlass, bx + 1.1, 1.85, alleyZ);
      box(groups.dormExterior, 1.85, 1.45, 0.28, M.whiteTrim, bx, 1.85, outerZ);
      box(groups.dormExterior, 1.65, 1.25, 0.30, M.clearGlass, bx, 1.85, outerZ);
      box(groups.dormExterior, 0.72, 0.48, 0.35, M.acWhite, bx - 1.4, 2.55, outerZ + (isNorthWing ? 0.30 : -0.30));

      box(groups.dormFloor1, 0.14, 2.9, boysW - 0.6, M.dormMint, bx - 2.9, 1.65, cz);
      box(groups.dormFloor1, 3.2, 0.03, 2.8, M.carpet, bx, 0.27, cz, 0, 0, 0, false);
      const bOff = isNorthWing ? 1.4 : -1.4;
      box(groups.dormFloor1, 1.95, 1.75, 0.92, M.bunkTeal, bx - 1.5, 1.12, cz + bOff);
      box(groups.dormFloor1, 1.80, 0.16, 0.84, M.whiteTrim, bx - 1.5, 0.78, cz + bOff);
      box(groups.dormFloor1, 1.80, 0.16, 0.84, M.whiteTrim, bx - 1.5, 1.68, cz + bOff);
      box(groups.dormFloor1, 0.92, 1.75, 1.95, M.bunkTeal, bx + 1.5, 1.12, cz + bOff * 0.5);
      box(groups.dormFloor1, 0.84, 0.16, 1.80, M.whiteTrim, bx + 1.5, 0.78, cz + bOff * 0.5);
      box(groups.dormFloor1, 0.84, 0.16, 1.80, M.whiteTrim, bx + 1.5, 1.68, cz + bOff * 0.5);
    }

    const pitchAng = 0.28;
    const slopeD = (boysW + 1.1) / 2 / Math.cos(pitchAng);
    box(groups.dormRoof, boysLen + 0.6, 0.14, slopeD, M.silverRoof, boysCx, 3.68, cz + boysW * 0.26, pitchAng, 0, 0);
    box(groups.dormRoof, boysLen + 0.6, 0.14, slopeD, M.silverRoof, boysCx, 3.68, cz - boysW * 0.26, -pitchAng, 0, 0);
    box(groups.dormRoof, boysLen + 0.6, 0.22, 0.30, M.steel, boysCx, 4.20, cz);
  }
  buildBoysEWWing(-70.0, true);
  buildBoysEWWing(-85.5, false);

  [[-4.0, -94.2], [-1.6, -94.2], [-4.0, -91.9], [-1.6, -91.9]].forEach(([wx, wz]) => {
    box(groups.dormExterior, 0.18, 9.6, 0.18, M.steel, wx, 4.8, wz);
  });
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 2.8, 18), M.steel);
  tank.position.set(-2.8, 10.6, -93.05);
  tank.castShadow = true;
  groups.dormExterior.add(tank);

  // Plain Empty Dirt Field (zero overlap, nothing on field)
  const fieldMesh = box(groups.site, 44.3, 0.04, 48.5, M.dirtField, -5.35, -0.008, -42.25, 0, 0, 0, false);
  tagZone(fieldMesh, 'Ochiq Tekis Yer Maydoni', '44.3 × 48.5 m (~2 150 m²)', 'Yotoqxonalar oldidagi tekis oddiy yer maydoni.');

  // =========================================================
  // 5. SCALE VEHICLES
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
  lada.position.set(-7.3, 0, 18.8);
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

  const damas = new THREE.Group();
  const damasBlue = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.25 });
  box(damas, 1.40, 1.58, 3.48, damasBlue, 0, 1.04, 0);
  box(damas, 1.42, 0.56, 2.65, M.bronzeGlass, 0, 1.38, -0.1);
  [[-0.65, 1.0], [0.65, 1.0], [-0.65, -1.0], [0.65, -1.0]].forEach(([wx, wz]) => {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 14), M.blackSteel);
    wh.rotation.z = Math.PI / 2;
    wh.position.set(wx, 0.24, wz);
    damas.add(wh);
  });
  damas.position.set(25.4, 0, -34.5);
  tagZone(damas.children[0], 'Daewoo Damas (40 T 038 QA)', '3.48 × 1.40 × 1.92 m', '2 ta yotoqxona qanoti orasidagi yo‘lakda turgan ko‘k Damas.');
  groups.cars.add(damas);

  // 4 White Turon School Minibuses Parked Along A-376 Apron (Visible in DJI Drone 00:00-00:03!)
  [-22.0, -11.5, -1.5, 12.5].forEach((vx, vIdx) => {
    const van = new THREE.Group();
    box(van, 1.85, 1.80, 4.65, M.whiteTrim, 0, 1.15, 0);
    box(van, 1.88, 0.62, 3.90, M.bronzeGlass, 0, 1.45, -0.15);
    box(van, 0.90, 0.18, 0.85, M.acWhite, 0, 2.12, -0.2);
    [[-0.85, 1.35], [0.85, 1.35], [-0.85, -1.35], [0.85, -1.35]].forEach(([wx, wz]) => {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.20, 14), M.blackSteel);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(wx, 0.32, wz);
      van.add(wh);
    });
    van.position.set(vx, 0, 37.2);
    van.rotation.y = vIdx % 2 === 0 ? -0.32 : -0.24;
    if (vIdx === 1) tagZone(van.children[0], 'Maktab Mikroavtobuslari (4 dona)', '4.65 × 1.85 m', 'Dron videosida old ko‘cha bo‘ylab tizilib turgan oq o‘quvchi mikroavtobuslari.');
    groups.cars.add(van);
  });

  // =========================================================
  // 6. INTERIOR LIGHTS
  // =========================================================
  const interiorLights = [];
  [[0, 4.8, 7.5, 0x22c55e, 1.8], [0, 8.8, 6.0, 0xfff3d6, 1.6], [0, 0.6, 0, 0xfff8e7, 2.0], [-12.0, 0.8, 0, 0xfff8e7, 2.0], [12.0, 0.8, 0, 0xfff8e7, 2.0], [hubX, 6.0, hubZ, 0xfff3d6, 2.2], [20.5, 2.6, -48.5, 0xfff3d6, 1.4], [6.15, 2.6, -70.0, 0xfff3d6, 1.5], [6.15, 2.6, -85.5, 0xfff3d6, 1.5]].forEach(([lx, ly, lz, col, inten]) => {
    const pl = new THREE.PointLight(col, inten, 36);
    pl.position.set(lx, ly, lz);
    scene.add(pl);
    interiorLights.push(pl);
  });

  return { groups, interactiveZones, animatedFlags, interiorLights };
}
