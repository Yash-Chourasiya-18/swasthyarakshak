import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const ACTIVITIES = [
  { type:'Walking', met:3.5, icon:'🚶' }, { type:'Running', met:8, icon:'🏃' },
  { type:'Cycling', met:6, icon:'🚴' }, { type:'Swimming', met:7, icon:'🏊' },
  { type:'Yoga', met:3, icon:'🧘' }, { type:'Gym', met:5, icon:'🏋️' },
  { type:'Dance', met:5, icon:'💃' }, { type:'Sports', met:6, icon:'⚽' },
];

export default function StepCounter() {
  const [steps, setSteps] = useState('');
  const [actIdx, setActIdx] = useState(0);
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState(70);
  const [goal, setGoal] = useState(8000);
  const [logs, setLogs] = useState(loadData('activities'));

  const act = ACTIVITIES[actIdx];
  const calories = duration && weight ? Math.round(act.met * weight * (+duration / 60)) : 0;
  const distance = steps ? (+steps * 0.0008).toFixed(1) : 0;
  const todaySteps = logs.filter(l => l.time?.startsWith(new Date().toLocaleDateString())).reduce((a,l) => a+(l.steps||0),0);

  function handleSave() {
    if (!steps) return alert('Steps enter karo.');
    const newData = saveData('activities', { type: act.type, steps: +steps, calories, distance, duration: +duration });
    setLogs(newData); setSteps(''); setDuration('');
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🏃 Step Counter</h1><p className="page-sub">Activity tracking + calorie calculation</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card green"><div className="stat-icon">👟</div><div className="stat-val">{todaySteps.toLocaleString()}</div><div className="stat-lbl">Today's Steps</div></div>
          <div className="stat-card blue"><div className="stat-icon">🎯</div><div className="stat-val">{goal.toLocaleString()}</div><div className="stat-lbl">Daily Goal</div></div>
          <div className="stat-card yellow"><div className="stat-icon">📈</div><div className="stat-val">{Math.min(100,Math.round(todaySteps/goal*100))}%</div><div className="stat-lbl">Goal Progress</div></div>
        </div>

        <div style={{ background:'#e0f2fe', borderRadius:10, padding:'6px 14px', marginBottom:16, height:10, position:'relative' }}>
          <div style={{ position:'absolute', left:0, top:0, height:'100%', borderRadius:10, background:'#0ea5e9', width:`${Math.min(100,todaySteps/goal*100)}%`, transition:'.5s' }}></div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">📝 Log Activity</div>
            <div className="form-group">
              <label>Activity Type</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:6 }}>
                {ACTIVITIES.map((a,i) => (
                  <div key={i} onClick={()=>setActIdx(i)} style={{ padding:'10px 6px', border:`2px solid ${actIdx===i?'#0ea5e9':'#e2e8f0'}`, background:actIdx===i?'#e0f2fe':'white', borderRadius:8, textAlign:'center', cursor:'pointer', fontSize:12 }}>
                    <div style={{fontSize:22}}>{a.icon}</div>{a.type}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Steps</label><input className="input" type="number" placeholder="e.g. 5000" value={steps} onChange={e=>setSteps(e.target.value)} /></div>
              <div className="form-group"><label>Duration (min)</label><input className="input" type="number" placeholder="e.g. 30" value={duration} onChange={e=>setDuration(e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Your Weight (kg)</label><input className="input" type="number" value={weight} onChange={e=>setWeight(+e.target.value)} /></div>
              <div className="form-group"><label>Daily Step Goal</label><input className="input" type="number" value={goal} onChange={e=>setGoal(+e.target.value)} /></div>
            </div>
            {steps && <div className="alert alert-blue">🔥 <strong>{calories} calories</strong> burned · 📏 <strong>{distance} km</strong> walked</div>}
            <button className="btn btn-primary w-full" onClick={handleSave}>💾 Save Activity</button>
          </div>
          <div className="card">
            <div className="card-title">📋 Activity Log</div>
            {logs.length === 0 && <p className="muted text-sm">No activities logged yet.</p>}
            {logs.slice(0,8).map((l,i) => (
              <div key={i} className="list-item">
                <span style={{fontSize:22}}>{ACTIVITIES.find(a=>a.type===l.type)?.icon||'🏃'}</span>
                <div style={{flex:1}}><div className="fw-6">{l.type}: {(l.steps||0).toLocaleString()} steps</div><div className="muted text-sm">{l.distance}km · {l.calories} kcal · {l.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
