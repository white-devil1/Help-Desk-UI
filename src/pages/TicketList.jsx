// import { useState, useEffect } from 'react';
// import { 
//   Ticket, Search, X, ChevronLeft, ChevronRight, 
//   Eye, Calendar, Clock, AlertCircle, CheckCircle, Filter 
// } from 'lucide-react';
// import api from '../utils/api';

// export default function TicketList() {
//   const [tickets, setTickets] = useState([]);
//   const [filteredTickets, setFilteredTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [showModal, setShowModal] = useState(false);
  
//   // Search & Filter State
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [filterPriority, setFilterPriority] = useState('all');
//   const [filterType, setFilterType] = useState('all');
  
//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ticketsPerPage] = useState(8);

//   useEffect(() => {
//     loadTickets();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, filterStatus, filterPriority, filterType, tickets]);

//   const loadTickets = async () => {
//     try {
//       // Fetch all tickets
//       const response = await api.get('/api/tickets?company_id=1');
//       setTickets(response.data);
//     } catch (err) {
//       console.error('Error loading tickets:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...tickets];

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(ticket =>
//         ticket.ticket_number?.toLowerCase().includes(term) ||
//         ticket.title?.toLowerCase().includes(term) ||
//         ticket.description?.toLowerCase().includes(term)
//       );
//     }

//     if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus);
//     if (filterPriority !== 'all') filtered = filtered.filter(t => t.priority === filterPriority);
//     if (filterType !== 'all') filtered = filtered.filter(t => t.ticket_type === filterType);

//     setFilteredTickets(filtered);
//     setCurrentPage(1);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterStatus('all');
//     setFilterPriority('all');
//     setFilterType('all');
//   };

//   // Pagination Logic
//   const indexOfLastTicket = currentPage * ticketsPerPage;
//   const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
//   const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
//   const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

//   const viewTicketDetails = (ticket) => {
//     setSelectedTicket(ticket);
//     setShowModal(true);
//   };

//   if (loading) return <div className="loading">Loading tickets...</div>;

//   return (
//     <div className="ticket-list-page">
//       {/* 🟣 MODERN HEADER */}
//       <div className="modern-header">
//         <div className="header-left">
//           <div className="logo-icon"><Ticket size={32} /></div>
//           <div>
//             <h1>All Tickets</h1>
//             <p>View and manage all support tickets</p>
//           </div>
//         </div>
//         <div className="header-stats-badge">
//            <span>Total: {filteredTickets.length}</span>
//         </div>
//       </div>

//       {/* 📊 STAT CARDS */}
//       <div className="modern-stats-grid">
//         <div className="stat-card-modern info">
//           <div className="stat-icon-wrapper"><Ticket size={28} /></div>
//           <div>
//             <p className="stat-label">Total Tickets</p>
//             <h3 className="stat-value">{filteredTickets.length}</h3>
//           </div>
//         </div>
//         <div className="stat-card-modern warning">
//           <div className="stat-icon-wrapper"><Clock size={28} /></div>
//           <div>
//             <p className="stat-label">Pending</p>
//             <h3 className="stat-value">{filteredTickets.filter(t => t.status === 'open').length}</h3>
//           </div>
//         </div>
//         <div className="stat-card-modern success">
//           <div className="stat-icon-wrapper"><CheckCircle size={28} /></div>
//           <div>
//             <p className="stat-label">Resolved</p>
//             <h3 className="stat-value">{filteredTickets.filter(t => t.status === 'resolved').length}</h3>
//           </div>
//         </div>
//         <div className="stat-card-modern primary">
//           <div className="stat-icon-wrapper"><AlertCircle size={28} /></div>
//           <div>
//             <p className="stat-label">Urgent</p>
//             <h3 className="stat-value">{filteredTickets.filter(t => t.priority === 'urgent').length}</h3>
//           </div>
//         </div>
//       </div>

//       {/* 🔍 SEARCH & FILTERS */}
//       <div className="filters-section">
//         <div className="search-box">
//           <Search size={20} />
//           <input
//             type="text"
//             placeholder="Search by ticket number, title, or description..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="filters-grid">
//           <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
//             <option value="all">All Status</option>
//             <option value="open">Open</option>
//             <option value="in_progress">In Progress</option>
//             <option value="resolved">Resolved</option>
//             <option value="closed">Closed</option>
//           </select>

//           <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
//             <option value="all">All Priority</option>
//             <option value="low">Low</option>
//             <option value="normal">Normal</option>
//             <option value="high">High</option>
//             <option value="urgent">Urgent</option>
//           </select>

//           <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
//             <option value="all">All Types</option>
//             <option value="general">General IT</option>
//             <option value="asset">Asset Issue</option>
//             <option value="user_management">User Management</option>
//             <option value="attendance">Attendance</option>
//           </select>

//           <button className="btn-clear-filters" onClick={clearFilters}>
//             <X size={16} /> Clear
//           </button>
//         </div>
//       </div>

//       {/* 📋 TABLE */}
//       <div className="tickets-table-container">
//         <table className="tickets-table">
//           <thead>
//             <tr>
//               <th>Ticket #</th>
//               <th>Title</th>
//               <th>Type</th>
//               <th>Status</th>
//               <th>Priority</th>
//               <th>Requested By</th>
//               <th>Created</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentTickets.length === 0 ? (
//               <tr>
//                 <td colSpan="8" className="no-results">
//                   <Ticket size={48} />
//                   <p>No tickets found matching your filters</p>
//                 </td>
//               </tr>
//             ) : (
//               currentTickets.map(ticket => (
//                 <tr key={ticket.id}>
//                   <td className="ticket-number">{ticket.ticket_number}</td>
//                   <td className="ticket-title">{ticket.title}</td>
//                   <td><span className="type-badge">{ticket.ticket_type}</span></td>
//                   <td>
//                     <span className={`status-badge ${ticket.status}`}>
//                       {ticket.status}
//                     </span>
//                   </td>
//                   <td>
//                     <span className={`priority-badge ${ticket.priority}`}>
//                       {ticket.priority}
//                     </span>
//                   </td>
//                   <td>User #{ticket.requested_by}</td>
//                   <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
//                   <td>
//                     <button className="btn-view" onClick={() => viewTicketDetails(ticket)}>
//                       <Eye size={16} /> View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 📄 PAGINATION */}
//       {totalPages > 1 && (
//         <div className="pagination">
//           <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
//             <ChevronLeft size={20} /> Prev
//           </button>
          
//           <div className="page-numbers">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//               <button key={page} className={`page-number ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
//                 {page}
//               </button>
//             ))}
//           </div>

//           <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
//             Next <ChevronRight size={20} />
//           </button>
//         </div>
//       )}

//       {/* 🔍 DETAIL MODAL */}
//       {showModal && selectedTicket && (
//         <div className="modal-overlay" onClick={() => setShowModal(false)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>{selectedTicket.title}</h2>
//               <button className="btn-close" onClick={() => setShowModal(false)}><X size={24} /></button>
//             </div>
//             <div className="modal-body">
//               <div className="ticket-info-grid">
//                 <div className="info-item"><label>Ticket Number</label><p>{selectedTicket.ticket_number}</p></div>
//                 <div className="info-item"><label>Status</label><span className={`status-badge ${selectedTicket.status}`}>{selectedTicket.status}</span></div>
//                 <div className="info-item"><label>Priority</label><span className={`priority-badge ${selectedTicket.priority}`}>{selectedTicket.priority}</span></div>
//                 <div className="info-item"><label>Type</label><p>{selectedTicket.ticket_type}</p></div>
//                 <div className="info-item"><label>Requested By</label><p>User #{selectedTicket.requested_by}</p></div>
//                 <div className="info-item"><label>Created</label><p>{new Date(selectedTicket.created_at).toLocaleString()}</p></div>
//               </div>
//               <div className="description-section">
//                 <h3>Description</h3>
//                 <p>{selectedTicket.description}</p>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }/


import { useState, useEffect } from 'react';
import { 
  Ticket, Search, X, ChevronLeft, ChevronRight, 
  Eye, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';
import api from '../utils/api';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, tickets]);

  const loadTickets = async () => {
    try {
      const response = await api.get('/api/tickets?company_id=1');
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
      filtered = filtered.filter(ticket =>
        ticket.ticket_number?.toLowerCase().includes(term) ||
        ticket.title?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    setFilteredTickets(filtered);
  };

  // ✅ THIS FUNCTION OPENS THE POPUP
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading tickets...</div>;

  return (
    <div className="ticket-list-page">
      {/* Header */}
      <div className="page-header">
        <h1><Ticket size={32} /> All Tickets</h1>
        <div className="header-stats">
          <span className="stat-badge">Total: {filteredTickets.length}</span>
          <span className="stat-badge open">Open: {filteredTickets.filter(t => t.status === 'open').length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by ticket number or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="tickets-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>No tickets found</td></tr>
            ) : (
              filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="ticket-number">{ticket.ticket_number}</td>
                  <td className="ticket-title">{ticket.title}</td>
                  <td>{ticket.ticket_type}</td>
                  <td>
                    <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                  </td>
                  <td>
                    <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                  </td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                  <td>
                    {/* ✅ BUTTON THAT TRIGGERS THE POPUP */}
                    <button 
                      className="btn-view"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL POPUP CODE */}
      {showModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTicket.title}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="ticket-detail-grid">
                <div className="detail-item">
                  <label>Ticket Number</label>
                  <p>{selectedTicket.ticket_number}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className={`status-badge ${selectedTicket.status}`}>{selectedTicket.status}</span>
                </div>
                <div className="detail-item">
                  <label>Priority</label>
                  <span className={`priority-badge ${selectedTicket.priority}`}>{selectedTicket.priority}</span>
                </div>
                <div className="detail-item">
                  <label>Created Date</label>
                  <p>{new Date(selectedTicket.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <p>{selectedTicket.description}</p>
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