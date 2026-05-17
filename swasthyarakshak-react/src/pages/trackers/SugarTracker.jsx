import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function SugarTracker() {
  const [val, setVal] = useState('');
  const [type, setType] = useState('fasting');
  const [readings, setReadings] = useState(loadData('sugar_readings'));

  const getStatus = (v, t) => {
    if (t === 'fasting') {
      if (v < 70) return { label: 'Low 🔵', color: '#1e40af', bg: '#dbeafe' };
      if (v <= 99) return { label: 'Normal ✅', color: '#166534', bg: '#dcfce7' };
      if (v <= 125) return { label: 'Pre-Diabetic 🟡', color: '#92400e', bg: '#fef3c7' };
      return { label: 'Diabetic 🔴', color: '#991b1b', bg: '#fee2e2' };
    }
    if (v < 140) return { label: 'Normal ✅', color: '#166534', bg: '#dcfce7' };
    if (v < 200) return { label: 'Pre-Diabetic 🟡', color: '#92400e', bg: '#fef3c7' };
    return { label: 'Diabetic 🔴', color: '#991b1b', bg: '#fee2e2' };
  };

  const avgLast7 = readings.length ? Math.round(readings.slice(0,7).reduce((a,r)=>a+r.val,0)/Math.min(readings.length,7)) : 0;
  const hba1c = avgLast7 > 0 ? ((avgLast7 + 46.7) / 28.7).toFixed(1) : '--';

  function handleSave() {
    if (!val) return alert('Sugar value enter karo.');
    const status = getStatus(+val, type);
    const newData = saveData('sugar_readings', { val: +val, type, status: status.label });
    setReadings(newData); setVal('');
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🩸 Sugar / Diabetes Tracker</h1><p className="page-sub">Glucose history + HbA1c estimate</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card blue"><div className="stat-icon">📊</div><div className="stat-val">{avgLast7 || '--'}</div><div className="stat-lbl">7-Day Avg (mg/dL)</div></div>
          <div className="stat-card purple"><div className="stat-icon">🧬</div><div className="stat-val">{hba1c}%</div><div className="stat-lbl">Est. HbA1c</div></div>
          <div className="stat-card green"><div className="stat-icon">📝</div><div className="stat-val">{readings.length}</div><div className="stat-lbl">Total Readings</div></div>
        </div>
        <div className="grid-2">
          <div className="card">
            <div className="card-title">📝 Log Reading</div>
            <div className="form-group">
              <label>Type</label>
              <select className="input" value={type} onChange={e=>setType(e.target.value)}>
                <option value="fasting">🌅 Fasting (morning, before food)</option>
                <option value="post-meal">🍽️ Post-Meal (2h after food)</option>
                <option value="random">⏰ Random</option>
                <option value="bedtime">🌙 Bedtime</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Sugar (mg/dL)</label>
              <input className="input" type="number" placeholder="e.g. 95" value={val} onChange={e=>setVal(e.target.value)} />
            </div>
            {val && (() => { const s = getStatus(+val, type); return <div className="alert" style={{background:s.bg,color:s.color}}>{s.label} — {val} mg/dL ({type})</div>; })()}
            <button className="btn btn-primary w-full" onClick={handleSave}>💾 Save Reading</button>
          </div>
          <div className="card">
            <div className="card-title">📋 Recent Readings</div>
            {readings.length === 0 && <p className="muted text-sm">No readings yet.</p>}
            {readings.slice(0,8).map((r,i) => {
              const s = getStatus(r.val, r.type);
              return <div key={i} className="list-item">
                <span style={{fontSize:22}}>🩸</span>
                <div style={{flex:1}}><div className="fw-6">{r.val} mg/dL <span className="muted text-xs">({r.type})</span></div><div className="muted text-sm">{r.time}</div></div>
                <span className="badge" style={{background:s.bg,color:s.color}}>{s.label.split(' ')[0]}</span>
              </div>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
