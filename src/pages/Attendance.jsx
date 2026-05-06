import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Download, Upload, X, FileText, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const currentUser = { id: 1, company_id: 1 };

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await api.get(`/api/attendance/company/${currentUser.company_id}`);
      setRecords(res.data);
      setStats({
        present: res.data.filter(r => r.status === 'present').length,
        absent: res.data.filter(r => r.status === 'absent').length,
        late: res.data.filter(r => r.is_late).length,
      });
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select a file first');

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('company_id', currentUser.company_id);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      await api.post('/api/attendance/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        alert('✅ Attendance data uploaded successfully!');
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadProgress(0);
        loadAttendance();
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploading(false);
      alert('❌ Upload failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) return <div className="loading">Loading attendance data...</div>;

  return (
    <div className="modern-asset-management">
      {/* Header */}
      <div className="modern-header">
        <div className="header-left">
          <div className="logo-icon"><Clock size={32} /></div>
          <div>
            <h1>Attendance Management</h1>
            <p>Track check-ins, leaves, and timesheets</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary-modern" onClick={() => setShowUploadModal(true)}>
            <Upload size={20} /> Upload Data
          </button>
          <button className="btn-primary-modern">
            <Download size={20} /> Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="modern-stats-grid">
        <div className="stat-card-modern success">
          <div className="stat-icon-wrapper"><CheckCircle size={28} /></div>
          <div>
            <p className="stat-label">Present Today</p>
            <h3 className="stat-value">{stats.present}</h3>
          </div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-icon-wrapper"><XCircle size={28} /></div>
          <div>
            <p className="stat-label">Absent</p>
            <h3 className="stat-value">{stats.absent}</h3>
          </div>
        </div>
        <div className="stat-card-modern info">
          <div className="stat-icon-wrapper"><Clock size={28} /></div>
          <div>
            <p className="stat-label">Late Check-ins</p>
            <h3 className="stat-value">{stats.late}</h3>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="modern-assets-list">
        <h2>Recent Records</h2>
        {records.length === 0 ? (
          <div className="empty-state-modern">
            <Clock size={48} />
            <p>No records yet. Use "Upload Data" to import records.</p>
          </div>
        ) : (
          <div className="modern-assets-grid">
            {records.slice(0, 6).map(record => (
              <div key={record.id} className="asset-card-modern">
                <div className="asset-header-modern">
                  <h3>User ID: {record.user_id}</h3>
                  <span className={`status-badge ${record.status}`}>{record.status}</span>
                </div>
                <div className="asset-details-modern">
                  <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                  <p><strong>Check-In:</strong> {record.check_in ? new Date(record.check_in).toLocaleTimeString() : 'N/A'}</p>
                  <p><strong>Check-Out:</strong> {record.check_out ? new Date(record.check_out).toLocaleTimeString() : 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 BEAUTIFUL UPLOAD MODAL */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => !uploading && setShowUploadModal(false)}>
          <div className="upload-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="upload-modal-header">
              <div className="header-icon">
                <Upload size={24} />
              </div>
              <div>
                <h2>Upload Attendance Data</h2>
                <p>Import employee attendance records via CSV</p>
              </div>
              {!uploading && (
                <button className="btn-close" onClick={() => setShowUploadModal(false)}>
                  <X size={24} />
                </button>
              )}
            </div>

            <div className="upload-modal-body">
              {/* CSV Format Instructions */}
              <div className="csv-instructions">
                <h3><FileText size={18} /> Required CSV Format</h3>
                <div className="csv-columns">
                  <span className="column-badge">user_id</span>
                  <span className="column-badge">date (YYYY-MM-DD)</span>
                  <span className="column-badge">check_in (HH:MM)</span>
                  <span className="column-badge">check_out (HH:MM)</span>
                  <span className="column-badge">status</span>
                </div>
                <div className="csv-example">
                  <strong>Example:</strong> 1, 2026-04-28, 09:00, 18:00, present
                </div>
              </div>

              {/* File Upload Area */}
              <div className="file-drop-area">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange}
                  disabled={uploading}
                  id="fileInput"
                  className="hidden-input"
                />
                {!selectedFile ? (
                  <label htmlFor="fileInput" className="upload-prompt">
                    <div className="upload-icon-circle">
                      <Upload size={32} />
                    </div>
                    <p className="upload-text">
                      <strong>Click to upload</strong> or drag and drop
                    </p>
                    <p className="upload-hint">CSV files only</p>
                  </label>
                ) : (
                  <div className="file-selected">
                    <div className="file-icon">
                      <FileText size={24} />
                    </div>
                    <div className="file-info">
                      <p className="file-name">{selectedFile.name}</p>
                      <p className="file-size">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    {!uploading && (
                      <button 
                        className="btn-remove-file" 
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadProgress(0);
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="progress-text">
                    {uploadProgress < 100 ? 'Uploading...' : 'Upload Complete!'} {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Alert */}
              <div className="upload-alert">
                <AlertCircle size={16} />
                <p>Existing records for the same date will be skipped to avoid duplicates.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="upload-modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                className="btn-upload" 
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <div className="spinner" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Upload File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}