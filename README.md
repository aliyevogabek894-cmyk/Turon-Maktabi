# “Turon Odob-Ilm” Xususiy Maktabi (Furqat) — 1:1 3D Arxitektura Loyihasi

Farg‘ona viloyati, Furqat tumani (Navbahor / Surpa, A-376 yo‘li) da joylashgan **“Turon odob-ilm” xususiy maktabi** hamda **“Innovation Hub”** IT markazining **1:1 masshtabli arxitektura pasporti, 2D qavat rejalari va interaktiv 3D modeli**.

## Loyiha tarkibi
- `index.html` — Three.js asosidagi **1:1 interaktiv 3D arxitektura va yurish (Walkthrough)** sahifasi (qavat kesimlari, 8 ta kamera rakursi, Kunduzi/Oqshom/Tungi LED yoritish).
- `qavat_rejalari.html` — **2D SVG chizmalar** (Bosh reja, Old fasad, Tsokol, 1-qavat, 2-qavat, Innovation Hub).
- `ARXITEKTURA_PASPORTI.md` — Fotogrammetrik hisob-kitoblar, o‘lchamlar, maydon va hajmlar jadvali (`B blok`: `43.37 × 18.94 × 11.35 m`, `Innovation Hub`: `16.2 × 11.0 × 7.2 m`).
- `turon_odob_ilm_3d.glb` — Standart **Binary glTF 2.0** 3D model (Windows 3D Viewer, Blender, Web).
- `turon_odob_ilm_3d.obj` / `.mtl` — **Wavefront OBJ** 3D model (SketchUp, 3ds Max, AutoCAD).
- `export_3d_models.py` — 1:1 `.glb` va `.obj` generator skripti.
- `ISHGA_TUSHIRISH.bat` — Windows’da 1 bosish bilan mahalliy server orqali (`http://localhost:8765/index.html`) ishga tushirish fayli.

## Ishga tushirish
Windows’da `ISHGA_TUSHIRISH.bat` faylini ikki marta bosing yoki terminalda:
```bash
python -m http.server 8765
```
So‘ng brauzerda `http://localhost:8765/index.html` sahifasini oching.
