import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const MOODS = [
  {emoji:'😄',label:'Happy',val:5},{emoji:'😊',label:'Good',val:4},{emoji:'😐',label:'Neutral',val:3},
  {emoji:'😢',label:'Sad',val:2},{emoji:'😰',label:'Anxious',val:1},{emoji:'😠',label:'Angry',val:1},
  {emoji:'😴',label:'Tired',val:2},{emoji:'🤩',label:'Excited',val:5}
];
const FACTORS = ['Work/Studies','Sleep','Family','Exercise','Weather','Health','Relationships','Finance','Nutrition','Achievement'];

export default function MoodJournal() {
  const [mood, setMood] = useState(null);
  const [stress, setStress] = useState(5);
  const [factors, setFactors] = useState([]);
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState(loadData('mood_logs'));

  function toggleFactor(f) { setFactors(prev => prev.includes(f) ? prev.filter(x=>x!==f) : [...prev,f]); }

  function handleSave() {
    if (!mood) return alert('Mood select karo.');
    if (stress >= 8) alert('⚠️ High stress detected! Please consider talking to someone or taking a break.');
    const newData = saveData('mood_logs', { mood: mood.label, emoji: mood.emoji, stress, factors, note });
    setLogs(newData); setMood(null); setStress(5); setFactors([]); setNote('');
  }

  const avgStress = logs.length ? (logs.slice(0,7).reduce((a,l) => a+(l.stress||0),0)/Math.min(logs.length,7)).toFixed(1) : '--';

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🧠 Mood Journal</h1><p className="page-sub">Stress, anxiety & mood tracking</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card blue"><div className="stat-icon">📊</div><div className="stat-val">{avgStress}</div><div className="stat-lbl">Avg Stress (7-day)</div></div>
          <div className="stat-card green"><div className="stat-icon">😊</div><div className="stat-val">{logs.filter(l=>['Happy','Good','Excited'].includes(l.mood)).length}</div><div className="stat-lbl">Happy Days</div></div>
          <div className="stat-card yellow"><div className="stat-icon">😰</div><div className="stat-val">{logs.filter(l=>l.stress>=8).length}</div><div className="stat-lbl">High Stress Days</div></div>
        </div>
        <div className="grid-2">
          <div className="card">
            <div className="card-title">😊 How are you feeling today?</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:16 }}>
              {MOODS.map(m => (
                <div key={m.label} onClick={()=>setMood(m)} style={{ padding:'12px 8px', border:`2px solid ${mood?.label===m.label?'#0ea5e9':'#e2e8f0'}`, background:mood?.label===m.label?'#e0f2fe':'white', borderRadius:10, textAlign:'center', cursor:'pointer' }}>
                  <div style={{fontSize:28}}>{m.emoji}</div>
                  <div style={{fontSize:11,marginTop:4}}>{m.label}</div>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Stress Level: <strong>{stress}/10</strong></label>
              <input type="range" min="1" max="10" value={stress} onChange={e=>setStress(+e.target.value)} style={{width:'100%'}} />
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#64748b'}}><span>😌 Calm (1)</span><span>😱 Very Stressed (10)</span></div>
            </div>
            <div className="form-group">
              <label>Contributing Factors</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{FACTORS.map(f=><span key={f} className={`tag ${factors.includes(f)?'selected':''}`} onClick={()=>toggleFactor(f)}>{f}</span>)}</div>
            </div>
            <div className="form-group"><label>Journal Note (optional)</label><textarea className="input" rows={3} placeholder="Write what's on your mind..." value={note} onChange={e=>setNote(e.target.value)} /></div>
            {stress >= 8 && <div className="alert alert-red">⚠️ High stress detected. Consider a short walk, meditation, or talking to a trusted person.</div>}
            <button className="btn btn-primary w-full" onClick={handleSave}>💾 Save Mood Entry</button>
          </div>
          <div className="card">
            <div className="card-title">📋 Mood History</div>
            {logs.length === 0 && <p className="muted text-sm">No entries yet. Track your first mood!</p>}
            {logs.slice(0,8).map((l,i) => (
              <div key={i} className="list-item">
                <span style={{fontSize:28}}>{l.emoji}</span>
                <div style={{flex:1}}><div className="fw-6">{l.mood} · Stress: {l.stress}/10</div><div className="muted text-sm">{l.time}</div>{l.note&&<div className="muted text-xs" style={{marginTop:2}}>"{l.note.slice(0,50)}..."</div>}</div>
                <span className="badge" style={{background:l.stress>=8?'#fee2e2':l.stress>=5?'#fef3c7':'#dcfce7',color:l.stress>=8?'#991b1b':l.stress>=5?'#92400e':'#166534'}}>Stress {l.stress}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
