import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveData, loadData } from '../../utils/storage';

export default function VoiceNotes() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [category, setCategory] = useState('Symptom');
  const [notes, setNotes] = useState(loadData('voice_notes'));

  const CATS = ['Symptom','Medication','Doctor Visit','Pain','Energy Level','Other'];

  function startRecord() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return alert('Speech recognition not supported. Use Chrome on mobile/desktop.');
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'hi-IN'; r.interimResults = true; r.continuous = false;
    r.onresult = e => setTranscript(Array.from(e.results).map(x=>x[0].transcript).join(' '));
    r.onerror = () => setRecording(false);
    r.onend = () => setRecording(false);
    r.start(); setRecording(true); window._noteRecog = r;
  }

  function stopRecord() { window._noteRecog?.stop(); setRecording(false); }

  function saveNote() {
    if (!transcript.trim()) return alert('Pehle kuch bolo ya type karo.');
    const newData = saveData('voice_notes', { transcript, category });
    setNotes(newData); setTranscript('');
    alert('✅ Voice note saved!');
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🎤 Voice Notes</h1><p className="page-sub">Bolkar symptoms save karo — Hindi + English</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="grid-2">
          <div className="card">
            <div className="card-title">🎙️ Record New Note</div>
            <div className="form-group">
              <label>Category</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>
                {CATS.map(c=><span key={c} className={`tag ${category===c?'selected':''}`} onClick={()=>setCategory(c)}>{c}</span>)}
              </div>
            </div>
            <div style={{ textAlign:'center', padding:'24px 0' }}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:recording?'#ef4444':'#e0f2fe', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:36, cursor:'pointer', transition:'.3s', boxShadow:recording?'0 0 0 10px rgba(239,68,68,.2)':'none', animation:recording?'pulse 1s infinite':'none' }}
                onClick={recording?stopRecord:startRecord}>
                🎙️
              </div>
              <div className="fw-7" style={{color:recording?'#ef4444':'#0ea5e9',marginBottom:8}}>
                {recording?'🔴 Recording... (Tap to stop)':'Tap to start recording'}
              </div>
              <div style={{fontSize:12,color:'#64748b'}}>Hindi ya English mein boliye</div>
            </div>
            {transcript && (
              <div>
                <div className="card-title" style={{fontSize:13}}>📝 Transcript:</div>
                <textarea className="input" rows={3} value={transcript} onChange={e=>setTranscript(e.target.value)} />
                <div style={{display:'flex',gap:8,marginTop:8}}>
                  <button className="btn btn-primary" style={{flex:1}} onClick={saveNote}>💾 Save Note</button>
                  <button className="btn btn-outline" onClick={()=>setTranscript('')}>🗑️ Clear</button>
                </div>
              </div>
            )}
            <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 10px rgba(239,68,68,.2)}50%{box-shadow:0 0 0 20px rgba(239,68,68,.05)}}`}</style>
          </div>
          <div className="card">
            <div className="card-title">📋 Saved Voice Notes ({notes.length})</div>
            {notes.length===0&&<p className="muted text-sm">No notes yet. Record your first symptom!</p>}
            {notes.map((n,i)=>(
              <div key={i} style={{border:'1px solid #e2e8f0',borderRadius:8,padding:12,marginBottom:8}}>
                <div className="flex-between" style={{marginBottom:4}}>
                  <span style={{background:'#e0f2fe',color:'#0369a1',padding:'2px 10px',borderRadius:12,fontSize:11,fontWeight:700}}>{n.category}</span>
                  <span className="muted text-xs">{n.time}</span>
                </div>
                <div style={{fontSize:13,lineHeight:1.5}}>"{n.transcript}"</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
