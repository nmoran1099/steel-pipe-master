import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// STEEL PIPE MASTER - PROFESSIONAL EDITION WITH ADMIN DASHBOARD
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
    { term: 'SRL', def: 'Single Random Length - Typically 18-22 feet', cat: 'length' },
    { term: 'DRL', def: 'Double Random Length - Typically 35-45 feet', cat: 'length' },
    { term: 'FBE', def: 'Fusion Bonded Epoxy - Protective coating', cat: 'coating' },
    { term: 'PEB', def: 'Plain End Beveled - Cut square with beveled edge', cat: 'ends' },
    { term: 'DSAW', def: 'Double Submerged Arc Weld - Welding method for large pipe', cat: 'manufacturing' },
  ],
};

// Item Code Database
const ITEM_CODES = {
  firstDigit: [
    { code: '1', meaning: 'Domestic Black' },
    { code: '2', meaning: 'Domestic Galvanized' },
    { code: '3', meaning: 'Import Black' },
    { code: '4', meaning: 'Import Galvanized' },
    { code: '5', meaning: 'REMS' },
  ],
  pipeSizeCodes: [
    { size: '1/8"', code: '001' }, { size: '1/4"', code: '002' }, { size: '3/8"', code: '003' },
    { size: '1/2"', code: '004' }, { size: '3/4"', code: '006' }, { size: '1"', code: '010' },
    { size: '1-1/4"', code: '012' }, { size: '1-1/2"', code: '014' }, { size: '2"', code: '020' },
    { size: '2-1/2"', code: '024' }, { size: '3"', code: '030' }, { size: '3-1/2"', code: '034' },
    { size: '4"', code: '040' }, { size: '5"', code: '055' }, { size: '6"', code: '065' },
    { size: '8"', code: '085' }, { size: '10"', code: '106' }, { size: '12"', code: '126' },
    { size: '14"', code: '140' }, { size: '16"', code: '160' }, { size: '18"', code: '180' },
    { size: '20"', code: '200' }, { size: '22"', code: '220' }, { size: '24"', code: '240' },
    { size: '26"', code: '260' }, { size: '30"', code: '300' }, { size: '32"', code: '320' },
    { size: '36"', code: '360' }, { size: '42"', code: '420' }, { size: '48"', code: '480' },
  ],
};

// Mock Users Database for Admin
const MOCK_USERS = [
  { id: '1', name: 'Michael Thompson', email: 'mthompson@acmepipe.com', company: 'Acme Piping Inc.', role: 'user', xp: 2450, streak: 12, bestStreak: 15, sessions: 28, questions: 245, accuracy: 87, lastActive: '2024-01-15', joined: '2023-11-01', certs: ['basics'], topicProgress: { itemcodes: 72, dimensions: 85, schedules: 68, terminology: 91, weight: 45 } },
  { id: '2', name: 'Sarah Chen', email: 'schen@industrialsupply.com', company: 'Industrial Supply Co.', role: 'user', xp: 3200, streak: 18, bestStreak: 22, sessions: 42, questions: 380, accuracy: 92, lastActive: '2024-01-15', joined: '2023-10-15', certs: ['basics', 'terminology'], topicProgress: { itemcodes: 88, dimensions: 95, schedules: 78, terminology: 100, weight: 62 } },
  { id: '3', name: 'James Wilson', email: 'jwilson@steelsolutions.com', company: 'Steel Solutions LLC', role: 'user', xp: 1800, streak: 5, bestStreak: 8, sessions: 19, questions: 165, accuracy: 78, lastActive: '2024-01-14', joined: '2023-12-01', certs: [], topicProgress: { itemcodes: 45, dimensions: 62, schedules: 55, terminology: 70, weight: 30 } },
  { id: '4', name: 'Emily Davis', email: 'edavis@pipelinecorp.com', company: 'Pipeline Corporation', role: 'user', xp: 4500, streak: 25, bestStreak: 25, sessions: 58, questions: 520, accuracy: 94, lastActive: '2024-01-15', joined: '2023-09-20', certs: ['basics', 'schedule', 'terminology'], topicProgress: { itemcodes: 92, dimensions: 98, schedules: 95, terminology: 100, weight: 88 } },
  { id: '5', name: 'Robert Brown', email: 'rbrown@pipelinemasters.com', company: 'Pipeline Masters', role: 'user', xp: 950, streak: 0, bestStreak: 4, sessions: 8, questions: 72, accuracy: 71, lastActive: '2024-01-10', joined: '2024-01-02', certs: [], topicProgress: { itemcodes: 25, dimensions: 35, schedules: 20, terminology: 40, weight: 15 } },
  { id: '6', name: 'Lisa Martinez', email: 'lmartinez@acmepipe.com', company: 'Acme Piping Inc.', role: 'user', xp: 2100, streak: 8, bestStreak: 12, sessions: 24, questions: 198, accuracy: 85, lastActive: '2024-01-15', joined: '2023-11-15', certs: ['basics'], topicProgress: { itemcodes: 68, dimensions: 75, schedules: 70, terminology: 82, weight: 55 } },
  { id: '7', name: 'David Kim', email: 'dkim@steelsolutions.com', company: 'Steel Solutions LLC', role: 'user', xp: 1500, streak: 3, bestStreak: 6, sessions: 15, questions: 128, accuracy: 82, lastActive: '2024-01-13', joined: '2023-12-10', certs: [], topicProgress: { itemcodes: 52, dimensions: 65, schedules: 48, terminology: 72, weight: 38 } },
  { id: '8', name: 'Jennifer Taylor', email: 'jtaylor@industrialsupply.com', company: 'Industrial Supply Co.', role: 'user', xp: 680, streak: 2, bestStreak: 3, sessions: 6, questions: 52, accuracy: 75, lastActive: '2024-01-12', joined: '2024-01-05', certs: [], topicProgress: { itemcodes: 18, dimensions: 28, schedules: 15, terminology: 32, weight: 10 } },
  { id: '9', name: 'Chris Anderson', email: 'canderson@pipelinecorp.com', company: 'Pipeline Corporation', role: 'user', xp: 3800, streak: 21, bestStreak: 21, sessions: 48, questions: 445, accuracy: 89, lastActive: '2024-01-15', joined: '2023-10-01', certs: ['basics', 'schedule'], topicProgress: { itemcodes: 85, dimensions: 92, schedules: 88, terminology: 95, weight: 78 } },
  { id: '10', name: 'Amanda White', email: 'awhite@acmepipe.com', company: 'Acme Piping Inc.', role: 'user', xp: 1200, streak: 6, bestStreak: 9, sessions: 12, questions: 105, accuracy: 80, lastActive: '2024-01-14', joined: '2023-12-20', certs: [], topicProgress: { itemcodes: 42, dimensions: 55, schedules: 38, terminology: 60, weight: 28 } },
];

const CERTIFICATIONS = [
  { id: 'basics', name: 'Pipe Fundamentals', color: '#059669', req: { questions: 20, accuracy: 80, streak: 3 } },
  { id: 'schedule', name: 'Schedule Specialist', color: '#2563eb', req: { questions: 30, accuracy: 85, streak: 5 } },
  { id: 'terminology', name: 'Industry Expert', color: '#7c3aed', req: { questions: 50, accuracy: 90, streak: 7 } },
  { id: 'itemcodes', name: 'Item Code Expert', color: '#dc2626', req: { questions: 40, accuracy: 85, streak: 5 } },
  { id: 'master', name: 'Pipe Master', color: '#f59e0b', req: { questions: 100, accuracy: 85, streak: 14 } },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const genId = () => Math.random().toString(36).substr(2, 9);

const genQuestions = (custom = []) => {
  const q = [];
  
  PIPE_DATA.sizes.forEach(s => {
    q.push({ id: `od_${s.nps}`, cat: 'dimensions', diff: 'beginner', q: `What is the Outside Diameter of ${s.nps} NPS pipe?`, a: `${s.od}"`, opts: shuffle([`${s.od}"`, `${(s.od + 0.1).toFixed(3)}"`, `${(s.od - 0.1).toFixed(3)}"`, `${(s.od + 0.25).toFixed(3)}"`]), hint: 'Refer to the ASME B36.10 standard pipe chart' });
  });
  
  Object.entries(PIPE_DATA.schedules).forEach(([nps, sch]) => {
    q.push({ id: `wt40_${nps}`, cat: 'schedules', diff: 'intermediate', q: `What is the wall thickness of ${nps} Schedule 40 pipe?`, a: `${sch.sch40.wt}"`, opts: shuffle([`${sch.sch40.wt}"`, `${sch.sch80.wt}"`, `${(sch.sch40.wt + 0.02).toFixed(3)}"`, `${(sch.sch40.wt - 0.02).toFixed(3)}"`]), hint: 'Schedule 40 is the standard weight designation' });
    q.push({ id: `lb_${nps}`, cat: 'weight', diff: 'advanced', q: `What is the weight per foot of ${nps} Schedule 40 pipe?`, a: `${sch.sch40.lb} lb/ft`, opts: shuffle([`${sch.sch40.lb} lb/ft`, `${sch.sch80.lb} lb/ft`, `${(sch.sch40.lb + 1).toFixed(2)} lb/ft`, `${(sch.sch40.lb - 1).toFixed(2)} lb/ft`]), hint: 'Weight depends on wall thickness and diameter' });
  });
  
  PIPE_DATA.terminology.forEach(t => {
    q.push({ id: `term_${t.term}`, cat: 'terminology', diff: t.cat === 'sizing' ? 'beginner' : 'intermediate', q: `What does "${t.term}" stand for?`, a: t.def, opts: shuffle([t.def, ...PIPE_DATA.terminology.filter(x => x.term !== t.term).slice(0, 3).map(x => x.def)]), hint: `This term relates to ${t.cat}` });
  });
  
  // Item code questions
  ITEM_CODES.firstDigit.forEach(d => {
    q.push({ id: `ic_first_${d.code}`, cat: 'itemcodes', diff: 'beginner', q: `In an item code, what does a first digit of "${d.code}" indicate?`, a: d.meaning, opts: shuffle(ITEM_CODES.firstDigit.map(x => x.meaning)), hint: 'The first digit indicates the finish and origin' });
  });
  
  const commonSizes = ['1/2"', '3/4"', '1"', '2"', '4"', '6"', '8"'];
  ITEM_CODES.pipeSizeCodes.filter(p => commonSizes.includes(p.size)).forEach(p => {
    q.push({ id: `ic_size_${p.code}`, cat: 'itemcodes', diff: 'intermediate', q: `What is the 3-digit pipe size code for ${p.size} pipe?`, a: p.code, opts: shuffle([p.code, ...ITEM_CODES.pipeSizeCodes.filter(x => x.code !== p.code).slice(0, 3).map(x => x.code)]), hint: 'Pipe size codes are the 2nd-4th digits' });
  });
  
  const commonSuffixes = [
    { suffix: '05', meaning: 'SRL (Single Random Length)', hint: 'Most common seamless suffix' },
    { suffix: '10', meaning: 'DRL (Double Random Length)', hint: 'Longer lengths than -05' },
    { suffix: '71', meaning: '21FT A53B/API5LB/X42 PEB', hint: 'Plain end beveled ERW' },
    { suffix: '72', meaning: '42FT A53B/API5LB/X42 PEB', hint: 'Long PEB ERW' },
  ];
  
  commonSuffixes.forEach(s => {
    q.push({ id: `ic_suf_${s.suffix}`, cat: 'itemcodes', diff: 'advanced', q: `What does the suffix "-${s.suffix}" indicate?`, a: s.meaning, opts: shuffle([s.meaning, ...commonSuffixes.filter(x => x.suffix !== s.suffix).map(x => x.meaning)]), hint: s.hint });
  });
  
  return [...q, ...custom.map(c => ({ ...c, isCustom: true }))];
};

const calcNextReview = (card, correct) => {
  let { ease = 2.5, interval = 1, reps = 0 } = card;
  if (correct) { reps === 0 ? interval = 1 : reps === 1 ? interval = 6 : interval = Math.round(interval * ease); reps++; ease = Math.max(1.3, ease + 0.1); }
  else { reps = 0; interval = 1; }
  return { ease, interval, reps, next: Date.now() + interval * 86400000 };
};

// SVG Icons
const Icon = ({ name, size = 20 }) => {
  const icons = {
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    award: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    hash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
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
  const [adminTab, setAdminTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([
    { id: '1', from: 'Admin', to: '1', subject: 'Welcome to Steel Pipe Master!', body: 'Welcome to the training platform. Start with the Item Codes module to get familiar with our part numbering system.', date: '2024-01-10', read: true },
    { id: '2', from: 'Admin', to: '3', subject: 'Keep up the good work!', body: 'Great progress this week! Try to maintain your streak by practicing daily.', date: '2024-01-12', read: false },
  ]);
  const [newMessage, setNewMessage] = useState({ to: '', subject: '', body: '' });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userMessages, setUserMessages] = useState([]);
  
  const level = Math.floor((user?.xp || 0) / 100) + 1;
  
  const getDue = useCallback((cat = null) => {
    const now = Date.now();
    return questions.filter(q => {
      if (cat && q.cat !== cat) return false;
      const p = cardProgress[q.id];
      return !p || p.next <= now;
    });
  }, [questions, cardProgress]);
  
  const login = (email) => {
    const isAdmin = email.includes('admin');
    setUser({
      id: isAdmin ? 'admin' : genId(), email, name: isAdmin ? 'Administrator' : email.split('@')[0],
      company: 'Your Company', role: isAdmin ? 'admin' : 'user',
      xp: 0, streak: 0, bestStreak: 0, sessions: 0, questions: 0, perfect: 0,
      badges: [], certs: [], created: Date.now()
    });
    setUserMessages(messages.filter(m => m.to === (isAdmin ? 'admin' : genId())));
    setAuth(true);
  };
  
  const startSession = (cat = null) => {
    const due = getDue(cat);
    const cards = shuffle(due).slice(0, 10);
    if (!cards.length) { alert('No questions due!'); return; }
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
      setUser(u => ({ ...u, sessions: u.sessions + 1, questions: u.questions + stats.correct + stats.incorrect, streak: acc >= 70 ? u.streak + 1 : u.streak, xp: u.xp + (acc >= 70 ? 25 : 0) }));
      setView('results');
      return;
    }
    setSession(s => ({ ...s, idx: s.idx + 1 }));
    setShowAns(false);
    setSelected(null);
  };
  
  const sendMessage = () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.body) { alert('Please fill in all fields'); return; }
    setMessages([...messages, { id: genId(), from: 'Admin', ...newMessage, date: new Date().toISOString().split('T')[0], read: false }]);
    setNewMessage({ to: '', subject: '', body: '' });
    setShowMessageModal(false);
    alert('Message sent!');
  };
  
  const sendBulkMessage = () => {
    const subject = prompt('Enter message subject:');
    if (!subject) return;
    const body = prompt('Enter message body:');
    if (!body) return;
    const newMsgs = MOCK_USERS.map(u => ({ id: genId(), from: 'Admin', to: u.id, subject, body, date: new Date().toISOString().split('T')[0], read: false }));
    setMessages([...messages, ...newMsgs]);
    alert(`Message sent to ${MOCK_USERS.length} users!`);
  };

  // AUTH SCREEN
  const AuthScreen = () => (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-header"><div className="logo">SP</div><h1>Steel Pipe Master</h1><p>Professional Training Platform</p></div>
        <div className="tabs">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Sign In</button>
          <button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Create Account</button>
        </div>
        {authMode === 'login' ? (
          <form onSubmit={e => { e.preventDefault(); login(e.target.email.value); }}>
            <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@company.com" required /></div>
            <div className="field"><label>Password</label><input name="password" type="password" placeholder="Enter password" required /></div>
            <button type="submit" className="btn-primary">Sign In</button>
            <p className="hint">Demo: Use "admin@company.com" for admin access</p>
          </form>
        ) : (
          <form onSubmit={e => { e.preventDefault(); login(e.target.email.value); }}>
            <div className="field"><label>Full Name</label><input name="name" placeholder="John Smith" required /></div>
            <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@company.com" required /></div>
            <div className="field"><label>Password</label><input name="password" type="password" placeholder="Create password" required /></div>
            <button type="submit" className="btn-primary">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );

  // HOME SCREEN
  const HomeScreen = () => (
    <div className="app-layout">
      <header className="topbar">
        <div className="brand"><div className="logo sm">SP</div><span>Steel Pipe Master</span></div>
        <div className="actions">
          {user?.role === 'admin' && <button className="icon-btn highlight" onClick={() => setView('admin')}><Icon name="settings" size={18}/></button>}
          <button className="icon-btn" onClick={() => setView('profile')}><Icon name="user" size={18}/></button>
          <button className="icon-btn" onClick={() => { setAuth(false); setUser(null); }}><Icon name="logout" size={18}/></button>
        </div>
      </header>
      <main className="content">
        <div className="welcome"><h1>Welcome back, {user?.name?.split(' ')[0]}</h1><p>Continue your pipe specifications training</p></div>
        <div className="stats-row">
          <div className="stat"><span className="stat-val">{user?.streak || 0}</span><span className="stat-lbl">Day Streak</span></div>
          <div className="stat"><span className="stat-val">{user?.xp || 0}</span><span className="stat-lbl">Points</span></div>
          <div className="stat"><span className="stat-val">{level}</span><span className="stat-lbl">Level</span></div>
          <div className="stat"><span className="stat-val">{user?.sessions || 0}</span><span className="stat-lbl">Sessions</span></div>
        </div>
        <div className="practice-card"><div><h2>Daily Practice</h2><p>{getDue().length} questions ready</p></div><button className="btn-start" onClick={() => startSession()}><Icon name="play" size={16}/> Start</button></div>
        <section className="topics"><h2>Study by Topic</h2>
          <div className="topics-grid">
            {[{ id: 'itemcodes', name: 'Item Codes', desc: 'Part numbers & suffixes', color: '#dc2626' },{ id: 'dimensions', name: 'Dimensions', desc: 'NPS, OD, sizing', color: '#2563eb' },{ id: 'schedules', name: 'Schedules', desc: 'Wall thickness', color: '#059669' },{ id: 'terminology', name: 'Terms', desc: 'Industry terms', color: '#7c3aed' },{ id: 'weight', name: 'Weights', desc: 'lb per foot', color: '#f59e0b' }].map(t => (
              <button key={t.id} className="topic-btn" onClick={() => startSession(t.id)}><div className="topic-color" style={{ background: t.color }}/><div className="topic-info"><h3>{t.name}</h3><p>{t.desc}</p></div><span className="topic-count">{getDue(t.id).length}</span></button>
            ))}
          </div>
        </section>
        <section className="nav-cards">
          <button onClick={() => setView('leaderboard')}><Icon name="trophy" size={22}/><div><h3>Leaderboard</h3><p>Top performers</p></div></button>
          <button onClick={() => setView('certs')}><Icon name="award" size={22}/><div><h3>Certifications</h3><p>Earn credentials</p></div></button>
          <button onClick={() => setView('reference')}><Icon name="book" size={22}/><div><h3>Reference</h3><p>Pipe data</p></div></button>
          <button onClick={() => setView('itemcoderef')}><Icon name="hash" size={22}/><div><h3>Item Codes</h3><p>Code reference</p></div></button>
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
        <header className="session-bar"><button className="icon-btn" onClick={() => setView('home')}><Icon name="x" size={20}/></button><div className="progress"><div className="prog-bar"><div className="prog-fill" style={{ width: `${pct}%` }}/></div><span>{session.idx + 1} / {session.cards.length}</span></div><span className="score">+{stats.correct * 10}</span></header>
        <main className="session-main">
          <div className={`q-card ${showAns ? (selected === card.a ? 'correct' : 'wrong') : ''}`}>
            <div className="q-meta"><span className={`diff ${card.diff}`}>{card.diff}</span><span className="cat-tag">{card.cat}</span></div>
            <h2>{card.q}</h2>
            {!showAns && <p className="q-hint">{card.hint}</p>}
            <div className="options">{card.opts.map((o, i) => (<button key={i} className={`opt ${showAns ? (o === card.a ? 'correct' : selected === o ? 'wrong' : 'dim') : ''}`} onClick={() => answer(o)} disabled={showAns}><span className="opt-letter">{String.fromCharCode(65 + i)}</span><span className="opt-text">{o}</span>{showAns && o === card.a && <Icon name="check" size={18}/>}</button>))}</div>
            {showAns && (<div className="feedback-area"><div className={`feedback ${selected === card.a ? 'correct' : 'wrong'}`}>{selected === card.a ? 'Correct! +10 points' : 'Incorrect.'}</div><button className="btn-primary" onClick={nextCard}>{session.idx >= session.cards.length - 1 ? 'See Results' : 'Next'}</button></div>)}
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
      <div className="results-wrap"><div className="results-card">
        <div className={`results-top ${passed ? 'pass' : 'fail'}`}><h1>{passed ? 'Great Work!' : 'Keep Practicing'}</h1><p>{passed ? 'Session completed' : '70% needed to pass'}</p></div>
        <div className="score-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" className="bg"/><circle cx="50" cy="50" r="42" className="fg" style={{ strokeDasharray: `${acc * 2.64} 264` }}/></svg><span>{acc}%</span></div>
        <div className="results-nums"><div className="correct"><span>{stats.correct}</span><small>Correct</small></div><div className="wrong"><span>{stats.incorrect}</span><small>Incorrect</small></div></div>
        <div className="rewards"><h3>Points Earned</h3><div className="reward-line"><span>Correct answers</span><span>+{stats.correct * 10}</span></div>{passed && <div className="reward-line bonus"><span>Completion bonus</span><span>+25</span></div>}<div className="reward-total"><span>Total</span><span>+{stats.correct * 10 + (passed ? 25 : 0)}</span></div></div>
        <button className="btn-primary" onClick={() => setView('home')}>Back to Dashboard</button>
      </div></div>
    );
  };

  // ADMIN DASHBOARD
  const AdminScreen = () => {
    const totalUsers = MOCK_USERS.length;
    const activeToday = MOCK_USERS.filter(u => u.lastActive === '2024-01-15').length;
    const avgAccuracy = Math.round(MOCK_USERS.reduce((a, u) => a + u.accuracy, 0) / totalUsers);
    const totalQuestions = MOCK_USERS.reduce((a, u) => a + u.questions, 0);
    const inactiveUsers = MOCK_USERS.filter(u => u.streak === 0);
    
    return (
      <div className="page admin-page">
        <header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Admin Dashboard</h1></header>
        <div className="admin-tabs">
          {['overview', 'users', 'progress', 'messages'].map(t => (<button key={t} className={adminTab === t ? 'active' : ''} onClick={() => setAdminTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>))}
        </div>
        <main>
          {adminTab === 'overview' && (
            <>
              <div className="admin-stats">
                <div className="admin-stat"><Icon name="users" size={24}/><div><span className="big">{totalUsers}</span><small>Total Users</small></div></div>
                <div className="admin-stat"><Icon name="clock" size={24}/><div><span className="big">{activeToday}</span><small>Active Today</small></div></div>
                <div className="admin-stat"><Icon name="chart" size={24}/><div><span className="big">{avgAccuracy}%</span><small>Avg Accuracy</small></div></div>
                <div className="admin-stat"><Icon name="check" size={24}/><div><span className="big">{totalQuestions}</span><small>Questions Answered</small></div></div>
              </div>
              
              <div className="admin-grid">
                <div className="admin-card">
                  <h3><Icon name="alert" size={18}/> Needs Attention</h3>
                  <p className="card-desc">Users with broken streaks or low activity</p>
                  {inactiveUsers.length === 0 ? <p className="empty">All users are active!</p> : (
                    <div className="mini-list">{inactiveUsers.slice(0, 5).map(u => (
                      <div key={u.id} className="mini-row" onClick={() => { setSelectedUser(u); setAdminTab('users'); }}>
                        <div className="mini-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="mini-info"><span>{u.name}</span><small>Streak broken • Last active: {u.lastActive}</small></div>
                        <button className="btn-xs" onClick={(e) => { e.stopPropagation(); setNewMessage({ to: u.id, subject: '', body: '' }); setShowMessageModal(true); }}><Icon name="mail" size={14}/></button>
                      </div>
                    ))}</div>
                  )}
                </div>
                
                <div className="admin-card">
                  <h3><Icon name="trophy" size={18}/> Top Performers</h3>
                  <p className="card-desc">Highest XP this month</p>
                  <div className="mini-list">{MOCK_USERS.sort((a, b) => b.xp - a.xp).slice(0, 5).map((u, i) => (
                    <div key={u.id} className="mini-row" onClick={() => { setSelectedUser(u); setAdminTab('users'); }}>
                      <span className="mini-rank">{i + 1}</span>
                      <div className="mini-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div>
                      <div className="mini-info"><span>{u.name}</span><small>{u.xp.toLocaleString()} XP • {u.accuracy}% accuracy</small></div>
                    </div>
                  ))}</div>
                </div>
              </div>
              
              <div className="admin-card full">
                <h3><Icon name="chart" size={18}/> Topic Performance (All Users)</h3>
                <div className="topic-bars">
                  {[{ name: 'Item Codes', key: 'itemcodes', color: '#dc2626' },{ name: 'Dimensions', key: 'dimensions', color: '#2563eb' },{ name: 'Schedules', key: 'schedules', color: '#059669' },{ name: 'Terminology', key: 'terminology', color: '#7c3aed' },{ name: 'Weights', key: 'weight', color: '#f59e0b' }].map(topic => {
                    const avg = Math.round(MOCK_USERS.reduce((a, u) => a + u.topicProgress[topic.key], 0) / totalUsers);
                    return (<div key={topic.key} className="topic-bar-row"><span className="topic-bar-label">{topic.name}</span><div className="topic-bar-bg"><div className="topic-bar-fill" style={{ width: `${avg}%`, background: topic.color }}/></div><span className="topic-bar-val">{avg}%</span></div>);
                  })}
                </div>
              </div>
            </>
          )}
          
          {adminTab === 'users' && !selectedUser && (
            <div className="admin-card full">
              <div className="card-header"><h3><Icon name="users" size={18}/> All Users</h3><button className="btn-sm" onClick={sendBulkMessage}><Icon name="send" size={14}/> Message All</button></div>
              <div className="users-table">
                <div className="users-header"><span>User</span><span>Company</span><span>XP</span><span>Accuracy</span><span>Streak</span><span>Last Active</span><span>Actions</span></div>
                {MOCK_USERS.map(u => (
                  <div key={u.id} className="users-row">
                    <div className="user-cell"><div className="user-avatar-sm">{u.name.split(' ').map(n => n[0]).join('')}</div><div><span className="user-name">{u.name}</span><small>{u.email}</small></div></div>
                    <span>{u.company}</span>
                    <span className="xp">{u.xp.toLocaleString()}</span>
                    <span className={u.accuracy >= 85 ? 'good' : u.accuracy >= 70 ? 'ok' : 'low'}>{u.accuracy}%</span>
                    <span className={u.streak > 0 ? 'streak-active' : 'streak-broken'}>{u.streak} days</span>
                    <span>{u.lastActive}</span>
                    <div className="user-actions">
                      <button className="btn-xs" onClick={() => setSelectedUser(u)} title="View Details"><Icon name="eye" size={14}/></button>
                      <button className="btn-xs" onClick={() => { setNewMessage({ to: u.id, subject: '', body: '' }); setShowMessageModal(true); }} title="Send Message"><Icon name="mail" size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {adminTab === 'users' && selectedUser && (
            <div className="user-detail">
              <button className="btn-back-text" onClick={() => setSelectedUser(null)}><Icon name="arrow" size={16}/> Back to all users</button>
              <div className="user-detail-header">
                <div className="user-detail-avatar">{selectedUser.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="user-detail-info"><h2>{selectedUser.name}</h2><p>{selectedUser.email}</p><p className="company">{selectedUser.company}</p></div>
                <button className="btn-primary-sm" onClick={() => { setNewMessage({ to: selectedUser.id, subject: '', body: '' }); setShowMessageModal(true); }}><Icon name="mail" size={16}/> Send Message</button>
              </div>
              <div className="user-detail-stats">
                <div><span>{selectedUser.xp.toLocaleString()}</span><small>Total XP</small></div>
                <div><span>{selectedUser.accuracy}%</span><small>Accuracy</small></div>
                <div><span>{selectedUser.streak}</span><small>Current Streak</small></div>
                <div><span>{selectedUser.bestStreak}</span><small>Best Streak</small></div>
                <div><span>{selectedUser.sessions}</span><small>Sessions</small></div>
                <div><span>{selectedUser.questions}</span><small>Questions</small></div>
              </div>
              <div className="user-detail-section">
                <h3>Topic Progress</h3>
                <div className="topic-bars">
                  {[{ name: 'Item Codes', key: 'itemcodes', color: '#dc2626' },{ name: 'Dimensions', key: 'dimensions', color: '#2563eb' },{ name: 'Schedules', key: 'schedules', color: '#059669' },{ name: 'Terminology', key: 'terminology', color: '#7c3aed' },{ name: 'Weights', key: 'weight', color: '#f59e0b' }].map(topic => (
                    <div key={topic.key} className="topic-bar-row"><span className="topic-bar-label">{topic.name}</span><div className="topic-bar-bg"><div className="topic-bar-fill" style={{ width: `${selectedUser.topicProgress[topic.key]}%`, background: topic.color }}/></div><span className="topic-bar-val">{selectedUser.topicProgress[topic.key]}%</span></div>
                  ))}
                </div>
              </div>
              <div className="user-detail-section">
                <h3>Certifications</h3>
                <div className="cert-badges">{selectedUser.certs.length === 0 ? <p className="empty">No certifications yet</p> : selectedUser.certs.map(c => { const cert = CERTIFICATIONS.find(x => x.id === c); return cert ? <span key={c} className="cert-badge" style={{ background: cert.color }}>{cert.name}</span> : null; })}</div>
              </div>
              <div className="user-detail-section">
                <h3>Message History</h3>
                {messages.filter(m => m.to === selectedUser.id).length === 0 ? <p className="empty">No messages sent</p> : (
                  <div className="message-list">{messages.filter(m => m.to === selectedUser.id).map(m => (<div key={m.id} className="message-item"><div className="message-header"><span className="message-subject">{m.subject}</span><span className="message-date">{m.date}</span></div><p className="message-body">{m.body}</p></div>))}</div>
                )}
              </div>
            </div>
          )}
          
          {adminTab === 'progress' && (
            <div className="admin-card full">
              <h3><Icon name="chart" size={18}/> Detailed Progress Report</h3>
              <div className="progress-table">
                <div className="progress-header"><span>User</span><span>Item Codes</span><span>Dimensions</span><span>Schedules</span><span>Terminology</span><span>Weights</span><span>Overall</span></div>
                {MOCK_USERS.map(u => {
                  const overall = Math.round(Object.values(u.topicProgress).reduce((a, b) => a + b, 0) / 5);
                  return (<div key={u.id} className="progress-row">
                    <div className="user-cell-sm"><div className="user-avatar-xs">{u.name.split(' ').map(n => n[0]).join('')}</div><span>{u.name.split(' ')[0]}</span></div>
                    {['itemcodes', 'dimensions', 'schedules', 'terminology', 'weight'].map(k => (<span key={k} className={`prog-cell ${u.topicProgress[k] >= 80 ? 'high' : u.topicProgress[k] >= 50 ? 'med' : 'low'}`}>{u.topicProgress[k]}%</span>))}
                    <span className={`prog-cell overall ${overall >= 80 ? 'high' : overall >= 50 ? 'med' : 'low'}`}>{overall}%</span>
                  </div>);
                })}
              </div>
            </div>
          )}
          
          {adminTab === 'messages' && (
            <>
              <div className="admin-card full">
                <div className="card-header"><h3><Icon name="mail" size={18}/> Compose Message</h3></div>
                <div className="compose-form">
                  <div className="field"><label>To</label><select value={newMessage.to} onChange={e => setNewMessage({ ...newMessage, to: e.target.value })}><option value="">Select recipient...</option><option value="all">All Users</option>{MOCK_USERS.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}</select></div>
                  <div className="field"><label>Subject</label><input value={newMessage.subject} onChange={e => setNewMessage({ ...newMessage, subject: e.target.value })} placeholder="Message subject..."/></div>
                  <div className="field"><label>Message</label><textarea value={newMessage.body} onChange={e => setNewMessage({ ...newMessage, body: e.target.value })} placeholder="Write your message..." rows={4}/></div>
                  <button className="btn-primary" onClick={() => { if (newMessage.to === 'all') sendBulkMessage(); else sendMessage(); }}><Icon name="send" size={16}/> Send Message</button>
                </div>
              </div>
              <div className="admin-card full">
                <h3><Icon name="mail" size={18}/> Sent Messages</h3>
                {messages.length === 0 ? <p className="empty">No messages sent yet</p> : (
                  <div className="message-list">{messages.map(m => { const recipient = MOCK_USERS.find(u => u.id === m.to); return (<div key={m.id} className="message-item"><div className="message-header"><span className="message-to">To: {recipient?.name || 'Unknown'}</span><span className="message-date">{m.date}</span>{!m.read && <span className="unread-badge">Unread</span>}</div><span className="message-subject">{m.subject}</span><p className="message-body">{m.body}</p></div>); })}</div>
                )}
              </div>
            </>
          )}
        </main>
        
        {showMessageModal && (
          <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3>Send Message</h3><button className="icon-btn" onClick={() => setShowMessageModal(false)}><Icon name="x" size={18}/></button></div>
              <div className="modal-body">
                <div className="field"><label>To</label><input value={MOCK_USERS.find(u => u.id === newMessage.to)?.name || ''} disabled/></div>
                <div className="field"><label>Subject</label><input value={newMessage.subject} onChange={e => setNewMessage({ ...newMessage, subject: e.target.value })} placeholder="Message subject..."/></div>
                <div className="field"><label>Message</label><textarea value={newMessage.body} onChange={e => setNewMessage({ ...newMessage, body: e.target.value })} placeholder="Write your message..." rows={4}/></div>
              </div>
              <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowMessageModal(false)}>Cancel</button><button className="btn-primary" onClick={sendMessage}><Icon name="send" size={16}/> Send</button></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Other screens (simplified)
  const LeaderboardScreen = () => (<div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Leaderboard</h1></header><main><div className="lb-list">{MOCK_USERS.sort((a, b) => b.xp - a.xp).map((u, i) => (<div key={u.id} className="lb-row"><span className="lb-rank">{i + 1}</span><div className="lb-avatar">{u.name.split(' ').map(n => n[0]).join('')}</div><div className="lb-info"><span className="lb-name">{u.name}</span><span className="lb-company">{u.company}</span></div><div className="lb-right"><span className="lb-score">{u.xp.toLocaleString()} pts</span></div></div>))}</div></main></div>);
  
  const CertsScreen = () => (<div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Certifications</h1></header><main><div className="certs-list">{CERTIFICATIONS.map(c => (<div key={c.id} className="cert-item"><div className="cert-icon" style={{ background: c.color }}>{c.name[0]}</div><div className="cert-info"><h3>{c.name}</h3><div className="cert-reqs"><span>{c.req.questions}+ questions</span><span>{c.req.accuracy}% accuracy</span><span>{c.req.streak}-day streak</span></div></div><button className="btn-sm" onClick={() => startSession()}>Practice</button></div>))}</div></main></div>);
  
  const ProfileScreen = () => (<div className="page"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Profile</h1></header><main className="profile-main"><div className="profile-top"><div className="profile-avatar">{user?.name?.split(' ').map(n => n[0]).join('')}</div><h2>{user?.name}</h2><p>{user?.company}</p></div><div className="profile-stats"><div><span>{user?.xp || 0}</span><small>Points</small></div><div><span>{level}</span><small>Level</small></div><div><span>{user?.bestStreak || 0}</span><small>Best Streak</small></div><div><span>{user?.sessions || 0}</span><small>Sessions</small></div></div><button className="btn-danger" onClick={() => { setAuth(false); setUser(null); }}>Sign Out</button></main></div>);
  
  const ReferenceScreen = () => (<div className="page ref"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Reference</h1></header><main><section><h2>NPS to Outside Diameter</h2><div className="table-wrap"><table><thead><tr><th>NPS</th><th>OD</th><th>DN</th></tr></thead><tbody>{PIPE_DATA.sizes.map(s => (<tr key={s.nps}><td>{s.nps}</td><td>{s.od}"</td><td>{s.dn}</td></tr>))}</tbody></table></div></section><section><h2>Schedule Wall Thickness</h2><div className="table-wrap"><table><thead><tr><th>NPS</th><th>Sch40 WT</th><th>Sch40 lb/ft</th><th>Sch80 WT</th><th>Sch80 lb/ft</th></tr></thead><tbody>{Object.entries(PIPE_DATA.schedules).map(([n, d]) => (<tr key={n}><td>{n}</td><td>{d.sch40.wt}"</td><td>{d.sch40.lb}</td><td>{d.sch80.wt}"</td><td>{d.sch80.lb}</td></tr>))}</tbody></table></div></section></main></div>);
  
  const ItemCodeRefScreen = () => (<div className="page ref"><header><button className="icon-btn" onClick={() => setView('home')}><Icon name="arrow" size={20}/></button><h1>Item Codes</h1></header><main><section><h2>Code Structure</h2><div className="code-example"><div className="code-breakdown"><span className="code-part p1">1</span><span className="code-part p2">006</span><span className="code-part p3">154</span><span className="code-part p4">-05</span></div><div className="code-labels"><span>Finish</span><span>Size</span><span>Wall</span><span>Material</span></div></div></section><section><h2>First Digit</h2><div className="table-wrap"><table><thead><tr><th>Code</th><th>Meaning</th></tr></thead><tbody>{ITEM_CODES.firstDigit.map(d => <tr key={d.code}><td className="code-cell">{d.code}</td><td>{d.meaning}</td></tr>)}</tbody></table></div></section><section><h2>Pipe Size Codes</h2><div className="table-wrap"><table><thead><tr><th>Size</th><th>Code</th><th>Size</th><th>Code</th></tr></thead><tbody>{Array.from({ length: 15 }, (_, i) => (<tr key={i}>{ITEM_CODES.pipeSizeCodes.slice(i * 2, i * 2 + 2).map((p, j) => (<React.Fragment key={j}><td>{p.size}</td><td className="code-cell">{p.code}</td></React.Fragment>))}</tr>))}</tbody></table></div></section></main></div>);

  // STYLES
  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        :root{--bg:#f8fafc;--card:#fff;--border:#e2e8f0;--text:#0f172a;--muted:#64748b;--primary:#2563eb;--success:#059669;--error:#dc2626;--radius:10px}
        body{font-family:'Inter',-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
        .app{min-height:100vh}
        
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
        .field input,.field select,.field textarea{width:100%;padding:11px 14px;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px}
        .field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,0.1)}
        .field textarea{resize:vertical}
        .btn-primary{width:100%;padding:12px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-primary:hover{background:#1d4ed8}
        .btn-primary-sm{padding:10px 16px;background:var(--primary);color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px}
        .btn-secondary{padding:10px 16px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer}
        .btn-danger{width:100%;padding:11px;background:#fff;color:var(--error);border:1px solid var(--error);border-radius:8px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer}
        .btn-sm{padding:8px 14px;background:var(--bg);border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:6px}
        .btn-xs{padding:6px 10px;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .btn-xs:hover{background:#e2e8f0}
        .btn-back-text{display:flex;align-items:center;gap:6px;background:none;border:none;color:var(--primary);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;margin-bottom:20px}
        .hint{text-align:center;font-size:12px;color:var(--muted);margin-top:16px}
        
        .app-layout{min-height:100vh}
        .topbar{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .brand{display:flex;align-items:center;gap:10px;font-weight:600;font-size:15px}
        .actions{display:flex;gap:8px}
        .icon-btn{width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer}
        .icon-btn:hover{background:var(--bg);color:var(--text)}
        .icon-btn.highlight{background:#fef2f2;border-color:#fecaca;color:var(--error)}
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
        .topic-btn{display:flex;align-items:center;gap:14px;padding:16px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:left}
        .topic-btn:hover{border-color:var(--primary)}
        .topic-color{width:4px;height:32px;border-radius:2px}
        .topic-info h3{font-size:14px;font-weight:600;margin-bottom:2px}
        .topic-info p{font-size:12px;color:var(--muted)}
        .topic-count{margin-left:auto;font-size:13px;color:var(--muted);background:var(--bg);padding:4px 10px;border-radius:16px}
        .nav-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .nav-cards button{display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 14px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;text-align:center;color:var(--muted)}
        .nav-cards button:hover{border-color:var(--primary);color:var(--primary)}
        .nav-cards h3{font-size:13px;font-weight:600;color:var(--text)}
        .nav-cards p{font-size:11px}
        
        .session-wrap{min-height:100vh;background:var(--bg)}
        .session-bar{display:flex;align-items:center;gap:18px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .progress{flex:1}
        .prog-bar{height:6px;background:var(--bg);border-radius:3px;overflow:hidden}
        .prog-fill{height:100%;background:var(--primary);transition:width .3s}
        .progress span{display:block;font-size:12px;color:var(--muted);margin-top:6px;text-align:center}
        .score{font-weight:600;color:var(--success)}
        .session-main{max-width:580px;margin:40px auto;padding:0 24px}
        .q-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:28px}
        .q-card.correct{border-color:var(--success)}
        .q-card.wrong{border-color:var(--error)}
        .q-meta{display:flex;gap:8px;margin-bottom:16px}
        .diff,.cat-tag{padding:4px 12px;border-radius:16px;font-size:12px;font-weight:500}
        .diff.beginner{background:#dcfce7;color:#059669}
        .diff.intermediate{background:#fef3c7;color:#d97706}
        .diff.advanced{background:#fee2e2;color:#dc2626}
        .cat-tag{background:#e0e7ff;color:#4f46e5}
        .q-card h2{font-size:18px;font-weight:600;line-height:1.5;margin-bottom:10px}
        .q-hint{font-size:14px;color:var(--muted);background:var(--bg);padding:12px 14px;border-radius:8px;margin-bottom:20px}
        .options{display:flex;flex-direction:column;gap:10px}
        .opt{display:flex;align-items:center;gap:12px;padding:14px;background:#fff;border:1px solid var(--border);border-radius:8px;cursor:pointer;text-align:left;font-family:inherit;font-size:14px}
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
        
        .results-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg)}
        .results-card{background:#fff;border-radius:var(--radius);padding:36px;width:100%;max-width:380px;text-align:center}
        .results-top{margin-bottom:28px}
        .results-top h1{font-size:22px;margin-bottom:4px}
        .results-top.pass h1{color:var(--success)}
        .results-top p{color:var(--muted);font-size:14px}
        .score-ring{position:relative;width:120px;height:120px;margin:0 auto 24px}
        .score-ring svg{transform:rotate(-90deg)}
        .score-ring .bg{fill:none;stroke:var(--bg);stroke-width:10}
        .score-ring .fg{fill:none;stroke:var(--success);stroke-width:10;stroke-linecap:round}
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
        .reward-total{display:flex;justify-content:space-between;padding-top:12px;margin-top:8px;border-top:1px solid var(--border);font-weight:600}
        
        .page{min-height:100vh;background:var(--bg)}
        .page header{display:flex;align-items:center;gap:14px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .page header h1{font-size:17px}
        .page main{max-width:900px;margin:0 auto;padding:28px 24px}
        
        /* ADMIN STYLES */
        .admin-page main{max-width:1100px}
        .admin-tabs{display:flex;gap:8px;padding:14px 24px;background:#fff;border-bottom:1px solid var(--border)}
        .admin-tabs button{padding:9px 18px;background:transparent;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:13px;font-weight:500;color:var(--muted);cursor:pointer}
        .admin-tabs button.active{background:var(--primary);border-color:var(--primary);color:#fff}
        
        .admin-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .admin-stat{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:20px}
        .admin-stat svg{color:var(--primary)}
        .admin-stat .big{display:block;font-size:28px;font-weight:700}
        .admin-stat small{color:var(--muted);font-size:13px}
        
        .admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
        .admin-card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:20px}
        .admin-card.full{grid-column:1/-1}
        .admin-card h3{display:flex;align-items:center;gap:8px;font-size:15px;margin-bottom:4px}
        .card-desc{color:var(--muted);font-size:13px;margin-bottom:16px}
        .card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
        .card-header h3{margin-bottom:0}
        
        .mini-list{display:flex;flex-direction:column;gap:8px}
        .mini-row{display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg);border-radius:8px;cursor:pointer}
        .mini-row:hover{background:#e2e8f0}
        .mini-rank{width:20px;font-weight:600;color:var(--muted);font-size:13px}
        .mini-avatar{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:12px;font-weight:600}
        .mini-info{flex:1}
        .mini-info span{display:block;font-size:14px;font-weight:500}
        .mini-info small{color:var(--muted);font-size:12px}
        
        .topic-bars{display:flex;flex-direction:column;gap:12px}
        .topic-bar-row{display:flex;align-items:center;gap:12px}
        .topic-bar-label{width:100px;font-size:13px;font-weight:500}
        .topic-bar-bg{flex:1;height:10px;background:var(--bg);border-radius:5px;overflow:hidden}
        .topic-bar-fill{height:100%;border-radius:5px}
        .topic-bar-val{width:40px;text-align:right;font-size:13px;font-weight:600}
        
        .users-table{border:1px solid var(--border);border-radius:8px;overflow:hidden}
        .users-header,.users-row{display:grid;grid-template-columns:2fr 1.2fr .8fr .8fr .8fr 1fr .8fr;align-items:center;padding:12px 16px;gap:8px}
        .users-header{background:var(--bg);font-size:12px;font-weight:600;color:var(--muted)}
        .users-row{border-top:1px solid var(--border);font-size:13px}
        .users-row:hover{background:#f8fafc}
        .user-cell{display:flex;align-items:center;gap:10px}
        .user-avatar-sm{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:11px;font-weight:600;flex-shrink:0}
        .user-cell div{min-width:0}
        .user-name{display:block;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .user-cell small{color:var(--muted);font-size:11px}
        .xp{font-weight:600}
        .good{color:var(--success);font-weight:500}
        .ok{color:#d97706;font-weight:500}
        .low{color:var(--error);font-weight:500}
        .streak-active{color:var(--success)}
        .streak-broken{color:var(--error)}
        .user-actions{display:flex;gap:6px}
        
        .progress-table{border:1px solid var(--border);border-radius:8px;overflow:hidden}
        .progress-header,.progress-row{display:grid;grid-template-columns:1.5fr repeat(6,1fr);align-items:center;padding:10px 14px;gap:8px}
        .progress-header{background:var(--bg);font-size:11px;font-weight:600;color:var(--muted)}
        .progress-row{border-top:1px solid var(--border);font-size:13px}
        .user-cell-sm{display:flex;align-items:center;gap:8px}
        .user-avatar-xs{width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:10px;font-weight:600}
        .prog-cell{font-weight:500;text-align:center}
        .prog-cell.high{color:var(--success)}
        .prog-cell.med{color:#d97706}
        .prog-cell.low{color:var(--error)}
        .prog-cell.overall{font-weight:700}
        
        .user-detail-header{display:flex;align-items:center;gap:20px;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border)}
        .user-detail-avatar{width:72px;height:72px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:24px;font-weight:600}
        .user-detail-info{flex:1}
        .user-detail-info h2{font-size:22px;margin-bottom:4px}
        .user-detail-info p{color:var(--muted);font-size:14px}
        .user-detail-info .company{color:var(--text);font-weight:500}
        .user-detail-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
        .user-detail-stats>div{background:var(--bg);border-radius:8px;padding:16px;text-align:center}
        .user-detail-stats span{display:block;font-size:24px;font-weight:700;color:var(--primary)}
        .user-detail-stats small{font-size:12px;color:var(--muted)}
        .user-detail-section{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:20px}
        .user-detail-section h3{font-size:15px;margin-bottom:16px}
        .cert-badges{display:flex;gap:8px;flex-wrap:wrap}
        .cert-badge{padding:6px 14px;border-radius:20px;color:#fff;font-size:13px;font-weight:500}
        
        .compose-form{max-width:600px}
        .message-list{display:flex;flex-direction:column;gap:12px}
        .message-item{background:var(--bg);border-radius:8px;padding:14px}
        .message-header{display:flex;align-items:center;gap:12px;margin-bottom:8px}
        .message-to{font-weight:600;font-size:13px}
        .message-subject{font-weight:600;font-size:14px}
        .message-date{font-size:12px;color:var(--muted)}
        .unread-badge{background:var(--primary);color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}
        .message-body{font-size:14px;color:var(--muted);line-height:1.5}
        
        .modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:100}
        .modal{background:#fff;border-radius:var(--radius);width:100%;max-width:500px;max-height:90vh;overflow:auto}
        .modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid var(--border)}
        .modal-header h3{font-size:17px}
        .modal-body{padding:20px}
        .modal-footer{display:flex;justify-content:flex-end;gap:12px;padding:20px;border-top:1px solid var(--border)}
        .modal-footer .btn-primary{width:auto}
        
        .empty{color:var(--muted);text-align:center;padding:20px;font-size:14px}
        
        .lb-list{display:flex;flex-direction:column;gap:8px}
        .lb-row{display:flex;align-items:center;gap:14px;padding:14px 18px;background:#fff;border:1px solid var(--border);border-radius:8px}
        .lb-rank{width:24px;font-weight:700;color:var(--muted)}
        .lb-avatar{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-weight:600}
        .lb-info{flex:1}
        .lb-name{display:block;font-weight:600}
        .lb-company{font-size:13px;color:var(--muted)}
        .lb-right{text-align:right}
        .lb-score{font-weight:700;color:var(--primary)}
        
        .certs-list{display:flex;flex-direction:column;gap:14px}
        .cert-item{display:flex;align-items:center;gap:18px;padding:20px;background:#fff;border:1px solid var(--border);border-radius:var(--radius)}
        .cert-icon{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:10px;color:#fff;font-weight:700;font-size:18px}
        .cert-info{flex:1}
        .cert-info h3{font-size:15px;font-weight:600;margin-bottom:6px}
        .cert-reqs{display:flex;gap:12px;font-size:12px;color:var(--muted)}
        
        .profile-main{text-align:center}
        .profile-top{margin-bottom:28px}
        .profile-avatar{width:72px;height:72px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;background:var(--primary);color:#fff;border-radius:50%;font-size:24px;font-weight:600}
        .profile-top h2{font-size:22px;margin-bottom:4px}
        .profile-top p{color:var(--muted)}
        .profile-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
        .profile-stats>div{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}
        .profile-stats span{display:block;font-size:22px;font-weight:700;color:var(--primary)}
        .profile-stats small{font-size:12px;color:var(--muted)}
        
        .ref section{margin-bottom:32px}
        .ref h2{font-size:16px;font-weight:600;margin-bottom:14px}
        .table-wrap{background:#fff;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
        table{width:100%;border-collapse:collapse}
        th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);font-size:13px}
        th{background:var(--bg);font-weight:600;color:var(--muted)}
        .code-cell{font-family:monospace;font-weight:600;color:var(--primary)}
        .code-example{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:24px}
        .code-breakdown{display:flex;justify-content:center;gap:4px;margin-bottom:12px;font-family:monospace;font-size:24px;font-weight:700}
        .code-part{padding:8px 12px;border-radius:6px}
        .code-part.p1{background:#fee2e2;color:#dc2626}
        .code-part.p2{background:#dbeafe;color:#2563eb}
        .code-part.p3{background:#dcfce7;color:#059669}
        .code-part.p4{background:#fef3c7;color:#d97706}
        .code-labels{display:flex;justify-content:center;gap:24px;font-size:12px;color:var(--muted)}
        
        @media(max-width:1024px){.admin-stats{grid-template-columns:repeat(2,1fr)}.admin-grid{grid-template-columns:1fr}.users-header,.users-row{grid-template-columns:2fr 1fr 1fr 1fr}.users-header span:nth-child(2),.users-row span:nth-child(2),.users-header span:nth-child(6),.users-row span:nth-child(6){display:none}}
        @media(max-width:768px){.stats-row{grid-template-columns:1fr 1fr}.topics-grid{grid-template-columns:1fr}.nav-cards{grid-template-columns:1fr 1fr}.profile-stats{grid-template-columns:1fr 1fr}.user-detail-stats{grid-template-columns:repeat(3,1fr)}.progress-header,.progress-row{grid-template-columns:1.5fr repeat(3,1fr)}.progress-header span:nth-child(3),.progress-row span:nth-child(3),.progress-header span:nth-child(4),.progress-row span:nth-child(4),.progress-header span:nth-child(6),.progress-row span:nth-child(6){display:none}}
      `}</style>
      
      {!auth ? <AuthScreen /> : (<>
        {view === 'home' && <HomeScreen />}
        {view === 'session' && <SessionScreen />}
        {view === 'results' && <ResultsScreen />}
        {view === 'leaderboard' && <LeaderboardScreen />}
        {view === 'certs' && <CertsScreen />}
        {view === 'admin' && <AdminScreen />}
        {view === 'profile' && <ProfileScreen />}
        {view === 'reference' && <ReferenceScreen />}
        {view === 'itemcoderef' && <ItemCodeRefScreen />}
      </>)}
    </div>
  );
}
