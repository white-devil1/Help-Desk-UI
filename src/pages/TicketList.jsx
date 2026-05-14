import { useState, useEffect } from 'react';
import { Ticket, Search, X, Eye } from 'lucide-react';
import api from '../utils/api';
import '../App.css';

export default function TicketList() {
  const [tickets, setTickets]               = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [showModal, setShowModal]           = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm]         = useState('');
  const [filterStatus, setFilterStatus]     = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => { loadTickets(); }, []);

  useEffect(() => { applyFilters(); }, [searchTerm, filterStatus, filterPriority, tickets]);

  const loadTickets = async () => {
    try {
      const response = await api.get('/api/tickets/all');
      setTickets(response.data);
    } catch (err) {
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.ticket_number?.toLowerCase().includes(term) ||
        t.title?.toLowerCase().includes(term)
      );
    }
    if (filterStatus !== 'all')   filtered = filtered.filter(t => t.status === filterStatus);
    if (filterPriority !== 'all') filtered = filtered.filter(t => t.priority === filterPriority);
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredTickets(filtered);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const statusBadge   = (s) => `badge badge-${s}`;
  const priorityBadge = (p) => `badge badge-${p}`;

  if (loading) return <div className="page-loading"><span>Loading tickets…</span></div>;

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-header">
        <div className="page-title">
          <div className="page-title-icon">
            <Ticket size={20} />
          </div>
          <div>
            <h1>All Tickets</h1>
            <p className="page-subtitle">{filteredTickets.length} tickets · {filteredTickets.filter(t => t.status === 'open').length} open</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search tickets…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          className="filter-select"
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  No tickets found
                </td>
              </tr>
            ) : (
              filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="col-mono">{ticket.ticket_number}</td>
                  <td className="col-strong">{ticket.title}</td>
                  <td className="col-muted">{ticket.ticket_type}</td>
                  <td><span className={statusBadge(ticket.status)}>{ticket.status}</span></td>
                  <td><span className={priorityBadge(ticket.priority)}>{ticket.priority}</span></td>
                  <td className="col-muted">{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-icon-sm"
                      onClick={() => handleViewTicket(ticket)}
                      title="View details"
                      style={{ color: 'var(--accent)' }}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {showModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTicket.title}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-panel">
                <div className="detail-row">
                  <span className="detail-key">Ticket Number</span>
                  <span className="detail-val col-mono">{selectedTicket.ticket_number}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Status</span>
                  <span className={statusBadge(selectedTicket.status)}>{selectedTicket.status}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Priority</span>
                  <span className={priorityBadge(selectedTicket.priority)}>{selectedTicket.priority}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Type</span>
                  <span className="detail-val">{selectedTicket.ticket_type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Created</span>
                  <span className="detail-val">{new Date(selectedTicket.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="desc-box">
                <h3>Description</h3>
                <ul>
                  {selectedTicket.description
                    ? selectedTicket.description.replace(/\*\*/g, '').split('\n').filter(l => l.trim()).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))
                    : <li>No description provided.</li>
                  }
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
