import { useState, useEffect } from 'react';
import { Ticket, CheckCircle, Clock } from 'lucide-react';
import api from '../utils/api';
import '../App.css';

export default function Dashboard() {
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState({ id: 1, company_id: 1 });

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

  if (loading) return <div className="page-loading"><span>Loading dashboard…</span></div>;

  const total    = myTickets.length;
  const pending  = myTickets.filter(t => t.status === 'open').length;
  const resolved = myTickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="page">
      {/* Page header */}
      <div className="page-header">
        <div className="page-title">
          <div className="page-title-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div>
            <h1>Dashboard</h1>
            <p className="page-subtitle">Overview of your support requests</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap si-blue">
            <Ticket size={20} />
          </div>
          <div className="stat-body">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Requests</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap si-amber">
            <Clock size={20} />
          </div>
          <div className="stat-body">
            <span className="stat-value">{pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap si-green">
            <CheckCircle size={20} />
          </div>
          <div className="stat-body">
            <span className="stat-value">{resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
