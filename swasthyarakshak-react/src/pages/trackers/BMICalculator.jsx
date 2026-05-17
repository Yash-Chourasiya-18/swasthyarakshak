import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState('1.2');
  const [logs, setLogs] = useState(loadData('bmi_logs'));

  const bmi = height && weight ? +(weight / ((height/100)**2)).toFixed(1) : null;
  const getBMICat = b => {
    if (!b) return null;
    if (b < 18.5) return { cat:'Underweight', color:'#1e40af', bg:'#dbeafe' };
    if (b < 25) return { cat:'Normal ✅', color:'#166534', bg:'#dcfce7' };
    if (b < 30) return { cat:'Overweight ⚠️', color:'#92400e', bg:'#fef3c7' };
    if (b < 35) return { cat:'Obese I 🔴', color:'#991b1b', bg:'#fee2e2' };
    return { cat:'Obese II 🚨', color:'#7f1d1d', bg:'#fecaca' };
  };
  const cat = getBMICat(bmi);
  const bmr = height && weight && age ? Math.round(10*+weight + 6.25*+height - 5*+age + 5) : null;
  const tdee = bmr ? Math.round(bmr * +activity) : null;
  const idealMin = height ? +(18.5 * (height/100)**2).toFixed(1) : null;
  const idealMax = height ? +(24.9 * (height/100)**2).toFixed(1) : null;
  const bfp = bmi && age ? Math.round(1.2*bmi + 0.23*+age - 5.4) : null;

  function handleSave() {
    if (!bmi) return alert('Height aur Weight enter karo.');
    const newData = saveData('bmi_logs', { height:+height, weight:+weight, bmi, cat:cat?.cat });
    setLogs(newData);
  }

  const pct = bmi ? Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100)) : 50;

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">⚖️ BMI Calculator</h1><p className="page-sub">Body Mass Index + full health analysis</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="grid-2">
          <div className="card">
            <div className="card-title">📏 Enter Your Measurements</div>
            <div className="form-row">
              <div className="form-group"><label>Height (cm)</label><input className="input" type="number" placeholder="e.g. 170" value={height} onChange={e=>setHeight(e.target.value)} /></div>
              <div className="form-group"><label>Weight (kg)</label><input className="input" type="number" placeholder="e.g. 70" value={weight} onChange={e=>setWeight(e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Age (years)</label><input className="input" type="number" placeholder="e.g. 25" value={age} onChange={e=>setAge(e.target.value)} /></div>
              <div className="form-group"><label>Activity Level</label>
                <select className="input" value={activity} onChange={e=>setActivity(e.target.value)}>
                  <option value="1.2">Sedentary (no exercise)</option>
                  <option value="1.375">Light (1–3 days/week)</option>
                  <option value="1.55">Moderate (3–5 days)</option>
                  <option value="1.725">Active (6–7 days)</option>
                  <option value="1.9">Very Active (twice/day)</option>
                </select>
              </div>
            </div>

            {bmi && cat && (
              <div style={{ textAlign:'center', marginBottom:16 }}>
                <div style={{ fontSize:56, fontWeight:800, color:cat.color }}>{bmi}</div>
                <div style={{ background:cat.bg, color:cat.color, padding:'6px 20px', borderRadius:20, fontWeight:700, display:'inline-block', marginBottom:12 }}>{cat.cat}</div>
                <div style={{ background:'linear-gradient(to right,#1e40af,#22c55e,#f59e0b,#ef4444)', borderRadius:20, height:14, position:'relative', marginBottom:8 }}>
                  <div style={{ position:'absolute', left:`${pct}%`, top:'50%', transform:'translate(-50%,-50%)', background:'white', border:'3px solid #1e293b', borderRadius:'50%', width:20, height:20 }}></div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#64748b' }}>
                  <span>Underweight (&lt;18.5)</span><span>Normal</span><span>Overweight</span><span>Obese (&gt;30)</span>
                </div>
              </div>
            )}

            <button className="btn btn-primary w-full" onClick={handleSave}>💾 Save BMI Log</button>

            {bmi && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:16 }}>
                <div className="stat-card green"><div className="stat-icon">🔥</div><div className="stat-val">{bmr||'–'}</div><div className="stat-lbl">BMR (kcal)</div></div>
                <div className="stat-card blue"><div className="stat-icon">⚡</div><div className="stat-val">{tdee||'–'}</div><div className="stat-lbl">TDEE (kcal)</div></div>
                <div className="stat-card yellow"><div className="stat-icon">⚖️</div><div className="stat-val">{idealMin}–{idealMax}kg</div><div className="stat-lbl">Ideal Weight</div></div>
                <div className="stat-card purple"><div className="stat-icon">🧬</div><div className="stat-val">{bfp||'–'}%</div><div className="stat-lbl">Body Fat %</div></div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">📋 BMI History</div>
            {logs.length === 0 && <p className="muted text-sm">No logs yet.</p>}
            {logs.slice(0,8).map((l,i) => {
              const c = getBMICat(l.bmi);
              return (
                <div key={i} className="list-item">
                  <span style={{fontSize:22}}>⚖️</span>
                  <div style={{flex:1}}><div className="fw-6">BMI: {l.bmi} · {l.weight}kg / {l.height}cm</div><div className="muted text-sm">{l.time}</div></div>
                  <span className="badge" style={{background:c?.bg,color:c?.color}}>{c?.cat?.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
