// ─── Sidebar with collapsible sections ───────────────────────────
function getSidebar(active) {

  const sections = [
    {
      id: 'trackers', icon: '🩺', label: 'Health Trackers',
      links: [
        { id: 'bp',      icon: '❤️',  label: 'BP Tracker',        href: 'bp-tracker.html' },
        { id: 'spo2',    icon: '🫁',  label: 'SpO2 Monitor',      href: 'spo2.html' },
        { id: 'sugar',   icon: '🩸',  label: 'Sugar Tracker',     href: 'sugar-tracker.html' },
        { id: 'water',   icon: '💧',  label: 'Water Intake',      href: 'water-intake.html' },
        { id: 'sleep',   icon: '😴',  label: 'Sleep Monitor',     href: 'sleep-monitor.html' },
        { id: 'steps',   icon: '🏃',  label: 'Step Counter',      href: 'step-counter.html' },
        { id: 'bmi',     icon: '⚖️',  label: 'BMI Calculator',    href: 'bmi-calculator.html' },
        { id: 'mood',    icon: '🧠',  label: 'Mood Journal',      href: 'mood-journal.html' },
        { id: 'women',   icon: '🌸',  label: 'Women Health',      href: 'women-health.html' },
        { id: 'vaccine', icon: '💉',  label: 'Vaccination',       href: 'vaccination.html' },
      ]
    },
    {
      id: 'emergency', icon: '🚨', label: 'Emergency & Safety',
      links: [
        { id: 'fall-detection',    icon: '🫷',  label: 'Fall Detection',    href: 'fall-detection.html' },
        { id: 'crash-detection',   icon: '💥',  label: 'Crash Detection',   href: 'crash-detection.html' },
        { id: 'voice-sos',         icon: '🎙️', label: 'Voice SOS',         href: 'voice-sos.html' },
        { id: 'offline-sos',       icon: '📵',  label: 'Offline Emergency', href: 'offline-sos.html' },
        { id: 'ambulance',         icon: '🚑',  label: 'Live Ambulance',    href: 'ambulance.html' },
        { id: 'medical-id',        icon: '🪪',  label: 'Medical ID',        href: 'medical-id.html' },
        { id: 'emergency-qr',      icon: '📱',  label: 'Emergency QR',      href: 'emergency-qr.html' },
        { id: 'safe-zone',         icon: '🏠',  label: 'Safe Zone Alerts',  href: 'safe-zone.html' },
        { id: 'ambulance-tracking',icon: '📍',  label: 'Ambulance Tracking',href: 'ambulance-tracking.html' },
      ]
    },
    {
      id: 'ai', icon: '🤖', label: 'AI & Smart',
      links: [
        { id: 'ai-risk',         icon: '🤖',  label: 'Disease Risk',       href: 'ai-risk.html' },
        { id: 'ai-diet',         icon: '🥗',  label: 'Diet Planner',       href: 'ai-diet.html' },
        { id: 'ai-workout',      icon: '💪',  label: 'Workout Plan',       href: 'ai-workout.html' },
        { id: 'voice-assistant', icon: '🎙️', label: 'Voice Assistant',    href: 'voice-assistant.html' },
        { id: 'med-interaction', icon: '💊',  label: 'Medicine Interaction',href: 'med-interaction.html' },
        { id: 'ai-report',       icon: '📄',  label: 'Report Scanner',     href: 'ai-report.html' },
        { id: 'symptom-checker', icon: '🔍',  label: 'Symptom Checker',    href: 'symptom-checker.html' },
        { id: 'fake-medicine',   icon: '🔬',  label: 'Fake Medicine',      href: 'fake-medicine.html' },
        { id: 'voice-notes',     icon: '🎤',  label: 'Voice Notes',        href: 'voice-notes.html' },
      ]
    },
    {
      id: 'family', icon: '👨‍👩‍👧', label: 'Family & Community',
      links: [
        { id: 'family',           icon: '👨‍👩‍👧', label: 'Family Dashboard',  href: 'family-dashboard.html' },
        { id: 'blood-donor',      icon: '🩸',  label: 'Blood Donor',        href: 'blood-donor.html' },
        { id: 'challenges',       icon: '🏆',  label: 'Health Challenges',  href: 'health-challenges.html' },
        { id: 'timeline',         icon: '📅',  label: 'Health Timeline',    href: 'health-timeline.html' },
      ]
    },
    {
      id: 'services', icon: '🏥', label: 'Health Services',
      links: [
        { id: 'med-availability', icon: '🏪',  label: 'Medicine Availability', href: 'medicine-availability.html' },
        { id: 'lab-booking',      icon: '🧪',  label: 'Lab Test Booking',       href: 'lab-booking.html' },
        { id: 'home-nurse',       icon: '👩‍⚕️', label: 'Home Nurse',            href: 'home-nurse.html' },
      ]
    },
    {
      id: 'rural', icon: '🌾', label: 'Rural & Accessibility',
      links: [
        { id: 'rural-mode',   icon: '🌾',  label: 'Rural India Mode', href: 'rural-mode.html' },
        { id: 'asha-worker',  icon: '👩‍⚕️', label: 'ASHA Worker Mode', href: 'asha-worker.html' },
      ]
    },
  ];

  // Find which section contains the active page
  const activeSection = sections.find(s => s.links.some(l => l.id === active));
  const activeSectionId = activeSection ? activeSection.id : null;

  const sidebarStyle = `
    <style>
      .nav-group { margin-bottom: 2px; }
      .nav-group-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 9px 16px; cursor: pointer; border-radius: 8px;
        font-size: 11px; font-weight: 700; letter-spacing: .6px;
        text-transform: uppercase; color: var(--gray-500);
        user-select: none; transition: background .15s;
      }
      .nav-group-header:hover { background: var(--gray-100); color: var(--gray-700); }
      .nav-group-header.open { color: var(--primary); }
      .nav-group-header .chevron { font-size: 10px; transition: transform .25s; }
      .nav-group-header.open .chevron { transform: rotate(90deg); }
      .nav-group-links {
        overflow: hidden;
        max-height: 0;
        transition: max-height .3s ease;
      }
      .nav-group-links.open { max-height: 600px; }
      .nav-group-links .nav-item { padding-left: 28px; font-size: 12.5px; }
    </style>
  `;

  const groupsHtml = sections.map(s => {
    const isOpen = s.id === activeSectionId;
    const linksHtml = s.links.map(l =>
      `<a class="nav-item ${l.id === active ? 'active' : ''}" href="${l.href}">${l.icon} ${l.label}</a>`
    ).join('');

    return `
      <div class="nav-group">
        <div class="nav-group-header ${isOpen ? 'open' : ''}" onclick="toggleNavGroup(this)">
          <span>${s.icon} ${s.label}</span>
          <span class="chevron">▶</span>
        </div>
        <div class="nav-group-links ${isOpen ? 'open' : ''}">
          ${linksHtml}
        </div>
      </div>`;
  }).join('');

  return `
    ${sidebarStyle}
    <nav class="sidebar">
      <a class="logo" href="../index.html">🏥 SWASTHYA+</a>
      <a class="nav-item ${active === 'dashboard' ? 'active' : ''}" href="../index.html"
         style="margin:4px 8px 10px;border-radius:8px;font-weight:700;font-size:13px;
                background:${active === 'dashboard' ? 'var(--primary)' : 'transparent'};
                color:${active === 'dashboard' ? 'white' : 'inherit'}">
        🏠 Dashboard
      </a>
      <div style="height:1px;background:var(--gray-100);margin:0 12px 8px"></div>
      ${groupsHtml}
    </nav>`;
}

// ─── Accordion toggle — must be global (called from onclick in injected HTML) ───
function toggleNavGroup(header) {
  const links = header.nextElementSibling;
  const isOpen = links.classList.contains('open');
  // Close all open sections first
  document.querySelectorAll('.nav-group-links.open').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.nav-group-header.open').forEach(el => el.classList.remove('open'));
  // If it was closed, open it now
  if (!isOpen) {
    links.classList.add('open');
    header.classList.add('open');
  }
}

// Storage helpers
function saveData(key, data) {
  const all = JSON.parse(localStorage.getItem(key) || '[]');
  all.unshift({ ...data, time: new Date().toLocaleString() });
  localStorage.setItem(key, JSON.stringify(all.slice(0, 50)));
  return all;
}
function loadData(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

// Bar chart renderer
function renderBarChart(containerId, values, labels, color) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...values, 1);
  el.innerHTML = values.map((v, i) => `
    <div class="bar-item">
      <div class="bar-fill" style="height:${(v/max)*100}%;background:${color};" title="${v}"></div>
      <div class="bar-label">${labels[i]}</div>
    </div>`).join('');
}

// Render log list
function renderLog(containerId, items, renderFn) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.length
    ? items.slice(0, 8).map(renderFn).join('')
    : '<p class="muted text-sm" style="padding:12px 0">No records yet. Add your first entry!</p>';
}

// Mood selector
function selectBigMood(el, val) {
  document.querySelectorAll('.mood-big').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
  window.selectedMood = val;
}

// Tag toggle
function toggleTag(el) { el.classList.toggle('selected'); }
