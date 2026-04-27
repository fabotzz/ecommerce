import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext.js';

const Cart = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>{t('cart.title')}</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        {items.length === 0 ? (
          <p className="cart-empty">{t('cart.empty')}</p>
        ) : (
          <>
            <ul className="cart-items">
              {items.map(item => (
                <li key={item._id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    <button className="cart-item-remove" onClick={() => removeItem(item._id)}>🗑</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <div className="cart-total">
                <span>{t('cart.total')}</span>
                <strong>R$ {totalPrice.toFixed(2)}</strong>
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{t('cart.checkout')}</button>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={clearCart}>{t('cart.clear')}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;