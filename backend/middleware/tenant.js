import Tenant from '../models/Tenant.js';

const resolveTenant = async (req, res, next) => {
  try {
    const host = req.headers.host || '';
    const hostWithoutPort = host.split(':')[0];
    const parts = hostWithoutPort.split('.');
    const subdomainSlug = parts.length >= 2 && parts[0] !== 'localhost' ? parts[0] : null;
    const headerSlug = req.headers['x-tenant-slug'];
    const querySlug = req.query.tenant;
    const resolvedSlug = subdomainSlug || headerSlug || querySlug;

    if (!resolvedSlug) {
      return res.status(400).json({ error: 'Tenant not identified' });
    }

    const tenant = await Tenant.findOne({ slug: resolvedSlug, active: true });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    req.tenant = tenant;
    req.tenantId = tenant._id;
    next();
  } catch (error) {
    console.error('Tenant resolution error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default resolveTenant;