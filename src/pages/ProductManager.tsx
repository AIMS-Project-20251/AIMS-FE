import React, { useEffect, useState, useRef } from 'react';
import { productService } from '../services/productService';
import type { Product, CreateProductDto } from '../types/product';
import { Pencil, Trash2, Plus, X, Package, Weight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const originalValueRef = useRef<HTMLInputElement>(null);
  const currentPriceRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<any>({
    title: '',
    category: '',
    originalValue: '',
    currentPrice: '',
    quantity: '',
    weight: '',
    imageUrl: '',
    type: 'BOOK'
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hàm xử lý số thực (cho phép dấu chấm/phẩy) -> Dùng cho Giá & Trọng lượng
  const handleNumberInput = (field: string, value: string) => {
    let cleanValue = value.replace(/,/g, '.');
    if (!/^[0-9.]*$/.test(cleanValue)) return;
    if ((cleanValue.match(/\./g) || []).length > 1) return;
    setFormData({ ...formData, [field]: cleanValue });
  };

  // Hàm xử lý số nguyên (CHỈ cho phép số 0-9) -> Dùng cho Số lượng tồn kho
  const handleIntegerInput = (field: string, value: string) => {
    if (!/^[0-9]*$/.test(value)) return; // Chặn luôn nếu có dấu chấm/phẩy
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CreateProductDto = {
        ...formData,
        originalValue: Number(formData.originalValue),
        currentPrice: Number(formData.currentPrice),
        quantity: Number(formData.quantity),
        weight: Number(formData.weight),
      };

      if (editingId) {
        await productService.update(editingId, payload);
        alert("Cập nhật thành công!");
      } else {
        await productService.create(payload);
        alert("Tạo mới thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();

    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message;

      if (typeof message === 'string') {
        if (message.includes('Price must be between')) {
          if (currentPriceRef.current) {
            currentPriceRef.current.setCustomValidity("Giá bán phải từ 30% đến 150% giá gốc!");
            currentPriceRef.current.reportValidity();
          }
        } else {
          alert(`Lỗi: ${message}`);
        }
      } 
      else if (Array.isArray(message)) {
        const firstError = message[0];
        
        if (firstError.includes('originalValue')) {
           originalValueRef.current?.setCustomValidity("Vui lòng nhập giá gốc hợp lệ");
           originalValueRef.current?.reportValidity();
        } 
        else if (firstError.includes('currentPrice')) {
           currentPriceRef.current?.setCustomValidity("Vui lòng nhập giá bán hợp lệ");
           currentPriceRef.current?.reportValidity();
        }
        else {
           alert(`Lỗi dữ liệu: ${firstError}`);
        }
      } 
      else {
        alert("Có lỗi xảy ra khi kết nối Server.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productService.delete(id);
      fetchProducts();
    } catch (error) {
      alert("Không thể xóa sản phẩm.");
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        title: product.title,
        category: product.category,
        originalValue: String(product.originalValue),
        currentPrice: String(product.currentPrice),
        quantity: String(product.quantity),
        weight: String(product.weight),
        imageUrl: product.imageUrl,
        type: product.type
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '', category: '', originalValue: '', currentPrice: '',
        quantity: '', weight: '', imageUrl: '', type: 'BOOK'
      });
    }
    setIsModalOpen(true);
  };

  const getDiscount = (original: number, current: number) => {
     if(!original || original <= current) return 0;
     return Math.round(((original - current) / original) * 100);
  };

  const inputClass = "w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-100 z-10 py-2">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Quản lý kho hàng</h1>
           <p className="text-sm text-gray-500">Tổng số: {products.length} sản phẩm</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-red-600 text-white px-5 py-2.5 rounded shadow hover:bg-red-700 flex items-center gap-2 font-medium"
        >
          <Plus size={20} /> Thêm Mới
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((p) => {
            const discount = getDiscount(p.originalValue, p.currentPrice);

            return (
              <div 
                key={p.id} 
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white border border-gray-200 rounded-sm hover:shadow-lg transition-all duration-200 group relative flex flex-col cursor-pointer"
              >
                <div className="relative w-full pt-[100%] overflow-hidden bg-gray-100">
                   <img 
                      src={p.imageUrl || 'https://placehold.co/400'} 
                      alt={p.title}
                      className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                   />
                   <div className="absolute top-2 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-sm shadow-sm">
                      {p.type}
                   </div>
                   <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center gap-2 transition-opacity">
                      <button 
                         onClick={(e) => { e.stopPropagation(); openModal(p); }}
                         className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50" title="Chỉnh sửa">
                         <Pencil size={18} />
                      </button>
                      <button 
                         onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                         className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50" title="Xóa">
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>

                <div className="p-2.5 flex flex-col flex-1">
                  <h3 className="text-xs text-gray-800 line-clamp-2 min-h-[32px] mb-2 leading-relaxed" title={p.title}>
                    {p.title}
                  </h3>

                  <div className="mt-auto">
                      <div className="flex items-center gap-1 mb-1 min-h-[16px]">
                         {discount > 0 && (
                           <>
                             <span className="text-[10px] text-gray-400 line-through decoration-gray-400">
                                {p.originalValue.toLocaleString()}đ
                             </span>
                             <span className="text-[10px] text-red-600 bg-red-50 px-1 border border-red-200 rounded-sm font-semibold">
                                Giảm {discount}%
                             </span>
                           </>
                         )}
                      </div>

                      <div className="flex justify-between items-end mb-2">
                          <span className="text-red-600 font-medium text-base">
                              {p.currentPrice.toLocaleString()} <span className="text-xs align-top">₫</span>
                          </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-gray-500 border-t pt-2 mt-1">
                          <div className="flex items-center gap-1">
                              <Package size={12} /> Kho: <span className="font-medium text-gray-700">{p.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                              <Weight size={12} /> {p.weight}kg
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
              {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Tên sản phẩm</label>
                <input type="text" className={inputClass} required
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Loại sản phẩm</label>
                <select className={inputClass}
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  <option value="BOOK">Sách (BOOK)</option>
                  <option value="CD">Đĩa CD</option>
                  <option value="DVD">Đĩa DVD</option>
                  <option value="LP">Đĩa LP</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Danh mục (Category)</label>
                <input type="text" className={inputClass} required
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Giá gốc (VND)</label>
                <input 
                  ref={originalValueRef}
                  type="text" className={inputClass} required
                  value={formData.originalValue} 
                  onChange={e => {
                    handleNumberInput('originalValue', e.target.value);
                    e.target.setCustomValidity('');
                  }}
                  onFocus={e => e.target.select()}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Giá bán hiện tại (VND)</label>
                <input 
                  ref={currentPriceRef}
                  type="text" className={inputClass} required
                  value={formData.currentPrice} 
                  onChange={e => {
                    handleNumberInput('currentPrice', e.target.value);
                    e.target.setCustomValidity('');
                  }}
                  onFocus={e => e.target.select()}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                <input 
                  type="text" className={inputClass} required
                  value={formData.quantity} 
                  // SỬA: Dùng hàm handleIntegerInput cho số lượng
                  onChange={e => handleIntegerInput('quantity', e.target.value)}
                  onFocus={e => e.target.select()}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Trọng lượng (kg)</label>
                <input 
                  type="text" className={inputClass} required
                  value={formData.weight} 
                  onChange={e => handleNumberInput('weight', e.target.value)}
                  onFocus={e => e.target.select()}
                  placeholder="0.0"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">URL Hình ảnh</label>
                <input type="text" className={inputClass} placeholder="https://..."
                  value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              </div>

              <div className="md:col-span-2 mt-4 flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 text-gray-700 font-medium">Hủy</button>
                <button type="submit" 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold shadow-md">
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}