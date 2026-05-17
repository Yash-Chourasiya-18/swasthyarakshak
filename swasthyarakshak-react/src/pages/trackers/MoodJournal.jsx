import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

const MOODS = [
  { emoji: '😄', label: 'Happy', val: 5 },
  { emoji: '😊', label: 'Good', val: 4 },
  { emoji: '😐', label: 'Neutral', val: 3 },
  { emoji: '😢', label: 'Sad', val: 2 },
  { emoji: '😰', label: 'Anxious', val: 2 },
  { emoji: '😠', label: 'Angry', val: 1 },
  { emoji: '😴', label: 'Tired', val: 2 },
  { emoji: '🤩', label: 'Excited', val: 5 }
];

const FACTORS = [
  'Work Stress', 'Poor Sleep', 'Family Issues', 'Financial', 
  'Health Worry', 'Loneliness', 'Exercise', 'Good News'
];

export default function MoodJournal() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [stress, setStress] = useState(5);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState(() => {
    return loadData('mood_logs') || [];
  });

  function toggleFactor(f) {
    setSelectedFactors(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  function handleSave() {
    if (!selectedMood) return alert('Mood select karo.');
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });

    const newEntry = {
      mood: selectedMood.label,
      emoji: selectedMood.emoji,
      stress,
      factors: selectedFactors,
      note,
      date: `${dateStr}, ${timeStr}`
    };

    const newData = saveData('mood_logs', newEntry);
    setLogs(newData);
    
    // Reset state
    setSelectedMood(null);
    setStress(5);
    setSelectedFactors([]);
    setNote('');
  }

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const avgStress = logs.length > 0 
    ? (logs.reduce((acc, curr) => acc + (curr.stress || 0), 0) / logs.length).toFixed(1)
    : '—';
  
  const goodDaysCount = logs.filter(l => ['Happy', 'Good', 'Excited'].includes(l.mood)).length;

  return (
    <>
      {/* Title bar exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ec4899' }}>🧠</span> Mood & Mental Health Journal
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Stress, anxiety & mood tracking
          </p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ fontSize: '13px', borderRadius: '30px', padding: '6px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="content" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 85px)' }}>
        
        {/* Top 3 Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          
          {/* Card 1: Today's Mood */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #a855f7', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🧠</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {latestLog ? `${latestLog.emoji} ${latestLog.mood}` : '—'}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Today's Mood</div>
          </div>

          {/* Card 2: Good Days (Week) */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>📅</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {goodDaysCount}/7
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Good Days (Week)</div>
          </div>

          {/* Card 3: Avg Stress Level */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #f97316', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🤯</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {avgStress}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Avg Stress Level</div>
          </div>

        </div>

        {/* Two Columns Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Column: Log Today's Mood */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Log Today's Mood</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '12px', display: 'block' }}>How are you feeling right now?</label>
              
              {/* Emoji Card Selector Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {MOODS.map(m => {
                  const isSelected = selectedMood?.label === m.label;
                  return (
                    <div
                      key={m.label}
                      onClick={() => setSelectedMood(m)}
                      style={{
                        padding: '16px 8px', border: isSelected ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                        background: isSelected ? '#e0f2fe' : 'white', borderRadius: '12px',
                        textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ fontSize: '28px' }}>{m.emoji}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginTop: '6px' }}>{m.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stress level custom slider */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px', display: 'block' }}>
                Stress Level: <span style={{ color: '#ef4444' }}>{stress}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={e => setStress(parseInt(e.target.value, 10))}
                style={{ width: '100%', height: '6px', cursor: 'pointer', accentColor: '#0ea5e9' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                <span>😌 Low</span>
                <span>😫 High</span>
              </div>
            </div>

            {/* Contributing factors multi-select */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px', display: 'block' }}>Contributing Factors</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {FACTORS.map(f => {
                  const isSelected = selectedFactors.includes(f);
                  return (
                    <span
                      key={f}
                      onClick={() => toggleFactor(f)}
                      style={{
                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: isSelected ? '#0ea5e9' : '#f1f5f9',
                        color: isSelected ? 'white' : '#475569',
                        border: isSelected ? '1px solid #0ea5e9' : '1px solid #e2e8f0'
                      }}
                    >
                      {f}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Note text field */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Journal Entry</label>
              <textarea
                className="input"
                rows={3}
                placeholder="What's on your mind? Writing helps process emotions..."
                style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', resize: 'none' }}
                value={note}
                onChange={e => setNote(e.target.value)}
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
              💾 Save Entry
            </button>
          </div>

          {/* Right Column: Weekly pattern & Recent logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Weekly Mood Pattern card */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Weekly Mood Pattern</h3>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', height: '80px' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '10%' }}>
                    <div style={{
                      width: '100%', height: '50px', background: '#f8fafc',
                      borderRadius: '4px', display: 'flex', alignItems: 'flex-end'
                    }}>
                      {/* Placeholder or dynamic height bars representing mood value */}
                      <div style={{
                        width: '100%', height: idx === 6 && latestLog ? '80%' : '10%',
                        background: '#a855f7', borderRadius: '4px'
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Entries */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Recent Entries</h3>
              
              {logs.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>No records yet. Add your first entry!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {logs.slice().reverse().map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '28px' }}>{l.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                            {l.mood} · Stress: {l.stress}/10
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            {l.date}
                          </div>
                          {l.note && (
                            <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', marginTop: '4px' }}>
                              "{l.note}"
                            </div>
                          )}
                        </div>
                      </div>
                      <span style={{
                        background: l.stress >= 8 ? '#fee2e2' : l.stress >= 5 ? '#fef3c7' : '#dcfce7',
                        color: l.stress >= 8 ? '#b91c1c' : l.stress >= 5 ? '#b45309' : '#166534',
                        padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700
                      }}>
                        Stress {l.stress}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mental Wellness Tips Bottom Cards */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
            💡 Mental Wellness Tips
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* Tip 1 */}
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '13px' }}>🧘 Breathe</span>
              <span style={{ color: '#1e40af', fontSize: '12px' }}>
                Try box breathing — inhale 4s, hold 4s, exhale 4s, hold 4s. Reduces anxiety instantly.
              </span>
            </div>

            {/* Tip 2 */}
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#15803d', fontWeight: 700, fontSize: '13px' }}>🏃 Move</span>
              <span style={{ color: '#166534', fontSize: '12px' }}>
                Even a 10 minute walk can boost mood by releasing endorphins.
              </span>
            </div>

            {/* Tip 3 */}
            <div style={{
              background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#b45309', fontWeight: 700, fontSize: '13px' }}>📵 Disconnect</span>
              <span style={{ color: '#92400e', fontSize: '12px' }}>
                Take 30 minute breaks from screens. Social media can amplify stress.
              </span>
            </div>

            {/* Tip 4 */}
            <div style={{
              background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '8px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              <span style={{ color: '#be185d', fontWeight: 700, fontSize: '13px' }}>💖 Connect</span>
              <span style={{ color: '#9d174d', fontSize: '12px' }}>
                Talk to a friend or family member. Social support is crucial for mental health.
              </span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
