# “Turon Odob-Ilm” Xususiy Maktabi (Furqat Filiali) — 1:1 Arxitektura Pasporti va Texnik Spetsifikatsiya

> **Maqsad:** Ushbu hujjat Furqat tumanidagi **“Turon odob-ilm” xususiy maktabi** majmuasining sun’iy yo‘ldosh xaritasi (OpenStreetMap `way/1497716115`, ArcGIS World Imagery), rasmiy foto-hisobotlar (`fergana.uz`, `@turonodobilm_furqat`) va taqdim etilgan **12 ta real fotosurat** asosida tuzilgan **1:1 me’moriy-texnik pasporti**dir.

---

## 1. Geografik joylashuv va Bosh reja (Masterplan)

| Ko‘rsatkich | Qiymati | Manba / Aniqlik darajasi |
| :--- | :--- | :--- |
| **Rasmiy manzil** | Farg‘ona viloyati, Furqat tumani, Navbahor shaharchasi, Yangi MFY, Surpa ko‘chasi, 405-uy | Rasmiy sayt / Yandex Maps |
| **Google Maps belgisi** | `FPGX+82H Turon odob-ilm xususiy maktabi, A-376, Chirkay` | Maktab ulashgan Google Maps havolasi |
| **Markaz koordinatasi** | `40.475804° N, 70.746408° E` | OpenStreetMap (`way/1497716115`) |
| **Fasad yo‘nalishi (Azimut)** | **337.5° (Shimoli-g‘arb — NNW)**, to‘g‘ridan-to‘g‘ri **A-376 (“Qo‘qon — Beshariq”)** magistral yo‘liga qaragan | OSM vektor hisobi |
| **Asosiy hovli uchastkasi** | `~58 m × 43 m` (**~2 490 m²**) | Sun’iy yo‘ldosh o‘lchovi (`0.586 m/px`) |
| **Orqa hovli / sport maydoni** | `~27.5 m × 45.6 m` (**1 254 m²**) | OSM (`way/1497716114`) va `@turonodobilm_furqat/11142` |
| **Qo‘shni obyektlar** | Sharqda — **Furqat tumani 37-maktab** (`way/450557460`); G‘arbda — kottej turar-joylar va **Innovation Hub** | OSM + sun’iy yo‘ldosh + fotolar |

---

## 2. Fotogrammetrik kalibrlash (O‘lcham va balandliklarni topish usuli)

Ochiq internet manbalarida kadastr balandligi metrda e’lon qilinmagani sababli, o‘lchamlar va balandliklar **uchta mustaqil real etalon** yordamida kalibrlandi:
1. **OSM bino konturi (`way/1497716115`):** Orqa devor — `43.37 m`, yon devorlar — `18.46 m` / `18.94 m`, oldingi chiqib turgan markaziy blok eni — `10.64 m`, qurilish osti maydoni — `856.0 m²`.
2. **VAZ-2106 avtomobili va kirish zinalari (1-rasm):** VAZ-2106 zavod balandligi `1.446 m` bo‘lib, rasmda zinalarning yuqori maydonchasi (`9` ta zina ko‘tarilishi) bilan deyarli bir sathda (`67 px = 1.45 m`) turibdi. Zina tutqichi (`0.95 m`) va qo‘sh shisha eshik (`2.40 m`) ham aynan shu masshtabni (`~33.5–34.7 px/m` portal tekisligida; `~32 px/m` qanot tekisligida) tasdiqlaydi.
3. **Ichki pol kafellari (`0.60 × 0.60 m`) va tatami (`1.0 × 1.0 m`):** 10- va 11-rasmlarda foyedagi oq-qora marmar kafellar (`4 ta oq + 2 ta qora hoshiya = 3.60 m` markaziy yo‘lak; `2.60 m` yo‘lak eni) va Taekwondo zalidagi `1×1 m` tatamilar orqali xona o‘lchamlari aniqlandi.
4. **Innovation Hub etaloni (6-rasm):** Kirish eshigi yonidagi odam (`~1.72 m`, `146 px`) orqali `~84.9 px/m` masshtabi olinib, binoning balandligi va qismlar eni hisoblandi.

---

## 3. Binolar bo‘yicha 1:1 o‘lcham, maydon va hajm jadvali

### 3.1. Asosiy o‘quv binosi (`B blok`)
* **Tuzilishi:** 1 ta yarim yerto‘la (`tsokol`) + 2 ta to‘liq yer usti qavati (`1-qavat`, `2-qavat`) + parapetli tekis tom.
* **Gorizontal o‘lchamlari:**
  * Umumiy uzunligi (Sharq–G‘arb): **`43.37 m`**
  * Qanotlar chuqurligi (Shimol–Janub): **`18.94 m`**
  * Markaziy qirrali portal: kengligi **`10.64 m`** (qanotlar bilan tutash qismi **`16.80 m`**), oldinga **`4.20 m`** chiqib turadi (`+13.67 m` gacha); ustidagi ayvon **`10.80 m × 3.40 m`**
  * Kirish zinapoyasi va pandus: eni **`9.80 m`** (pandus **`1.10 m`**), chuqurligi **`2.70 m`** (`9` ta zina)
  * Sharqiy 1 qavatli qo‘shimcha qanot: **`~5.7 m × 9.0 m × 3.80 m`** (`51.3 m²`, `~195 m³`)
* **Vertikal sathlar (`Y = 0.00 m` — hovli bruschatkasi):**
  * `Tsokol` (yarim yerto‘la) poli: **`-1.70 m`** (shift balandligi `2.95 m`, qavat-qavat `3.15 m`, yerdan chiqib turgan qora granit qismi **`+1.45 m`**)
  * `1-qavat` poli: **`+1.45 m`** (qavat balandligi **`3.80 m`**, toza shift **`3.40 m`**)
  * `2-qavat` poli: **`+5.25 m`** (qavat balandligi **`3.85 m`**, toza shift **`3.45 m`**)
  * Tom plitasi sathı: **`+9.10 m`**
  * Yon qanotlar parapet tepasi: **`+10.70 m`** (parapet **`1.60 m`**)
  * Markaziy portal parapet tepasi: **`+11.35 m`** (parapet **`2.25 m`**)
* **Maydoni va hajmi (`B blok`):**
  * Qurilish osti maydoni: **`856.0 m²`** (sharqiy qanot bilan **`~907 m²`**)
  * Umumiy qavatlar maydoni (3 daraja × 856 m² + sharqiy qanot): **`~2 619 m²`**
  * Yer usti qurilish hajmi (`Y ≥ 0`): **`~9 405 m³`**
  * Yer osti `tsokol` qismi hajmi (`-1.70..0.00 m`): **`~1 455 m³`**
  * **Jami bino hajmi (to‘liq):** **`~10 860 m³`**

### 3.2. “INNOVATION HUB” IT markazi (2026-yil 28-yanvar)
* **Joylashuvi:** Asosiy darvozadan kirishda darhol o‘ng (g‘arbiy) tomonda, `B blok` hovlisiga yondosh.
* **Tuzilishi:** 2 qavatli + ichida ikki balandlikli (**~6.2 m**) markaziy konferens-zal va antresol balkonli bino.
* **O‘lchamlari:** Uzunligi **`~16.2 m`**, eni **`~11.0 m`**, balandligi **`~7.20 m`**.
* **Maydoni va hajmi:**
  * Qurilish osti maydoni: **`~178 m²`**
  * Umumiy qavatlar maydoni (1-qavat zal/resepshn + 2-qavat antresol va IT sinfxonasi): **`~275 m²`**
  * **Umumiy hajmi:** **`~1 280 m³`**

### 3.3. Hovli kichik inshootlari
* **Qo‘l yuvish / ichimlik suvi nuqtasi (`Tashna`):** Sharqiy hovlida, `~3.20 m × 1.10 m × 1.75 m` (oq kafel, 2 ta jo‘mrak, sovun idishlari, tepasida yoritgich ustuni).
* **3 ta bayroq ustuni:** G‘arbiy old hovlida, balandligi `~9.5 m` (O‘zbekiston, Buyuk Britaniya, Rossiya bayroqlari).
* **Old panjara va klumba:** Oqish g‘isht ustunlar, qora metall panjara, `6` ta axborot banneri va terrakota toshli past klumba devori.

---

## 4. Qavatma-qavat xonalar jadvali (Tasdiqlangan vs Rekonstruksiya)

> *Izoh: ✅ = Rasmiy fotolar va xabarlardan bevosita tasdiqlangan; 📐 = Bino konstruksiyasi va koridor/deraza bo‘linishidan me’moriy rekonstruksiya qilingan.*

| Qavat | Xona / Zona nomi | Taxminiy o‘lcham (`m`) | Maydon (`m²`) | Dizayn va jihozlar | Holati |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tsokol (`-1.70 m`)** | **Taekwondo / Sport zali** | `20.0 × 9.5 × 2.95` | `~190` | Qizil-ko‘k `1×1 m` tatami, devor rasmlari, yashil ustun, kontur LED | ✅ |
| **Tsokol (`-1.70 m`)** | **500 o‘rinli Oshxona zali** | `16.0 × 9.5 × 2.95` | `~152` | Pushti-yalpiz-oq devor, ko‘k ustunlar, marmar-ko‘k stollar, dumaloq LED | ✅ |
| **Tsokol (`-1.70 m`)** | **Oshxona pishirish sexi va ombor** | `7.0 × 9.0 × 2.95` | `~63` | Taom tayyorlash bo‘limi (rasmiy postda alohida ekani aytilgan) | ✅/📐 |
| **Tsokol (`-1.70 m`)** | **Garderob / Texnik xonalar** | `~10.0 × 10.0` | `~100` | Qozonxona, elektr shiti, qo‘shimcha zaxira xona | 📐 |
| **1-qavat (`+1.45 m`)** | **Markaziy Foye va Resepshn** | `10.6 × 15.6 × 3.40` | `~165` | Oq-qora marmar pol, kema maketi, *atlas* bezak, qizil-yashil papkali resepshn, to‘q sariq devor | ✅ |
| **1-qavat (`+1.45 m`)** | **G‘arbiy va Sharqiy koridorlar** | `2 × (15.9 × 2.6)` | `~83` | `0.60×0.60` marmar pol, yashil LED ship, gullar, vitraj devorlar | ✅ |
| **1-qavat (`+1.45 m`)** | **G‘arbiy qanot vitraj sinflari (3 ta)** | `3 × (5.3 × 7.5)` | `~119` | Boshlang‘ich sinflar: rangli devorlar, yulduzsimon ship, rangli partalar | ✅ |
| **1-qavat (`+1.45 m`)** | **G‘arbiy qanot oldingi sinflari (2 ta)** | `2 × (6.6 × 7.5)` | `~99` | Oldingi derazalarida bolalar stikerlari bor boshlang‘ich sinflar | ✅ |
| **1-qavat (`+1.45 m`)** | **Sharqiy qanot sinf va ma’muriyat (5 ta)** | `~5 × (5.5 × 7.5)` | `~206` | Qorovulxona/ma’muriyat (chap vitraj), direktor/o‘qituvchilar xonasi, sinflar | ✅/📐 |
| **1-qavat (`+1.45 m`)** | **2 ta asosiy zinapoya va sanuzellar** | `2 × 28 + 51` | `~107` | Markaziy qirrali burchaklar / chekka zina + sharqiy 1-qavat qanot | 📐 |
| **2-qavat (`+5.25 m`)** | **Markaziy Kutubxona va o‘quv zali** | `10.6 × 12.0 × 3.45` | `~127` | 1000+ badiiy kitoblar, oq javonlar, 3-bo‘lakli old vitraj | ✅ |
| **2-qavat (`+5.25 m`)** | **IT / Kompyuter xonalari (2 ta)** | `2 × (8.0 × 7.5)` | `~120` | 1-xona: `macOS / Apple` yashil devor; 2-xona: `ChatGPT / SMM` sariq devor, `IMMER` PC | ✅ |
| **2-qavat (`+5.25 m`)** | **Kimyo, Biologiya, Fizika va Tillar** | `6–7 × (5.3–6.6 × 7.5)` | `~290` | Laboratoriya jihozlari, smart-doskalar, ingliz/rus/aniq fan sinflari | ✅/📐 |
| **Innovation Hub** | **Konferens-zal + Resepshn (1-qavat)** | `15.5 × 10.4 × 6.2` | `~161` | Kulrang kreslolar, yog‘och bezakli devor, metall zina | ✅ |
| **Innovation Hub** | **2-qavat Antresol va IT vitraj xonasi** | `10.4 × 5.2 + yo‘lak` | `~85` | Shisha devorli o‘quv kabineti (`OPENAI/APPLE/NVIDIA` stendli xonalar) | ✅ |
| **Hovli / Alohida** | **144 o‘rinli Yotoqxona** | *~36 xona × 4 o‘rin* | *rekonstruksiya* | Moviy devorli xonalar, 2 tadan ikki qavatli ko‘k karavot, shkaf, gilam | ✅ (ichki) |

---

## 5. Materiallar va Ranglar Palitrasi (1:1 dizayn kodlari)

* **Fasad oqish suvoq (`Travertin / Dekorativ`):** `#EDEBE4`
* **To‘q grafit parapet va ustunlar:** `#363B40`
* **Qora granit poydevor (`Tsokol`):** `#1E2126`
* **Bronza/to‘q tusli oyna vitrajlari:** `#3D2F28` (oyna refleksi `#5A4638`)
* **Kirish yozuvi (`TURON ODOB-ILM XUSUSIY MAKTABI`):** `#C8262B` (oq fon `#F4F5F7`)
* **Innovation Hub fasad:** Qizil alyukobond `#B81D24`, To‘q grafit `#2A2E33`, G‘isht plitka `#8E5B43`
* **Ichki foye:** Oq marmar `#F2F2F0`, Qora marmar `#222428`, Yog‘och ustun `#B8926A`, Aksent to‘q sariq devor `#F26522`, Yashil LED ship `#24D970`
* **Hovli bruschatkasi:** Kulrang-oq sakkizburchak plitka (`#B8BCBF` / `#4A4F55`)
