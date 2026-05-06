import { useState, useEffect } from 'react';
import { Ticket, Plus, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import api from '../utils/api';

export default function TicketRegistration() {
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUser] = useState({ id: 1, company_id: 1 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticket_type: 'general',
    priority: 'normal'
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await api.get(`/api/tickets?company_id=${currentUser.company_id}`);
      setMyTickets(response.data);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/tickets', {
        ...formData,
        company_id: currentUser.company_id,
        requested_by: currentUser.id,
      });
      alert('✅ Ticket created successfully!');
      setShowForm(false);
      setFormData({ title: '', description: '', ticket_type: 'general', priority: 'normal' });
      loadTickets();
    } catch (err) {
      alert('❌ Failed to create ticket: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading tickets...</div>;

  return (
    <div className="ticket-registration-page">
      {/* Header */}
      <div className="page-header-beautiful">
        <div className="header-content">
          <h1><Ticket size={36} /> IT Support & Asset Requests</h1>
          <p>Submit requests for repairs, replacements, or upgrades</p>
        </div>
        <button className="btn-primary-large" onClick={() => setShowForm(true)}>
          <Plus size={20} /> New Request
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon blue"><Ticket size={24} /></div>
          <div>
            <p className="stat-label">Total Requests</p>
            <p className="stat-number">{myTickets.length}</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon orange"><Clock size={24} /></div>
          <div>
            <p className="stat-label">Pending</p>
            <p className="stat-number">{myTickets.filter(t => t.status === 'open').length}</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div>
            <p className="stat-label">Resolved</p>
            <p className="stat-number">{myTickets.filter(t => t.status === 'resolved').length}</p>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="section-beautiful">
        <h2 className="section-title"><MessageSquare size={24} /> My Requests</h2>
        
        {myTickets.length === 0 ? (
          <div className="empty-state-beautiful">
            <Ticket size={64} />
            <h3>No requests yet</h3>
            <p>Click "New Request" to submit your first ticket</p>
          </div>
        ) : (
          <div className="tickets-grid-beautiful">
            {myTickets.map(ticket => (
              <div key={ticket.id} className="ticket-card-beautiful">
                <div className="ticket-header-beautiful">
                  <h3>{ticket.title}</h3>
                  <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                </div>
                <p>{ticket.description}</p>
                <div className="ticket-meta">
                  <span>#{ticket.ticket_number}</span>
                  <span>{ticket.ticket_type}</span>
                  <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay-beautiful">
          <div className="modal-beautiful">
            <h2>Create New Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="e.g., Laptop not working"
                />
              </div>
              <div className="form-group">
                <label>Ticket Type</label>
                <select 
                  value={formData.ticket_type} 
                  onChange={(e) => setFormData({...formData, ticket_type: e.target.value})}
                >
                  <option value="general">General IT</option>
                  <option value="asset_repair">Asset Repair</option>
                  <option value="asset_replacement">Asset Replacement</option>
                  <option value="asset_upgrade">Asset Upgrade</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select 
                  value={formData.priority} 
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="4"
                  placeholder="Describe your issue in detail..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Submit Request</button>
              </div>
              // Inside TicketRegistration.jsx, right after the header:
              <div className="flex justify-end mb-4">
                <button 
                    className="btn-outline-primary"
                    onClick={() => window.location.href = '/tickets/all'}
  >
                    📊 View All Tickets (Admin)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}