import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paymentService } from "../services/paymentService";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState<boolean>(true);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmPaypalPayment = async () => {
      if (!token) {
        // Không có token → coi như success từ nguồn khác (VD: VietQR)
        setLoading(false);
        return;
      }

      try {
        const response = await paymentService.confirmPaypal(token);

        // Giả sử BE trả về:
        // { transactionId, amount }
        setTransactionId(response.transactionId);
        setAmount(response.amount);
      } catch (err) {
        console.error("Lỗi confirm PayPal:", err);
        setError("Không thể xác nhận thanh toán PayPal.");
      } finally {
        setLoading(false);
      }
    };

    confirmPaypalPayment();
  }, [token]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">
            Đang xác nhận thanh toán...
          </p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow-lg text-center max-w-md w-full border-t-4 border-red-500">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Xác nhận thanh toán thất bại
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>

          <Link
            to="/"
            className="block w-full bg-gray-700 text-white py-2 rounded font-medium hover:bg-gray-800"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  /* ================= SUCCESS ================= */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg text-center max-w-md w-full border-t-4 border-green-500">
        
        <div className="text-green-500 text-6xl mb-4">✓</div>

        <h1 className="text-2xl font-bold mb-2">
          Đặt hàng thành công!
        </h1>

        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua sắm tại AIMS. Hóa đơn đã được gửi tới email của bạn.
        </p>

        <div className="bg-gray-100 p-4 rounded text-left text-sm mb-6">
          <p>
            <strong>Mã giao dịch:</strong>{" "}
            {transactionId ?? "Đang cập nhật"}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            {amount ? amount.toLocaleString() + " VND" : "Đang cập nhật"}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span className="text-green-600 font-medium">
              Thanh toán thành công
            </span>
          </p>
        </div>

        <Link
          to="/"
          className="block w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
