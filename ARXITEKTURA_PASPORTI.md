# “Turon Odob-Ilm” Xususiy Maktabi (Furqat Filiali) — Arxitektura Pasporti (v2)

> **Maqsad:** Ushbu hujjat Furqat tumanidagi **“Turon odob-ilm” xususiy maktabi** majmuasining sun’iy yo‘ldosh xaritasi (OpenStreetMap `way/1497716115`, ArcGIS World Imagery), rasmiy foto-hisobotlar (`fergana.uz`, `@turonodobilm_furqat`), taqdim etilgan **12 ta real tashqi/ichki fotosurat** hamda Yotoqxona tasviri (`tg_7058_5.jpg`) asosida tuzilgan arxitektura pasportidir.

---

## 1. Geografik joylashuv va Orientatsiya (v2 Tekislangan)

| Ko‘rsatkich | Qiymati | Manba / Aniqlik darajasi |
| :--- | :--- | :--- |
| **Rasmiy manzil** | Farg‘ona viloyati, Furqat tumani, Navbahor shaharchasi, Yangi MFY, Surpa ko‘chasi, 405-uy | Rasmiy sayt / Yandex Maps |
| **Google Maps belgisi** | `FPGX+82H Turon odob-ilm xususiy maktabi, A-376, Chirkay` | Maktab ulashgan Google Maps havolasi |
| **Markaz koordinatasi** | `40.475804° N, 70.746408° E` | OpenStreetMap (`way/1497716115`) |
| **3D Sahna o‘qlari** | **`+Z` = Shimol (A-376 magistrali)**; **`-Z` = Janub (Orqa hovli + Yotoqxona)**; **`-X` = Sharq (ekran chapi)**; **`+X` = G‘arb (ekran o‘ngi)** | 1–6-rasmlar va sun’iy yo‘ldosh bilan 100% mos |
| **Chap tomonda (`-X`, Sharq)** | `37-maktab`, `Tashna`, olovrang `VAZ-2106`, Sharqiy 1-qavatli qanot, foye ichida Kema maketi | 1-, 2-, 10-rasmlardan tasdiqlangan |
| **O‘ng tomonda (`+X`, G‘arb)** | Kirish zinasi **pandusi**, `3 ta bayroq ustuni`, quyi oynalarda bolalar stikerlari, **G‘arbiy darvoza**, darvoza ortida **A-376 ko‘chasiga qaragan Innovation Hub** | 1-, 4-, 5-, 6-rasmlardan tasdiqlangan |

---

## 2. Fotogrammetrik Asl O‘lchovlar vs Kengaytirilgan 3D v2 Masshtab

* **Asl OSM / Fotogrammetriya bazasi:**
  * `B blok` OSM konturi (`way/1497716115`): **`43.37 × 18.94 m`** (`856.0 m²`), balandligi VAZ-2106 (`1.446 m`) etaloni bo‘yicha `~10.70 / 11.35 m`.
  * `Innovation Hub` odam bo‘yi (`~1.72 m`, `6-rasm`) bo‘yicha boshlang‘ich baho: `~16.2 × 11.0 × 7.20 m`.
* **3D v2 Kengaytirilgan va Erkin Yurish Masshtabi (`~11%` kengaytirilgan):**
  * Foydalanuvchi talabiga binoan koridorlar, sinfxonalar, zinalar va eshiklardan qulay yurish uchun asosiy majmua hajmi kattalashtirildi:
    * **`B blok`:** **`48.0 × 21.0 m`** (qirrali portal bilan `25.6 m`), wing parapet **`+11.50 m`**, portal parapet **`+12.30 m`**; qavat sathi: Tsokol **`-1.52 m`** (plitasi `-1.80 m`), 1-qavat **`+1.50 m`**, 2-qavat **`+5.60 m`**, tom **`+9.70 m`**.
    * **`Innovation Hub`:** **`18.0 × 12.5 × 7.80 m`**, `X ∈ [+34.0, +52.0]`, `Z ∈ [+20.0, +32.5]`, **Shimolga (`+Z`, A-376 ko‘chasiga)** qaragan holatda joylashgan (`1F +0.22 m`, antresol `2F +3.65 m`).
    * **`Orqa Yotoqxona`:** **`46.0 × 11.0 × 8.10 m`** (`2 qavat`, `1F +0.45 m`, `2F +3.96 m`), `B blok` orqa chiqish zinapoyasidan Janubda (`Z ∈ [-46.0, -35.0]`).

---

## 3. Foydalanilgan haqiqiy foto teksturalar (`assets/`)

1. **`assets/hub_banner.jpg`** (`6-rasm`dan perspektiv to‘g‘rilab qirqilgan) — Innovation Hub old fasadidagi *“IT SOHASI BIZ BILAN OSON!”* real banneri.
2. **`assets/fence_banner1.jpg`** & **`assets/fence_banner2.jpg`** (`4-rasm`dan) — G‘arbiy darvoza yonidagi *“TURON ODOB-ILM ENDI XALQARO MAKTAB”* va *“78 113 61 08”* bannerlari.
3. **Fasaddagi bir xil me’moriy elementlar:** Qirrali kulrang deraza rom hoshiyalari, `B blok` o‘ng qanotidagi bolalar stikerlari, 9 ta qora granit zinapoya oldidagi oq chiziqlar hamda 4 ta qizil alyukobond + qora gofra panelli Hub fasadi.

---

## 4. Qavatma-qavat xonalar va ichki yurish marshruti

| Bino / Qavat | Xona / Zona | 3D v2 O‘lcham / Sath | Holati |
| :--- | :--- | :--- | :--- |
| **`B blok` · Tsokol** | Taekwondo / Sport zali (`+X`), 500 o‘rinli Oshxona (`-X`) | `Y = -1.52 m`, `±21.8 m` ichki zina orqali kirish | ✅ |
| **`B blok` · 1-qavat** | Foye (Kema `-X`, Resepshn & to‘q sariq devor `+X`), 6+ vitraj sinf | `Y = +1.50 m`, ochiq `B blok` eshigi va orqa hovli chiqishi | ✅ |
| **`B blok` · 2-qavat** | Markaziy Kutubxona, `macOS / Apple` & `ChatGPT / SMM` IT xonalari | `Y = +5.60 m`, `±21.8 m` ichki zina bilan bog‘langan | ✅ |
| **`Innovation Hub`** | Konferens-zal + Reception (`1F`), Metall zina, Antresol IT vitraj xona (`2F`) | `1F +0.22 m` ↔ `2F +3.65 m`, `A-376` ko‘chasiga qaragan | ✅ |
| **`Orqa Yotoqxona`** | 2 qavatli korpus, L-shaklida 2 tadan ikki qavatli firuza karavotli 4 o‘rinli xonalar | `46.0 × 11.0 × 8.1 m`, `1F +0.45 m`, `2F +3.96 m` | ✅/📐 |

---

## 5. Materiallar va Ranglar Palitrasi

* **Fasad oqish suvoq:** `#EDEBE4` · **Kulrang deraza romi:** `#9EA4AC`
* **To‘q grafit parapet va ustunlar:** `#363B40` · **Qora granit (`Tsokol`):** `#1E2126`
* **Innovation Hub:** Qizil alyukobond `#B81D24`, To‘q grafit gofra `#2A2E33`, G‘isht plitka `#8E5B43`
* **Yotoqxona:** Qaymoqrang tashqi suvoq `#F0E1B9`, Firuza ichki devor `#81D8D0`, To‘q firuza karavotlar `#2C7A8F`
