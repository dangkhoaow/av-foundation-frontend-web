# Art Collection Images

## 📁 Directory for Art Collection Images

Upload your artwork images here from Figma.

---

## 🎨 Current Artworks Needed

Based on the ArtCollection component, we need **4 artwork images**:

### **Artwork 1: "A Village in the fog"**
- **Artist**: NGUYEN NAM ARTIST
- **Filename**: `artwork-1.jpg` or `artwork-1-village-fog.jpg`
- **Current URL**: `https://www.figma.com/api/mcp/asset/05c08f23...` ❌ (expired)

### **Artwork 2: "A Road in the rain"**
- **Artist**: HA VY ARTIST
- **Filename**: `artwork-2.jpg` or `artwork-2-road-rain.jpg`
- **Current URL**: `https://www.figma.com/api/mcp/asset/840776cc...` ❌ (expired)

### **Artwork 3: "The body"**
- **Artist**: VINH NGHI ARTIST
- **Filename**: `artwork-3.jpg` or `artwork-3-body.jpg`
- **Current URL**: `https://www.figma.com/api/mcp/asset/ef2da4c7...` ❌ (expired)

### **Artwork 4: "The Portrait"**
- **Artist**: ANH THY ARTIST
- **Filename**: `artwork-4.jpg` or `artwork-4-portrait.jpg`
- **Current URL**: `https://www.figma.com/api/mcp/asset/27944a8c...` ❌ (expired)

---

## 📐 Specifications

### **Image Size:**
- **Display**: 320×400px (card size)
- **Actual**: 320×798px (with -80px offset for cropping effect)
- **Format**: JPG or PNG
- **Quality**: High resolution for retina displays

### **Recommended Export:**
- **Size**: 640×1596px (2x for retina) or larger
- **Format**: JPG (for photos) or PNG (if transparency needed)
- **Quality**: 80-90% (good balance between quality and file size)

---

## 🎨 Export from Figma

### **For Each Artwork:**
1. Select artwork image in Figma
2. Export → **JPG** or **PNG**
3. Settings:
   - **Scale**: 2x (for retina display)
   - **Format**: JPG (recommended for photos)
   - **Quality**: 80-90%
4. Save with descriptive name

### **Suggested Naming:**
```
artwork-1-village-fog.jpg
artwork-2-road-rain.jpg
artwork-3-body.jpg
artwork-4-portrait.jpg
```

**Or simply:**
```
artwork-1.jpg
artwork-2.jpg
artwork-3.jpg
artwork-4.jpg
```

---

## 📊 Expected File Structure

After upload, folder should contain:
```
public/images/art-collection/
├── README.md (this file)
├── artwork-1.jpg (or artwork-1-village-fog.jpg)
├── artwork-2.jpg (or artwork-2-road-rain.jpg)
├── artwork-3.jpg (or artwork-3-body.jpg)
└── artwork-4.jpg (or artwork-4-portrait.jpg)
```

---

## 🔧 After Upload

After you upload the images, I will:
1. ✅ Update ArtCollection component with new image paths
2. ✅ Replace all Figma URLs with local paths
3. ✅ Test images display correctly
4. ✅ Verify card layout and cropping
5. ✅ Commit changes

---

## 📝 Current Component Location

**File**: `src/components/sections/ArtCollection/index.tsx`

**Current artworks array** (lines 60-121):
```tsx
const artworks: Artwork[] = [
  {
    id: 1,
    title: "A Village in the fog",
    artist: "NGUYEN NAM ARTIST",
    image: "https://www.figma.com/api/mcp/asset/..." // ❌ Will be replaced
  },
  {
    id: 2,
    title: "A Road in the rain",
    artist: "HA VY ARTIST",
    image: "https://www.figma.com/api/mcp/asset/..." // ❌ Will be replaced
  },
  {
    id: 3,
    title: "The body",
    artist: "VINH NGHI ARTIST",
    image: "https://www.figma.com/api/mcp/asset/..." // ❌ Will be replaced
  },
  {
    id: 4,
    title: "The Portrait",
    artist: "ANH THY ARTIST",
    image: "https://www.figma.com/api/mcp/asset/..." // ❌ Will be replaced
  }
];
```

**Will become:**
```tsx
image: "/images/art-collection/artwork-1.jpg" // ✅ Local path
```

---

## 🎯 Image Display Details

### **Card Layout:**
- Width: 320px
- Height: 400px
- Image position: `top: -80px` (crops top and bottom)
- Object-fit: `cover`
- Object-position: `center 50%`

### **Hover Effects:**
- Top gradient overlay (133px)
- Bottom gradient overlay (256px)
- Artist info appears
- Card lifts up (`translateY(-8px)`)

---

**Ready to receive your 3 artwork images!** 🎨📤

Upload them to: `/public/images/art-collection/`

