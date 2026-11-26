"""
Exports the 1:1 3D architectural model of Turon Odob-Ilm (Furqat branch)
to standard industry formats:
  - turon_odob_ilm_3d.glb  (Binary glTF 2.0: Windows 3D Viewer, Blender, Web)
  - turon_odob_ilm_3d.obj + turon_odob_ilm_3d.mtl (SketchUp, 3ds Max, AutoCAD/Blender)
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
        self.groups = {}  # mat_name -> list of (positions, normals, indices)

    def add_mat(self, name, rgba, metallic=0.1, roughness=0.7):
        if name not in self.materials:
            self.materials[name] = (rgba, metallic, roughness)
            self.mat_order.append(name)
            self.groups[name] = ([], [], [])

    def add_box(self, mat, cx, cy, cz, w, h, d, ry=0.0):
        pos_list, norm_list, idx_list = self.groups[mat]
        hw, hh, hd = w / 2.0, h / 2.0, d / 2.0
        # 6 faces (4 verts each = 24 verts)
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
            fo.write(f"# Turon Odob-Ilm (Furqat) 1:1 3D Model (1 unit = 1 meter)\nmtllib {mtl_name}\n")
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

            # Positions
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

            # Normals
            norm_off = len(bin_buf)
            for n in norm:
                bin_buf.extend(struct.pack("<3f", *n))
            pad4(bin_buf)
            bv_norm = len(buffer_views)
            buffer_views.append({"buffer": 0, "byteOffset": norm_off, "byteLength": len(norm) * 12, "target": 34962})
            acc_norm = len(accessors)
            accessors.append({"bufferView": bv_norm, "componentType": 5126, "count": len(norm), "type": "VEC3"})

            # Indices (uint32)
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
            "asset": {"version": "2.0", "generator": "Turon Odob-Ilm 1:1 Python Exporter"},
            "scene": 0,
            "scenes": [{"nodes": [0]}],
            "nodes": [{"mesh": 0, "name": "Turon_Odob_Ilm_Furqat_1to1"}],
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
    mb.add_mat("Granite_Tsokol", (0.11, 0.13, 0.16, 1.0), 0.15, 0.25)
    mb.add_mat("Bronze_Glass", (0.29, 0.22, 0.18, 0.82), 0.3, 0.12)
    mb.add_mat("White_Trim", (0.96, 0.96, 0.97, 1.0), 0.05, 0.45)
    mb.add_mat("Red_Sign", (0.78, 0.12, 0.15, 1.0), 0.2, 0.35)
    mb.add_mat("Paving_Courtyard", (0.70, 0.72, 0.74, 1.0), 0.02, 0.88)
    mb.add_mat("Asphalt_Road", (0.16, 0.18, 0.20, 1.0), 0.02, 0.92)
    mb.add_mat("Lawn_Green", (0.18, 0.42, 0.18, 1.0), 0.0, 0.95)
    mb.add_mat("Hub_Red", (0.73, 0.11, 0.14, 1.0), 0.3, 0.35)
    mb.add_mat("Brick_Plinth", (0.55, 0.33, 0.24, 1.0), 0.05, 0.85)
    mb.add_mat("Steel_Poles", (0.82, 0.85, 0.88, 1.0), 0.85, 0.25)

    # Site paving & A-376 road
    mb.add_box("Paving_Courtyard", 0, -0.04, 8.0, 58.0, 0.08, 43.0)
    mb.add_box("Asphalt_Road", 0, -0.03, 42.0, 90.0, 0.06, 11.0)
    mb.add_box("Lawn_Green", -15.2, 0.03, 12.2, 12.2, 0.08, 4.2)
    mb.add_box("Lawn_Green", 15.2, 0.03, 12.2, 12.2, 0.08, 4.2)

    # B blok Main Building (43.37 x 18.94 m)
    # Granite Tsokol plinth (0 to 1.45m)
    mb.add_box("Granite_Tsokol", 0, 0.725, 0, 43.37, 1.45, 18.94)
    mb.add_box("Granite_Tsokol", 0, 0.725, 11.57, 10.64, 1.45, 4.20)
    # 1st + 2nd floor main volume (1.45 to 9.10m)
    mb.add_box("Stucco_Cream", 0, 5.275, 0, 43.37, 7.65, 18.94)
    # Wing parapets (9.10 to 10.70m)
    mb.add_box("Charcoal_Parapet", 0, 9.90, 0, 43.45, 1.60, 19.02)
    # Central projecting portal (10.64m wide, +11.35m tall)
    mb.add_box("Stucco_Cream", 0, 5.275, 11.57, 6.24, 7.65, 4.20)
    mb.add_box("Charcoal_Parapet", -4.22, 5.275, 11.57, 2.20, 7.65, 4.20)
    mb.add_box("Charcoal_Parapet", 4.22, 5.275, 11.57, 2.20, 7.65, 4.20)
    mb.add_box("Charcoal_Parapet", 0, 10.225, 11.57, 10.72, 2.25, 4.26)
    # Chamfers
    ang = math.atan2(4.2, 3.08)
    for s in (-1, 1):
        mb.add_box("Granite_Tsokol", s * 6.86, 0.725, 11.57, 5.2, 1.45, 0.45, ry=-s * ang)
        mb.add_box("Charcoal_Parapet", s * 6.86, 5.275, 11.57, 5.2, 7.65, 0.45, ry=-s * ang)
        mb.add_box("Charcoal_Parapet", s * 6.86, 10.225, 11.57, 5.25, 2.25, 0.50, ry=-s * ang)

    # 4 + 4 Vertical Bronze Window Bays + Portal Windows
    for start_x, d in ((-8.40, -1), (8.40, 1)):
        for b in range(4):
            cx = start_x + d * (1.8 + b * 3.15)
            mb.add_box("Bronze_Glass", cx, 5.2, 9.48, 1.42, 7.15, 0.14)
            mb.add_box("Bronze_Glass", cx, 0.85, 9.48, 1.35, 0.52, 0.14)
    mb.add_box("Bronze_Glass", 0, 2.78, 13.70, 4.6, 2.65, 0.16)
    mb.add_box("Bronze_Glass", 0, 7.3, 13.70, 3.2, 2.65, 0.16)
    # West gable stairwell window & vestibule
    mb.add_box("Bronze_Glass", -21.70, 5.1, 0, 0.14, 6.8, 1.65)
    mb.add_box("Bronze_Glass", -22.55, 1.4, -7.2, 2.2, 2.8, 2.8)
    # East 1-story annex
    mb.add_box("Stucco_Cream", 24.5, 1.9, -3.0, 5.7, 3.8, 9.0)
    mb.add_box("Charcoal_Parapet", 24.5, 3.9, -3.0, 5.8, 0.45, 9.1)

    # Portico canopy, columns, 9 steps, sign
    mb.add_box("White_Trim", 0, 5.18, 15.38, 10.80, 1.15, 3.45)
    mb.add_box("White_Trim", -4.90, 3.05, 16.82, 0.44, 3.25, 0.44)
    mb.add_box("White_Trim", 4.90, 3.05, 16.82, 0.44, 3.25, 0.44)
    mb.add_box("Red_Sign", 0, 5.18, 17.13, 8.6, 0.72, 0.08)
    mb.add_box("Red_Sign", 1.0, 6.45, 16.88, 7.2, 0.82, 0.12)
    mb.add_box("Granite_Tsokol", 0, 0.725, 15.32, 10.64, 1.45, 3.30)
    for st in range(9):
        sh = 1.45 - st * (1.45 / 9.0)
        sz = 16.97 + st * 0.30
        mb.add_box("Granite_Tsokol", 0, sh / 2.0, sz, 9.80, sh, 0.32)

    # 3 Flagpoles
    for i in range(3):
        mb.add_box("Steel_Poles", -10.5 - i * 2.1, 4.75, 15.6, 0.12, 9.5, 0.12)

    # Tashna washing fountain
    mb.add_box("White_Trim", 22.5, 0.85, 18.5, 3.2, 1.7, 0.9)

    # Innovation Hub (11.0 x 16.2 x 7.2 m)
    hx, hz = -32.0, 21.5
    mb.add_box("Brick_Plinth", hx, 0.325, hz + 6.0, 11.0, 0.65, 4.2)
    mb.add_box("Charcoal_Parapet", hx, 3.92, hz + 6.0, 11.0, 6.55, 4.2)
    mb.add_box("Charcoal_Parapet", hx, 3.1, hz - 2.0, 10.8, 6.2, 11.8)
    mb.add_box("Charcoal_Parapet", hx, 6.7, hz, 11.1, 1.0, 16.3)
    for b in range(4):
        bz = hz + 3.8 - b * 3.85
        mb.add_box("Hub_Red", hx + 5.3, 3.1, bz, 0.4, 6.2, 0.65)
        if b < 3:
            mb.add_box("Bronze_Glass", hx + 5.32, 3.0, bz - 1.9, 0.22, 6.0, 3.15)

    # Front fence pillars
    for i in range(11):
        px = -20.5 + i * 4.9
        mb.add_box("Stucco_Cream", px, 1.12, 29.5, 0.45, 2.25, 0.45)

    mb.export_glb(os.path.join(OUT_DIR, "turon_odob_ilm_3d.glb"))
    mb.export_obj(os.path.join(OUT_DIR, "turon_odob_ilm_3d.obj"), os.path.join(OUT_DIR, "turon_odob_ilm_3d.mtl"))
    print("EXPORT_SUCCESS")

if __name__ == "__main__":
    build_model()
