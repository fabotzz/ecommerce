import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import '../App.css';

const emptyForm = { name: '', price: '', description: '', category: 'Clothing', inStock: true, image: '' };
const categories = ['Clothing', 'Footwear', 'Electronics', 'Accessories'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tenantSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch { setError('Erro ao carregar produtos'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, price: p.price, description: p.description, category: p.category, inStock: p.inStock, image: p.image || '' }); setError(''); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        const res = await api.put(`/api/products/${editing._id}`, { ...form, price: parseFloat(form.price) });
        setProducts(products.map(p => p._id === editing._id ? res.data : p));
      } else {
        const res = await api.post('/api/products', { ...form, price: parseFloat(form.price) });
        setProducts([res.data, ...products]);
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar produto');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja remover este produto?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch { alert('Erro ao remover produto'); }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Painel do Seller</h1>
            <p>Olá, {user?.name} — <span style={{ color: 'var(--primary)' }}>{user?.role}</span></p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to={`/${tenantSlug}`} className="btn-secondary">Ver loja</Link>
            <button onClick={logout} className="btn-secondary">Sair</button>
          </div>
        </div>
      </header>

      <main className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.1rem' }}>Produtos ({products.length})</h2>
          <button className="btn-primary" onClick={openCreate}>+ Novo produto</button>
        </div>

        {loading ? <p style={{ color: '#64748b' }}>Carregando...</p> : products.length === 0 ? (
          <p style={{ color: '#64748b' }}>Nenhum produto cadastrado.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>R$ {product.price.toFixed(2)}</td>
                  <td>{product.inStock ? '✅' : '❌'}</td>
                  <td>
                    <button className="btn-table-edit" onClick={() => openEdit(product)}>Editar</button>
                    <button className="btn-danger" onClick={() => handleDelete(product._id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Editar produto' : 'Novo produto'}</h3>
              <button className="cart-close" onClick={closeModal}>✕</button>
            </div>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>Nome</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="auth-field">
                <label>Preço (R$)</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="auth-field">
                <label>Descrição</label>
                <textarea className="modal-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required />
              </div>
              <div className="auth-field">
                <label>Categoria</label>
                <select className="modal-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="auth-field">
                <label>URL da imagem (opcional)</label>
                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="auth-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} />
                <label htmlFor="inStock" style={{ margin: 0 }}>Em estoque</label>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={saving}>
                {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar produto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;