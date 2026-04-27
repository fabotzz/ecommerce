import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { TenantProvider } from './context/TenantContext.js';
import PrivateRoute from './components/PrivateRoute.js';
import Store from './pages/Store.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import SuperAdminLogin from './pages/SuperAdminLogin.js';
import SuperAdminDashboard from './pages/SuperAdminDashboard.js';

const TenantRoutes = () => (
  <TenantProvider>
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="" element={<Store />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={
            <PrivateRoute roles={['seller', 'tenant_admin', 'super_admin']}>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </CartProvider>
    </AuthProvider>
  </TenantProvider>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/superadmin/login" element={<AuthProvider><SuperAdminLogin /></AuthProvider>} />
      <Route path="/superadmin/dashboard" element={<AuthProvider><SuperAdminDashboard /></AuthProvider>} />
      <Route path="/:tenantSlug/*" element={<TenantRoutes />} />
      <Route path="/" element={<AuthProvider><SuperAdminLogin /></AuthProvider>} />
    </Routes>
  </BrowserRouter>
);

export default App;