import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function MedicalID() {
  const KEYS = ['name','dob','blood','weight','height','conditions','allergies','medications','doctor','doctorPhone','emergency1','emergency1Phone','emergency2','emergency2Phone','organDonor'];
  const init = () => {
    const saved = localStorage.getItem('medical_id');
    return saved ? JSON.parse(saved) : { name:'',dob:'',blood:'',weight:'',height:'',conditions:'',allergies:'',medications:'',doctor:'',doctorPhone:'',emergency1:'',emergency1Phone:'',emergency2:'',emergency2Phone:'',organDonor:false };
  };
  const [data, setData] = useState(init);
  const [saved, setSaved] = useState(false);

  function set(k,v) { setData(prev => ({...prev,[k]:v})); }

  function handleSave() {
    localStorage.setItem('medical_id', JSON.stringify(data));
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  }

  const age = data.dob ? Math.floor((Date.now()-new Date(data.dob))/(365.25*24*3600*1000)) : '';

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🪪 Medical ID</h1><p className="page-sub">Emergency information — visible without unlocking phone</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="grid-2">
          <div>
            <div className="card mb-4">
              <div className="card-title">👤 Personal Information</div>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input className="input" value={data.name} onChange={e=>set('name',e.target.value)} placeholder="Your full name" /></div>
                <div className="form-group"><label>Date of Birth</label><input className="input" type="date" value={data.dob} onChange={e=>set('dob',e.target.value)} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Blood Group</label>
                  <select className="input" value={data.blood} onChange={e=>set('blood',e.target.value)}>
                    <option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Weight (kg)</label><input className="input" type="number" value={data.weight} onChange={e=>set('weight',e.target.value)} placeholder="65" /></div>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-title">🏥 Medical Details</div>
              <div className="form-group"><label>Medical Conditions</label><input className="input" value={data.conditions} onChange={e=>set('conditions',e.target.value)} placeholder="e.g. Diabetes, Hypertension" /></div>
              <div className="form-group"><label>Allergies</label><input className="input" value={data.allergies} onChange={e=>set('allergies',e.target.value)} placeholder="e.g. Penicillin, Dust" /></div>
              <div className="form-group"><label>Current Medications</label><input className="input" value={data.medications} onChange={e=>set('medications',e.target.value)} placeholder="e.g. Metformin 500mg" /></div>
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0' }}>
                <input type="checkbox" id="organDonor" checked={data.organDonor} onChange={e=>set('organDonor',e.target.checked)} />
                <label htmlFor="organDonor" style={{fontWeight:600}}>🫀 I am an organ donor</label>
              </div>
            </div>
            <div className="card">
              <div className="card-title">🚨 Emergency Contacts</div>
              <div className="form-row">
                <div className="form-group"><label>Contact 1 Name</label><input className="input" value={data.emergency1} onChange={e=>set('emergency1',e.target.value)} placeholder="Father / Spouse" /></div>
                <div className="form-group"><label>Phone</label><input className="input" value={data.emergency1Phone} onChange={e=>set('emergency1Phone',e.target.value)} placeholder="+91..." /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Contact 2 Name</label><input className="input" value={data.emergency2} onChange={e=>set('emergency2',e.target.value)} placeholder="Mother / Friend" /></div>
                <div className="form-group"><label>Phone</label><input className="input" value={data.emergency2Phone} onChange={e=>set('emergency2Phone',e.target.value)} placeholder="+91..." /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Doctor Name</label><input className="input" value={data.doctor} onChange={e=>set('doctor',e.target.value)} placeholder="Dr. Name" /></div>
                <div className="form-group"><label>Doctor Phone</label><input className="input" value={data.doctorPhone} onChange={e=>set('doctorPhone',e.target.value)} placeholder="+91..." /></div>
              </div>
              <button className="btn btn-primary w-full" onClick={handleSave}>💾 Save Medical ID</button>
              {saved && <div className="alert alert-green mt-2">✅ Medical ID saved successfully!</div>}
            </div>
          </div>

          <div>
            {/* Medical ID Card Preview */}
            <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', color:'white', borderRadius:16, padding:24, marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div style={{ fontWeight:800, fontSize:18 }}>🪪 MEDICAL ID</div>
                {data.blood && <div style={{ background:'#ef4444', padding:'4px 16px', borderRadius:20, fontWeight:800 }}>🩸 {data.blood}</div>}
              </div>
              <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{data.name||'Your Name'}</div>
              {age && <div style={{ opacity:.7, marginBottom:16 }}>Age: {age} years</div>}
              {[['⚠️ Conditions', data.conditions],['🚫 Allergies', data.allergies],['💊 Medications', data.medications]].map(([label,val])=>val&&(
                <div key={label} style={{ background:'rgba(255,255,255,.08)', borderRadius:8, padding:'10px 14px', marginBottom:8 }}>
                  <div style={{ fontSize:11, opacity:.6, marginBottom:2 }}>{label}</div>
                  <div style={{ fontWeight:600 }}>{val}</div>
                </div>
              ))}
              {(data.emergency1||data.emergency2) && (
                <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,.15)' }}>
                  <div style={{ fontSize:11, opacity:.6, marginBottom:6 }}>🚨 EMERGENCY CONTACTS</div>
                  {data.emergency1 && <div>{data.emergency1}: {data.emergency1Phone}</div>}
                  {data.emergency2 && <div>{data.emergency2}: {data.emergency2Phone}</div>}
                </div>
              )}
              {data.organDonor && <div style={{ marginTop:10, background:'rgba(34,197,94,.2)', padding:'6px 12px', borderRadius:8, fontSize:13, fontWeight:600 }}>🫀 ORGAN DONOR</div>}
            </div>

            {/* Lock Screen Preview */}
            <div style={{ background:'linear-gradient(135deg,#1e3a5f,#0f172a)', color:'white', borderRadius:16, padding:24, textAlign:'center' }}>
              <div style={{ fontSize:11, opacity:.6, marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>Lock Screen Preview</div>
              <div style={{ fontSize:36, fontWeight:800, fontFamily:'monospace', marginBottom:4 }}>{new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
              <div style={{ opacity:.5, fontSize:13, marginBottom:20 }}>Emergency Medical Information</div>
              {data.name && <div style={{ background:'rgba(255,255,255,.1)', borderRadius:10, padding:'12px 16px', textAlign:'left' }}>
                <div style={{ fontWeight:700, marginBottom:4 }}>👤 {data.name} {data.blood&&`· 🩸 ${data.blood}`}</div>
                {data.allergies && <div style={{ fontSize:12, opacity:.8 }}>⚠️ Allergies: {data.allergies}</div>}
                {data.emergency1 && <div style={{ fontSize:12, opacity:.8 }}>📞 {data.emergency1}: {data.emergency1Phone}</div>}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
