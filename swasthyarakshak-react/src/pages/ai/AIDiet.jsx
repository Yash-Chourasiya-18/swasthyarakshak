import { useState } from 'react';
import { Link } from 'react-router-dom';

const DIET_PLANS = {
  diabetes: {
    label:'Diabetic-Friendly', color:'#fee2e2',
    breakfast:['Oats with nuts & seeds (no sugar)','Moong dal chilla + green chutney','Besan cheela + low-fat curd'],
    lunch:['Brown rice + dal + sabzi + salad','Multigrain roti + mixed dal + karela','Quinoa pulao + raita + cucumber'],
    dinner:['Khichdi + ghee + papad','Jowar roti + palak paneer','Bajra roti + lauki dal'],
    snacks:['Roasted chana','Cucumber + lemon','Buttermilk (no sugar)','Walnut + almonds (soaked)'],
    avoid:['White rice','Maida products','Sweet chai','Fruit juices','Sweets & mithai'],
  },
  hypertension: {
    label:'BP Control Diet', color:'#fee2e2',
    breakfast:['Banana + low-fat milk','Oats porridge + seeds','Upma with vegetables'],
    lunch:['Low-salt dal + sabzi + roti','Vegetable khichdi + curd','Salad bowl with chana'],
    dinner:['Steamed vegetables + chapati','Soup + brown bread','Dal soup + millet roti'],
    snacks:['Banana','Coconut water','Unsalted nuts'],
    avoid:['Salt (extra)','Pickles & papad','Processed foods','Alcohol','Caffeinated drinks'],
  },
  weightloss: {
    label:'Weight Loss Plan', color:'#dcfce7',
    breakfast:['Protein shake + fruits','Boiled eggs + wheat toast','Sprouts chaat + lemon water'],
    lunch:['Salad + grilled paneer','Brown rice + dal (small portion)','Roti + raita + sabzi (1 roti only)'],
    dinner:['Soup + salad only','Boiled vegetables','Low-fat curd + cucumber'],
    snacks:['Apple / Orange','Green tea (no sugar)','Roasted makhana'],
    avoid:['Fried foods','Sugar','White bread','Soft drinks','Late-night eating'],
  },
  general: {
    label:'Balanced Indian Diet', color:'#e0f2fe',
    breakfast:['Poha + peanuts + lemon','Idli + sambhar + chutney','Paratha (with minimal ghee) + curd'],
    lunch:['Dal + chawal + sabzi + roti + salad','Rajma + rice + papad + buttermilk','Chole + bhature (1) + onion salad'],
    dinner:['Khichdi + ghee','Roti + dal makhani','Millet roti + mixed sabzi'],
    snacks:['Fruit salad','Roasted chana + jaggery','Murmura chaat'],
    avoid:['Excess oil','Late-night heavy meals','Processed snacks'],
  },
};

export default function AIDiet() {
  const [condition, setCondition] = useState('general');
  const [dayIdx, setDayIdx] = useState(0);
  const plan = DIET_PLANS[condition];

  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  function getMeal(meals) {
    return meals[dayIdx % meals.length];
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🥗 AI Diet Planner</h1><p className="page-sub">Personalized Indian meal suggestions</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-yellow">⚠️ These are general suggestions. Consult a dietitian for personalized medical nutrition therapy.</div>

        <div className="card mb-4">
          <div className="card-title">🎯 Select Your Health Goal</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
            {Object.entries(DIET_PLANS).map(([key,val])=>(
              <div key={key} onClick={()=>setCondition(key)} style={{ padding:14, border:`2px solid ${condition===key?'#0ea5e9':'#e2e8f0'}`, background:condition===key?'#e0f2fe':val.color+'44', borderRadius:10, cursor:'pointer', transition:'.2s' }}>
                <div className="fw-7">{val.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Day selector */}
        <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
          {DAYS.map((d,i)=><span key={d} className={`tag ${dayIdx===i?'selected':''}`} onClick={()=>setDayIdx(i)}>{d.slice(0,3)}</span>)}
        </div>

        <div className="grid-2">
          <div>
            {[['🌅 Breakfast', plan.breakfast],['☀️ Lunch', plan.lunch],['🌙 Dinner', plan.dinner]].map(([title,meals])=>(
              <div key={title} className="card mb-4">
                <div className="card-title">{title}</div>
                <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>✅ {getMeal(meals)}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>Alternatives:</div>
                {meals.filter(m=>m!==getMeal(meals)).map(m=><div key={m} style={{ padding:'4px 0', fontSize:12, color:'#64748b' }}>• {m}</div>)}
              </div>
            ))}
          </div>
          <div>
            <div className="card mb-4">
              <div className="card-title">🥜 Healthy Snacks</div>
              {plan.snacks.map((s,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:'1px solid #f1f5f9' }}>
                  <span style={{ fontSize:20 }}>🥜</span><span className="text-sm fw-6">{s}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-title">🚫 Foods to Avoid</div>
              {plan.avoid.map((f,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:'1px solid #f1f5f9' }}>
                  <span style={{ fontSize:16 }}>❌</span><span className="text-sm" style={{ color:'#ef4444', fontWeight:600 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
