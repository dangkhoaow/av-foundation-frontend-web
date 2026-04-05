# Hero Banner Images - 3 Kích Cỡ Màn Hình

## 📁 Folder Structure

```
public/images/hero/
├── 1440/          (Màn hình 1440px)
├── 1920/          (Màn hình 1920px - Full HD)
└── 2200/          (Màn hình 2200px+)
```

---

## 🎨 EXPORT TỪ FIGMA

### Image hiện có trong Figma:
- **Tên**: `1600438d2130ed5f77f3753fe6e8ac02 1`
- **Kích thước gốc**: 2,209 × 2,560 pixels

### Settings Export:

**Format**: JPEG (như ảnh bạn đã chọn)
- ✅ Quality: **High** 
- ✅ Color profile: **sRGB**
- ✅ Image resampling: **Detailed**
- ✅ Ignore overlapping layers: **Checked**

---

## 📐 EXPORT 3 KÍCH CỠ

### 1️⃣ Màn hình 1440px (folder: 1440/)

**Export settings:**
```
Scale: 1.5x (hoặc custom dimensions)
Dimensions: 2160 × 827px (width × height)
Format: JPEG
Quality: High
Filename: hero-1440.jpg
```

**Lưu vào**: `public/images/hero/1440/hero-1440.jpg`

---

### 2️⃣ Màn hình 1920px - Full HD (folder: 1920/)

**Export settings:**
```
Scale: 2x (hoặc custom dimensions)
Dimensions: 2880 × 1100px (width × height)
Format: JPEG
Quality: High
Filename: hero-1920.jpg
```

**Lưu vào**: `public/images/hero/1920/hero-1920.jpg`

---

### 3️⃣ Màn hình 2200px+ (folder: 2200/)

**Export settings:**
```
Scale: 2.5x (hoặc custom dimensions)
Dimensions: 3300 × 1263px (width × height)
Format: JPEG
Quality: High
Filename: hero-2200.jpg
```

**Lưu vào**: `public/images/hero/2200/hero-2200.jpg`

---

## 🎯 WORKFLOW NHANH

### Trong Figma Export Dialog (như ảnh):

1. **Select image** `1600438d2130ed5f77f3753fe6e8ac02`
2. **Click Export button** (bên phải panel)
3. **Set format**: JPEG ✅
4. **Set Quality**: High ✅
5. **Add 3 exports**:

```
Export 1: 1.5x → Rename to "hero-1440.jpg"
Export 2: 2x   → Rename to "hero-1920.jpg"  
Export 3: 2.5x → Rename to "hero-2200.jpg"
```

6. **Click Export** → Download cả 3 files
7. **Move files** vào đúng folders:
   - `hero-1440.jpg` → folder `1440/`
   - `hero-1920.jpg` → folder `1920/`
   - `hero-2200.jpg` → folder `2200/`

---

## 📊 Kích Thước Dự Kiến

| Breakpoint | Dimensions | File Size | Usage |
|------------|-----------|-----------|-------|
| **1440px** | 2160 × 827px | ~300-400KB | Desktop standard |
| **1920px** | 2880 × 1100px | ~500-700KB | Full HD display |
| **2200px** | 3300 × 1263px | ~800KB-1MB | Large monitors |

---

## 📝 NAMING CONVENTION

```
hero-1440.jpg   ← Màn 1440px
hero-1920.jpg   ← Màn 1920px (Full HD)
hero-2200.jpg   ← Màn 2200px+
```

---

## ✅ CHECKLIST

Sau khi export và upload:
- [ ] File `hero-1440.jpg` đã có trong folder `1440/`
- [ ] File `hero-1920.jpg` đã có trong folder `1920/`
- [ ] File `hero-2200.jpg` đã có trong folder `2200/`
- [ ] Tất cả files đều format JPEG, quality High
- [ ] File sizes hợp lý (< 1MB mỗi file)

---

## 🚀 SAU KHI UPLOAD

Khi bạn upload xong 3 files, tôi sẽ:
1. ✅ Verify file names và locations
2. ✅ Optimize images nếu cần (compress)
3. ✅ Update Hero component với responsive images
4. ✅ Implement `<picture>` element với srcset
5. ✅ Add lazy loading
6. ✅ Test trên các breakpoints

---

## 💡 LƯU Ý

- **Crop/Focus**: Đảm bảo focal point (sculptures) vẫn trong frame
- **Aspect ratio**: Có thể khác nhau một chút giữa các sizes
- **Quality**: High quality cho tất cả (web sẽ auto optimize)
- **Format**: JPEG đủ tốt, không cần WebP cho case này

---

**READY!** Bạn có thể bắt đầu export 3 files ngay! 🎯
