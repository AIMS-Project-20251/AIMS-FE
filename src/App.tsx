import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các pages bạn đã tạo
import DeliveryInfo from './pages/DeliveryInfo';
import PaymentScreen from './pages/PaymentScreen';
import OrderSuccess from './pages/OrderSuccess';
import OrderFail from './pages/OrderFail';

function App() {
  return (
    <BrowserRouter>
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<DeliveryInfo />} />

          <Route path="/payment" element={<PaymentScreen />} />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/order-fail" element={<OrderFail />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
    </BrowserRouter>
  );
}

export default App;