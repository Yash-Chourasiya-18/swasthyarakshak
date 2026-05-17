import { useState } from 'react';
import { Link } from 'react-router-dom';

const LANGUAGES = ['English','हिंदी','मराठी','भोजपुरी','ગુજરાતી','தமிழ்','తెలుగు','বাংলা','ਪੰਜਾਬੀ','ಕನ್ನಡ'];

export default function RuralMode() {
  const [lowData, setLowData] = useState(false);
  const [largeBtns, setLargeBtns] = useState(false);
  const [voiceNav, setVoiceNav] = useState(false);
  const [lang, setLang] = useState('हिंदी');
  const [offlineSync, setOfflineSync] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const PRESETS = [
    { name:'🌾 Rural Village', label:'Low data + Hindi + Large text', settings:{ lowData:true, largeBtns:true, voiceNav:false, lang:'हिंदी' } },
    { name:'🧓 Elderly Mode', label:'Large buttons + Voice nav + TTS', settings:{ lowData:false, largeBtns:true, voiceNav:true, lang:'हिंदी' } },
    { name:'📵 Offline-First', label:'Minimal data + offline storage', settings:{ lowData:true, largeBtns:false, voiceNav:false, lang:'हिंदी' } },
    { name:'👩‍⚕️ ASHA Mode', label:'Large buttons + Hindi + Low data', settings:{ lowData:true, largeBtns:true, voiceNav:true, lang:'हिंदी' } },
  ];

  function applyPreset(p) {
    setActivePreset(p.name);
    setLowData(p.settings.lowData);
    setLargeBtns(p.settings.largeBtns);
    setVoiceNav(p.settings.voiceNav);
    setLang(p.settings.lang);
    alert(`✅ Preset "${p.name}" applied!\n\n${p.label}`);
  }

  const ToggleSwitch = ({ value, onChange, label, icon, desc }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid #f1f5f9' }}>
      <div>
        <div style={{ fontWeight:600, fontSize:14 }}>{icon} {label}</div>
        <div className="muted text-sm">{desc}</div>
      </div>
      <div onClick={()=>onChange(!value)} style={{ width:50, height:26, borderRadius:13, background:value?'#0ea5e9':'#e2e8f0', position:'relative', cursor:'pointer', transition:'.3s' }}>
        <div style={{ position:'absolute', top:3, left:value?26:3, width:20, height:20, background:'white', borderRadius:'50%', transition:'.3s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}></div>
      </div>
    </div>
  );

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🌾 Rural India Mode</h1><p className="page-sub">Accessibility settings for rural & elderly users</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          {[['📶','Low Data Mode',lowData],['🔲','Large Buttons',largeBtns],['🎙️','Voice Nav',voiceNav],['💾','Offline Sync',offlineSync]].map(([icon,label,val])=>(
            <div key={label} className={`stat-card ${val?'green':'blue'}`}>
              <div className="stat-icon">{icon}</div>
              <div className="stat-val" style={{fontSize:14}}>{val?'ON':'OFF'}</div>
              <div className="stat-lbl">{label}</div>
            </div>
          ))}
        </div>

        {/* Presets */}
        <div className="card mb-4">
          <div className="card-title">⚡ Quick Presets</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10}}>
            {PRESETS.map(p=>(
              <div key={p.name} onClick={()=>applyPreset(p)} style={{ border:`2px solid ${activePreset===p.name?'#0ea5e9':'#e2e8f0'}`, background:activePreset===p.name?'#e0f2fe':'white', borderRadius:10, padding:14, cursor:'pointer', transition:'.2s' }}>
                <div className="fw-7" style={{marginBottom:4}}>{p.name}</div>
                <div className="muted text-sm">{p.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">⚙️ Individual Settings</div>
            <ToggleSwitch value={lowData} onChange={setLowData} icon="📶" label="Low Internet Mode" desc="Disable maps, compress images, minimal data usage" />
            <ToggleSwitch value={largeBtns} onChange={setLargeBtns} icon="🔲" label="One-Tap Large Buttons" desc="Giant buttons for easy touch, especially for elderly" />
            <ToggleSwitch value={voiceNav} onChange={setVoiceNav} icon="🎙️" label="Voice Navigation for Elderly" desc="Voice-guided page navigation in Hindi" />
            <ToggleSwitch value={offlineSync} onChange={setOfflineSync} icon="💾" label="Offline Report Storage" desc="Store all health data offline, sync when WiFi available" />

            <div className="form-group" style={{marginTop:14}}>
              <label>🌐 Language / भाषा</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>
                {LANGUAGES.map(l=><span key={l} className={`tag ${lang===l?'selected':''}`} onClick={()=>setLang(l)}>{l}</span>)}
              </div>
            </div>

            <button className="btn btn-primary w-full mt-3" onClick={()=>alert(`✅ Settings saved!\n\nLow Data: ${lowData?'ON':'OFF'}\nLarge Buttons: ${largeBtns?'ON':'OFF'}\nVoice Nav: ${voiceNav?'ON':'OFF'}\nLanguage: ${lang}`)}>
              💾 Save Settings
            </button>
          </div>

          <div>
            {/* Large Buttons Preview */}
            {largeBtns && (
              <div className="card mb-4">
                <div className="card-title">🔲 Large Button Preview</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {[['🚨','Emergency SOS','#ef4444'],['❤️','Check BP','#0ea5e9'],['💧','Water Log','#22c55e'],['💊','Medicines','#8b5cf6']].map(([icon,label,color])=>(
                    <button key={label} style={{ padding:'20px 10px', background:color, color:'white', border:'none', borderRadius:12, cursor:'pointer', fontSize:16, fontWeight:700, textAlign:'center' }}>
                      <div style={{fontSize:32,marginBottom:4}}>{icon}</div>{label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Health Camp Info */}
            <div className="card">
              <div className="card-title">🏕️ Rural Health Camps</div>
              {[
                { date:'May 22, 2026', location:'Rampur Village Hall', services:'BP, Sugar, Eye Check', dist:'1.2 km' },
                { date:'May 28, 2026', location:'Bareilly PHC Ground', services:'Vaccination, Dental, ANC', dist:'4.5 km' },
                { date:'Jun 5, 2026', location:'Najibabad Community Centre', services:'Full Body Checkup FREE', dist:'8 km' },
              ].map((camp,i)=>(
                <div key={i} style={{border:'1px solid #e2e8f0',borderRadius:10,padding:12,marginBottom:8}}>
                  <div className="flex-between">
                    <div><div className="fw-6">{camp.date}</div><div className="muted text-sm">📍 {camp.location} ({camp.dist})</div><div className="muted text-sm">🩺 {camp.services}</div></div>
                    <button className="btn btn-sm btn-primary" onClick={()=>alert(`✅ Registered for camp on ${camp.date}`)}>Register</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
