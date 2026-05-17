import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const DONORS = [
  { name:'Rahul Sharma', blood:'O+', city:'Delhi', phone:'9876543210', dist:'1.2 km', lastDonated:'3 months ago' },
  { name:'Priya Verma', blood:'A+', city:'Delhi', phone:'9876543211', dist:'2.1 km', lastDonated:'6 months ago' },
  { name:'Amit Kumar', blood:'B+', city:'Delhi', phone:'9876543212', dist:'3.4 km', lastDonated:'5 months ago' },
  { name:'Sunita Singh', blood:'AB+', city:'Delhi', phone:'9876543213', dist:'1.8 km', lastDonated:'4 months ago' },
  { name:'Vikram Patel', blood:'O-', city:'Delhi', phone:'9876543214', dist:'5.0 km', lastDonated:'8 months ago' },
  { name:'Meena Rao', blood:'A-', city:'Delhi', phone:'9876543215', dist:'2.5 km', lastDonated:'2 months ago' },
];

const BLOOD_BANKS = [
  { name:'AIIMS Blood Bank', address:'Ansari Nagar, Delhi', phone:'011-26588500', available:['O+','A+','B+','AB+','O-'] },
  { name:'Red Cross Blood Bank', address:'1 Red Cross Road, Delhi', phone:'011-23716441', available:['A+','B+','O+','AB-'] },
];

export default function BloodDonor() {
  const [search, setSearch] = useState('O+');
  const [city, setCity] = useState('Delhi');
  const [results, setResults] = useState([]);
  const [showReg, setShowReg] = useState(false);
  const [form, setForm] = useState({ name:'', blood:'O+', city:'Delhi', phone:'' });

  function doSearch() { setResults(DONORS.filter(d => d.blood === search)); }

  function registerDonor() {
    if (!form.name || !form.phone) return alert('Name aur phone number enter karo.');
    saveData('blood_donors', form);
    alert(`✅ ${form.name} registered as ${form.blood} donor!\nYou may be contacted in emergencies. Thank you! 🩸`);
    setShowReg(false); setForm({ name:'', blood:'O+', city:'Delhi', phone:'' });
  }

  function sendSOS() {
    alert('🚨 Emergency SOS sent to all O+ donors within 10km!\n\n• 8 donors notified via SMS\n• 3 donors available immediately\n• Nearest donor: Rahul Sharma (1.2 km)');
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🩸 Blood Donor Network</h1><p className="page-sub">Emergency blood donor finder</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div style={{background:'linear-gradient(135deg,#dc2626,#991b1b)',color:'white',borderRadius:16,padding:24,marginBottom:16}}>
          <div style={{fontSize:18,fontWeight:800,marginBottom:8}}>🚨 Blood Emergency SOS</div>
          <div style={{opacity:.9,marginBottom:16}}>Critical blood requirement? Alert all nearby donors instantly.</div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(b=><button key={b} onClick={()=>{setSearch(b);sendSOS();}} style={{padding:'8px 16px',background:'rgba(255,255,255,.2)',border:'2px solid rgba(255,255,255,.4)',color:'white',borderRadius:8,cursor:'pointer',fontWeight:700}}>{b}</button>)}
          </div>
        </div>

        <div className="grid-2">
          <div>
            <div className="card mb-4">
              <div className="card-title">🔍 Find Donors</div>
              <div className="form-row">
                <div className="form-group"><label>Blood Group Needed</label>
                  <select className="input" value={search} onChange={e=>setSearch(e.target.value)}>
                    {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>City</label><input className="input" value={city} onChange={e=>setCity(e.target.value)} /></div>
              </div>
              <button className="btn btn-danger w-full" onClick={doSearch}>🔍 Search Donors</button>

              {results.length > 0 && results.map((d,i)=>(
                <div key={i} className="list-item">
                  <div style={{width:40,height:40,borderRadius:'50%',background:'#fee2e2',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#dc2626',fontSize:13,flexShrink:0}}>{d.blood}</div>
                  <div style={{flex:1}}><div className="fw-6">{d.name}</div><div className="muted text-sm">📍 {d.dist} · Last donated: {d.lastDonated}</div></div>
                  <a href={`tel:${d.phone}`} className="btn btn-sm btn-danger">📞 Call</a>
                </div>
              ))}
              {results.length === 0 && <p className="muted text-sm mt-2">Search karo to donors dekhne ke liye.</p>}
            </div>

            <div className="card">
              <div className="card-title">🏥 Nearby Blood Banks</div>
              {BLOOD_BANKS.map((b,i)=>(
                <div key={i} style={{border:'1px solid #e2e8f0',borderRadius:10,padding:14,marginBottom:10}}>
                  <div className="fw-7">{b.name}</div>
                  <div className="muted text-sm">📍 {b.address}</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4,margin:'8px 0'}}>
                    {b.available.map(bl=><span key={bl} style={{background:'#fee2e2',color:'#991b1b',padding:'2px 8px',borderRadius:12,fontSize:11,fontWeight:700}}>{bl}</span>)}
                  </div>
                  <a href={`tel:${b.phone}`} className="btn btn-sm btn-outline">📞 {b.phone}</a>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">❤️ Become a Blood Donor</div>
            <div className="alert alert-blue" style={{marginBottom:14}}>One blood donation can save up to 3 lives! 🩸</div>
            <button className="btn btn-danger w-full mb-4" onClick={()=>setShowReg(!showReg)}>
              {showReg ? '✕ Cancel' : '+ Register as Donor'}
            </button>
            {showReg && (
              <div>
                <div className="form-group"><label>Full Name</label><input className="input" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your name" /></div>
                <div className="form-row">
                  <div className="form-group"><label>Blood Group</label>
                    <select className="input" value={form.blood} onChange={e=>setForm(p=>({...p,blood:e.target.value}))}>
                      {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>City</label><input className="input" value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} /></div>
                </div>
                <div className="form-group"><label>Phone Number</label><input className="input" type="tel" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 XXXXXXXXXX" /></div>
                <button className="btn btn-danger w-full" onClick={registerDonor}>🩸 Register as Donor</button>
              </div>
            )}

            <div className="divider"></div>
            <div className="card-title" style={{fontSize:13}}>📋 Donation Eligibility</div>
            {[['✅','Age 18–65 years'],['✅','Weight > 45 kg'],['✅','Hemoglobin ≥ 12.5 g/dL'],['✅','No fever or infection'],['✅','Gap of 3 months since last donation'],['❌','Pregnant or breastfeeding'],['❌','History of HIV, Hepatitis B/C']].map(([icon,text])=>(
              <div key={text} className="list-item" style={{padding:'6px 0'}}>
                <span>{icon}</span><span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
