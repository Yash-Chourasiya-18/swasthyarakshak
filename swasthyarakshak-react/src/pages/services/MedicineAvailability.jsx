import { useState } from 'react';
import { Link } from 'react-router-dom';

const PHARMACIES = [
  { name:'Apollo Pharmacy', address:'Sector 10, Rohini', phone:'9999111001', dist:'0.8 km', stock:{ Paracetamol:true, Metformin:true, Aspirin:true, Amoxicillin:true, Atorvastatin:false } },
  { name:'MedPlus', address:'Pitampura Market', phone:'9999111002', dist:'1.4 km', stock:{ Paracetamol:true, Metformin:false, Aspirin:true, Amoxicillin:true, Atorvastatin:true } },
  { name:'Jan Aushadhi Kendra', address:'Near PHC, Rohini', phone:'9999111003', dist:'1.8 km', stock:{ Paracetamol:true, Metformin:true, Aspirin:true, Amoxicillin:false, Atorvastatin:true } },
  { name:'1mg Pharmacy', address:'Online Delivery', phone:'1800-108-8908', dist:'Delivery', stock:{ Paracetamol:true, Metformin:true, Aspirin:true, Amoxicillin:true, Atorvastatin:true } },
];

const ALL_MEDS = ['Paracetamol','Metformin','Aspirin','Amoxicillin','Atorvastatin','Ibuprofen','Azithromycin','Omeprazole','Amlodipine','Losartan'];

export default function MedicineAvailability() {
  const [search, setSearch] = useState('Paracetamol');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  function checkAvailability() {
    if (!search) return alert('Medicine name enter karo.');
    const res = PHARMACIES.map(p => ({ ...p, available: p.stock[search] !== undefined ? p.stock[search] : Math.random() > 0.3 }));
    setResults(res); setSearched(true);
  }

  const available = results.filter(r=>r.available).length;

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🏪 Medicine Availability</h1><p className="page-sub">Nearby pharmacy stock checker</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="card mb-4">
          <div className="card-title">🔍 Search Medicine</div>
          <div className="form-row">
            <div className="form-group"><label>Medicine Name</label>
              <select className="input" value={search} onChange={e=>setSearch(e.target.value)}>
                {ALL_MEDS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Your Location</label>
              <input className="input" defaultValue="Rohini, Delhi" placeholder="Enter area/pincode" />
            </div>
          </div>
          <button className="btn btn-primary w-full" onClick={checkAvailability}>🔍 Check Availability</button>
        </div>

        {searched && (
          <>
            <div className="stats-row">
              <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-val">{available}</div><div className="stat-lbl">Pharmacies with Stock</div></div>
              <div className="stat-card red"><div className="stat-icon">❌</div><div className="stat-val">{results.length-available}</div><div className="stat-lbl">Out of Stock</div></div>
              <div className="stat-card blue"><div className="stat-icon">🏪</div><div className="stat-val">{results.length}</div><div className="stat-lbl">Pharmacies Checked</div></div>
            </div>

            {available===0 && <div className="alert alert-red">❌ {search} not available nearby. Try online delivery or ask doctor for alternative.</div>}

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
              {results.map((r,i)=>(
                <div key={i} style={{border:`2px solid ${r.available?'#86efac':'#fca5a5'}`,borderRadius:12,padding:16,background:r.available?'#f0fdf4':'#fff5f5'}}>
                  <div className="flex-between" style={{marginBottom:8}}>
                    <div style={{fontWeight:700,fontSize:15}}>{r.name}</div>
                    <span style={{background:r.available?'#dcfce7':'#fee2e2',color:r.available?'#166534':'#991b1b',padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:700}}>
                      {r.available?'✅ In Stock':'❌ Out of Stock'}
                    </span>
                  </div>
                  <div className="muted text-sm" style={{marginBottom:8}}>📍 {r.address} · {r.dist}</div>
                  <div style={{display:'flex',gap:8}}>
                    <a href={`tel:${r.phone}`} className="btn btn-sm btn-outline" style={{flex:1}}>📞 Call</a>
                    {r.available&&<button className="btn btn-sm btn-primary" style={{flex:1}} onClick={()=>alert(`Opening directions to ${r.name}...`)}>📍 Directions</button>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="card mt-4">
          <div className="card-title">💡 Can't Find the Medicine?</div>
          {[['🏥','Ask at government hospital pharmacy — often has generic alternatives'],['💊','Jan Aushadhi Kendras have 1,900+ generic medicines at 50-90% lower price'],['📱','Order online from 1mg or PharmEasy with next-day delivery'],['👨‍⚕️','Ask your doctor for a substitute/generic alternative']].map(([icon,tip])=>(
            <div key={tip} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid #f1f5f9',fontSize:13}}>
              <span style={{fontSize:20}}>{icon}</span><span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
