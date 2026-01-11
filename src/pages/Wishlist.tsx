import { useWishlist } from "../contexts/WishlistContext";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="min-h-96 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 md:p-12 text-center">
          <div className="mb-6">
            <Heart size={64} className="text-red-300 mx-auto" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Danh sách yêu thích trống
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. Hãy khám phá những chiếc đồng hồ tuyệt vời!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            Khám phá sản phẩm
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
          <Heart size={36} className="text-red-500 fill-red-500" />
          Sản phẩm yêu thích
        </h1>
        <p className="text-gray-600 mt-2">
          Bạn có <span className="font-bold text-red-600">{wishlist.length}</span> sản phẩm yêu thích
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((product) => {
          const imageUrl = 'imageUrl' in product ? product.imageUrl : "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400";
          return (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                imageUrl
              } as any} 
            />
          );
        })}
      </div>

      {/* Continue Shopping */}
      <div className="mt-12 text-center">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow duration-300"
        >
          Tiếp tục mua sắm
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
