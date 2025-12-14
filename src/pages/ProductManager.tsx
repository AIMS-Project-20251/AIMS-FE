import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import type { Product, CreateProductDto, ProductType } from '../types/product';
import { Pencil, Trash2, Plus, X, Search, Package, Weight, Loader } from 'lucide-react';

const DEFAULT_ATTRIBUTES = {
  BOOK: { authors: '', coverType: 'PAPERBACK', publisher: '', publicationDate: '', pages: 0, language: '', genre: '' },
  CD: { artists: '', recordLabel: '', tracks: '[]', genre: '', releaseDate: '' },
  DVD: { discType: 'BLURAY', director: '', runtime: '', studio: '', language: '', subtitles: '', releaseDate: '', genre: '' },
  NEWSPAPER: { editorInChief: '', publisher: '', publicationDate: '', issueNumber: '', publicationFrequency: '', issn: '', language: '', sections: '' }
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [commonData, setCommonData] = useState({
    title: '',
    category: '',
    originalValue: '',
    currentPrice: '',
    quantity: '',
    weight: '',
    imageUrl: '',
    type: 'BOOK' as ProductType
  });

  const [attributeData, setAttributeData] = useState<any>(DEFAULT_ATTRIBUTES.BOOK);

  const navigate = useNavigate();
  const currentPriceRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async (keyword = '') => {
    try {
      setIsLoading(true);
      const data = await productService.getAll(keyword);
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

  const handleSearch = () => {
    fetchProducts(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (!editingId && isModalOpen) {
       setAttributeData((DEFAULT_ATTRIBUTES as any)[commonData.type]);
    }
  }, [commonData.type, editingId, isModalOpen]);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setCommonData({
        title: product.title,
        category: product.category,
        originalValue: String(product.originalValue),
        currentPrice: String(product.currentPrice),
        quantity: String(product.quantity),
        weight: String(product.weight),
        imageUrl: product.imageUrl,
        type: product.type
      });
      
      let loadedAttrs: any = { ...product.attributes };
      
      if (product.type === 'CD' && Array.isArray(loadedAttrs.tracks)) {
          loadedAttrs.tracks = JSON.stringify(loadedAttrs.tracks);
      }
      if ((product.type === 'DVD' || product.type === 'NEWSPAPER') && Array.isArray(loadedAttrs.subtitles || loadedAttrs.sections)) {
          const arr = loadedAttrs.subtitles || loadedAttrs.sections || [];
          const fieldName = product.type === 'DVD' ? 'subtitles' : 'sections';
          loadedAttrs[fieldName] = arr.join(', ');
      }
      ['publicationDate', 'releaseDate'].forEach(field => {
          if (loadedAttrs[field]) loadedAttrs[field] = String(loadedAttrs[field]).split('T')[0];
      });

      setAttributeData(loadedAttrs);
    } else {
      setEditingId(null);
      setCommonData({
        title: '', category: '', originalValue: '', currentPrice: '',
        quantity: '', weight: '', imageUrl: '', type: 'BOOK'
      });
      setAttributeData(DEFAULT_ATTRIBUTES.BOOK);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...commonData,
        originalValue: Number(commonData.originalValue),
        currentPrice: Number(commonData.currentPrice),
        quantity: Number(commonData.quantity),
        weight: Number(commonData.weight),
        attributes: { ...attributeData }
      };

      const attrs = payload.attributes;
      if (attrs.publicationDate === '') attrs.publicationDate = null;
      if (attrs.releaseDate === '') attrs.releaseDate = null;
      if (attrs.pages) attrs.pages = Number(attrs.pages);

      if (commonData.type === 'CD') {
         try {
            attrs.tracks = JSON.parse(attrs.tracks || '[]');
         } catch {
            alert("Lỗi định dạng JSON ở trường Tracks");
            return;
         }
      }
      if (commonData.type === 'DVD') {
         attrs.subtitles = attrs.subtitles ? attrs.subtitles.split(',').map((s: string) => s.trim()) : [];
      }
      if (commonData.type === 'NEWSPAPER') {
         attrs.sections = attrs.sections ? attrs.sections.split(',').map((s: string) => s.trim()) : [];
      }

      if (editingId) {
        await productService.update(editingId, payload);
        alert("Cập nhật thành công!");
      } else {
        await productService.create(payload as CreateProductDto);
        alert("Tạo mới thành công!");
      }
      setIsModalOpen(false);
      fetchProducts(searchTerm);

    } catch (error: any) {
      console.error(error);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      await productService.delete(id);
      fetchProducts(searchTerm);
    }
  };

  const inputClass = "w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none";

  const renderAttributeFields = () => {
    switch (commonData.type) {
      case 'BOOK':
        return (
          <>
            <div className="md:col-span-2 font-bold text-blue-600 border-b pb-1 mt-2">Thông tin Sách</div>
            <div>
              <label className="text-sm font-medium">Tác giả *</label>
              <input type="text" className={inputClass} required
                value={attributeData.authors || ''} 
                onChange={e => setAttributeData({...attributeData, authors: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Nhà xuất bản *</label>
              <input type="text" className={inputClass} required
                value={attributeData.publisher || ''} 
                onChange={e => setAttributeData({...attributeData, publisher: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Ngày xuất bản *</label>
              <input type="date" className={inputClass} required
                value={attributeData.publicationDate || ''} 
                onChange={e => setAttributeData({...attributeData, publicationDate: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Loại bìa</label>
              <select className={inputClass}
                value={attributeData.coverType || 'PAPERBACK'} 
                onChange={e => setAttributeData({...attributeData, coverType: e.target.value})}>
                <option value="PAPERBACK">Bìa mềm</option>
                <option value="HARDCOVER">Bìa cứng</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Số trang</label>
              <input type="number" className={inputClass}
                value={attributeData.pages || ''} 
                onChange={e => setAttributeData({...attributeData, pages: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Thể loại</label>
              <input type="text" className={inputClass}
                value={attributeData.genre || ''} 
                onChange={e => setAttributeData({...attributeData, genre: e.target.value})} />
            </div>
          </>
        );

      case 'CD':
        return (
          <>
            <div className="md:col-span-2 font-bold text-blue-600 border-b pb-1 mt-2">Thông tin Đĩa CD</div>
            <div>
              <label className="text-sm font-medium">Nghệ sĩ *</label>
              <input type="text" className={inputClass} required
                value={attributeData.artists || ''} 
                onChange={e => setAttributeData({...attributeData, artists: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Hãng ghi âm *</label>
              <input type="text" className={inputClass} required
                value={attributeData.recordLabel || ''} 
                onChange={e => setAttributeData({...attributeData, recordLabel: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Ngày phát hành</label>
              <input type="date" className={inputClass}
                value={attributeData.releaseDate || ''} 
                onChange={e => setAttributeData({...attributeData, releaseDate: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Thể loại</label>
              <input type="text" className={inputClass} required
                value={attributeData.genre || ''} 
                onChange={e => setAttributeData({...attributeData, genre: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Danh sách bài hát (JSON Format)</label>
              <textarea className={inputClass + " h-24 font-mono text-xs"}
                placeholder='[{"title": "Song 1", "length": "3:00"}, ...]'
                value={attributeData.tracks || ''} 
                onChange={e => setAttributeData({...attributeData, tracks: e.target.value})} />
              <p className="text-xs text-gray-500 mt-1">Ví dụ: {`[{"title": "Track 1", "length": "3:50"}]`}</p>
            </div>
          </>
        );

      case 'DVD':
        return (
          <>
            <div className="md:col-span-2 font-bold text-blue-600 border-b pb-1 mt-2">Thông tin Đĩa DVD</div>
            <div>
              <label className="text-sm font-medium">Đạo diễn *</label>
              <input type="text" className={inputClass} required
                value={attributeData.director || ''} 
                onChange={e => setAttributeData({...attributeData, director: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Hãng phim *</label>
              <input type="text" className={inputClass} required
                value={attributeData.studio || ''} 
                onChange={e => setAttributeData({...attributeData, studio: e.target.value})} />
            </div>
            <div>
               <label className="text-sm font-medium">Loại đĩa</label>
               <select className={inputClass}
                  value={attributeData.discType || 'BLURAY'} 
                  onChange={e => setAttributeData({...attributeData, discType: e.target.value})}>
                  <option value="BLURAY">Blu-ray</option>
                  <option value="HD_DVD">HD-DVD</option>
               </select>
            </div>
            <div>
              <label className="text-sm font-medium">Thời lượng (Runtime) *</label>
              <input type="text" className={inputClass} required placeholder="120 mins"
                value={attributeData.runtime || ''} 
                onChange={e => setAttributeData({...attributeData, runtime: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Ngôn ngữ *</label>
              <input type="text" className={inputClass} required
                value={attributeData.language || ''} 
                onChange={e => setAttributeData({...attributeData, language: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium">Phụ đề (cách nhau dấu phẩy)</label>
              <input type="text" className={inputClass} placeholder="Tiếng Việt, English..."
                value={attributeData.subtitles || ''} 
                onChange={e => setAttributeData({...attributeData, subtitles: e.target.value})} />
            </div>
          </>
        );

        case 'NEWSPAPER':
          return (
            <>
              <div className="md:col-span-2 font-bold text-blue-600 border-b pb-1 mt-2">Thông tin Báo chí</div>
              <div>
                <label className="text-sm font-medium">Tổng biên tập *</label>
                <input type="text" className={inputClass} required
                  value={attributeData.editorInChief || ''} 
                  onChange={e => setAttributeData({...attributeData, editorInChief: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Nhà xuất bản *</label>
                <input type="text" className={inputClass} required
                  value={attributeData.publisher || ''} 
                  onChange={e => setAttributeData({...attributeData, publisher: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Ngày phát hành *</label>
                <input type="date" className={inputClass} required
                  value={attributeData.publicationDate || ''} 
                  onChange={e => setAttributeData({...attributeData, publicationDate: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Tần suất</label>
                <input type="text" className={inputClass} placeholder="Hàng ngày, Tuần san..."
                  value={attributeData.publicationFrequency || ''} 
                  onChange={e => setAttributeData({...attributeData, publicationFrequency: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Các chuyên mục (cách nhau dấu phẩy)</label>
                <input type="text" className={inputClass} placeholder="Thể thao, Thời sự, Giải trí..."
                  value={attributeData.sections || ''} 
                  onChange={e => setAttributeData({...attributeData, sections: e.target.value})} />
              </div>
            </>
          );
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 sticky top-0 bg-gray-100 z-10 py-2 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Quản lý kho hàng</h1>
           <p className="text-sm text-gray-500">Tổng số: {products.length} sản phẩm</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Tìm theo tên..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button 
              onClick={handleSearch} 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
            >
               <Search size={20} />
            </button>

            <button 
              onClick={() => openModal()}
              className="bg-red-600 text-white px-5 py-2 rounded-full shadow hover:bg-red-700 flex items-center gap-2 font-medium whitespace-nowrap"
            >
              <Plus size={20} /> Thêm Mới
            </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 flex flex-col items-center">
             <Loader className="animate-spin mb-2" /> Đang tải dữ liệu...
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((p) => (
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
                   
                   <div className={`absolute top-2 left-0 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-sm shadow-sm
                        ${p.type === 'BOOK' ? 'bg-blue-600' : 
                          p.type === 'NEWSPAPER' ? 'bg-green-600' : 
                          'bg-red-600'
                        }`}
                    >
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
          ))}
          
          {products.length === 0 && (
             <div className="col-span-full text-center py-20 text-gray-400">
                Không tìm thấy sản phẩm nào.
             </div>
          )}
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
              <div className="md:col-span-2 font-bold text-gray-700 bg-gray-100 p-2 rounded">Thông tin chung</div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Tên sản phẩm *</label>
                <input type="text" className={inputClass} required
                  value={commonData.title} onChange={e => setCommonData({...commonData, title: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Loại sản phẩm</label>
                <select className={inputClass} disabled={!!editingId}
                  value={commonData.type} onChange={e => setCommonData({...commonData, type: e.target.value as ProductType})}>
                  <option value="BOOK">Sách</option>
                  <option value="CD">Đĩa CD</option>
                  <option value="DVD">Đĩa DVD</option>
                  <option value="NEWSPAPER">Báo</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Danh mục *</label>
                <input type="text" className={inputClass} required
                  value={commonData.category} onChange={e => setCommonData({...commonData, category: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Giá gốc (VND) *</label>
                <input type="number" className={inputClass} required
                  value={commonData.originalValue} onChange={e => setCommonData({...commonData, originalValue: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Giá bán (VND) *</label>
                <input ref={currentPriceRef} type="number" className={inputClass} required
                  value={commonData.currentPrice} onChange={e => setCommonData({...commonData, currentPrice: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Số lượng tồn kho *</label>
                <input type="number" className={inputClass} required
                  value={commonData.quantity} onChange={e => setCommonData({...commonData, quantity: e.target.value})} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Trọng lượng (kg)</label>
                <input type="number" step="0.1" className={inputClass} required
                  value={commonData.weight} onChange={e => setCommonData({...commonData, weight: e.target.value})} />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">URL Hình ảnh</label>
                <input type="text" className={inputClass} placeholder="https://..."
                  value={commonData.imageUrl} onChange={e => setCommonData({...commonData, imageUrl: e.target.value})} />
              </div>

              {renderAttributeFields()}

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