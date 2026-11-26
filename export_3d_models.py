"""
Exports the v2 non-mirrored 3D architectural model of Turon Odob-Ilm (Furqat branch)
to standard industry formats:
  - turon_odob_ilm_3d.glb  (Binary glTF 2.0: Windows 3D Viewer, Blender, Web)
  - turon_odob_ilm_3d.obj + turon_odob_ilm_3d.mtl (SketchUp, 3ds Max, AutoCAD/Blender)

Coordinate System (matches js/scene_builder.js v2):
  +Z = North (A-376 Highway, Front of BOTH B blok and Innovation Hub)
  -Z = South (Backyard & 2-Story Yotoqxona Dormitory)
  -X = East (Screen LEFT facing school: 37-maktab, Tashna, Orange Lada, 1F East Annex)
  +X = West (Screen RIGHT facing school: Ramp, 3 Flagpoles, West Gate, Innovation Hub)
  1 unit = 1 meter
"""
import json
import math
import os
import struct

OUT_DIR = r"c:\Users\Teacher\Pictures\turon odob ilm"


class MeshBuilder:
    def __init__(self):
        self.materials = {}
        self.mat_order = []
        self.groups = {}

    def add_mat(self, name, rgba, metallic=0.1, roughness=0.7):
        if name not in self.materials:
            self.materials[name] = (rgba, metallic, roughness)
            self.mat_order.append(name)
            self.groups[name] = ([], [], [])

    def add_box(self, mat, cx, cy, cz, w, h, d, ry=0.0):
        pos_list, norm_list, idx_list = self.groups[mat]
        hw, hh, hd = w / 2.0, h / 2.0, d / 2.0
        faces = [
            ((0, 0, 1), [(-hw, -hh, hd), (hw, -hh, hd), (hw, hh, hd), (-hw, hh, hd)]),
            ((0, 0, -1), [(hw, -hh, -hd), (-hw, -hh, -hd), (-hw, hh, -hd), (hw, hh, -hd)]),
            ((1, 0, 0), [(hw, -hh, hd), (hw, -hh, -hd), (hw, hh, -hd), (hw, hh, hd)]),
            ((-1, 0, 0), [(-hw, -hh, -hd), (-hw, -hh, hd), (-hw, hh, hd), (-hw, hh, -hd)]),
            ((0, 1, 0), [(-hw, hh, hd), (hw, hh, hd), (hw, hh, -hd), (-hw, hh, -hd)]),
            ((0, -1, 0), [(-hw, -hh, -hd), (hw, -hh, -hd), (hw, -hh, hd), (-hw, -hh, hd)]),
        ]
        c_ang, s_ang = math.cos(ry), math.sin(ry)
        for (nx, ny, nz), verts in faces:
            base = len(pos_list)
            rnx = nx * c_ang + nz * s_ang
            rnz = -nx * s_ang + nz * c_ang
            for vx, vy, vz in verts:
                rx = vx * c_ang + vz * s_ang + cx
                rz = -vx * s_ang + vz * c_ang + cz
                pos_list.append((rx, vy + cy, rz))
                norm_list.append((rnx, ny, rnz))
            idx_list.extend([base, base + 1, base + 2, base, base + 2, base + 3])

    def export_obj(self, obj_path, mtl_path):
        mtl_name = os.path.basename(mtl_path)
        with open(mtl_path, "w", encoding="utf-8") as fm:
            for m in self.mat_order:
                (r, g, b, a), met, rough = self.materials[m]
                fm.write(f"newmtl {m}\nKd {r:.3f} {g:.3f} {b:.3f}\nd {a:.3f}\nNs {max(10, int((1-rough)*200))}\n\n")
        with open(obj_path, "w", encoding="utf-8") as fo:
            fo.write(f"# Turon Odob-Ilm (Furqat) v2 3D Model (1 unit = 1 meter)\nmtllib {mtl_name}\n")
            v_off = 1
            for m in self.mat_order:
                pos, norm, idx = self.groups[m]
                if not idx:
                    continue
                fo.write(f"g {m}\nusemtl {m}\n")
                for vx, vy, vz in pos:
                    fo.write(f"v {vx:.4f} {vy:.4f} {vz:.4f}\n")
                for nx, ny, nz in norm:
                    fo.write(f"vn {nx:.4f} {ny:.4f} {nz:.4f}\n")
                for i in range(0, len(idx), 3):
                    a, b, c = idx[i] + v_off, idx[i + 1] + v_off, idx[i + 2] + v_off
                    fo.write(f"f {a}//{a} {b}//{b} {c}//{c}\n")
                v_off += len(pos)

    def export_glb(self, glb_path):
        bin_buf = bytearray()
        buffer_views = []
        accessors = []
        primitives = []
        materials = []

        def pad4(b):
            while len(b) % 4 != 0:
                b.append(0)

        for mi, m in enumerate(self.mat_order):
            (r, g, b, a), met, rough = self.materials[m]
            mat_def = {
                "name": m,
                "pbrMetallicRoughness": {
                    "baseColorFactor": [r, g, b, a],
                    "metallicFactor": met,
                    "roughnessFactor": rough,
                },
            }
            if a < 0.99:
                mat_def["alphaMode"] = "BLEND"
            materials.append(mat_def)

            pos, norm, idx = self.groups[m]
            if not idx:
                continue

            pos_off = len(bin_buf)
            min_p = [min(p[k] for p in pos) for k in range(3)]
            max_p = [max(p[k] for p in pos) for k in range(3)]
            for p in pos:
                bin_buf.extend(struct.pack("<3f", *p))
            pad4(bin_buf)
            bv_pos = len(buffer_views)
            buffer_views.append({"buffer": 0, "byteOffset": pos_off, "byteLength": len(pos) * 12, "target": 34962})
            acc_pos = len(accessors)
            accessors.append({"bufferView": bv_pos, "componentType": 5126, "count": len(pos), "type": "VEC3", "min": min_p, "max": max_p})

            norm_off = len(bin_buf)
            for n in norm:
                bin_buf.extend(struct.pack("<3f", *n))
            pad4(bin_buf)
            bv_norm = len(buffer_views)
            buffer_views.append({"buffer": 0, "byteOffset": norm_off, "byteLength": len(norm) * 12, "target": 34962})
            acc_norm = len(accessors)
            accessors.append({"bufferView": bv_norm, "componentType": 5126, "count": len(norm), "type": "VEC3"})

            idx_off = len(bin_buf)
            for ix in idx:
                bin_buf.extend(struct.pack("<I", ix))
            pad4(bin_buf)
            bv_idx = len(buffer_views)
            buffer_views.append({"buffer": 0, "byteOffset": idx_off, "byteLength": len(idx) * 4, "target": 34963})
            acc_idx = len(accessors)
            accessors.append({"bufferView": bv_idx, "componentType": 5125, "count": len(idx), "type": "SCALAR"})

            primitives.append({"attributes": {"POSITION": acc_pos, "NORMAL": acc_norm}, "indices": acc_idx, "material": mi})

        gltf = {
            "asset": {"version": "2.0", "generator": "Turon Odob-Ilm v2 Python Exporter"},
            "scene": 0,
            "scenes": [{"nodes": [0]}],
            "nodes": [{"mesh": 0, "name": "Turon_Odob_Ilm_Furqat_v2"}],
            "meshes": [{"primitives": primitives, "name": "CampusMesh"}],
            "materials": materials,
            "accessors": accessors,
            "bufferViews": buffer_views,
            "buffers": [{"byteLength": len(bin_buf)}],
        }
        json_bytes = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
        while len(json_bytes) % 4 != 0:
            json_bytes += b" "

        total_len = 12 + 8 + len(json_bytes) + 8 + len(bin_buf)
        with open(glb_path, "wb") as f:
            f.write(struct.pack("<3I", 0x46546C67, 2, total_len))
            f.write(struct.pack("<2I", len(json_bytes), 0x4E4F534A))
            f.write(json_bytes)
            f.write(struct.pack("<2I", len(bin_buf), 0x004E4942))
            f.write(bin_buf)


def build_model():
    mb = MeshBuilder()
    mb.add_mat("Stucco_Cream", (0.92, 0.91, 0.87, 1.0), 0.05, 0.78)
    mb.add_mat("Charcoal_Parapet", (0.21, 0.23, 0.26, 1.0), 0.35, 0.45)
    mb.add_mat("Gray_Trim", (0.58, 0.61, 0.65, 1.0), 0.12, 0.55)
    mb.add_mat("Granite_Tsokol", (0.11, 0.13, 0.16, 1.0), 0.15, 0.25)
    mb.add_mat("Bronze_Glass", (0.29, 0.22, 0.18, 0.82), 0.30, 0.12)
    mb.add_mat("Clear_Glass", (0.68, 0.84, 0.92, 0.45), 0.20, 0.10)
    mb.add_mat("White_Trim", (0.96, 0.96, 0.97, 1.0), 0.05, 0.45)
    mb.add_mat("Red_Sign", (0.78, 0.12, 0.15, 1.0), 0.20, 0.35)
    mb.add_mat("Paving_Courtyard", (0.70, 0.72, 0.74, 1.0), 0.02, 0.88)
    mb.add_mat("Asphalt_Road", (0.16, 0.18, 0.20, 1.0), 0.02, 0.92)
    mb.add_mat("Lawn_Green", (0.18, 0.42, 0.18, 1.0), 0.00, 0.95)
    mb.add_mat("Hub_Red", (0.73, 0.11, 0.14, 1.0), 0.30, 0.35)
    mb.add_mat("Brick_Plinth", (0.55, 0.33, 0.24, 1.0), 0.05, 0.85)
    mb.add_mat("Steel_Poles", (0.82, 0.85, 0.88, 1.0), 0.85, 0.25)
    mb.add_mat("Dorm_Cream", (0.94, 0.88, 0.73, 1.0), 0.04, 0.75)
    mb.add_mat("Dorm_Mint", (0.51, 0.85, 0.82, 1.0), 0.04, 0.70)
    mb.add_mat("Bunk_Teal", (0.17, 0.48, 0.56, 1.0), 0.10, 0.60)
    mb.add_mat("Orange_Lada", (0.90, 0.39, 0.09, 1.0), 0.20, 0.30)

    # 1. Site Paving, A-376 Road & Lawns
    mb.add_box("Paving_Courtyard", 0.0, -0.04, 10.0, 72.0, 0.08, 46.0)
    mb.add_box("Paving_Courtyard", 10.0, -0.02, 36.5, 115.0, 0.04, 7.2)
    mb.add_box("Paving_Courtyard", 0.0, -0.02, -23.0, 48.0, 0.04, 24.0)
    mb.add_box("Asphalt_Road", 10.0, -0.03, 46.2, 120.0, 0.06, 12.0)
    mb.add_box("Lawn_Green", -16.5, 0.03, 13.6, 13.0, 0.08, 4.4)
    mb.add_box("Lawn_Green", 16.5, 0.03, 13.6, 13.0, 0.08, 4.4)

    # 2. B blok Main Building (48.0 x 21.0 m, Roof Y=9.70, Wings +11.50, Portal +12.30)
    # Tsokol Floor (-1.80) + Plinth (0..1.50) + 1F (+1.50) + 2F (+5.60) + Roof (+9.70)
    mb.add_box("Granite_Tsokol", 0.0, -1.72, 0.0, 48.0, 0.18, 21.0)
    mb.add_box("Granite_Tsokol", 0.0, 0.75, 0.0, 48.0, 1.50, 21.0)
    mb.add_box("Granite_Tsokol", 0.0, 0.75, 12.8, 12.0, 1.50, 4.6)

    # Exterior Wing Front Walls (Z = +10.28) + Parapets + Window Bays
    for start_x, d in ((-9.2, -1), (9.2, 1)):
        for b in range(4):
            cx = start_x + d * (2.05 + b * 3.55)
            mb.add_box("Stucco_Cream", cx - d * 1.78, 5.0, 10.28, 1.90, 7.0, 0.44)
            mb.add_box("Gray_Trim", cx - d * 1.78, 8.55, 10.30, 2.05, 0.16, 0.50)
            mb.add_box("Gray_Trim", cx - 0.85, 5.4, 10.30, 0.12, 7.8, 0.50)
            mb.add_box("Gray_Trim", cx + 0.85, 5.4, 10.30, 0.12, 7.8, 0.50)
            mb.add_box("Charcoal_Parapet", cx, 9.11, 10.28, 3.62, 1.18, 0.46)
            mb.add_box("Bronze_Glass", cx, 5.45, 10.28, 1.56, 7.75, 0.22)
        mb.add_box("Stucco_Cream", start_x + d * 14.0, 5.0, 10.28, 1.60, 7.0, 0.44)
        mb.add_box("Charcoal_Parapet", start_x + d * 7.4, 10.60, 10.32, 14.85, 1.80, 0.54)

    # Central Portal (Z = +14.88) WITH OPEN CENTRAL DOORWAY!
    mb.add_box("Charcoal_Parapet", -4.75, 5.6, 14.88, 2.5, 8.2, 0.46)
    mb.add_box("Charcoal_Parapet", 4.75, 5.6, 14.88, 2.5, 8.2, 0.46)
    mb.add_box("Stucco_Cream", 0.0, 7.9, 14.88, 7.0, 3.6, 0.42)
    mb.add_box("Stucco_Cream", -2.95, 3.2, 14.88, 1.1, 3.4, 0.42)
    mb.add_box("Stucco_Cream", 2.95, 3.2, 14.88, 1.1, 3.4, 0.42)
    mb.add_box("Charcoal_Parapet", 0.0, 4.35, 14.90, 5.0, 0.65, 0.24)
    mb.add_box("Bronze_Glass", 0.0, 7.85, 14.94, 3.6, 2.9, 0.25)
    mb.add_box("Charcoal_Parapet", 0.0, 11.00, 14.90, 12.1, 2.60, 0.54)

    # 45-deg Chamfers
    ang = math.atan2(4.6, 3.2)
    for s in (-1, 1):
        mb.add_box("Charcoal_Parapet", s * 7.6, 5.6, 12.8, 5.65, 8.2, 0.46, ry=-s * ang)
        mb.add_box("Charcoal_Parapet", s * 7.6, 11.00, 12.8, 5.70, 2.60, 0.54, ry=-s * ang)

    # Portico Canopy, Pillars, Sign, 9 Steps, +X Ramp
    mb.add_box("White_Trim", 0.0, 5.55, 17.02, 12.2, 1.25, 3.85)
    mb.add_box("Charcoal_Parapet", 0.0, 6.28, 17.02, 12.25, 0.28, 3.90)
    mb.add_box("White_Trim", -5.45, 3.25, 18.68, 0.48, 3.5, 0.48)
    mb.add_box("White_Trim", 5.45, 3.25, 18.68, 0.48, 3.5, 0.48)
    mb.add_box("Red_Sign", 0.0, 5.55, 18.98, 9.6, 0.78, 0.08)
    mb.add_box("Red_Sign", 1.2, 6.92, 18.68, 7.8, 0.88, 0.14)
    mb.add_box("Granite_Tsokol", 0.0, 0.75, 16.95, 12.0, 1.50, 3.70)
    for st in range(9):
        sh = 1.50 - st * (1.50 / 9.0)
        sz = 18.80 + st * 0.32
        mb.add_box("Granite_Tsokol", 0.0, sh / 2.0, sz, 11.0, sh, 0.34)
        mb.add_box("White_Trim", -0.6, sh + 0.01, sz + 0.14, 9.6, 0.03, 0.05)

    # Side Walls + East 1-story Annex (-X) + West SW Vestibule (+X) + Rear Wall with Open Courtyard Exit
    mb.add_box("Stucco_Cream", -23.78, 5.6, 0.0, 0.44, 8.2, 21.0)
    mb.add_box("Charcoal_Parapet", -23.78, 10.6, 0.0, 0.46, 1.8, 21.0)
    mb.add_box("Stucco_Cream", -27.1, 2.05, -3.5, 6.2, 4.1, 10.0)
    mb.add_box("Charcoal_Parapet", -27.1, 4.25, -3.5, 6.3, 0.5, 10.1)

    mb.add_box("Stucco_Cream", 23.78, 5.6, 5.8, 0.44, 8.2, 9.4)
    mb.add_box("Stucco_Cream", 23.78, 5.6, -5.8, 0.44, 8.2, 9.4)
    mb.add_box("Charcoal_Parapet", 23.78, 10.6, 0.0, 0.46, 1.8, 21.0)
    mb.add_box("Bronze_Glass", 23.78, 5.4, 0.0, 0.25, 7.2, 1.85)
    mb.add_box("Clear_Glass", 25.0, 1.5, -5.8, 2.4, 3.0, 0.15)
    mb.add_box("Clear_Glass", 25.0, 1.5, -8.8, 2.4, 3.0, 0.15)
    mb.add_box("White_Trim", 25.0, 3.05, -7.3, 2.5, 0.22, 3.2)

    mb.add_box("Stucco_Cream", -13.0, 5.6, -10.28, 22.0, 8.2, 0.44)
    mb.add_box("Stucco_Cream", 13.0, 5.6, -10.28, 22.0, 8.2, 0.44)
    mb.add_box("Stucco_Cream", 0.0, 7.3, -10.28, 4.0, 4.8, 0.44)
    mb.add_box("Charcoal_Parapet", 0.0, 10.60, -10.30, 48.1, 1.80, 0.50)
    for st in range(7):
        sh = 1.50 - st * (1.50 / 7.0)
        mb.add_box("Granite_Tsokol", 0.0, sh / 2.0, -10.7 - st * 0.38, 4.2, sh, 0.38)

    # B blok Roof Slab + 2F Slab + Interior Stairs
    mb.add_box("White_Trim", 0.0, 9.70, 0.0, 48.0, 0.26, 21.0)
    mb.add_box("White_Trim", 0.0, 5.50, 0.0, 40.0, 0.22, 20.6)
    for sx in (-21.8, 21.8):
        for st in range(16):
            mb.add_box("White_Trim", sx, 1.62 + st * (4.10 / 16.0), 2.2 + st * 0.40, 2.6, 0.14, 0.44)

    # 3 Flagpoles (+X West lawn), Tashna (-X East lawn), Orange VAZ-2106 (-X left of stairs)
    for i in range(3):
        mb.add_box("Steel_Poles", 11.2 + i * 2.3, 5.4, 17.6, 0.12, 10.8, 0.12)
    mb.add_box("White_Trim", -24.5, 0.65, 22.0, 4.0, 1.3, 1.1)
    mb.add_box("White_Trim", -24.5, 1.75, 21.6, 3.8, 1.1, 0.25)
    mb.add_box("Orange_Lada", -7.3, 0.56, 18.8, 1.61, 0.62, 4.10)
    mb.add_box("Orange_Lada", -7.3, 1.13, 18.7, 1.46, 0.62, 2.05)

    # 3. INNOVATION HUB (+X Beyond Gate, Facing North +Z A-376 Street!)
    hx, hz = 43.0, 26.25
    mb.add_box("White_Trim", hx, 0.11, hz, 18.0, 0.22, 12.5)
    mb.add_box("Brick_Plinth", 36.4, 0.36, 32.35, 4.8, 0.72, 0.42)
    mb.add_box("Charcoal_Parapet", 36.4, 3.76, 32.35, 4.8, 6.08, 0.38)
    mb.add_box("Clear_Glass", 36.4, 2.05, 32.38, 1.8, 2.0, 0.24)
    for b in range(4):
        rx = 39.0 + b * 4.25
        mb.add_box("Hub_Red", rx, 3.4, 32.35, 0.68, 6.8, 0.45)
        if b < 3:
            gx = rx + 2.125
            mb.add_box("Clear_Glass", gx, 5.4, 32.35, 3.55, 2.4, 0.20)
            mb.add_box("Charcoal_Parapet", gx, 3.6, 32.38, 3.58, 1.25, 0.38)
            if b == 0:
                mb.add_box("Clear_Glass", gx - 0.88, 1.5, 32.35, 1.75, 2.95, 0.20)
            else:
                mb.add_box("Clear_Glass", gx, 1.5, 32.35, 3.55, 2.95, 0.20)
    mb.add_box("Charcoal_Parapet", hx, 7.28, hz, 18.1, 1.05, 12.6)
    mb.add_box("Red_Sign", 45.2, 7.30, 32.60, 10.5, 0.90, 0.14)
    mb.add_box("Charcoal_Parapet", 34.18, 3.4, hz, 0.38, 6.8, 12.5)
    mb.add_box("Charcoal_Parapet", 51.82, 3.4, hz, 0.38, 6.8, 12.5)
    mb.add_box("Charcoal_Parapet", hx, 3.4, 20.18, 18.0, 6.8, 0.38)
    mb.add_box("White_Trim", 42.5, 3.65, 22.6, 13.5, 0.24, 4.8)

    # 4. REAR 2-STORY DORMITORY (YOTOQXONA, 46.0 x 11.0 x 8.1 m, Z = -40.5)
    dz = -40.5
    mb.add_box("Granite_Tsokol", 0.0, 0.325, dz, 46.0, 0.65, 11.0)
    mb.add_box("Dorm_Cream", -12.6, 3.85, -35.15, 20.8, 6.8, 0.35)
    mb.add_box("Dorm_Cream", 12.6, 3.85, -35.15, 20.8, 6.8, 0.35)
    mb.add_box("Dorm_Cream", 0.0, 5.35, -35.15, 4.4, 3.8, 0.35)
    mb.add_box("Dorm_Cream", 0.0, 3.85, -45.82, 46.0, 6.8, 0.35)
    mb.add_box("Dorm_Cream", -22.82, 3.85, dz, 0.35, 6.8, 11.0)
    mb.add_box("Dorm_Cream", 22.82, 3.85, dz, 0.35, 6.8, 11.0)
    mb.add_box("Charcoal_Parapet", 0.0, 7.65, dz, 46.2, 0.95, 11.2)
    mb.add_box("White_Trim", 0.0, 7.25, dz, 46.0, 0.25, 11.0)
    mb.add_box("White_Trim", 0.0, 3.85, dz, 45.4, 0.22, 10.4)
    for base_y in (0.45, 3.96):
        for rx in (-19.5, -13.0, -6.5, 0.0, 6.5, 13.0, 19.5):
            mb.add_box("Dorm_Mint", rx - 3.2, base_y + 1.55, -42.7, 0.16, 3.1, 6.0)
            mb.add_box("Dorm_Mint", rx - 0.65, base_y + 1.55, -39.7, 4.9, 3.1, 0.16)
            mb.add_box("Bunk_Teal", rx - 1.6, base_y + 0.9, -44.8, 2.0, 1.75, 0.95)
            mb.add_box("Bunk_Teal", rx + 2.2, base_y + 0.9, -43.5, 0.95, 1.75, 2.0)

    # 5. Front Fence Pillars along Z = +33.0 & Open West Gate Leaf (+32.5)
    for i in range(13):
        px = -31.5 + i * 4.85
        mb.add_box("Stucco_Cream", px, 1.25, 33.0, 0.48, 2.5, 0.48)
    mb.add_box("Charcoal_Parapet", 32.5, 1.35, 30.8, 0.16, 2.5, 4.6)

    mb.export_glb(os.path.join(OUT_DIR, "turon_odob_ilm_3d.glb"))
    mb.export_obj(os.path.join(OUT_DIR, "turon_odob_ilm_3d.obj"), os.path.join(OUT_DIR, "turon_odob_ilm_3d.mtl"))
    print("EXPORT_V2_SUCCESS")


if __name__ == "__main__":
    build_model()
