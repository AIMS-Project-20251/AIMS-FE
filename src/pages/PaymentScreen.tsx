// src/pages/PaymentScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package, Truck, CreditCard, QrCode, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Dữ liệu nhận từ trang trước (DeliveryInfo)
  const { cartItems = [], cartTotal, shippingFee } = state || { cartTotal: 0, shippingFee: 0 };
 

  // 3 sản phẩm mẫu đẹp để hiển thị khi không có giỏ hàng thật
  const exampleProducts = [
    { 
      id: 'p1', 
      name: 'Áo thun AIMS - Premium Cotton', 
      price: 129000, 
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
    },
    { 
      id: 'p2', 
      name: 'Mũ lưỡi trai AIMS Logo', 
      price: 89000, 
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop'
    },
    { 
      id: 'p3', 
      name: 'Túi tote vải canvas AIMS', 
      price: 69000, 
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1584911846040-0ub8a2b2f2c8?w=400&h=400&fit=crop'
    },
  ];

  const effectiveCartItems = Array.isArray(cartItems) && cartItems.length > 0 
    ? cartItems 
    : exampleProducts;

  const isUsingExample = effectiveCartItems === exampleProducts;

  // Tính toán hóa đơn
  const subtotalExclVAT = useMemo(() => {
    if (Array.isArray(effectiveCartItems) && effectiveCartItems.length > 0) {
      return effectiveCartItems.reduce((s: number, it: any) => s + (Number(it.price ?? 0) * Number(it.quantity ?? 1)), 0);
    }
    return Number(cartTotal) || 0;
  }, [effectiveCartItems, cartTotal]);

  const vat = Number((subtotalExclVAT * 0.1).toFixed(0)); // 10% VAT, rounded
  const totalProductsInclVAT = subtotalExclVAT + vat;
  const totalAmount = totalProductsInclVAT + Number(shippingFee || 0);

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
        amount: totalAmount,
        items: effectiveCartItems
        } 
      });
    }, 1500);
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
    }, 1500);
  };

  return (
    <div className="mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Thanh toán đơn hàng</h1>

        
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-start">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
          {/* Phần 1: Invoice Screen - Hiển thị hóa đơn [cite: 63] */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Package className="w-6 h-6" />
                Chi tiết đơn hàng
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Danh sách sản phẩm */}
              <div className="space-y-4">
                {effectiveCartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-lg w-20 h-20" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Số lượng: <span className="font-medium">{item.quantity}</span>
                      </p>
                      <div className="mt-2 flex justify-between items-end">
                        <span className="text-lg font-bold text-red-600">
                          {(item.price * item.quantity).toLocaleString()}₫
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.price.toLocaleString()}₫ / cái
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng kết */}
              <div className="space-y-3 pt-4 border-t-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{subtotalExclVAT.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế VAT (10%)</span>
                  <span>{vat.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Phí vận chuyển
                  </span>
                  <span>{Number(shippingFee).toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-red-600 pt-4 border-t-2">
                  <span>Tổng thanh toán</span>
                  <span>{totalAmount.toLocaleString()}₫</span>
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-center">
              <button               
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full max-w-xs"
              >
                Thay đổi giỏ hàng
              </button>
              </div>

            </div>
          </div>

          {/* Phần 2: Payment Method & QR */}
          <div className="space-y-6">
            {/* Chọn phương thức */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4">Phương thức thanh toán</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('QR')}
                  className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                    paymentMethod === 'QR' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <QrCode className="w-10 h-10" />
                  <span className="font-bold">VietQR (QR Code)</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('Credit')}
                  className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                    paymentMethod === 'Credit' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="w-10 h-10" />
                  <span className="font-bold">Thẻ quốc tế (PayPal)</span>
                </button>
              </div>
            </div>

            {/* Khu vực thanh toán */}
            <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-xl font-bold text-red-600">Đang xử lý giao dịch...</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'QR' ? (
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-6">Quét mã QR để thanh toán</h3>
                  <img 
                    src={`https://img.vietqr.io/image/MB-07738383838-compact2.png?amount=${totalAmount}&addInfo=AIMS%20Order%20${Date.now()}`} 
                    alt="VietQR"
                    className="w-64 h-64 mx-auto border-4 border-gray-200 rounded-xl shadow-xl"
                  />
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Số tiền:</p>
                    <p className="text-3xl font-bold text-red-600">{totalAmount.toLocaleString()}₫</p>
                    <p className="text-sm text-gray-500 mt-2">Nội dung: <strong>AIMS Order {Date.now().toString().slice(-6)}</strong></p>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button onClick={handlePaymentSuccess} className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-lg">
                      Tôi đã hoàn tất thanh toán (Demo Success)
                    </button>
                    <button onClick={() => handlePaymentError("Thanh toán bị hủy hoặc quá thời gian")} className="w-full bg-red-100 text-red-700 py-4 rounded-lg font-bold hover:bg-red-200 transition">
                      Mô phỏng Thất bại (Demo Fail)
                    </button>
                  </div>
                </div>
              ) : (
              <div className="text-center w-full">
                  <p className="mb-4 font-medium">Thanh toán qua PayPal Sandbox</p>
                  <div className="p-8 border-2 border-dashed border-gray-300 rounded bg-gray-50 mb-4">
                    [PayPal Buttons Component Placeholder]
                  </div>

                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">Số tiền:</p>
                    <p className="text-3xl font-bold text-red-600">{totalAmount.toLocaleString()}₫</p>
                    <p className="text-sm text-gray-500 mt-2">Nội dung: <strong>AIMS Order {Date.now().toString().slice(-6)}</strong></p>
                  </div>
                  
                  {/* Demo nút lỗi cho PayPal */}
                  <button 
                    onClick={() => handlePaymentError("Thẻ tín dụng bị từ chối do không đủ số dư.")}
                    className="text-sm text-red-500 underline hover:text-red-700">
                    Click để test lỗi thanh toán thẻ
                  </button>

                  <div className="mt-8 space-y-3">
                    <button onClick={handlePaymentSuccess} 
                    className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-lg">
                      Tôi đã hoàn tất thanh toán (Demo Success)
                    </button>
                    <button onClick={() => handlePaymentError("Thanh toán bị hủy hoặc quá thời gian")} 
                    className="w-full bg-red-100 text-red-700 py-4 rounded-lg font-bold hover:bg-red-200 transition">
                      Mô phỏng Thất bại (Demo Fail)
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}