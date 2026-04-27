import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import '../App.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { tenantSlug } = useParams();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate(`/${tenantSlug}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Criar conta</h2>
        <p className="subtitle">Preencha seus dados para começar</p>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Nome</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="auth-field">
            <label>Senha</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} minLength={6} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>
        <p className="auth-link">Já tem conta? <Link to={`/${tenantSlug}/login`}>Entrar</Link></p>
      </div>
    </div>
  );
};

export default Register;