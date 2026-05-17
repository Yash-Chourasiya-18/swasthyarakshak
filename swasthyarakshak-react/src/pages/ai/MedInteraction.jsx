import { useState } from 'react';
import { Link } from 'react-router-dom';

const MEDS = ['Paracetamol','Ibuprofen','Aspirin','Metformin','Glipizide','Insulin','Amlodipine','Atenolol','Losartan','Metoprolol','Atorvastatin','Rosuvastatin','Omeprazole','Pantoprazole','Azithromycin','Amoxicillin','Ciprofloxacin','Metronidazole','Cefixime','Doxycycline','Warfarin','Clopidogrel','Digoxin','Furosemide','Spironolactone','Levothyroxine','Prednisolone','Dexamethasone','Alprazolam','Diazepam','Cetirizine','Montelukast','Salbutamol','Ranitidine','Domperidone'];

const INTERACTIONS = [
  { meds:['Warfarin','Aspirin'], severity:'severe', effect:'Increased bleeding risk — may cause internal hemorrhage', action:'Avoid combination. Use with extreme caution under doctor supervision.' },
  { meds:['Warfarin','Ibuprofen'], severity:'severe', effect:'Significantly increases anticoagulation, risk of serious bleeding', action:'Avoid. Use Paracetamol instead if pain relief needed.' },
  { meds:['Metformin','Furosemide'], severity:'moderate', effect:'Furosemide may increase metformin concentration → lactic acidosis risk', action:'Monitor kidney function regularly. Adjust dose if needed.' },
  { meds:['Amlodipine','Atorvastatin'], severity:'moderate', effect:'Amlodipine may increase atorvastatin levels (CYP3A4 inhibition)', action:'Limit atorvastatin to 20mg/day when used with amlodipine.' },
  { meds:['Aspirin','Ibuprofen'], severity:'moderate', effect:'Ibuprofen reduces aspirin\'s antiplatelet effect (cardiac protection)', action:'Take aspirin 2 hours before ibuprofen or avoid combination.' },
  { meds:['Alprazolam','Ciprofloxacin'], severity:'moderate', effect:'Ciprofloxacin increases alprazolam levels → excessive sedation', action:'Reduce benzodiazepine dose or choose different antibiotic.' },
  { meds:['Digoxin','Furosemide'], severity:'severe', effect:'Furosemide causes potassium loss → increased digoxin toxicity', action:'Monitor potassium levels closely. Supplement K+ if needed.' },
  { meds:['Metformin','Alcohol'], severity:'moderate', effect:'Increases risk of lactic acidosis significantly', action:'Avoid alcohol while on metformin.' },
  { meds:['Warfarin','Azithromycin'], severity:'severe', effect:'Azithromycin enhances warfarin anticoagulation → bleeding risk', action:'Monitor INR closely. May need dose reduction.' },
  { meds:['Atenolol','Dexamethasone'], severity:'moderate', effect:'Corticosteroids reduce antihypertensive effect of beta-blockers', action:'Monitor BP closely when both are used together.' },
  { meds:['Levothyroxine','Calcium'], severity:'minor', effect:'Calcium reduces levothyroxine absorption', action:'Take levothyroxine 4 hours apart from calcium supplements.' },
  { meds:['Ciprofloxacin','Antacids'], severity:'moderate', effect:'Antacids reduce ciprofloxacin absorption significantly', action:'Take ciprofloxacin 2 hours before or 6 hours after antacids.' },
];

export default function MedInteraction() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [checked, setChecked] = useState(false);

  const filtered = MEDS.filter(m => m.toLowerCase().includes(search.toLowerCase()) && !selected.includes(m));
  function toggle(m) { setSelected(prev => prev.includes(m) ? prev.filter(x=>x!==m) : [...prev,m]); }

  function checkInteractions() {
    if (selected.length < 2) return alert('Kam se kam 2 medicines select karo.');
    const found = INTERACTIONS.filter(i => i.meds.every(m => selected.some(s => s.toLowerCase() === m.toLowerCase())));
    setResults(found); setChecked(true);
  }

  const sevColor = { severe:'#fee2e2', moderate:'#fef3c7', minor:'#dcfce7' };
  const sevText = { severe:'#991b1b', moderate:'#92400e', minor:'#166534' };

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">💊 Medicine Interaction</h1><p className="page-sub">Dangerous drug combination checker</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-yellow">⚠️ This tool provides general guidance only. Always consult your doctor before changing medications.</div>
        <div className="grid-2">
          <div className="card">
            <div className="card-title">💊 Select Medicines ({selected.length} selected)</div>
            <input className="input mb-3" placeholder="🔍 Search medicine..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12}} />
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12, maxHeight:200, overflowY:'auto' }}>
              {filtered.map(m => <span key={m} className="tag" onClick={()=>toggle(m)}>{m}</span>)}
            </div>
            {selected.length > 0 && <>
              <div className="card-title" style={{fontSize:13}}>✅ Selected:</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {selected.map(m => <span key={m} className="tag selected" onClick={()=>toggle(m)}>{m} ✕</span>)}
              </div>
            </>}
            <button className="btn btn-danger w-full mt-3" onClick={checkInteractions}>⚠️ Check Interactions</button>
            {selected.length > 0 && <button className="btn btn-outline w-full mt-2" onClick={()=>{setSelected([]);setResults([]);setChecked(false);}}>🗑️ Clear</button>}
          </div>
          <div className="card">
            <div className="card-title">⚠️ Interaction Results</div>
            {!checked && <p className="muted text-sm">Select medicines and click "Check Interactions".</p>}
            {checked && results.length === 0 && <div className="alert alert-green">✅ No known interactions found between selected medicines. Still, consult your doctor.</div>}
            {results.map((r,i) => (
              <div key={i} style={{ border:`2px solid ${r.severity==='severe'?'#fca5a5':'#fde68a'}`, borderRadius:10, padding:14, marginBottom:10 }}>
                <div className="flex-between" style={{marginBottom:8}}>
                  <div style={{fontWeight:700}}>💊 {r.meds.join(' + ')}</div>
                  <span style={{background:sevColor[r.severity],color:sevText[r.severity],padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:800,textTransform:'uppercase'}}>{r.severity}</span>
                </div>
                <div style={{fontSize:13,marginBottom:6}}><strong>Effect:</strong> {r.effect}</div>
                <div style={{fontSize:13,background:'#f1f5f9',padding:'8px 12px',borderRadius:8}}><strong>Action:</strong> {r.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
