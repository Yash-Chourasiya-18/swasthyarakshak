import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const TESTS = [
  { id:'cbc', name:'Complete Blood Count (CBC)', price:299, params:['Hemoglobin','WBC','RBC','Platelets','Hematocrit'] },
  { id:'lipid', name:'Lipid Profile', price:399, params:['Total Cholesterol','HDL','LDL','Triglycerides','VLDL'] },
  { id:'sugar', name:'Blood Glucose (Fasting)', price:99, params:['Fasting Glucose','HbA1c'] },
  { id:'thyroid', name:'Thyroid Profile (TSH+T3+T4)', price:599, params:['TSH','T3','T4','Free T4'] },
  { id:'lft', name:'Liver Function Test (LFT)', price:499, params:['SGPT','SGOT','Bilirubin','Albumin','ALP'] },
  { id:'kft', name:'Kidney Function Test (KFT)', price:499, params:['Creatinine','BUN','Uric Acid','eGFR'] },
  { id:'vitamin', name:'Vitamin D + B12', price:799, params:['25-OH Vitamin D','Vitamin B12','Folate'] },
  { id:'full', name:'Full Body Checkup', price:999, params:['CBC','Lipid','LFT','KFT','Thyroid','Blood Sugar','Urine'] },
];

const LABS = [
  { name:'Thyrocare', rating:4.5, homeCollection:true, discount:20 },
  { name:'Lal Path Labs', rating:4.3, homeCollection:true, discount:10 },
  { name:'SRL Diagnostics', rating:4.4, homeCollection:true, discount:15 },
];

const STEPS = ['Select Tests', 'Choose Lab', 'Schedule', 'Confirm'];

export default function LabBooking() {
  const [step, setStep] = useState(0);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [homeCollection, setHomeCollection] = useState(true);
  const [address, setAddress] = useState('');
  const [bookings, setBookings] = useState(loadData('lab_bookings'));

  function toggleTest(t) { setSelectedTests(prev => prev.find(x=>x.id===t.id) ? prev.filter(x=>x.id!==t.id) : [...prev,t]); }
  const total = selectedTests.reduce((a,t)=>a+t.price,0);

  function confirm() {
    if (!date || !slot) return alert('Date aur time slot select karo.');
    const newData = saveData('lab_bookings', { tests:selectedTests.map(t=>t.name), lab:selectedLab?.name, date, slot, homeCollection, total });
    setBookings(newData);
    setStep(3);
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🧪 Lab Test Booking</h1><p className="page-sub">Book blood tests from home</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        {/* Progress */}
        <div style={{display:'flex',gap:0,marginBottom:24}}>
          {STEPS.map((s,i)=>(
            <div key={s} style={{flex:1,textAlign:'center',position:'relative'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:i<=step?'#0ea5e9':'#e2e8f0',color:i<=step?'white':'#94a3b8',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 4px',fontWeight:700,fontSize:13}}>{i+1}</div>
              <div style={{fontSize:11,color:i<=step?'#0ea5e9':'#94a3b8'}}>{s}</div>
              {i<3&&<div style={{position:'absolute',top:16,left:'50%',width:'100%',height:2,background:i<step?'#0ea5e9':'#e2e8f0',zIndex:-1}}></div>}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="card">
            <div className="card-title">🧪 Select Tests ({selectedTests.length} selected)</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
              {TESTS.map(t => {
                const sel = selectedTests.find(x=>x.id===t.id);
                return (
                  <div key={t.id} onClick={()=>toggleTest(t)} style={{border:`2px solid ${sel?'#0ea5e9':'#e2e8f0'}`,background:sel?'#e0f2fe':'white',borderRadius:10,padding:14,cursor:'pointer',transition:'.2s'}}>
                    <div className="flex-between"><span className="fw-7">{t.name}</span><span style={{color:'#0ea5e9',fontWeight:800}}>₹{t.price}</span></div>
                    <div className="muted text-xs" style={{marginTop:4}}>{t.params.join(' · ')}</div>
                  </div>
                );
              })}
            </div>
            {selectedTests.length > 0 && (
              <div style={{marginTop:16,padding:'12px 16px',background:'#e0f2fe',borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span><strong>{selectedTests.length}</strong> tests selected · Total: <strong>₹{total}</strong></span>
                <button className="btn btn-primary" onClick={()=>setStep(1)}>Choose Lab →</button>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="card">
            <div className="card-title">🏥 Choose Lab</div>
            {LABS.map(l => (
              <div key={l.name} onClick={()=>setSelectedLab(l)} style={{border:`2px solid ${selectedLab?.name===l.name?'#0ea5e9':'#e2e8f0'}`,background:selectedLab?.name===l.name?'#e0f2fe':'white',borderRadius:10,padding:16,cursor:'pointer',marginBottom:10,transition:'.2s'}}>
                <div className="flex-between">
                  <div><div className="fw-7 text-md">{l.name}</div><div className="muted text-sm">⭐ {l.rating} · {l.homeCollection?'Home Collection Available':'Lab Visit Only'}</div></div>
                  <div style={{textAlign:'right'}}><div style={{color:'#22c55e',fontWeight:700}}>{l.discount}% OFF</div><div className="muted text-xs">on all tests</div></div>
                </div>
              </div>
            ))}
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button className="btn btn-outline" onClick={()=>setStep(0)}>← Back</button>
              <button className="btn btn-primary" style={{flex:1}} onClick={()=>selectedLab&&setStep(2)} disabled={!selectedLab}>Schedule →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="card-title">📅 Schedule Your Test</div>
            <div style={{display:'flex',gap:10,marginBottom:14}}>
              <button className={`btn ${homeCollection?'btn-primary':'btn-outline'}`} onClick={()=>setHomeCollection(true)}>🏠 Home Collection</button>
              <button className={`btn ${!homeCollection?'btn-primary':'btn-outline'}`} onClick={()=>setHomeCollection(false)}>🏥 Visit Lab</button>
            </div>
            {homeCollection && <div className="form-group"><label>Your Address</label><textarea className="input" rows={2} value={address} onChange={e=>setAddress(e.target.value)} placeholder="Enter full address with pincode" /></div>}
            <div className="form-row">
              <div className="form-group"><label>Date</label><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} /></div>
              <div className="form-group"><label>Time Slot</label>
                <select className="input" value={slot} onChange={e=>setSlot(e.target.value)}>
                  <option value="">Select slot</option>
                  {['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM'].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{background:'#f8fafc',borderRadius:10,padding:14,marginBottom:14}}>
              <div className="fw-7" style={{marginBottom:6}}>Order Summary</div>
              {selectedTests.map(t=><div key={t.id} className="flex-between text-sm"><span>{t.name}</span><span>₹{t.price}</span></div>)}
              <div className="divider"></div>
              <div className="flex-between fw-7"><span>Total</span><span>₹{total}</span></div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn btn-primary" style={{flex:1}} onClick={confirm}>✅ Confirm Booking</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card" style={{textAlign:'center'}}>
            <div style={{fontSize:64,marginBottom:12}}>✅</div>
            <div style={{fontSize:22,fontWeight:800,marginBottom:8}}>Booking Confirmed!</div>
            <div className="muted" style={{marginBottom:20}}>Your lab tests have been booked successfully.</div>
            <div style={{background:'#f8fafc',borderRadius:10,padding:16,textAlign:'left',marginBottom:16}}>
              <div className="flex-between"><span>Lab:</span><span className="fw-6">{selectedLab?.name}</span></div>
              <div className="flex-between"><span>Date:</span><span className="fw-6">{date}</span></div>
              <div className="flex-between"><span>Time:</span><span className="fw-6">{slot}</span></div>
              <div className="flex-between"><span>Tests:</span><span className="fw-6">{selectedTests.length}</span></div>
              <div className="flex-between"><span>Total:</span><span className="fw-6 text-green">₹{total}</span></div>
            </div>
            <button className="btn btn-primary" onClick={()=>{setStep(0);setSelectedTests([]);setSelectedLab(null);setDate('');setSlot('');}}>+ Book Another Test</button>
          </div>
        )}

        {bookings.length > 0 && step !== 3 && (
          <div className="card">
            <div className="card-title">📋 Previous Bookings</div>
            {bookings.slice(0,5).map((b,i)=>(
              <div key={i} className="list-item">
                <span style={{fontSize:22}}>🧪</span>
                <div style={{flex:1}}><div className="fw-6">{b.lab} · {b.date} {b.slot}</div><div className="muted text-sm">{b.tests?.join(', ')}</div></div>
                <span className="badge green">₹{b.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
