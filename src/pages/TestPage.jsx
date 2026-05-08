export default function TestPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#10b981', fontSize: '48px', marginBottom: '20px' }}>
        ✅ SUCCESS!
      </h1>
      <p style={{ fontSize: '20px', color: '#6b7280' }}>
        React is working correctly. Now navigate to /chat
      </p>
      <div style={{ marginTop: '40px' }}>
        <a 
          href="/chat" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          Go to AI Chat →
        </a>
      </div>
    </div>
  );
}