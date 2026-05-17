import { useState } from 'react';
import { Link } from 'react-router-dom';

const MEMBERS = [
  { name:'Me (Rahul)', age:28, relation:'Self', blood:'O+', bp:'118/76', sugar:95, conditions:'None', status:'healthy' },
  { name:'Papa (Ramesh)', age:58, relation:'Father', blood:'B+', bp:'142/92', sugar:165, conditions:'Hypertension, Pre-Diabetic', status:'alert' },
  { name:'Mama (Sunita)', age:54, relation:'Mother', blood:'A+', bp:'124/80', sugar:110, conditions:'None', status:'healthy' },
  { name:'Dadi (Savitri)', age:75, relation:'Grandmother', blood:'A-', bp:'156/98', sugar:210, conditions:'Hypertension, Diabetes, Knee Pain', status:'critical' },
];

const STATUS_CFG = {
  healthy: { label:'Healthy ✅', bg:'#dcfce7', color:'#166534', border:'#86efac' },
  alert:   { label:'Monitor ⚠️', bg:'#fef3c7', color:'#92400e', border:'#fde68a' },
  critical:{ label:'Alert 🔴',  bg:'#fee2e2', color:'#991b1b', border:'#fca5a5' },
};

export default function FamilyDashboard() {
  const [members, setMembers] = useState(MEMBERS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', age:'', relation:'', blood:'O+', bp:'', sugar:'', conditions:'' });

  function addMember() {
    if (!form.name) return alert('Name enter karo.');
    const bpVal = form.bp.split('/');
    const sys = +bpVal[0], dia = +bpVal[1];
    const status = sys >= 140 || +form.sugar >= 180 ? 'critical' : sys >= 130 || +form.sugar >= 140 ? 'alert' : 'healthy';
    setMembers(prev => [...prev, { ...form, age: +form.age, status }]);
    setShowAdd(false); setForm({ name:'', age:'', relation:'', blood:'O+', bp:'', sugar:'', conditions:'' });
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">👨‍👩‍👧 Family Dashboard</h1><p className="page-sub">Track health of entire family from one screen</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card green"><div className="stat-icon">👤</div><div className="stat-val">{members.length}</div><div className="stat-lbl">Family Members</div></div>
          <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-val">{members.filter(m=>m.status==='healthy').length}</div><div className="stat-lbl">Healthy</div></div>
          <div className="stat-card yellow"><div className="stat-icon">⚠️</div><div className="stat-val">{members.filter(m=>m.status==='alert').length}</div><div className="stat-lbl">Need Monitoring</div></div>
          <div className="stat-card red"><div className="stat-icon">🔴</div><div className="stat-val">{members.filter(m=>m.status==='critical').length}</div><div className="stat-lbl">Critical Alerts</div></div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14,marginBottom:16}}>
          {members.map((m,i) => {
            const st = STATUS_CFG[m.status];
            const bpParts = m.bp?.split('/');
            return (
              <div key={i} style={{border:`2px solid ${st.border}`,borderRadius:14,padding:18,background:'white'}}>
                <div className="flex-between" style={{marginBottom:12}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:16}}>{m.name}</div>
                    <div className="muted text-sm">{m.relation} · Age {m.age} · 🩸 {m.blood}</div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                    <span style={{background:st.bg,color:st.color,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700}}>{st.label}</span>
                    <span style={{width:10,height:10,borderRadius:'50%',background:m.status==='healthy'?'#22c55e':m.status==='alert'?'#f59e0b':'#ef4444',display:'inline-block'}}></span>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  <div style={{background:'#fef3c7',borderRadius:8,padding:10,textAlign:'center'}}>
                    <div style={{fontSize:11,color:'#92400e',marginBottom:2}}>❤️ Blood Pressure</div>
                    <div style={{fontWeight:800,fontSize:18}}>{m.bp || '--'}</div>
                    <div style={{fontSize:10,color:bpParts&&+bpParts[0]>=140?'#991b1b':'#166534'}}>{bpParts&&+bpParts[0]>=140?'High':'Normal'}</div>
                  </div>
                  <div style={{background:'#fee2e2',borderRadius:8,padding:10,textAlign:'center'}}>
                    <div style={{fontSize:11,color:'#991b1b',marginBottom:2}}>🩸 Blood Sugar</div>
                    <div style={{fontWeight:800,fontSize:18}}>{m.sugar || '--'}</div>
                    <div style={{fontSize:10,color:m.sugar>=140?'#991b1b':'#166534'}}>{m.sugar>=140?'High':'Normal'} mg/dL</div>
                  </div>
                </div>
                {m.conditions && m.conditions !== 'None' && (
                  <div style={{marginTop:10,background:'#f1f5f9',borderRadius:6,padding:'6px 10px',fontSize:12}}>
                    ⚕️ {m.conditions}
                  </div>
                )}
                <button className="btn btn-outline w-full mt-2 btn-sm" onClick={()=>alert(`Coming soon: Individual health profile for ${m.name}`)}>
                  📋 View Full Profile
                </button>
              </div>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={()=>setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Family Member'}
        </button>

        {showAdd && (
          <div className="card mt-3">
            <div className="card-title">👤 Add New Member</div>
            <div className="form-row">
              <div className="form-group"><label>Name</label><input className="input" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full name" /></div>
              <div className="form-group"><label>Relation</label><input className="input" value={form.relation} onChange={e=>setForm(p=>({...p,relation:e.target.value}))} placeholder="Father, Mother, etc." /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Age</label><input className="input" type="number" value={form.age} onChange={e=>setForm(p=>({...p,age:e.target.value}))} /></div>
              <div className="form-group"><label>Blood Group</label>
                <select className="input" value={form.blood} onChange={e=>setForm(p=>({...p,blood:e.target.value}))}>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>BP (e.g. 120/80)</label><input className="input" value={form.bp} onChange={e=>setForm(p=>({...p,bp:e.target.value}))} /></div>
              <div className="form-group"><label>Sugar (mg/dL)</label><input className="input" type="number" value={form.sugar} onChange={e=>setForm(p=>({...p,sugar:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label>Medical Conditions</label><input className="input" value={form.conditions} onChange={e=>setForm(p=>({...p,conditions:e.target.value}))} placeholder="e.g. Diabetes, None" /></div>
            <button className="btn btn-primary w-full" onClick={addMember}>✅ Add Member</button>
          </div>
        )}
      </div>
    </>
  );
}
