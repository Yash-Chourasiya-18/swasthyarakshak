import { useState } from 'react';
import { Link } from 'react-router-dom';

const PLANS = {
  beginner: {
    label:'Beginner', icon:'🌱', days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    schedule:[
      { day:'Mon', type:'Cardio', exercises:[{name:'Brisk Walk',sets:'30 min',rest:'–'},{name:'Jumping Jacks',sets:'3×20',rest:'30s'},{name:'Spot Jogging',sets:'5 min',rest:'–'}] },
      { day:'Tue', type:'Rest / Light Stretch', exercises:[{name:'Child Pose',sets:'3×30s',rest:'–'},{name:'Cat-Cow Stretch',sets:'5 min',rest:'–'},{name:'Neck Rolls',sets:'5 each',rest:'–'}] },
      { day:'Wed', type:'Strength Basics', exercises:[{name:'Wall Push-ups',sets:'3×10',rest:'30s'},{name:'Chair Squats',sets:'3×12',rest:'30s'},{name:'Glute Bridge',sets:'3×15',rest:'30s'}] },
      { day:'Thu', type:'Cardio', exercises:[{name:'Brisk Walk',sets:'35 min',rest:'–'},{name:'High Knees',sets:'3×20',rest:'30s'},{name:'Arm Circles',sets:'3×20',rest:'–'}] },
      { day:'Fri', type:'Yoga & Flex', exercises:[{name:'Surya Namaskar',sets:'5 rounds',rest:'–'},{name:'Seated Forward Bend',sets:'3×30s',rest:'–'},{name:'Triangle Pose',sets:'2×30s',rest:'–'}] },
      { day:'Sat', type:'Full Body', exercises:[{name:'Squats',sets:'3×15',rest:'45s'},{name:'Push-ups (knees)',sets:'3×10',rest:'30s'},{name:'Plank',sets:'3×20s',rest:'30s'}] },
      { day:'Sun', type:'Rest Day', exercises:[{name:'Deep breathing',sets:'10 min',rest:'–'},{name:'Light walk',sets:'15 min',rest:'–'}] },
    ]
  },
  intermediate: {
    label:'Intermediate', icon:'💪', days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    schedule:[
      { day:'Mon', type:'Upper Body', exercises:[{name:'Push-ups',sets:'4×15',rest:'45s'},{name:'Dumbbell Rows',sets:'3×12',rest:'60s'},{name:'Shoulder Press',sets:'3×12',rest:'60s'}] },
      { day:'Tue', type:'Lower Body', exercises:[{name:'Squats',sets:'4×20',rest:'45s'},{name:'Lunges',sets:'3×15 each',rest:'45s'},{name:'Calf Raises',sets:'3×20',rest:'30s'}] },
      { day:'Wed', type:'Cardio HIIT', exercises:[{name:'Burpees',sets:'4×10',rest:'60s'},{name:'Jump Squats',sets:'3×15',rest:'45s'},{name:'Mountain Climbers',sets:'3×30s',rest:'30s'}] },
      { day:'Thu', type:'Core', exercises:[{name:'Plank',sets:'3×45s',rest:'30s'},{name:'Bicycle Crunches',sets:'3×20',rest:'30s'},{name:'Russian Twists',sets:'3×20',rest:'30s'}] },
      { day:'Fri', type:'Full Body', exercises:[{name:'Deadlift (bodyweight)',sets:'4×15',rest:'60s'},{name:'Pull-ups / Band',sets:'3×8',rest:'60s'},{name:'Dips',sets:'3×12',rest:'45s'}] },
      { day:'Sat', type:'Yoga + Flexibility', exercises:[{name:'Surya Namaskar',sets:'10 rounds',rest:'–'},{name:'Pigeon Pose',sets:'3×45s',rest:'–'},{name:'Warrior Series',sets:'3 min',rest:'–'}] },
      { day:'Sun', type:'Active Recovery', exercises:[{name:'Light cycle / walk',sets:'30 min',rest:'–'},{name:'Foam rolling',sets:'10 min',rest:'–'}] },
    ]
  }
};

const CALORIES = { beginner:250, intermediate:450 };

export default function AIWorkout() {
  const [level, setLevel] = useState('beginner');
  const [dayIdx, setDayIdx] = useState(new Date().getDay()===0?6:new Date().getDay()-1);
  const plan = PLANS[level];
  const today = plan.schedule[dayIdx];

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">💪 Workout Plan</h1><p className="page-sub">Personalized exercise guide</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="card mb-4">
          <div className="card-title">🎯 Select Fitness Level</div>
          <div style={{ display:'flex', gap:12 }}>
            {Object.entries(PLANS).map(([key,p])=>(
              <div key={key} onClick={()=>setLevel(key)} style={{ flex:1, padding:16, border:`2px solid ${level===key?'#0ea5e9':'#e2e8f0'}`, background:level===key?'#e0f2fe':'white', borderRadius:10, cursor:'pointer', textAlign:'center', transition:'.2s' }}>
                <div style={{ fontSize:32 }}>{p.icon}</div>
                <div className="fw-7">{p.label}</div>
                <div className="muted text-sm">{CALORIES[key]} kcal/day</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
          {plan.schedule.map((s,i)=>(
            <span key={s.day} className={`tag ${dayIdx===i?'selected':''}`} onClick={()=>setDayIdx(i)}>{s.day}</span>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="flex-between mb-4">
              <div><div className="card-title" style={{margin:0}}>{today.day} — {today.type}</div></div>
              <span style={{ background:'#e0f2fe', color:'#0369a1', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700 }}>🔥 {CALORIES[level]} kcal</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead><tr style={{ background:'#f1f5f9' }}>{['Exercise','Sets / Duration','Rest'].map(h=><th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:11, textTransform:'uppercase', color:'#64748b', fontWeight:700 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {today.exercises.map((ex,i)=>(
                    <tr key={i} style={{ borderBottom:'1px solid #f1f5f9' }}>
                      <td style={{ padding:'10px 12px', fontWeight:600 }}>💪 {ex.name}</td>
                      <td style={{ padding:'10px 12px', color:'#0ea5e9', fontWeight:700 }}>{ex.sets}</td>
                      <td style={{ padding:'10px 12px', color:'#64748b' }}>{ex.rest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-primary w-full mt-3" onClick={()=>alert(`✅ Workout logged!\n${today.type} — ${CALORIES[level]} kcal\n\nGreat work! Keep it up! 💪`)}>
              ✅ Mark Workout Complete
            </button>
          </div>

          <div>
            <div className="card mb-4">
              <div className="card-title">📅 Weekly Overview</div>
              {plan.schedule.map((s,i)=>(
                <div key={s.day} onClick={()=>setDayIdx(i)} style={{ display:'flex', justifyContent:'space-between', padding:'8px 10px', borderRadius:8, marginBottom:4, cursor:'pointer', background:dayIdx===i?'#e0f2fe':'transparent', transition:'.15s' }}>
                  <span className="fw-6" style={{ color:dayIdx===i?'#0ea5e9':'inherit' }}>{s.day}</span>
                  <span className="muted text-sm">{s.type}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-title">💡 Fitness Tips</div>
              {['Workout karne se pehle 5 min warm-up zaroor karo','Hydration — workout ke doran paani peete raho','Protein-rich khana khao 30 min baad workout ke','Rest day mein body recover karti hai — skip mat karo','Consistency > Intensity — regular rehna zyada zaroori hai'].map((tip,i)=>(
                <div key={i} style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:'1px solid #f1f5f9', fontSize:12 }}>
                  <span>💡</span><span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
