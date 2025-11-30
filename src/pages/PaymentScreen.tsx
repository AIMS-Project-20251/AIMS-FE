import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

export default function PaymentScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { orderId, totalAmount, feeData } = state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitPayment, setIsInitPayment] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const initPayment = async () => {
      try {
        console.log("Đang khởi tạo giao dịch cho Order ID:", orderId);
        await paymentService.createPaymentUrl(orderId, 'VIETQR');
        setIsInitPayment(true); 
      } catch (error) {
        console.error("Lỗi khởi tạo thanh toán:", error);
        setIsInitPayment(true); 
      }
    };

    initPayment();
  }, [orderId]);


  const handleSimulateSuccess = () => {
    if (!isInitPayment) return;
    
    setIsProcessing(true);

    setTimeout(() => {
        setIsProcessing(false);
        console.log("Giả lập: Thanh toán thành công!");

        navigate('/order-success', { 
            state: { 
            transactionId: orderId, 
            amount: totalAmount 
            } 
        });
    }, 1500);
  };

  const handleSimulateFail = () => {
    if (!isInitPayment) return;

    setIsProcessing(true);

    setTimeout(() => {
        setIsProcessing(false);
        console.log("Giả lập: Thanh toán thất bại!");
        
        alert("Giả lập: Giao dịch thất bại. Tài khoản không đủ số dư hoặc bị hủy.");
    }, 1500);
  };


  if (!orderId || !totalAmount) {
      return (
        <div className="p-10 text-center">
          <p className="mb-4">Không tìm thấy thông tin đơn hàng.</p>
          <button onClick={() => navigate('/')} className="text-blue-600 underline">Về trang chủ</button>
        </div>
      );
  }

  const QR_BANK_ID = "MB";         
  const QR_ACC_NO = "0000000000";  
  const QR_CONTENT = `ORDER ${orderId}`; 
  const qrImageUrl = `https://img.vietqr.io/image/${QR_BANK_ID}-${QR_ACC_NO}-compact.png?amount=${totalAmount}&addInfo=${QR_CONTENT}`;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Thanh toán đơn hàng (Chế độ Test)</h1>
      
      <div className="flex gap-8 flex-col md:flex-row">
        
        <div className="w-full md:w-1/2 bg-white border p-6 rounded shadow-sm h-fit">
          <h2 className="font-bold text-lg mb-4 border-b pb-2">Thông tin thanh toán</h2>
          <div className="space-y-4">
             <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-bold text-black">#{orderId}</span>
             </div>
             
             {feeData && (
               <>
                 <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{feeData.subtotal?.toLocaleString()} ₫</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>{feeData.shippingFee?.toLocaleString()} ₫</span>
                 </div>
               </>
             )}

             <div className="flex justify-between font-bold text-red-600 text-2xl pt-4 border-t border-dashed">
                <span>Tổng cộng:</span>
                <span>{totalAmount.toLocaleString()} ₫</span>
             </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 border rounded shadow-sm relative flex flex-col items-center">
            
            {(isProcessing || !isInitPayment) && (
              <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 rounded">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-2"></div>
                <span className="text-red-600 font-bold text-sm">
                    {!isInitPayment ? "Đang khởi tạo giao dịch..." : "Đang xử lý giả lập..."}
                </span>
              </div>
            )}

            <h3 className="font-bold text-lg mb-2">VietQR Simulator</h3>
            
            <div className="border-2 border-red-100 p-2 rounded-lg mb-4">
                 <img 
                  src={qrImageUrl} 
                  alt="VietQR Code"
                  className="w-56 h-56 object-contain"
                />
            </div>
            
            <div className="text-center mb-6 bg-blue-50 p-3 rounded w-full">
                <p className="text-xs text-gray-500">Nội dung chuyển khoản</p>
                <p className="font-bold text-blue-800 text-lg select-all cursor-pointer">
                    {QR_CONTENT}
                </p>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
                <button 
                    onClick={handleSimulateSuccess}
                    disabled={isProcessing || !isInitPayment}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg transform active:scale-95 disabled:bg-gray-400 disabled:transform-none"
                >
                    ✅ Giả lập Thành công
                </button>

                <button 
                    onClick={handleSimulateFail}
                    disabled={isProcessing || !isInitPayment}
                    className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition shadow-lg transform active:scale-95 disabled:bg-gray-400 disabled:transform-none"
                >
                    ❌ Giả lập Thất bại
                </button>
            </div>
            
        </div>
      </div>
    </div>
  );
}