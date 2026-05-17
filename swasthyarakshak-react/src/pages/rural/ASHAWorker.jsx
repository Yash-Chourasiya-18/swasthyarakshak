import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function ASHAWorker() {
  const [tasks, setTasks] = useState([
    { text:'Morning rounds — 4 families', done:true },
    { text:'Meena Rani — Insulin injection + BP check', done:true },
    { text:'🔴 Raju — OPV + Penta vaccination (urgent)', done:false },
    { text:'Kamla Devi — ANC checkup + Iron tablet', done:false },
    { text:'Shyam Lal — BP medicine reminder', done:false },
    { text:'Monthly report submit to PHC', done:false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [quickLog, setQuickLog] = useState(null);
  const [logValue, setLogValue] = useState('');
  const [visitCount, setVisitCount] = useState(6);
  const logs = loadData('asha_logs');

  function toggleTask(i) { setTasks(prev => prev.map((t,j) => j===i ? {...t,done:!t.done} : t)); }
  function addTask() { if (!newTask) return; setTasks(prev => [...prev, {text:newTask,done:false}]); setNewTask(''); }
  function submitLog() {
    if (!logValue) return;
    saveData('asha_logs', { type:quickLog, value:logValue });
    setVisitCount(v=>v+1);
    alert(`✅ ${quickLog} logged: ${logValue}`);
    setQuickLog(null); setLogValue('');
  }

  const QUICK = [['❤️','Log BP','#fee2e2'],['💉','Vaccine','#e0f2fe'],['⚖️','Weight','#dcfce7'],['🤰','ANC Check','#fef3c7'],['🩸','Blood Sugar','#f3e8ff'],['📝','Note','#f1f5f9']];
  const pending = tasks.filter(t=>!t.done).length;

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">👩‍⚕️ ASHA Worker Mode</h1><p className="page-sub">Village healthcare worker dashboard</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div style={{ background:'linear-gradient(135deg,#065f46,#047857)', color:'white', borderRadius:16, padding:24, marginBottom:16, position:'relative', overflow:'hidden' }}>
          <div style={{fontSize:13,opacity:.7,textTransform:'uppercase',letterSpacing:1,marginBottom:4}}>Accredited Social Health Activist</div>
          <div style={{fontSize:22,fontWeight:800,marginBottom:4}}>Sunita Devi</div>
          <div style={{opacity:.8,fontSize:13}}>📍 Gram Panchayat: Rampur, Dist. Bareilly, UP</div>
          <div style={{display:'flex',gap:24,marginTop:16,flexWrap:'wrap'}}>
            {[['24','Assigned Patients'],[(visitCount),'Visits Today'],[pending,'Pending Tasks'],['₹1,450','Monthly Incentive']].map(([v,l])=>(
              <div key={l}><div style={{fontSize:24,fontWeight:800}}>{v}</div><div style={{opacity:.7,fontSize:12}}>{l}</div></div>
            ))}
          </div>
          <div style={{position:'absolute',right:16,bottom:-10,fontSize:80,opacity:.1}}>👩‍⚕️</div>
        </div>

        <div className="stats-row">
          <div className="stat-card green"><div className="stat-icon">🤰</div><div className="stat-val">5</div><div className="stat-lbl">Pregnant</div></div>
          <div className="stat-card blue"><div className="stat-icon">👶</div><div className="stat-val">8</div><div className="stat-lbl">Newborns</div></div>
          <div className="stat-card yellow"><div className="stat-icon">💉</div><div className="stat-val">3</div><div className="stat-lbl">Vaccine Due</div></div>
          <div className="stat-card red"><div className="stat-icon">⚠️</div><div className="stat-val">2</div><div className="stat-lbl">High Risk</div></div>
        </div>

        <div className="grid-2">
          <div>
            <div className="card mb-4">
              <div className="card-title">⚡ Quick Field Log</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                {QUICK.map(([icon,label,bg])=>(
                  <button key={label} onClick={()=>setQuickLog(label)} style={{padding:'14px 8px',border:`2px solid ${quickLog===label?'#0ea5e9':'transparent'}`,background:bg,borderRadius:10,cursor:'pointer',fontSize:12,fontWeight:700,textAlign:'center'}}>
                    <div style={{fontSize:26}}>{icon}</div>{label}
                  </button>
                ))}
              </div>
              {quickLog && (
                <div className="mt-3">
                  <input className="input" placeholder={`Enter value for ${quickLog}...`} value={logValue} onChange={e=>setLogValue(e.target.value)} />
                  <div style={{display:'flex',gap:8,marginTop:8}}>
                    <button className="btn btn-primary" style={{flex:1}} onClick={submitLog}>✅ Log {quickLog}</button>
                    <button className="btn btn-outline" onClick={()=>setQuickLog(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-title">🏛️ Govt Scheme Tracker</div>
              {[['🤰 PM Matru Vandana Yojana','₹5,000 for first child — 3 eligible','yellow'],['👶 Janani Suraksha Yojana','₹1,400 for institutional delivery','green'],['💊 PM Jan Aushadhi','Generic medicines 50–90% discount','blue']].map(([name,desc,color])=>(
                <div key={name} style={{background:`var(--${color==='yellow'?'warning':'success'}-light)`,borderRadius:10,padding:12,marginBottom:8}}>
                  <div className="fw-6" style={{marginBottom:4}}>{name}</div>
                  <div className="muted text-sm">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="card mb-4">
              <div className="card-title">✅ Today's Tasks ({tasks.filter(t=>t.done).length}/{tasks.length})</div>
              {tasks.map((t,i) => (
                <div key={i} className="list-item" style={{cursor:'pointer'}} onClick={()=>toggleTask(i)}>
                  <div style={{width:22,height:22,border:`2px solid ${t.done?'#22c55e':'#94a3b8'}`,background:t.done?'#22c55e':'white',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',color:'white',flexShrink:0,fontSize:13}}>
                    {t.done&&'✓'}
                  </div>
                  <div className="text-sm" style={{textDecoration:t.done?'line-through':'none',color:t.done?'#94a3b8':'inherit'}}>{t.text}</div>
                </div>
              ))}
              <div style={{display:'flex',gap:8,marginTop:10}}>
                <input className="input" placeholder="Add new task..." value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} />
                <button className="btn btn-primary" onClick={addTask}>+</button>
              </div>
            </div>

            <div className="card">
              <div className="card-title">💰 Incentive Tracker — May 2026</div>
              {[['Institutional deliveries (2×₹600)','₹1,200'],['Immunization (8×₹100)','₹800'],['ANC visits (5×₹50)','₹250'],['TB DOTS support','₹500']].map(([label,amt])=>(
                <div key={label} className="flex-between" style={{padding:'8px 0',borderBottom:'1px solid #f1f5f9',fontSize:13}}>
                  <span>{label}</span><span className="fw-6">{amt}</span>
                </div>
              ))}
              <div className="flex-between" style={{padding:'12px 0',fontSize:16,fontWeight:800,color:'#22c55e'}}>
                <span>Total Earned</span><span>₹2,750</span>
              </div>
              <button className="btn btn-primary w-full" onClick={()=>alert('📤 Monthly Report submitted to PHC Bareilly!\n\nIncentive will be credited within 7 days.')}>
                📤 Submit Monthly Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
