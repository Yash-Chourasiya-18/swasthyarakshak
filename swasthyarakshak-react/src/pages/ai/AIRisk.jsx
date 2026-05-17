import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadData } from '../../utils/storage';

export default function AIRisk() {
  const bpData = loadData('bp_readings');
  const sugarData = loadData('sugar_readings');
  const bmiData = loadData('bmi_logs');
  const sleepData = loadData('sleep_logs');
  const stepsData = loadData('activities');

  const avgBP = bpData.length ? Math.round(bpData.slice(0,7).reduce((a,r)=>a+r.sys,0)/Math.min(bpData.length,7)) : null;
  const avgSugar = sugarData.length ? Math.round(sugarData.slice(0,7).reduce((a,r)=>a+r.val,0)/Math.min(sugarData.length,7)) : null;
  const latestBMI = bmiData[0]?.bmi || null;
  const avgSleep = sleepData.length ? (sleepData.slice(0,7).reduce((a,r)=>a+(r.hours||0),0)/Math.min(sleepData.length,7)).toFixed(1) : null;
  const avgSteps = stepsData.length ? Math.round(stepsData.slice(0,7).reduce((a,r)=>a+(r.steps||0),0)/Math.min(stepsData.length,7)) : null;

  const [form, setForm] = useState({ age:'', smoke:'no', alcohol:'no', family:'no', stress:'5', gender:'male' });
  const [result, setResult] = useState(null);

  function assess() {
    let score = 0; const risks = []; const suggestions = [];
    const age = +form.age || 35;
    if (age > 45) { score += 15; risks.push('Age > 45: Increased cardiovascular risk'); }
    if (avgBP > 140) { score += 25; risks.push(`High BP avg: ${avgBP} mmHg`); suggestions.push('Reduce salt, exercise daily, consult cardiologist'); }
    else if (avgBP > 130) { score += 12; risks.push(`Elevated BP: ${avgBP} mmHg`); suggestions.push('Monitor BP daily, reduce stress'); }
    if (avgSugar > 140) { score += 25; risks.push(`High sugar avg: ${avgSugar} mg/dL`); suggestions.push('Diabetic diet, consult endocrinologist, check HbA1c'); }
    else if (avgSugar > 110) { score += 12; risks.push(`Pre-diabetic sugar: ${avgSugar} mg/dL`); suggestions.push('Low-carb diet, increase activity'); }
    if (latestBMI > 30) { score += 20; risks.push(`Obese: BMI ${latestBMI}`); suggestions.push('Calorie deficit diet + 30 min exercise daily'); }
    else if (latestBMI > 25) { score += 10; risks.push(`Overweight: BMI ${latestBMI}`); suggestions.push('Increase physical activity'); }
    if (+avgSleep < 6) { score += 15; risks.push(`Poor sleep: ${avgSleep}h/night`); suggestions.push('Sleep hygiene — fixed schedule, no screen 1h before bed'); }
    if (+avgSteps < 5000) { score += 10; risks.push(`Low activity: ${avgSteps} steps/day`); suggestions.push('Target 8,000+ steps daily'); }
    if (form.smoke === 'yes') { score += 20; risks.push('Smoker'); suggestions.push('Quit smoking — consult nicotine replacement therapy'); }
    if (form.alcohol === 'yes') { score += 10; risks.push('Regular alcohol'); suggestions.push('Limit to <2 units/week'); }
    if (form.family === 'yes') { score += 15; risks.push('Family history of heart disease/diabetes'); suggestions.push('Annual full-body checkup, proactive monitoring'); }
    if (+form.stress > 7) { score += 10; risks.push(`High stress: ${form.stress}/10`); suggestions.push('Meditation, yoga, counseling'); }
    const final = Math.min(100, score);
    const level = final < 20 ? 'Low Risk 🟢' : final < 40 ? 'Moderate Risk 🟡' : final < 60 ? 'High Risk 🟠' : 'Very High Risk 🔴';
    const color = final < 20 ? '#166534' : final < 40 ? '#92400e' : final < 60 ? '#c2410c' : '#991b1b';
    const bg = final < 20 ? '#dcfce7' : final < 40 ? '#fef3c7' : final < 60 ? '#ffedd5' : '#fee2e2';
    setResult({ score:final, level, color, bg, risks, suggestions });
  }

  const hasData = avgBP || avgSugar || latestBMI;

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🤖 Disease Risk Assessment</h1><p className="page-sub">Vitals-based health risk scoring</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-yellow">⚠️ Rule-based estimate only — NOT a medical diagnosis. Consult a doctor for proper evaluation.</div>

        {hasData && (
          <div className="stats-row">
            {avgBP&&<div className="stat-card blue"><div className="stat-icon">❤️</div><div className="stat-val">{avgBP}</div><div className="stat-lbl">Avg BP (sys)</div></div>}
            {avgSugar&&<div className="stat-card red"><div className="stat-icon">🩸</div><div className="stat-val">{avgSugar}</div><div className="stat-lbl">Avg Sugar</div></div>}
            {latestBMI&&<div className="stat-card yellow"><div className="stat-icon">⚖️</div><div className="stat-val">{latestBMI}</div><div className="stat-lbl">BMI</div></div>}
            {avgSleep&&<div className="stat-card purple"><div className="stat-icon">😴</div><div className="stat-val">{avgSleep}h</div><div className="stat-lbl">Avg Sleep</div></div>}
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <div className="card-title">📋 Add More Info for Better Assessment</div>
            <div className="form-row">
              <div className="form-group"><label>Your Age</label><input className="input" type="number" value={form.age} onChange={e=>setForm(p=>({...p,age:e.target.value}))} placeholder="35" /></div>
              <div className="form-group"><label>Gender</label>
                <select className="input" value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))}>
                  <option value="male">Male</option><option value="female">Female</option>
                </select>
              </div>
            </div>
            {[['smoke','🚬 Do you smoke?'],['alcohol','🍺 Regular alcohol?'],['family','👨‍👩‍👧 Family history of heart disease or diabetes?']].map(([key,label])=>(
              <div key={key} className="form-group">
                <label>{label}</label>
                <div style={{display:'flex',gap:8,marginTop:6}}>
                  {['yes','no'].map(v=><span key={v} className={`tag ${form[key]===v?'selected':''}`} onClick={()=>setForm(p=>({...p,[key]:v}))}>{v==='yes'?'✅ Yes':'❌ No'}</span>)}
                </div>
              </div>
            ))}
            <div className="form-group">
              <label>Stress Level: <strong>{form.stress}/10</strong></label>
              <input type="range" min="1" max="10" value={form.stress} onChange={e=>setForm(p=>({...p,stress:e.target.value}))} style={{width:'100%'}} />
            </div>
            {!hasData && <div className="alert alert-blue">💡 Log BP, Sugar or BMI for more accurate assessment.</div>}
            <button className="btn btn-primary w-full" onClick={assess}>🤖 Assess My Risk</button>
          </div>

          <div className="card">
            <div className="card-title">📊 Risk Assessment Result</div>
            {!result && <p className="muted text-sm">Fill the form and click "Assess My Risk" to see your health risk score.</p>}
            {result && (
              <>
                <div style={{ textAlign:'center', marginBottom:20 }}>
                  <div style={{ fontSize:56, fontWeight:800, color:result.color }}>{result.score}</div>
                  <div style={{ background:result.bg, color:result.color, padding:'6px 20px', borderRadius:20, fontWeight:700, display:'inline-block', marginBottom:8 }}>{result.level}</div>
                  <div style={{ background:'#f1f5f9', borderRadius:20, height:12, margin:'8px 0' }}>
                    <div style={{ background:result.color, height:'100%', borderRadius:20, width:`${result.score}%`, transition:'.5s' }}></div>
                  </div>
                </div>
                {result.risks.length>0&&<div className="card-title" style={{fontSize:13}}>⚠️ Risk Factors Detected</div>}
                {result.risks.map((r,i)=><div key={i} style={{display:'flex',gap:8,padding:'5px 0',fontSize:12}}><span>⚠️</span><span style={{color:'#991b1b'}}>{r}</span></div>)}
                {result.suggestions.length>0&&<><div className="divider"/><div className="card-title" style={{fontSize:13}}>✅ Recommendations</div>{result.suggestions.map((s,i)=><div key={i} style={{display:'flex',gap:8,padding:'5px 0',fontSize:12}}><span>✅</span><span>{s}</span></div>)}</>}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
