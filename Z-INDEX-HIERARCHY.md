# Z-Index Hierarchy - LOCKED IN App

This document explains the z-index layering system to prevent UI elements from appearing behind each other.

## 🎯 Z-Index Layers (Lowest to Highest)

### **Layer 0: Background Effects** - `z-0`
- Glow effects (decorative)
- Background gradients
- Non-interactive visual elements

### **Layer 10: Main Content** - `z-10`
- Page content (home, profile, explore, social)
- All main content containers
- Regular page elements

### **Layer 40: Sticky Headers** - `z-40`
- Sticky headers on pages (home, dashboard, profile, etc.)
- Ensures headers stay above scrolling content
- Used in: home.tsx, dashboard.tsx, profile.tsx, explore.tsx, social.tsx

### **Layer 100-109: Quick Action Overlay (Protocols)** - `z-[100]` to `z-[109]`
When the "+" button is pressed to show the Dashboard overlay:

- **z-[100]** - Overlay container (parent)
- **z-[101]** - Dark backdrop (clickable to close)
- **z-[102]** - Lightning flash effect
- **z-[105]** - Sheet content (Dashboard)
- **z-[106]** - Dashboard content area

### **Layer 200: Bottom Navigation** - `z-[200]`
- Bottom navigation bar
- Home, Community, Explore, Profile icons
- Always visible above content and overlays

### **Layer 210: Center Plus Button** - `z-[210]`
- The "+" button in the center of bottom nav
- Highest priority to ensure it's always clickable
- Transforms to "X" when overlay is open

---

## ✅ Fixed Issues

### Before Fix:
❌ Quick Action overlay appeared behind main content  
❌ Bottom navigation was behind the overlay  
❌ Plus button could be hidden by overlay backdrop

### After Fix:
✅ Proper layering: Content < Overlay < Navigation < Plus Button  
✅ Backdrop is clickable to close overlay  
✅ All interactive elements are accessible  
✅ No z-index conflicts

---

## 🔧 Implementation Details

### Layout Component (`/app/client/src/components/layout.tsx`)

```tsx
// Main container
<div className="relative overflow-hidden">
  
  {/* Background glows - z-0 */}
  <div className="z-0 ...">Glow effects</div>
  
  {/* Main content - z-10 */}
  <main className="relative z-10">
    {children} {/* Pages with sticky headers at z-40 */}
  </main>
  
  {/* Quick Action Overlay - z-[100] to z-[109] */}
  {isQuickActionOpen && (
    <div className="z-[100]">
      <div className="z-[101]">Backdrop</div>
      <div className="z-[102]">Lightning</div>
      <div className="z-[105]">
        <div className="z-[106]">Dashboard</div>
      </div>
    </div>
  )}
  
  {/* Bottom Nav - z-[200] */}
  <nav className="z-[200]">Navigation</nav>
  
  {/* Center Button - z-[210] */}
  <button className="z-[210]">Plus/Close</button>
  
</div>
```

---

## 📋 Rules for Adding New Components

When adding new UI elements, follow these guidelines:

1. **Regular Page Content**: Use default stacking or `z-10`
2. **Sticky Headers**: Use `z-40` (matches existing pages)
3. **Modals/Dialogs**: Use `z-50` to `z-90`
4. **Overlays**: Use `z-[100]` to `z-[150]`
5. **Toasts/Notifications**: Use `z-[300]` to `z-[400]`
6. **Dropdowns/Tooltips**: Use `z-[500]` to `z-[600]`

### Example: Adding a New Modal

```tsx
// Modal backdrop
<div className="fixed inset-0 z-50 bg-black/50" />

// Modal content
<div className="fixed inset-0 z-[60] flex items-center justify-center">
  <div className="bg-card p-6 rounded-lg">
    Modal content here
  </div>
</div>
```

---

## 🐛 Debugging Z-Index Issues

If an element appears behind another:

1. **Check the parent container** - Ensure it doesn't have `isolation: isolate` or creates a new stacking context
2. **Verify z-index value** - Compare with this hierarchy document
3. **Check for conflicting CSS** - Global styles might override component styles
4. **Use browser DevTools** - Inspect the element and check computed styles
5. **Test with backdrop** - Add a colored background to see layering

### Common Pitfalls:

❌ **Don't use arbitrary z-index values** like `z-[999]` or `z-[9999]`  
❌ **Don't mix positive and negative z-index** without good reason  
❌ **Don't create stacking contexts accidentally** with `transform`, `filter`, etc.

✅ **Follow the hierarchy** defined in this document  
✅ **Use named z-index values** for clarity (consider CSS variables)  
✅ **Document new z-index layers** when adding complex components

---

## 📝 Notes

- The app uses Tailwind's arbitrary values: `z-[100]`, `z-[200]`, etc.
- Standard Tailwind z-index: `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`
- Arbitrary values used for precise control over overlay stacking
- All z-index values are applied via Tailwind classes for consistency

---

**Last Updated:** January 2025  
**Fixed Issues:** Quick Action overlay z-index conflicts  
**Status:** ✅ All z-index conflicts resolved
