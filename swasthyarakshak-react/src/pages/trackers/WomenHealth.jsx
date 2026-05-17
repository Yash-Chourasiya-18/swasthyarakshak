import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const CYCLE_DAYS = ['spotting','period','period','period','period','spotting','','','','','','','','fertile','fertile','ovulation','fertile','fertile','','','','','','','','','','','',''];

export default function WomenHealth() {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLen, setCycleLen] = useState(28);
  const [flow, setFlow] = useState('medium');
  const [symptoms, setSymptoms] = useState([]);
  const [logs, setLogs] = useState(loadData('period_logs'));

  const SYMPTOMS_LIST = ['Cramps','Nausea','Bloating','Mood Swings','Headache','Back Pain','Fatigue','Breast Tenderness','Acne','Food Cravings'];

  function toggleSym(s) { setSymptoms(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev,s]); }

  function calcDates() {
    if (!lastPeriod) return null;
    const lp = new Date(lastPeriod);
    const nextPeriod = new Date(lp); nextPeriod.setDate(lp.getDate() + cycleLen);
    const ovulation = new Date(lp); ovulation.setDate(lp.getDate() + 14);
    const fertileStart = new Date(lp); fertileStart.setDate(lp.getDate() + 11);
    const fertileEnd = new Date(lp); fertileEnd.setDate(lp.getDate() + 17);
    return { nextPeriod, ovulation, fertileStart, fertileEnd };
  }

  function handleSave() {
    if (!lastPeriod) return alert('Last period date select karo.');
    const dates = calcDates();
    const newData = saveData('period_logs', { lastPeriod, cycleLen, flow, symptoms, nextPeriod: dates?.nextPeriod?.toLocaleDateString('en-IN') });
    setLogs(newData);
    alert('✅ Period log saved!');
  }

  const dates = calcDates();
  const today = new Date();

  function getDayType(dateStr) {
    if (!dates || !lastPeriod) return '';
    const d = new Date(dateStr);
    const diff = Math.round((d - new Date(lastPeriod)) / (1000*60*60*24));
    if (diff >= 0 && diff < 28) return CYCLE_DAYS[diff] || '';
    return '';
  }

  // Generate calendar days
  const calStart = lastPeriod ? new Date(lastPeriod) : new Date();
  const calDays = Array.from({length:35}, (_,i) => {
    const d = new Date(calStart); d.setDate(calStart.getDate() + i - calStart.getDay());
    return d;
  });

  const dayColors = { period:'#fca5a5', spotting:'#fde68a', fertile:'#86efac', ovulation:'#6ee7b7' };

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🌸 Women Health</h1><p className="page-sub">Period tracker, ovulation & cycle prediction</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-blue">🔒 All data is stored only on your device. It is never shared with anyone.</div>

        {dates && (
          <div className="stats-row">
            <div className="stat-card red"><div className="stat-icon">🔴</div><div className="stat-val">{dates.nextPeriod.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div><div className="stat-lbl">Next Period</div></div>
            <div className="stat-card green"><div className="stat-icon">🌿</div><div className="stat-val">{dates.fertileStart.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div><div className="stat-lbl">Fertile Window</div></div>
            <div className="stat-card blue"><div className="stat-icon">🥚</div><div className="stat-val">{dates.ovulation.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div><div className="stat-lbl">Ovulation Day</div></div>
            <div className="stat-card yellow"><div className="stat-icon">📅</div><div className="stat-val">{cycleLen} days</div><div className="stat-lbl">Cycle Length</div></div>
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <div className="card-title">📅 Log Period</div>
            <div className="form-row">
              <div className="form-group"><label>Last Period Start Date</label><input className="input" type="date" value={lastPeriod} onChange={e=>setLastPeriod(e.target.value)} /></div>
              <div className="form-group"><label>Cycle Length (days)</label><input className="input" type="number" value={cycleLen} min="20" max="45" onChange={e=>setCycleLen(+e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label>Flow Intensity</label>
              <div style={{display:'flex',gap:8,marginTop:6}}>
                {[['Light','💧'],['Medium','💧💧'],['Heavy','💧💧💧'],['Spotting','·']].map(([f,icon])=>(
                  <span key={f} className={`tag ${flow===f.toLowerCase()?'selected':''}`} onClick={()=>setFlow(f.toLowerCase())}>{icon} {f}</span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Symptoms</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>
                {SYMPTOMS_LIST.map(s=><span key={s} className={`tag ${symptoms.includes(s)?'selected':''}`} onClick={()=>toggleSym(s)}>{s}</span>)}
              </div>
            </div>
            <button className="btn btn-primary w-full" style={{background:'#ec4899',borderColor:'#ec4899'}} onClick={handleSave}>💾 Save Log</button>

            <div style={{marginTop:16}}>
              <div className="card-title" style={{fontSize:13}}>📊 Legend</div>
              {[['Period Days','#fca5a5'],['Spotting','#fde68a'],['Fertile Window','#86efac'],['Ovulation Day','#6ee7b7']].map(([l,c])=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:10,padding:'4px 0',fontSize:13}}>
                  <div style={{width:16,height:16,borderRadius:4,background:c}}></div>{l}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">📆 Cycle Calendar</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:8}}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} style={{textAlign:'center',fontSize:10,fontWeight:700,color:'#94a3b8',padding:'4px 0'}}>{d}</div>)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2}}>
              {calDays.map((d,i) => {
                const diff = lastPeriod ? Math.round((d-new Date(lastPeriod))/(1000*60*60*24)) : -1;
                const type = (diff>=0&&diff<35) ? CYCLE_DAYS[diff] : '';
                const isToday = d.toDateString()===today.toDateString();
                return (
                  <div key={i} style={{textAlign:'center',padding:'6px 2px',borderRadius:6,background:dayColors[type]||'transparent',border:isToday?'2px solid #ec4899':'1px solid transparent',fontSize:12}}>
                    {d.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
