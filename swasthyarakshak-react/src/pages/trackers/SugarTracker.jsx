import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function SugarTracker() {
  const [val, setVal] = useState('');
  const [type, setType] = useState('Fasting (before meals)');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [readings, setReadings] = useState(loadData('sugar_readings') || []);

  useEffect(() => {
    // Set default datetime to now in local format
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
    setDateTime(localISOTime);
  }, []);

  const getStatus = (v, t) => {
    const isFasting = t.includes('Fasting');
    if (isFasting) {
      if (v < 70) return { label: 'Low', color: '#1e40af', bg: '#dbeafe', border: '#bfdbfe' };
      if (v <= 99) return { label: 'Normal', color: '#166534', bg: '#dcfce7', border: '#bbf7d0' };
      if (v <= 125) return { label: 'Pre-Diabetes', color: '#b45309', bg: '#fef3c7', border: '#fde68a' };
      return { label: 'Diabetes', color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' };
    } else {
      if (v < 140) return { label: 'Normal', color: '#166534', bg: '#dcfce7', border: '#bbf7d0' };
      if (v < 200) return { label: 'Pre-Diabetes', color: '#b45309', bg: '#fef3c7', border: '#fde68a' };
      return { label: 'Diabetes', color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' };
    }
  };

  function handleSave() {
    if (!val) return alert('Glucose value enter karo.');
    const status = getStatus(+val, type);
    
    // Format visual Date string
    const inputDate = new Date(dateTime);
    const dateStr = inputDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry = {
      val: +val,
      type,
      dateTime,
      notes: notes || 'No notes',
      status: status.label,
      date: `${dateStr} ${timeStr}`
    };

    const newData = saveData('sugar_readings', newEntry);
    setReadings(newData);
    setVal('');
    setNotes('');
  }

  const latest = readings[0];
  const avgLast7 = readings.length ? Math.round(readings.slice(0, 7).reduce((a, r) => a + r.val, 0) / Math.min(readings.length, 7)) : 0;
  const hba1c = avgLast7 > 0 ? ((avgLast7 + 46.7) / 28.7).toFixed(1) : '--';

  return (
    <>
      {/* Title block exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ef4444' }}>🩸</span> Sugar / Diabetes Tracker
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Daily glucose history & charts
          </p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ fontSize: '13px', borderRadius: '30px', padding: '6px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="content" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 85px)' }}>
        {/* Top 3 Cards exact style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          
          {/* Card 1: Last Reading */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #ef4444', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🩸</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {latest ? `${latest.val} mg/dL` : '-'}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Last Reading (mg/dL)</div>
            <div>
              {latest ? (
                <span style={{
                  background: getStatus(latest.val, latest.type).bg,
                  color: getStatus(latest.val, latest.type).color,
                  padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700
                }}>
                  {getStatus(latest.val, latest.type).label}
                </span>
              ) : (
                <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                  No data
                </span>
              )}
            </div>
          </div>

          {/* Card 2: 7-day Average */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>📊</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {avgLast7 ? `${avgLast7} mg/dL` : '-'}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>7-day Average</div>
          </div>

          {/* Card 3: HbA1c Estimate */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #f59e0b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🧪</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {hba1c !== '--' ? `${hba1c}%` : '-%'}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>HbA1c Estimate</div>
          </div>

        </div>

        {/* 2 Column Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Column: Log Blood Sugar */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Log Blood Sugar</h2>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Glucose Level (mg/dL)</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="number"
                placeholder="e.g. 105"
                value={val}
                onChange={e => setVal(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Reading Type</label>
              <select
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="Fasting (before meals)">Fasting (before meals)</option>
                <option value="Post-Meal (2h)">Post-Meal (2h)</option>
                <option value="Random">Random</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Date & Time</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="datetime-local"
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Notes</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="text"
                placeholder="Before breakfast, feeling thirsty..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              style={{
                width: '100%', height: '44px', borderRadius: '8px', background: '#0ea5e9',
                color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
              onClick={handleSave}
            >
              💾 Save Reading
            </button>
          </div>

          {/* Right Column: Weekly Chart (Reading Log) */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Weekly Chart</h2>
            
            {readings.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <p className="muted text-sm" style={{ color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
                  No records yet. Add your first entry!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                {readings.map((r, i) => {
                  const risk = getStatus(r.val, r.type);
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                          {r.val} mg/dL
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {r.date || r.dateTime} · {r.type}
                        </div>
                        {r.notes && (
                          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                            "{r.notes}"
                          </div>
                        )}
                      </div>
                      <span style={{
                        background: risk.bg, color: risk.color, border: `1px solid ${risk.border}`,
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700
                      }}>
                        {risk.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Full-Width Reference Ranges Table */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Blood Sugar Reference Ranges</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 700 }}>Reading Type</th>
                  <th style={{ padding: '12px 16px', color: '#166534', fontWeight: 700 }}>Normal</th>
                  <th style={{ padding: '12px 16px', color: '#b45309', fontWeight: 700 }}>Pre-Diabetes</th>
                  <th style={{ padding: '12px 16px', color: '#b91c1c', fontWeight: 700 }}>Diabetes</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>Fasting</td>
                  <td style={{ padding: '12px 16px', color: '#166534' }}>70–99</td>
                  <td style={{ padding: '12px 16px', color: '#b45309' }}>100–125</td>
                  <td style={{ padding: '12px 16px', color: '#b91c1c' }}>126+</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>Post-Meal (2h)</td>
                  <td style={{ padding: '12px 16px', color: '#166534' }}>&lt; 140</td>
                  <td style={{ padding: '12px 16px', color: '#b45309' }}>140–199</td>
                  <td style={{ padding: '12px 16px', color: '#b91c1c' }}>200+</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>Random</td>
                  <td style={{ padding: '12px 16px', color: '#166534' }}>&lt; 140</td>
                  <td style={{ padding: '12px 16px', color: '#b45309' }}>140–199</td>
                  <td style={{ padding: '12px 16px', color: '#b91c1c' }}>200+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
