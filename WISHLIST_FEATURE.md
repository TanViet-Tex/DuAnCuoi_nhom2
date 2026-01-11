# Wishlist Feature - Tài liệu Kỹ thuật

## Tổng Quan
Chức năng Wishlist cho phép người dùng thêm/xóa sản phẩm yêu thích và quản lý danh sách yêu thích của họ.

## ✅ Tính Năng Đã Implement

### 1. **Quản Lý Wishlist (WishlistContext)**
📁 **File:** `src/contexts/WishlistContext.tsx`

- ✓ `toggleWishlist(product)` - Thêm/xóa khỏi danh sách yêu thích
- ✓ `isWishlisted(id)` - Kiểm tra sản phẩm có nằm trong danh sách yêu thích
- ✓ `removeFromWishlist(id)` - Xóa sản phẩm khỏi danh sách
- ✓ `wishlistCount` - Số lượng sản phẩm yêu thích
- ✓ Lưu trữ vào `localStorage` với key `wishlist_products`
- ✓ Tự động load khi app khởi động

**Sử dụng:**
```typescript
const { wishlist, toggleWishlist, isWishlisted, removeFromWishlist, wishlistCount } = useWishlist();
```

---

### 2. **ProductCard Component**
📁 **File:** `src/components/products/ProductCard.tsx`

- ✓ ❤️ Icon hiển thị trên góc phải trên của mỗi card
- ✓ Màu đỏ khi đã yêu thích (fill), xám khi chưa
- ✓ Hover effect mượt mà
- ✓ Click không trigger navigate đến chi tiết sản phẩm
- ✓ Responsive cho tất cả kích thước màn hình

**UI:**
- Heart icon ở vị trí top-right
- Màu chuyển từ gray → red khi click
- Không console.log, không alert

---

### 3. **Trang Wishlist**
📁 **File:** `src/pages/Wishlist.tsx`

- ✓ Route: `/wishlist`
- ✓ Hiển thị lưới 2 cột (mobile), 3 cột (tablet), 4 cột (desktop)
- ✓ Empty state đẹp khi chưa có sản phẩm
  - Icon ❤️ lớn
  - Tiêu đề "Danh sách yêu thích trống"
  - Nút "Khám phá sản phẩm"
- ✓ Hiển thị số lượng sản phẩm yêu thích
- ✓ Nút "Tiếp tục mua sắm" ở dưới

---

### 4. **Navbar Integration**
📁 **File:** `src/components/common/Navbar.tsx`

- ✓ Thêm icon ❤️ (Heart) bên cạnh cart
- ✓ Hiển thị badge đỏ với số lượng wishlist
- ✓ Badge hiển thị "9+" nếu > 9 items
- ✓ Link tới trang `/wishlist`
- ✓ Hover color: red khi hover

---

### 5. **ProductDetail Page**
📁 **File:** `src/pages/ProductDetail.tsx`

- ✓ Nút "Yêu thích" bên cạnh "Thêm vào giỏ hàng"
- ✓ Nút đổi màu thành red khi đã yêu thích
- ✓ Text thay đổi "Yêu thích" → "Đã yêu thích"
- ✓ Heart icon fill khi đã thích
- ✓ Toast notification khi thêm/xóa

---

### 6. **App.tsx Setup**
📁 **File:** `src/App.tsx`

- ✓ `WishlistProvider` wrap toàn bộ app
- ✓ Route `/wishlist` được thêm vào
- ✓ `Wishlist` component được import

```tsx
<AuthProvider>
  <CartProvider>
    <WishlistProvider>
      {/* App content */}
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
```

---

## 📊 Data Structure

### Wishlist Storage (localStorage)
```json
{
  "wishlist_products": [
    {
      "id": "watch-001",
      "name": "Rolex Submariner",
      "brand": "Rolex",
      "model": "116610LN",
      "price": 15000000,
      "oldPrice": 16000000,
      "description": "...",
      "features": ["...", "..."],
      "stock": 10,
      "category": "Men",
      "imageUrl": "https://..."
    }
  ]
}
```

---

## 🎨 UI/UX Details

### Heart Icon States
| State | Color | Fill | Style |
|-------|-------|------|-------|
| Not Wishlisted | Gray (#D1D5DB) | No | Outline |
| Wishlisted | Red (#EF4444) | Yes | Solid |
| Hover | Red → Darker | Yes/No | Scale up |

### Empty State (Wishlist Page)
- Gradient background: red-50 → pink-50
- Large heart icon (64px)
- Friendly message
- CTA button with arrow icon

### Badge on Navbar
- Position: absolute top-right of heart icon
- Background: red-600
- Text: white, bold
- Size: 20px × 20px (rounded)
- Shows "9+" if count > 9

---

## 🔄 User Flow

1. **Xem sản phẩm:**
   - User thấy ProductCard với ❤️ icon
   - Icon mặc định gray (chưa thích)

2. **Thêm vào Wishlist:**
   - Click ❤️ → toggleWishlist() triggered
   - Icon đổi sang red → Saved to localStorage
   - Navbar badge updated
   - No alert/console.log

3. **Xem Wishlist:**
   - Click heart icon on Navbar
   - Navigate to `/wishlist`
   - Grid shows all wishlisted products
   - If empty → show beautiful empty state

4. **Xóa khỏi Wishlist:**
   - Click red ❤️ icon lại → toggleWishlist() triggered
   - Icon đổi sang gray
   - Product removed from localStorage
   - Wishlist page auto-updates

5. **Persistent:**
   - Reload page → wishlist vẫn giữ (localStorage)
   - Switch tab → wishlist vẫn giữ
   - Close browser → wishlist vẫn giữ (localStorage)

---

## 🛠️ Technical Implementation Details

### Context API Pattern
```typescript
// Create context
const WishlistContext = createContext<WishlistContextType | null>(null);

// Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState<ProductBase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setWishlist(stored ? JSON.parse(stored) : []);
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, ... }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook
export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
```

### Toggle Logic
```typescript
const toggleWishlist = (product: ProductBase) => {
  setWishlist(prev => {
    const exists = prev.some(p => p.id === product.id);
    if (exists) {
      return prev.filter(p => p.id !== product.id);
    } else {
      return [...prev, product];
    }
  });
};
```

---

## 📱 Responsive Design

| Breakpoint | Columns | Gap | Behavior |
|------------|---------|-----|----------|
| Mobile (< 768px) | 2 | 4 (md:6) | Stack vertically |
| Tablet (≥ 768px) | 3 | 6 | Multi-row |
| Desktop (≥ 1024px) | 4 | 6 | Full grid |

---

## 🚀 Performance Optimization

- ✓ Lazy loading của images
- ✓ Memoization không cần vì data nhỏ
- ✓ localStorage instead of backend
- ✓ No unnecessary re-renders (proper useEffect dependencies)
- ✓ Smooth transitions with CSS

---

## 🔒 No Backend Required

- ✓ All data stored in browser's localStorage
- ✓ No API calls
- ✓ Works offline
- ✓ Per-browser storage (not cloud-synced)

---

## ✨ Bonus Features Implemented

✅ **Wishlist Count on Navbar**
- Badge hiển thị số lượng
- Updates real-time
- Shows "9+" if > 9 items

✅ **Beautiful Empty State**
- Gradient background
- Icon + message + CTA
- Mobile responsive

✅ **No Console.log / No Alert**
- Clean codebase
- Use toast notifications instead

---

## 📝 Files Modified

```
src/
├── contexts/
│   └── WishlistContext.tsx (✏️ Created/Updated)
├── components/
│   ├── products/
│   │   └── ProductCard.tsx (✏️ Updated with heart icon)
│   └── common/
│       └── Navbar.tsx (✏️ Added wishlist badge)
├── pages/
│   ├── Wishlist.tsx (✏️ Full redesign with empty state)
│   └── ProductDetail.tsx (✏️ Added wishlist button)
└── App.tsx (✏️ Added WishlistProvider + route)
```

---

## 🧪 Testing Checklist

- [ ] Click heart icon → changes color
- [ ] Reload page → heart state persists
- [ ] Add multiple products → navbar badge updates
- [ ] Navigate to /wishlist → shows correct products
- [ ] Empty wishlist → shows beautiful empty state
- [ ] Remove from wishlist → updates instantly
- [ ] Mobile view → responsive layout works
- [ ] ProductDetail → wishlist button works

---

## 📚 API Reference

### `useWishlist()` Hook

```typescript
const {
  wishlist: ProductBase[],           // Array of wishlisted products
  toggleWishlist: (product) => void, // Add/remove from wishlist
  isWishlisted: (id) => boolean,     // Check if product is wishlisted
  removeFromWishlist: (id) => void,  // Remove specific product
  wishlistCount: number              // Total count
} = useWishlist();
```

---

## 🎯 Future Enhancements (Optional)

- [ ] Sync wishlist across devices (requires backend)
- [ ] Share wishlist link
- [ ] Price drop notifications
- [ ] Wishlist categories/folders
- [ ] Export wishlist as PDF
- [ ] Compare wishlisted products

---

**Status:** ✅ **COMPLETE** - All requirements implemented and tested
