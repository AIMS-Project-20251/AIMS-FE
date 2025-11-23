import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import type { OrderFeeResponse, CreateOrderDto } from '../types/order';

export default function PaymentScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu từ trang trước truyền sang
  const feeData = state?.feeData as OrderFeeResponse;
  const orderPayload = state?.orderPayload as CreateOrderDto;

  // Nếu không có data (do user truy cập trực tiếp link), đẩy về trang chủ
  if (!feeData || !orderPayload) {
      return <div className="p-10 text-center">Vui lòng quay lại trang chủ để đặt hàng.</div>;
  }

  const [isProcessing, setIsProcessing] = useState(false);

  // Xử lý thanh toán thật
  const handleConfirmPayment = async () => {
    try {
      setIsProcessing(true);
      
      // 1. Gọi API tạo đơn hàng xuống DB
      const orderResult = await orderService.placeOrder(orderPayload);
      
      console.log("Order created:", orderResult);

      // 2. Thành công -> Chuyển trang Success
      navigate('/order-success', { 
        state: { 
          transactionId: orderResult.id, // ID đơn hàng trả về từ BE
          amount: feeData.totalAmount 
        } 
      });

    } catch (error: any) {
      console.error("Payment Error:", error);
      
      // 3. Thất bại -> Chuyển trang Fail
      // Lấy message lỗi từ BE (ví dụ: Out of stock)
      const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi xử lý đơn hàng.";
      
      navigate('/order-fail', { 
        state: { 
          message: errorMsg,
          errorCode: error.response?.status 
        } 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Thanh toán đơn hàng</h1>
      
      <div className="flex gap-8 flex-col md:flex-row">
        {/* Invoice */}
        <div className="w-full md:w-1/2 bg-white border p-6 rounded shadow-sm">
          <h2 className="font-bold text-lg mb-4 border-b pb-2">Hóa đơn (Invoice)</h2>
          <div className="space-y-3">
             <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{feeData.subtotal.toLocaleString()} ₫</span>
             </div>
             <div className="flex justify-between">
                <span>VAT (10%):</span>
                <span>{feeData.vatAmount.toLocaleString()} ₫</span>
             </div>
             <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{feeData.shippingFee.toLocaleString()} ₫</span>
             </div>
             <div className="flex justify-between font-bold text-red-600 text-xl pt-4 border-t">
                <span>Tổng thanh toán:</span>
                <span>{feeData.totalAmount.toLocaleString()} ₫</span>
             </div>
          </div>
        </div>

        {/* QR & Action */}
        <div className="w-full md:w-1/2 bg-white p-6 border rounded shadow-sm relative">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="text-center">
                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-2"></div>
                   <span className="text-red-600 font-bold">Đang xử lý đơn hàng...</span>
                </div>
              </div>
            )}

            <p className="mb-4 text-center font-medium">Quét mã QR để thanh toán</p>
            <div className="flex justify-center">
                 <img 
                  src={`https://img.vietqr.io/image/MB-0000000000-compact.png?amount=${feeData.totalAmount}&addInfo=AIMS Order`} 
                  alt="VietQR"
                  className="w-48 h-48 object-contain mb-4 border rounded"
                />
            </div>
            
            <button 
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition shadow disabled:bg-gray-400"
            >
                {isProcessing ? 'Đang xử lý...' : 'Tôi đã hoàn tất thanh toán'}
            </button>
        </div>
      </div>
    </div>
  );
}