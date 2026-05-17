import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function WaterIntake() {
  const [goal, setGoal] = useState(8);
  const [logs, setLogs] = useState(loadData('water_logs'));
  const todayLogs = logs.filter(l => l.time?.startsWith(new Date().toLocaleDateString()));
  const todayGlasses = todayLogs.reduce((a, l) => a + (l.glasses || 0), 0);
  const pct = Math.min(100, Math.round((todayGlasses / goal) * 100));

  function addWater(amt) {
    const newData = saveData('water_logs', { glasses: amt, ml: amt * 250 });
    setLogs(newData);
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">💧 Water Intake</h1><p className="page-sub">Hydration tracking with daily goals</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="grid-2">
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="card-title">💧 Today's Hydration</div>
            <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 16px' }}>
              <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="65" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                <circle cx="80" cy="80" r="65" fill="none" stroke="#0ea5e9" strokeWidth="14"
                  strokeDasharray={`${2 * Math.PI * 65}`}
                  strokeDashoffset={`${2 * Math.PI * 65 * (1 - pct / 100)}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#0ea5e9' }}>{todayGlasses}</div>
                <div className="muted text-xs">of {goal} glasses</div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: pct >= 100 ? '#166534' : '#0ea5e9', marginBottom: 16 }}>
              {pct >= 100 ? '🎉 Goal Achieved!' : `${pct}% of daily goal`}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[1, 2, 3].map(n => (
                <button key={n} className="btn btn-primary" onClick={() => addWater(n)}>
                  💧 +{n} Glass{n > 1 ? 'es' : ''}
                </button>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label>Daily Goal (glasses)</label>
              <input className="input" type="number" value={goal} min="4" max="20" onChange={e => setGoal(+e.target.value)} />
            </div>
          </div>

          <div className="card">
            <div className="card-title">📋 Today's Log</div>
            <div className="stats-row">
              <div className="stat-card blue"><div className="stat-icon">🥛</div><div className="stat-val">{todayGlasses}</div><div className="stat-lbl">Glasses</div></div>
              <div className="stat-card green"><div className="stat-icon">💦</div><div className="stat-val">{todayGlasses * 250}</div><div className="stat-lbl">ml</div></div>
            </div>
            {logs.length === 0 && <p className="muted text-sm">No entries yet. Start drinking water!</p>}
            {logs.slice(0, 8).map((l, i) => (
              <div key={i} className="list-item">
                <span style={{ fontSize: 22 }}>💧</span>
                <div style={{ flex: 1 }}><div className="fw-6">+{l.glasses} glass{l.glasses > 1 ? 'es' : ''} ({l.ml} ml)</div><div className="muted text-sm">{l.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
