import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para mudar idioma
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="App">
      {/* Language Selector */}
      <div className="language-selector">
        <button onClick={() => changeLanguage('pt')} className="lang-btn">
          🇧🇷 PT
        </button>
        <button onClick={() => changeLanguage('en')} className="lang-btn">
          🇺🇸 EN
        </button>
      </div>

      <header className="header">
        <h1>{t('navigation.home')}</h1>
        <p>{products.length} {t('product.in_stock').toLowerCase()}</p>
      </header>
      
      <main className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="category">
              {t('product.category')}: {product.category}
            </p>
            <p className="price">
              {t('product.price')}: R$ {product.price.toFixed(2)}
            </p>
            <button className="btn-add">
              {t('product.add_to_cart')}
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;