// src/pages/OrderFail.tsx
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function OrderFail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin lỗi từ state (nếu có)
  const errorMessage = state?.message || "Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý.";
  const errorCode = state?.errorCode || "ERR_UNKNOWN";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded shadow-lg text-center max-w-md w-full border-t-4 border-red-500">
        
        {/* Icon X đỏ */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-gray-800">Thanh toán thất bại!</h1>
        
        <p className="text-gray-600 mb-6">
          Rất tiếc, chúng tôi không thể hoàn tất đơn hàng của bạn.
        </p>

        {/* Chi tiết lỗi */}
        <div className="bg-red-50 p-4 rounded text-left text-sm mb-6 border border-red-100">
          <p className="text-red-800 font-semibold mb-1">Chi tiết lỗi:</p>
          <p className="text-gray-700">{errorMessage}</p>
          <p className="text-xs text-gray-500 mt-2">Mã lỗi: {errorCode}</p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Nút thử lại: Quay về trang thanh toán (hoặc trang trước đó) */}
          <button 
            onClick={() => navigate(-1)} 
            className="w-full bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700 transition"
          >
            Thử thanh toán lại
          </button>

          {/* Nút về trang chủ */}
          <Link 
            to="/" 
            className="block w-full bg-white text-gray-700 border border-gray-300 py-2 rounded font-medium hover:bg-gray-50 transition"
          >
            Về trang chủ
          </Link>
        </div>
        
        <div className="mt-6 text-xs text-gray-400">
          Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ: support@aims.vn
        </div>
      </div>
    </div>
  );
}