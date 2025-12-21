import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
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
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/payment" element={<PaymentScreen />} />

          <Route path="/payment/paypal-callback" element={<PaypalCallback />} />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/order-fail" element={<OrderFail />} />

          <Route path="/admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />

          <Route path="/product/:id/:type" element={<ProductDetail />} />
          
          <Route path="/delivery-info" element={<DeliveryInfo />} />

          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </div>
  );
}

export default App;