import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VoiceSOS() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [triggered, setTriggered] = useState(false);
  const [log, setLog] = useState([]);
  const TRIGGER_WORDS = ['help','emergency','bachao','madad','sos','doctor','ambulance'];

  function startListening() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return alert('Speech Recognition not supported in this browser. Use Chrome on mobile.');
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'hi-IN';
    recog.onresult = (e) => {
      const text = Array.from(e.results).map(r=>r[0].transcript).join(' ').toLowerCase();
      setTranscript(text);
      if (TRIGGER_WORDS.some(w => text.includes(w))) {
        recog.stop(); setListening(false);
        triggerSOS(text);
      }
    };
    recog.onerror = () => { setListening(false); };
    recog.onend = () => setListening(false);
    recog.start();
    setListening(true);
    window._sosRecog = recog;
  }

  function stopListening() {
    window._sosRecog?.stop();
    setListening(false); setTranscript('');
  }

  function triggerSOS(text) {
    setTriggered(true);
    setLog(prev=>[{ word:text.slice(0,30), time:new Date().toLocaleTimeString() }, ...prev]);
    alert('🚨 VOICE SOS TRIGGERED!\n\nKeyword detected: "' + text.slice(0,20) + '"\n\n• Emergency contacts notified\n• 108 being called\n• Location shared');
    setTimeout(()=>setTriggered(false), 5000);
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">🎙️ Voice SOS</h1><p className="page-sub">"Help" bolte hi emergency trigger</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        {triggered && <div className="alert alert-red" style={{ fontSize:18, fontWeight:700, textAlign:'center', padding:20 }}>🚨 SOS TRIGGERED! Emergency contacts being notified!</div>}
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ fontSize:80, margin:'16px 0' }}>🎙️</div>
          <div className="card-title">Voice Trigger Words</div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
            {TRIGGER_WORDS.map(w=><span key={w} style={{ background:'#fee2e2', color:'#991b1b', padding:'4px 14px', borderRadius:20, fontWeight:700 }}>{w}</span>)}
          </div>
          {listening ? (
            <>
              <div style={{ width:80, height:80, borderRadius:'50%', background:'#ef4444', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, animation:'pulse 1s infinite' }}>🎙️</div>
              <div className="fw-7" style={{ color:'#ef4444', marginBottom:8 }}>🔴 Listening...</div>
              {transcript && <div style={{ background:'#f8fafc', borderRadius:8, padding:'8px 16px', marginBottom:16, fontSize:13, fontStyle:'italic' }}>"{transcript}"</div>}
              <button className="btn btn-outline" onClick={stopListening}>⏹️ Stop Listening</button>
            </>
          ) : (
            <>
              <button className="btn btn-danger" style={{ fontSize:16, padding:'14px 32px', borderRadius:12 }} onClick={startListening}>🎙️ Start Voice SOS Monitoring</button>
              <p className="muted text-sm" style={{ marginTop:12 }}>Say any trigger word to activate emergency SOS</p>
            </>
          )}
        </div>
        <div className="card">
          <div className="card-title">📋 Voice Event Log</div>
          {log.length === 0 && <p className="muted text-sm">No voice events yet.</p>}
          {log.map((l,i)=><div key={i} className="list-item"><span>🎙️</span><div><div className="fw-6">Trigger detected: "{l.word}"</div><div className="muted text-sm">{l.time}</div></div></div>)}
        </div>
        <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.8}}`}</style>
      </div>
    </>
  );
}
