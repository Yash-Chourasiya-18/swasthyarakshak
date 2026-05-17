import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const CYCLE_DAYS = [
  'period', 'period', 'period', 'period', 'period',
  'spotting', 'spotting', '', '', '',
  'fertile', 'fertile', 'fertile', 'ovulation', 'fertile', 'fertile',
  '', '', '', '', '', '', '', '', '', '', '', '', '', ''
];

export default function WomenHealth() {
  const [lastPeriod, setLastPeriod] = useState('2001-01-12');
  const [cycleLen, setCycleLen] = useState(28);
  const [flow, setFlow] = useState('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Back Pain']);
  const [logs, setLogs] = useState(() => {
    return loadData('period_logs') || [];
  });

  const SYMPTOMS_LIST = [
    'Cramps', 'Nausea', 'Bloating', 'Mood Swings', 'Headache', 
    'Back Pain', 'Fatigue', 'Breast Tenderness', 'Acne', 'Food Cravings'
  ];

  function toggleSymptom(s) {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function calcDates() {
    if (!lastPeriod) return null;
    const lp = new Date(lastPeriod);
    
    const nextPeriod = new Date(lp);
    nextPeriod.setDate(lp.getDate() + cycleLen);
    
    const fertileStart = new Date(lp);
    fertileStart.setDate(lp.getDate() + 11);
    
    const ovulation = new Date(lp);
    ovulation.setDate(lp.getDate() + 14);
    
    const fertileEnd = new Date(lp);
    fertileEnd.setDate(lp.getDate() + 17);

    return { nextPeriod, fertileStart, ovulation, fertileEnd };
  }

  function handleSave() {
    if (!lastPeriod) return alert('Last period date select karo.');
    const dates = calcDates();
    const newEntry = {
      lastPeriod,
      cycleLen,
      flow,
      symptoms: selectedSymptoms,
      nextPeriod: dates?.nextPeriod?.toLocaleDateString('en-IN')
    };
    const newData = saveData('period_logs', newEntry);
    setLogs(newData);
    alert('✅ Period log saved successfully!');
  }

  const dates = calcDates();
  
  // Custom calendar generation based on starting date
  const calStart = lastPeriod ? new Date(lastPeriod) : new Date();
  
  // We want to generate the 5-week block calendar representing the month of the period
  const calDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(calStart);
    // Align to the nearest Sunday to start the grid perfectly
    d.setDate(calStart.getDate() + i - calStart.getDay());
    return d;
  });

  const dayColors = {
    period: '#fca5a5',
    spotting: '#fde68a',
    fertile: '#86efac',
    ovulation: '#93c5fd'
  };

  return (
    <>
      {/* Title bar exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ec4899' }}>🌸</span> Women Health
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Period tracker, ovulation & cycle prediction
          </p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ fontSize: '13px', borderRadius: '30px', padding: '6px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="content" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 85px)' }}>
        
        {/* Security Alert strip */}
        <div style={{
          background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px',
          padding: '12px 16px', color: '#1e40af', fontSize: '13px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500
        }}>
          <span>🔒 All data is stored only on your device. It is never shared with anyone.</span>
        </div>

        {/* 4 Stats Cards */}
        {dates && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
            
            {/* Card 1: Next Period */}
            <div style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              borderTop: '3px solid #ec4899', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }}>
              <div style={{ fontSize: '24px' }}>🩸</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
                {dates.nextPeriod.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </div>
              <div className="muted" style={{ fontSize: '12px', color: '#64748b' }}>Next Period</div>
            </div>

            {/* Card 2: Fertile Window */}
            <div style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              borderTop: '3px solid #10b981', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }}>
              <div style={{ fontSize: '24px' }}>🌿</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
                {dates.fertileStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </div>
              <div className="muted" style={{ fontSize: '12px', color: '#64748b' }}>Fertile Window</div>
            </div>

            {/* Card 3: Ovulation Day */}
            <div style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              borderTop: '3px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }}>
              <div style={{ fontSize: '24px' }}>🥚</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
                {dates.ovulation.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </div>
              <div className="muted" style={{ fontSize: '12px', color: '#64748b' }}>Ovulation Day</div>
            </div>

            {/* Card 4: Cycle Length */}
            <div style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              borderTop: '3px solid #f59e0b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', gap: '6px'
            }}>
              <div style={{ fontSize: '24px' }}>📅</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
                {cycleLen} days
              </div>
              <div className="muted" style={{ fontSize: '12px', color: '#64748b' }}>Cycle Length</div>
            </div>

          </div>
        )}

        {/* 2 Column Main Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Left Column: Log Period Form */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Log Period</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>LAST PERIOD START DATE</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="date"
                  value={lastPeriod}
                  onChange={e => setLastPeriod(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>CYCLE LENGTH (DAYS)</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="number"
                  value={cycleLen}
                  min="20"
                  max="45"
                  onChange={e => setCycleLen(parseInt(e.target.value, 10) || 28)}
                />
              </div>
            </div>

            {/* Flow Intensity selector tags */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px', display: 'block' }}>FLOW INTENSITY</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { name: 'Light', icon: '💧' },
                  { name: 'Medium', icon: '💧💧' },
                  { name: 'Heavy', icon: '💧💧💧' },
                  { name: 'Spotting', icon: '·' }
                ].map(opt => {
                  const isSelected = flow === opt.name.toLowerCase();
                  return (
                    <span
                      key={opt.name}
                      onClick={() => setFlow(opt.name.toLowerCase())}
                      style={{
                        padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px',
                        background: isSelected ? '#0ea5e9' : '#f1f5f9',
                        color: isSelected ? 'white' : '#475569',
                        border: isSelected ? '1px solid #0ea5e9' : '1px solid #e2e8f0'
                      }}
                    >
                      <span>{opt.icon}</span>
                      {opt.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Symptoms Tags selection */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px', display: 'block' }}>SYMPTOMS</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SYMPTOMS_LIST.map(s => {
                  const isSelected = selectedSymptoms.includes(s);
                  return (
                    <span
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      style={{
                        padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: isSelected ? '#0ea5e9' : '#f1f5f9',
                        color: isSelected ? 'white' : '#475569',
                        border: isSelected ? '1px solid #0ea5e9' : '1px solid #e2e8f0'
                      }}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{
                width: '100%', height: '44px', borderRadius: '8px', background: '#ec4899',
                color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px'
              }}
              onClick={handleSave}
            >
              💾 Save Log
            </button>

            {/* Legend block at bottom */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📊 Legend
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Period Days', color: '#fca5a5' },
                  { label: 'Spotting', color: '#fde68a' },
                  { label: 'Fertile Window', color: '#86efac' },
                  { label: 'Ovulation Day', color: '#93c5fd' }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: item.color }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Cycle Calendar */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Cycle Calendar</h2>
            
            {/* Calendar header row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px', textAlign: 'center' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', padding: '6px 0' }}>{d}</div>
              ))}
            </div>

            {/* Grid days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {calDays.map((d, i) => {
                const diff = lastPeriod ? Math.round((d - new Date(lastPeriod)) / (1000 * 60 * 60 * 24)) : -1;
                const type = (diff >= 0 && diff < 30) ? CYCLE_DAYS[diff] : '';
                
                // Color mapping
                const bgColor = dayColors[type] || 'transparent';
                
                return (
                  <div
                    key={i}
                    style={{
                      height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '6px', background: bgColor, fontSize: '12px', fontWeight: type ? 700 : 500,
                      color: type ? '#1e293b' : '#64748b', transition: 'all 0.15s'
                    }}
                  >
                    {d.getDate()}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </>
  );
}
