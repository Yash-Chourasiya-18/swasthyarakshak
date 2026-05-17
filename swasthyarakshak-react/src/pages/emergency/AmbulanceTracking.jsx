import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AmbulanceTracking() {
  const [active, setActive] = useState(true);
  const [eta, setEta] = useState(12);
  const [distance, setDistance] = useState(3.4);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (active && eta > 0) {
      interval = setInterval(() => {
        setEta(prev => {
          const next = prev - 1;
          if (next === 0) setActive(false);
          return next;
        });
        setDistance(prev => Math.max(0, +(prev - 0.3).toFixed(1)));
        setProgress(prev => Math.min(100, prev + 8));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [active, eta]);

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">📍 Live Ambulance Tracking</h1>
          <p className="page-sub">Real-time status of your requested ambulance</p>
        </div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="stats-row">
          <div className="stat-card green">
            <div className="stat-icon">🚑</div>
            <div className="stat-val">{active ? 'On the Way' : 'Arrived!'}</div>
            <div className="stat-lbl">Status</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">⏱️</div>
            <div className="stat-val">{eta} min</div>
            <div className="stat-lbl">Estimated Arrival (ETA)</div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">🛣️</div>
            <div className="stat-val">{distance} km</div>
            <div className="stat-lbl">Remaining Distance</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">🗺️ Tracking Route Map</div>
            
            {/* Animated Route Simulator */}
            <div style={{
              width: '100%', height: 200, background: '#f1f5f9',
              borderRadius: 12, position: 'relative', overflow: 'hidden',
              border: '2px solid #e2e8f0', marginBottom: 16
            }}>
              {/* Route line */}
              <div style={{
                position: 'absolute', top: '50%', left: '10%', right: '10%',
                height: 4, background: '#cbd5e1', transform: 'translateY(-50%)'
              }}></div>
              
              {/* Active Route fill */}
              <div style={{
                position: 'absolute', top: '50%', left: '10%',
                width: `${progress * 0.8}%`, height: 4,
                background: '#0ea5e9', transform: 'translateY(-50%)',
                transition: 'width 1s'
              }}></div>

              {/* Hospital Pin */}
              <div style={{ position: 'absolute', top: '50%', left: '10%', transform: 'translate(-50%, -50%)', fontSize: 24 }}>🏥</div>
              
              {/* Patient Pin */}
              <div style={{ position: 'absolute', top: '50%', right: '10%', transform: 'translate(50%, -50%)', fontSize: 24 }}>🏠</div>

              {/* Moving Ambulance */}
              <div style={{
                position: 'absolute', top: '50%',
                left: `${10 + progress * 0.8}%`,
                transform: 'translate(-50%, -50%)', fontSize: 24,
                transition: 'left 1s'
              }}>🚑</div>
            </div>

            <button className="btn btn-danger w-full" onClick={() => alert('SOS signal sent to driver: Standby alert.')}>
              🚨 Send Location Alert to Driver
            </button>
          </div>

          <div className="card">
            <div className="card-title">🧑‍✈️ Crew & Driver Details</div>
            
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 22, fontWeight: 700
              }}>
                👨‍✈️
              </div>
              <div>
                <div className="fw-7">Rakesh Yadav</div>
                <div className="muted text-sm">Ambulance Driver · Reg No. DL-1RY-8920</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 22, fontWeight: 700
              }}>
                👩‍⚕️
              </div>
              <div>
                <div className="fw-7">Dr. Sunita Sharma</div>
                <div className="muted text-sm">Emergency Medical Specialist</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <a href="tel:9876543210" className="btn btn-primary w-full text-center">📞 Call Driver</a>
              <button className="btn btn-outline w-full" onClick={() => { setActive(true); setEta(12); setDistance(3.4); setProgress(0); }}>
                🔄 Restart Simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
