import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function SpO2() {
  const [val, setVal] = useState('');
  const [activity, setActivity] = useState('resting');
  const [symptoms, setSymptoms] = useState([]);
  const [readings, setReadings] = useState(loadData('spo2_readings'));

  const getStatus = v => {
    if (v >= 95) return { label: 'Normal ✅', color: '#166534', bg: '#dcfce7' };
    if (v >= 90) return { label: 'Low ⚠️', color: '#92400e', bg: '#fef3c7' };
    if (v >= 85) return { label: 'Very Low 🔴', color: '#991b1b', bg: '#fee2e2' };
    return { label: 'Critical 🚨', color: '#7f1d1d', bg: '#fecaca' };
  };

  const SYMPTOMS = ['Shortness of Breath', 'Dizziness', 'Chest Pain', 'Fatigue', 'Rapid Heartbeat', 'Confusion'];

  function toggleSym(s) {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function handleSave() {
    if (!val) return alert('SpO2 value enter karo.');
    if (+val < 85) alert('🚨 CRITICAL SpO2! Call 108 immediately!');
    const status = getStatus(+val);
    const newData = saveData('spo2_readings', { val: +val, activity, symptoms, status: status.label });
    setReadings(newData); setVal(''); setSymptoms([]);
  }

  const avg = readings.length ? Math.round(readings.slice(0,7).reduce((a,r) => a + r.val, 0) / Math.min(readings.length, 7)) : '--';

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🫁 SpO2 Monitor</h1><p className="page-sub">Blood oxygen saturation tracking</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card blue"><div className="stat-icon">📊</div><div className="stat-val">{avg}%</div><div className="stat-lbl">7-Day Average</div></div>
          <div className="stat-card green"><div className="stat-icon">📝</div><div className="stat-val">{readings.length}</div><div className="stat-lbl">Total Readings</div></div>
          <div className="stat-card red"><div className="stat-icon">⚠️</div><div className="stat-val">{readings.filter(r => r.val < 95).length}</div><div className="stat-lbl">Low SpO2 Days</div></div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">📝 Log SpO2 Reading</div>
            <div className="form-group">
              <label>SpO2 % (from pulse oximeter)</label>
              <input className="input" type="number" placeholder="e.g. 98" value={val} onChange={e => setVal(e.target.value)} min="50" max="100" />
            </div>
            <div className="form-group">
              <label>Activity at time of reading</label>
              <select className="input" value={activity} onChange={e => setActivity(e.target.value)}>
                <option value="resting">😌 Resting</option>
                <option value="walking">🚶 Walking</option>
                <option value="exercise">🏃 Exercising</option>
                <option value="sleeping">😴 Just woke up</option>
              </select>
            </div>
            <div className="form-group">
              <label>Symptoms (select all that apply)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {SYMPTOMS.map(s => (
                  <span key={s} className={`tag ${symptoms.includes(s) ? 'selected' : ''}`} onClick={() => toggleSym(s)}>{s}</span>
                ))}
              </div>
            </div>
            {val && (() => { const st = getStatus(+val); return <div className="alert" style={{ background: st.bg, color: st.color }}>{st.label} — {val}%</div>; })()}
            <button className="btn btn-primary w-full" onClick={handleSave}>💾 Save Reading</button>

            <div style={{ marginTop: 20 }}>
              <div className="card-title">📊 SpO2 Reference</div>
              {[['95–100%','Normal — No action needed','#166534','#dcfce7'],['90–94%','Low — Monitor closely','#92400e','#fef3c7'],['85–89%','Very Low — See doctor','#c2410c','#ffedd5'],['< 85%','Critical — Call 108 NOW!','#7f1d1d','#fee2e2']].map(([range,label,col,bg]) => (
                <div key={range} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: bg, borderRadius: 6, marginBottom: 4, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: col }}>{range}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">📋 Recent Readings</div>
            {readings.length === 0 && <p className="muted text-sm">No readings yet.</p>}
            {readings.slice(0, 8).map((r, i) => {
              const st = getStatus(r.val);
              return (
                <div key={i} className="list-item">
                  <span style={{ fontSize: 22 }}>🫁</span>
                  <div style={{ flex: 1 }}>
                    <div className="fw-6">{r.val}% — {r.activity}</div>
                    <div className="muted text-sm">{r.time}</div>
                    {r.symptoms?.length > 0 && <div className="muted text-xs">Symptoms: {r.symptoms.join(', ')}</div>}
                  </div>
                  <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
