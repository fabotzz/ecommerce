import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import '../App.css';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'super_admin') {
      navigate('/superadmin/login');
      return;
    }
    loadTenants();
  }, [user]);

  const loadTenants = async () => {
    try {
      const res = await api.get('/superadmin/tenants');
      setTenants(res.data);
    } catch { console.error('Erro ao carregar tenants'); }
    finally { setLoading(false); }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Super Admin</h1>
            <p>Gerenciamento global de tenants</p>
          </div>
          <button onClick={() => { logout(); navigate('/superadmin/login'); }} className="btn-secondary">
            Sair
          </button>
        </div>
      </header>
      <main className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.1rem' }}>Tenants ({tenants.length})</h2>
        </div>
        {loading ? <p style={{ color: '#64748b' }}>Carregando...</p> : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th>Plano</th>
                <th>Status</th>
                <th>Acessar</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map(t => (
                <tr key={t._id}>
                  <td>{t.name}</td>
                  <td style={{ color: 'var(--primary)' }}>/{t.slug}</td>
                  <td>{t.plan}</td>
                  <td>{t.active ? '✅ Ativo' : '❌ Inativo'}</td>
                  <td>
                    <a href={`/${t.slug}`} className="btn-table-edit" style={{ textDecoration: 'none' }}>
                      Ver loja
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default SuperAdminDashboard;