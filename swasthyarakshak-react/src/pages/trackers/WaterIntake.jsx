import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function WaterIntake() {
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('water_daily_target');
    return saved ? parseInt(saved, 10) : 10;
  });
  const [glassSize, setGlassSize] = useState('250 ml (Standard)');
  const [reminder, setReminder] = useState('Every 1 hour');
  
  const [todayGlasses, setTodayGlasses] = useState(() => {
    const saved = localStorage.getItem('water_today_glasses');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [logs, setLogs] = useState(() => {
    return loadData('water_logs') || [];
  });

  function saveGoal(newGoal) {
    setGoal(newGoal);
    localStorage.setItem('water_daily_target', newGoal.toString());
  }

  function addWater() {
    const nextCount = todayGlasses + 1;
    setTodayGlasses(nextCount);
    localStorage.setItem('water_today_glasses', nextCount.toString());

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry = {
      glasses: nextCount,
      time: timeStr,
      date: new Date().toLocaleDateString()
    };
    
    const updated = saveData('water_logs', newEntry);
    setLogs(updated);
  }

  function removeWater() {
    if (todayGlasses <= 0) return;
    const nextCount = todayGlasses - 1;
    setTodayGlasses(nextCount);
    localStorage.setItem('water_today_glasses', nextCount.toString());

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry = {
      glasses: nextCount,
      time: timeStr,
      date: new Date().toLocaleDateString()
    };

    const updated = saveData('water_logs', newEntry);
    setLogs(updated);
  }

  function resetWater() {
    setTodayGlasses(0);
    localStorage.setItem('water_today_glasses', '0');

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newEntry = {
      glasses: 0,
      time: timeStr,
      date: new Date().toLocaleDateString()
    };

    const updated = saveData('water_logs', newEntry);
    setLogs(updated);
  }

  const pct = Math.min(100, Math.round((todayGlasses / goal) * 100));

  // Determine standard display parameters for week days
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Sunday is 6, Monday is 0

  return (
    <>
      {/* Title bar exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#0ea5e9' }}>💧</span> Water Intake Tracker
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Hydration tracking with daily goals
          </p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ fontSize: '13px', borderRadius: '30px', padding: '6px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="content" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 85px)' }}>
        
        {/* Top Main Hydration Circle & Drops Card */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            
            {/* Left side Circle */}
            <div style={{ position: 'relative', width: '150px', height: '150px', flexShrink: 0 }}>
              <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="68" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle cx="80" cy="80" r="68" fill="none" stroke="#0ea5e9" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 68}`}
                  strokeDashoffset={`${2 * Math.PI * 68 * (1 - pct / 100)}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{todayGlasses}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>/ {goal} glasses</div>
              </div>
            </div>

            {/* Right side controls */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Stay Hydrated!</h2>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Goal: {goal} glasses ({goal * 0.25} litres) per day</p>
              
              {/* Drops row */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '16px 0' }}>
                {todayGlasses > 0 ? (
                  Array.from({ length: todayGlasses }).map((_, i) => (
                    <span key={i} style={{ fontSize: '22px' }}>💧</span>
                  ))
                ) : (
                  <span style={{ color: '#cbd5e1', fontSize: '13px', fontStyle: 'italic' }}>No glasses recorded yet</span>
                )}
              </div>

              {/* Control Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={addWater}
                  style={{
                    background: '#0ea5e9', color: 'white', border: 'none',
                    padding: '8px 18px', borderRadius: '6px', fontWeight: 700,
                    cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  + Add Glass
                </button>
                <button
                  onClick={removeWater}
                  style={{
                    background: 'white', color: '#0f172a', border: '1px solid #cbd5e1',
                    padding: '8px 18px', borderRadius: '6px', fontWeight: 600,
                    cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  – Remove
                </button>
                <button
                  onClick={resetWater}
                  style={{
                    background: 'white', color: '#0f172a', border: '1px solid #cbd5e1',
                    padding: '8px 18px', borderRadius: '6px', fontWeight: 600,
                    cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

          </div>

          {/* Goal Achieved Banner inside the card */}
          {todayGlasses >= goal && (
            <div style={{
              background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px',
              padding: '10px 16px', color: '#166534', fontWeight: 700,
              fontSize: '13px', textAlign: 'center', marginTop: '20px'
            }}>
              🎉 Daily goal reached! Great hydration today!
            </div>
          )}
        </div>

        {/* 2 Column Settings & Weekly Chart Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Card: Set Daily Goal */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⚙️ Set Daily Goal
            </h3>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Daily Target (glasses)</label>
              <input
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                type="number"
                value={goal}
                onChange={e => saveGoal(parseInt(e.target.value, 10) || 8)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Glass Size</label>
              <select
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                value={glassSize}
                onChange={e => setGlassSize(e.target.value)}
              >
                <option value="250 ml (Standard)">250 ml (Standard)</option>
                <option value="330 ml (Medium)">330 ml (Medium)</option>
                <option value="500 ml (Large)">500 ml (Large)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Reminder (every)</label>
              <select
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                value={reminder}
                onChange={e => setReminder(e.target.value)}
              >
                <option value="Every 1 hour">Every 1 hour</option>
                <option value="Every 2 hours">Every 2 hours</option>
                <option value="No Reminders">No Reminders</option>
              </select>
            </div>

            <button
              className="btn btn-primary"
              style={{
                width: '100%', height: '42px', borderRadius: '8px', background: '#0ea5e9',
                color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onClick={() => alert('Settings Saved successfully!')}
            >
              Save Settings
            </button>
          </div>

          {/* Right Card: Weekly Hydration Bar Chart */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📊 Weekly Hydration
            </h3>
            
            {/* Chart Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '20px 10px', height: '140px', borderBottom: '1px solid #f1f5f9' }}>
              {days.map((day, idx) => {
                const isToday = idx === todayDayIndex;
                const barHeight = isToday ? `${Math.min(100, (todayGlasses / goal) * 100)}%` : '4%';
                return (
                  <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '12%' }}>
                    <div style={{
                      width: '100%', height: '100px', background: '#f8fafc',
                      borderRadius: '6px', display: 'flex', alignItems: 'flex-end'
                    }}>
                      <div style={{
                        width: '100%', height: barHeight,
                        background: '#0ea5e9', borderRadius: '6px',
                        transition: 'height 0.3s'
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: isToday ? 700 : 500, color: isToday ? '#0f172a' : '#64748b' }}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>This week average</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{todayGlasses} glasses</span>
            </div>
          </div>

        </div>

        {/* Today's Log Section */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📋 Today's Log
          </h3>

          {logs.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>No logs recorded for today yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.slice().reverse().map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: '18px' }}>💧</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                    {l.glasses} glasses recorded
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    · {l.time || '12:00 AM'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
