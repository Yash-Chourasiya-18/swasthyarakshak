import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function BMICalculator() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('48');
  const [age, setAge] = useState('18');
  const [gender, setGender] = useState('Male');
  const [activity, setActivity] = useState('Sedentary (desk job, no exercise)');
  const [logs, setLogs] = useState(() => {
    return loadData('bmi_logs') || [];
  });

  const [calculated, setCalculated] = useState(null);

  // Perform initial calculation on load if values are present
  useEffect(() => {
    if (height && weight && age) {
      calculateStats();
    }
  }, []);

  const getBMICat = (b) => {
    if (!b) return null;
    if (b < 18.5) return { label: 'Underweight', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', desc: 'You are underweight. Focus on nutrient-rich foods, protein, and healthy fats. Consult a nutritionist.' };
    if (b < 25) return { label: 'Normal', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', desc: 'You are in the normal BMI range. Maintain your healthy habits with balanced nutrition and exercise.' };
    if (b < 30) return { label: 'Overweight', color: '#b45309', bg: '#fffbeb', border: '#fde68a', desc: 'You are overweight. Focus on physical activity and portion-controlled meals.' };
    return { label: 'Obese', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca', desc: 'Your BMI is in the obese category. Consider speaking with a doctor or health provider.' };
  };

  const getTDEEMultiple = (act) => {
    if (act.includes('Sedentary')) return 1.2;
    if (act.includes('Lightly')) return 1.375;
    if (act.includes('Moderately')) return 1.55;
    return 1.725;
  };

  const calculateStats = () => {
    if (!height || !weight || !age) {
      alert('Please fill all measurement inputs.');
      return;
    }

    const hM = parseFloat(height) / 100;
    const bmiVal = parseFloat((parseFloat(weight) / (hM * hM)).toFixed(1));
    const catDetails = getBMICat(bmiVal);

    // BMR formula: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + (gender === 'Male' ? 5 : -161)
    const factor = gender === 'Male' ? 5 : -161;
    const bmrVal = Math.round(10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseInt(age, 10) + factor);

    const multiple = getTDEEMultiple(activity);
    const tdeeVal = Math.round(bmrVal * multiple);

    // Ideal Range: 18.5 * hM^2 to 24.9 * hM^2
    const idealMin = parseFloat((18.5 * hM * hM).toFixed(1));
    const idealMax = parseFloat((24.9 * hM * hM).toFixed(1));

    // Body fat percentage formula
    const genderFactor = gender === 'Male' ? 1 : 0;
    const bfpVal = parseFloat((1.20 * bmiVal + 0.23 * parseInt(age, 10) - 16.2 * genderFactor - 5.4).toFixed(1));

    const statsObj = {
      bmi: bmiVal,
      category: catDetails.label,
      bmr: bmrVal,
      tdee: tdeeVal,
      idealMin,
      idealMax,
      bfp: bfpVal,
      desc: catDetails.desc
    };

    setCalculated(statsObj);

    // Save automatically to history log
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
    
    const newEntry = {
      bmi: bmiVal,
      weight: parseFloat(weight),
      height: parseFloat(height),
      category: catDetails.label,
      date: `${dateStr}, ${timeStr}`
    };

    const updated = saveData('bmi_logs', newEntry);
    setLogs(updated);
  };

  // Needle angle for BMI gauge (span: 10 to 40)
  const bmiVal = calculated ? calculated.bmi : 16.6;
  const needleAngle = Math.min(180, Math.max(0, ((bmiVal - 10) / 30) * 180));

  return (
    <>
      {/* Title bar exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#64748b' }}>⚖️</span> BMI & Fitness Calculator
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Height & weight based health analysis
          </p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ fontSize: '13px', borderRadius: '30px', padding: '6px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="content" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 85px)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Left Column: BMI Input Form & Live Gauges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Enter Measurements */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Calculate Your BMI</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Height (cm)</label>
                  <input
                    className="input"
                    style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                    type="number"
                    placeholder="e.g. 170"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Weight (kg)</label>
                  <input
                    className="input"
                    style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                    type="number"
                    placeholder="e.g. 48"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Age</label>
                  <input
                    className="input"
                    style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                    type="number"
                    placeholder="e.g. 18"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Gender</label>
                  <select
                    className="input"
                    style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Activity Level</label>
                <select
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                  value={activity}
                  onChange={e => setActivity(e.target.value)}
                >
                  <option value="Sedentary (desk job, no exercise)">Sedentary (desk job, no exercise)</option>
                  <option value="Lightly active (light exercise 1-3 days/week)">Lightly active (light exercise 1-3 days/week)</option>
                  <option value="Moderately active (moderate exercise 3-5 days/week)">Moderately active (moderate exercise 3-5 days/week)</option>
                  <option value="Very active (hard exercise 6-7 days/week)">Very active (hard exercise 6-7 days/week)</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: '100%', height: '44px', borderRadius: '8px', background: '#0ea5e9',
                  color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
                onClick={calculateStats}
              >
                🧮 Calculate BMI & Stats
              </button>

              {calculated && (
                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  
                  {/* Gauge Arc Component */}
                  <div style={{ position: 'relative', width: '220px', height: '120px' }}>
                    <svg width="220" height="120" viewBox="0 0 200 100">
                      {/* Underweight Segment (blue) */}
                      <path d="M 20 100 A 80 80 0 0 1 60 30" fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" />
                      {/* Normal Segment (green) */}
                      <path d="M 60 30 A 80 80 0 0 1 100 20" fill="none" stroke="#10b981" strokeWidth="12" />
                      {/* Overweight Segment (yellow) */}
                      <path d="M 100 20 A 80 80 0 0 1 140 30" fill="none" stroke="#f59e0b" strokeWidth="12" />
                      {/* Obese Segment (red) */}
                      <path d="M 140 30 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" />
                      
                      {/* Needle */}
                      <g transform={`rotate(${needleAngle}, 100, 100)`}>
                        <line x1="100" y1="100" x2="30" y2="100" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="100" cy="100" r="6" fill="#1e293b" />
                      </g>
                    </svg>

                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{calculated.bmi}</div>
                      <div style={{ marginTop: '2px' }}>
                        <span style={{
                          background: calculated.category === 'Underweight' ? '#eff6ff' : calculated.category === 'Normal' ? '#f0fdf4' : calculated.category === 'Overweight' ? '#fffbeb' : '#fef2f2',
                          color: calculated.category === 'Underweight' ? '#1d4ed8' : calculated.category === 'Normal' ? '#15803d' : calculated.category === 'Overweight' ? '#b45309' : '#b91c1c',
                          padding: '3px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 700
                        }}>
                          {calculated.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2x2 Metric details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                    <div style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '12px 16px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Ideal Weight Range</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{calculated.idealMin}–{calculated.idealMax} kg</div>
                    </div>
                    <div style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '12px 16px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Daily Caloric Need (TDEE)</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{calculated.tdee} kcal</div>
                    </div>
                    <div style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '12px 16px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>BMR (Base Metabolism)</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{calculated.bmr} kcal</div>
                    </div>
                    <div style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '12px 16px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Body Fat % (Est.)</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{calculated.bfp}%</div>
                    </div>
                  </div>

                  {/* Tip Alerts strip */}
                  <div style={{
                    background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px',
                    padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', width: '100%'
                  }}>
                    <span style={{ color: '#1d4ed8' }}>⚡</span>
                    <span style={{ color: '#1e40af', fontSize: '12px', fontWeight: 500 }}>
                      {calculated.desc}
                    </span>
                  </div>

                </div>
              )}

            </div>

          </div>

          {/* Right Column: References & History chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Reference guidelines */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>BMI Scale Reference</h3>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Underweight &lt; 18.5</span>
                <span style={{ background: '#f0fdf4', color: '#15803d', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Normal 18.5–24.9</span>
                <span style={{ background: '#fffbeb', color: '#b45309', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Overweight 25–29.9</span>
                <span style={{ background: '#fef2f2', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Obese I 30–34.9</span>
                <span style={{ background: '#fef2f2', color: '#991b1b', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Obese II+ 35+</span>
              </div>
            </div>

            {/* History chart and lists */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>BMI History</h3>
              
              {/* History Bar block */}
              <div style={{ height: '70px', background: '#0ea5e9', borderRadius: '8px', position: 'relative' }}>
                <span style={{ position: 'absolute', bottom: '6px', right: '12px', color: 'white', fontSize: '11px', fontWeight: 700 }}>#1</span>
              </div>

              {/* Log List entries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                {logs.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
                    <span style={{ fontSize: '20px' }}>⚖️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>BMI: 16.6 · 48kg / 170cm</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>5/17/2026, 12:42:06 PM</div>
                    </div>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>Underweight</span>
                  </div>
                ) : (
                  logs.slice().reverse().map((l, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ fontSize: '20px' }}>⚖️</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>BMI: {l.bmi} · {l.weight}kg / {l.height}cm</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{l.date}</div>
                      </div>
                      <span style={{
                        background: l.category === 'Underweight' ? '#eff6ff' : l.category === 'Normal' ? '#f0fdf4' : l.category === 'Overweight' ? '#fffbeb' : '#fef2f2',
                        color: l.category === 'Underweight' ? '#1d4ed8' : l.category === 'Normal' ? '#15803d' : l.category === 'Overweight' ? '#b45309' : '#b91c1c',
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700
                      }}>
                        {l.category}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}
