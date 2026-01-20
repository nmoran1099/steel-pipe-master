import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// STEEL PIPE MASTER - ENTERPRISE EDITION
// Complete Learning Platform with User Accounts, Leaderboards, Admin, Certifications
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

// Certifications
const CERTIFICATIONS = [
  { id: 'basics', name: 'Pipe Basics Certified', icon: '🔧', color: '#10b981', req: { questions: 20, accuracy: 80, streak: 3 } },
  { id: 'schedule', name: 'Schedule Specialist', icon: '📊', color: '#3b82f6', req: { questions: 30, accuracy: 85, streak: 5 } },
  { id: 'terminology', name: 'Terminology Expert', icon: '📚', color: '#8b5cf6', req: { questions: 50, accuracy: 90, streak: 7 } },
  { id: 'master', name: 'Pipe Master', icon: '🏆', color: '#f59e0b', req: { questions: 100, accuracy: 85, streak: 14 } },
];

// Badges
const BADGES = [
  { id: 'first', name: 'First Steps', icon: '👣', desc: 'Complete first lesson', check: s => s.sessions >= 1 },
  { id: 'streak7', name: 'Week Warrior', icon: '🔥', desc: '7-day streak', check: s => s.streak >= 7 },
  { id: 'streak30', name: 'Monthly Master', icon: '💪', desc: '30-day streak', check: s => s.streak >= 30 },
  { id: 'perfect', name: 'Perfectionist', icon: '💯', desc: '100% on a session', check: s => s.perfect >= 1 },
  { id: 'xp1k', name: 'XP Hunter', icon: '⚡', desc: 'Earn 1,000 XP', check: s => s.xp >= 1000 },
  { id: 'xp5k', name: 'XP Master', icon: '🌟', desc: 'Earn 5,000 XP', check: s => s.xp >= 5000 },
  { id: 'q100', name: 'Century Club', icon: '📝', desc: 'Answer 100 questions', check: s => s.questions >= 100 },
  { id: 'team', name: 'Team Player', icon: '🤝', desc: 'Join a team', check: s => s.hasTeam },
  { id: 'top10', name: 'Top 10', icon: '🏅', desc: 'Reach top 10', check: s => s.rank <= 10 },
];

// Utilities
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const genId = () => Math.random().toString(36).substr(2, 9);

// Question Generation
const genQuestions = (custom = []) => {
  const q = [];
  
  PIPE_DATA.sizes.forEach(s => {
    q.push({
      id: `od_${s.nps}`, cat: 'dimensions', diff: 'beginner',
      q: `What is the OD of ${s.nps} NPS pipe?`,
      a: `${s.od}"`,
      opts: shuffle([`${s.od}"`, `${(s.od + 0.1).toFixed(3)}"`, `${(s.od - 0.1).toFixed(3)}"`, `${(s.od + 0.25).toFixed(3)}"`]),
      hint: 'Check the standard pipe chart'
    });
    q.push({
      id: `dn_${s.nps}`, cat: 'conversions', diff: 'intermediate',
      q: `What is the DN equivalent of ${s.nps} NPS?`,
      a: `DN ${s.dn}`,
      opts: shuffle([`DN ${s.dn}`, `DN ${s.dn + 5}`, `DN ${s.dn - 5}`, `DN ${Math.round(s.dn * 1.2)}`]),
      hint: 'DN is the metric designation'
    });
  });
  
  Object.entries(PIPE_DATA.schedules).forEach(([nps, sch]) => {
    q.push({
      id: `wt40_${nps}`, cat: 'schedules', diff: 'intermediate',
      q: `Wall thickness of ${nps} Schedule 40?`,
      a: `${sch.sch40.wt}"`,
      opts: shuffle([`${sch.sch40.wt}"`, `${sch.sch80.wt}"`, `${(sch.sch40.wt + 0.02).toFixed(3)}"`, `${(sch.sch40.wt - 0.02).toFixed(3)}"`]),
      hint: 'Schedule 40 is standard weight'
    });
    q.push({
      id: `lb_${nps}`, cat: 'weight', diff: 'advanced',
      q: `Weight per foot of ${nps} Sch 40?`,
      a: `${sch.sch40.lb} lb/ft`,
      opts: shuffle([`${sch.sch40.lb} lb/ft`, `${sch.sch80.lb} lb/ft`, `${(sch.sch40.lb + 1).toFixed(2)} lb/ft`, `${(sch.sch40.lb - 1).toFixed(2)} lb/ft`]),
      hint: 'Consider wall thickness and diameter'
    });
  });
  
  PIPE_DATA.terminology.forEach(t => {
    q.push({
      id: `term_${t.term}`, cat: 'terminology', diff: t.cat === 'sizing' ? 'beginner' : 'intermediate',
      q: `What does "${t.term}" mean?`,
      a: t.def,
      opts: shuffle([t.def, ...PIPE_DATA.terminology.filter(x => x.term !== t.term).slice(0, 3).map(x => x.def)]),
      hint: `Related to ${t.cat}`
    });
  });
  
  return [...q, ...custom.map(c => ({ ...c, isCustom: true }))];
};

// Spaced Repetition
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

// Mock Leaderboard Data
const mockLeaderboard = [
  { id: '1', name: 'Mike Thompson', company: 'Acme Piping', xp: 12450, streak: 45, avatar: '👷' },
  { id: '2', name: 'Sarah Chen', company: 'Industrial Supply', xp: 11200, streak: 38, avatar: '👩‍🔧' },
  { id: '3', name: 'James Wilson', company: 'Steel Solutions', xp: 10800, streak: 32, avatar: '🧑‍🏭' },
  { id: '4', name: 'Emily Davis', company: 'Pipeline Co', xp: 9500, streak: 28, avatar: '👩‍💼' },
  { id: '5', name: 'Robert Brown', company: 'Pipeline Masters', xp: 8200, streak: 21, avatar: '👨‍🔧' },
  { id: '6', name: 'Lisa Martinez', company: 'Acme Piping', xp: 7800, streak: 19, avatar: '👩‍🏭' },
  { id: '7', name: 'David Kim', company: 'Steel Solutions', xp: 6500, streak: 15, avatar: '🧑‍💼' },
  { id: '8', name: 'Jennifer Taylor', company: 'Industrial Supply', xp: 5200, streak: 12, avatar: '👷‍♀️' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function SteelPipeMasterEnterprise() {
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
      id: genId(), email, name: email.split('@')[0], avatar: '👷',
      company: 'Your Company', role: email.includes('admin') ? 'admin' : 'user',
      xp: 0, streak: 0, bestStreak: 0, sessions: 0, questions: 0, perfect: 0,
      badges: [], certs: [], created: Date.now()
    });
    setAuth(true);
  };
  
  const signup = (name, email, company) => {
    setUser({
      id: genId(), email, name, avatar: '👷', company,
      role: 'user', xp: 0, streak: 0, bestStreak: 0, sessions: 0, questions: 0, perfect: 0,
      badges: [], certs: [], created: Date.now()
    });
    setAuth(true);
  };
  
  const startSession = (cat = null) => {
    const due = getDue(cat);
    const cards = shuffle(due).slice(0, 10);
    if (!cards.length) { alert('No cards due!'); return; }
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
        ...u,
        sessions: u.sessions + 1,
        questions: u.questions + stats.correct + stats.incorrect,
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
    if (!newQ.q || !newQ.a || newQ.opts.some(o => !o)) { alert('Fill all fields'); return; }
    const question = { id: genId(), ...newQ, opts: shuffle([newQ.a, ...newQ.opts.slice(1)]), isCustom: true };
    setCustomQ(c => [...c, question]);
    setNewQ({ q: '', a: '', opts: ['', '', '', ''], cat: 'terminology', diff: 'beginner', hint: '' });
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════════

  const AuthScreen = () => (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head">
          <div className="logo-spin">⚙️</div>
          <h1>STEEL PIPE<br/><span className="gold">MASTER</span></h1>
          <p>Enterprise Learning Platform</p>
        </div>
        <div className="auth-tabs">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Sign In</button>
          <button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Create Account</button>
        </div>
        {authMode === 'login' ? (
          <form onSubmit={e => { e.preventDefault(); login(e.target.email.value); }}>
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit" className="btn-primary">Sign In</button>
            <p className="hint">Demo: Any email works. Include "admin" for admin access.</p>
          </form>
        ) : (
          <form onSubmit={e => { e.preventDefault(); signup(e.target.name.value, e.target.email.value, e.target.company.value); }}>
            <input name="name" placeholder="Full Name" required />
            <input name="company" placeholder="Company" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit" className="btn-primary">Create Account</button>
          </form>
        )}
        <div className="sso">
          <span>or continue with</span>
          <div className="sso-btns">
            <button onClick={() => login('sso@company.com')}>🔐 SSO</button>
            <button onClick={() => login('google@company.com')}>🌐 Google</button>
          </div>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="home">
      <header>
        <div className="user-row">
          <span className="avatar">{user?.avatar}</span>
          <div><strong>{user?.name}</strong><br/><small>{user?.company}</small></div>
        </div>
        <div className="actions">
          {user?.role === 'admin' && <button onClick={() => setView('admin')}>⚙️</button>}
          <button onClick={() => setView('profile')}>👤</button>
          <button onClick={() => { setAuth(false); setUser(null); }}>🚪</button>
        </div>
      </header>
      
      <h1 className="title">STEEL PIPE <span className="gold">MASTER</span></h1>
      
      <div className="stats-row">
        <div className="stat"><span className="icon">🔥</span><span className="val">{user?.streak || 0}</span><span className="lbl">STREAK</span></div>
        <div className="stat"><span className="icon">⚡</span><span className="val">{user?.xp || 0}</span><span className="lbl">XP</span></div>
        <div className="stat"><span className="icon">📊</span><span className="val">{level}</span><span className="lbl">LEVEL</span></div>
        <div className="stat"><span className="icon">🏅</span><span className="val">{user?.badges?.length || 0}</span><span className="lbl">BADGES</span></div>
      </div>
      
      <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpProg}%` }} /></div>
      <p className="xp-text">{xpProg}/100 XP to Level {level + 1}</p>
      
      <button className="btn-big" onClick={() => startSession()}>
        <span>▶️</span>
        <div><strong>DAILY PRACTICE</strong><small>{getDue().length} cards due</small></div>
      </button>
      
      <h2>STUDY BY TOPIC</h2>
      <div className="cat-grid">
        {[
          { id: 'dimensions', name: 'Pipe Sizes', icon: '📐', color: '#3b82f6' },
          { id: 'schedules', name: 'Schedules', icon: '📊', color: '#10b981' },
          { id: 'terminology', name: 'Terms', icon: '📚', color: '#f59e0b' },
          { id: 'conversions', name: 'Conversions', icon: '🔄', color: '#8b5cf6' },
          { id: 'weight', name: 'Weights', icon: '⚖️', color: '#ef4444' },
        ].map(c => (
          <button key={c.id} className="cat-card" style={{ '--c': c.color }} onClick={() => startSession(c.id)}>
            <span>{c.icon}</span><span>{c.name}</span><small>{getDue(c.id).length} due</small>
          </button>
        ))}
      </div>
      
      <div className="nav-grid">
        <button onClick={() => setView('leaderboard')}>🏆 Leaderboards</button>
        <button onClick={() => setView('certs')}>📜 Certifications</button>
        <button onClick={() => setView('badges')}>🎖️ Badges</button>
        <button onClick={() => setView('reference')}>📋 Reference</button>
      </div>
    </div>
  );

  const SessionScreen = () => {
    if (!session) return null;
    const card = session.cards[session.idx];
    const prog = ((session.idx + 1) / session.cards.length) * 100;
    
    return (
      <div className="session">
        <header>
          <button onClick={() => setView('home')}>✕</button>
          <div className="prog-wrap">
            <div className="prog-bar"><div className="prog-fill" style={{ width: `${prog}%` }} /></div>
            <span>{session.idx + 1}/{session.cards.length}</span>
          </div>
          <span className="xp-earned">+{stats.correct * 10} XP</span>
        </header>
        
        <div className="card-wrap">
          <div className={`q-card ${showAns ? (selected === card.a ? 'correct' : 'wrong') : ''}`}>
            <div className="meta">
              <span className={`diff ${card.diff}`}>{card.diff.toUpperCase()}</span>
              {card.isCustom && <span className="custom">CUSTOM</span>}
            </div>
            <h2>{card.q}</h2>
            {!showAns && <p className="hint">💡 {card.hint}</p>}
            <div className="opts">
              {card.opts.map((o, i) => (
                <button key={i} className={showAns ? (o === card.a ? 'correct' : selected === o ? 'wrong' : '') : ''} onClick={() => answer(o)} disabled={showAns}>{o}</button>
              ))}
            </div>
            {showAns && (
              <div className="feedback">
                <div className={selected === card.a ? 'fb-correct' : 'fb-wrong'}>
                  {selected === card.a ? '✓ Correct! +10 XP' : `✗ Answer: ${card.a}`}
                </div>
                <button className="btn-continue" onClick={nextCard}>
                  {session.idx >= session.cards.length - 1 ? 'FINISH' : 'CONTINUE'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ResultsScreen = () => {
    const total = stats.correct + stats.incorrect;
    const acc = total ? Math.round((stats.correct / total) * 100) : 0;
    
    return (
      <div className="results">
        <div className="results-card">
          <h1>SESSION COMPLETE!</h1>
          <div className="circle-wrap">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="bg" />
              <circle cx="50" cy="50" r="45" className="fg" strokeDasharray={`${acc * 2.83} 283`} />
            </svg>
            <span className="pct">{acc}%</span>
          </div>
          <p><span className="g">✓</span> {stats.correct} Correct &nbsp; <span className="r">✗</span> {stats.incorrect} Incorrect</p>
          <div className="rewards">
            <h3>REWARDS</h3>
            <p>⚡ +{stats.correct * 10 + (acc >= 70 ? 25 : 0)} XP</p>
            {acc >= 70 && <p className="bonus">🔥 Streak Extended!</p>}
            {acc === 100 && <p className="bonus">💯 Perfect!</p>}
          </div>
          <button className="btn-primary" onClick={() => setView('home')}>BACK TO HOME</button>
        </div>
      </div>
    );
  };

  const LeaderboardScreen = () => (
    <div className="page">
      <header><button onClick={() => setView('home')}>←</button><h1>🏆 LEADERBOARDS</h1></header>
      <div className="podium">
        {mockLeaderboard.slice(0, 3).map((u, i) => (
          <div key={u.id} className={`pod pod-${i + 1}`}>
            <span className="pod-avatar">{u.avatar}</span>
            <span className="pod-name">{u.name}</span>
            <span className="pod-xp">{u.xp.toLocaleString()} XP</span>
            <span className="pod-medal">{['🥇', '🥈', '🥉'][i]}</span>
          </div>
        ))}
      </div>
      <div className="lb-list">
        {mockLeaderboard.slice(3).map((u, i) => (
          <div key={u.id} className="lb-row">
            <span className="rank">{i + 4}</span>
            <span className="avatar">{u.avatar}</span>
            <div className="info"><strong>{u.name}</strong><small>{u.company}</small></div>
            <div className="lb-stats"><span>{u.xp.toLocaleString()} XP</span><small>🔥 {u.streak}</small></div>
          </div>
        ))}
      </div>
    </div>
  );

  const CertsScreen = () => (
    <div className="page">
      <header><button onClick={() => setView('home')}>←</button><h1>📜 CERTIFICATIONS</h1></header>
      <p className="intro">Earn professional certifications by mastering pipe knowledge areas.</p>
      <div className="cert-grid">
        {CERTIFICATIONS.map(c => {
          const earned = user?.certs?.includes(c.id);
          const prog = Math.min(100, Math.floor(Math.random() * 80) + (earned ? 20 : 0));
          return (
            <div key={c.id} className={`cert-card ${earned ? 'earned' : ''}`} style={{ '--c': c.color }}>
              <span className="cert-icon">{c.icon}</span>
              <h3>{c.name}</h3>
              <ul>
                <li>✓ {c.req.questions}+ questions</li>
                <li>✓ {c.req.accuracy}% accuracy</li>
                <li>✓ {c.req.streak}-day streak</li>
              </ul>
              <div className="cert-prog"><div style={{ width: `${prog}%` }} /></div>
              <span className="cert-pct">{prog}%</span>
              {earned ? <div className="cert-badge">✓ CERTIFIED</div> : <button onClick={() => startSession()}>Start Learning</button>}
            </div>
          );
        })}
      </div>
    </div>
  );

  const BadgesScreen = () => (
    <div className="page">
      <header><button onClick={() => setView('home')}>←</button><h1>🎖️ BADGES</h1></header>
      <div className="badge-summary"><span className="big">{user?.badges?.length || 0}</span> / {BADGES.length}</div>
      <div className="badge-grid">
        {BADGES.map(b => {
          const earned = user?.badges?.includes(b.id);
          return (
            <div key={b.id} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
              <span className="badge-icon">{b.icon}</span>
              <h4>{b.name}</h4>
              <p>{b.desc}</p>
              {earned && <span className="check">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );

  const AdminScreen = () => (
    <div className="page admin">
      <header><button onClick={() => setView('home')}>←</button><h1>⚙️ ADMIN DASHBOARD</h1></header>
      <div className="admin-tabs">
        {['questions', 'users', 'analytics', 'settings'].map(t => (
          <button key={t} className={adminTab === t ? 'active' : ''} onClick={() => setAdminTab(t)}>
            {t === 'questions' ? '📝' : t === 'users' ? '👥' : t === 'analytics' ? '📊' : '🔧'} {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      
      {adminTab === 'questions' && (
        <div className="admin-content">
          <div className="add-form">
            <h2>Add Custom Question</h2>
            <div className="row">
              <select value={newQ.cat} onChange={e => setNewQ({ ...newQ, cat: e.target.value })}>
                <option value="terminology">Terminology</option>
                <option value="dimensions">Dimensions</option>
                <option value="schedules">Schedules</option>
                <option value="weight">Weight</option>
              </select>
              <select value={newQ.diff} onChange={e => setNewQ({ ...newQ, diff: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <textarea placeholder="Question" value={newQ.q} onChange={e => setNewQ({ ...newQ, q: e.target.value })} />
            <input placeholder="Correct Answer" value={newQ.a} onChange={e => setNewQ({ ...newQ, a: e.target.value, opts: [e.target.value, newQ.opts[1], newQ.opts[2], newQ.opts[3]] })} />
            <div className="row">
              <input placeholder="Wrong 2" value={newQ.opts[1]} onChange={e => { const o = [...newQ.opts]; o[1] = e.target.value; setNewQ({ ...newQ, opts: o }); }} />
              <input placeholder="Wrong 3" value={newQ.opts[2]} onChange={e => { const o = [...newQ.opts]; o[2] = e.target.value; setNewQ({ ...newQ, opts: o }); }} />
              <input placeholder="Wrong 4" value={newQ.opts[3]} onChange={e => { const o = [...newQ.opts]; o[3] = e.target.value; setNewQ({ ...newQ, opts: o }); }} />
            </div>
            <input placeholder="Hint" value={newQ.hint} onChange={e => setNewQ({ ...newQ, hint: e.target.value })} />
            <button className="btn-add" onClick={addQuestion}>+ Add Question</button>
          </div>
          <h2>Custom Questions ({customQ.length})</h2>
          {customQ.length === 0 ? <p className="empty">No custom questions yet.</p> : (
            <div className="q-list">
              {customQ.map(q => (
                <div key={q.id} className="q-row">
                  <span className={`diff ${q.diff}`}>{q.diff}</span>
                  <span className="cat">{q.cat}</span>
                  <p>{q.q}</p>
                  <button onClick={() => setCustomQ(c => c.filter(x => x.id !== q.id))}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {adminTab === 'users' && (
        <div className="admin-content">
          <div className="stat-boxes">
            <div><span>156</span><small>Total Users</small></div>
            <div><span>42</span><small>Active Today</small></div>
            <div><span>12</span><small>New This Week</small></div>
            <div><span>89%</span><small>Completion</small></div>
          </div>
          <div className="user-table">
            <div className="row head"><span>User</span><span>Company</span><span>XP</span><span>Streak</span><span>Status</span></div>
            {mockLeaderboard.map(u => (
              <div key={u.id} className="row">
                <span>{u.avatar} {u.name}</span>
                <span>{u.company}</span>
                <span>{u.xp.toLocaleString()}</span>
                <span>🔥 {u.streak}</span>
                <span className="active">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {adminTab === 'analytics' && (
        <div className="admin-content">
          <div className="analytics-grid">
            <div className="chart-card">
              <h3>Weekly Activity</h3>
              <div className="bars">
                {[65, 80, 45, 90, 75, 85, 70].map((v, i) => (
                  <div key={i} className="bar" style={{ height: `${v}%` }}><span>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span></div>
                ))}
              </div>
            </div>
            <div className="chart-card">
              <h3>Accuracy by Topic</h3>
              {[{ n: 'Dimensions', v: 87 }, { n: 'Schedules', v: 72 }, { n: 'Terms', v: 91 }, { n: 'Weight', v: 75 }].map(x => (
                <div key={x.n} className="acc-row"><span>{x.n}</span><div className="acc-bar"><div style={{ width: `${x.v}%` }} /></div><span>{x.v}%</span></div>
              ))}
            </div>
            <div className="chart-card">
              <h3>Certifications Issued</h3>
              <div className="cert-stats">
                {CERTIFICATIONS.map((c, i) => (
                  <div key={c.id}><span>{c.icon}</span><span>{[45, 28, 15, 8][i]}</span><small>{c.name}</small></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {adminTab === 'settings' && (
        <div className="admin-content settings">
          <div className="setting-group">
            <h3>Company Settings</h3>
            <label>Company Name<input defaultValue={user?.company} /></label>
            <label>Logo URL<input placeholder="https://..." /></label>
          </div>
          <div className="setting-group">
            <h3>Learning Settings</h3>
            <label>Daily XP Goal<input type="number" defaultValue="50" /></label>
            <label>Questions/Session<input type="number" defaultValue="10" /></label>
          </div>
          <div className="setting-group">
            <h3>Notifications</h3>
            <label><input type="checkbox" defaultChecked /> Daily Reminders</label>
            <label><input type="checkbox" defaultChecked /> Weekly Reports</label>
          </div>
          <button className="btn-save">Save Settings</button>
        </div>
      )}
    </div>
  );

  const ProfileScreen = () => (
    <div className="page">
      <header><button onClick={() => setView('home')}>←</button><h1>👤 PROFILE</h1></header>
      <div className="profile-head">
        <span className="big-avatar">{user?.avatar}</span>
        <h2>{user?.name}</h2>
        <p>{user?.company}</p>
      </div>
      <div className="profile-stats">
        <div><span>{user?.xp || 0}</span><small>Total XP</small></div>
        <div><span>{level}</span><small>Level</small></div>
        <div><span>{user?.bestStreak || 0}</span><small>Best Streak</small></div>
        <div><span>{user?.sessions || 0}</span><small>Sessions</small></div>
      </div>
      <div className="profile-section">
        <h3>Badges ({user?.badges?.length || 0})</h3>
        <div className="profile-badges">
          {user?.badges?.length ? BADGES.filter(b => user.badges.includes(b.id)).map(b => <span key={b.id}>{b.icon} {b.name}</span>) : <p>Complete sessions to earn badges!</p>}
        </div>
      </div>
      <div className="profile-section">
        <h3>Certifications ({user?.certs?.length || 0})</h3>
        <div className="profile-certs">
          {user?.certs?.length ? CERTIFICATIONS.filter(c => user.certs.includes(c.id)).map(c => <span key={c.id}>{c.icon} {c.name}</span>) : <p>Complete learning paths to earn certifications!</p>}
        </div>
      </div>
      <div className="profile-actions">
        <button>Edit Profile</button>
        <button>Export Data</button>
        <button className="danger" onClick={() => { setAuth(false); setUser(null); }}>Sign Out</button>
      </div>
    </div>
  );

  const ReferenceScreen = () => (
    <div className="page ref">
      <header><button onClick={() => setView('home')}>←</button><h1>📋 REFERENCE</h1></header>
      <h2>NPS to OD Conversion</h2>
      <table><thead><tr><th>NPS</th><th>OD</th><th>DN</th></tr></thead>
        <tbody>{PIPE_DATA.sizes.map(s => <tr key={s.nps}><td>{s.nps}</td><td>{s.od}"</td><td>DN {s.dn}</td></tr>)}</tbody>
      </table>
      <h2>Schedule Wall Thickness</h2>
      <table><thead><tr><th>NPS</th><th>Sch40 WT</th><th>Sch40 lb/ft</th><th>Sch80 WT</th><th>Sch80 lb/ft</th></tr></thead>
        <tbody>{Object.entries(PIPE_DATA.schedules).map(([n, d]) => <tr key={n}><td>{n}</td><td>{d.sch40.wt}"</td><td>{d.sch40.lb}</td><td>{d.sch80.wt}"</td><td>{d.sch80.lb}</td></tr>)}</tbody>
      </table>
      <h2>Terminology</h2>
      <div className="glossary">{PIPE_DATA.terminology.map(t => <div key={t.term} className="term"><strong>{t.term}</strong> <span>{t.cat}</span><p>{t.def}</p></div>)}</div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        .app{font-family:'Space Grotesk',sans-serif;background:linear-gradient(135deg,#0f172a,#1e293b,#0f172a);min-height:100vh;color:#e2e8f0}
        .gold{background:linear-gradient(90deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        
        /* Auth */
        .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .auth-card{background:#1e293b;border:2px solid #334155;border-radius:20px;padding:32px;width:100%;max-width:400px}
        .auth-head{text-align:center;margin-bottom:24px}
        .logo-spin{font-size:48px;animation:spin 10s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .auth-head h1{font-family:'JetBrains Mono',monospace;font-size:22px;margin-top:12px;line-height:1.2}
        .auth-head p{color:#94a3b8;font-size:13px;margin-top:4px}
        .auth-tabs{display:flex;gap:8px;margin-bottom:20px}
        .auth-tabs button{flex:1;padding:10px;background:transparent;border:2px solid #334155;border-radius:8px;color:#94a3b8;cursor:pointer;font-family:inherit;font-weight:500}
        .auth-tabs button.active{background:#3b82f6;border-color:#3b82f6;color:#fff}
        .auth-card form input{width:100%;padding:12px;margin-bottom:12px;background:#0f172a;border:2px solid #334155;border-radius:8px;color:#e2e8f0;font-family:inherit}
        .auth-card form input:focus{outline:none;border-color:#3b82f6}
        .btn-primary{width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;border-radius:8px;color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer}
        .hint{text-align:center;font-size:11px;color:#64748b;margin-top:10px}
        .sso{margin-top:20px;text-align:center}
        .sso span{color:#64748b;font-size:12px}
        .sso-btns{display:flex;gap:10px;margin-top:12px}
        .sso-btns button{flex:1;padding:10px;background:#0f172a;border:2px solid #334155;border-radius:8px;color:#e2e8f0;cursor:pointer;font-family:inherit}
        
        /* Home */
        .home{padding:20px;max-width:500px;margin:0 auto}
        .home header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
        .user-row{display:flex;align-items:center;gap:10px}
        .avatar{font-size:28px}
        .user-row strong{font-size:14px}
        .user-row small{color:#94a3b8;font-size:11px}
        .actions{display:flex;gap:6px}
        .actions button{background:#334155;border:none;border-radius:6px;padding:8px 10px;font-size:16px;cursor:pointer}
        .title{font-family:'JetBrains Mono',monospace;font-size:22px;text-align:center;margin-bottom:20px}
        .stats-row{display:flex;justify-content:center;gap:20px;margin-bottom:16px}
        .stat{display:flex;flex-direction:column;align-items:center;gap:2px}
        .stat .icon{font-size:18px}
        .stat .val{font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:700}
        .stat .lbl{font-size:9px;color:#94a3b8;letter-spacing:1px}
        .xp-bar{height:10px;background:#334155;border-radius:5px;overflow:hidden;margin-bottom:6px}
        .xp-fill{height:100%;background:linear-gradient(90deg,#3b82f6,#8b5cf6);transition:width 0.5s}
        .xp-text{text-align:center;font-size:11px;color:#94a3b8;margin-bottom:20px}
        .btn-big{width:100%;padding:16px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;border-radius:14px;display:flex;align-items:center;gap:14px;cursor:pointer;margin-bottom:24px;box-shadow:0 4px 20px rgba(59,130,246,0.4)}
        .btn-big span{font-size:26px}
        .btn-big div{text-align:left;color:#fff}
        .btn-big strong{display:block;font-size:15px}
        .btn-big small{font-size:12px;opacity:0.8}
        .home h2{font-size:11px;letter-spacing:2px;color:#94a3b8;margin-bottom:12px}
        .cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
        .cat-card{background:#1e293b;border:2px solid #334155;border-radius:10px;padding:12px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;transition:all 0.2s}
        .cat-card:hover{border-color:var(--c);transform:translateY(-2px)}
        .cat-card span:first-child{font-size:20px}
        .cat-card span:nth-child(2){font-weight:600;font-size:12px}
        .cat-card small{font-size:10px;color:var(--c)}
        .nav-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .nav-grid button{padding:12px;background:#1e293b;border:2px solid #334155;border-radius:10px;color:#e2e8f0;font-family:inherit;font-size:13px;cursor:pointer}
        .nav-grid button:hover{border-color:#3b82f6}
        
        /* Session */
        .session{min-height:100vh;display:flex;flex-direction:column}
        .session header{display:flex;align-items:center;gap:12px;padding:14px 20px;background:#1e293b}
        .session header button{background:none;border:none;color:#94a3b8;font-size:20px;cursor:pointer}
        .prog-wrap{flex:1}
        .prog-bar{height:8px;background:#334155;border-radius:4px;overflow:hidden}
        .prog-fill{height:100%;background:linear-gradient(90deg,#10b981,#3b82f6);transition:width 0.5s}
        .prog-wrap span{font-size:11px;color:#94a3b8;display:block;text-align:center;margin-top:4px}
        .xp-earned{font-family:'JetBrains Mono',monospace;font-weight:600;color:#f59e0b}
        .card-wrap{flex:1;display:flex;align-items:center;justify-content:center;padding:20px}
        .q-card{background:#1e293b;border:2px solid #334155;border-radius:18px;padding:24px;width:100%;max-width:450px;transition:all 0.3s}
        .q-card.correct{border-color:#10b981;box-shadow:0 0 30px rgba(16,185,129,0.2)}
        .q-card.wrong{border-color:#ef4444;box-shadow:0 0 30px rgba(239,68,68,0.2)}
        .meta{display:flex;gap:8px;margin-bottom:12px}
        .diff,.custom{padding:4px 10px;border-radius:14px;font-size:10px;font-weight:600;letter-spacing:1px}
        .diff.beginner{background:#10b981;color:#fff}
        .diff.intermediate{background:#f59e0b;color:#000}
        .diff.advanced{background:#ef4444;color:#fff}
        .custom{background:#8b5cf6;color:#fff}
        .q-card h2{font-size:17px;margin-bottom:12px;line-height:1.4}
        .q-card .hint{font-size:12px;color:#94a3b8;padding:10px;background:#0f172a;border-radius:8px;margin-bottom:16px}
        .opts{display:grid;gap:10px}
        .opts button{padding:14px 16px;background:#0f172a;border:2px solid #334155;border-radius:10px;color:#e2e8f0;font-family:'JetBrains Mono',monospace;font-size:13px;text-align:left;cursor:pointer;transition:all 0.2s}
        .opts button:hover:not(:disabled){border-color:#3b82f6;background:#1e293b}
        .opts button.correct{border-color:#10b981;background:rgba(16,185,129,0.2)}
        .opts button.wrong{border-color:#ef4444;background:rgba(239,68,68,0.2)}
        .feedback{margin-top:18px}
        .fb-correct,.fb-wrong{padding:12px;border-radius:10px;margin-bottom:12px;font-weight:500}
        .fb-correct{background:rgba(16,185,129,0.2);color:#10b981}
        .fb-wrong{background:rgba(239,68,68,0.2);color:#ef4444}
        .btn-continue{width:100%;padding:14px;background:linear-gradient(135deg,#3b82f6,#2563eb);border:none;border-radius:10px;color:#fff;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer}
        
        /* Results */
        .results{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .results-card{background:#1e293b;border:2px solid #334155;border-radius:20px;padding:32px;text-align:center;max-width:360px;width:100%}
        .results-card h1{font-size:20px;margin-bottom:24px;background:linear-gradient(90deg,#10b981,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .circle-wrap{position:relative;width:100px;height:100px;margin:0 auto 20px}
        .circle-wrap svg{transform:rotate(-90deg)}
        .circle-wrap .bg{fill:none;stroke:#334155;stroke-width:8}
        .circle-wrap .fg{fill:none;stroke:#10b981;stroke-width:8;stroke-linecap:round;transition:stroke-dasharray 1s}
        .pct{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700}
        .results-card p{margin-bottom:20px}
        .g{color:#10b981;font-weight:bold}
        .r{color:#ef4444;font-weight:bold}
        .rewards{background:#0f172a;border-radius:12px;padding:16px;margin-bottom:20px}
        .rewards h3{font-size:11px;letter-spacing:2px;color:#94a3b8;margin-bottom:10px}
        .rewards p{font-size:16px;font-weight:600;margin:4px 0}
        .bonus{color:#f59e0b}
        
        /* Page Layout */
        .page{min-height:100vh}
        .page header{display:flex;align-items:center;gap:12px;padding:14px 20px;background:#1e293b;position:sticky;top:0;z-index:100}
        .page header button{background:none;border:none;color:#94a3b8;font-size:18px;cursor:pointer}
        .page header h1{font-size:15px}
        .intro{padding:16px 20px;color:#94a3b8;font-size:13px}
        
        /* Leaderboard */
        .podium{display:flex;justify-content:center;align-items:flex-end;gap:12px;padding:20px}
        .pod{background:#1e293b;border:2px solid #334155;border-radius:12px;padding:14px;text-align:center;width:90px}
        .pod-1{order:2;transform:scale(1.1);border-color:#f59e0b}
        .pod-2{order:1}
        .pod-3{order:3}
        .pod-avatar{font-size:26px;display:block}
        .pod-name{font-size:11px;font-weight:600;display:block;margin:6px 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pod-xp{font-size:10px;color:#94a3b8;display:block}
        .pod-medal{font-size:18px;display:block;margin-top:6px}
        .lb-list{padding:0 20px 20px}
        .lb-row{display:flex;align-items:center;gap:10px;padding:12px;background:#1e293b;border:2px solid #334155;border-radius:10px;margin-bottom:8px}
        .lb-row .rank{font-family:'JetBrains Mono',monospace;font-weight:600;width:20px;color:#94a3b8}
        .lb-row .avatar{font-size:22px}
        .lb-row .info{flex:1}
        .lb-row .info strong{font-size:13px;display:block}
        .lb-row .info small{font-size:10px;color:#94a3b8}
        .lb-stats{text-align:right}
        .lb-stats span{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:12px;display:block}
        .lb-stats small{color:#f59e0b;font-size:10px}
        
        /* Certifications */
        .cert-grid{padding:0 20px 20px;display:grid;gap:14px}
        .cert-card{background:#1e293b;border:2px solid #334155;border-radius:14px;padding:18px;position:relative;overflow:hidden}
        .cert-card.earned{border-color:var(--c)}
        .cert-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:var(--c)}
        .cert-icon{font-size:32px}
        .cert-card h3{font-size:15px;margin:8px 0 6px}
        .cert-card ul{list-style:none;font-size:11px;color:#94a3b8;margin-bottom:12px}
        .cert-card li{margin:4px 0}
        .cert-prog{height:8px;background:#334155;border-radius:4px;overflow:hidden;margin-bottom:6px}
        .cert-prog div{height:100%;background:var(--c)}
        .cert-pct{font-size:11px;color:#94a3b8;display:block;text-align:center}
        .cert-badge{background:var(--c);color:#000;padding:10px;border-radius:8px;text-align:center;font-weight:600;font-size:12px;margin-top:10px}
        .cert-card button{width:100%;padding:10px;background:var(--c);border:none;border-radius:8px;color:#000;font-family:inherit;font-weight:600;cursor:pointer;margin-top:10px}
        
        /* Badges */
        .badge-summary{text-align:center;padding:20px}
        .badge-summary .big{font-family:'JetBrains Mono',monospace;font-size:48px;font-weight:700;color:#f59e0b}
        .badge-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:0 20px 20px}
        .badge-card{background:#1e293b;border:2px solid #334155;border-radius:12px;padding:14px;text-align:center;position:relative}
        .badge-card.earned{border-color:#f59e0b}
        .badge-card.locked{opacity:0.5}
        .badge-icon{font-size:28px;display:block}
        .badge-card h4{font-size:10px;margin:6px 0 2px}
        .badge-card p{font-size:9px;color:#94a3b8}
        .check{position:absolute;top:6px;right:6px;background:#f59e0b;color:#000;width:16px;height:16px;border-radius:50%;font-size:10px;display:flex;align-items:center;justify-content:center;font-weight:bold}
        
        /* Admin */
        .admin-tabs{display:flex;gap:6px;padding:16px 20px;overflow-x:auto}
        .admin-tabs button{padding:10px 14px;background:transparent;border:2px solid #334155;border-radius:8px;color:#94a3b8;cursor:pointer;font-family:inherit;font-size:11px;white-space:nowrap}
        .admin-tabs button.active{background:#3b82f6;border-color:#3b82f6;color:#fff}
        .admin-content{padding:0 20px 20px}
        .add-form{background:#1e293b;border:2px solid #334155;border-radius:14px;padding:18px;margin-bottom:20px}
        .add-form h2{font-size:15px;margin-bottom:14px}
        .add-form .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;margin-bottom:10px}
        .add-form input,.add-form select,.add-form textarea{width:100%;padding:10px;background:#0f172a;border:2px solid #334155;border-radius:8px;color:#e2e8f0;font-family:inherit;margin-bottom:10px}
        .add-form textarea{min-height:70px;resize:vertical}
        .btn-add{width:100%;padding:12px;background:#10b981;border:none;border-radius:8px;color:#fff;font-family:inherit;font-weight:600;cursor:pointer}
        .admin-content>h2{font-size:14px;margin-bottom:12px}
        .empty{color:#64748b;text-align:center;padding:30px}
        .q-list .q-row{display:flex;align-items:center;gap:10px;padding:12px;background:#1e293b;border:1px solid #334155;border-radius:8px;margin-bottom:8px}
        .q-row .diff,.q-row .cat{padding:2px 8px;border-radius:4px;font-size:9px}
        .q-row .cat{background:#334155;color:#94a3b8}
        .q-row p{flex:1;font-size:12px;margin:0}
        .q-row button{background:none;border:none;font-size:16px;cursor:pointer;opacity:0.6}
        .q-row button:hover{opacity:1}
        .stat-boxes{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}
        .stat-boxes div{background:#1e293b;border:2px solid #334155;border-radius:10px;padding:14px;text-align:center}
        .stat-boxes span{display:block;font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:#3b82f6}
        .stat-boxes small{font-size:9px;color:#94a3b8}
        .user-table{background:#1e293b;border:2px solid #334155;border-radius:10px;overflow:hidden}
        .user-table .row{display:grid;grid-template-columns:2fr 1.5fr 1fr 1fr 1fr;gap:10px;padding:10px 14px;border-bottom:1px solid #334155;font-size:12px}
        .user-table .row.head{background:#0f172a;font-weight:600;font-size:10px;color:#94a3b8}
        .user-table .active{color:#10b981}
        .analytics-grid{display:grid;gap:14px}
        .chart-card{background:#1e293b;border:2px solid #334155;border-radius:12px;padding:16px}
        .chart-card h3{font-size:12px;color:#94a3b8;margin-bottom:12px}
        .bars{display:flex;align-items:flex-end;justify-content:space-between;height:80px;gap:6px}
        .bar{flex:1;background:linear-gradient(to top,#3b82f6,#8b5cf6);border-radius:4px 4px 0 0;position:relative}
        .bar span{position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px;color:#94a3b8}
        .acc-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
        .acc-row span:first-child{width:70px;font-size:11px}
        .acc-bar{flex:1;height:8px;background:#334155;border-radius:4px;overflow:hidden}
        .acc-bar div{height:100%;background:#10b981}
        .acc-row span:last-child{width:30px;text-align:right;font-size:11px;font-family:'JetBrains Mono',monospace}
        .cert-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .cert-stats div{text-align:center;padding:10px;background:#0f172a;border-radius:8px}
        .cert-stats span:first-child{font-size:22px;display:block}
        .cert-stats span:nth-child(2){font-size:18px;font-weight:700;display:block}
        .cert-stats small{font-size:9px;color:#94a3b8}
        .settings .setting-group{background:#1e293b;border:2px solid #334155;border-radius:12px;padding:16px;margin-bottom:14px}
        .settings h3{font-size:13px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #334155}
        .settings label{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:13px}
        .settings label input[type="text"],.settings label input[type="number"]{width:180px;padding:8px;background:#0f172a;border:2px solid #334155;border-radius:6px;color:#e2e8f0;font-family:inherit}
        .settings label input[type="checkbox"]{width:auto}
        .btn-save{width:100%;padding:14px;background:#10b981;border:none;border-radius:10px;color:#fff;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer}
        
        /* Profile */
        .profile-head{text-align:center;padding:20px}
        .big-avatar{font-size:64px;display:block}
        .profile-head h2{font-size:20px;margin:10px 0 4px}
        .profile-head p{color:#94a3b8;font-size:13px}
        .profile-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:0 20px;margin-bottom:20px}
        .profile-stats div{background:#1e293b;border:2px solid #334155;border-radius:10px;padding:12px;text-align:center}
        .profile-stats span{display:block;font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:700;color:#3b82f6}
        .profile-stats small{font-size:9px;color:#94a3b8}
        .profile-section{background:#1e293b;border:2px solid #334155;border-radius:12px;padding:14px;margin:0 20px 14px}
        .profile-section h3{font-size:12px;color:#94a3b8;margin-bottom:10px}
        .profile-badges,.profile-certs{display:flex;flex-wrap:wrap;gap:8px}
        .profile-badges span,.profile-certs span{padding:6px 12px;background:#0f172a;border-radius:16px;font-size:11px}
        .profile-section p{color:#64748b;font-size:12px}
        .profile-actions{padding:0 20px 20px;display:flex;flex-direction:column;gap:10px}
        .profile-actions button{padding:12px;background:#3b82f6;border:none;border-radius:8px;color:#fff;font-family:inherit;font-weight:600;cursor:pointer}
        .profile-actions button:nth-child(2){background:#334155}
        .profile-actions .danger{background:#ef4444}
        
        /* Reference */
        .ref{padding-bottom:20px}
        .ref h2{font-size:14px;margin:20px 20px 10px;padding-bottom:8px;border-bottom:2px solid #334155}
        .ref table{width:calc(100% - 40px);margin:0 20px;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:12px}
        .ref th,.ref td{padding:10px 12px;text-align:left;border-bottom:1px solid #334155}
        .ref th{background:#0f172a;color:#94a3b8;font-size:10px}
        .glossary{padding:0 20px}
        .term{background:#0f172a;border-radius:10px;padding:12px;margin-bottom:10px}
        .term strong{font-family:'JetBrains Mono',monospace;color:#3b82f6;font-size:13px}
        .term span{display:inline-block;margin-left:8px;padding:2px 8px;background:#334155;border-radius:4px;font-size:9px;color:#94a3b8}
        .term p{margin-top:6px;font-size:12px;line-height:1.4}
        
        @media(max-width:500px){
          .stats-row{gap:14px}
          .stat .val{font-size:16px}
          .cat-grid{grid-template-columns:repeat(2,1fr)}
          .stat-boxes{grid-template-columns:repeat(2,1fr)}
          .profile-stats{grid-template-columns:repeat(2,1fr)}
          .badge-grid{grid-template-columns:repeat(2,1fr)}
        }
      `}</style>
      
      {!auth ? <AuthScreen /> : (
        <>
          {view === 'home' && <HomeScreen />}
          {view === 'session' && <SessionScreen />}
          {view === 'results' && <ResultsScreen />}
          {view === 'leaderboard' && <LeaderboardScreen />}
          {view === 'certs' && <CertsScreen />}
          {view === 'badges' && <BadgesScreen />}
          {view === 'admin' && <AdminScreen />}
          {view === 'profile' && <ProfileScreen />}
          {view === 'reference' && <ReferenceScreen />}
        </>
      )}
    </div>
  );
}
