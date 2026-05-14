import { useState, useEffect } from 'react';
import { Ticket, CheckCircle, Clock, TrendingUp, BarChart as ChartIcon } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
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

  // Process data for the chart
  const getChartData = () => {
    const statusCounts = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };
    
    myTickets.forEach(t => {
      const status = t.status.toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      } else {
        statusCounts['open']++; // Default fallback
      }
    });

    return [
      { name: 'Open', count: statusCounts.open, color: '#3b82f6' },
      { name: 'In Progress', count: statusCounts.in_progress, color: '#f59e0b' },
      { name: 'Resolved', count: statusCounts.resolved, color: '#10b981' },
      { name: 'Closed', count: statusCounts.closed, color: '#6b7280' },
    ];
  };

  const chartData = getChartData();

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="ticket-registration-page">
      <div className="page-header-beautiful">
        <div className="header-content">
          <h1>📊 My Dashboard</h1>
          <p>Overview of your support requests</p>
        </div>
      </div>

      {/* Stats Grid */}
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
            <p className="stat-number">{myTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div>
            <p className="stat-label">Resolved</p>
            <p className="stat-number">{myTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}</p>
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="section-beautiful">
        <h2 className="chart-title"><TrendingUp size={24} color="#10b981" /> Request Volume by Status</h2>
        <div className="chart-container-beautiful">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '10px'
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
