import { Link } from 'react-router-dom';

export default function ComingSoon({ title, icon, desc }) {
  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">{icon} {title}</h1>
          <p className="page-sub">{desc}</p>
        </div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>{icon}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{title}</h2>
          <p className="muted" style={{ marginBottom: 24 }}>{desc}</p>
          <div className="alert alert-blue" style={{ maxWidth: 400, margin: '0 auto' }}>
            🚧 This page is being built in React. The HTML version is fully functional.
          </div>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>← Back to Dashboard</Link>
        </div>
      </div>
    </>
  );
}
