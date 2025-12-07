import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { Loader, QrCode, RefreshCw, CreditCard } from 'lucide-react';

export default function PaymentScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, totalAmount } = state || {};

  const [paymentMethod, setPaymentMethod] = useState<'VIETQR' | 'PAYPAL'>('VIETQR');
  
  const [isInitPayment, setIsInitPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!orderId || paymentMethod !== 'VIETQR') return;

    const initVietQR = async () => {
      try {
        setIsInitPayment(false); 
        await paymentService.createPaymentUrl(orderId, 'VIETQR');
        setIsInitPayment(true);
      } catch (error) {
        console.error("Lỗi khởi tạo VietQR:", error);
        setIsInitPayment(true);
      }
    };
    initVietQR();
  }, [orderId, paymentMethod]);

  const handlePaypalStart = async () => {
    try {
      setIsProcessing(true);
      const data = await paymentService.createPaymentUrl(orderId, 'PAYPAL');
      
      const paypalUrl = data.paymentUrl || data.url;

      if (paypalUrl) {
        window.location.href = paypalUrl;
      } else {
        alert("Backend không trả về link thanh toán PayPal.");
      }
    } catch (error) {
      console.error("Lỗi tạo link PayPal:", error);
      alert("Không thể khởi tạo thanh toán PayPal.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      setIsProcessing(true);
      const order = await orderService.getOrderStatus(orderId);
      if (order.status === 'COMPLETED' || order.status === 'PAID') {
        navigate('/order-success', { state: { transactionId: orderId, amount: totalAmount } });
      } else {
        alert(`Trạng thái: ${order.status}\nChưa nhận được tiền. Vui lòng dùng Postman confirm!`);
      }
    } catch (error) {
      alert("Lỗi kiểm tra trạng thái.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!orderId) return <div>Không tìm thấy đơn hàng</div>;

  const QR_BANK_ID = "MB";         
  const QR_ACC_NO = "0000000000"; 
  const QR_CONTENT = `ORDER ${orderId}`; 
  const qrImageUrl = `https://img.vietqr.io/image/${QR_BANK_ID}-${QR_ACC_NO}-compact.png?amount=${totalAmount}&addInfo=${QR_CONTENT}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Thanh toán đơn hàng</h1>
        
        <div className="flex gap-8 flex-col md:flex-row items-start">
          
          <div className="w-full md:w-1/2 space-y-4">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center font-bold text-gray-700 text-lg mb-2">
                    <span>Mã đơn hàng:</span>
                    <span>#{orderId}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-red-600 text-2xl pt-2 border-t">
                    <span>Tổng thanh toán:</span>
                    <span>{totalAmount?.toLocaleString()} ₫</span>
                </div>
             </div>

             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4">Chọn phương thức thanh toán:</h3>
                <div className="space-y-3">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'VIETQR' ? 'border-red-600 bg-red-50' : 'hover:bg-gray-50'}`}>
                        <input type="radio" name="method" className="mr-3" 
                            checked={paymentMethod === 'VIETQR'} 
                            onChange={() => setPaymentMethod('VIETQR')} />
                        <QrCode className="mr-2 text-red-600" /> 
                        <span className="font-medium">Chuyển khoản VietQR</span>
                    </label>

                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'PAYPAL' ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <input type="radio" name="method" className="mr-3" 
                            checked={paymentMethod === 'PAYPAL'} 
                            onChange={() => setPaymentMethod('PAYPAL')} />
                        <CreditCard className="mr-2 text-blue-600" /> 
                        <span className="font-medium">Thẻ quốc tế / PayPal</span>
                    </label>
                </div>
             </div>
          </div>

          <div className="w-full md:w-1/2 bg-white p-6 border border-gray-200 rounded-lg shadow-sm flex flex-col items-center min-h-[400px] justify-center relative">
              
              {paymentMethod === 'VIETQR' && (
                <>
                   {!isInitPayment && (
                     <div className="absolute inset-0 bg-white/90 z-10 flex items-center justify-center">
                        <Loader className="animate-spin text-red-600" />
                     </div>
                   )}
                   <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                       <QrCode size={20} /> Quét mã VietQR
                   </h3>
                   <div className="border-4 border-red-100 p-2 rounded-xl mb-6 shadow-inner">
                       <img src={qrImageUrl} alt="VietQR" className="w-48 h-48 object-contain" />
                   </div>
                   <div className="w-full bg-blue-50 p-3 rounded mb-4 text-center border border-blue-100">
                       <p className="text-xs text-gray-500 uppercase">Nội dung CK</p>
                       <p className="font-mono font-bold text-blue-900 text-lg select-all">{QR_CONTENT}</p>
                   </div>
                   <button onClick={handleCheckStatus} disabled={!isInitPayment || isProcessing}
                       className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
                       {isProcessing ? <Loader className="animate-spin" size={20}/> : <RefreshCw size={20}/>}
                       Tôi đã thanh toán
                   </button>
                   
                </>
              )}

              {paymentMethod === 'PAYPAL' && (
                <div className="text-center w-full">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                        alt="PayPal Logo" 
                        className="h-12 mx-auto mb-6"
                    />
                    <p className="text-gray-600 mb-6 px-4">
                        Bạn sẽ được chuyển hướng đến trang thanh toán bảo mật của PayPal.
                    </p>
                    <button 
                        onClick={handlePaypalStart}
                        disabled={isProcessing}
                        className="w-full bg-[#0070BA] text-white py-3.5 rounded-lg font-bold text-lg hover:bg-[#003087] transition shadow-lg flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <> <Loader className="animate-spin" size={20} /> Đang chuyển hướng... </>
                        ) : (
                            <> Thanh toán với PayPal </>
                        )}
                    </button>
                    <div className="mt-6 p-4 bg-yellow-50 text-sm text-yellow-800 rounded border border-yellow-200 text-left">
                        <strong>Lưu ý:</strong>
                        <ul className="list-disc pl-5 mt-1">
                            <li>Dùng tài khoản PayPal Sandbox để test.</li>
                            <li>Đừng dùng thẻ thật.</li>
                        </ul>
                    </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}