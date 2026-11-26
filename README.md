# “Turon Odob-Ilm” Xususiy Maktabi (Furqat) — 3D Arxitektura Loyihasi (v2)

Farg‘ona viloyati, Furqat tumani (Navbahor / Surpa, **A-376** magistrali) da joylashgan **“Turon odob-ilm” xususiy maktabi**, **“Innovation Hub”** IT markazi hamda **Orqa Yotoqxona** majmuasining interaktiv 3D modeli va 2D arxitektura chizmalari.

## v2 yangilanishlari
- **To‘g‘ri joylashuv va orientatsiya:** Innovation Hub maktabning G‘arbiy (`+X`, darvoza ortidagi) tarafida va **A-376 ko‘chasiga (`+Z`) qarab** joylashtirildi; Sharq (`-X`) va G‘arb (`+X`) bino qismlari haqiqiy rasmlar bilan 100% moslashtirildi.
- **Kengaytirilgan hajm va ichki sayr (`WASD` + PointerLock FPS):** `B blok` (`48.0 × 21.0 × 12.3 m`), `Innovation Hub` (`18.0 × 12.5 × 7.8 m`) va `Orqa Yotoqxona` (`46.0 × 11.0 × 8.1 m`) ochiq eshiklar hamda ishlaydigan zinapoyalar (old zina/pandus, 1F↔2F, 1F↔Tsokol, Hub antresol zinasi) bilan qurildi.
- **Haqiqiy foto teksturalar:** `assets/` papkasida 4- va 6-rasmlardan to‘g‘rilab qirqilgan real bannerlar ishlatildi.

## Loyiha tarkibi
- `index.html` — Three.js 3D sahifasi (FPS yurish, tezkor xonalarga o‘tish, qavat kesimlari, 11 kamera rakursi).
- `js/textures.js` & `js/scene_builder.js` — Teksturalar va 3 binoli 3D sahna moduli.
- `qavat_rejalari.html` — 7 varaqli 2D SVG chizmalar (Masterplan, Old fasad, Tsokol, 1-qavat, 2-qavat, Innovation Hub, Yotoqxona).
- `ARXITEKTURA_PASPORTI.md` — Texnik spetsifikatsiya va foto-o‘lchovlar pasporti.
- `turon_odob_ilm_3d.glb` / `.obj` / `.mtl` va `export_3d_models.py` — glTF 2.0 / OBJ 3D eksport fayllari.
- `ISHGA_TUSHIRISH.bat` — Windows’da `http://localhost:8765/index.html` serverini ochish.

## Ishga tushirish
Windows’da `ISHGA_TUSHIRISH.bat` faylini ishga tushiring yoki terminalda:
```bash
python -m http.server 8765
```
So‘ng brauzerda `http://localhost:8765/index.html` sahifasini oching.
