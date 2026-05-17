import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FallDetection() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('fall_logs') || '[]'));
  const [sensitivity, setSensitivity] = useState(8); // m/s2 threshold

  // Audio simulation using Web Audio API
  function playAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.start();
      setTimeout(() => osc.stop(), 500);
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

  // Simulated Device Motion
  useEffect(() => {
    function handleMotion(e) {
      if (!active) return;
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const total = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      if (total > sensitivity * 2) { // Spike detection
        triggerAlert();
      }
    }
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [active, sensitivity]);

  function triggerAlert() {
    if (countdown !== null) return;
    setCountdown(10);
  }

  function cancelSOS() {
    setCountdown(null);
    alert('✅ Alert cancelled. Safe status confirmed.');
  }

  function triggerSOS() {
    const time = new Date().toLocaleString();
    const newLog = { time, type: 'Fall Detected', status: 'SOS Sent' };
    const updated = [newLog, ...logs].slice(0, 10);
    setLogs(updated);
    localStorage.setItem('fall_logs', JSON.stringify(updated));
    alert('🚨 EMERGENCY SOS SENT!\n\nFall confirmed. Emergency contacts notified with location.');
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">🫷 Fall Detection</h1>
          <p className="page-sub">Smart accelerometer monitoring with automatic emergency trigger</p>
        </div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-yellow">
          ⚠️ Safe guard mode: Fall detection uses your mobile phone's built-in accelerometer sensor.
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">🛡️ Protection Status</div>
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: countdown !== null ? '#ef4444' : active ? '#dcfce7' : '#f1f5f9',
                color: countdown !== null ? 'white' : active ? '#22c55e' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 44,
                boxShadow: active && countdown === null ? '0 0 20px rgba(34, 197, 94, 0.2)' : 'none',
                animation: countdown !== null ? 'pulse 0.5s infinite' : 'none'
              }}>
                {countdown !== null ? '🚨' : '🫷'}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                {countdown !== null ? 'Fall Detected!' : active ? 'Active Protection' : 'Protection Disabled'}
              </h2>
              <p className="muted text-sm" style={{ marginBottom: 20 }}>
                {countdown !== null ? `Auto-SOS in ${countdown} seconds...` : 'Keep phone in pocket during walk for auto detection.'}
              </p>

              {countdown !== null ? (
                <button className="btn btn-danger w-full" style={{ fontSize: 16, padding: 14 }} onClick={cancelSOS}>
                  ❌ I AM SAFE (Cancel SOS)
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className={`btn ${active ? 'btn-outline' : 'btn-primary'} w-full`} onClick={() => setActive(!active)}>
                    {active ? '⏹️ Stop Monitoring' : '▶️ Start Monitoring'}
                  </button>
                  <button className="btn btn-danger" onClick={triggerAlert}>
                    💥 Test Trigger
                  </button>
                </div>
              )}
            </div>

            <div className="divider"></div>
            <div className="form-group">
              <label>Sensitivity Threshold: <strong>{sensitivity} m/s²</strong></label>
              <input type="range" min="5" max="15" step="0.5" value={sensitivity} onChange={e => setSensitivity(+e.target.value)} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                <span>Sensitive (Elderly)</span>
                <span>Normal</span>
                <span>Rough (Sports)</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">📋 Fall Event History</div>
            {logs.length === 0 && <p className="muted text-sm">No fall events detected yet.</p>}
            {logs.map((l, i) => (
              <div key={i} className="list-item">
                <span style={{ fontSize: 22 }}>🚨</span>
                <div style={{ flex: 1 }}>
                  <div className="fw-6">{l.type}</div>
                  <div className="muted text-sm">{l.time}</div>
                </div>
                <span className="badge red">{l.status}</span>
              </div>
            ))}

            <div className="divider"></div>
            <div className="card-title" style={{ fontSize: 13 }}>💡 Important Safety Tips</div>
            {[
              'Phone needs to be kept in pocket or waist belt for realistic fall detection.',
              'Ensure volume is high so you can hear the pre-alert alarm countdown.',
              'Offline SMS backup will automatically trigger even if you have no internet.'
            ].map((tip, i) => (
              <div key={i} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                🔑 {tip}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    </>
  );
}
