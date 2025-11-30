import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { CheckCircle, AlertCircle, Loader, Copy, QrCode } from 'lucide-react';

export default function PaymentScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { orderId, totalAmount, feeData } = state || {};

  const [isInitPayment, setIsInitPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [initError, setInitError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    const initPayment = async () => {
      try {
        console.log("Đang khởi tạo giao dịch cho Order ID:", orderId);
        await paymentService.createPaymentUrl(orderId, 'VIETQR');
        setIsInitPayment(true);
      } catch (error: any) {
        console.error("Lỗi khởi tạo:", error);
        setInitError("Không thể khởi tạo cổng thanh toán. Vui lòng thử lại.");
      }
    };

    initPayment();
  }, [orderId]);

  const handleConfirmVietQR = async () => {
    if (!isInitPayment) return;

    try {
      setIsProcessing(true);
      
      const result = await paymentService.confirmVietQR(orderId);
      
      console.log("Kết quả xác nhận:", result);

      navigate('/order-success', { 
        state: { 
          transactionId: orderId,
          amount: totalAmount 
        } 
      });

    } catch (error: any) {
      console.error("Lỗi xác nhận:", error);
      const errorMsg = error.response?.data?.message || "Hệ thống chưa nhận được tiền. Vui lòng thử lại.";
      alert(`Xác nhận thất bại: ${errorMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orderId || !totalAmount) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded shadow text-center">
             <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
             <p className="mb-4 text-gray-700">Không tìm thấy thông tin đơn hàng.</p>
             <button onClick={() => navigate('/')} className="text-blue-600 hover:underline font-medium">
               Về trang chủ
             </button>
          </div>
        </div>
      );
  }

  const QR_BANK_ID = "MB";
  const QR_ACC_NO = "0000000000";
  const QR_CONTENT = `ORDER ${orderId}`; 
  const qrImageUrl = `https://img.vietqr.io/image/${QR_BANK_ID}-${QR_ACC_NO}-compact.png?amount=${totalAmount}&addInfo=${QR_CONTENT}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
           <CheckCircle className="text-green-600" /> Thanh toán đơn hàng
        </h1>
        
        <div className="flex gap-8 flex-col md:flex-row items-start">
          
          <div className="w-full md:w-1/2 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h2 className="font-bold text-lg mb-4 border-b pb-2 text-gray-700">Chi tiết thanh toán</h2>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-bold text-black text-lg">#{orderId}</span>
               </div>
               
               {feeData && (
                 <div className="text-sm text-gray-500 space-y-2 py-2">
                    <div className="flex justify-between">
                       <span>Tạm tính:</span>
                       <span>{feeData.subtotal?.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between">
                       <span>Phí vận chuyển:</span>
                       <span>{feeData.shippingFee?.toLocaleString()} ₫</span>
                    </div>
                    <div className="flex justify-between">
                       <span>VAT (10%):</span>
                       <span>{feeData.vatAmount?.toLocaleString()} ₫</span>
                    </div>
                 </div>
               )}

               <div className="flex justify-between items-center font-bold text-red-600 text-2xl pt-4 border-t border-dashed">
                  <span>Tổng cộng:</span>
                  <span>{totalAmount.toLocaleString()} ₫</span>
               </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-white p-6 border border-gray-200 rounded-lg shadow-sm flex flex-col items-center relative min-h-[400px]">
              
              {(!isInitPayment || isProcessing) && (
                <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center rounded-lg">
                   <Loader className="animate-spin text-red-600 mb-2" size={32} />
                   <p className="text-gray-600 font-medium">
                      {!isInitPayment ? "Đang khởi tạo giao dịch..." : "Đang xác thực thanh toán..."}
                   </p>
                   {initError && (
                      <p className="text-red-500 text-sm mt-2 px-4 text-center">{initError}</p>
                   )}
                </div>
              )}

              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                 <QrCode size={20} /> Quét mã VietQR
              </h3>
              <p className="text-sm text-gray-500 mb-6 text-center">
                 Sử dụng App ngân hàng (MB, VCB, Techcombank...) để quét mã
              </p>
              
              <div className="border-4 border-red-100 p-2 rounded-xl mb-6 shadow-inner">
                   <img 
                    src={qrImageUrl} 
                    alt="VietQR Code"
                    className="w-56 h-56 object-contain"
                  />
              </div>
              
              <div className="w-full bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500 uppercase">Nội dung chuyển khoản</span>
                      <button className="text-blue-600 hover:text-blue-800" title="Sao chép">
                          <Copy size={14} />
                      </button>
                  </div>
                  <p className="font-mono font-bold text-blue-900 text-lg text-center select-all">
                      {QR_CONTENT}
                  </p>
              </div>
              
              <button 
                  onClick={handleConfirmVietQR}
                  disabled={!isInitPayment || isProcessing}
                  className="w-full bg-red-600 text-white py-3.5 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg transform active:scale-95 disabled:bg-gray-300 disabled:transform-none disabled:shadow-none"
              >
                  Tôi đã hoàn tất thanh toán
              </button>
              
              <p className="text-xs text-gray-400 mt-4 text-center max-w-xs">
                  Hệ thống sẽ tự động cập nhật trạng thái đơn hàng sau khi nhận được tiền.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}