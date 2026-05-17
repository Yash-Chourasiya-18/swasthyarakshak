import { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_REPORTS = {
  cbc: {
    title: 'Complete Blood Count (CBC)',
    date: 'May 10, 2026',
    lab: 'Thyrocare Labs',
    records: [
      { name: 'Hemoglobin (Hb)', value: 11.2, unit: 'g/dL', normal: '13.0 - 17.0', status: 'low', note: 'Thoda low hai. Dry fruits aur chana-gud khaye.' },
      { name: 'White Blood Cell (WBC)', value: 8500, unit: '/cumm', normal: '4000 - 11000', status: 'normal', note: 'Perfect health!' },
      { name: 'Platelet Count', value: 240000, unit: '/cumm', normal: '150000 - 450000', status: 'normal', note: 'Perfect health!' },
      { name: 'Red Blood Cell (RBC)', value: 4.1, unit: 'million/cumm', normal: '4.5 - 5.5', status: 'low', note: 'Iron supplements consult kare doctor se.' }
    ]
  },
  lipid: {
    title: 'Lipid Profile Report',
    date: 'May 12, 2026',
    lab: 'Lal Path Labs',
    records: [
      { name: 'Total Cholesterol', value: 245, unit: 'mg/dL', normal: '< 200', status: 'high', note: 'High cholesterol detected. Limit deep-fried oil foods.' },
      { name: 'HDL Cholesterol (Good)', value: 38, unit: 'mg/dL', normal: '> 40', status: 'low', note: 'Soaked almonds khaye to raise HDL.' },
      { name: 'LDL Cholesterol (Bad)', value: 165, unit: 'mg/dL', normal: '< 100', status: 'high', note: 'Reduce dairy and refined sugar intake.' },
      { name: 'Triglycerides', value: 180, unit: 'mg/dL', normal: '< 150', status: 'high', note: 'High triglycerides. Include daily walking / exercise.' }
    ]
  }
};

export default function AIReport() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  function simulateScan(key) {
    setLoading(true);
    setTimeout(() => {
      setSelectedReport(MOCK_REPORTS[key]);
      setLoading(false);
    }, 1500);
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">📄 AI Report Scanner</h1>
          <p className="page-sub">Upload medical lab reports and highlight abnormal values</p>
        </div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-yellow">
          ⚠️ AI Analysis Safeguard: This scanner simplifies your report terminology but is NOT a doctor substitute.
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">📤 Upload Medical Report</div>
            
            <div style={{
              border: '2px dashed #cbd5e1', borderRadius: '12px',
              padding: '32px 16px', textAlign: 'center', background: '#f8fafc',
              marginBottom: '20px', cursor: 'pointer'
            }} onClick={() => simulateScan('cbc')}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>📄</div>
              <div className="fw-7">Drag & drop lab report PDF/Image here</div>
              <p className="muted text-sm">or tap to select file from phone storage</p>
            </div>

            <div className="divider"></div>
            <div className="card-title" style={{ fontSize: 13 }}>📋 Or Choose a Sample Report to Analyze:</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline w-full" onClick={() => simulateScan('cbc')}>
                🩸 Scan Sample CBC
              </button>
              <button className="btn btn-outline w-full" onClick={() => simulateScan('lipid')}>
                🧪 Scan Sample Lipid
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title">📊 AI Diagnosis Summary</div>
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '32px', animation: 'spin 1s infinite linear' }}>🔄</div>
                <p className="muted" style={{ marginTop: '12px' }}>AI OCR Scanner running analysis...</p>
              </div>
            )}

            {!loading && !selectedReport && (
              <p className="muted text-sm">Upload or select a sample report above to read AI scanner output.</p>
            )}

            {!loading && selectedReport && (
              <div>
                <div style={{ background: '#e0f2fe', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                  <div className="fw-7">{selectedReport.title}</div>
                  <div className="muted text-xs">Date: {selectedReport.date} · Lab: {selectedReport.lab}</div>
                </div>

                {selectedReport.records.map((r, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #f1f5f9', padding: '10px 0' }}>
                    <div className="flex-between">
                      <span className="fw-7">{r.name}</span>
                      <span style={{
                        color: r.status === 'high' || r.status === 'low' ? '#ef4444' : '#166534',
                        fontWeight: 800
                      }}>
                        {r.value} {r.unit}
                      </span>
                    </div>
                    <div className="flex-between text-xs muted" style={{ marginTop: 4 }}>
                      <span>Normal range: {r.normal}</span>
                      <span style={{
                        background: r.status === 'high' || r.status === 'low' ? '#fee2e2' : '#dcfce7',
                        color: r.status === 'high' || r.status === 'low' ? '#991b1b' : '#166534',
                        padding: '2px 8px', borderRadius: 12, fontWeight: 700
                      }}>
                        {r.status.toUpperCase()}
                      </span>
                    </div>
                    {(r.status === 'high' || r.status === 'low') && (
                      <div style={{ background: '#fffbeb', borderLeft: '3px solid #f59e0b', padding: '6px 10px', fontSize: 11, marginTop: 6, borderRadius: '0 4px 4px 0' }}>
                        💡 <strong>AI Tip:</strong> {r.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
