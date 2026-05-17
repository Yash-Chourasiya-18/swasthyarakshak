import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadData } from '../../utils/storage';

export default function HealthTimeline() {
  const [filter, setFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [custom, setCustom] = useState({ type:'Doctor Visit', note:'' });
  const [extra, setExtra] = useState([]);

  const TYPES = ['All','BP','Sugar','Sleep','Steps','Mood','Medication','Doctor','Vaccine','Voice Note'];
  const ICONS = { BP:'❤️', Sugar:'🩸', Sleep:'😴', Steps:'🏃', Mood:'🧠', Medication:'💊', Doctor:'👨‍⚕️', Vaccine:'💉', 'Voice Note':'🎤', default:'📋' };

  // Auto-aggregate from all trackers
  function buildEvents() {
    const events = [];
    loadData('bp_readings').forEach(r => events.push({ type:'BP', label:`BP: ${r.sys}/${r.dia} mmHg`, detail: r.status, time: r.time }));
    loadData('sugar_readings').forEach(r => events.push({ type:'Sugar', label:`Sugar: ${r.val} mg/dL (${r.type})`, detail: r.status, time: r.time }));
    loadData('sleep_logs').forEach(r => events.push({ type:'Sleep', label:`Sleep: ${r.hours}h (${r.quality})`, detail: r.bedtime+' → '+r.wakeup, time: r.time }));
    loadData('activities').forEach(r => events.push({ type:'Steps', label:`Activity: ${r.type} — ${r.steps?.toLocaleString()||0} steps`, detail: `${r.calories} kcal`, time: r.time }));
    loadData('mood_logs').forEach(r => events.push({ type:'Mood', label:`Mood: ${r.mood} · Stress ${r.stress}/10`, detail: r.factors?.join(', '), time: r.time }));
    loadData('vaccine_records').forEach(r => events.push({ type:'Vaccine', label:`Vaccine: ${r.vaccine}`, detail: r.doctor, time: r.time }));
    loadData('voice_notes').forEach(r => events.push({ type:'Voice Note', label:`Voice Note: ${r.transcript?.slice(0,50)||'Recorded'}...`, detail: r.category, time: r.time }));
    extra.forEach(e => events.push(e));
    return events.sort((a,b)=>new Date(b.time)-new Date(a.time));
  }

  const allEvents = buildEvents();
  const filtered = filter==='All' ? allEvents : allEvents.filter(e=>e.type===filter);

  // Compute insights
  const bpReadings = loadData('bp_readings');
  const highBPDays = bpReadings.filter(r=>r.sys>=140).length;
  const sugarReadings = loadData('sugar_readings');
  const avgSugar = sugarReadings.length ? Math.round(sugarReadings.slice(0,7).reduce((a,r)=>a+r.val,0)/Math.min(sugarReadings.length,7)) : '--';

  function addCustom() {
    if (!custom.note) return;
    setExtra(prev=>[...prev,{type:custom.type, label:`${custom.type}: ${custom.note}`, detail:'Manually added', time:new Date().toLocaleString()}]);
    setShowAdd(false); setCustom({type:'Doctor Visit', note:''});
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">📅 Health Timeline</h1><p className="page-sub">All your health events in one place</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        {/* Insights */}
        <div className="stats-row">
          <div className="stat-card blue"><div className="stat-icon">📊</div><div className="stat-val">{allEvents.length}</div><div className="stat-lbl">Total Events</div></div>
          <div className="stat-card red"><div className="stat-icon">❤️</div><div className="stat-val">{highBPDays}</div><div className="stat-lbl">High BP Days</div></div>
          <div className="stat-card yellow"><div className="stat-icon">🩸</div><div className="stat-val">{avgSugar}</div><div className="stat-lbl">Avg Sugar (7-day)</div></div>
          <div className="stat-card green"><div className="stat-icon">📈</div><div className="stat-val">{loadData('sleep_logs').filter(l=>l.hours>=7).length}</div><div className="stat-lbl">Good Sleep Nights</div></div>
        </div>

        {/* AI Insights */}
        {highBPDays >= 3 && <div className="alert alert-red">🔴 <strong>Pattern Alert:</strong> High BP detected {highBPDays} times. Consider consulting a cardiologist.</div>}
        {avgSugar > 140 && <div className="alert alert-yellow">⚠️ <strong>Sugar Alert:</strong> Average blood sugar {avgSugar} mg/dL indicates pre-diabetic range.</div>}
        {allEvents.length === 0 && <div className="alert alert-blue">ℹ️ No health events yet. Start logging your vitals to see your timeline here.</div>}

        {/* Filter */}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',margin:'0 0 16px'}}>
          {TYPES.map(t=><span key={t} className={`tag ${filter===t?'selected':''}`} onClick={()=>setFilter(t)}>{t}</span>)}
          <button className="btn btn-sm btn-primary" style={{marginLeft:'auto'}} onClick={()=>setShowAdd(!showAdd)}>+ Add Event</button>
        </div>

        {showAdd && (
          <div className="card mb-4">
            <div className="card-title">➕ Add Manual Event</div>
            <div className="form-row">
              <div className="form-group"><label>Event Type</label>
                <select className="input" value={custom.type} onChange={e=>setCustom(p=>({...p,type:e.target.value}))}>
                  {['Doctor Visit','Surgery','Injury','Hospitalization','Test Result','Medication Start','Medication Stop','Other'].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Note</label><input className="input" value={custom.note} onChange={e=>setCustom(p=>({...p,note:e.target.value}))} placeholder="Details..." /></div>
            </div>
            <button className="btn btn-primary" onClick={addCustom}>✅ Add to Timeline</button>
          </div>
        )}

        {/* Timeline */}
        <div className="card">
          <div className="card-title">📋 {filter} Events ({filtered.length})</div>
          {filtered.length === 0 && <p className="muted text-sm">No {filter} events found.</p>}
          {filtered.map((e,i)=>(
            <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid #f1f5f9',alignItems:'flex-start'}}>
              <div style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                <span style={{fontSize:20}}>{ICONS[e.type]||ICONS.default}</span>
                {i<filtered.length-1&&<div style={{width:2,height:20,background:'#e2e8f0',borderRadius:1,marginTop:2}}></div>}
              </div>
              <div style={{flex:1}}>
                <div className="fw-6" style={{fontSize:13}}>{e.label}</div>
                {e.detail && <div className="muted text-xs">{e.detail}</div>}
                <div className="muted text-xs" style={{marginTop:2}}>🕐 {e.time}</div>
              </div>
              <span style={{fontSize:11,padding:'2px 8px',background:'#f1f5f9',borderRadius:12,color:'#64748b',flexShrink:0}}>{e.type}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
