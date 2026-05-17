import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function OfflineSOS() {
  const [contacts, setContacts] = useState(() => JSON.parse(localStorage.getItem('emergency_contacts')||'[{"name":"Emergency Contact","phone":""}]'));
  const [sent, setSent] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function saveContacts() { localStorage.setItem('emergency_contacts', JSON.stringify(contacts)); setEditMode(false); }

  function updateContact(i, field, val) { setContacts(prev => prev.map((c,j)=>j===i?{...c,[field]:val}:c)); }

  function addContact() { setContacts(prev=>[...prev,{name:'',phone:''}]); }

  function sendSOS() {
    const medID = JSON.parse(localStorage.getItem('medical_id')||'{}');
    const msg = `🚨 EMERGENCY SOS from SwasthyaRakshak+\n${medID.name||'Emergency'} needs help!\nBlood: ${medID.blood||'Unknown'}\nConditions: ${medID.conditions||'None'}\nLocation: https://maps.google.com/?q=28.6139,77.2090\nCall 108 if not reachable.`;
    const validContacts = contacts.filter(c=>c.phone);
    if (validContacts.length === 0) return alert('Pehle emergency contact add karo.');
    // Opens SMS with pre-filled message
    window.location.href = `sms:${validContacts[0].phone}?body=${encodeURIComponent(msg)}`;
    setSent(true);
  }

  return (
    <>
      <div className="topbar">
        <div><h1 className="page-title">📵 Offline Emergency SOS</h1><p className="page-sub">Internet bina SMS se help mangao</p></div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-blue">ℹ️ This uses your phone's SMS app — works without internet. Opens SMS with pre-filled emergency message.</div>
        {sent && <div className="alert alert-green">✅ SMS app opened! Send the message to alert your emergency contacts.</div>}

        <div className="grid-2">
          <div className="card">
            <div className="card-title">🚨 Send Emergency SOS</div>
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:64, marginBottom:12 }}>📵</div>
              <div className="fw-7" style={{ fontSize:16, marginBottom:8 }}>Works Without Internet</div>
              <p className="muted text-sm" style={{ marginBottom:20 }}>Opens SMS with your medical info pre-filled</p>
              <button className="btn btn-danger" style={{ fontSize:16, padding:'14px 32px' }} onClick={sendSOS}>🚨 Send Emergency SMS</button>
            </div>
            <div className="divider"></div>
            <div className="card-title" style={{ fontSize:13 }}>📋 Message Preview</div>
            <div style={{ background:'#f8fafc', borderRadius:8, padding:12, fontSize:12, fontFamily:'monospace', whiteSpace:'pre-line', color:'#334155' }}>
              {`🚨 EMERGENCY SOS — SwasthyaRakshak+
Patient needs help!
Blood Group: ${JSON.parse(localStorage.getItem('medical_id')||'{}').blood||'Unknown'}
Conditions: ${JSON.parse(localStorage.getItem('medical_id')||'{}').conditions||'None'}
Location: Sharing GPS link
Please call 108 immediately.`}
            </div>
          </div>

          <div className="card">
            <div className="flex-between mb-4">
              <div className="card-title" style={{ margin:0 }}>📞 Emergency Contacts</div>
              <button className="btn btn-sm btn-outline" onClick={()=>setEditMode(!editMode)}>{editMode?'✕ Cancel':'✏️ Edit'}</button>
            </div>
            {contacts.map((c,i)=>(
              <div key={i} style={{ border:'1px solid #e2e8f0', borderRadius:8, padding:12, marginBottom:8 }}>
                {editMode ? (
                  <div>
                    <input className="input" style={{ marginBottom:6 }} value={c.name} onChange={e=>updateContact(i,'name',e.target.value)} placeholder="Contact Name" />
                    <input className="input" type="tel" value={c.phone} onChange={e=>updateContact(i,'phone',e.target.value)} placeholder="+91 phone number" />
                  </div>
                ) : (
                  <div className="flex-between">
                    <div><div className="fw-6">{c.name||'Unnamed'}</div><div className="muted text-sm">{c.phone||'No phone set'}</div></div>
                    {c.phone && <a href={`tel:${c.phone}`} className="btn btn-sm btn-success">📞 Call</a>}
                  </div>
                )}
              </div>
            ))}
            {editMode && (
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                <button className="btn btn-outline btn-sm" onClick={addContact}>+ Add Contact</button>
                <button className="btn btn-primary btn-sm" style={{ flex:1 }} onClick={saveContacts}>💾 Save Contacts</button>
              </div>
            )}

            <div className="divider"></div>
            <div className="card-title" style={{ fontSize:13 }}>📞 Emergency Numbers</div>
            {[['108','Ambulance Emergency'],['100','Police'],['1091','Women Helpline'],['14416','Mental Health (iCall)']].map(([n,l])=>(
              <div key={n} className="flex-between" style={{ padding:'8px 0', borderBottom:'1px solid #f1f5f9' }}>
                <span className="text-sm">{l}</span>
                <a href={`tel:${n}`} className="btn btn-sm btn-danger">📞 {n}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
