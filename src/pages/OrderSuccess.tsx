// src/pages/OrderSuccess.tsx
import { useLocation, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg text-center max-w-md w-full">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua sắm tại AIMS. Hóa đơn đã được gửi tới email của bạn.
        </p>

        <div className="bg-gray-100 p-4 rounded text-left text-sm mb-6">
          <p><strong>Mã giao dịch:</strong> {state?.transactionId}</p>
          <p><strong>Tổng tiền:</strong> {state?.amount?.toLocaleString()} VND</p>
          <p><strong>Trạng thái:</strong> Đang chờ xử lý</p>
        </div>

        <Link to="/" className="block w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}