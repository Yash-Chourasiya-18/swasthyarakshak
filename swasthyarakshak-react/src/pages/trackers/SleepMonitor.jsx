import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const QUALITY = ['Poor 😞', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent 🤩'];

export default function SleepMonitor() {
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeup, setWakeup] = useState('06:00');
  const [quality, setQuality] = useState('Good 🙂');
  const [logs, setLogs] = useState(loadData('sleep_logs'));

  function calcHours(bed, wake) {
    const [bh, bm] = bed.split(':').map(Number);
    const [wh, wm] = wake.split(':').map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 1440;
    return +(mins / 60).toFixed(1);
  }

  function handleSave() {
    const hours = calcHours(bedtime, wakeup);
    const newData = saveData('sleep_logs', { bedtime, wakeup, hours, quality });
    setLogs(newData);
  }

  const hours = calcHours(bedtime, wakeup);
  const avg = logs.length ? (logs.slice(0,7).reduce((a,l) => a+(l.hours||0),0)/Math.min(logs.length,7)).toFixed(1) : '--';
  const streak = logs.filter(l => l.hours >= 7 && l.hours <= 9).length;

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">😴 Sleep Monitor</h1><p className="page-sub">Duration & quality tracking</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card blue"><div className="stat-icon">⏰</div><div className="stat-val">{avg}h</div><div className="stat-lbl">7-Day Avg</div></div>
          <div className="stat-card green"><div className="stat-icon">🔥</div><div className="stat-val">{streak}</div><div className="stat-lbl">Good Sleep Streak</div></div>
          <div className="stat-card yellow"><div className="stat-icon">📝</div><div className="stat-val">{logs.length}</div><div className="stat-lbl">Total Logs</div></div>
        </div>
        <div className="grid-2">
          <div className="card">
            <div className="card-title">📝 Log Last Night's Sleep</div>
            <div className="form-row">
              <div className="form-group"><label>Bedtime</label><input className="input" type="time" value={bedtime} onChange={e=>setBedtime(e.target.value)} /></div>
              <div className="form-group"><label>Wake Up Time</label><input className="input" type="time" value={wakeup} onChange={e=>setWakeup(e.target.value)} /></div>
            </div>
            <div style={{ textAlign:'center', padding:'16px', background: hours < 6 ? '#fee2e2' : hours <= 9 ? '#dcfce7' : '#fef3c7', borderRadius:10, marginBottom:14 }}>
              <div style={{ fontSize:36, fontWeight:800 }}>{hours}h</div>
              <div className="muted text-sm">{hours < 6 ? '😟 Too little sleep' : hours <= 9 ? '✅ Healthy sleep' : '😪 Too much sleep'}</div>
            </div>
            <div className="form-group">
              <label>Sleep Quality</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:6 }}>
                {QUALITY.map(q => (
                  <span key={q} className={`tag ${quality===q?'selected':''}`} onClick={()=>setQuality(q)}>{q}</span>
                ))}
              </div>
            </div>
            <button className="btn btn-primary w-full" onClick={handleSave}>💾 Save Sleep Log</button>
          </div>
          <div className="card">
            <div className="card-title">📋 Sleep History</div>
            {logs.length === 0 && <p className="muted text-sm">No logs yet. Track your first night!</p>}
            {logs.slice(0,8).map((l,i) => (
              <div key={i} className="list-item">
                <span style={{fontSize:22}}>😴</span>
                <div style={{flex:1}}><div className="fw-6">{l.hours}h sleep · {l.quality}</div><div className="muted text-sm">{l.bedtime} → {l.wakeup}</div></div>
                <span className="badge" style={{background:l.hours>=7&&l.hours<=9?'#dcfce7':'#fee2e2',color:l.hours>=7&&l.hours<=9?'#166534':'#991b1b'}}>
                  {l.hours>=7&&l.hours<=9?'✅':'⚠️'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
