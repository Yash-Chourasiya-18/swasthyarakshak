import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CrashDetection() {
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [gForce, setGForce] = useState(1.0);
  const [countdown, setCountdown] = useState(null);
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('crash_logs') || '[]'));

  // Web Audio sound generator for Alarm
  function playAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(988, ctx.currentTime); // B5 note
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      osc.start();
      setTimeout(() => osc.stop(), 400);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  useEffect(() => {
    let interval;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        playAlarm();
        setCountdown(c => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      triggerSOS();
      setCountdown(null);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Simulation loop for vehicle speed
  useEffect(() => {
    let sim;
    if (active) {
      sim = setInterval(() => {
        setSpeed(s => {
          const change = (Math.random() - 0.4) * 4;
          const next = Math.max(0, Math.min(120, s + change));
          return Math.round(next);
        });
        setGForce(g => {
          const val = 1.0 + Math.random() * 0.2;
          return +val.toFixed(2);
        });
      }, 800);
    } else {
      setSpeed(0);
      setGForce(1.0);
    }
    return () => clearInterval(sim);
  }, [active]);

  function triggerCrash() {
    setGForce(6.5); // High impact
    setSpeed(0);
    setCountdown(10);
  }

  function cancelSOS() {
    setCountdown(null);
    alert('✅ Accident alert cancelled. False trigger reported.');
  }

  function triggerSOS() {
    const time = new Date().toLocaleString();
    const newLog = { time, gForce: '6.5G', status: 'SOS Dispatched' };
    const updated = [newLog, ...logs].slice(0, 10);
    setLogs(updated);
    localStorage.setItem('crash_logs', JSON.stringify(updated));
    alert('🚨 HIGH-SPEED CRASH DETECTED!\n\nCrash SOS triggered at 6.5G impact force. Emergency GPS coordinate dispatched to 108.');
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">💥 Crash Detection</h1>
          <p className="page-sub">GPS speed + G-Force impact analysis for vehicle safety</p>
        </div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-yellow">
          🚗 Vehicle Mode: Active detection uses high-rate accelerometer readings (typically G-Force &gt; 4.0G).
        </div>

        <div className="stats-row">
          <div className={`stat-card ${active ? 'green' : 'blue'}`}>
            <div className="stat-icon">🚗</div>
            <div className="stat-val">{speed} km/h</div>
            <div className="stat-lbl">Estimated GPS Speed</div>
          </div>
          <div className={`stat-card ${gForce > 4 ? 'red' : 'green'}`}>
            <div className="stat-icon">📈</div>
            <div className="stat-val">{gForce} G</div>
            <div className="stat-lbl">Real-time G-Force</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">🎯</div>
            <div className="stat-val">4.5 G</div>
            <div className="stat-lbl">Impact Threshold</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">🔌 Sensor Control</div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: countdown !== null ? '#ef4444' : active ? '#dcfce7' : '#f1f5f9',
                color: countdown !== null ? 'white' : active ? '#22c55e' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 44,
                animation: countdown !== null ? 'pulse 0.5s infinite' : 'none'
              }}>
                {countdown !== null ? '💥' : '🚗'}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                {countdown !== null ? 'Impact Detected!' : active ? 'Driving Monitor Active' : 'Monitor Standby'}
              </h2>
              <p className="muted text-sm" style={{ marginBottom: 20 }}>
                {countdown !== null ? `Auto SOS alert in ${countdown} seconds...` : 'Automatic G-Force shock tracking for highway travel.'}
              </p>

              {countdown !== null ? (
                <button className="btn btn-danger w-full" style={{ fontSize: 16, padding: 14 }} onClick={cancelSOS}>
                  ❌ CANCEL CRASH WARNING (False Trigger)
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className={`btn ${active ? 'btn-outline' : 'btn-primary'} w-full`} onClick={() => setActive(!active)}>
                    {active ? '⏹️ Stop Monitor' : '▶️ Start Monitor'}
                  </button>
                  <button className="btn btn-danger" onClick={triggerCrash} disabled={!active}>
                    💥 Simulate Crash
                  </button>
                </div>
              )}
            </div>

            <div className="divider"></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, height: 60, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${(gForce / 8) * 100}%`, background: gForce > 4 ? '#ef4444' : '#22c55e',
                  transition: 'height 0.2s'
                }}></div>
                <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, borderTop: '2px dashed #94a3b8' }}></div>
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                <strong>Impact Meter</strong><br />
                Dash line = 4.5G Trigger
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">📋 Crash Event Log</div>
            {logs.length === 0 && <p className="muted text-sm">No critical impact logs recorded.</p>}
            {logs.map((l, i) => (
              <div key={i} className="list-item">
                <span>💥</span>
                <div style={{ flex: 1 }}>
                  <div className="fw-6">Accident Impact: {l.gForce}</div>
                  <div className="muted text-sm">{l.time}</div>
                </div>
                <span className="badge red">{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
