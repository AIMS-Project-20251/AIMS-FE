import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';
import { ShoppingCart, ArrowLeft, Star, CheckCircle, Package, Truck, Disc, BookOpen, Film, Newspaper } from 'lucide-react';

const InfoRow = ({ label, value }: { label: string, value: any }) => {
  if (!value) return null;
  return (
    <>
      <div className="text-gray-500">{label}:</div>
      <div className="font-medium text-gray-900 break-words">{value}</div>
    </>
  );
};

export default function ProductDetail() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id || !type) return;
      try {
        setIsLoading(true);
        const data = await productService.getOne(Number(id), type);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id, type]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      type: product.type,
      name: product.title,
      price: product.currentPrice,
      quantity: quantity,
      imageUrl: product.imageUrl
    });
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      type: product.type,
      name: product.title,
      price: product.currentPrice,
      quantity: quantity,
      imageUrl: product.imageUrl
    });
    navigate('/delivery-info');
  };
  
  const getTypeColor = (t: string) => {
    switch(t) {
        case 'BOOK': return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'CD': return 'text-purple-600 bg-purple-50 border-purple-200';
        case 'DVD': return 'text-orange-600 bg-orange-50 border-orange-200';
        default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getTypeIcon = (t: string) => {
    switch(t) {
        case 'BOOK': return <BookOpen size={16} />;
        case 'CD': return <Disc size={16} />;
        case 'DVD': return <Film size={16} />;
        default: return <Newspaper size={16} />;
    }
  };

  const renderSpecificInfo = () => {
    if (!product) return null;
    const p = product as any;

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    switch (product.type) {
      case 'BOOK':
        return (
          <>
            <InfoRow label="Tác giả" value={p.authors} />
            <InfoRow label="Nhà xuất bản" value={p.publisher} />
            <InfoRow label="Ngày xuất bản" value={formatDate(p.publicationDate)} />
            <InfoRow label="Số trang" value={p.pages} />
            <InfoRow label="Loại bìa" value={p.coverType === 'HARDCOVER' ? 'Bìa cứng' : 'Bìa mềm'} />
            <InfoRow label="Ngôn ngữ" value={p.language} />
            <InfoRow label="Thể loại" value={p.genre} />
          </>
        );

      case 'CD':
        return (
          <>
            <InfoRow label="Nghệ sĩ" value={p.artists} />
            <InfoRow label="Hãng thu âm" value={p.recordLabel} />
            <InfoRow label="Ngày phát hành" value={formatDate(p.releaseDate)} />
            <InfoRow label="Thể loại" value={p.genre} />
          </>
        );

      case 'DVD':
        return (
          <>
            <InfoRow label="Đạo diễn" value={p.director} />
            <InfoRow label="Hãng phim" value={p.studio} />
            <InfoRow label="Loại đĩa" value={p.discType === 'BLURAY' ? 'Blu-ray' : 'HD-DVD'} />
            <InfoRow label="Thời lượng" value={p.runtime} />
            <InfoRow label="Ngôn ngữ" value={p.language} />
            <InfoRow label="Phụ đề" value={p.subtitles} />
            <InfoRow label="Ngày phát hành" value={formatDate(p.releaseDate)} />
            <InfoRow label="Thể loại" value={p.genre} />
          </>
        );

      case 'NEWSPAPER':
        return (
          <>
            <InfoRow label="Tổng biên tập" value={p.editorInChief} />
            <InfoRow label="Nhà xuất bản" value={p.publisher} />
            <InfoRow label="Ngày phát hành" value={formatDate(p.publicationDate)} />
            <InfoRow label="Tần suất" value={p.publicationFrequency} />
            <InfoRow label="Chuyên mục" value={p.sections} />
          </>
        );
      
      default: return null;
    }
  };

  const renderTrackList = () => {
    const p = product as any;
    if (product?.type === 'CD' && p.tracks && p.tracks.length > 0) {
        return (
            <div className="mt-4 border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                    <Disc size={16} className="text-purple-600"/> Danh sách bài hát
                </h4>
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    {p.tracks.map((track: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-3 border-b last:border-0 hover:bg-white text-sm">
                            <div className="flex gap-3">
                                <span className="text-gray-400 font-mono w-4">{idx + 1}.</span>
                                <span className="font-medium text-gray-800">{track.title}</span>
                            </div>
                            <span className="text-gray-500 text-xs">{track.length}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return null;
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mr-2"></div>
       Đang tải dữ liệu...
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm!</h2>
        <button onClick={() => navigate('/')} className="text-red-600 hover:underline">Quay về trang chủ</button>
    </div>
  );

  const discount = Math.round(((product.originalValue - product.currentPrice) / product.originalValue) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white shadow-sm p-4 sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <span className="font-medium text-gray-700 truncate flex-1">{product.title}</span>
            <button onClick={() => navigate('/delivery-info')} className="md:hidden text-gray-600 p-2">
               <ShoppingCart size={24} />
            </button>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-6xl mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
                
                <div className="p-4 md:p-8 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative group">
                    <img 
                        src={product.imageUrl || 'https://placehold.co/600'} 
                        alt={product.title}
                        className="max-w-full max-h-[400px] md:max-h-[500px] object-contain shadow-lg rounded-md"
                    />
                </div>

                <div className="p-6 md:p-8 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded border flex items-center gap-1 ${getTypeColor(product.type)}`}>
                            {getTypeIcon(product.type)} {product.type}
                        </span>
                        <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">{product.category}</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-1 mb-6">
                        <div className="flex text-yellow-400">
                            {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                        </div>
                        <span className="text-sm text-gray-500 ml-2 border-l pl-2 border-gray-300">Đã bán {product.quantity * 3}</span>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100">
                        <div className="flex items-end gap-3 flex-wrap">
                            <span className="text-3xl md:text-4xl font-bold text-red-600">
                                {product.currentPrice.toLocaleString()} ₫
                            </span>
                            {discount > 0 && (
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-gray-400 line-through text-lg">
                                        {product.originalValue.toLocaleString()} ₫
                                    </span>
                                    <span className="text-red-600 text-xs font-bold bg-red-100 px-2 py-1 rounded">
                                        -{discount}%
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
                             <div className="flex items-center gap-1"><CheckCircle size={14} className="text-green-600"/> Chính hãng 100%</div>
                             <div className="flex items-center gap-1"><Truck size={14} className="text-green-600"/> Miễn phí vận chuyển</div>
                             <div className="flex items-center gap-1"><Package size={14} className="text-green-600"/> Đổi trả 7 ngày</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-gray-800 mb-3 text-lg border-b pb-1">Thông tin chi tiết</h3>
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                            <InfoRow label="Mã sản phẩm" value={`#${product.id}`} />
                            
                            <div className="text-gray-500">Tình trạng:</div>
                            <div className="font-medium text-green-600 flex items-center gap-1">
                                {product.quantity > 0 ? (
                                    <><CheckCircle size={14} /> Còn hàng ({product.quantity})</>
                                ) : (
                                    <span className="text-red-500 font-bold">Hết hàng</span>
                                )}
                            </div>

                            <InfoRow label="Trọng lượng" value={`${product.weight} kg`} />
                            
                            {renderSpecificInfo()}
                        </div>
                        
                        {renderTrackList()}
                    </div>

                    <div className="mt-auto pt-6">
                        <div className="flex items-center gap-6 mb-5">
                            <span className="text-gray-700 font-medium">Số lượng:</span>
                            <div className="flex items-center border border-gray-300 rounded-md bg-white">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition"
                                >-</button>
                                <input 
                                    type="text" 
                                    value={quantity} 
                                    readOnly 
                                    className="w-14 text-center text-gray-800 font-bold focus:outline-none"
                                />
                                <button 
                                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                    className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition"
                                >+</button>
                            </div>
                            <span className="text-xs text-gray-500">{product.quantity} sản phẩm có sẵn</span>
                        </div>

                        <div className="flex gap-3 h-12">
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 border-2 border-red-600 text-red-600 bg-red-50 rounded-lg font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition duration-200"
                            >
                                <ShoppingCart size={20} /> Thêm vào giỏ
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                className="flex-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg hover:shadow-red-200 flex items-center justify-center gap-2 transition duration-200"
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