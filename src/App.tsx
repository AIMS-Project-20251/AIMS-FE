import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các pages bạn đã tạo
import DeliveryInfo from './pages/DeliveryInfo';
import PaymentScreen from './pages/PaymentScreen';
import OrderSuccess from './pages/OrderSuccess';
import OrderFail from './pages/OrderFail';

function App() {
  return (
    <BrowserRouter>
      {/* Bạn có thể thêm Header/Navbar chung ở đây nếu muốn 
        <Header /> 
      */}
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Trang chủ: Mặc định vào form nhập thông tin giao hàng */}
          <Route path="/" element={<DeliveryInfo />} />

          {/* Trang thanh toán */}
          <Route path="/payment" element={<PaymentScreen />} />

          {/* Trang thông báo thành công */}
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Trang thông báo thất bại */}
          <Route path="/order-fail" element={<OrderFail />} />

          {/* Route 404: Nếu nhập đường dẫn sai thì quay về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Bạn có thể thêm Footer chung ở đây
        <Footer /> 
      */}
    </BrowserRouter>
  );
}

export default App;