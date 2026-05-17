import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const RISK = (s, d) => {
  if (s >= 180 || d >= 120) return { label: 'Crisis', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' };
  if (s >= 140 || d >= 90) return { label: 'High Stage 2', color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' };
  if (s >= 130 || d >= 80) return { label: 'High Stage 1', color: '#d97706', bg: '#fef3c7', border: '#fde68a' };
  if (s >= 120) return { label: 'Elevated', color: '#d97706', bg: '#fef3c7', border: '#fde68a' };
  return { label: 'Normal', color: '#166534', bg: '#dcfce7', border: '#bbf7d0' };
};

export default function BPTracker() {
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [pulse, setPulse] = useState('');
  const [time, setTime] = useState('Morning');
  const [notes, setNotes] = useState('');
  const [readings, setReadings] = useState(loadData('bp_readings') || []);

  function handleSave() {
    if (!sys || !dia) return alert('Systolic aur Diastolic dono enter karo.');
    const risk = RISK(+sys, +dia);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
    const newEntry = {
      sys: +sys,
      dia: +dia,
      pulse: pulse ? +pulse : 72,
      time,
      notes: notes || 'No notes added',
      status: risk.label,
      date: `${dateStr}, ${timeStr}`
    };
    
    const newData = saveData('bp_readings', newEntry);
    setReadings(newData);
    setSys('');
    setDia('');
    setPulse('');
    setNotes('');

    if (+sys >= 180 || +dia >= 120) {
      alert('🚨 CRITICAL BP DETECTED!\nImmediate medical attention required!\nCall 108 now.');
    }
  }

  const latest = readings[0];
  const totalReadings = readings.length;
  const highRiskAlerts = readings.filter(r => r.sys >= 140 || r.dia >= 90).length;

  return (
    <>
      {/* Title block exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ef4444' }}>❤️</span> Smart BP Tracker
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Blood pressure logging & risk alerts
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
            <div style={{ fontSize: '24px' }}>❤️</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {latest ? `${latest.sys}/${latest.dia}` : '-/-'}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Last Reading</div>
            <div>
              {latest ? (
                <span style={{
                  background: RISK(latest.sys, latest.dia).bg,
                  color: RISK(latest.sys, latest.dia).color,
                  padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700
                }}>
                  {RISK(latest.sys, latest.dia).label}
                </span>
              ) : (
                <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                  No data
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Total Readings */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>📊</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {totalReadings}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Total Readings</div>
          </div>

          {/* Card 3: High Risk Alerts */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #eab308', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>⚠️</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {highRiskAlerts}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>High Risk Alerts</div>
          </div>

        </div>

        {/* 2 Column Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Column: Log Blood Pressure */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Log Blood Pressure</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Systolic (mmHg)</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="number"
                  placeholder="120"
                  value={sys}
                  onChange={e => setSys(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Diastolic (mmHg)</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="number"
                  placeholder="80"
                  value={dia}
                  onChange={e => setDia(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Pulse (bpm)</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="number"
                placeholder="72"
                value={pulse}
                onChange={e => setPulse(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Time of Reading</label>
              <select
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                value={time}
                onChange={e => setTime(e.target.value)}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Notes (optional)</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="text"
                placeholder="After exercise, feeling stressed..."
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

          {/* Right Column: BP History */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>BP History (Last 7)</h2>
            
            {readings.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <p className="muted text-sm" style={{ color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
                  No records yet. Add your first entry!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                {readings.slice(0, 7).map((r, i) => {
                  const risk = RISK(r.sys, r.dia);
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                          {r.sys}/{r.dia} mmHg
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {r.date || r.time} · {r.notes || 'No notes'}
                        </div>
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

        {/* Bottom Full-Width Risk Guide */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Blood Pressure Risk Guide</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            
            {/* Guide 1: Normal */}
            <div style={{
              background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px',
              textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#15803d', fontWeight: 700, fontSize: '13px' }}>🟩 Normal</span>
              <span style={{ color: '#166534', fontSize: '12px' }}>&lt; 120/80</span>
            </div>

            {/* Guide 2: Elevated */}
            <div style={{
              background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px',
              textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#b45309', fontWeight: 700, fontSize: '13px' }}>💡 Elevated</span>
              <span style={{ color: '#92400e', fontSize: '12px' }}>120-129 / &lt; 80</span>
            </div>

            {/* Guide 3: High Stage 1 */}
            <div style={{
              background: '#ffedd5', border: '1px solid #fed7aa', borderRadius: '8px', padding: '12px',
              textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#c2410c', fontWeight: 700, fontSize: '13px' }}>⚠️ High Stage 1</span>
              <span style={{ color: '#9a3412', fontSize: '12px' }}>130-139 / 80-89</span>
            </div>

            {/* Guide 4: High Stage 2 */}
            <div style={{
              background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px',
              textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '13px' }}>🚨 High Stage 2</span>
              <span style={{ color: '#991b1b', fontSize: '12px' }}>140+ / 90+</span>
            </div>

            {/* Guide 5: Crisis */}
            <div style={{
              background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '8px', padding: '12px',
              textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '13px' }}>🆘 Crisis</span>
              <span style={{ color: '#991b1b', fontSize: '12px' }}>180+ / 120+</span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
