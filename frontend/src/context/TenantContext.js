import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const { tenantSlug } = useParams();
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    if (!tenantSlug) return;
    api.defaults.headers.common['X-Tenant-Slug'] = tenantSlug;
    api.get('/api/auth/tenant/config')
      .then(res => {
        setTenant(res.data);
        applyTheme(res.data.theme);
      })
      .catch(() => {});
  }, [tenantSlug]);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
  };

  return (
    <TenantContext.Provider value={{ tenant, tenantSlug }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);