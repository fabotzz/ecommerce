import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useTenant } from '../context/TenantContext.js';
import Cart from '../components/Cart.js';
import api from '../api/axios.js';
import '../App.css';
import '../components/Cart.css';

const Store = () => {
  const { t, i18n } = useTranslation();
  const { addItem, totalItems } = useCart();
  const { user, logout, isRole } = useAuth();
  const { tenant } = useTenant();
  const { tenantSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="app">
      <div className="language-selector">
        <button onClick={() => i18n.changeLanguage('pt')} className="lang-btn">🇧🇷 PT</button>
        <button onClick={() => i18n.changeLanguage('en')} className="lang-btn">🇺🇸 EN</button>
      </div>

      <header className="header">
        <div className="header-content">
          <div>
            <h1>{tenant?.name || tenantSlug}</h1>
            <p>{products.length} produtos disponíveis</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {user ? (
              <>
                <div className="user-badge">
                  {user.name} — <span>{user.role}</span>
                </div>
                {isRole('seller', 'tenant_admin', 'super_admin') && (
                  <Link to={`/${tenantSlug}/dashboard`} className="btn-secondary">Painel</Link>
                )}
                <button onClick={logout} className="btn-secondary">Sair</button>
              </>
            ) : (
              <Link to={`/${tenantSlug}/login`} className="btn-secondary">Entrar</Link>
            )}
            <button className="btn-cart" onClick={() => setCartOpen(true)}>
              🛒 Carrinho
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img
              src={product.image || 'https://via.placeholder.com/300'}
              alt={product.name}
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '4px' }}
            />
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="category">{product.category}</p>
            <p className="price">R$ {product.price.toFixed(2)}</p>
            <button className="btn-add" onClick={() => addItem(product)}>
              {t('cart.addToCart')}
            </button>
          </div>
        ))}
      </main>

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Store;