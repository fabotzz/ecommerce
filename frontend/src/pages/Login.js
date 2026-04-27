import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import '../App.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { tenantSlug } = useParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (['seller', 'tenant_admin', 'super_admin'].includes(user.role)) {
        navigate(`/${tenantSlug}/dashboard`);
      } else {
        navigate(`/${tenantSlug}`);
      }
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Entrar</h2>
        <p className="subtitle">Bem-vindo de volta</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="auth-field">
            <label>Senha</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-link">Não tem conta? <Link to={`/${tenantSlug}/register`}>Criar conta</Link></p>
      </div>
    </div>
  );
};

export default Login;