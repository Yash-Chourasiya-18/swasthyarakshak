import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const QUALITY_OPTIONS = [
  { label: 'Poor', emoji: '😞' },
  { label: 'Fair', emoji: '😐' },
  { label: 'Good', emoji: '🙂' },
  { label: 'Great', emoji: '😊' },
  { label: 'Excellent', emoji: '🤩' }
];

const ISSUES_OPTIONS = ['Snoring', 'Woke Up Often', 'Nightmares', 'Restless Legs', 'Late to Sleep', 'Early Wake'];

export default function SleepMonitor() {
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeup, setWakeup] = useState('06:30');
  const [selectedQuality, setSelectedQuality] = useState('Good');
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [notes, setNotes] = useState('');
  
  const [logs, setLogs] = useState(() => {
    return loadData('sleep_logs') || [];
  });

  function calcHours(bed, wake) {
    const [bh, bm] = bed.split(':').map(Number);
    const [wh, wm] = wake.split(':').map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 1440;
    return +(mins / 60).toFixed(1);
  }

  function handleSave() {
    const hours = calcHours(bedtime, wakeup);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

    const newEntry = {
      bedtime,
      wakeup,
      hours,
      quality: selectedQuality,
      issues: selectedIssues,
      notes: notes || 'No notes',
      date: `${dateStr}, ${timeStr}`
    };

    const newData = saveData('sleep_logs', newEntry);
    setLogs(newData);
    setNotes('');
    setSelectedIssues([]);
  }

  const latest = logs[0];
  const totalLogs = logs.length;
  
  // Calculate average hours
  const avg = logs.length 
    ? (logs.slice(0, 7).reduce((a, l) => a + (l.hours || 0), 0) / Math.min(logs.length, 7)).toFixed(1) 
    : '8.5';

  const streak = logs.filter(l => l.hours >= 7 && l.hours <= 9).length || 1;

  // Formatting hours display helper
  const displayHours = latest ? `${latest.hours}h` : '8.5h';
  const displayQuality = latest ? latest.quality : 'Good';

  function toggleIssue(issue) {
    setSelectedIssues(prev => prev.includes(issue) ? prev.filter(x => x !== issue) : [...prev, issue]);
  }

  return (
    <>
      {/* Title bar exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#0ea5e9' }}>😴</span> Sleep Monitor
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Sleep duration & quality tracking
          </p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ fontSize: '13px', borderRadius: '30px', padding: '6px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="content" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 85px)' }}>
        
        {/* Top 3 Cards exact style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          
          {/* Card 1: Last Night */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>😴</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {displayHours}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Last Night (hours)</div>
            <div>
              <span style={{
                background: displayQuality === 'Poor' ? '#fee2e2' : '#dcfce7',
                color: displayQuality === 'Poor' ? '#b91c1c' : '#166534',
                padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700
              }}>
                {displayQuality}
              </span>
            </div>
          </div>

          {/* Card 2: 7-day Average */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>📅</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {avg}h
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>7-day Average</div>
          </div>

          {/* Card 3: Good Sleep Streak */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #f59e0b', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🌙</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {streak}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Good Sleep Streak</div>
          </div>

        </div>

        {/* 2 Column Form & Chart Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Column: Log Sleep */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Log Sleep</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Bedtime</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="time"
                  value={bedtime}
                  onChange={e => setBedtime(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Wake Time</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="time"
                  value={wakeup}
                  onChange={e => setWakeup(e.target.value)}
                />
              </div>
            </div>

            {/* Quality square icons */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'block' }}>Sleep Quality</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {QUALITY_OPTIONS.map(opt => {
                  const isSelected = selectedQuality === opt.label;
                  return (
                    <div
                      key={opt.label}
                      onClick={() => setSelectedQuality(opt.label)}
                      style={{
                        border: isSelected ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                        background: isSelected ? '#f0f9ff' : 'white',
                        borderRadius: '8px', padding: '10px', textAlign: 'center', cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontSize: '20px' }}>{opt.emoji}</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#475569', marginTop: '4px' }}>{opt.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sleep issues tags */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Sleep Issues</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {ISSUES_OPTIONS.map(opt => {
                  const isSelected = selectedIssues.includes(opt);
                  return (
                    <span
                      key={opt}
                      onClick={() => toggleIssue(opt)}
                      style={{
                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: isSelected ? '#0ea5e9' : '#f1f5f9',
                        color: isSelected ? 'white' : '#475569',
                        border: isSelected ? '1px solid #0ea5e9' : '1px solid #e2e8f0'
                      }}
                    >
                      {opt}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Notes</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="text"
                placeholder="How do you feel after waking?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              style={{
                width: '100%', height: '44px', borderRadius: '8px', background: '#0ea5e9',
                color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
              onClick={handleSave}
            >
              💾 Save Sleep Log
            </button>
          </div>

          {/* Right Column: Weekly Sleep Duration & Stages */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Duration Chart area */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Sleep Duration (Weekly)</h3>
              <div style={{ height: '60px', background: '#8b5cf6', borderRadius: '8px', position: 'relative' }}>
                <span style={{ position: 'absolute', bottom: '8px', right: '12px', color: 'white', fontSize: '12px', fontWeight: 700 }}>Sun</span>
              </div>
            </div>

            {/* Segment Stage bar */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Last Night — Sleep Stages</h3>
              
              {/* Segments progress bar */}
              <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: '15%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>Deep</div>
                <div style={{ width: '45%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>REM</div>
                <div style={{ width: '30%', background: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700 }}>Light</div>
                <div style={{ width: '10%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '10px', fontWeight: 700 }}>Awake</div>
              </div>

              {/* Legends */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '11px', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> Deep 15%</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} /> REM 45%</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa' }} /> Light 30%</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }} /> Awake 10%</span>
              </div>
            </div>

            {/* List entries */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              {logs.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🌙</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>8.5 hours · 22:00 - 06:30</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Good · No notes</div>
                  </div>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>Good</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '150px', overflowY: 'auto' }}>
                  {logs.slice(0, 3).map((l, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>🌙</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{l.hours} hours · {l.bedtime} - {l.wakeup}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{l.quality} · {l.notes}</div>
                      </div>
                      <span style={{
                        background: l.hours >= 7 && l.hours <= 9 ? '#dcfce7' : '#fee2e2',
                        color: l.hours >= 7 && l.hours <= 9 ? '#166534' : '#b91c1c',
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700
                      }}>
                        {l.hours >= 7 && l.hours <= 9 ? 'Good' : 'Poor'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Full-Width Sleep Recommendations */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Sleep Recommendations</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* Rec 1: Too little */}
            <div style={{
              background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '13px' }}>⚠️ Less than 6 hours</span>
              <span style={{ color: '#991b1b', fontSize: '13px' }}>— Not enough. Affects immunity & cognition.</span>
            </div>

            {/* Rec 2: Below optimal */}
            <div style={{
              background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#b45309', fontWeight: 700, fontSize: '13px' }}>🟨 6-7 hours</span>
              <span style={{ color: '#92400e', fontSize: '13px' }}>— Below optimal. Try to add 1 more hour.</span>
            </div>

            {/* Rec 3: Ideal */}
            <div style={{
              background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#166534', fontWeight: 700, fontSize: '13px' }}>🟩 7-8 hours</span>
              <span style={{ color: '#166534', fontSize: '13px' }}>— Ideal for adults. Great for your health!</span>
            </div>

            {/* Rec 4: Too much */}
            <div style={{
              background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#b45309', fontWeight: 700, fontSize: '13px' }}>💡 More than 9 hours</span>
              <span style={{ color: '#92400e', fontSize: '13px' }}>— May indicate fatigue or health issues.</span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
