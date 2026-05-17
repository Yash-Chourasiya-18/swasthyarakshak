import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MOCK_REPLIES = [
  { q: 'blood pressure', a: 'Normal blood pressure 120/80 mmHg hota hai. Agar aapka sys 140 se zyada hai to doctor se milein, namak kam khayein.' },
  { q: 'sugar', a: 'Fasting blood sugar 70-100 mg/dL normal hai. Khana khane ke baad 140 se kam hona chahiye.' },
  { q: 'fever', a: 'Fever (bukhar) hone par halka khana khayein, paracetamol 500mg le sakte hain aur khub saara paani piyein.' },
  { q: 'diet', a: 'Diabetic patients ko green vegetables, oats, daliya, aur kam carb wala khana khana chahiye.' },
  { q: 'hello', a: 'Hello! Main SwasthyaRakshak AI Assistant hoon. Main aapki kya madad kar sakta hoon?' },
  { q: 'namaste', a: 'Namaste! Main SwasthyaRakshak AI Assistant hoon. Aap apne symptoms batayein.' }
];

export default function VoiceAssistant() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Health Assistant. Ask me anything in Hindi or English (e.g., Blood Pressure, Fever, Diet Tips).' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);

  // Text-To-Speech Synthesis helper
  function speak(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN'; // Hindi text synthesis fallback
      window.speechSynthesis.speak(utterance);
    }
  }

  // Web Speech API Voice listener
  function startListening() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return alert('Speech Recognition not supported in this browser. Use Chrome.');
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.lang = 'hi-IN';
    recog.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      recog.stop();
      setListening(false);
      handleSend(text);
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recog.start();
    setListening(true);
  }

  function handleSend(customText) {
    const queryText = (customText || input).trim();
    if (!queryText) return;

    const userMsg = { sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Answer logic
    setTimeout(() => {
      const match = MOCK_REPLIES.find(r => queryText.toLowerCase().includes(r.q));
      const aiReply = match ? match.a : 'Mujhe is baare mein abhi jankari nahi hai, kripya certified doctor se salah lein.';
      
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      speak(aiReply);
    }, 800);
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">🎙️ AI Voice Assistant</h1>
          <p className="page-sub">Interactive Hindi + English healthcare chat companion</p>
        </div>
        <Link to="/" className="btn btn-outline">← Dashboard</Link>
      </div>
      <div className="content">
        <div className="alert alert-blue">
          🎙️ Live TTS System: AI replies will be spoken out loud automatically!
        </div>

        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          {/* Chat Window */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                background: m.sender === 'user' ? '#0ea5e9' : '#f1f5f9',
                color: m.sender === 'user' ? 'white' : '#0f172a',
                padding: '10px 14px', borderRadius: '12px',
                maxWidth: '80%', fontSize: '13px', lineHeight: '1.5'
              }}>
                {m.text}
              </div>
            ))}
          </div>

          {/* Chat input box */}
          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
            <button
              onClick={startListening}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: listening ? '#ef4444' : '#e0f2fe',
                border: 'none', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}
            >
              {listening ? '🔴' : '🎙️'}
            </button>

            <input
              className="input"
              style={{ flex: 1, height: '44px' }}
              placeholder="Ask about BP, Sugar, Fever, Diet..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />

            <button className="btn btn-primary" style={{ height: '44px', padding: '0 16px' }} onClick={() => handleSend()}>
              Send
            </button>
          </div>
        </div>

        {/* Suggestion tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
          {['Bukhar hone par kya kare?', 'Fasting sugar levels', 'Heart patient diet tips', 'Normal Blood Pressure range'].map(tag => (
            <span key={tag} className="tag" onClick={() => { setInput(tag); handleSend(tag); }} style={{ fontSize: '12px', cursor: 'pointer' }}>
              💡 {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
