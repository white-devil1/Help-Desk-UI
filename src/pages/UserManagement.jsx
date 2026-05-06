import { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Shield, X, Edit, Trash2, CheckCircle } from 'lucide-react';
import api from '../utils/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    is_active: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/api/users/company/1'); // Replace with real company_id
      setUsers(res.data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/api/users/register', {
        ...formData,
        company_id: 1 // Replace with real company_id
      });
      
      alert('✅ User created successfully!');
      setShowAddModal(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'employee',
        department: '',
        is_active: true
      });
      loadUsers();
    } catch (err) {
      alert('❌ Failed to create user: ' + (err.response?.data?.detail || err.message));
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="modern-asset-management">
      {/* Header */}
      <div className="modern-header">
        <div className="header-left">
          <div className="logo-icon"><Users size={32} /></div>
          <div>
            <h1>User Management</h1>
            <p>Manage employees, logins, and roles</p>
          </div>
        </div>
        <div className="header-actions">
          <button className={`nav-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            All Users
          </button>
          <button className="btn-primary-modern" onClick={() => setShowAddModal(true)}>
            <UserPlus size={20} /> Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="modern-stats-grid">
        <div className="stat-card-modern primary">
          <div className="stat-icon-wrapper"><Users size={28} /></div>
          <div>
            <p className="stat-label">Total Employees</p>
            <h3 className="stat-value">{users.length}</h3>
          </div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-icon-wrapper"><CheckCircle size={28} /></div>
          <div>
            <p className="stat-label">Active Users</p>
            <h3 className="stat-value">{users.filter(u => u.is_active).length}</h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      {view === 'list' && (
        <div className="modern-assets-list">
          <h2>Employee Directory ({filteredUsers.length})</h2>
          
          {filteredUsers.length === 0 ? (
            <div className="empty-state-modern">
              <Users size={48} />
              <h3>No users found</h3>
              <p>Click "Add User" to create your first employee</p>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="user-name">{user.username}</p>
                            <p className="user-id">ID: #{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          <Shield size={14} />
                          {user.role}
                        </span>
                      </td>
                      <td>{user.department || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon edit" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button className="btn-icon delete" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-user-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header-purple">
              <div className="header-icon-purple">
                <UserPlus size={24} />
              </div>
              <div>
                <h2>Add New User</h2>
                <p>Create a new employee account</p>
              </div>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>
                      <Users size={16} /> Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Users size={16} /> Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="employee@company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Shield size={16} /> Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter password"
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Shield size={16} /> Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="hr">HR</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., IT, HR, Finance, Sales"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          is_active: e.target.checked
                        }))}
                      />
                      <span>Account is active (user can login)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-purple">
                  <UserPlus size={18} />
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}