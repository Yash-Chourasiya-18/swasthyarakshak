import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function StepCounter() {
  const [actType, setActType] = useState('Walking');
  const [stepsInput, setStepsInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [intensity, setIntensity] = useState('Moderate');
  
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('step_goal');
    return saved ? parseInt(saved, 10) : 10000;
  });

  const [weight, setWeight] = useState(() => {
    const saved = localStorage.getItem('user_weight');
    return saved ? parseInt(saved, 10) : 70;
  });

  const [logs, setLogs] = useState(() => {
    return loadData('activities') || [];
  });

  const MET_VALUES = {
    'Walking': 3.5,
    'Running': 8.0,
    'Cycling': 6.0,
    'Swimming': 7.0
  };

  function handleSaveGoal() {
    localStorage.setItem('step_goal', goal.toString());
    localStorage.setItem('user_weight', weight.toString());
    alert('Goal and weight saved successfully!');
  }

  function handleSave() {
    if (!stepsInput) return alert('Steps enter karo.');
    
    // Calorie formula: MET * weight (kg) * (duration / 60)
    const duration = durationInput ? parseInt(durationInput, 10) : 30;
    const met = MET_VALUES[actType] || 3.5;
    const calories = Math.round(met * weight * (duration / 60));
    
    // Distance formula: steps * 0.00075 km per step
    const distance = parseFloat((parseInt(stepsInput, 10) * 0.00075).toFixed(2));
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });

    const newEntry = {
      type: actType,
      steps: parseInt(stepsInput, 10),
      duration,
      intensity,
      calories,
      distance,
      date: `${dateStr}, ${timeStr}`
    };

    const newData = saveData('activities', newEntry);
    setLogs(newData);
    setStepsInput('');
    setDurationInput('');
  }

  // Calculate today's aggregator values
  const todayStr = new Date().toLocaleDateString();
  const todayLogs = logs.filter(l => l.date?.startsWith(new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })));
  
  const stepsToday = todayLogs.reduce((acc, l) => acc + (l.steps || 0), 0);
  const caloriesBurned = todayLogs.reduce((acc, l) => acc + (l.calories || 0), 0);
  const distanceCovered = parseFloat(todayLogs.reduce((acc, l) => acc + (l.distance || 0.0), 0.0).toFixed(2));

  const pct = Math.min(100, Math.round((stepsToday / goal) * 100));
  const remainingSteps = Math.max(0, goal - stepsToday);

  // Weekly steps bar height setup
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Sunday is 6, Monday is 0

  return (
    <>
      {/* Title bar exact style */}
      <div className="topbar" style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f59e0b' }}>🏃</span> Step Counter & Activity Tracker
          </h1>
          <p className="page-sub" style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            Daily activity & fitness tracking
          </p>
        </div>
        <Link to="/" className="btn btn-outline" style={{ fontSize: '13px', borderRadius: '30px', padding: '6px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
          ← Dashboard
        </Link>
      </div>

      <div className="content" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 85px)' }}>
        
        {/* Top 3 Cards exact style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
          
          {/* Card 1: Steps Today */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #10b981', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🏃</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {stepsToday.toLocaleString()}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Steps Today</div>
            <div>
              <span style={{
                background: pct >= 100 ? '#dcfce7' : '#fef3c7',
                color: pct >= 100 ? '#166534' : '#b45309',
                padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700
              }}>
                {pct}% of goal
              </span>
            </div>
          </div>

          {/* Card 2: Calories Burned */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>🔥</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {caloriesBurned}
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Calories Burned</div>
          </div>

          {/* Card 3: Distance Covered */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '20px',
            borderTop: '3px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ fontSize: '24px' }}>📍</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>
              {distanceCovered.toFixed(1)} km
            </div>
            <div className="muted" style={{ fontSize: '13px', color: '#64748b' }}>Distance Covered</div>
          </div>

        </div>

        {/* Today's Progress Bar spanning full width */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            <span>Today's Progress</span>
            <span style={{ color: '#64748b', fontWeight: 500 }}>{remainingSteps.toLocaleString()} steps remaining</span>
          </div>
          
          {/* Progress bar track */}
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#10b981', borderRadius: '10px', transition: 'width 0.3s' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
            <span>0</span>
            <span>Goal: {goal.toLocaleString()} steps</span>
          </div>
        </div>

        {/* 2 Column Form & Goal Settings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Column: Log Activity */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Log Activity</h2>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Activity Type</label>
              <select
                className="input"
                style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                value={actType}
                onChange={e => setActType(e.target.value)}
              >
                <option value="Walking">🏃 Walking</option>
                <option value="Running">🏃 Running</option>
                <option value="Cycling">🚴 Cycling</option>
                <option value="Swimming">🏊 Swimming</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Steps (if applicable)</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="number"
                  placeholder="e.g. 5000"
                  value={stepsInput}
                  onChange={e => setStepsInput(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Duration (minutes)</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="number"
                  placeholder="e.g. 30"
                  value={durationInput}
                  onChange={e => setDurationInput(e.target.value)}
                />
              </div>
            </div>

            {/* Intensity option list */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px', display: 'block' }}>Intensity</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Low', 'Moderate', 'High'].map(opt => {
                  const isSelected = intensity === opt;
                  const dotColor = opt === 'Low' ? '#10b981' : opt === 'Moderate' ? '#f59e0b' : '#ef4444';
                  return (
                    <div
                      key={opt}
                      onClick={() => setIntensity(opt)}
                      style={{
                        padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px',
                        background: isSelected ? '#e0f2fe' : '#f1f5f9',
                        color: isSelected ? '#0369a1' : '#475569',
                        border: isSelected ? '1px solid #0ea5e9' : '1px solid #e2e8f0'
                      }}
                    >
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: dotColor }} />
                      {opt}
                    </div>
                  );
                })}
              </div>
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
              💾 Save Activity
            </button>
          </div>

          {/* Right Column: Goal Settings & Weekly Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Set Step Goal */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Set Step Goal</h3>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Daily Step Goal</label>
                <select
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', background: 'white' }}
                  value={goal}
                  onChange={e => setGoal(parseInt(e.target.value, 10))}
                >
                  <option value={10000}>10,000 (Recommended)</option>
                  <option value={15000}>15,000</option>
                  <option value={8000}>8,000</option>
                  <option value={5000}>5,000</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', display: 'block' }}>Weight (kg) — for calorie calculation</label>
                <input
                  className="input"
                  style={{ width: '100%', height: '42px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px' }}
                  type="number"
                  placeholder="e.g. 70"
                  value={weight}
                  onChange={e => setWeight(parseInt(e.target.value, 10) || 70)}
                />
              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: '100%', height: '42px', borderRadius: '8px', background: '#0ea5e9',
                  color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer'
                }}
                onClick={handleSaveGoal}
              >
                Save Goal
              </button>
            </div>

            {/* Weekly Steps */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Weekly Steps</h3>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', height: '100px' }}>
                {days.map((day, idx) => {
                  const isToday = idx === todayDayIndex;
                  const barHeight = isToday ? `${Math.min(100, (stepsToday / goal) * 100)}%` : '4%';
                  return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '12%' }}>
                      <div style={{
                        width: '100%', height: '70px', background: '#f8fafc',
                        borderRadius: '4px', display: 'flex', alignItems: 'flex-end'
                      }}>
                        <div style={{
                          width: '100%', height: barHeight,
                          background: '#10b981', borderRadius: '4px',
                          transition: 'height 0.3s'
                        }} />
                      </div>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Activity Log Bottom Card */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Activity Log</h2>
          
          {logs.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>No activities logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {logs.slice().reverse().map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>🏃</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
                        {l.type} – {l.steps?.toLocaleString() || 0} steps
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {l.duration} min · {l.calories} cal · {l.distance?.toFixed(2)} km
                      </div>
                    </div>
                  </div>
                  <span style={{
                    background: l.intensity === 'Low' ? '#dcfce7' : l.intensity === 'Moderate' ? '#fef3c7' : '#fee2e2',
                    color: l.intensity === 'Low' ? '#166534' : l.intensity === 'Moderate' ? '#b45309' : '#b91c1c',
                    padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700
                  }}>
                    {l.intensity?.toLowerCase()}
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
