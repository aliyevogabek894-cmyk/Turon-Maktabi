"""
Exports the v2.7 1:1 3D architectural model of Turon Odob-Ilm (Furqat branch)
matching both DJI drone videos (0427_D & 0425_D) + 15+ photos:
  - B blok (kumush qiya profnastil tom + 4 ta fonar + tom baki, 2 ustunli ayvon, 11-bay orqa fasad)
  - Innovation Hub (tom HVAC bloklari + ko'chaga qaragan fasad)
  - Front Batut, 2 ta ko'k Ping-Pong stoli, A-376 mashina va mikroavtobuslar, 37-maktab maydoni
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
            fo.write(f"# Turon Odob-Ilm (Furqat) v2.5 3D Model\nmtllib {mtl_name}\n")
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
            "asset": {"version": "2.0", "generator": "Turon Odob-Ilm v2.5 Exporter"},
            "scene": 0,
            "scenes": [{"nodes": [0]}],
            "nodes": [{"mesh": 0, "name": "Turon_Odob_Ilm_Furqat_v25"}],
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
    mb.add_mat("Paving_Courtyard", (0.66, 0.68, 0.71, 1.0), 0.02, 0.88)
    mb.add_mat("Dirt_Field", (0.55, 0.45, 0.33, 1.0), 0.00, 0.96)
    mb.add_mat("Lawn_Green", (0.18, 0.42, 0.18, 1.0), 0.00, 0.95)
    mb.add_mat("Asphalt_Road", (0.16, 0.18, 0.20, 1.0), 0.02, 0.92)
    mb.add_mat("Hub_Red", (0.73, 0.11, 0.14, 1.0), 0.30, 0.35)
    mb.add_mat("Brick_Plinth", (0.55, 0.33, 0.24, 1.0), 0.05, 0.85)
    mb.add_mat("Steel_Poles", (0.82, 0.85, 0.88, 1.0), 0.85, 0.25)
    mb.add_mat("Golden_Ochre", (0.87, 0.66, 0.31, 1.0), 0.05, 0.72)
    mb.add_mat("Royal_Blue", (0.12, 0.25, 0.69, 1.0), 0.20, 0.45)
    mb.add_mat("Tk_Lime", (0.52, 0.80, 0.09, 1.0), 0.10, 0.45)
    mb.add_mat("Tk_Mat_Blue", (0.36, 0.72, 0.86, 1.0), 0.05, 0.65)
    mb.add_mat("Slate_Roof", (0.44, 0.47, 0.51, 1.0), 0.35, 0.50)
    mb.add_mat("Orange_Metal", (0.92, 0.35, 0.05, 1.0), 0.45, 0.38)
    mb.add_mat("Silver_Roof", (0.81, 0.84, 0.87, 1.0), 0.52, 0.34)
    mb.add_mat("Batut_Blue", (0.01, 0.52, 0.78, 1.0), 0.05, 0.42)
    mb.add_mat("Gazebo_Green", (0.08, 0.33, 0.18, 0.78), 0.05, 0.85)
    mb.add_mat("Damas_Blue", (0.11, 0.31, 0.85, 1.0), 0.25, 0.35)

    # 1. Ground & Alleys
    mb.add_box("Paving_Courtyard", -1.0, -0.04, 10.25, 65.0, 0.08, 45.5)
    mb.add_box("Paving_Courtyard", 28.4, 0.0, 6.0, 8.8, 0.05, 54.0)
    mb.add_box("Paving_Courtyard", 21.0, 0.0, -24.2, 36.5, 0.05, 12.6)
    mb.add_box("Paving_Courtyard", 8.8, 0.0, -30.5, 11.5, 0.05, 7.5)
    mb.add_box("Asphalt_Road", 8.0, -0.03, 46.2, 240.0, 0.05, 12.0)
    mb.add_box("Dirt_Field", -5.35, -0.008, -42.25, 44.3, 0.04, 48.5)
    mb.add_box("Paving_Courtyard", 28.25, 0.0, -48.5, 8.6, 0.05, 36.0)
    mb.add_box("Lawn_Green", 28.25, 0.03, -48.5, 1.85, 0.08, 33.0)
    mb.add_box("Paving_Courtyard", 6.15, 0.0, -77.75, 66.7, 0.05, 8.6)
    mb.add_box("Lawn_Green", 6.15, 0.03, -77.75, 61.0, 0.08, 1.65)

    # 2. B blok (Front + 11-Bay Rear + Interior Podvol/Oshxona/Sportzal!)
    mb.add_box("Royal_Blue", -6.5, 0.1, 0.0, 0.48, 2.95, 19.4)
    mb.add_box("Tk_Mat_Blue", 13.0, -1.52, 0.0, 20.8, 0.08, 19.6)
    mb.add_box("Tk_Lime", 9.2, -0.05, -3.8, 0.56, 2.95, 0.56)
    mb.add_box("Granite_Tsokol", 0.0, 0.275, -10.26, 48.0, 0.55, 0.48)
    for start_x, d in ((-9.2, -1), (9.2, 1)):
        for b in range(4):
            cx = start_x + d * (2.05 + b * 3.55)
            mb.add_box("Stucco_Cream", cx - d * 1.78, 5.0, 10.28, 1.90, 7.0, 0.44)
            mb.add_box("Bronze_Glass", cx, 5.45, 10.28, 1.56, 7.75, 0.22)
        mb.add_box("Charcoal_Parapet", start_x + d * 7.4, 10.60, 10.32, 14.85, 1.80, 0.54)
    mb.add_box("Stucco_Cream", 0.0, 7.9, 14.88, 7.0, 3.6, 0.42)
    mb.add_box("Charcoal_Parapet", 0.0, 11.00, 14.90, 12.1, 2.60, 0.54)
    mb.add_box("White_Trim", 0.0, 5.55, 17.02, 12.2, 1.25, 3.85)
    mb.add_box("Granite_Tsokol", 0.0, 0.75, 16.95, 12.0, 1.50, 3.70)
    mb.add_box("Stucco_Cream", -27.1, 2.05, -3.5, 6.2, 4.1, 10.0)
    mb.add_box("Stucco_Cream", -13.0, 5.12, -10.28, 22.0, 9.15, 0.44)
    mb.add_box("Stucco_Cream", 13.0, 5.12, -10.28, 22.0, 9.15, 0.44)
    mb.add_box("White_Trim", 0.0, 9.95, -10.45, 48.6, 0.42, 0.85)
    for i in range(11):
        rx = -20.5 + i * 4.1
        if abs(rx) >= 1.8:
            mb.add_box("Bronze_Glass", rx, 0.92, -10.28, 1.68, 0.68, 0.52)
            for ry in (4.0, 7.45):
                mb.add_box("Bronze_Glass", rx, ry, -10.28, 1.75, 1.66, 0.52)
    mb.add_box("White_Trim", 0.0, 9.72, 0.0, 48.0, 0.22, 21.0)
    for tier in range(5):
        t = tier / 4.0
        mb.add_box("Silver_Roof", 0.0, 10.12 + t * 2.15, 0.0, 47.6 - t * 15.2, 0.38, 20.6 - t * 19.6)
    for dx in (-15.6, -5.8, 5.8, 15.6):
        mb.add_box("Silver_Roof", dx, 11.48, 3.7, 1.45, 0.65, 1.75)

    # 3. Innovation Hub (+ rooftop HVAC units)
    hx, hz = 43.0, 26.25
    mb.add_box("Brick_Plinth", 36.4, 0.36, 32.35, 4.8, 0.72, 0.42)
    mb.add_box("Charcoal_Parapet", 36.4, 3.76, 32.35, 4.8, 6.08, 0.38)
    for b in range(4):
        rx = 39.0 + b * 4.25
        mb.add_box("Hub_Red", rx, 3.4, 32.35, 0.68, 6.8, 0.45)
        if b < 3:
            mb.add_box("Clear_Glass", rx + 2.125, 3.4, 32.35, 3.55, 6.0, 0.20)
    mb.add_box("Charcoal_Parapet", hx, 7.28, hz, 18.1, 1.05, 12.6)
    mb.add_box("White_Trim", 39.8, 7.62, 25.0, 1.85, 0.78, 1.25)
    mb.add_box("White_Trim", 46.2, 7.62, 25.0, 1.85, 0.78, 1.25)
    mb.add_box("Charcoal_Parapet", 34.18, 3.4, hz, 0.38, 6.8, 12.5)
    mb.add_box("Charcoal_Parapet", 51.82, 3.4, hz, 0.38, 6.8, 12.5)
    mb.add_box("Charcoal_Parapet", hx, 3.4, 20.18, 18.0, 6.8, 0.38)

    # 4. Rear Campus + Batut + 37-Maktab Turf Pitch + 4 Street Vans
    mb.add_box("Batut_Blue", -20.5, 0.65, 25.0, 7.0, 1.3, 4.6)
    mb.add_box("Tk_Mat_Blue", 15.2, 0.76, 18.2, 2.74, 0.08, 1.52)
    mb.add_box("Tk_Mat_Blue", 15.2, 0.76, 20.8, 2.74, 0.08, 1.52)
    mb.add_box("White_Trim", 14.5, 11.95, -5.8, 1.3, 1.45, 1.3)
    mb.add_box("Lawn_Green", -40.5, 0.01, -55.0, 16.0, 0.06, 32.0)
    mb.add_box("Stucco_Cream", 18.15, 1.625, -15.0, 6.7, 3.25, 4.8)
    mb.add_box("Steel_Poles", 16.5, 4.1, -14.2, 0.5, 8.2, 0.5)
    mb.add_box("Steel_Poles", 19.9, 4.1, -14.2, 0.5, 8.2, 0.5)
    mb.add_box("Red_Sign", 21.65, 1.15, -15.0, 0.36, 1.45, 1.15)
    for gx in (7.0, -2.5, -12.0):
        mb.add_box("Gazebo_Green", gx, 1.15, -15.2, 3.25, 2.0, 3.25)
    for tx in (12.6, 11.4, 9.8, 7.8):
        mb.add_box("Orange_Metal", tx, 1.25, -23.4, 0.10, 2.50, 0.10)
        mb.add_box("Orange_Metal", tx, 1.25, -20.0, 0.10, 2.50, 0.10)
    mb.add_box("Golden_Ochre", 37.2, 1.275, -20.8, 4.8, 2.55, 3.6)

    mb.add_box("White_Trim", 14.8, 1.4, -32.75, 4.4, 2.55, 4.5)
    mb.add_box("Silver_Roof", 14.8, 3.0, -32.75, 4.8, 0.55, 4.9)
    for cx in (20.5, 36.0):
        mb.add_box("Golden_Ochre", cx, 1.80, -48.5, 7.0, 2.9, 36.0)
        mb.add_box("Silver_Roof", cx, 3.68, -48.5, 7.9, 0.55, 36.0)
    for cz in (-70.0, -85.5):
        mb.add_box("Golden_Ochre", 6.15, 1.80, cz, 66.7, 2.9, 7.0)
        mb.add_box("Silver_Roof", 6.15, 3.68, cz, 67.3, 0.55, 7.9)
    mb.add_box("Damas_Blue", 25.4, 1.04, -34.5, 1.40, 1.58, 3.48)
    mb.add_box("Steel_Poles", -2.8, 6.0, -93.05, 2.8, 12.0, 2.8)
    mb.add_box("Orange_Metal", -7.3, 0.56, 18.8, 1.61, 0.62, 4.10)
    for vx, col in ((-25.0, "White_Trim"), (-7.8, "Charcoal_Parapet"), (-2.2, "White_Trim"), (3.4, "Gray_Trim"), (19.5, "White_Trim")):
        mb.add_box(col, vx, 1.05, 37.2, 1.75, 1.45, 4.35, 0.25)

    mb.export_glb(os.path.join(OUT_DIR, "turon_odob_ilm_3d.glb"))
    mb.export_obj(os.path.join(OUT_DIR, "turon_odob_ilm_3d.obj"), os.path.join(OUT_DIR, "turon_odob_ilm_3d.mtl"))
    print("EXPORT_V27_SUCCESS")


if __name__ == "__main__":
    build_model()
