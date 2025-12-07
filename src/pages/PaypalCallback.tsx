import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { Loader } from 'lucide-react';

export default function PaypalCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    
    const confirmPayment = async () => {
      if (!token) {
        alert("Lỗi: Không tìm thấy Token giao dịch.");
        navigate('/');
        return;
      }

      try {
        processedRef.current = true;
        console.log("Đang xác nhận PayPal token:", token);
        
        await paymentService.confirmPaypal(token);

        navigate('/order-success', { 
            state: { method: 'PAYPAL' } 
        });

      } catch (error: any) {
        console.error("Lỗi xác nhận PayPal:", error);
        alert("Thanh toán PayPal thất bại hoặc bị hủy.");
        navigate('/order-fail');
      }
    };

    confirmPayment();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader className="animate-spin text-blue-600 mb-4" size={48} />
      <h2 className="text-xl font-bold text-gray-700">Đang xử lý thanh toán PayPal...</h2>
      <p className="text-gray-500">Vui lòng không tắt trình duyệt.</p>
    </div>
  );
}