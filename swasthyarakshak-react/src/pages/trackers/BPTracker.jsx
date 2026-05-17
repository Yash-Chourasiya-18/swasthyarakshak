import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const RISK = (s, d) => {
  if (s >= 180 || d >= 120) return { label: 'Hypertensive Crisis 🚨', color: '#7f1d1d', bg: '#fee2e2' };
  if (s >= 140 || d >= 90) return { label: 'High Stage 2 🔴', color: '#991b1b', bg: '#fee2e2' };
  if (s >= 130 || d >= 80) return { label: 'High Stage 1 🟠', color: '#92400e', bg: '#fef3c7' };
  if (s >= 120) return { label: 'Elevated 🟡', color: '#92400e', bg: '#fef3c7' };
  return { label: 'Normal ✅', color: '#166534', bg: '#dcfce7' };
};

export default function BPTracker() {
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [pulse, setPulse] = useState('');
  const [time, setTime] = useState('morning');
  const [readings, setReadings] = useState(loadData('bp_readings'));

  function handleSave() {
    if (!sys || !dia) return alert('Systolic aur Diastolic dono enter karo.');
    const risk = RISK(+sys, +dia);
    const newData = saveData('bp_readings', { sys: +sys, dia: +dia, pulse: +pulse, time, status: risk.label });
    setReadings(newData);
    setSys(''); setDia(''); setPulse('');
    if (+sys >= 180 || +dia >= 120) alert('🚨 CRITICAL BP DETECTED!\nImmediate medical attention required!\nCall 108 now.');
  }

  const latest = readings[0];
  const avgSys = readings.length ? Math.round(readings.slice(0,7).reduce((a,r)=>a+r.sys,0)/Math.min(readings.length,7)) : '--';

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">❤️ Smart BP Tracker</h1>
          <p className="page-sub">Blood pressure log + risk alerts</p>
        </div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card blue"><div className="stat-icon">📊</div><div className="stat-val">{avgSys}</div><div className="stat-lbl">7-Day Avg (sys)</div></div>
          <div className="stat-card green"><div className="stat-icon">📝</div><div className="stat-val">{readings.length}</div><div className="stat-lbl">Total Readings</div></div>
          <div className="stat-card red"><div className="stat-icon">⚠️</div><div className="stat-val">{readings.filter(r=>r.sys>=140).length}</div><div className="stat-lbl">High BP Days</div></div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">📝 Log New Reading</div>
            <div className="form-row">
              <div className="form-group">
                <label>Systolic (mmHg)</label>
                <input className="input" type="number" placeholder="e.g. 120" value={sys} onChange={e=>setSys(e.target.value)} min="60" max="250" />
              </div>
              <div className="form-group">
                <label>Diastolic (mmHg)</label>
                <input className="input" type="number" placeholder="e.g. 80" value={dia} onChange={e=>setDia(e.target.value)} min="40" max="150" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Pulse (bpm)</label>
                <input className="input" type="number" placeholder="e.g. 72" value={pulse} onChange={e=>setPulse(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Time of Day</label>
                <select className="input" value={time} onChange={e=>setTime(e.target.value)}>
                  <option value="morning">🌅 Morning</option>
                  <option value="afternoon">☀️ Afternoon</option>
                  <option value="evening">🌆 Evening</option>
                  <option value="night">🌙 Night</option>
                </select>
              </div>
            </div>

            {sys && dia && (() => {
              const r = RISK(+sys, +dia);
              return <div className="alert" style={{ background: r.bg, color: r.color, border: `1px solid ${r.color}30` }}>
                {r.label} — {sys}/{dia} mmHg
              </div>;
            })()}

            <button className="btn btn-primary w-full" onClick={handleSave}>💾 Save Reading</button>

            <div className="card-title" style={{ marginTop: 20 }}>📊 BP Reference</div>
            {[
              ['Normal', '<120', '<80', '#166534', '#dcfce7'],
              ['Elevated', '120–129', '<80', '#92400e', '#fef3c7'],
              ['High Stage 1', '130–139', '80–89', '#c2410c', '#ffedd5'],
              ['High Stage 2', '≥140', '≥90', '#991b1b', '#fee2e2'],
              ['Crisis', '≥180', '≥120', '#7f1d1d', '#fecaca'],
            ].map(([cat,s,d,col,bg]) => (
              <div key={cat} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:bg, borderRadius:6, marginBottom:4, fontSize:12 }}>
                <span style={{ fontWeight:700, color:col }}>{cat}</span>
                <span>Sys: {s}</span><span>Dia: {d}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">📋 Recent Readings</div>
            {readings.length === 0 && <p className="muted text-sm">No readings yet. Add your first entry!</p>}
            {readings.slice(0,8).map((r,i) => {
              const risk = RISK(r.sys, r.dia);
              return (
                <div key={i} className="list-item">
                  <span style={{ fontSize:22 }}>❤️</span>
                  <div style={{ flex:1 }}>
                    <div className="fw-6">{r.sys}/{r.dia} mmHg {r.pulse ? `· ${r.pulse} bpm` : ''}</div>
                    <div className="muted text-sm">{r.time} · {r.time}</div>
                  </div>
                  <span className="badge" style={{ background:risk.bg, color:risk.color }}>{risk.label.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
