// src/pages/PaymentScreen.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PaymentScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Dữ liệu nhận từ trang trước (DeliveryInfo)
  const { cartTotal, shippingFee } = state || { cartTotal: 0, shippingFee: 0 };
  
  // Tính toán Invoice
  const vat = cartTotal * 0.1; 
  const totalAmount = cartTotal + vat + shippingFee; 
  
  const [paymentMethod, setPaymentMethod] = useState<'QR' | 'Credit'>('QR');
  const [isProcessing, setIsProcessing] = useState(false);

  // Xử lý khi thanh toán thành công
  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    // Giả lập độ trễ mạng
    setTimeout(() => {
      navigate('/order-success', { 
        state: { 
        transactionId: "TRANS_" + Date.now(), // [cite: 76]
        amount: totalAmount 
        } 
      });
    }, 1000);
  };

  // Xử lý khi thanh toán thất bại (Logic bạn yêu cầu thêm)
  const handlePaymentError = (errorReason: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/order-fail', { 
        state: { 
          message: errorReason,
          errorCode: "PAYMENT_FAILED_DEMO" 
        } 
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Thanh toán đơn hàng</h1>
      
      <div className="flex gap-8 flex-col md:flex-row">
        {/* Phần 1: Invoice Screen - Hiển thị hóa đơn [cite: 63] */}
        <div className="w-full md:w-1/2 bg-white border p-6 rounded shadow-sm">
          <h2 className="font-bold text-lg mb-4 border-b pb-2">Hóa đơn (Invoice)</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Tổng tiền hàng (chưa VAT):</span>
              <span>{cartTotal.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (10%):</span>
              <span>{vat.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between font-bold text-red-600 text-xl pt-4 border-t">
              <span>Tổng thanh toán:</span>
              <span>{totalAmount.toLocaleString()} VND</span>
            </div>
          </div>
        </div>

        {/* Phần 2: Payment Method & QR */}
        <div className="w-full md:w-1/2">
          {/* Chọn phương thức thanh toán */}
          <div className="flex gap-4 mb-4">
            <button 
              className={`flex-1 p-3 border rounded transition-colors ${paymentMethod === 'QR' ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'hover:bg-gray-50'}`}
              onClick={() => setPaymentMethod('QR')}
            >
              VietQR (QR Code)
            </button>
            <button 
              className={`flex-1 p-3 border rounded transition-colors ${paymentMethod === 'Credit' ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'hover:bg-gray-50'}`}
              onClick={() => setPaymentMethod('Credit')}
            >
              Thẻ quốc tế (PayPal)
            </button>
          </div>

          <div className="bg-white p-6 border rounded flex flex-col items-center justify-center min-h-[300px] shadow-sm relative">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <span className="text-red-600 font-bold animate-pulse">Đang xử lý giao dịch...</span>
              </div>
            )}

            {paymentMethod === 'QR' ? (
              <>
                <p className="mb-4 text-center font-medium">Quét mã QR để thanh toán</p>
                {/* VietQR Image Dynamic */}
                <img 
                  src={`https://img.vietqr.io/image/MB-0000000000-compact.png?amount=${totalAmount}&addInfo=AIMS Payment`} 
                  alt="VietQR"
                  className="w-48 h-48 object-contain mb-4 border rounded"
                />
                
                <p className="text-sm text-gray-500 mb-6 bg-gray-100 px-3 py-1 rounded">
                  Nội dung: <strong>AIMS Payment</strong>
                </p>
                
                {/* CÁC NÚT DEMO */}
                <div className="w-full space-y-3">
                  <button 
                    onClick={handlePaymentSuccess}
                    className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition shadow"
                  >
                    Tôi đã hoàn tất thanh toán (Demo Success)
                  </button>

                  <button 
                    onClick={() => handlePaymentError("Người dùng đã hủy giao dịch hoặc quá thời gian chờ.")}
                    className="w-full bg-red-100 text-red-700 border border-red-200 py-3 rounded font-bold hover:bg-red-200 transition"
                  >
                    Mô phỏng Thất bại (Demo Fail)
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center w-full">
                <p className="mb-4 font-medium">Thanh toán qua PayPal Sandbox</p>
                <div className="p-8 border-2 border-dashed border-gray-300 rounded bg-gray-50 mb-4">
                  [PayPal Buttons Component Placeholder]
                </div>
                {/* Demo nút lỗi cho PayPal */}
                <button 
                   onClick={() => handlePaymentError("Thẻ tín dụng bị từ chối do không đủ số dư.")}
                   className="text-sm text-red-500 underline hover:text-red-700"
                >
                  Click để test lỗi thanh toán thẻ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}