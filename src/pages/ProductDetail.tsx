import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import type { Product } from '../types/product';
import { ShoppingCart, ArrowLeft, Star, CheckCircle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await productService.getOne(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleBuyNow = () => {
    if (!product) return;
    navigate('/checkout', {
      state: {
        selectedItems: [{ 
            productId: product.id, 
            quantity: quantity, 
            name: product.title,
            price: product.currentPrice 
        }]
      }
    });
  };

  if (isLoading) return <div className="text-center py-20">Đang tải dữ liệu...</div>;
  if (!product) return <div className="text-center py-20">Không tìm thấy sản phẩm!</div>;

  const discount = Math.round(((product.originalValue - product.currentPrice) / product.originalValue) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header nhỏ */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={20} />
            </button>
            <span className="font-medium text-gray-700 truncate">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-6xl mt-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                
                {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
                <div className="p-4 md:p-8 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                    <img 
                        src={product.imageUrl || 'https://placehold.co/600'} 
                        alt={product.title}
                        className="max-w-full max-h-[500px] object-contain shadow-lg rounded-md"
                    />
                </div>

                {/* CỘT PHẢI: THÔNG TIN */}
                <div className="p-6 md:p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                            {product.type}
                        </span>
                        <span className="text-blue-600 text-sm font-medium uppercase">{product.category}</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-1 mb-6">
                        <div className="flex text-yellow-400">
                            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">(Xem 120 đánh giá)</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-red-600">
                                {product.currentPrice.toLocaleString()} ₫
                            </span>
                            {discount > 0 && (
                                <>
                                    <span className="text-gray-400 line-through mb-1">
                                        {product.originalValue.toLocaleString()} ₫
                                    </span>
                                    <span className="text-red-600 text-sm font-bold bg-red-100 px-2 py-0.5 rounded mb-1">
                                        -{discount}%
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-gray-700 mb-3 text-lg">Thông tin chi tiết</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-gray-500">Mã sản phẩm:</div>
                            <div className="font-medium">#{product.id}</div>
                            
                            <div className="text-gray-500">Tình trạng:</div>
                            <div className="font-medium text-green-600 flex items-center gap-1">
                                {product.quantity > 0 ? (
                                    <><CheckCircle size={14} /> Còn hàng ({product.quantity})</>
                                ) : (
                                    <span className="text-red-500">Hết hàng</span>
                                )}
                            </div>

                            <div className="text-gray-500">Loại sản phẩm:</div>
                            <div className="font-medium">{product.type}</div>

                            <div className="text-gray-500">Trọng lượng:</div>
                            <div className="font-medium">{product.weight} kg</div>
                        </div>
                    </div>

                    <div className="mt-auto border-t pt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-gray-600 font-medium">Số lượng:</span>
                            <div className="flex items-center border rounded-md">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                                >-</button>
                                <input 
                                    type="text" 
                                    value={quantity} 
                                    readOnly 
                                    className="w-12 text-center text-gray-800 font-medium focus:outline-none"
                                />
                                <button 
                                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                    className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                                >+</button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 border border-red-600 text-red-600 bg-red-50 py-3 rounded-md font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition">
                                <ShoppingCart size={20} /> Thêm vào giỏ
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                className="flex-1 bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700 shadow-md transition"
                            >
                                Mua Ngay
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
}