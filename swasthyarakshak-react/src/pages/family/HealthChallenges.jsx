import { useState } from 'react';
import { Link } from 'react-router-dom';

const CHALLENGES = [
  { id:'steps', icon:'🏃', title:'10K Steps Today', desc:'Walk 10,000 steps', xp:50, target:10000, unit:'steps', key:'activities' },
  { id:'water', icon:'💧', title:'8 Glasses of Water', desc:'Drink 8 glasses today', xp:30, target:8, unit:'glasses', key:'water_logs' },
  { id:'sleep', icon:'😴', title:'8 Hours Sleep', desc:'Get quality sleep', xp:40, target:8, unit:'hours', key:'sleep_logs' },
  { id:'bp', icon:'❤️', title:'Log Blood Pressure', desc:'Check and log your BP', xp:20, target:1, unit:'reading', key:'bp_readings' },
  { id:'mood', icon:'🧠', title:'Daily Mood Log', desc:'Track your mood today', xp:15, target:1, unit:'entry', key:'mood_logs' },
  { id:'noJunk', icon:'🥗', title:'No Junk Food Today', desc:'Eat healthy all day', xp:60, target:1, unit:'day', key:null },
];

const BADGES = [
  { icon:'🌱', label:'Beginner', minXP:0 }, { icon:'⭐', label:'Rising Star', minXP:100 },
  { icon:'💎', label:'Champion', minXP:300 }, { icon:'🏆', label:'Legend', minXP:600 },
  { icon:'🚀', label:'GOAT', minXP:1000 },
];

export default function HealthChallenges() {
  const [xp, setXp] = useState(() => +localStorage.getItem('health_xp')||0);
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('completed_challenges')||'[]'));
  const [streak, setStreak] = useState(() => +localStorage.getItem('streak_days')||0);

  function complete(ch) {
    if (completed.includes(ch.id)) return;
    const newXP = xp + ch.xp;
    const newCompleted = [...completed, ch.id];
    setXp(newXP); setCompleted(newCompleted);
    localStorage.setItem('health_xp', newXP);
    localStorage.setItem('completed_challenges', JSON.stringify(newCompleted));
    alert(`🎉 Challenge Complete!\n"${ch.title}"\n+${ch.xp} XP earned!\n\nTotal XP: ${newXP}`);
  }

  function reset() {
    setXp(0); setCompleted([]);
    localStorage.setItem('health_xp','0');
    localStorage.setItem('completed_challenges','[]');
  }

  const badge = [...BADGES].reverse().find(b => xp >= b.minXP) || BADGES[0];
  const nextBadge = BADGES.find(b => b.minXP > xp);
  const pctToNext = nextBadge ? Math.round(((xp - (badge.minXP)) / (nextBadge.minXP - badge.minXP)) * 100) : 100;
  const todayCompleted = completed.length;

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🏆 Health Challenges</h1><p className="page-sub">Daily streaks, XP points & achievement badges</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        {/* Profile Card */}
        <div style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'white', borderRadius:16, padding:24, marginBottom:16, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
          <div style={{ fontSize:60 }}>{badge.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:22, fontWeight:800 }}>{badge.label}</div>
            <div style={{ opacity:.9, marginBottom:8 }}>Total XP: <strong>{xp}</strong> {nextBadge ? `· Next: ${nextBadge.label} at ${nextBadge.minXP} XP` : '· MAX BADGE!'}</div>
            {nextBadge && (
              <div style={{ background:'rgba(255,255,255,.3)', borderRadius:10, height:10, marginBottom:4 }}>
                <div style={{ background:'white', height:'100%', borderRadius:10, width:`${pctToNext}%`, transition:'.5s' }}></div>
              </div>
            )}
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:36, fontWeight:800 }}>🔥{streak}</div>
            <div style={{ opacity:.8, fontSize:12 }}>Day Streak</div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card yellow"><div className="stat-icon">⚡</div><div className="stat-val">{xp}</div><div className="stat-lbl">Total XP</div></div>
          <div className="stat-card green"><div className="stat-icon">✅</div><div className="stat-val">{todayCompleted}</div><div className="stat-lbl">Completed Today</div></div>
          <div className="stat-card blue"><div className="stat-icon">🎯</div><div className="stat-val">{CHALLENGES.length - todayCompleted}</div><div className="stat-lbl">Remaining</div></div>
          <div className="stat-card purple"><div className="stat-icon">🏅</div><div className="stat-val">{badge.icon}</div><div className="stat-lbl">{badge.label}</div></div>
        </div>

        {/* Challenges */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, marginBottom:16 }}>
          {CHALLENGES.map(ch => {
            const done = completed.includes(ch.id);
            return (
              <div key={ch.id} style={{ border:`2px solid ${done?'#86efac':'#e2e8f0'}`, background:done?'#f0fdf4':'white', borderRadius:12, padding:16, transition:'.2s' }}>
                <div className="flex-between" style={{ marginBottom:8 }}>
                  <div style={{ fontSize:32 }}>{ch.icon}</div>
                  <span style={{ background:done?'#dcfce7':'#fef9c3', color:done?'#166534':'#92400e', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                    {done ? '✅ Done!' : `+${ch.xp} XP`}
                  </span>
                </div>
                <div className="fw-7" style={{ marginBottom:4 }}>{ch.title}</div>
                <div className="muted text-sm" style={{ marginBottom:12 }}>{ch.desc}</div>
                <button className={`btn w-full ${done?'btn-outline':'btn-primary'}`} onClick={()=>complete(ch)} disabled={done}>
                  {done ? '✅ Completed' : '🎯 Mark as Done'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Badges */}
        <div className="card">
          <div className="card-title">🏅 All Badges</div>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {BADGES.map(b=>(
              <div key={b.label} style={{ textAlign:'center', opacity:xp>=b.minXP?1:.3, transition:'.3s' }}>
                <div style={{ fontSize:40 }}>{b.icon}</div>
                <div className="fw-6 text-sm">{b.label}</div>
                <div className="muted text-xs">{b.minXP} XP</div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-outline btn-sm mt-3" onClick={reset}>🔄 Reset Daily Progress</button>
      </div>
    </>
  );
}
