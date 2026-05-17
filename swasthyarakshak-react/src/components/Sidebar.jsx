import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const SECTIONS = [
  {
    id: 'trackers', icon: '🩺', label: 'Health Trackers',
    links: [
      { to: '/bp-tracker', icon: '❤️', label: 'BP Tracker' },
      { to: '/spo2', icon: '🫁', label: 'SpO2 Monitor' },
      { to: '/sugar-tracker', icon: '🩸', label: 'Sugar Tracker' },
      { to: '/water-intake', icon: '💧', label: 'Water Intake' },
      { to: '/sleep-monitor', icon: '😴', label: 'Sleep Monitor' },
      { to: '/step-counter', icon: '🏃', label: 'Step Counter' },
      { to: '/bmi-calculator', icon: '⚖️', label: 'BMI Calculator' },
      { to: '/mood-journal', icon: '🧠', label: 'Mood Journal' },
      { to: '/women-health', icon: '🌸', label: 'Women Health' },
      { to: '/vaccination', icon: '💉', label: 'Vaccination' },
    ]
  },
  {
    id: 'emergency', icon: '🚨', label: 'Emergency & Safety',
    links: [
      { to: '/fall-detection', icon: '🫷', label: 'Fall Detection' },
      { to: '/crash-detection', icon: '💥', label: 'Crash Detection' },
      { to: '/voice-sos', icon: '🎙️', label: 'Voice SOS' },
      { to: '/offline-sos', icon: '📵', label: 'Offline Emergency' },
      { to: '/ambulance', icon: '🚑', label: 'Live Ambulance' },
      { to: '/medical-id', icon: '🪪', label: 'Medical ID' },
      { to: '/emergency-qr', icon: '📱', label: 'Emergency QR' },
      { to: '/safe-zone', icon: '🏠', label: 'Safe Zone' },
      { to: '/ambulance-tracking', icon: '📍', label: 'Ambulance Tracking' },
    ]
  },
  {
    id: 'ai', icon: '🤖', label: 'AI & Smart',
    links: [
      { to: '/ai-risk', icon: '🤖', label: 'Disease Risk' },
      { to: '/ai-diet', icon: '🥗', label: 'Diet Planner' },
      { to: '/ai-workout', icon: '💪', label: 'Workout Plan' },
      { to: '/voice-assistant', icon: '🎙️', label: 'Voice Assistant' },
      { to: '/med-interaction', icon: '💊', label: 'Medicine Interaction' },
      { to: '/ai-report', icon: '📄', label: 'Report Scanner' },
      { to: '/symptom-checker', icon: '🔍', label: 'Symptom Checker' },
      { to: '/fake-medicine', icon: '🔬', label: 'Fake Medicine' },
      { to: '/voice-notes', icon: '🎤', label: 'Voice Notes' },
    ]
  },
  {
    id: 'family', icon: '👨‍👩‍👧', label: 'Family & Community',
    links: [
      { to: '/family-dashboard', icon: '👨‍👩‍👧', label: 'Family Dashboard' },
      { to: '/blood-donor', icon: '🩸', label: 'Blood Donor' },
      { to: '/health-challenges', icon: '🏆', label: 'Health Challenges' },
      { to: '/health-timeline', icon: '📅', label: 'Health Timeline' },
    ]
  },
  {
    id: 'services', icon: '🏥', label: 'Health Services',
    links: [
      { to: '/medicine-availability', icon: '🏪', label: 'Medicine Availability' },
      { to: '/lab-booking', icon: '🧪', label: 'Lab Booking' },
      { to: '/home-nurse', icon: '👩‍⚕️', label: 'Home Nurse' },
      { to: '/ambulance-tracking', icon: '🚑', label: 'Ambulance Tracking' },
    ]
  },
  {
    id: 'rural', icon: '🌾', label: 'Rural & Accessibility',
    links: [
      { to: '/rural-mode', icon: '🌾', label: 'Rural India Mode' },
      { to: '/asha-worker', icon: '👩‍⚕️', label: 'ASHA Worker Mode' },
    ]
  },
];

export default function Sidebar() {
  const location = useLocation();

  // Auto-open section that contains active route
  const activeSection = SECTIONS.find(s =>
    s.links.some(l => location.pathname === l.to)
  );
  const [openId, setOpenId] = useState(activeSection?.id || null);

  function toggle(id) {
    setOpenId(prev => prev === id ? null : id);
  }

  return (
    <nav className="sidebar">
      <NavLink to="/" className="sidebar-logo">🏥 SWASTHYA+</NavLink>

      <NavLink
        to="/"
        end
        className={({ isActive }) => `sidebar-dashboard ${isActive ? 'active' : ''}`}
      >
        🏠 Dashboard
      </NavLink>

      <div className="sidebar-divider" />

      {SECTIONS.map(section => {
        const isOpen = openId === section.id;
        return (
          <div className="nav-group" key={section.id}>
            <div
              className={`nav-group-header ${isOpen ? 'open' : ''}`}
              onClick={() => toggle(section.id)}
            >
              <span>{section.icon} {section.label}</span>
              <span className="chevron">▶</span>
            </div>
            <div className={`nav-group-links ${isOpen ? 'open' : ''}`}>
              {section.links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
