import { useState, useEffect } from 'react';
import { Ticket, CheckCircle, Clock } from 'lucide-react';
import api from '../utils/api';

export default function Dashboard() {
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState({ id: 1, company_id: 1 });

  useEffect(() => {
    loadTickets();
  }, []);

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

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="ticket-registration-page">
      <div className="page-header-beautiful">
        <div className="header-content">
          <h1>📊 My Dashboard</h1>
          <p>Overview of your support requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginTop: '20px' }}>
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
    </div>
  );
}
