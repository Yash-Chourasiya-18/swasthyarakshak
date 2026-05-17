import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const VACCINES = [
  { name:'BCG', age:'Birth', disease:'Tuberculosis' },
  { name:'OPV 0', age:'Birth', disease:'Polio' },
  { name:'Hepatitis B (1)', age:'Birth', disease:'Hepatitis B' },
  { name:'OPV 1 + Penta 1', age:'6 weeks', disease:'Polio + DPT + Hep B + Hib' },
  { name:'OPV 2 + Penta 2', age:'10 weeks', disease:'Polio + DPT + Hep B + Hib' },
  { name:'OPV 3 + Penta 3', age:'14 weeks', disease:'Polio + DPT + Hep B + Hib' },
  { name:'IPV', age:'14 weeks', disease:'Polio (Inactivated)' },
  { name:'Measles 1', age:'9 months', disease:'Measles' },
  { name:'JE 1', age:'9 months', disease:'Japanese Encephalitis' },
  { name:'MR/MMR', age:'12 months', disease:'Measles + Rubella' },
  { name:'JE 2', age:'16 months', disease:'Japanese Encephalitis' },
  { name:'DPT Booster 1', age:'16–24 months', disease:'Diphtheria + Pertussis + Tetanus' },
  { name:'OPV Booster', age:'16–24 months', disease:'Polio' },
  { name:'Measles 2', age:'16–24 months', disease:'Measles' },
  { name:'DPT Booster 2', age:'5 years', disease:'DPT' },
  { name:'TT / Td', age:'10 years', disease:'Tetanus + Diphtheria' },
  { name:'TT / Td', age:'16 years', disease:'Tetanus + Diphtheria' },
];

export default function Vaccination() {
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [records, setRecords] = useState(loadData('vaccine_records'));
  const [given, setGiven] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [custom, setCustom] = useState({ vaccine:'', date:'', doctor:'', clinic:'' });

  function calcDue(ageStr, dobDate) {
    if (!dobDate) return null;
    const base = new Date(dobDate);
    const match = ageStr.match(/(\d+)\s*(week|month|year)/i);
    if (!match) return base;
    const [, n, unit] = match;
    const d = new Date(base);
    if (unit.startsWith('week')) d.setDate(d.getDate() + +n * 7);
    else if (unit.startsWith('month')) d.setMonth(d.getMonth() + +n);
    else d.setFullYear(d.getFullYear() + +n);
    return d;
  }

  function getStatus(v) {
    if (given[v.name]) return 'done';
    const due = calcDue(v.age, dob);
    if (!due) return 'unknown';
    const today = new Date();
    if (due < today) return 'overdue';
    if (due - today < 30*24*3600*1000) return 'upcoming';
    return 'future';
  }

  const statusCfg = {
    done:    { label:'✅ Given',   bg:'#dcfce7', color:'#166534' },
    overdue: { label:'🔴 Overdue', bg:'#fee2e2', color:'#991b1b' },
    upcoming:{ label:'🟡 Due Soon',bg:'#fef3c7', color:'#92400e' },
    future:  { label:'🔵 Upcoming',bg:'#e0f2fe', color:'#0369a1' },
    unknown: { label:'–',         bg:'#f1f5f9', color:'#64748b' },
  };

  function saveCustom() {
    if (!custom.vaccine) return alert('Vaccine name enter karo.');
    const newData = saveData('vaccine_records', custom);
    setRecords(newData); setCustom({ vaccine:'',date:'',doctor:'',clinic:'' }); setShowForm(false);
    alert('✅ Vaccine record saved!');
  }

  const stats = { done: Object.keys(given).length, overdue: dob ? VACCINES.filter(v=>getStatus(v)==='overdue').length : 0, upcoming: dob ? VACCINES.filter(v=>getStatus(v)==='upcoming').length : 0 };

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">💉 Vaccination Tracker</h1><p className="page-sub">India NIS schedule & immunization records</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="card mb-4">
          <div className="card-title">👶 Child Information</div>
          <div className="form-row">
            <div className="form-group"><label>Child's Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter child's name" /></div>
            <div className="form-group"><label>Date of Birth</label><input className="input" type="date" value={dob} onChange={e=>setDob(e.target.value)} /></div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-val">{stats.done}</div><div className="stat-lbl">Given</div></div>
          <div className="stat-card red"><div className="stat-icon">🔴</div><div className="stat-val">{stats.overdue}</div><div className="stat-lbl">Overdue</div></div>
          <div className="stat-card yellow"><div className="stat-icon">🟡</div><div className="stat-val">{stats.upcoming}</div><div className="stat-lbl">Due Soon</div></div>
          <div className="stat-card blue"><div className="stat-icon">💉</div><div className="stat-val">{VACCINES.length}</div><div className="stat-lbl">Total Vaccines</div></div>
        </div>

        <div className="card mb-4">
          <div className="card-title">📋 NIS Vaccination Schedule</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead><tr style={{background:'#f1f5f9'}}>{['Vaccine','Age','Disease Protected','Status','Action'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:700,fontSize:11,textTransform:'uppercase',color:'#64748b'}}>{h}</th>)}</tr></thead>
              <tbody>
                {VACCINES.map((v,i) => {
                  const st = getStatus(v);
                  const cfg = statusCfg[st];
                  const due = dob ? calcDue(v.age, dob) : null;
                  return (
                    <tr key={i} style={{borderBottom:'1px solid #f1f5f9'}}>
                      <td style={{padding:'10px 12px',fontWeight:600}}>{v.name}</td>
                      <td style={{padding:'10px 12px',color:'#64748b'}}>{v.age}</td>
                      <td style={{padding:'10px 12px',color:'#64748b',fontSize:12}}>{v.disease}</td>
                      <td style={{padding:'10px 12px'}}>
                        <span style={{background:cfg.bg,color:cfg.color,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700}}>{cfg.label}</span>
                        {due && <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{due.toLocaleDateString('en-IN')}</div>}
                      </td>
                      <td style={{padding:'10px 12px'}}>
                        <input type="checkbox" checked={!!given[v.name]} onChange={e=>setGiven(prev=>({...prev,[v.name]:e.target.checked}))} /> Mark given
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <div className="card-title" style={{margin:0}}>📁 Custom Vaccine Records</div>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowForm(!showForm)}>+ Add Record</button>
          </div>
          {showForm && (
            <div style={{background:'#f8fafc',borderRadius:10,padding:16,marginBottom:14}}>
              <div className="form-row">
                <div className="form-group"><label>Vaccine Name</label><input className="input" value={custom.vaccine} onChange={e=>setCustom(p=>({...p,vaccine:e.target.value}))} placeholder="e.g. Varicella" /></div>
                <div className="form-group"><label>Date Given</label><input className="input" type="date" value={custom.date} onChange={e=>setCustom(p=>({...p,date:e.target.value}))} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Doctor Name</label><input className="input" value={custom.doctor} onChange={e=>setCustom(p=>({...p,doctor:e.target.value}))} placeholder="Dr. Name" /></div>
                <div className="form-group"><label>Clinic / Hospital</label><input className="input" value={custom.clinic} onChange={e=>setCustom(p=>({...p,clinic:e.target.value}))} placeholder="Clinic name" /></div>
              </div>
              <button className="btn btn-primary" onClick={saveCustom}>💾 Save Record</button>
            </div>
          )}
          {records.length === 0 && <p className="muted text-sm">No custom records yet.</p>}
          {records.map((r,i) => (
            <div key={i} className="list-item">
              <span style={{fontSize:22}}>💉</span>
              <div style={{flex:1}}><div className="fw-6">{r.vaccine}</div><div className="muted text-sm">{r.date} · {r.doctor} · {r.clinic}</div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
