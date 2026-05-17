import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function SymptomChecker() {
  const ALL_SYMPTOMS = ['Fever','Headache','Cough','Sore Throat','Body Pain','Fatigue','Shortness of Breath','Nausea','Vomiting','Diarrhea','Loss of Taste/Smell','Chest Pain','Sweating','Chills','Dizziness','Blurred Vision','Frequent Urination','Excessive Thirst','Weight Loss','Weight Gain','Joint Pain','Rash','Swelling','Runny Nose','Sneezing','Muscle Cramps','Palpitations','Abdominal Pain','Back Pain','Insomnia','Anxiety','Cold Extremities','Pale Skin','Night Sweats','Swollen Lymph Nodes','Loss of Appetite','Dark Urine','Yellow Eyes'];
  const CONDITIONS = [
    { name:'Common Cold / Flu', icon:'🤧', symptoms:['Fever','Headache','Cough','Sore Throat','Body Pain','Fatigue','Runny Nose','Sneezing'], severity:'mild', specialist:'General Physician', action:'Rest, fluids, Paracetamol' },
    { name:'COVID-19', icon:'🦠', symptoms:['Fever','Cough','Shortness of Breath','Loss of Taste/Smell','Fatigue','Body Pain','Headache','Sore Throat'], severity:'moderate', specialist:'Infectious Disease Specialist', action:'Isolate, RTPCR test, 108' },
    { name:'Diabetes', icon:'🩸', symptoms:['Frequent Urination','Excessive Thirst','Weight Loss','Fatigue','Blurred Vision','Dizziness'], severity:'moderate', specialist:'Endocrinologist', action:'Fasting glucose test, diet change' },
    { name:'Hypertension', icon:'❤️', symptoms:['Headache','Dizziness','Chest Pain','Palpitations','Blurred Vision','Fatigue'], severity:'moderate', specialist:'Cardiologist', action:'Check BP, reduce salt, medication' },
    { name:'Pneumonia', icon:'🫁', symptoms:['Fever','Cough','Shortness of Breath','Chest Pain','Fatigue','Chills','Sweating'], severity:'urgent', specialist:'Pulmonologist', action:'Chest X-ray, antibiotics, hospitalization' },
    { name:'Dengue', icon:'🦟', symptoms:['Fever','Headache','Body Pain','Rash','Fatigue','Nausea','Joint Pain'], severity:'urgent', specialist:'General Physician', action:'Blood test, fluids, hospitalization' },
    { name:'Thyroid Disorder', icon:'🦋', symptoms:['Fatigue','Weight Gain','Cold Extremities','Swelling','Anxiety','Palpitations','Insomnia'], severity:'moderate', specialist:'Endocrinologist', action:'Thyroid blood test (TSH,T3,T4)' },
    { name:'Malaria', icon:'🦟', symptoms:['Fever','Chills','Sweating','Headache','Body Pain','Nausea','Fatigue'], severity:'urgent', specialist:'General Physician', action:'Blood smear test, anti-malarials' },
    { name:'Heart Attack', icon:'💔', symptoms:['Chest Pain','Shortness of Breath','Sweating','Nausea','Dizziness','Palpitations','Back Pain'], severity:'critical', specialist:'Cardiologist', action:'CALL 108 IMMEDIATELY! Do not delay!' },
    { name:'Migraine', icon:'🤕', symptoms:['Headache','Nausea','Blurred Vision','Dizziness','Fatigue'], severity:'mild', specialist:'Neurologist', action:'Rest in dark room, Ibuprofen, hydration' },
  ];

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [checked, setChecked] = useState(false);

  const filtered = ALL_SYMPTOMS.filter(s => s.toLowerCase().includes(search.toLowerCase()) && !selected.includes(s));

  function toggle(s) { setSelected(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev,s]); }

  function checkSymptoms() {
    if (selected.length === 0) return alert('Kam se kam ek symptom select karo.');
    const res = CONDITIONS.map(c => {
      const matched = c.symptoms.filter(s => selected.includes(s));
      const pct = Math.round((matched.length / c.symptoms.length) * 100);
      return { ...c, matched, pct };
    }).filter(r => r.pct > 0).sort((a,b) => b.pct - a.pct);
    setResults(res); setChecked(true);
  }

  const sevColor = { mild:'#dcfce7', moderate:'#fef3c7', urgent:'#fee2e2', critical:'#fecaca' };
  const sevText = { mild:'#166534', moderate:'#92400e', urgent:'#991b1b', critical:'#7f1d1d' };

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🔍 Symptom Checker</h1><p className="page-sub">Select symptoms to get possible condition estimates</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-yellow">⚠️ This is NOT a medical diagnosis. Always consult a certified doctor for proper treatment.</div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">🩺 Select Your Symptoms ({selected.length} selected)</div>
            <input className="input mb-3" placeholder="🔍 Search symptom..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12}} />
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
              {filtered.slice(0,20).map(s => <span key={s} className="tag" onClick={()=>toggle(s)}>{s}</span>)}
            </div>
            {selected.length > 0 && (
              <div>
                <div className="card-title" style={{fontSize:13}}>✅ Selected Symptoms:</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {selected.map(s => <span key={s} className="tag selected" onClick={()=>toggle(s)}>{s} ✕</span>)}
                </div>
              </div>
            )}
            <button className="btn btn-primary w-full mt-3" onClick={checkSymptoms}>🔍 Check Symptoms</button>
            {selected.length > 0 && <button className="btn btn-outline w-full mt-2" onClick={()=>{setSelected([]);setResults([]);setChecked(false);}}>🗑️ Clear All</button>}
          </div>

          <div className="card">
            <div className="card-title">📊 Possible Conditions</div>
            {!checked && <p className="muted text-sm">Select symptoms and click "Check Symptoms" to see results.</p>}
            {checked && results.length === 0 && <p className="muted text-sm">No matching conditions found. Please consult a doctor.</p>}
            {results.slice(0,5).map((r,i) => (
              <div key={i} style={{ border:`1px solid ${r.severity==='critical'?'#fca5a5':'#e2e8f0'}`, borderRadius:10, padding:14, marginBottom:10 }}>
                <div className="flex-between" style={{marginBottom:8}}>
                  <div style={{fontWeight:700}}>{r.icon} {r.name}</div>
                  <div style={{ background:sevColor[r.severity], color:sevText[r.severity], padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700, textTransform:'uppercase' }}>{r.severity}</div>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:8, height:8, marginBottom:6 }}>
                  <div style={{ background:r.pct>70?'#ef4444':r.pct>40?'#f59e0b':'#22c55e', height:'100%', borderRadius:8, width:`${r.pct}%` }}></div>
                </div>
                <div style={{fontSize:12,color:'#64748b',marginBottom:6}}>Match: {r.pct}% · Matched: {r.matched.join(', ')}</div>
                <div style={{fontSize:12}}><strong>Specialist:</strong> {r.specialist}</div>
                <div style={{fontSize:12}}><strong>Action:</strong> {r.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
