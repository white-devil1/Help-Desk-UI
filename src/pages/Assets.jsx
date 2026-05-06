import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Search, Wrench, TrendingUp, DollarSign } from 'lucide-react';
import api from '../utils/api';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [companyId] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assetsRes, dashboardRes] = await Promise.all([
        api.get(`/api/assets?company_id=${companyId}`),
        api.get(`/api/dashboard/${companyId}`)
      ]);
      setAssets(assetsRes.data);
      setDashboard(dashboardRes.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const response = await api.post('/api/assets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ Asset created! Tag: ' + response.data.tag);
      setView('dashboard');
      loadData();
    } catch (err) {
      alert('❌ Failed: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="modern-asset-management">
      {/* Header */}
      <div className="modern-header">
        <div className="header-left">
          <div className="logo-wrapper">
            <div className="logo-icon"><Package size={32} /></div>
            <div>
              <h1>Asset Management</h1>
              <p>Track and manage your company assets</p>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            <TrendingUp size={18} /> Dashboard
          </button>
          <button className={`nav-btn ${view === 'all-assets' ? 'active' : ''}`} onClick={() => setView('all-assets')}>
            <Package size={18} /> All Assets
          </button>
          <button className="btn-primary-modern" onClick={() => setView('add')}>
            <Plus size={20} /> Add Asset
          </button>
        </div>
      </div>

      {/* Dashboard View */}
      {view === 'dashboard' && (
        <>
          <div className="modern-stats-grid">
            <div className="stat-card-modern primary">
              <div className="stat-icon-wrapper"><Package size={28} /></div>
              <div>
                <p className="stat-label">Total Assets</p>
                <h3 className="stat-value">{dashboard.total_assets || 0}</h3>
                <p className="stat-change">{dashboard.by_status?.available || 0} available</p>
              </div>
            </div>
            <div className="stat-card-modern warning">
              <div className="stat-icon-wrapper"><AlertTriangle size={28} /></div>
              <div>
                <p className="stat-label">Critical Alerts</p>
                <h3 className="stat-value">{dashboard.critical_alerts || 0}</h3>
                <p className="stat-change">{dashboard.high_alerts || 0} high priority</p>
              </div>
            </div>
            <div className="stat-card-modern info">
              <div className="stat-icon-wrapper"><Wrench size={28} /></div>
              <div>
                <p className="stat-label">Maintenance Due</p>
                <h3 className="stat-value">{dashboard.maintenance_due || 0}</h3>
                <p className="stat-change">{dashboard.warranty_expiring || 0} warranties expiring</p>
              </div>
            </div>
            <div className="stat-card-modern success">
              <div className="stat-icon-wrapper"><DollarSign size={28} /></div>
              <div>
                <p className="stat-label">Total Value</p>
                <h3 className="stat-value">₹{(dashboard.total_value || 0).toLocaleString()}</h3>
                <p className="stat-change">Asset portfolio value</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* All Assets View */}
      {view === 'all-assets' && (
        <div className="modern-assets-list">
          <div className="list-header">
            <h2>All Assets ({assets.length})</h2>
            <div className="search-box-modern">
              <Search size={18} />
              <input type="text" placeholder="Search assets..." />
            </div>
          </div>
          
          {assets.length === 0 ? (
            <div className="empty-state-modern">
              <Package size={64} />
              <h3>No assets found</h3>
              <p>Click "Add Asset" to create one</p>
            </div>
          ) : (
            <div className="modern-assets-grid">
              {assets.map(asset => (
                <div key={asset.id} className="asset-card-modern">
                  <div className="asset-header-modern">
                    <div>
                      <h3>{asset.name}</h3>
                      <p className="asset-tag">{asset.asset_tag}</p>
                    </div>
                    <span className={`status-badge ${asset.status}`}>{asset.status}</span>
                  </div>
                  <div className="asset-details-modern">
                    <p><strong>Type:</strong> {asset.type}</p>
                    <p><strong>Manufacturer:</strong> {asset.manufacturer}</p>
                    <p><strong>Model:</strong> {asset.model}</p>
                    {asset.serial_number && <p><strong>Serial:</strong> {asset.serial_number}</p>}
                  </div>
                  <div className="asset-actions-modern">
                    <button className="btn-outline">View</button>
                    <button className="btn-outline-primary">Assign</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Asset Form */}
      {view === 'add' && (
        <div className="modern-form-container">
          <h2>Add New Asset</h2>
          <form onSubmit={handleCreateAsset} className="modern-form">
            <div className="form-grid-modern">
              <div className="form-group-modern">
                <label>Asset Name *</label>
                <input name="name" required placeholder="e.g., Dell Laptop" />
              </div>
              <div className="form-group-modern">
                <label>Category *</label>
                <select name="category" required>
                  <option value="">Select...</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                </select>
              </div>
              <div className="form-group-modern">
                <label>Type *</label>
                <input name="type" required placeholder="e.g., Laptop" />
              </div>
              <div className="form-group-modern">
                <label>Manufacturer *</label>
                <input name="manufacturer" required placeholder="e.g., Dell" />
              </div>
              <div className="form-group-modern">
                <label>Model *</label>
                <input name="model" required placeholder="e.g., Latitude 5420" />
              </div>
              <div className="form-group-modern">
                <label>Purchase Date *</label>
                <input name="purchase_date" type="date" required />
              </div>
            </div>
            <input type="hidden" name="company_id" value={companyId} />
            <div className="form-actions-modern">
              <button type="button" className="btn-secondary-modern" onClick={() => setView('dashboard')}>Cancel</button>
              <button type="submit" className="btn-submit-modern">Create Asset</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}