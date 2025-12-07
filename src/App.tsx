import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DeliveryInfo from './pages/DeliveryInfo';
import PaymentScreen from './pages/PaymentScreen';
import OrderSuccess from './pages/OrderSuccess';
import OrderFail from './pages/OrderFail';
import ProductManager from './pages/ProductManager';
import ProductDetail from './pages/ProductDetail';
import HomePage from './pages/HomePage';
import PaypalCallback from './pages/PaypalCallback';

function App() {
  return (
    <BrowserRouter>
      
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/payment" element={<PaymentScreen />} />

          <Route path="/payment/paypal-callback" element={<PaypalCallback />} />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/order-fail" element={<OrderFail />} />

          <Route path="/admin/products" element={<ProductManager />} />

          <Route path="/product/:id" element={<ProductDetail />} />
          
          <Route path="/checkout" element={<DeliveryInfo />} />

          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </div>
      
    </BrowserRouter>
  );
}

export default App;