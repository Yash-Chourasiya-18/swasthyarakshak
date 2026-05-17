import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function SpO2() {
  const [val, setVal] = useState('');
  const [hr, setHr] = useState('');
  const [activity, setActivity] = useState('Resting');
  const [symptoms, setSymptoms] = useState([]);
  const [readings, setReadings] = useState(loadData('spo2_readings') || []);

  const getStatus = v => {
    if (v >= 95) return { label: 'Normal', color: '#166534', bg: '#dcfce7', border: '#bbf7d0' };
    if (v >= 91) return { label: 'Mild Hypoxemia', color: '#92400e', bg: '#fef3c7', border: '#fde68a' };
    if (v >= 86) return { label: 'Moderate Hypoxemia', color: '#c2410c', bg: '#ffedd5', border: '#fed7aa' };
    return { label: 'Severe Emergency', color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' };
  };

  const SYMPTOMS = ['Shortness of Breath', 'Dizziness', 'Chest Pain', 'Fatigue', 'Cough', 'Headache'];

  function toggleSym(s) {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function handleSave() {
    if (!val) return alert('Oxygen level value enter karo.');
    if (+val < 85) alert('🚨 CRITICAL SpO2! Call 108 immediately!');
    
    const status = getStatus(+val);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
    
    const newEntry = {
      val: +val,
      hr: hr ? +hr : 72,
      activity,
      symptoms,
      status: status.label,
      date: `${dateStr}, ${timeStr}`
    };

    const newData = saveData('spo2_readings', newEntry);
    setReadings(newData);
    setVal('');
    setHr('');
    setSymptoms([]);
  }

  const latest = readings[0];
  const sevenDayLow = readings.length ? Math.min(...readings.slice(0, 7).map(r => r.val)) : null;

  return (
    <>
      {/* Title block exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#3b82f6' }}>🫁</span> SpO2 Oxygen Monitor
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Track blood oxygen saturation levels
          </p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ fontSize: '13px', borderRadius: '30px', padding: '6px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="content" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 85px)' }}>
        {/* Top 3 Cards exact style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          
          {/* Card 1: Last SpO2 Reading */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🫁</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {latest ? `${latest.val}%` : '-%'}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Last SpO2 Reading</div>
            <div>
              {latest ? (
                <span style={{
                  background: getStatus(latest.val).bg,
                  color: getStatus(latest.val).color,
                  padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700
                }}>
                  {getStatus(latest.val).label}
                </span>
              ) : (
                <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                  No data
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Last Heart Rate */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>💖</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {latest ? `${latest.hr}` : '-'}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Last Heart Rate (bpm)</div>
          </div>

          {/* Card 3: 7-day Low */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #ef4444', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>📉</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {sevenDayLow ? `${sevenDayLow}%` : '-%'}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>7-day Low</div>
          </div>

        </div>

        {/* 2 Column Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Column: Log SpO2 Reading */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Log SpO2 Reading</h2>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Oxygen Level (%)</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="number"
                placeholder="95-100"
                value={val}
                onChange={e => setVal(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Heart Rate (bpm)</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="number"
                placeholder="72"
                value={hr}
                onChange={e => setHr(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Activity at Time of Reading</label>
              <select
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                value={activity}
                onChange={e => setActivity(e.target.value)}
              >
                <option value="Resting">Resting</option>
                <option value="Walking">Walking</option>
                <option value="Exercising">Exercising</option>
                <option value="Just woke up">Just woke up</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Symptoms (if any)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {SYMPTOMS.map(s => {
                  const isSelected = symptoms.includes(s);
                  return (
                    <span
                      key={s}
                      onClick={() => toggleSym(s)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: isSelected ? '#0ea5e9' : '#f1f5f9',
                        color: isSelected ? 'white' : '#475569',
                        border: isSelected ? '1px solid #0ea5e9' : '1px solid #e2e8f0'
                      }}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>
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

          {/* Right Column: SpO2 History */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>SpO2 History</h2>
            
            {readings.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <p className="muted text-sm" style={{ color: '#64748b', fontSize: '14px', textAlign: 'center' }}>
                  No records yet. Add your first entry!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                {readings.map((r, i) => {
                  const risk = getStatus(r.val);
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                          {r.val}% SpO2 {r.hr ? `· ${r.hr} bpm` : ''}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {r.date || r.time} · {r.activity}
                        </div>
                        {r.symptoms?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                            {r.symptoms.map(s => (
                              <span key={s} style={{ background: '#f1f5f9', color: '#475569', fontSize: '9px', padding: '1px 6px', borderRadius: '4px' }}>
                                {s}
                              </span>
                            ))}
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

        {/* Bottom Full-Width Risk Guide */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>SpO2 Level Guide</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* Guide 1: Normal */}
            <div style={{
              background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#166534', fontWeight: 700, fontSize: '13px' }}>🟩 95-100%</span>
              <span style={{ color: '#166534', fontSize: '13px' }}>— Normal. Healthy oxygen levels.</span>
            </div>

            {/* Guide 2: Mild Hypoxemia */}
            <div style={{
              background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#92400e', fontWeight: 700, fontSize: '13px' }}>🟨 91-94%</span>
              <span style={{ color: '#92400e', fontSize: '13px' }}>— Mild Hypoxemia. Monitor closely, consult doctor if persistent.</span>
            </div>

            {/* Guide 3: Moderate Hypoxemia */}
            <div style={{
              background: '#ffedd5', border: '1px solid #fed7aa', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#c2410c', fontWeight: 700, fontSize: '13px' }}>🟧 86-90%</span>
              <span style={{ color: '#c2410c', fontSize: '13px' }}>— Moderate Hypoxemia. Seek medical attention soon.</span>
            </div>

            {/* Guide 4: Severe Emergency */}
            <div style={{
              background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '13px' }}>🟥 Below 85%</span>
              <span style={{ color: '#b91c1c', fontSize: '13px' }}>— Severe Emergency! Call 108 immediately.</span>
            </div>

            {/* Guide 5: Tip */}
            <div style={{
              background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#0369a1', fontWeight: 700, fontSize: '13px' }}>⚡ Tip:</span>
              <span style={{ color: '#0369a1', fontSize: '13px' }}>Pulse oximeters are best used on fingers at rest. Cold hands can affect accuracy.</span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
