import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';
import { ShoppingCart, Star, Search } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  
  const { addToCart, totalItems } = useCart(); 

  const loadProducts = async (keyword = '') => {
    try {
      setIsLoading(true);
      const data = await productService.getAll(keyword);
      setProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = () => {
    loadProducts(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getDiscountPercent = (original: number, current: number) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const getTypeColor = (type: string) => {
    switch(type) {
        case 'BOOK': return 'bg-blue-600';
        case 'CD': return 'bg-purple-600';
        case 'DVD': return 'bg-orange-500';
        case 'NEWSPAPER': return 'bg-green-600';
        default: return 'bg-gray-600';
    }
  };

  const handleAddToCartQuick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); 
    
    addToCart({
      productId: product.id,
      type: product.type,
      name: product.title,
      price: product.currentPrice,
      quantity: 1,
      imageUrl: product.imageUrl
    });
    
    alert(`Đã thêm "${product.title}" vào giỏ!`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center gap-4">
          <div className="text-2xl font-bold cursor-pointer flex items-center gap-2" 
               onClick={() => { setSearchTerm(''); loadProducts(''); navigate('/'); }}>
             AIMS <span className="text-xs bg-white text-red-600 px-1 rounded">Market</span>
          </div>

          <div className="flex-1 max-w-2xl hidden md:flex relative">
             <input 
                type="text" 
                placeholder="Tìm sản phẩm..." 
                className="w-full py-2 px-4 rounded-sm text-gray-800 focus:outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
             />
             <button 
                onClick={handleSearch}
                className="absolute right-1 top-1 bottom-1 bg-red-700 px-4 rounded-sm hover:bg-red-800 text-white"
             >
                <Search size={18} />
             </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
             <button onClick={() => navigate('/admin/products')} className="hidden md:block text-xs bg-white/20 px-3 py-1.5 rounded hover:bg-white/30 transition border border-white/40">
                Kênh Người Bán
             </button>

             <div className="relative cursor-pointer hover:opacity-90 transition" onClick={() => navigate('/delivery-info')}>
                <ShoppingCart size={28} />
                {totalItems > 0 && (
                   <span className="absolute -top-1 -right-2 bg-white text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full border border-red-600 shadow-sm min-w-[20px] text-center">
                     {totalItems}
                   </span>
                )}
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-6 max-w-7xl">

        <div className="bg-white p-4 mb-4 border-b-4 border-red-600 sticky top-16 z-40 shadow-sm rounded-t-md flex justify-between items-center">
           <h2 className="text-red-600 font-bold uppercase text-lg flex items-center gap-2">
              Gợi ý hôm nay
           </h2>
           {searchTerm && <span className="text-sm text-gray-500">Kết quả tìm kiếm cho: "{searchTerm}"</span>}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.length > 0 ? products.map((product) => {
              const discount = getDiscountPercent(product.originalValue, product.currentPrice);
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white border border-gray-100 rounded-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col relative group"
                  onClick={() => navigate(`/product/${product.id}/${product.type}`)}
                >
                  <div className="relative w-full pt-[100%] overflow-hidden bg-gray-50">
                     <img 
                        src={product.imageUrl || 'https://placehold.co/400'} 
                        alt={product.title}
                        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy" 
                     />

                     <div className={`absolute top-2 left-0 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-sm shadow-sm z-10 ${getTypeColor(product.type)}`}>
                        {product.type}
                     </div>

                     {discount > 0 && (
                        <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 text-xs font-bold px-1.5 py-1 flex flex-col items-center leading-tight w-10 z-10">
                           <span>{discount}%</span>
                           <span className="text-white uppercase text-[10px]">GIẢM</span>
                        </div>
                     )}

                     <button 
                        onClick={(e) => handleAddToCartQuick(e, product)}
                        className="absolute bottom-3 right-3 bg-red-600 text-white p-2.5 rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 hover:bg-red-700 hover:scale-110"
                        title="Thêm nhanh vào giỏ"
                     >
                        <ShoppingCart size={18} />
                     </button>
                  </div>

                  <div className="p-2.5 flex flex-col flex-1">
                    <h3 className="text-xs md:text-sm text-gray-800 line-clamp-2 min-h-[36px] mb-2 leading-relaxed font-medium" title={product.title}>
                      {product.title}
                    </h3>
                    
                    <div className="mt-auto">
                        <div className="flex flex-wrap items-baseline gap-1 mb-1">
                            <span className="text-red-600 font-medium text-base md:text-lg">
                                ₫{product.currentPrice.toLocaleString()}
                            </span>
                            {discount > 0 && (
                                <span className="text-[10px] text-gray-400 line-through truncate">
                                    ₫{product.originalValue.toLocaleString()}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-50">
                             <div className="flex items-center gap-0.5">
                                 {[1,2,3,4,5].map(i => (
                                     <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                                 ))}
                             </div>
                             <span>Đã bán {product.quantity * 2}</span>
                        </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
                <div className="col-span-full text-center py-20 text-gray-500 flex flex-col items-center bg-white rounded">
                    <Search size={48} className="text-gray-300 mb-4" />
                    <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchTerm}"</p>
                    <button onClick={() => {setSearchTerm(''); loadProducts('');}} className="mt-4 text-blue-600 hover:underline">
                        Xem tất cả sản phẩm
                    </button>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}