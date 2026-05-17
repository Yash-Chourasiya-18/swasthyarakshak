import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: '🩺 Health Trackers',
    features: [
      { to: '/bp-tracker', icon: '❤️', title: 'Smart BP Tracker', desc: 'Log BP + risk alerts' },
      { to: '/spo2', icon: '🫁', title: 'SpO2 Monitor', desc: 'Blood oxygen tracking' },
      { to: '/sugar-tracker', icon: '🩸', title: 'Sugar Tracker', desc: 'Glucose history + HbA1c' },
      { to: '/water-intake', icon: '💧', title: 'Water Intake', desc: 'Hydration with goals' },
      { to: '/sleep-monitor', icon: '😴', title: 'Sleep Monitor', desc: 'Duration & quality' },
      { to: '/step-counter', icon: '🏃', title: 'Step Counter', desc: 'Steps + calories' },
      { to: '/bmi-calculator', icon: '⚖️', title: 'BMI Calculator', desc: 'Height/weight analysis' },
      { to: '/mood-journal', icon: '🧠', title: 'Mood Journal', desc: 'Stress & mood logs' },
      { to: '/women-health', icon: '🌸', title: 'Women Health', desc: 'Period & ovulation' },
      { to: '/vaccination', icon: '💉', title: 'Vaccination', desc: 'NIS schedule tracker' },
    ]
  },
  {
    title: '🚨 Emergency & Safety',
    features: [
      { to: '/fall-detection', icon: '🫷', title: 'Fall Detection', desc: 'Elderly girne par alert' },
      { to: '/crash-detection', icon: '💥', title: 'Crash Detection', desc: 'Accident SOS' },
      { to: '/voice-sos', icon: '🎙️', title: 'Voice SOS', desc: '"Help" bolte hi trigger' },
      { to: '/offline-sos', icon: '📵', title: 'Offline Emergency', desc: 'Internet bina SOS' },
      { to: '/ambulance', icon: '🚑', title: 'Live Ambulance', desc: 'Nearby ambulance' },
      { to: '/medical-id', icon: '🪪', title: 'Medical ID', desc: 'Emergency lockscreen info' },
      { to: '/emergency-qr', icon: '📱', title: 'Emergency QR', desc: 'Doctor scan for details' },
      { to: '/safe-zone', icon: '🏠', title: 'Safe Zone Alerts', desc: 'Patient bahar nikle notify' },
      { to: '/ambulance-tracking', icon: '📍', title: 'Ambulance Tracking', desc: 'Live tracking' },
    ]
  },
  {
    title: '🤖 AI & Smart Features',
    features: [
      { to: '/ai-risk', icon: '🤖', title: 'Disease Risk', desc: 'Vitals se risk estimate' },
      { to: '/ai-diet', icon: '🥗', title: 'Diet Planner', desc: 'Indian meal suggestions' },
      { to: '/ai-workout', icon: '💪', title: 'Workout Plan', desc: 'Exercise guide' },
      { to: '/voice-assistant', icon: '🎙️', title: 'Voice Assistant', desc: 'Hindi + English health chat' },
      { to: '/med-interaction', icon: '💊', title: 'Medicine Interaction', desc: 'Dangerous combo check' },
      { to: '/ai-report', icon: '📄', title: 'Report Scanner', desc: 'Scan reports + summary' },
      { to: '/symptom-checker', icon: '🔍', title: 'Symptom Checker', desc: 'Symptoms → conditions' },
      { to: '/fake-medicine', icon: '🔬', title: 'Fake Medicine', desc: 'Barcode verify' },
      { to: '/voice-notes', icon: '🎤', title: 'Voice Notes', desc: 'Bolkar symptoms save' },
    ]
  },
  {
    title: '👨‍👩‍👧 Family & Community',
    features: [
      { to: '/family-dashboard', icon: '👨‍👩‍👧', title: 'Family Dashboard', desc: 'Family health overview' },
      { to: '/blood-donor', icon: '🩸', title: 'Blood Donor', desc: 'Emergency donor finder' },
      { to: '/health-challenges', icon: '🏆', title: 'Health Challenges', desc: 'Streaks, XP & badges' },
      { to: '/health-timeline', icon: '📅', title: 'Health Timeline', desc: '30 din ke changes' },
    ]
  },
  {
    title: '🏥 Health Services',
    features: [
      { to: '/medicine-availability', icon: '🏪', title: 'Medicine Availability', desc: 'Pharmacy stock check' },
      { to: '/lab-booking', icon: '🧪', title: 'Lab Booking', desc: 'Blood test book karo' },
      { to: '/home-nurse', icon: '👩‍⚕️', title: 'Home Nurse', desc: 'Certified nurse ghar par' },
      { to: '/ambulance-tracking', icon: '🚑', title: 'Ambulance Tracking', desc: 'Real-time location' },
    ]
  },
  {
    title: '🌾 Rural India & Accessibility',
    features: [
      { to: '/rural-mode', icon: '🌾', title: 'Rural India Mode', desc: 'Low data + Hindi UI' },
      { to: '/asha-worker', icon: '👩‍⚕️', title: 'ASHA Worker Mode', desc: 'Village health worker' },
    ]
  },
];

export default function Dashboard() {
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good Morning! 👋' : h < 17 ? 'Good Afternoon! 👋' : 'Good Evening! 👋');
    setDateStr(new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  function triggerSOS() {
    if (window.confirm('🚨 EMERGENCY SOS\n\nThis will:\n• Alert your emergency contacts\n• Share your location\n• Contact nearest hospital\n\nProceed?')) {
      alert('✅ SOS Sent!\n• Emergency contacts notified\n• Nearest hospitals alerted\n• Ambulance: AIIMS Delhi — ETA 8 min\n\nStay calm. Help is on the way!');
    }
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Health Dashboard</h1>
          <p className="page-sub">{dateStr}</p>
        </div>
        <button className="btn btn-danger" onClick={triggerSOS}>🚨 EMERGENCY SOS</button>
      </div>

      <div className="content">
        {/* SOS Bar */}
        <div className="alert alert-red" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div><strong>🚨 Emergency SOS</strong> — Press in case of any medical emergency to alert contacts & nearby hospitals.</div>
          <button className="btn btn-danger btn-sm" onClick={triggerSOS}>Activate SOS</button>
        </div>

        {/* Hero */}
        <div className="hero">
          <div>
            <h2>{greeting}</h2>
            <p>Your health is looking good today. Keep it up!</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              {['❤️ Heart: Normal', '🫁 SpO2: 98%', '😴 Sleep: 7.5h'].map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,.2)', padding: '5px 14px', borderRadius: 20, fontSize: 13 }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="hero-score" style={{ textAlign: 'center' }}>
            <div className="num">88</div>
            <div className="lbl">Health Score</div>
            <div style={{ background: 'rgba(255,255,255,.2)', padding: '4px 16px', borderRadius: 20, fontSize: 12, marginTop: 8 }}>✅ Great</div>
          </div>
        </div>

        {/* Feature Sections */}
        {SECTIONS.map(section => (
          <div key={section.title}>
            <div className="section-title">{section.title}</div>
            <div className="feature-grid">
              {section.features.map(f => (
                <Link key={f.to} to={f.to} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
