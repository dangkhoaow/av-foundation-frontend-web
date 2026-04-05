# 🏛️ Community Support Image

## 📋 OVERVIEW

This folder contains the decorative sculpture image for the Community Support section.

**Current Status**: 
- ❌ Using expired Figma URL
- ⏳ Waiting for local image upload

---

## 🖼️ IMAGE REQUIRED

### **1. Classical Sculpture Image**

**Current (Expired)**:
```
https://www.figma.com/api/mcp/asset/095c8c88-addd-493c-a59a-92eaf0a36253
```

**Description**: Classical sculpture with decorative elements

**Usage**: Decorative image on the right side of Community Support section

---

## 📐 IMAGE SPECIFICATIONS

### **Responsive Sizes:**

| Breakpoint | Width | Height | Notes |
|------------|-------|--------|-------|
| **Mobile** (< 768px) | Full width | Auto (max 500px) | `object-fit: contain` |
| **Tablet** (768px+) | 350px | 600px | `object-fit: cover` |
| **Desktop** (1024px+) | 400px | 675px | `object-fit: cover` |
| **Wide** (1440px+) | 515px | 869px | `object-fit: cover` |
| **Ultra** (1920px+) | 550px | 920px | `object-fit: cover` |

---

## 🎯 RECOMMENDED EXPORT SIZE

### **From Figma:**

**Option 1: Export for largest size (recommended)**
- **Size**: 550×920px (ultra-wide size)
- **Format**: JPG or WebP
- **Quality**: 85-90%
- Will scale down for smaller viewports

**Option 2: Export 2x for retina**
- **Size**: 1100×1840px (2x)
- **Format**: JPG or WebP
- **Quality**: 80-85%
- Better quality on high-DPI screens

---

## 📁 FILE NAMING

**Save as**: `sculpture.jpg` or `sculpture.webp`

```
public/images/community-support/
└── sculpture.jpg  (or sculpture.webp)
```

---

## 🎨 EXPORT INSTRUCTIONS FROM FIGMA

### **Step 1: Find the Image in Figma**

1. Open Figma file: https://www.figma.com/design/Qkya9H3MyyVlsqXyMumWXF/Art---Venture-Foundation
2. Navigate to Community Support section
3. Find the sculpture/decorative image on the right side

### **Step 2: Select the Image**

1. Click on the sculpture image
2. Make sure you select the **image itself**, not the container
3. Check the Inspector panel (right side) to verify dimensions

### **Step 3: Export Settings**

In the Export panel (bottom right):
1. Click **"+"** to add export setting
2. **Format**: JPG (or WebP for better compression)
3. **Scale**: 
   - **1x** for 550×920px
   - **2x** for 1100×1840px (retina)
4. **Quality**: 85-90% for JPG
5. Click **"Export [name]"**

### **Step 4: Alternative - Use Dev Mode**

1. Switch to **Dev Mode** (toggle in top right)
2. Select the image
3. Look for **"Export"** in the Dev panel
4. Choose format and size
5. Download

---

## 🖼️ IMAGE CHARACTERISTICS

### **Subject:**
- Classical sculpture (statue)
- Decorative elements
- Elegant, artistic composition
- Museum/gallery aesthetic

### **Style:**
- Professional photography
- Clean background
- High contrast
- Artistic lighting

### **Color Palette:**
- Neutral tones (gray, beige)
- Complements section background (#F4F3F1)
- Should maintain visual balance with text content

---

## 💡 OPTIMIZATION TIPS

### **For Best Performance:**

1. **Use WebP format** if possible (better compression)
   - Fallback to JPG for older browsers
   - Can save 30-50% file size

2. **Compress the image**
   - Target: < 200KB for JPG
   - Target: < 150KB for WebP
   - Tools: TinyPNG, Squoosh, ImageOptim

3. **Maintain aspect ratio**
   - Original ratio: ~0.598 (width/height)
   - Don't distort the sculpture

---

## 🔧 AFTER UPLOADING

Once you upload the image, update the component:

**File**: `src/components/sections/CommunitySupport/index.tsx`

**Change from:**
```tsx
<img 
  src="https://www.figma.com/api/mcp/asset/095c8c88-addd-493c-a59a-92eaf0a36253"
  alt="Classical sculpture with decorative elements"
  className="community-support__image-content"
/>
```

**Change to:**
```tsx
<img 
  src="/images/community-support/sculpture.jpg"
  alt="Classical sculpture with decorative elements"
  className="community-support__image-content"
/>
```

---

## 📊 RESPONSIVE BEHAVIOR

### **Mobile (< 768px)**
- Image displays below timeline content
- Full width of container
- Height: auto (max 500px)
- `object-fit: contain` - shows full image

### **Tablet (768px+)**
- Image on right side
- Fixed width: 350px
- Fixed height: 600px
- `object-fit: cover` - fills container

### **Desktop (1024px+)**
- Larger image size
- Width: 400px
- Height: 675px

### **Wide (1440px+)**
- Premium size
- Width: 515px
- Height: 869px

### **Ultra (1920px+)**
- Maximum size
- Width: 550px
- Height: 920px

---

## ✅ CHECKLIST

Before uploading:
- [ ] Image exported from Figma
- [ ] Size: 550×920px minimum (or 1100×1840px for 2x)
- [ ] Format: JPG or WebP
- [ ] Quality: Good (85-90%)
- [ ] File size: < 200KB (optimized)
- [ ] Named: `sculpture.jpg` or `sculpture.webp`
- [ ] Uploaded to: `public/images/community-support/`

After uploading:
- [ ] Update component src path
- [ ] Test on localhost
- [ ] Verify responsive behavior
- [ ] Check image quality on different screens
- [ ] Commit changes
- [ ] Deploy to Vercel

---

## 🎯 EXPECTED RESULT

After implementation:
- ✅ Local image (no expired URL)
- ✅ Fast loading
- ✅ Responsive across all devices
- ✅ Proper aspect ratio maintained
- ✅ Professional appearance
- ✅ Complements timeline content

---

**Upload your sculpture image to this folder and we'll update the component!** 🏛️✨

