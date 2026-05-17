import { useState } from 'react';
import { Link } from 'react-router-dom';

const NURSES = [
  { name:'Priya Sharma', exp:8, rating:4.9, skills:['Injection','Wound Dressing','Elderly Care','Diabetes Management'], lang:['Hindi','English'], gender:'Female', fee:800 },
  { name:'Ravi Kumar', exp:5, rating:4.7, skills:['Physiotherapy','Post-Op Care','ICU Care','Baby Care'], lang:['Hindi','Telugu'], gender:'Male', fee:700 },
  { name:'Sunita Devi', exp:12, rating:4.8, skills:['Elderly Care','Palliative Care','Wound Dressing','Injection'], lang:['Hindi','English','Marathi'], gender:'Female', fee:900 },
  { name:'Amit Singh', exp:6, rating:4.6, skills:['Post-Op Care','Physiotherapy','IV Therapy'], lang:['Hindi','English'], gender:'Male', fee:750 },
  { name:'Meena Rao', exp:10, rating:4.9, skills:['Baby Care','Post-Natal Care','Lactation Support'], lang:['Hindi','Tamil'], gender:'Female', fee:850 },
];

const DURATIONS = [
  { label:'4 Hours', mul:0.5, icon:'⏱️' }, { label:'8 Hours (Day)', mul:1, icon:'☀️' },
  { label:'12 Hours (Night)', mul:1.5, icon:'🌙' }, { label:'24 Hours', mul:2.5, icon:'🔄' },
  { label:'Weekly (7 days)', mul:12, icon:'📅' },
];

export default function HomeNurse() {
  const [filter, setFilter] = useState('');
  const [gender, setGender] = useState('Any');
  const [duration, setDuration] = useState(1);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState('');

  const SKILLS = ['Injection','Wound Dressing','Elderly Care','Physiotherapy','Post-Op Care','ICU Care','Baby Care','Diabetes Management','Palliative Care','IV Therapy'];

  const filtered = NURSES.filter(n =>
    (gender==='Any' || n.gender===gender) &&
    (!filter || n.skills.some(s=>s.toLowerCase().includes(filter.toLowerCase())))
  );

  function book(nurse) {
    if (!date) return alert('Date select karo.');
    const dur = DURATIONS[duration];
    const fee = Math.round(nurse.fee * dur.mul);
    alert(`✅ Booking Confirmed!\n\nNurse: ${nurse.name}\nDuration: ${dur.label}\nDate: ${date}\nTotal Fee: ₹${fee}\n\nYou will be contacted within 30 minutes.`);
    setSelected(null);
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">👩‍⚕️ Home Nurse Booking</h1><p className="page-sub">Certified nurses available at your home</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card green"><div className="stat-icon">👩‍⚕️</div><div className="stat-val">50+</div><div className="stat-lbl">Verified Nurses</div></div>
          <div className="stat-card blue"><div className="stat-icon">⭐</div><div className="stat-val">4.8</div><div className="stat-lbl">Avg Rating</div></div>
          <div className="stat-card yellow"><div className="stat-icon">⚡</div><div className="stat-val">30 min</div><div className="stat-lbl">Avg Response</div></div>
          <div className="stat-card purple"><div className="stat-icon">🔒</div><div className="stat-val">100%</div><div className="stat-lbl">Background Verified</div></div>
        </div>

        <div className="card mb-4">
          <div className="card-title">🔍 Filter Nurses</div>
          <div className="form-row">
            <div className="form-group"><label>Skill Needed</label>
              <select className="input" value={filter} onChange={e=>setFilter(e.target.value)}>
                <option value="">All Skills</option>{SKILLS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Gender Preference</label>
              <select className="input" value={gender} onChange={e=>setGender(e.target.value)}>
                {['Any','Female','Male'].map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Duration</label>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}}>
              {DURATIONS.map((d,i)=><span key={i} className={`tag ${duration===i?'selected':''}`} onClick={()=>setDuration(i)}>{d.icon} {d.label}</span>)}
            </div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:14}}>
          {filtered.map((n,i)=>{
            const fee = Math.round(n.fee * DURATIONS[duration].mul);
            const isSel = selected?.name===n.name;
            return (
              <div key={i} style={{border:`2px solid ${isSel?'#0ea5e9':'#e2e8f0'}`,borderRadius:12,padding:16,background:'white',transition:'.2s'}}>
                <div className="flex-between" style={{marginBottom:10}}>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#0ea5e9,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:20}}>
                      {n.gender==='Female'?'👩':'👨'}
                    </div>
                    <div>
                      <div className="fw-7">{n.name}</div>
                      <div className="muted text-xs">⭐ {n.rating} · {n.exp} yrs exp</div>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontWeight:800,color:'#0ea5e9',fontSize:16}}>₹{fee}</div>
                    <div className="muted text-xs">{DURATIONS[duration].label}</div>
                  </div>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>
                  {n.skills.map(s=><span key={s} style={{background:'#e0f2fe',color:'#0369a1',padding:'2px 8px',borderRadius:12,fontSize:11}}>{s}</span>)}
                </div>
                <div className="muted text-xs" style={{marginBottom:10}}>🌐 {n.lang.join(', ')}</div>
                {isSel ? (
                  <div>
                    <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} style={{marginBottom:8}} min={new Date().toISOString().split('T')[0]} />
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-primary" style={{flex:1}} onClick={()=>book(n)}>✅ Confirm Booking</button>
                      <button className="btn btn-outline" onClick={()=>setSelected(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary w-full" onClick={()=>setSelected(n)}>📅 Book {n.name.split(' ')[0]}</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
