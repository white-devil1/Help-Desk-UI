import { useState, useEffect } from 'react';
import { Ticket, Plus, MessageSquare, X } from 'lucide-react';
import api from '../utils/api';
import '../App.css';

export default function TicketRegistration() {
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentUser] = useState({ id: 1, company_id: 1 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticket_type: 'general',
    priority: 'normal'
  });

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = async () => {
    try {
      const response = await api.get(`/api/tickets/${currentUser.id}`);
      setMyTickets(response.data);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/tickets', {
        title: formData.title,
        description: formData.description,
        category: formData.ticket_type,
        priority: formData.priority,
        user_id: currentUser.id,
      });
      
      const newTicketId = response.data.ticket_id;
      const ticketNum = `TCK-${String(newTicketId).padStart(4, '0')}`;
      
      alert(`✅ Ticket ${ticketNum} created successfully!`);
      setShowForm(false);
      setFormData({ title: '', description: '', ticket_type: 'general', priority: 'normal' });
      loadTickets();
    } catch (err) {
      console.error('Submission error:', err);
      alert('❌ Failed to create ticket: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadge = (status) => `badge badge-${status}`;

  if (loading) return <div className="page-loading"><span>Loading tickets…</span></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">
          <div className="page-title-icon">
            <Ticket size={20} />
          </div>
          <div>
            <h1>IT Support & Asset Requests</h1>
            <p className="page-subtitle">Submit requests for repairs, replacements, or upgrades</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} /> New Request
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <MessageSquare size={16} />
            My Requests
          </span>
          <span className="badge badge-normal" style={{ fontSize: '10px' }}>{myTickets.length} tickets</span>
        </div>
        <div className="card-body">
          {myTickets.length === 0 ? (
            <div className="empty-state">
              <Ticket size={48} />
              <h3>No requests yet</h3>
              <p>Click "New Request" to submit your first ticket</p>
            </div>
          ) : (
            <div className="tickets-grid">
              {myTickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-card-top">
                    <h3 className="ticket-card-title">{ticket.title}</h3>
                    <span className={statusBadge(ticket.status)}>{ticket.status}</span>
                  </div>
                  <p className="ticket-card-desc">{ticket.description}</p>
                  <div className="ticket-card-meta">
                    <span>#{ticket.ticket_number}</span>
                    <span>{ticket.ticket_type}</span>
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onMouseDown={() => setShowForm(false)}>
          <div className="modal" onMouseDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Request</h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Laptop not working"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ticket Type</label>
                  <select
                    className="form-select"
                    value={formData.ticket_type}
                    onChange={e => setFormData({ ...formData, ticket_type: e.target.value })}
                  >
                    <option value="general">General IT</option>
                    <option value="asset_repair">Asset Repair</option>
                    <option value="asset_replacement">Asset Replacement</option>
                    <option value="asset_upgrade">Asset Upgrade</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Describe your issue in detail…"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'GENERATING...' : 'SUBMIT REQUEST'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
