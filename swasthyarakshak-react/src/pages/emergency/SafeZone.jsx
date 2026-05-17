import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SafeZone() {
  const [radius, setRadius] = useState(500); // 500 meters
  const [patientPos, setPatientPos] = useState({ x: 150, y: 150 });
  const [outOfBound, setOutOfBound] = useState(false);
  const [triggered, setTriggered] = useState(false);

  function handleMapClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setPatientPos({ x, y });

    // Distance calculation from center (150, 150)
    const dist = Math.sqrt((x - 150) * (x - 150) + (y - 150) * (y - 150));
    const pxRadius = radius / 4.0; // scale meters to pixels

    if (dist > pxRadius) {
      setOutOfBound(true);
      triggerAlarm();
    } else {
      setOutOfBound(false);
      setTriggered(false);
    }
  }

  function triggerAlarm() {
    if (triggered) return;
    setTriggered(true);
    // Play sound alert using Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.start();
      setTimeout(() => osc.stop(), 800);
    } catch (e) {
      console.log('Audio error:', e);
    }
    alert('🚨 SAFE ZONE BREACH DETECTED!\n\nPatient has moved outside the designated safe boundary.\nEmergency SMS notification sent to family members.');
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">🏠 Safe Zone Alerts</h1>
          <p className="page-sub">GPS Geofencing safety circle for dementia or elderly patients</p>
        </div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        {outOfBound && (
          <div className="alert alert-red" style={{ fontSize: 16, fontWeight: 700, textAlign: 'center' }}>
            🚨 SAFE ZONE BREACH TRIGGERED! Patient has crossed safety radius!
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <div className="card-title">🗺️ Geofencing Map (Interactive Simulator)</div>
            <p className="muted text-sm" style={{ marginBottom: 12 }}>
              Tap anywhere inside the radar simulator below to move the patient marker.
            </p>

            {/* Radar Canvas Simulator */}
            <div
              onClick={handleMapClick}
              style={{
                width: 300, height: 300, background: '#0f172a',
                borderRadius: '50%', margin: '0 auto 16px',
                position: 'relative', overflow: 'hidden',
                cursor: 'crosshair', border: '4px solid #1e293b'
              }}
            >
              {/* Radar Sweeper grid */}
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#334155' }}></div>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#334155' }}></div>

              {/* Safe Circle boundary */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: radius / 2, height: radius / 2,
                borderRadius: '50%', border: '2px dashed #22c55e',
                background: 'rgba(34, 197, 94, 0.08)'
              }}></div>

              {/* Patient Marker */}
              <div style={{
                position: 'absolute', left: patientPos.x, top: patientPos.y,
                transform: 'translate(-50%, -50%)',
                width: 14, height: 14, borderRadius: '50%',
                background: outOfBound ? '#ef4444' : '#22c55e',
                boxShadow: outOfBound ? '0 0 10px #ef4444' : '0 0 10px #22c55e',
                transition: 'all 0.3s'
              }}></div>
            </div>

            <div className="form-group">
              <label>Safe Boundary Radius: <strong>{radius} meters</strong></label>
              <input type="range" min="200" max="1000" step="50" value={radius} onChange={e => setRadius(+e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          <div className="card">
            <div className="card-title">📡 Active Protection Settings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>🏠 Home Coordinates</div>
                <div className="muted text-sm">28.6139° N, 77.2090° E (Rampur, Bareilly)</div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>🔒 Protection Lock</div>
                <div className="muted text-sm">Active (SMS alerts enabled for 2 phone lines)</div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>🛡️ False Alarm Buffer</div>
                <div className="muted text-sm">30 seconds before broadcasting breach alarm</div>
              </div>
            </div>
            <button className="btn btn-primary w-full mt-4" onClick={() => alert('Settings Saved! Safe zone radius configured.')}>
              💾 Save Geofence Coordinates
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
