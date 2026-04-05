# 🎨 Art Collection Images Export Guide

## 📊 TARGET SIZE: **564×798px**

Đây là kích thước display của mỗi artwork card trong component.

---

## 🖼️ 4 ARTWORKS CẦN EXPORT:

### 1️⃣ **"A Village in the fog"** (Component 9)

- **Figma Node**: `99:278`
- **Link**: https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-278&m=dev
- **Save as**: `village-in-fog.jpg`

### 2️⃣ **"A Road in the rain"** (Component 10)

- **Figma Node**: `99:279`
- **Link**: https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-279&m=dev
- **Save as**: `road-in-rain.jpg`

### 3️⃣ **"The body"** (Component 11)

- **Figma Node**: `99:280`
- **Link**: https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-280&m=dev
- **Save as**: `the-body.jpg`

### 4️⃣ **"The Portrait"** (Component 12)

- **Figma Node**: `99:281`
- **Link**: https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-281&m=dev
- **Save as**: `the-portrait.jpg`

---

## 📋 CÁCH EXPORT ĐÚng KÍCH THƯỚC 564×798px:

### ⚠️ **LƯU Ý QUAN TRỌNG:**

Trong Figma, image layer có kích thước **808×1114px** nhưng nằm trong một container **564×798px** và có thuộc tính:

- `top: -80px` (bị crop 80px ở trên)
- `object-fit: cover`

**→ Bạn cần export CONTAINER (564×798px), KHÔNG phải image layer!**

---

### 🎯 **PHƯƠNG PHÁP 1: Export Container (RECOMMENDED)**

1. **Mở Figma** và truy cập link của từng Component (99:278, 99:279, 99:280, 99:281)

2. **Click vào Component button** (toàn bộ card, không phải chỉ image bên trong)

   - Component này có size **564×577px** (577px là chiều cao visible)
   - Nhưng image bên trong chiếm **564×798px** (từ top -80px)

3. **Cách 1: Export riêng Image Layer**

   - Expand Component tree
   - Tìm layer tên **"3d3f7041c96861a6ae3fc0a1155ba13b 1"** (hoặc tương tự)
   - Click vào image layer này
   - Export với settings:
     - **Format**: JPG
     - **Quality**: 80-90%
     - **Scale**: 0.7x (để từ 808×1114px → 565×780px ≈ 564×798px)

4. **Cách 2: Crop Manual**
   - Export image layer ở scale 1x → 808×1114px
   - Crop bằng tool bên ngoài:
     - Crop top: 80px
     - Crop bottom: 236px
     - Final size: 808×798px
   - Resize về 564×798px (70% scale)

---

### 🎯 **PHƯƠNG PHÁP 2: Screenshot & Crop**

1. **Zoom Figma** đến kích thước hiển thị artwork là **564×798px** trên màn hình

2. **Take screenshot** của vùng artwork (không bao gồm background, gradient, text)

3. **Crop** để có đúng **564×798px**

4. **Save as JPG** với quality 80-90%

---

### 🎯 **PHƯƠNG PHÁP 3: Export Image + Manual Resize**

1. **Export image layer** ở **Scale 1x** → 808×1114px

2. **Open trong image editor** (Photoshop, Figma, Preview, etc.)

3. **Crop theo specs**:

   - **Crop top**: 80px (bỏ phần trên)
   - **Crop bottom**: 236px (bỏ phần dưới)
   - **Keep left/right**: 0px
   - **Result**: 808×798px

4. **Resize** về **564×798px** (70% scale)

   - Width: 808 → 564 (×0.6980)
   - Height: 798 → 798 (keep)

5. **Export as JPG**:
   - Quality: 80-90%
   - Save to `public/images/art-collection/`

---

## 📁 FILE NAMING CONVENTION:

```
public/images/art-collection/
├── village-in-fog.jpg       (564×798px)
├── road-in-rain.jpg         (564×798px)
├── the-body.jpg             (564×798px)
└── the-portrait.jpg         (564×798px)
```

---

## ✅ VERIFY KÍCH THƯỚC:

Sau khi export, verify:

```bash
cd public/images/art-collection
file *.jpg
# Hoặc
identify *.jpg  # (nếu có ImageMagick)
```

**Expected output**: `564x798 pixels`

---

## 🎨 EXPORT SETTINGS SUMMARY:

| Setting     | Value                                     |
| ----------- | ----------------------------------------- |
| Format      | JPG                                       |
| Size        | **564×798px**                             |
| Quality     | 80-90%                                    |
| Color Space | sRGB                                      |
| Scale       | 0.7x (from 808px) or Manual crop + resize |

---

## 💡 TIPS:

1. **Đồng bộ kích thước**: Tất cả 4 images phải có **ĐÚNG** 564×798px
2. **Quality**: 80-90% là đủ cho web, không cần 100%
3. **File size**: Mỗi file nên ~100-300KB
4. **Crop position**: Đảm bảo crop đúng center của artwork

---

## 🔗 QUICK LINKS:

- [Component 9 - Village](https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-278&m=dev)
- [Component 10 - Road](https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-279&m=dev)
- [Component 11 - Body](https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-280&m=dev)
- [Component 12 - Portrait](https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-281&m=dev)

---

**Sau khi export xong 4 files, upload vào folder này! 📤**
