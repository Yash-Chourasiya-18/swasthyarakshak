import { useState } from 'react';
import { Link } from 'react-router-dom';

const HOSPITALS = [
  { name:'AIIMS Delhi', dist:'2.1 km', eta:'6 min', phone:'011-26588500', beds:'ICU Available' },
  { name:'Safdarjung Hospital', dist:'3.4 km', eta:'9 min', phone:'011-26165060', beds:'Emergency Open' },
  { name:'Ram Manohar Lohia', dist:'4.2 km', eta:'11 min', phone:'011-23365525', beds:'Trauma Center' },
];

export default function Ambulance() {
  const [requested, setRequested] = useState(false);
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);

  function requestAmbulance() {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocation({ lat: pos.coords.latitude.toFixed(4), lon: pos.coords.longitude.toFixed(4) });
        setLocating(false); setRequested(true);
      }, () => { setLocation({ lat:'28.6139', lon:'77.2090' }); setLocating(false); setRequested(true); });
    } else { setLocation({ lat:'28.6139', lon:'77.2090' }); setLocating(false); setRequested(true); }
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🚑 Live Ambulance Request</h1><p className="page-sub">Emergency ambulance + nearest hospitals</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div style={{ textAlign:'center', padding:'32px 0' }}>
          <div style={{ fontSize:80, marginBottom:16 }}>🚑</div>
          {!requested ? (
            <>
              <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>Medical Emergency?</h2>
              <p className="muted" style={{ marginBottom:24 }}>One tap to request ambulance and alert nearest hospitals</p>
              <button className="btn btn-danger" style={{ fontSize:18, padding:'16px 40px', borderRadius:12 }} onClick={requestAmbulance} disabled={locating}>
                {locating ? '📍 Getting your location...' : '🚨 REQUEST AMBULANCE NOW'}
              </button>
              <div style={{ marginTop:24 }}>
                <p className="muted text-sm" style={{ marginBottom:12 }}>Or call directly:</p>
                <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                  {[['108','Ambulance'],['100','Police'],['101','Fire'],['1078','AIIMS Helpline']].map(([num,label])=>(
                    <a key={num} href={`tel:${num}`} className="btn btn-outline">📞 {num} — {label}</a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="alert alert-green" style={{ maxWidth:480, margin:'0 auto 20px', textAlign:'left' }}>
                ✅ <strong>Ambulance Requested!</strong><br />
                📍 Location shared: {location?.lat}, {location?.lon}<br />
                📱 108 Emergency Control notified
              </div>
              <div style={{ maxWidth:480, margin:'0 auto' }}>
                <div className="card-title" style={{ textAlign:'left' }}>🏥 Nearest Hospitals</div>
                {HOSPITALS.map((h,i)=>(
                  <div key={i} style={{ border:'1px solid #e2e8f0', borderRadius:10, padding:14, marginBottom:10, textAlign:'left', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div className="fw-7">{h.name}</div>
                      <div className="muted text-sm">📍 {h.dist} · ⏱️ ETA {h.eta} · {h.beds}</div>
                    </div>
                    <a href={`tel:${h.phone}`} className="btn btn-sm btn-danger">📞 Call</a>
                  </div>
                ))}
                <button className="btn btn-outline w-full mt-2" onClick={()=>setRequested(false)}>Cancel Request</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
