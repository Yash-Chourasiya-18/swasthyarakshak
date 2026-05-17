import { useState } from 'react';
import { Link } from 'react-router-dom';

const MEDICINES = [
  { name:'Paracip 500mg (Paracetamol)', batch:'PCI2034B', exp:'12/2027', price:45, mfg:'Cipla', verified:true },
  { name:'Calpol 500mg (Paracetamol)', batch:'CAL9823A', exp:'08/2026', price:52, mfg:'GSK', verified:true },
  { name:'Dolo 650 (Paracetamol)', batch:'DL2024X', exp:'03/2026', price:30, mfg:'Micro Labs', verified:true },
  { name:'Metformin 500mg', batch:'MET1923', exp:'09/2025', price:28, mfg:'Sun Pharma', verified:true },
  { name:'FAKE-DRUG-XYZ', batch:'FKE0000', exp:'01/2020', price:10, mfg:'Unknown', verified:false },
];

export default function FakeMedicine() {
  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState([]);

  function verify() {
    if (!barcode.trim()) return alert('Barcode number ya medicine name enter karo.');
    const found = MEDICINES.find(m => m.batch.toLowerCase() === barcode.trim().toLowerCase() || m.name.toLowerCase().includes(barcode.trim().toLowerCase()));
    setResult(found || null);
    setSearched(true);
    setHistory(prev => [{ query:barcode, found:!!found, verified:found?.verified, time:new Date().toLocaleTimeString() }, ...prev.slice(0,9)]);
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🔬 Fake Medicine Detector</h1><p className="page-sub">Barcode/batch number se medicine verify karo</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-blue">ℹ️ Enter the batch number from medicine packaging or type the medicine name to verify authenticity.</div>
        <div className="grid-2">
          <div className="card">
            <div className="card-title">🔍 Verify Medicine</div>
            <div className="form-group">
              <label>Batch Number or Medicine Name</label>
              <input className="input" value={barcode} onChange={e=>setBarcode(e.target.value)} placeholder="e.g. PCI2034B or Paracetamol" onKeyDown={e=>e.key==='Enter'&&verify()} />
            </div>
            <button className="btn btn-primary w-full" onClick={verify}>🔬 Verify Medicine</button>
            <div style={{ marginTop:16 }}>
              <div className="card-title" style={{fontSize:13}}>📋 Try These Sample Barcodes:</div>
              {MEDICINES.slice(0,4).map(m=>(
                <div key={m.batch} onClick={()=>setBarcode(m.batch)} style={{ padding:'6px 10px', background:'#f8fafc', borderRadius:6, marginBottom:6, cursor:'pointer', fontSize:12 }}>
                  <span className="fw-6">{m.batch}</span> — {m.name.split('(')[0].trim()}
                </div>
              ))}
              <div onClick={()=>setBarcode('FKE0000')} style={{ padding:'6px 10px', background:'#fee2e2', borderRadius:6, cursor:'pointer', fontSize:12 }}>
                <span className="fw-6">FKE0000</span> — ⚠️ Test FAKE medicine
              </div>
            </div>

            {searched && (
              <div style={{ marginTop:16 }}>
                {result ? (
                  <div style={{ border:`2px solid ${result.verified?'#86efac':'#fca5a5'}`, borderRadius:12, padding:16, background:result.verified?'#f0fdf4':'#fff5f5' }}>
                    <div style={{ fontSize:32, marginBottom:8, textAlign:'center' }}>{result.verified?'✅':'❌'}</div>
                    <div style={{ textAlign:'center', fontSize:18, fontWeight:800, color:result.verified?'#166534':'#991b1b', marginBottom:12 }}>
                      {result.verified ? 'GENUINE MEDICINE' : '⚠️ SUSPECT / FAKE'}
                    </div>
                    {[['Medicine',result.name],['Batch No.',result.batch],['Manufacturer',result.mfg],['Expiry',result.exp],['MRP',`₹${result.price}`]].map(([k,v])=>(
                      <div key={k} className="flex-between" style={{padding:'6px 0',borderBottom:'1px solid rgba(0,0,0,.06)',fontSize:13}}>
                        <span className="muted">{k}</span><span className="fw-6">{v}</span>
                      </div>
                    ))}
                    {!result.verified && <div className="alert alert-red" style={{marginTop:12}}>🚨 Do NOT consume this medicine! Report to nearest pharmacy regulator or call 1800-180-3024 (CDSCO).</div>}
                    {new Date(result.exp.split('/').reverse().join('-')) < new Date() && <div className="alert alert-red" style={{marginTop:8}}>⚠️ EXPIRED MEDICINE! Do not consume.</div>}
                  </div>
                ) : (
                  <div className="alert alert-yellow">⚠️ Batch number "{barcode}" not found in database. Could be a new product or unregistered medicine. Buy from a licensed pharmacy only.</div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">📋 Search History</div>
            {history.length === 0 && <p className="muted text-sm">No searches yet.</p>}
            {history.map((h,i)=>(
              <div key={i} className="list-item">
                <span style={{fontSize:22}}>{h.found?(h.verified?'✅':'❌'):'❓'}</span>
                <div style={{flex:1}}><div className="fw-6">{h.query}</div><div className="muted text-sm">{h.time}</div></div>
                <span style={{background:h.found?(h.verified?'#dcfce7':'#fee2e2'):'#fef3c7',color:h.found?(h.verified?'#166534':'#991b1b'):'#92400e',padding:'2px 10px',borderRadius:12,fontSize:11,fontWeight:700}}>
                  {h.found?(h.verified?'Genuine':'FAKE'):'Not Found'}
                </span>
              </div>
            ))}
            <div className="divider"></div>
            <div className="card-title" style={{fontSize:13}}>⚠️ How to Spot Fake Medicines</div>
            {['Check hologram seal on packaging','Verify batch number on manufacturer site','Unusual spelling or blurry printing = suspicious','Price too low compared to MRP','Buy only from licensed pharmacies'].map((tip,i)=>(
              <div key={i} style={{fontSize:12,padding:'4px 0',borderBottom:'1px solid #f1f5f9'}}><span style={{color:'#ef4444'}}>⚠️</span> {tip}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
