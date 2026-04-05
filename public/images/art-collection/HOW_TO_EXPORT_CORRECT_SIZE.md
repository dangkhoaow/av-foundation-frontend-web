# ⚠️ HOW TO EXPORT CORRECT SIZE: 564×798px

## 🔴 VẤN ĐỀ HIỆN TẠI:

Bạn đã export: **564×577px** (Component container)  
Cần export: **564×798px** (Image layer bên trong)

**Hiện tại**: Đã có 2 files:
- `3d3f7041c96861a6ae3fc0a1155ba13b 1.jpg` → 564×577px ❌
- `Component 10.jpg` → 564×577px ❌

---

## ✅ CÁCH EXPORT ĐÚNG 564×798px:

### 📍 **BƯỚC 1: Mở Figma và chọn đúng layer**

1. Mở một trong các component links:
   - [Component 9 - Village](https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-278&m=dev)
   - [Component 10 - Road](https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-279&m=dev)
   - [Component 11 - Body](https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-280&m=dev)
   - [Component 12 - Portrait](https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation?node-id=99-281&m=dev)

2. **ĐỪNG select Component button** (564×577px) ❌
3. **Hãy expand Component** trong layer tree (bấm mũi tên mở rộng) ✅
4. **Tìm layer tên giống**: `"3d3f7041c96861a6ae3fc0a1155ba13b 1"` hoặc tương tự ✅
5. **Click vào IMAGE LAYER này** (không phải component button) ✅

---

### 📍 **BƯỚC 2: Verify kích thước trong Inspector**

Sau khi select **IMAGE layer**, check trong panel bên phải:
- **Width (W)**: `564px` ✅
- **Height (H)**: `798px` ✅

Nếu thấy `577px` height → Bạn đang select sai layer (đang select component thay vì image) ❌

---

### 📍 **BƯỚC 3: Export Image Layer**

1. **Với IMAGE LAYER đã được select** (564×798px):
2. Scroll xuống **Export** section trong panel bên phải
3. Click **"+"** để add export setting:
   - **Format**: JPG
   - **Scale**: 1x
   - **Suffix**: (empty, hoặc để mặc định)
4. Click **"Export [layer name]"** button

**Result**: File sẽ có kích thước **564×798px** ✅

---

## 🎯 TÓM TẮT QUICK:

| Sai ❌ | Đúng ✅ |
|--------|---------|
| Select **Component button** | Select **Image layer** bên trong |
| Export size: 564×**577**px | Export size: 564×**798**px |
| File size: ~250-450KB | File size: ~350-600KB |

---

## 📁 FILE NAMING:

Sau khi export, đổi tên files:

```
Component 9 (node 99:278)  → village-in-fog.jpg
Component 10 (node 99:279) → road-in-rain.jpg
Component 11 (node 99:280) → the-body.jpg
Component 12 (node 99:281) → the-portrait.jpg
```

---

## 🔍 VERIFY KÍCH THƯỚC:

Sau khi export, verify bằng cách:

```bash
cd public/images/art-collection
file *.jpg
```

**Expect**: `564 x 798` ✅  
**NOT**: `564 x 577` ❌

---

## 💡 LƯU Ý:

- **IMAGE layer** trong Figma có kích thước **564×798px**
- **Component container** chỉ hiển thị **564×577px** (phần visible)
- Phần còn lại bị **overflow: hidden** và có **top: -80px**

→ **Export IMAGE LAYER** để có full artwork!

---

## 🎨 ALTERNATIVE: Export từ Dev Mode

1. Chuyển sang **Dev Mode** (toggle ở góc trên phải)
2. Select **IMAGE layer** (không phải component)
3. Trong Dev panel bên phải, tìm section **"Export"**
4. Click **"Export as PNG/JPG"**
5. Choose **JPG**, quality **80-90%**
6. Download và verify size = **564×798px**

---

**Sau khi export đúng 4 files với size 564×798px, upload lại vào folder này! 📤**

---

## ✨ NEXT STEPS (sau khi có đủ 4 files):

1. ✅ Upload 4 artwork images (564×798px each)
2. ✅ Update `ArtCollection` component code
3. ✅ Remove old Figma expired URLs
4. ✅ Test component in browser
5. ✅ Commit changes

