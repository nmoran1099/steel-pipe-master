import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// STEEL PIPE MASTER - PROFESSIONAL EDITION
// Modern, Clean Learning Platform
// ═══════════════════════════════════════════════════════════════════════════════

// Steel Pipe Database
const PIPE_DATA = {
  sizes: [
    { nps: '1/8"', od: 0.405, dn: 6 }, { nps: '1/4"', od: 0.540, dn: 8 },
    { nps: '3/8"', od: 0.675, dn: 10 }, { nps: '1/2"', od: 0.840, dn: 15 },
    { nps: '3/4"', od: 1.050, dn: 20 }, { nps: '1"', od: 1.315, dn: 25 },
    { nps: '1-1/4"', od: 1.660, dn: 32 }, { nps: '1-1/2"', od: 1.900, dn: 40 },
    { nps: '2"', od: 2.375, dn: 50 }, { nps: '2-1/2"', od: 2.875, dn: 65 },
    { nps: '3"', od: 3.500, dn: 80 }, { nps: '4"', od: 4.500, dn: 100 },
    { nps: '6"', od: 6.625, dn: 150 }, { nps: '8"', od: 8.625, dn: 200 },
    { nps: '10"', od: 10.750, dn: 250 }, { nps: '12"', od: 12.750, dn: 300 },
  ],
  schedules: {
    '1/2"': { sch40: { wt: 0.109, lb: 0.85 }, sch80: { wt: 0.147, lb: 1.09 } },
    '3/4"': { sch40: { wt: 0.113, lb: 1.13 }, sch80: { wt: 0.154, lb: 1.47 } },
    '1"': { sch40: { wt: 0.133, lb: 1.68 }, sch80: { wt: 0.179, lb: 2.17 } },
    '2"': { sch40: { wt: 0.154, lb: 3.65 }, sch80: { wt: 0.218, lb: 5.02 } },
    '3"': { sch40: { wt: 0.216, lb: 7.58 }, sch80: { wt: 0.300, lb: 10.25 } },
    '4"': { sch40: { wt: 0.237, lb: 10.79 }, sch80: { wt: 0.337, lb: 14.98 } },
    '6"': { sch40: { wt: 0.280, lb: 18.97 }, sch80: { wt: 0.432, lb: 28.57 } },
    '8"': { sch40: { wt: 0.322, lb: 28.55 }, sch80: { wt: 0.500, lb: 43.39 } },
  },
  terminology: [
    { term: 'NPS', def: 'Nominal Pipe Size - Standard for designating pipe diameter', cat: 'sizing' },
    { term: 'DN', def: 'Diamètre Nominal - Metric equivalent to NPS in millimeters', cat: 'sizing' },
    { term: 'OD', def: 'Outside Diameter - Actual external measurement', cat: 'dimensions' },
    { term: 'ID', def: 'Inside Diameter - Internal measurement', cat: 'dimensions' },
    { term: 'WT', def: 'Wall Thickness - Thickness of the pipe wall', cat: 'dimensions' },
    { term: 'SCH', def: 'Schedule - Number designating wall thickness', cat: 'sizing' },
    { term: 'STD', def: 'Standard Weight - Equivalent to Schedule 40', cat: 'weight' },
    { term: 'XS', def: 'Extra Strong - Thicker than standard, like Sch 80', cat: 'weight' },
    { term: 'ERW', def: 'Electric Resistance Weld - Manufacturing method', cat: 'manufacturing' },
    { term: 'SMLS', def: 'Seamless - Pipe without welded seam', cat: 'manufacturing' },
    { term: 'PE', def: 'Plain End - Square-cut ends, no threading', cat: 'ends' },
    { term: 'BE', def: 'Beveled End - Prepared for butt welding', cat: 'ends' },
    { term: 'T&C', def: 'Threaded and Coupled - Threaded ends with coupling', cat: 'ends' },
    { term: 'ASTM', def: 'American Society for Testing and Materials', cat: 'standards' },
    { term: 'API', def: 'American Petroleum Institute', cat: 'standards' },
    { term: 'A53', def: 'ASTM spec for welded/seamless steel pipe', cat: 'specs' },
    { term: 'A106', def: 'ASTM spec for seamless high-temp pipe', cat: 'specs' },
    { term: 'MTR', def: 'Mill Test Report - Documents pipe properties', cat: 'testing' },
    { term: 'GALV', def: 'Galvanized - Zinc coated for corrosion resistance', cat: 'coating' },
    { term: 'PSI', def: 'Pounds per Square Inch - Pressure unit', cat: 'units' },
  ],
};

const CERTIFICATIONS = [
  { id: 'basics', name: 'Pipe Fundamentals', color: '#059669', req: { questions: 20, accuracy: 80, streak: 3 } },
  { id: 'schedule', name: 'Schedule Specialist', color: '#2563eb', req: { questions: 30, accuracy: 85, streak: 5 } },
  { id: 'terminology', name: 'Industry Expert', color: '#7c3aed', req: { questions: 50, accuracy: 90, streak: 7 } },
  { id: 'master', name: 'Pipe Master', color: '#dc2626', req: { questions: 100, accuracy: 85, streak: 14 } },
];

const BADGES = [
  { id: 'first', name: 'Getting Started', desc: 'Complete first session' },
  { id: 'streak7', name: '7-Day Streak', desc: 'Practice 7 days in a row' },
  { id: 'streak30', name: '30-Day Streak', desc: 'Practice 30 days in a row' },
  { id: 'perfect', name: 'Perfect Score', desc: 'Get 100% on a session' },
  { id: 'dedicated', name: 'Dedicated Learner', desc: 'Answer 100 questions' },
  { id: 'expert', name: 'Subject Expert', desc: 'Answer 500 questions' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const genId = () => Math.random().toString(36).substr(2, 9);

const genQuestions = (custom = []) => {
  const q = [];
  
  PIPE_DATA.sizes.forEach(s => {
    q.push({
      id: `od_${s.nps}`, cat: 'dimensions', diff: 'beginner',
      q: `What is the Outside Diameter of ${s.nps} NPS pipe?`,
      a: `${s.od}"`,
      opts: shuffle([`${s.od}"`, `${(s.od + 0.1).toFixed(3)}"`, `${(s.od - 0.1).toFixed(3)}"`, `${(s.od + 0.25).toFixed(3)}"`]),
      hint: 'Refer to the ASME B36.10 standard pipe chart'
    });
  });
  
  Object.entries(PIPE_DATA.schedules).forEach(([nps, sch]) => {
    q.push({
      id: `wt40_${nps}`, cat: 'schedules', diff: 'intermediate',
      q: `What is the wall thickness of ${nps} Schedule 40 pipe?`,
      a: `${sch.sch40.wt}"`,
      opts: shuffle([`${sch.sch40.wt}"`, `${sch.sch80.wt}"`, `${(sch.sch40.wt + 0.02).toFixed(3)}"`, `${(sch.sch40.wt - 0.02).toFixed(3)}"`]),
      hint: 'Schedule 40 is the standard weight designation'
    });
    q.push({
      id: `lb_${nps}`, cat: 'weight', diff: 'advanced',
      q: `What is the weight per foot of ${nps} Schedule 40 pipe?`,
      a: `${sch.sch40.lb} lb/ft`,
      opts: shuffle([`${sch.sch40.lb} lb/ft`, `${sch.sch80.lb} lb/ft`, `${(sch.sch40.lb + 1).toFixed(2)} lb/ft`, `${(sch.sch40.lb - 1).toFixed(2)} lb/ft`]),
      hint: 'Weight depends on wall thickness and diameter'
    });
  });
  
  PIPE_DATA.terminology.forEach(t => {
    q.push({
      id: `term_${t.term}`, cat: 'terminology', diff: t.cat === 'sizing' ? 'beginner' : 'intermediate',
      q: `What does "${t.term}" stand for in pipe specifications?`,
      a: t.def,
      opts: shuffle([t.def, ...PIPE_DATA.terminology.filter(x => x.term !== t.term).slice(0, 3).map(x => x.def)]),
      hint: `This term relates to ${t.cat}`
    });
  });
  
  return [...q, ...custom.map(c => ({ ...c, isCustom: true }))];
};

const calcNextReview = (card, correct) => {
  let { ease = 2.5, interval = 1, reps = 0 } = card;
  if (correct) {
    reps === 0 ? interval = 1 : reps === 1 ? interval = 6 : interval = Math.round(interval * ease);
    reps++;
    ease = Math.max(1.3, ease + 0.1);
  } else {
    reps = 0; interval = 1;
  }
  return { ease, interval, reps, next: Date.now() + interval * 86400000 };
};

const mockLeaderboard = [
  { id: '1', name: 'Michael Thompson', company: 'Acme Piping Inc.', xp: 12450, streak: 45 },
  { id: '2', name: 'Sarah Chen', company: 'Industrial Supply Co.', xp: 11200, streak: 38 },
  { id: '3', name: 'James Wilson', company: 'Steel Solutions LLC', xp: 10800, streak: 32 },
  { id: '4', name: 'Emily Davis', company: 'Pipeline Corporation', xp: 9500, streak: 28 },
  { id: '5', name: 'Robert Brown', company: 'Pipeline Masters', xp: 8200, streak: 21 },
  { id: '6', name: 'Lisa Martinez', company: 'Acme Piping Inc.', xp: 7800, streak: 19 },
  { id: '7', name: 'David Kim', company: 'Steel Solutions LLC', xp: 6500, streak: 15 },
];

// SVG Icons
const Icon = ({ name, size = 20 }) => {
  const icons = {
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V11c0-.6-.4-1-1-1H7a1 1 0 0 0-1 1v11"/><path d="M18 22V11c0-.6-.4-1-1-1h-2a1 1 0 0 0-1 1v11"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    award: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  };
  return icons[name] || null;
};

export default function SteelPipeMaster() {
  const [auth, setAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home');
  const [questions] = useState(genQuestions());
  const [cardProgress, setCardProgress] = useState({});
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [showAns, setShowAns] = useState(false);
  const [selected, setSelected] = useState(null);
  const [customQ, setCustomQ] = useState([]);
  const [adminTab, setAdminTab] = useState('questions');
  const [newQ, setNewQ] = useState({ q: '', a: '', opts: ['', '', '', ''], cat: 'terminology', diff: 'beginner', hint: '' });
  
  const level = Math.floor((user?.xp || 0) / 100) + 1;
  const xpProg = (user?.xp || 0) % 100;
  
  const getDue = useCallback((cat = null) => {
    const now = Date.now();
    return questions.filter(q => {
      if (cat && q.cat !== cat) return false;
      const p = cardProgress[q.id];
      return !p || p.next <= now;
    });
  }, [questions, cardProgress]);
  
  const login = (email) => {
    setUser({
      id: genId(), email, name: email.split('@')[0], 
      company: 'Your Company', role: email.includes('admin') ? 'admin' : 'user',
      xp: 0, streak: 0, bestStreak: 0, sessions: 0, questions: 0, perfect: 0,
      badges: [], certs: [], created: Date.now()
    });
    setAuth(true);
  };
  
  const signup = (name, email, company) => {
    setUser({
      id: genId(), email, name, company,
      role: 'user', xp: 0, streak: 0, bestStreak: 0, sessions: 0, questions: 0, perfect: 0,
      badges: [], certs: [], created: Date.now()
    });
    setAuth(true);
  };
  
  const startSession = (cat = null) => {
    const due = getDue(cat);
    const cards = shuffle(due).slice(0, 10);
    if (!cards.length) { alert('No questions due. Check back later!'); return; }
    setSession({ cards, idx: 0, cat });
    setStats({ correct: 0, incorrect: 0 });
    setShowAns(false);
    setSelected(null);
    setView('session');
  };
  
  const answer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const card = session.cards[session.idx];
    const correct = opt === card.a;
    setStats(s => ({ ...s, [correct ? 'correct' : 'incorrect']: s[correct ? 'correct' : 'incorrect'] + 1 }));
    if (correct) setUser(u => ({ ...u, xp: u.xp + 10 }));
    setCardProgress(p => ({ ...p, [card.id]: calcNextReview(p[card.id] || {}, correct) }));
    setShowAns(true);
  };
  
  const nextCard = () => {
    if (session.idx >= session.cards.length - 1) {
      const acc = stats.correct / (stats.correct + stats.incorrect) * 100;
      setUser(u => ({
        ...u, sessions: u.sessions + 1, questions: u.questions + stats.correct + stats.incorrect,
        perfect: u.perfect + (acc === 100 ? 1 : 0),
        streak: acc >= 70 ? u.streak + 1 : u.streak,
        bestStreak: acc >= 70 ? Math.max(u.bestStreak, u.streak + 1) : u.bestStreak,
        xp: u.xp + (acc >= 70 ? 25 : 0)
      }));
      setView('results');
      return;
    }
    setSession(s => ({ ...s, idx: s.idx + 1 }));
    setShowAns(false);
    setSelected(null);
  };
  
  const addQuestion = () => {
    if (!newQ.q || !newQ.a || newQ.opts.some(o => !o)) { alert('Please complete all fields'); return; }
    setCustomQ(c => [...c, { id: genId(), ...newQ, opts: shuffle([newQ.a, ...newQ.opts.slice(1)]), isCustom: true }]);
    setNewQ({ q: '', a: '', opts: ['', '', '', ''], cat: 'terminology', diff: 'beginner', hint: '' });
  };

  // AUTH SCREEN
  const AuthScreen = () => (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">SP</div>
          <h1>Steel Pipe Master</h1>
          <p>Professional Training Platform</p>
        </div>
        
        <div className="tabs">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Sign In</button>
          <button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Create Account</button>
        </div>
        
        {authMode === 'login' ? (
          <form onSubmit={e => { e.preventDefault(); login(e.target.email.value); }}>
            <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@company.com" required /></div>
            <div className="field"><label>Password</label><input name="password" type="password" placeholder="Enter password" required /></div>
            <button type="submit" className="btn-primary">Sign In</button>
            <p className="hint">Demo: Any email works. Add "admin" for admin access.</p>
          </form>
        ) : (
          <form onSubmit={e => { e.preventDefault(); signup(e.target.name.value, e.target.email.value, e.target.company.value); }}>
            <div className="field"><label>Full Name</label><input name="name" placeholder="John Smith" required /></div>
            <div className="field"><label>Company</label><input name="company" placeholder="Acme Piping" required /></div>
            <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@company.com" required /></div>
            <div className="field"><label>Password</label><input name="password" type="password" placeholder="Create password" required /></div>
            <button type="submit" className="btn-primary">Create Account</button>
          </form>
        )}
        
        <div className="divider"><span>or</span></div>
        <div className="sso-row">
          <button onClick={() => login('sso@company.com')}>SSO / SAML</button>
          <button onClick={() => login('google@company.com')}>Google</button>
        </div>
      </div>
    </div>
  );

  // HOME SCREEN
  const HomeScreen = () => (
    <div className="app-layout">
      <header className="topbar">
        <div className="brand"><div className="logo sm">SP</div><span>Steel Pipe Master</span></div>
        <div className="actions">
          {user?.role === 'admin' && <button className="icon-btn" onClick={() => setView('admin')}><Icon name="settings" size={18}/></button>}
          <button className="icon-btn" onClick={() => setView('profile')}><Icon name="user" size={18}/></button>
          <button className="icon-btn" onClick={() => { setAuth(false); setUser(null); }}><Icon name="logout" size={18}/></button>
        </div>
      </header>
      
      <main className="content">
        <div className="welcome">
          <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p>Continue your pipe specifications training</p>
        </div>
        
        <div className="stats-row">
          <div className="stat"><span className="stat-val">{user?.streak || 0}</span><span className="stat-lbl">Day Streak</span></div>
          <div className="stat"><span className="stat-val">{user?.xp || 0}</span><span className="stat-lbl">Points</span></div>
          <div className="stat"><span className="stat-val">{level}</span><span className="stat-lbl">Level</span></div>
          <div className="stat"><span className="stat-val">{user?.sessions || 0}</span><span className="stat-lbl">Sessions</span></div>
        </div>
        
        <div className="practice-card">
          <div><h2>Daily Practice</h2><p>{getDue().length} questions ready for review</p></div>
          <button className="btn-start" onClick={() => startSession()}><Icon name="play" size={16}/> Start</button>
        </div>
        
        <section className="topics">
          <h2>Study by Topic</h2>
          <div className="topics-grid">
            {[
              { id: 'dimensions', name: 'Pipe Dimensions', desc: 'NPS, OD, and sizing', color: '#2563eb' },
              { id: 'schedules', name: 'Schedules', desc: 'Wall thickness standards', color: '#059669' },
              { id: 'terminology', name: 'Industry Terms', desc: 'Abbreviations & specs', color: '#7c3aed' },
              { id: 'weight', name: 'Pipe Weights', desc: 'Weight per foot', color: '#dc2626' },
            ].map(t => (
              <button key={t.id} className="topic-btn" onClick={() => startSession(t.id)}>
                <div className="topic-color" style={{ background: t.color }}/>
                <div className="topic-info"><h3>{t.name}</h3><p>{t.desc}</p></div>
                <span className="topic-count">{getDue(t.id).length}</span>
              </button>
            ))}
          </div>
        </section>
        
        <section className="nav-cards">
          <button onClick={() => setView('leaderboard')}><Icon name="trophy" size={22}/><div><h3>Leaderboard</h3><p>Top performers</p></div></button>
          <button onClick={() => setView('certs')}><Icon name="award" size={22}/><div><h3>Certifications</h3><p>Earn credentials</p></div></button>
          <button onClick={() => setView('badges')}><Icon name="target" size={22}/><div><h3>Achievements</h3><p>Track progress</p></div></button>
          <button onClick={() => setView('reference')}><Icon name="book" size={22}/><div><h3>Reference</h3><p>Pipe data</p></div></button>
        </section>
      </main>
    </div>
  );

  // SESSION SCREEN
  const SessionScreen = () => {
    if (!session) return null;
    const card = session.cards[session.idx];
    const pct = ((session.idx + 1) / session.cards.length) * 100;
    
    return (
      <div className="session-wrap">
        <header className="session-bar">
          <button className="icon-btn" onClick={() => setView('home')}><Icon name="x" size={20}/></button>
          <div className="progress"><div className="prog-bar"><div className="prog-fill" style={{ width: `${pct}%` }}/></div><span>{session.idx + 1} / {session.cards.length}</span></div>
          <span className="score">+{stats.correct * 10}</span>
        </header>
        
        <main className="session-main">
          <div className={`q-card ${showAns ? (selected === card.a ? 'correct' : 'wrong') : ''}`}>
            <div className="q-meta">
              <span className={`diff ${card.diff}`}>{card.diff}</span>
              {card.isCustom && <span className="custom">Custom</span>}
            </div>
            <h2>{card.q}</h2>
            {!showAns && <p className="q-hint">{card.hint}</p>}
            <div className="options">
              {card.opts.map((o, i) => (
                <button key={i} className={`opt ${showAns ? (o === card.a ? 'correct' : selected === o ? 'wrong' : 'dim') : ''}`} onClick={() => answer(o)} disabled={showAns}>
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="opt-text">{o}</span>
                  {showAns && o === card.a && <Icon name="check" size={18}/>}
                </button>
              ))}
            </div>
            {showAns && (
              <div className="feedback-area">
                <div className={`feedback ${selected === card.a ? 'correct' : 'wrong'}`}>
                  {selected === card.a ? 'Correct! +10 points' : 'Incorrect. The correct answer is shown above.'}
                </div>
                <button className="btn-primary" onClick={nextCard}>{session.idx >= session.cards.length - 1 ? 'See Results' : 'Next Question'}</button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  // RESULTS SCREEN
  const ResultsScreen = () => {
    const total = stats.correct + stats.incorrect;
    const acc = total ? Math.round((stats.correct / total) * 100) : 0;
    const passed = acc >= 70;
    
    return (
      <div className="results-wrap">
        <div className="results-card">
          <div className={`results-top ${passed ? 'pass' : 'fail'}`}>
            <h1>{passed ? 'Great Work!' : 'Keep Practicing'}</h1>
            <p>{passed ? 'Session completed successfully' : '70% required to pass'}</p>
          </div>
          
          <div className="score-ring">
            <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" className="bg"/><circle cx="50" cy="50" r="42" className="fg" style={{ strokeDasharray: `${acc * 2.64} 264` }}/></svg>
            <span>{acc}%</span>
          </div>
          
          <div className="results-nums">
            <div className="correct"><span>{stats.correct}</span><small>Correct</small></div>
            <div className="wrong"><span>{stats.incorrect}</span><small>Incorrect</small></div>
          </div>
          
          <div className="rewards">
            <h3>Points Earned</h3>
            <div className="reward-line"><span>Correct answers</span><span>+{stats.correct * 10}</span></div>
            {passed && <div className="reward-line bonus"><span>Completion bonus</span><span>+25</span></div>}
            <div className="reward-total"><span>Total</span><span>+{stats.correct * 10 + (passed ? 25 : 0)}</span></div>
          </div>
          
          <button className="btn-primary" onClick={() => setView('home')}>Back to Dashboard</button>
        </div>
      </div>
    );
  };

  // OTHER SCREENS
  const LeaderboardScreen = () => (
    <div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Leaderboard</h1></header>
      <main>
        <div className="podium">{mockLeaderboard.slice(0, 3).map((u, i) => (<div key={u.id} className={`pod p${i+1}`}><span className="pod-rank">{i+1}</span><div className="pod-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div><span className="pod-name">{u.name.split(' ')[0]}</span><span className="pod-score">{u.xp.toLocaleString()}</span></div>))}</div>
        <div className="lb-list">{mockLeaderboard.slice(3).map((u, i) => (<div key={u.id} className="lb-row"><span className="lb-rank">{i + 4}</span><div className="lb-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div><div className="lb-info"><span className="lb-name">{u.name}</span><span className="lb-company">{u.company}</span></div><div className="lb-right"><span className="lb-score">{u.xp.toLocaleString()} pts</span><span className="lb-streak">{u.streak}d streak</span></div></div>))}</div>
      </main>
    </div>
  );

  const CertsScreen = () => (
    <div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Certifications</h1></header>
      <main>
        <p className="page-intro">Earn professional certifications by demonstrating your expertise.</p>
        <div className="certs-list">{CERTIFICATIONS.map(c => { const prog = Math.floor(Math.random() * 75) + 10; return (
          <div key={c.id} className="cert-item">
            <div className="cert-icon" style={{ background: c.color }}>{c.name[0]}</div>
            <div className="cert-info"><h3>{c.name}</h3><div className="cert-reqs"><span>{c.req.questions}+ questions</span><span>{c.req.accuracy}% accuracy</span><span>{c.req.streak}-day streak</span></div><div className="cert-prog"><div style={{ width: `${prog}%`, background: c.color }}/></div><span className="cert-pct">{prog}% complete</span></div>
            <button className="btn-sm" onClick={() => startSession()}>Practice</button>
          </div>
        );})}</div>
      </main>
    </div>
  );

  const BadgesScreen = () => (
    <div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Achievements</h1></header>
      <main>
        <div className="badges-count"><span>{user?.badges?.length || 0}</span> of {BADGES.length}</div>
        <div className="badges-grid">{BADGES.map(b => (<div key={b.id} className="badge-item locked"><div className="badge-icon">?</div><h4>{b.name}</h4><p>{b.desc}</p></div>))}</div>
      </main>
    </div>
  );

  const AdminScreen = () => (
    <div className="page admin"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Admin</h1></header>
      <div className="admin-tabs">{['questions', 'users', 'analytics'].map(t => (<button key={t} className={adminTab === t ? 'active' : ''} onClick={() => setAdminTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>))}</div>
      <main>
        {adminTab === 'questions' && (<>
          <div className="admin-card"><h2>Add Question</h2>
            <div className="form-row"><div className="field"><label>Category</label><select value={newQ.cat} onChange={e => setNewQ({...newQ, cat: e.target.value})}><option value="terminology">Terminology</option><option value="dimensions">Dimensions</option><option value="schedules">Schedules</option><option value="weight">Weight</option></select></div><div className="field"><label>Difficulty</label><select value={newQ.diff} onChange={e => setNewQ({...newQ, diff: e.target.value})}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div></div>
            <div className="field"><label>Question</label><textarea value={newQ.q} onChange={e => setNewQ({...newQ, q: e.target.value})} placeholder="Enter question..."/></div>
            <div className="field"><label>Correct Answer</label><input value={newQ.a} onChange={e => setNewQ({...newQ, a: e.target.value, opts: [e.target.value, newQ.opts[1], newQ.opts[2], newQ.opts[3]]})} placeholder="Correct answer"/></div>
            <div className="form-row-3"><div className="field"><label>Wrong 2</label><input value={newQ.opts[1]} onChange={e => { const o = [...newQ.opts]; o[1] = e.target.value; setNewQ({...newQ, opts: o}); }}/></div><div className="field"><label>Wrong 3</label><input value={newQ.opts[2]} onChange={e => { const o = [...newQ.opts]; o[2] = e.target.value; setNewQ({...newQ, opts: o}); }}/></div><div className="field"><label>Wrong 4</label><input value={newQ.opts[3]} onChange={e => { const o = [...newQ.opts]; o[3] = e.target.value; setNewQ({...newQ, opts: o}); }}/></div></div>
            <div className="field"><label>Hint</label><input value={newQ.hint} onChange={e => setNewQ({...newQ, hint: e.target.value})} placeholder="Optional hint"/></div>
            <button className="btn-primary" onClick={addQuestion}>Add Question</button>
          </div>
          <div className="admin-card"><h2>Custom Questions ({customQ.length})</h2>{customQ.length === 0 ? <p className="empty">No custom questions yet.</p> : <div className="q-list">{customQ.map(q => (<div key={q.id} className="q-row"><span className={`diff ${q.diff}`}>{q.diff}</span><span className="cat">{q.cat}</span><p>{q.q}</p><button className="btn-del" onClick={() => setCustomQ(c => c.filter(x => x.id !== q.id))}>Delete</button></div>))}</div>}</div>
        </>)}
        {adminTab === 'users' && (<div className="admin-card"><h2>Users</h2><div className="metrics"><div><span>156</span><small>Total</small></div><div><span>42</span><small>Active</small></div><div><span>89%</span><small>Completion</small></div></div><table><thead><tr><th>Name</th><th>Company</th><th>Points</th><th>Status</th></tr></thead><tbody>{mockLeaderboard.map(u => (<tr key={u.id}><td>{u.name}</td><td>{u.company}</td><td>{u.xp.toLocaleString()}</td><td className="active">Active</td></tr>))}</tbody></table></div>)}
        {adminTab === 'analytics' && (<div className="admin-card"><h2>Analytics</h2><p className="empty">Charts and analytics would display here.</p></div>)}
      </main>
    </div>
  );

  const ProfileScreen = () => (
    <div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Profile</h1></header>
      <main className="profile-main">
        <div className="profile-top"><div className="profile-avatar">{user?.name?.split(' ').map(n => n[0]).join('')}</div><h2>{user?.name}</h2><p>{user?.company}</p></div>
        <div className="profile-stats"><div><span>{user?.xp || 0}</span><small>Points</small></div><div><span>{level}</span><small>Level</small></div><div><span>{user?.bestStreak || 0}</span><small>Best Streak</small></div><div><span>{user?.sessions || 0}</span><small>Sessions</small></div></div>
        <div className="profile-actions"><button className="btn-secondary">Edit Profile</button><button className="btn-danger" onClick={() => { setAuth(false); setUser(null); }}>Sign Out</button></div>
      </main>
    </div>
  );

  const ReferenceScreen = () => (
    <div className="page ref"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Reference</h1></header>
      <main>
        <section><h2>NPS to Outside Diameter</h2><div className="table-wrap"><table><thead><tr><th>NPS</th><th>OD</th><th>DN</th></tr></thead><tbody>{PIPE_DATA.sizes.map(s => (<tr key={s.nps}><td>{s.nps}</td><td>{s.od}"</td><td>{s.dn}</td></tr>))}</tbody></table></div></section>
        <section><h2>Schedule Wall Thickness</h2><div className="table-wrap"><table><thead><tr><th>NPS</th><th>Sch40 WT</th><th>Sch40 lb/ft</th><th>Sch80 WT</th><th>Sch80 lb/ft</th></tr></thead><tbody>{Object.entries(PIPE_DATA.schedules).map(([n, d]) => (<tr key={n}><td>{n}</td><td>{d.sch40.wt}"</td><td>{d.sch40.lb}</td><td>{d.sch80.wt}"</td><td>{d.sch80.lb}</td></tr>))}</tbody></table></div></section>
        <section><h2>Terminology</h2><div className="glossary">{PIPE_DATA.terminology.map(t => (<div key={t.term} className="gloss-item"><div className="gloss-top"><span className="gloss-term">{t.term}</span><span className="gloss-cat">{t.cat}</span></div><p>{t.def}</p></div>))}</div></section>
      </main>
    </div>
  );

  // STYLES
  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#f8fafc;--card:#fff;--border:#e2e8f0;--text:#0f172a;--muted:#64748b;--primary:#2563eb;--success:#059669;--error:#dc2626;--radius:10px}
        body{font-family:'Inter',-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
        .app{min-height:100vh}
        
        /* AUTH */
        .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f1f5f9}
        .auth-card{background:var(--card);border-radius:16px;padding:40px;width:100%;max-width:400px;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
        .auth-header{text-align:center;margin-bottom:32px}
        .logo{width:48px;height:48px;background:var(--primary);color:#fff;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;margin-bottom:16px}
        .logo.sm{width:32px;height:32px;font-size:12px;border-radius:8px}
        .auth-header h1{font-size:22px;font-weight:700}
        .auth-header p{color:var(--muted);font-size:14px;margin-top:4px}
        .tabs{display:flex;gap:8px;margin-bottom:24px}
        .tabs button{flex:1;padding:10px;background:transparent;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;color:var(--muted);cursor:pointer}
        .tabs button.active{background:var(--primary);border-color:var(--primary);color:#fff}
        .field{margin-bottom:16px}
        .field label{display:block;font-size:14px;font-weight:500;margin-bottom:6px}
        .field input,.field select,.field textarea{width:100%;padding:11px 14px;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;transition:border .2s,box-shadow .2s}
        .field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,0.1)}
        .field textarea{min-height:80px;resize:vertical}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
        .btn-primary{width:100%;padding:12px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s}
        .btn-primary:hover{background:#1d4ed8}
        .btn-secondary{width:100%;padding:11px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer}
        .btn-danger{width:100%;padding:11px;background:#fff;color:var(--error);border:1px solid var(--error);border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer}
        .btn-sm{padding:8px 16px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer}
        .btn-del{padding:6px 12px;background:transparent;border:1px solid var(--error);border-radius:6px;color:var(--error);font-size:12px;cursor:pointer}
        .hint{text-align:center;font-size:12px;color:var(--muted);margin-top:16px}
        .divider{display:flex;align-items:center;margin:24px 0;color:var(--muted);font-size:13px}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
        .divider span{padding:0 12px}
        .sso-row{display:flex;gap:12px}
        .sso-row button{flex:1;padding:11px;background:#fff;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;cursor:pointer}
        
        /* DASHBOARD */
        .app-layout{min-height:100vh}
        .topbar{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .brand{display:flex;align-items:center;gap:10px;font-weight:600;font-size:15px}
        .actions{display:flex;gap:8px}
        .icon-btn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer}
        .icon-btn:hover{background:var(--bg);color:var(--text)}
        .content{max-width:760px;margin:0 auto;padding:32px 24px}
        .welcome h1{font-size:26px;font-weight:700;margin-bottom:4px}
        .welcome p{color:var(--muted);margin-bottom:28px}
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
        .stat{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}
        .stat-val{display:block;font-size:24px;font-weight:700;color:var(--primary)}
        .stat-lbl{font-size:12px;color:var(--muted)}
        .practice-card{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:22px;margin-bottom:32px}
        .practice-card h2{font-size:17px;margin-bottom:4px}
        .practice-card p{font-size:14px;color:var(--muted)}
        .btn-start{display:flex;align-items:center;gap:8px;padding:12px 22px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer}
        .topics h2{font-size:16px;font-weight:600;margin-bottom:14px}
        .topics-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px}
        .topic-btn{display:flex;align-items:center;gap:14px;padding:18px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:left;transition:border .2s,box-shadow .2s}
        .topic-btn:hover{border-color:var(--primary);box-shadow:0 2px 8px rgba(0,0,0,0.04)}
        .topic-color{width:4px;height:36px;border-radius:2px}
        .topic-info h3{font-size:14px;font-weight:600;margin-bottom:2px}
        .topic-info p{font-size:12px;color:var(--muted)}
        .topic-count{margin-left:auto;font-size:13px;color:var(--muted);background:var(--bg);padding:4px 10px;border-radius:16px}
        .nav-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .nav-cards button{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 14px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:center;color:var(--muted);transition:border .2s,color .2s}
        .nav-cards button:hover{border-color:var(--primary);color:var(--primary)}
        .nav-cards h3{font-size:13px;font-weight:600;color:var(--text)}
        .nav-cards p{font-size:11px}
        
        /* SESSION */
        .session-wrap{min-height:100vh;background:var(--bg)}
        .session-bar{display:flex;align-items:center;gap:18px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .progress{flex:1}
        .prog-bar{height:6px;background:var(--bg);border-radius:3px;overflow:hidden}
        .prog-fill{height:100%;background:var(--primary);transition:width .3s}
        .progress span{display:block;font-size:12px;color:var(--muted);margin-top:6px;text-align:center}
        .score{font-weight:600;color:var(--success)}
        .session-main{max-width:580px;margin:40px auto;padding:0 24px}
        .q-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:28px;transition:border .3s}
        .q-card.correct{border-color:var(--success)}
        .q-card.wrong{border-color:var(--error)}
        .q-meta{display:flex;gap:8px;margin-bottom:16px}
        .diff,.custom{padding:4px 12px;border-radius:16px;font-size:12px;font-weight:500;text-transform:capitalize}
        .diff.beginner{background:#dcfce7;color:#059669}
        .diff.intermediate{background:#fef3c7;color:#d97706}
        .diff.advanced{background:#fee2e2;color:#dc2626}
        .custom{background:#ede9fe;color:#7c3aed}
        .q-card h2{font-size:18px;font-weight:600;line-height:1.5;margin-bottom:10px}
        .q-hint{font-size:14px;color:var(--muted);background:var(--bg);padding:12px 14px;border-radius:8px;margin-bottom:20px}
        .options{display:flex;flex-direction:column;gap:10px}
        .opt{display:flex;align-items:center;gap:12px;padding:14px;background:#fff;border:1px solid var(--border);border-radius:8px;cursor:pointer;text-align:left;font-family:inherit;font-size:14px;transition:border .2s,background .2s}
        .opt:hover:not(:disabled){border-color:var(--primary);background:#f8fafc}
        .opt.correct{border-color:var(--success);background:#dcfce7}
        .opt.wrong{border-color:var(--error);background:#fee2e2}
        .opt.dim{opacity:.5}
        .opt-letter{width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:var(--bg);border-radius:6px;font-weight:600;font-size:12px;color:var(--muted)}
        .opt-text{flex:1}
        .feedback-area{margin-top:20px}
        .feedback{padding:14px;border-radius:8px;font-weight:500;margin-bottom:14px}
        .feedback.correct{background:#dcfce7;color:var(--success)}
        .feedback.wrong{background:#fee2e2;color:var(--error)}
        
        /* RESULTS */
        .results-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg)}
        .results-card{background:#fff;border-radius:var(--radius);padding:36px;width:100%;max-width:380px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.06)}
        .results-top{margin-bottom:28px}
        .results-top h1{font-size:22px;margin-bottom:4px}
        .results-top.pass h1{color:var(--success)}
        .results-top p{color:var(--muted);font-size:14px}
        .score-ring{position:relative;width:120px;height:120px;margin:0 auto 24px}
        .score-ring svg{transform:rotate(-90deg)}
        .score-ring .bg{fill:none;stroke:var(--bg);stroke-width:10}
        .score-ring .fg{fill:none;stroke:var(--success);stroke-width:10;stroke-linecap:round;transition:stroke-dasharray 1s}
        .score-ring span{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:32px;font-weight:700}
        .results-nums{display:flex;justify-content:center;gap:40px;margin-bottom:24px}
        .results-nums>div{text-align:center}
        .results-nums span{display:block;font-size:28px;font-weight:700}
        .results-nums .correct span{color:var(--success)}
        .results-nums .wrong span{color:var(--error)}
        .results-nums small{font-size:13px;color:var(--muted)}
        .rewards{background:var(--bg);border-radius:8px;padding:18px;margin-bottom:20px;text-align:left}
        .rewards h3{font-size:13px;font-weight:600;margin-bottom:12px;color:var(--muted)}
        .reward-line{display:flex;justify-content:space-between;font-size:14px;padding:6px 0;color:var(--muted)}
        .reward-line.bonus{color:var(--success)}
        .reward-total{display:flex;justify-content:space-between;padding-top:12px;margin-top:8px;border-top:1px solid var(--border);font-weight:600;color:var(--text)}
        
        /* PAGE LAYOUT */
        .page{min-height:100vh;background:var(--bg)}
        .page header{display:flex;align-items:center;gap:14px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .page header h1{font-size:17px}
        .page main{max-width:760px;margin:0 auto;padding:28px 24px}
        .page-intro{color:var(--muted);font-size:14px;margin-bottom:24px}
        
        /* LEADERBOARD */
        .podium{display:flex;justify-content:center;align-items:flex-end;gap:14px;margin-bottom:28px}
        .pod{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center;width:100px}
        .pod.p1{order:2;transform:scale(1.08);border-color:#f59e0b}
        .pod.p2{order:1}
        .pod.p3{order:3}
        .pod-rank{width:28px;height:28px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:13px}
        .p1 .pod-rank{background:#fef3c7;color:#d97706}
        .p2 .pod-rank{background:#f1f5f9;color:#64748b}
        .p3 .pod-rank{background:#fed7aa;color:#c2410c}
        .pod-avatar{width:40px;height:40px;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;background:var(--bg);border-radius:50%;font-weight:600;font-size:13px;color:var(--muted)}
        .pod-name{font-weight:600;font-size:13px}
        .pod-score{font-size:12px;color:var(--muted)}
        .lb-list{display:flex;flex-direction:column;gap:8px}
        .lb-row{display:flex;align-items:center;gap:14px;padding:14px 18px;background:#fff;border:1px solid var(--border);border-radius:8px}
        .lb-rank{width:22px;font-weight:600;color:var(--muted);font-size:14px}
        .lb-avatar{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--bg);border-radius:50%;font-weight:500;font-size:13px;color:var(--muted)}
        .lb-info{flex:1}
        .lb-name{display:block;font-weight:600;font-size:14px}
        .lb-company{font-size:12px;color:var(--muted)}
        .lb-right{text-align:right}
        .lb-score{display:block;font-weight:600;font-size:13px}
        .lb-streak{font-size:11px;color:var(--muted)}
        
        /* CERTS */
        .certs-list{display:flex;flex-direction:column;gap:14px}
        .cert-item{display:flex;align-items:center;gap:18px;padding:20px;background:#fff;border:1px solid var(--border);border-radius:var(--radius)}
        .cert-icon{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:10px;color:#fff;font-weight:700;font-size:18px}
        .cert-info{flex:1}
        .cert-info h3{font-size:15px;font-weight:600;margin-bottom:6px}
        .cert-reqs{display:flex;gap:12px;font-size:12px;color:var(--muted);margin-bottom:10px}
        .cert-prog{height:6px;background:var(--bg);border-radius:3px;overflow:hidden}
        .cert-prog div{height:100%}
        .cert-pct{font-size:12px;color:var(--muted);margin-top:6px;display:inline-block}
        
        /* BADGES */
        .badges-count{text-align:center;margin-bottom:28px}
        .badges-count span{font-size:42px;font-weight:700;color:var(--primary)}
        .badges-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
        .badge-item{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center}
        .badge-item.locked{opacity:.5}
        .badge-icon{width:44px;height:44px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;background:var(--bg);border-radius:50%;font-size:18px;font-weight:600}
        .badge-item h4{font-size:13px;margin-bottom:4px}
        .badge-item p{font-size:11px;color:var(--muted)}
        
        /* ADMIN */
        .admin-tabs{display:flex;gap:8px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .admin-tabs button{padding:9px 18px;background:transparent;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;color:var(--muted);cursor:pointer}
        .admin-tabs button.active{background:var(--primary);border-color:var(--primary);color:#fff}
        .admin-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:20px}
        .admin-card h2{font-size:16px;font-weight:600;margin-bottom:18px}
        .empty{text-align:center;color:var(--muted);padding:32px}
        .q-list{display:flex;flex-direction:column;gap:10px}
        .q-row{display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg);border-radius:8px}
        .q-row p{flex:1;font-size:13px;margin:0}
        .cat{padding:2px 10px;background:#e2e8f0;border-radius:4px;font-size:11px;color:var(--muted)}
        .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
        .metrics>div{background:var(--bg);border-radius:8px;padding:18px;text-align:center}
        .metrics span{display:block;font-size:28px;font-weight:700;color:var(--primary)}
        .metrics small{font-size:12px;color:var(--muted)}
        table{width:100%;border-collapse:collapse}
        th,td{padding:11px 14px;text-align:left;border-bottom:1px solid var(--border);font-size:13px}
        th{background:var(--bg);font-weight:600;color:var(--muted)}
        td.active{color:var(--success);font-weight:500}
        
        /* PROFILE */
        .profile-main{text-align:center}
        .profile-top{margin-bottom:28px}
        .profile-avatar{width:72px;height:72px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:24px;font-weight:600}
        .profile-top h2{font-size:22px;margin-bottom:4px}
        .profile-top p{color:var(--muted);font-size:14px}
        .profile-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
        .profile-stats>div{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}
        .profile-stats span{display:block;font-size:22px;font-weight:700;color:var(--primary)}
        .profile-stats small{font-size:12px;color:var(--muted)}
        .profile-actions{display:flex;flex-direction:column;gap:10px;max-width:300px;margin:0 auto}
        
        /* REFERENCE */
        .ref section{margin-bottom:32px}
        .ref h2{font-size:16px;font-weight:600;margin-bottom:14px}
        .table-wrap{background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
        .glossary{display:grid;gap:10px}
        .gloss-item{background:#fff;border:1px solid var(--border);border-radius:8px;padding:14px}
        .gloss-top{display:flex;align-items:center;gap:10px;margin-bottom:6px}
        .gloss-term{font-weight:600;color:var(--primary)}
        .gloss-cat{font-size:10px;padding:2px 8px;background:var(--bg);border-radius:4px;color:var(--muted);text-transform:uppercase}
        .gloss-item p{font-size:13px;color:var(--muted)}
        
        @media(max-width:768px){
          .stats-row{grid-template-columns:1fr 1fr}
          .topics-grid{grid-template-columns:1fr}
          .nav-cards{grid-template-columns:1fr 1fr}
          .profile-stats{grid-template-columns:1fr 1fr}
          .badges-grid{grid-template-columns:1fr 1fr}
          .form-row,.form-row-3{grid-template-columns:1fr}
          .metrics{grid-template-columns:1fr}
        }
      `}</style>
      
      {!auth ? <AuthScreen /> : (<>
        {view === 'home' && <HomeScreen />}
        {view === 'session' && <SessionScreen />}
        {view === 'results' && <ResultsScreen />}
        {view === 'leaderboard' && <LeaderboardScreen />}
        {view === 'certs' && <CertsScreen />}
        {view === 'badges' && <BadgesScreen />}
        {view === 'admin' && <AdminScreen />}
        {view === 'profile' && <ProfileScreen />}
        {view === 'reference' && <ReferenceScreen />}
      </>)}
    </div>
  );
}
