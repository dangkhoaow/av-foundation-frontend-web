# 🎨 VISUAL EXPLANATION: Component vs Image Layer

## 📊 HIỆN TẠI BẠN ĐÃ EXPORT:

```
┌─────────────────────────────┐
│   Component Container       │ ← 564×577px (Visible area)
│   (This is what you exported) │
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │                     │   │
│  │     Artwork         │   │
│  │                     │   │
│  │                     │   │
│  └─────────────────────┘   │
│                             │
└─────────────────────────────┘

RESULT: 564×577px ❌
```

---

## ✅ CẦN EXPORT:

```
         ┌─────────────────────────────┐
         │   Phần bị crop phía trên   │ ← Hidden (top: -80px)
         │        (80px height)        │
┌────────┼─────────────────────────────┼────────┐
│        │                             │        │
│ Compo- │  ┌─────────────────────┐   │        │
│  nent  │  │                     │   │        │
│ 564×   │  │    IMAGE LAYER      │   │ 798px  │ ← Full artwork
│ 577px  │  │                     │   │ height │
│        │  │   564×798px         │   │        │
│        │  │                     │   │        │
│        │  │  (Export THIS!)     │   │        │
│        │  │                     │   │        │
│        │  │                     │   │        │
└────────┼──┴─────────────────────┘   │        │
         │                             │        │
         │  Phần bị crop phía dưới    │ ← Hidden (overflow)
         │      (221px height)         │        │
         └─────────────────────────────┘        │
                                                 │
         ◄───────────────────────────────────────┘
              EXPORT THIS IMAGE LAYER
                   564×798px ✅
```

---

## 🔍 TẠI SAO CẦN 564×798px?

### **Layout trong Figma:**

```css
/* Component Container */
.component {
  width: 564px;
  height: 577px;
  overflow: hidden; /* Ẩn phần thừa */
}

/* Image Layer bên trong */
.image-layer {
  width: 564px;
  height: 798px;  /* Cao hơn container! */
  position: absolute;
  top: -80px;     /* Đẩy lên trên 80px */
}
```

**Kết quả:**
- **Visible height**: 577px (trong component)
- **Full image height**: 798px (actual artwork)
- **Hidden top**: 80px
- **Hidden bottom**: 798 - 577 - 80 = 141px

---

## 📐 MATH BREAKDOWN:

```
Full Image Height:        798px
─────────────────────────────────
Hidden Top (crop):        -80px  ← Bị đẩy lên trên
─────────────────────────────────
Visible in Component:     577px  ← Phần hiển thị
─────────────────────────────────
Hidden Bottom (overflow): 141px  ← Bị ẩn bởi overflow
─────────────────────────────────
```

**Công thức**: 80 + 577 + 141 = 798px ✅

---

## 🎯 TRONG FIGMA LAYER TREE:

```
📦 Component 9                    ← 564×577px ❌ (Đừng export cái này)
   ├─ 🟥 Background               ← 564×396px
   ├─ 🖼️ IMAGE LAYER               ← 564×798px ✅ (Export cái này!)
   │     "3d3f7041...1155ba13b 1"
   ├─ 🌫️ Gradient Overlay         ← Overlay effects
   ├─ 📝 Title Text               ← "A Village in the fog"
   ├─ 📝 Description Text         ← Lorem ipsum...
   └─ 👤 Artist Info              ← Avatar + name
```

**→ Click vào "🖼️ IMAGE LAYER" và export!**

---

## 🎨 HOW TO FIND IMAGE LAYER:

### **Method 1: Expand Layer Tree**
1. Click vào Component (để active)
2. Press `→` (right arrow) để expand
3. Tìm layer có icon 🖼️ (image icon)
4. Click vào image layer đó
5. Verify trong Inspector: **H: 798px** ✅

### **Method 2: Direct Click**
1. Zoom vào artwork area
2. Click **2 lần** vào artwork image:
   - Lần 1: Select component
   - Lần 2: Select image layer bên trong
3. Verify trong Inspector: **H: 798px** ✅

### **Method 3: Use Layer Search**
1. Press `Cmd + /` (Mac) hoặc `Ctrl + /` (Windows)
2. Search: `3d3f7041` (tên file của image)
3. Click vào result → Sẽ select đúng image layer
4. Export!

---

## ✅ VERIFY ĐÃ SELECT ĐÚNG:

Khi đã select đúng **IMAGE LAYER**, bạn sẽ thấy:

```
┌─ Right Panel (Inspector) ─────┐
│                                │
│  🖼️ Image Layer                │
│                                │
│  W  564                        │
│  H  798  ← Phải là 798! ✅     │
│  X  0                          │
│  Y  -80  ← Có giá trị âm! ✅   │
│                                │
│  ─────────────                │
│  Export                        │
│    + JPG                       │
│    ✓ 1x                        │
│  [Export Image Layer]          │
│                                │
└────────────────────────────────┘
```

**Key indicators:**
- ✅ Height = **798px** (not 577px)
- ✅ Y = **-80px** (negative value)
- ✅ Layer name có chứa image filename

Nếu thấy:
- ❌ Height = **577px** → Đang select Component, không phải Image
- ❌ Y = **0px** → Đang select Component

---

## 🎬 STEP-BY-STEP VIDEO GUIDE:

```
1. Open Figma ───────────────► https://figma.com/...node-id=99-278

2. See Component ───────────► [Button shape, 564×577px]
                              │
                              │ DON'T export this!
                              ▼
3. Expand tree ─────────────► Click ▶ arrow
   or double-click artwork

4. See Image Layer ─────────► 🖼️ "3d3f7041...jpg" (564×798px)
                              │
                              │ Export this!
                              ▼
5. Select Image ────────────► Click on image layer in tree

6. Verify Inspector ────────► W: 564, H: 798 ✅

7. Export Settings ─────────► JPG, 1x, Quality 80-90%

8. Download ────────────────► Save as: village-in-fog.jpg

9. Verify Downloaded ───────► file village-in-fog.jpg
                              → 564 x 798 pixels ✅
```

---

## 📁 EXPECTED FINAL RESULT:

```bash
public/images/art-collection/
├── village-in-fog.jpg     # 564×798px ✅
├── road-in-rain.jpg       # 564×798px ✅
├── the-body.jpg           # 564×798px ✅
└── the-portrait.jpg       # 564×798px ✅
```

**All files**: 564×798px, JPG format, ~300-600KB each

---

## 💡 TIP: Kiểm tra nhanh

Sau khi download, kéo file vào browser và xem properties:
- Right-click → Get Info (Mac) hoặc Properties (Windows)
- Hoặc mở trong Preview/Photos và xem dimensions

**Expect**: **564 × 798 pixels** ✅

---

**Chúc bạn export thành công! 🎨✨**

