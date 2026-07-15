import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Home, CheckSquare, BarChart2, Heart, FileText, Calendar as CalendarIcon,
  Target, TrendingUp, Bell, Settings as SettingsIcon, Search, Plus, Trash2,
  Edit2, Mic, Sparkles, Download, Sun, Moon, X, Check, Star, GripVertical,
  ChevronLeft, ChevronRight, Clock, Flame, Award, Menu, Upload, Save,
  ListChecks, Code2, Image as ImageIcon, Pin, AlertCircle, Loader2,
  CalendarDays, Zap, User, Palette, Database, FileJson, FileSpreadsheet,
  Mail, Phone, Briefcase, BookOpen, Heart as HeartIcon
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, AreaChart, Area
} from 'recharts';

/* ============================== CONSTANTS ============================== */

const CATEGORIES = ['Work', 'Personal', 'Learning', 'Health', 'Other'];
const CATEGORY_COLORS = {
  Work: '#00e5ff', Personal: '#a78bfa', Learning: '#34d399',
  Health: '#fb923c', Other: '#f472b6'
};
const PRIORITIES = ['High', 'Medium', 'Low'];
const PRIORITY_COLORS = { High: '#ff4d6d', Medium: '#ffb020', Low: '#34d399' };
const ACCENTS = [
  { name: 'Cyan', val: '#00e5ff', rgb: '0,229,255' },
  { name: 'Blue', val: '#3b82f6', rgb: '59,130,246' },
  { name: 'Violet', val: '#a78bfa', rgb: '167,139,250' },
  { name: 'Emerald', val: '#34d399', rgb: '52,211,153' },
  { name: 'Rose', val: '#fb7185', rgb: '251,113,133' },
];

const QUOTES = [
  "Small steps every day beat big plans that never start.",
  "Discipline is choosing between what you want now and what you want most.",
  "Focus on progress, not perfection.",
  "Your future is built by what you do today, not someday.",
  "Consistency turns effort into ability.",
  "A clear task list is a clear mind.",
  "Done is better than perfect.",
];

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
const daysFromNowISO = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const fmtDate = (iso) => { if (!iso) return ''; const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
const fmtDay = (iso) => { const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-US', { weekday: 'short' }); };

/* ============================== SEED DATA ============================== */

function seedTasks() {
  return [
    { id: uid(), title: 'Build DAX measures for BRICS dashboard', description: 'YoY growth and dynamic latest-year logic', priority: 'High', dueDate: daysFromNowISO(1), category: 'Work', status: 'pending', favorite: true, order: 0, createdAt: daysAgoISO(3), completedAt: null },
    { id: uid(), title: 'Practice 10 SQL window function questions', description: 'RANK, LAG, LEAD practice set', priority: 'High', dueDate: daysFromNowISO(0), category: 'Learning', status: 'pending', favorite: false, order: 1, createdAt: daysAgoISO(2), completedAt: null },
    { id: uid(), title: 'Write Medium article outline', description: 'Topic: Power Query M language basics', priority: 'Medium', dueDate: daysFromNowISO(3), category: 'Personal', status: 'pending', favorite: true, order: 2, createdAt: daysAgoISO(1), completedAt: null },
    { id: uid(), title: 'Morning walk 30 minutes', description: '', priority: 'Low', dueDate: todayISO(), category: 'Health', status: 'completed', favorite: false, order: 3, createdAt: daysAgoISO(1), completedAt: daysAgoISO(0) },
    { id: uid(), title: 'Clean Olist dataset in pandas', description: 'Handle nulls in review_score column', priority: 'Medium', dueDate: daysAgoISO(1), category: 'Work', status: 'completed', favorite: false, order: 4, createdAt: daysAgoISO(4), completedAt: daysAgoISO(1) },
    { id: uid(), title: 'Update resume ATS keywords', description: '', priority: 'Medium', dueDate: daysAgoISO(2), category: 'Work', status: 'completed', favorite: false, order: 5, createdAt: daysAgoISO(5), completedAt: daysAgoISO(2) },
    { id: uid(), title: 'Read one chapter: prompt engineering guide', description: '', priority: 'Low', dueDate: daysAgoISO(3), category: 'Learning', status: 'completed', favorite: false, order: 6, createdAt: daysAgoISO(6), completedAt: daysAgoISO(3) },
    { id: uid(), title: 'Plan weekend interview prep session', description: '', priority: 'Low', dueDate: daysFromNowISO(4), category: 'Personal', status: 'pending', favorite: false, order: 7, createdAt: daysAgoISO(0), completedAt: null },
  ];
}
function seedNotes() {
  return [
    { id: uid(), title: 'Power Query M cheatsheet', content: 'Table.TransformColumns, Table.Group, and #shared for listing all functions. Remember: M is case sensitive.', checklist: [], isCode: false, pinned: true, updatedAt: daysAgoISO(1) },
    { id: uid(), title: 'DAX time intelligence', content: 'CALCULATE(SUM(Sales[Amount]), DATEADD(Calendar[Date], -1, YEAR))', checklist: [], isCode: true, pinned: false, updatedAt: daysAgoISO(2) },
    { id: uid(), title: 'Interview prep checklist', content: '', checklist: [{ text: 'Review 50 SQL questions', done: true }, { text: 'Mock interview with Claude', done: false }, { text: 'Revise resume bullets', done: false }], isCode: false, pinned: true, updatedAt: daysAgoISO(0) },
  ];
}
function seedGoals() {
  return [
    { id: uid(), title: 'Finish 300-question interview bank', type: 'short', progress: 45, deadline: daysFromNowISO(20), milestones: [{ id: uid(), text: 'SQL section (100 Qs)', done: true }, { id: uid(), text: 'Power BI section (100 Qs)', done: false }, { id: uid(), text: 'Python section (100 Qs)', done: false }] },
    { id: uid(), title: 'Publish 4 Medium articles', type: 'short', progress: 25, deadline: daysFromNowISO(30), milestones: [{ id: uid(), text: 'Power Query basics', done: true }, { id: uid(), text: 'DAX time intelligence', done: false }, { id: uid(), text: 'SQL window functions', done: false }, { id: uid(), text: 'AI prompt engineering for analysts', done: false }] },
    { id: uid(), title: 'Become job-ready senior data analyst', type: 'long', progress: 60, deadline: daysFromNowISO(180), milestones: [{ id: uid(), text: 'Master DAX + Power Query', done: true }, { id: uid(), text: 'Build 3 portfolio dashboards', done: true }, { id: uid(), text: 'Crack 5 mock interviews', done: false }] },
  ];
}

/* ============================== SMALL UI PARTS ============================== */

function GlassCard({ children, className = '', style = {}, onClick, hover = true }) {
  return (
    <div
      className={`glass-card ${hover ? 'glass-hover' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function IconBtn({ icon: Icon, onClick, active, title, size = 18, className = '' }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`icon-btn ${active ? 'icon-btn-active' : ''} ${className}`}
    >
      <Icon size={size} />
    </button>
  );
}

function PriorityDot({ priority }) {
  return <span className="pdot" style={{ background: PRIORITY_COLORS[priority] }} />;
}

function CategoryTag({ category }) {
  const c = CATEGORY_COLORS[category] || '#94a3b8';
  return (
    <span className="cat-tag" style={{ color: c, borderColor: c + '55', background: c + '14' }}>
      {category}
    </span>
  );
}

function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="empty-state">
      <Icon size={34} style={{ opacity: 0.35, marginBottom: 10 }} />
      <p style={{ fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{sub}</p>
    </div>
  );
}

/* ============================== PARTICLE BACKGROUND ============================== */

function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];
    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function init() {
      resize();
      const count = Math.min(70, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 18000));
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 1.6 + 0.4) * devicePixelRatio,
        vy: -(Math.random() * 0.25 + 0.05) * devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.15 * devicePixelRatio,
        a: Math.random() * 0.5 + 0.15,
        hue: Math.random() > 0.5 ? '0,229,255' : '167,139,250',
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${p.a})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${p.hue},0.8)`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }
    init();
    tick();
    const onResize = () => init();
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ============================== TOAST ============================== */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = 'ok') => {
    const id = uid();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

/* ============================== MAIN APP ============================== */

export default function App() {
  const [view, setView] = useState('dashboard');
  const [tasks, setTasks] = useState(seedTasks);
  const [notes, setNotes] = useState(seedNotes);
  const [goals, setGoals] = useState(seedGoals);
  const [settings, setSettings] = useState({
    theme: 'dark', accent: ACCENTS[0], name: 'Dipankar Pal', role: 'Power BI Developer & Data Analyst',
  });
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [now, setNow] = useState(new Date());
  const glowRef = useRef(null);
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const { toasts, push } = useToasts();

  /* live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* mouse glow (ref-based, no re-render) */
  useEffect(() => {
    const el = rootRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const handler = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(var(--accent-rgb),0.10), transparent 45%)`;
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, []);

  /* persistent storage load */
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get('productivity-os-data', false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          if (parsed.tasks) setTasks(parsed.tasks);
          if (parsed.notes) setNotes(parsed.notes);
          if (parsed.goals) setGoals(parsed.goals);
          if (parsed.settings) setSettings(parsed.settings);
        }
      } catch (e) { /* first run, keep seed data */ }
      setLoaded(true);
    })();
  }, []);

  /* persistent storage save (debounced) */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(async () => {
      try {
        await window.storage.set('productivity-os-data', JSON.stringify({ tasks, notes, goals, settings }), false);
      } catch (e) { console.error('save failed', e); }
    }, 700);
    return () => clearTimeout(t);
  }, [tasks, notes, goals, settings, loaded]);

  /* keyboard shortcuts */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault(); searchRef.current?.focus();
      }
      if (e.key === 'Escape') { setNotifOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const accent = settings.accent || ACCENTS[0];

  /* ---------------- derived stats ---------------- */
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const todayStr = todayISO();
    const dueToday = tasks.filter(t => t.dueDate === todayStr && t.status !== 'completed').length;
    const overdue = tasks.filter(t => t.dueDate < todayStr && t.status !== 'completed').length;

    // streak: consecutive days (including today) with >=1 completed task
    const completedDates = new Set(tasks.filter(t => t.completedAt).map(t => t.completedAt));
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = daysAgoISO(i);
      if (completedDates.has(d)) streak++;
      else if (i === 0) continue; // today might not be done yet, don't break streak
      else break;
    }

    // last 7 days completed count
    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const d = daysAgoISO(6 - i);
      const count = tasks.filter(t => t.completedAt === d).length;
      return { day: fmtDay(d), date: d, completed: count };
    });

    // category distribution
    const catDist = CATEGORIES.map(c => ({
      name: c, value: tasks.filter(t => t.category === c).length
    })).filter(c => c.value > 0);

    // weekly productivity (last 4 weeks: completion % of tasks created in that week)
    const weekly = Array.from({ length: 4 }).map((_, i) => {
      const start = 7 * (3 - i) + 6;
      const end = 7 * (3 - i);
      const created = tasks.filter(t => {
        const days = Math.floor((new Date() - new Date(t.createdAt)) / 86400000);
        return days <= start && days >= end;
      });
      const done = created.filter(t => t.status === 'completed').length;
      return { week: `W${i + 1}`, rate: created.length ? Math.round((done / created.length) * 100) : 0 };
    });

    const productivityScore = Math.min(100, Math.round(completionRate * 0.6 + Math.min(streak, 10) * 3 + (dueToday === 0 ? 10 : 0)));

    return { total, completed, pending, completionRate, dueToday, overdue, streak, last7, catDist, weekly, productivityScore };
  }, [tasks]);

  const quote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], [now.getDate()]);

  const badges = useMemo(() => {
    const list = [];
    if (stats.completed >= 1) list.push({ icon: Check, label: 'First task done' });
    if (stats.completed >= 10) list.push({ icon: Award, label: '10 tasks completed' });
    if (stats.streak >= 3) list.push({ icon: Flame, label: '3 day streak' });
    if (stats.streak >= 7) list.push({ icon: Flame, label: '7 day streak' });
    if (goals.some(g => g.progress >= 100)) list.push({ icon: Target, label: 'Goal achieved' });
    if (notes.length >= 3) list.push({ icon: FileText, label: 'Note taker' });
    return list;
  }, [stats, goals, notes]);

  const notifications = useMemo(() => {
    const list = [];
    const todayStr = todayISO();
    tasks.filter(t => t.status !== 'completed' && t.dueDate === todayStr)
      .forEach(t => list.push({ id: t.id, type: 'due', text: `"${t.title}" is due today` }));
    tasks.filter(t => t.status !== 'completed' && t.dueDate < todayStr)
      .forEach(t => list.push({ id: t.id, type: 'overdue', text: `"${t.title}" is overdue` }));
    goals.filter(g => {
      const days = Math.floor((new Date(g.deadline) - new Date()) / 86400000);
      return days >= 0 && days <= 3 && g.progress < 100;
    }).forEach(g => list.push({ id: g.id, type: 'goal', text: `Goal "${g.title}" deadline is close` }));
    return list;
  }, [tasks, goals]);

  /* ---------------- task actions ---------------- */
  const addTask = (data) => {
    setTasks(prev => [...prev, { id: uid(), status: 'pending', favorite: false, order: prev.length, completedAt: null, createdAt: todayISO(), ...data }]);
    push('Task added');
  };
  const updateTask = (id, patch) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  const deleteTask = (id) => { setTasks(prev => prev.filter(t => t.id !== id)); push('Task deleted', 'warn'); };
  const toggleComplete = (id) => setTasks(prev => prev.map(t => t.id === id ? {
    ...t, status: t.status === 'completed' ? 'pending' : 'completed',
    completedAt: t.status === 'completed' ? null : todayISO()
  } : t));
  const toggleFavorite = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));

  const globalSearchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const q = searchTerm.toLowerCase();
    return {
      tasks: tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)),
      notes: notes.filter(n => n.title.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)),
    };
  }, [searchTerm, tasks, notes]);

  const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div
      ref={rootRef}
      className={`app-root theme-${settings.theme}`}
      style={{ '--accent': accent.val, '--accent-rgb': accent.rgb }}
    >
      <style>{CSS}</style>
      <ParticleBackground />
      <div ref={glowRef} className="mouse-glow" />

      {/* ---------- SIDEBAR ---------- */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-orb"><Zap size={18} /></div>
          <div>
            <div className="brand-title">NEXUS<span style={{ color: 'var(--accent)' }}>OS</span></div>
            <div className="brand-sub">Productivity engine</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-item ${view === n.id ? 'nav-item-active' : ''}`}
              onClick={() => { setView(n.id); setSidebarOpen(false); }}
            >
              <n.icon size={17} />
              <span>{n.label}</span>
              {view === n.id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="profile-mini">
            <div className="avatar-ring"><User size={16} /></div>
            <div style={{ minWidth: 0 }}>
              <div className="profile-name">{settings.name}</div>
              <div className="profile-role">{settings.role}</div>
            </div>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="sidebar-scrim" onClick={() => setSidebarOpen(false)} />}

      {/* ---------- MAIN ---------- */}
      <div className="main-col">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="search-wrap">
            <Search size={15} style={{ opacity: 0.5 }} />
            <input
              ref={searchRef}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search tasks, notes... (press /)"
              className="search-input"
            />
            {searchTerm && <X size={14} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setSearchTerm('')} />}
          </div>
          <div className="topbar-right">
            <div className="clock-chip">
              <Clock size={14} />
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ position: 'relative' }}>
              <IconBtn icon={Bell} onClick={() => setNotifOpen(o => !o)} title="Notifications" />
              {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
              {notifOpen && (
                <div className="notif-panel glass-card">
                  <div className="notif-head">Notifications</div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '18px 14px', fontSize: 13, color: 'var(--text-3)' }}>You're all caught up.</div>
                  ) : notifications.map(n => (
                    <div key={n.id + n.type} className="notif-row">
                      <AlertCircle size={14} style={{ color: n.type === 'overdue' ? '#ff4d6d' : 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                      <span>{n.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {globalSearchResults ? (
          <SearchResults results={globalSearchResults} onClear={() => setSearchTerm('')} onOpenTasks={() => { setSearchTerm(''); setView('tasks'); }} onOpenNotes={() => { setSearchTerm(''); setView('notes'); }} />
        ) : (
          <main className="view-area">
            {view === 'dashboard' && <DashboardView stats={stats} settings={settings} now={now} quote={quote} tasks={tasks} badges={badges} onNav={setView} />}
            {view === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} toggleComplete={toggleComplete} toggleFavorite={toggleFavorite} push={push} />}
            {view === 'analytics' && <AnalyticsView stats={stats} accent={accent} />}
            {view === 'favorites' && <FavoritesView tasks={tasks} notes={notes} toggleFavorite={toggleFavorite} toggleComplete={toggleComplete} setNotes={setNotes} onNav={setView} />}
            {view === 'notes' && <NotesView notes={notes} setNotes={setNotes} push={push} />}
            {view === 'calendar' && <CalendarView tasks={tasks} />}
            {view === 'goals' && <GoalsView goals={goals} setGoals={setGoals} push={push} />}
            {view === 'insights' && <InsightsView stats={stats} tasks={tasks} goals={goals} />}
            {view === 'settings' && <SettingsView settings={settings} setSettings={setSettings} tasks={tasks} notes={notes} goals={goals} push={push} />}
          </main>
        )}
      </div>

      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'warn' ? <AlertCircle size={14} /> : <Check size={14} />} {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== SEARCH RESULTS ============================== */
function SearchResults({ results, onClear, onOpenTasks, onOpenNotes }) {
  return (
    <main className="view-area">
      <div className="view-head">
        <h1>Search results</h1>
        <button className="ghost-btn" onClick={onClear}>Clear</button>
      </div>
      <GlassCard className="pad-lg" style={{ marginBottom: 16 }}>
        <div className="section-label" onClick={onOpenTasks} style={{ cursor: 'pointer' }}>Tasks ({results.tasks.length})</div>
        {results.tasks.length === 0 ? <p className="muted-sm">No matching tasks.</p> : results.tasks.slice(0, 6).map(t => (
          <div key={t.id} className="search-row">
            <PriorityDot priority={t.priority} /><span>{t.title}</span><CategoryTag category={t.category} />
          </div>
        ))}
      </GlassCard>
      <GlassCard className="pad-lg">
        <div className="section-label" onClick={onOpenNotes} style={{ cursor: 'pointer' }}>Notes ({results.notes.length})</div>
        {results.notes.length === 0 ? <p className="muted-sm">No matching notes.</p> : results.notes.slice(0, 6).map(n => (
          <div key={n.id} className="search-row"><FileText size={13} /><span>{n.title}</span></div>
        ))}
      </GlassCard>
    </main>
  );
}

/* ============================== DASHBOARD ============================== */
function DashboardView({ stats, settings, now, quote, tasks, badges, onNav }) {
  const hour = now.getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const upcoming = tasks.filter(t => t.status !== 'completed').sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);

  return (
    <div className="fade-in">
      <div className="view-head">
        <div>
          <h1>{greet}, {settings.name.split(' ')[0]}<span className="wave">👋</span></h1>
          <p className="muted-sm">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon={CheckSquare} label="Daily progress" value={`${stats.completionRate}%`} sub={`${stats.completed}/${stats.total} tasks done`} bar={stats.completionRate} />
        <StatCard icon={Zap} label="Productivity score" value={stats.productivityScore} sub="out of 100" bar={stats.productivityScore} />
        <StatCard icon={Flame} label="Current streak" value={`${stats.streak}d`} sub="consecutive active days" bar={Math.min(100, stats.streak * 10)} />
        <StatCard icon={AlertCircle} label="Due today" value={stats.dueToday} sub={`${stats.overdue} overdue`} bar={stats.dueToday === 0 ? 100 : 30} />
      </div>

      <div className="dash-grid">
        <GlassCard className="pad-lg orb-card">
          <div className="section-label">Productivity orb</div>
          <div className="orb-wrap">
            <div className="holo-ring" style={{ '--pct': stats.productivityScore }}>
              <div className="orb-inner">
                <div className="orb-value">{stats.productivityScore}</div>
                <div className="orb-label">score</div>
              </div>
            </div>
          </div>
          <div className="quote-box">
            <Sparkles size={13} style={{ color: 'var(--accent)' }} />
            <span>{quote}</span>
          </div>
        </GlassCard>

        <GlassCard className="pad-lg">
          <div className="section-label">Upcoming tasks</div>
          {upcoming.length === 0 ? <EmptyState icon={CheckSquare} title="Nothing due" sub="Add a task to get started." /> : (
            <div className="mini-list">
              {upcoming.map(t => (
                <div key={t.id} className="mini-row">
                  <PriorityDot priority={t.priority} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mini-title">{t.title}</div>
                    <div className="mini-sub">{fmtDate(t.dueDate)} · {t.category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="ghost-btn full-w" style={{ marginTop: 12 }} onClick={() => onNav('tasks')}>View all tasks</button>
        </GlassCard>

        <GlassCard className="pad-lg">
          <div className="section-label">Achievements</div>
          {badges.length === 0 ? <EmptyState icon={Award} title="No badges yet" sub="Complete tasks to earn them." /> : (
            <div className="badge-grid">
              {badges.map((b, i) => (
                <div key={i} className="badge-chip">
                  <b.icon size={14} style={{ color: 'var(--accent)' }} />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, bar }) {
  return (
    <GlassCard className="pad-md stat-card">
      <div className="stat-top">
        <div className="stat-icon"><Icon size={16} /></div>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
      <div className="mini-bar"><div className="mini-bar-fill" style={{ width: `${Math.min(100, Math.max(0, bar))}%` }} /></div>
    </GlassCard>
  );
}

/* ============================== TASKS ============================== */
function TasksView({ tasks, setTasks, addTask, updateTask, deleteTask, toggleComplete, toggleFavorite, push }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [search, setSearch] = useState('');
  const [quickTitle, setQuickTitle] = useState('');
  const [dragId, setDragId] = useState(null);
  const [listening, setListening] = useState(false);

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (filterStatus !== 'all') list = list.filter(t => t.status === filterStatus);
    if (filterCat !== 'all') list = list.filter(t => t.category === filterCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.order - b.order);
  }, [tasks, filterStatus, filterCat, search]);

  const progress = tasks.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0;

  const quickAdd = () => {
    if (!quickTitle.trim()) return;
    addTask({ title: quickTitle.trim(), description: '', priority: 'Medium', dueDate: todayISO(), category: 'Work' });
    setQuickTitle('');
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { push('Voice input not supported on this device', 'warn'); return; }
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => setQuickTitle(e.results[0][0].transcript);
    rec.start();
  };

  const onDrop = (targetId) => {
    if (!dragId || dragId === targetId) return;
    setTasks(prev => {
      const list = [...prev].sort((a, b) => a.order - b.order);
      const fromIdx = list.findIndex(t => t.id === dragId);
      const toIdx = list.findIndex(t => t.id === targetId);
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return list.map((t, i) => ({ ...t, order: i }));
    });
    setDragId(null);
  };

  return (
    <div className="fade-in">
      <div className="view-head">
        <div>
          <h1>Task manager</h1>
          <p className="muted-sm">{tasks.filter(t => t.status !== 'completed').length} active · {tasks.filter(t => t.status === 'completed').length} completed</p>
        </div>
        <button className="primary-btn" onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={15} /> New task</button>
      </div>

      <GlassCard className="pad-md" style={{ marginBottom: 16 }}>
        <div className="progress-row">
          <span className="muted-sm">Overall progress</span>
          <span className="muted-sm" style={{ color: 'var(--accent)' }}>{progress}%</span>
        </div>
        <div className="mini-bar" style={{ height: 8 }}><div className="mini-bar-fill" style={{ width: `${progress}%` }} /></div>
      </GlassCard>

      <GlassCard className="pad-md" style={{ marginBottom: 16 }}>
        <div className="quick-add-row">
          <input
            className="text-input"
            placeholder="Quick add a task and press Enter..."
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && quickAdd()}
          />
          <button className={`icon-btn ${listening ? 'icon-btn-active' : ''}`} onClick={startVoice} title="Voice input"><Mic size={16} /></button>
          <button className="primary-btn small" onClick={quickAdd}><Plus size={14} /></button>
        </div>
      </GlassCard>

      <div className="filter-row">
        <div className="search-wrap sm">
          <Search size={13} style={{ opacity: 0.5 }} />
          <input className="search-input" placeholder="Filter tasks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select className="select-input" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="pad-lg"><EmptyState icon={CheckSquare} title="No tasks found" sub="Try changing filters or add a new task." /></GlassCard>
      ) : (
        <div className="task-list">
          {filtered.map(t => (
            <div
              key={t.id}
              draggable
              onDragStart={() => setDragId(t.id)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(t.id)}
              className={`task-row glass-card ${t.status === 'completed' ? 'task-done' : ''}`}
            >
              <GripVertical size={14} className="drag-handle" />
              <button className={`check-circle ${t.status === 'completed' ? 'check-circle-done' : ''}`} onClick={() => toggleComplete(t.id)}>
                {t.status === 'completed' && <Check size={12} />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="task-title-row">
                  <PriorityDot priority={t.priority} />
                  <span className="task-title">{t.title}</span>
                  <CategoryTag category={t.category} />
                </div>
                {t.description && <div className="task-desc">{t.description}</div>}
                <div className="task-meta"><Clock size={11} /> {fmtDate(t.dueDate)}</div>
              </div>
              <div className="task-actions">
                <IconBtn icon={Star} active={t.favorite} onClick={() => toggleFavorite(t.id)} title="Favorite" size={15} />
                <IconBtn icon={Edit2} onClick={() => { setEditing(t); setModalOpen(true); }} title="Edit" size={15} />
                <IconBtn icon={Trash2} onClick={() => deleteTask(t.id)} title="Delete" size={15} />
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <TaskModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSave={(data) => {
            if (editing) updateTask(editing.id, data);
            else addTask(data);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function TaskModal({ initial, onClose, onSave }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [priority, setPriority] = useState(initial?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(initial?.dueDate || todayISO());
  const [category, setCategory] = useState(initial?.category || 'Work');

  const save = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, priority, dueDate, category });
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-box glass-card" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{initial ? 'Edit task' : 'New task'}</h3>
          <IconBtn icon={X} onClick={onClose} />
        </div>
        <label className="field-label">Title</label>
        <input className="text-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Build SQL practice set" autoFocus />
        <label className="field-label">Description</label>
        <textarea className="text-input" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional details..." />
        <div className="field-row">
          <div style={{ flex: 1 }}>
            <label className="field-label">Priority</label>
            <select className="select-input full-w" value={priority} onChange={e => setPriority(e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="field-label">Category</label>
            <select className="select-input full-w" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <label className="field-label">Due date</label>
        <input type="date" className="text-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        <div className="modal-actions">
          <button className="ghost-btn" onClick={onClose}>Cancel</button>
          <button className="primary-btn" onClick={save}><Save size={14} /> Save task</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== ANALYTICS ============================== */
function AnalyticsView({ stats, accent }) {
  const radial = [{ name: 'rate', value: stats.completionRate, fill: accent.val }];
  return (
    <div className="fade-in">
      <div className="view-head"><h1>Analytics</h1><p className="muted-sm">Live insights derived from your tasks</p></div>

      <div className="stat-grid">
        <StatCard icon={CheckSquare} label="Completion rate" value={`${stats.completionRate}%`} sub="of all tasks" bar={stats.completionRate} />
        <StatCard icon={Flame} label="Streak" value={`${stats.streak}d`} sub="active days" bar={Math.min(100, stats.streak * 10)} />
        <StatCard icon={CheckSquare} label="Completed" value={stats.completed} sub="tasks total" bar={stats.total ? (stats.completed / stats.total) * 100 : 0} />
        <StatCard icon={AlertCircle} label="Overdue" value={stats.overdue} sub="need attention" bar={stats.overdue === 0 ? 100 : 40} />
      </div>

      <div className="chart-grid">
        <GlassCard className="pad-lg">
          <div className="section-label">Tasks completed — last 7 days</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="completed" fill={accent.val} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="pad-lg">
          <div className="section-label">Weekly productivity</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.weekly}>
              <defs>
                <linearGradient id="gradAccent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent.val} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={accent.val} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="rate" stroke={accent.val} fill="url(#gradAccent)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="pad-lg">
          <div className="section-label">Category distribution</div>
          {stats.catDist.length === 0 ? <EmptyState icon={BarChart2} title="No data yet" sub="Add tasks with categories." /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.catDist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {stats.catDist.map((c, i) => <Cell key={i} fill={CATEGORY_COLORS[c.name]} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="legend-row">
            {stats.catDist.map(c => (
              <span key={c.name} className="legend-chip"><span className="legend-dot" style={{ background: CATEGORY_COLORS[c.name] }} />{c.name} ({c.value})</span>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="pad-lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="section-label" style={{ alignSelf: 'flex-start' }}>Completion rate</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={radial} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'rgba(255,255,255,0.06)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: -140, fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stats.completionRate}%</div>
        </GlassCard>
      </div>
    </div>
  );
}
const tooltipStyle = { background: 'rgba(10,14,26,0.95)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 10, fontSize: 12, color: '#e6f1ff' };

/* ============================== FAVORITES ============================== */
function FavoritesView({ tasks, notes, toggleFavorite, toggleComplete, setNotes, onNav }) {
  const favTasks = tasks.filter(t => t.favorite);
  const pinnedNotes = notes.filter(n => n.pinned);
  const togglePin = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

  return (
    <div className="fade-in">
      <div className="view-head"><h1>Favorites</h1><p className="muted-sm">Starred tasks and pinned notes, all in one place</p></div>

      <div className="section-label">Favorite tasks ({favTasks.length})</div>
      {favTasks.length === 0 ? <GlassCard className="pad-lg" style={{ marginBottom: 20 }}><EmptyState icon={Star} title="No favorites yet" sub="Star a task from the Tasks page." /></GlassCard> : (
        <div className="task-list" style={{ marginBottom: 24 }}>
          {favTasks.map(t => (
            <div key={t.id} className={`task-row glass-card ${t.status === 'completed' ? 'task-done' : ''}`}>
              <button className={`check-circle ${t.status === 'completed' ? 'check-circle-done' : ''}`} onClick={() => toggleComplete(t.id)}>
                {t.status === 'completed' && <Check size={12} />}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="task-title-row"><PriorityDot priority={t.priority} /><span className="task-title">{t.title}</span><CategoryTag category={t.category} /></div>
                <div className="task-meta"><Clock size={11} /> {fmtDate(t.dueDate)}</div>
              </div>
              <IconBtn icon={Star} active onClick={() => toggleFavorite(t.id)} />
            </div>
          ))}
        </div>
      )}

      <div className="section-label">Pinned notes ({pinnedNotes.length})</div>
      {pinnedNotes.length === 0 ? <GlassCard className="pad-lg"><EmptyState icon={Pin} title="No pinned notes" sub="Pin a note from the Notes page." /></GlassCard> : (
        <div className="notes-grid">
          {pinnedNotes.map(n => (
            <GlassCard key={n.id} className="pad-md note-card">
              <div className="note-head"><FileText size={13} style={{ color: 'var(--accent)' }} /><span className="note-title">{n.title}</span>
                <IconBtn icon={Pin} active onClick={() => togglePin(n.id)} size={14} />
              </div>
              <p className="note-preview">{n.content?.slice(0, 100) || (n.checklist.length ? `${n.checklist.filter(c => c.done).length}/${n.checklist.length} checklist items done` : 'Empty note')}</p>
            </GlassCard>
          ))}
        </div>
      )}
      <button className="ghost-btn" style={{ marginTop: 16 }} onClick={() => onNav('notes')}>Go to notes</button>
    </div>
  );
}

/* ============================== NOTES ============================== */
function NotesView({ notes, setNotes, push }) {
  const [activeId, setActiveId] = useState(notes[0]?.id || null);
  const active = notes.find(n => n.id === activeId);
  const [saved, setSaved] = useState(true);

  const createNote = () => {
    const n = { id: uid(), title: 'Untitled note', content: '', checklist: [], isCode: false, pinned: false, updatedAt: todayISO() };
    setNotes(prev => [n, ...prev]);
    setActiveId(n.id);
  };
  const patchNote = (patch) => {
    setSaved(false);
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...patch, updatedAt: todayISO() } : n));
    setTimeout(() => setSaved(true), 500);
  };
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeId === id) setActiveId(null);
    push('Note deleted', 'warn');
  };
  const addChecklistItem = () => {
    if (!active) return;
    patchNote({ checklist: [...active.checklist, { text: 'New item', done: false }] });
  };

  return (
    <div className="fade-in notes-layout">
      <div className="notes-sidebar">
        <button className="primary-btn full-w" onClick={createNote}><Plus size={14} /> New note</button>
        <div className="notes-list">
          {notes.length === 0 && <p className="muted-sm" style={{ padding: 12 }}>No notes yet.</p>}
          {[...notes].sort((a, b) => (b.pinned - a.pinned) || b.updatedAt.localeCompare(a.updatedAt)).map(n => (
            <div key={n.id} className={`notes-list-item ${activeId === n.id ? 'notes-list-item-active' : ''}`} onClick={() => setActiveId(n.id)}>
              {n.pinned && <Pin size={11} style={{ color: 'var(--accent)' }} />}
              {n.isCode && <Code2 size={11} />}
              <span>{n.title || 'Untitled'}</span>
            </div>
          ))}
        </div>
      </div>
      <GlassCard className="pad-lg notes-editor">
        {!active ? <EmptyState icon={FileText} title="Select or create a note" sub="Your notes appear here." /> : (
          <>
            <div className="editor-toolbar">
              <input className="note-title-input" value={active.title} onChange={e => patchNote({ title: e.target.value })} />
              <div style={{ display: 'flex', gap: 6 }}>
                <IconBtn icon={Pin} active={active.pinned} onClick={() => patchNote({ pinned: !active.pinned })} title="Pin note" />
                <IconBtn icon={Code2} active={active.isCode} onClick={() => patchNote({ isCode: !active.isCode })} title="Code block mode" />
                <IconBtn icon={Trash2} onClick={() => deleteNote(active.id)} title="Delete note" />
              </div>
            </div>
            <textarea
              className={`note-textarea ${active.isCode ? 'note-code' : ''}`}
              rows={8}
              value={active.content}
              onChange={e => patchNote({ content: e.target.value })}
              placeholder={active.isCode ? 'SELECT * FROM sales;' : 'Write your note here...'}
            />
            <div className="checklist-head">
              <span className="section-label" style={{ margin: 0 }}><ListChecks size={13} style={{ marginRight: 4 }} />Checklist</span>
              <button className="ghost-btn small" onClick={addChecklistItem}><Plus size={12} /> Item</button>
            </div>
            {active.checklist.map((item, idx) => (
              <div key={idx} className="checklist-row">
                <button
                  className={`check-circle small ${item.done ? 'check-circle-done' : ''}`}
                  onClick={() => {
                    const cl = [...active.checklist]; cl[idx] = { ...cl[idx], done: !cl[idx].done };
                    patchNote({ checklist: cl });
                  }}
                >{item.done && <Check size={10} />}</button>
                <input
                  className="checklist-input"
                  value={item.text}
                  onChange={e => { const cl = [...active.checklist]; cl[idx] = { ...cl[idx], text: e.target.value }; patchNote({ checklist: cl }); }}
                  style={{ textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.5 : 1 }}
                />
                <IconBtn icon={X} size={13} onClick={() => patchNote({ checklist: active.checklist.filter((_, i) => i !== idx) })} />
              </div>
            ))}
            <div className="autosave-chip">{saved ? <><Check size={11} /> Saved</> : <><Loader2 size={11} className="spin" /> Saving...</>}</div>
          </>
        )}
      </GlassCard>
    </div>
  );
}

/* ============================== CALENDAR ============================== */
function CalendarView({ tasks }) {
  const [cursor, setCursor] = useState(new Date());
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const [selected, setSelected] = useState(todayISO());

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(t => { (map[t.dueDate] ||= []).push(t); });
    return map;
  }, [tasks]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const upcoming = tasks.filter(t => t.status !== 'completed' && t.dueDate >= todayISO()).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
  const selectedTasks = tasksByDate[selected] || [];

  const isoOf = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  return (
    <div className="fade-in">
      <div className="view-head"><h1>Calendar</h1><p className="muted-sm">Plan your days and track deadlines</p></div>
      <div className="calendar-grid-layout">
        <GlassCard className="pad-lg">
          <div className="cal-nav">
            <IconBtn icon={ChevronLeft} onClick={() => setCursor(new Date(year, month - 1, 1))} />
            <span className="cal-month">{cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <IconBtn icon={ChevronRight} onClick={() => setCursor(new Date(year, month + 1, 1))} />
          </div>
          <div className="cal-weekdays">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className="cal-grid">
            {cells.map((d, i) => {
              if (!d) return <div key={i} className="cal-cell cal-cell-empty" />;
              const iso = isoOf(d);
              const dayTasks = tasksByDate[iso] || [];
              const isToday = iso === todayISO();
              return (
                <div key={i} className={`cal-cell ${isToday ? 'cal-cell-today' : ''} ${selected === iso ? 'cal-cell-selected' : ''}`} onClick={() => setSelected(iso)}>
                  <span>{d}</span>
                  {dayTasks.length > 0 && (
                    <div className="cal-dots">
                      {dayTasks.slice(0, 3).map((t, j) => <span key={j} className="cal-dot" style={{ background: PRIORITY_COLORS[t.priority] }} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>

        <div className="cal-side">
          <GlassCard className="pad-lg">
            <div className="section-label">{fmtDate(selected)}</div>
            {selectedTasks.length === 0 ? <p className="muted-sm">No tasks scheduled.</p> : (
              <div className="mini-list">
                {selectedTasks.map(t => (
                  <div key={t.id} className="mini-row">
                    <PriorityDot priority={t.priority} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="mini-title">{t.title}</div>
                      <div className="mini-sub">{t.category} · {t.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
          <GlassCard className="pad-lg">
            <div className="section-label"><CalendarDays size={13} style={{ marginRight: 4 }} />Upcoming deadlines</div>
            {upcoming.length === 0 ? <p className="muted-sm">Nothing coming up.</p> : (
              <div className="mini-list">
                {upcoming.map(t => (
                  <div key={t.id} className="mini-row">
                    <PriorityDot priority={t.priority} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="mini-title">{t.title}</div>
                      <div className="mini-sub">{fmtDate(t.dueDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ============================== GOALS ============================== */
function GoalsView({ goals, setGoals, push }) {
  const [modalOpen, setModalOpen] = useState(false);
  const shortTerm = goals.filter(g => g.type === 'short');
  const longTerm = goals.filter(g => g.type === 'long');

  const addGoal = (data) => { setGoals(prev => [...prev, { id: uid(), progress: 0, milestones: [], ...data }]); push('Goal added'); };
  const deleteGoal = (id) => { setGoals(prev => prev.filter(g => g.id !== id)); push('Goal removed', 'warn'); };
  const toggleMilestone = (goalId, mIdx) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const ms = [...g.milestones];
      ms[mIdx] = { ...ms[mIdx], done: !ms[mIdx].done };
      const progress = ms.length ? Math.round((ms.filter(m => m.done).length / ms.length) * 100) : g.progress;
      return { ...g, milestones: ms, progress };
    }));
  };

  return (
    <div className="fade-in">
      <div className="view-head">
        <div><h1>Goals</h1><p className="muted-sm">Track short-term and long-term goals with milestones</p></div>
        <button className="primary-btn" onClick={() => setModalOpen(true)}><Plus size={15} /> New goal</button>
      </div>

      <div className="section-label">Short-term goals</div>
      <div className="goals-grid">
        {shortTerm.length === 0 && <GlassCard className="pad-lg"><EmptyState icon={Target} title="No short-term goals" sub="Add one to start tracking." /></GlassCard>}
        {shortTerm.map(g => <GoalCard key={g.id} g={g} onDelete={deleteGoal} onToggleMilestone={toggleMilestone} />)}
      </div>

      <div className="section-label" style={{ marginTop: 24 }}>Long-term goals</div>
      <div className="goals-grid">
        {longTerm.length === 0 && <GlassCard className="pad-lg"><EmptyState icon={Target} title="No long-term goals" sub="Add one to start tracking." /></GlassCard>}
        {longTerm.map(g => <GoalCard key={g.id} g={g} onDelete={deleteGoal} onToggleMilestone={toggleMilestone} />)}
      </div>

      {modalOpen && <GoalModal onClose={() => setModalOpen(false)} onSave={(d) => { addGoal(d); setModalOpen(false); }} />}
    </div>
  );
}

function GoalCard({ g, onDelete, onToggleMilestone }) {
  return (
    <GlassCard className="pad-lg goal-card">
      <div className="goal-head">
        <span className="goal-title">{g.title}</span>
        <IconBtn icon={Trash2} size={14} onClick={() => onDelete(g.id)} />
      </div>
      <div className="mini-bar" style={{ height: 8, margin: '10px 0' }}><div className="mini-bar-fill" style={{ width: `${g.progress}%` }} /></div>
      <div className="goal-meta"><span>{g.progress}% complete</span><span>Due {fmtDate(g.deadline)}</span></div>
      {g.milestones.length > 0 && (
        <div className="mini-list" style={{ marginTop: 10 }}>
          {g.milestones.map((m, i) => (
            <div key={m.id || i} className="mini-row" style={{ cursor: 'pointer' }} onClick={() => onToggleMilestone(g.id, i)}>
              <button className={`check-circle small ${m.done ? 'check-circle-done' : ''}`}>{m.done && <Check size={10} />}</button>
              <span style={{ fontSize: 13, textDecoration: m.done ? 'line-through' : 'none', opacity: m.done ? 0.55 : 1 }}>{m.text}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

function GoalModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('short');
  const [deadline, setDeadline] = useState(daysFromNowISO(14));
  const [milestonesText, setMilestonesText] = useState('');

  const save = () => {
    if (!title.trim()) return;
    const milestones = milestonesText.split('\n').map(s => s.trim()).filter(Boolean).map(text => ({ id: uid(), text, done: false }));
    onSave({ title: title.trim(), type, deadline, milestones });
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-box glass-card" onClick={e => e.stopPropagation()}>
        <div className="modal-head"><h3>New goal</h3><IconBtn icon={X} onClick={onClose} /></div>
        <label className="field-label">Goal title</label>
        <input className="text-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Finish Power BI certification" autoFocus />
        <div className="field-row">
          <div style={{ flex: 1 }}>
            <label className="field-label">Type</label>
            <select className="select-input full-w" value={type} onChange={e => setType(e.target.value)}>
              <option value="short">Short-term</option>
              <option value="long">Long-term</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="field-label">Deadline</label>
            <input type="date" className="text-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
        </div>
        <label className="field-label">Milestones (one per line)</label>
        <textarea className="text-input" rows={4} value={milestonesText} onChange={e => setMilestonesText(e.target.value)} placeholder={'Complete module 1\nComplete module 2'} />
        <div className="modal-actions">
          <button className="ghost-btn" onClick={onClose}>Cancel</button>
          <button className="primary-btn" onClick={save}><Save size={14} /> Save goal</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== INSIGHTS ============================== */
function InsightsView({ stats, tasks, goals }) {
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const catTime = CATEGORIES.map(c => ({ name: c, count: tasks.filter(t => t.category === c && t.status === 'completed').length })).filter(c => c.count > 0);

  const getSuggestions = async () => {
    setAiLoading(true); setAiError(''); setAiText('');
    try {
      const summary = `Total tasks: ${stats.total}, completed: ${stats.completed}, pending: ${stats.pending}, overdue: ${stats.overdue}, completion rate: ${stats.completionRate}%, current streak: ${stats.streak} days. Categories worked on: ${catTime.map(c => c.name).join(', ') || 'none'}. Goals in progress: ${goals.map(g => `${g.title} (${g.progress}%)`).join('; ') || 'none'}.`;
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a productivity coach inside a personal task app. Based on this user's real data, give exactly 3 short, specific, actionable suggestions to improve their productivity this week. Keep each suggestion to one sentence. Data: ${summary}`
          }]
        })
      });
      const data = await response.json();
      const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      setAiText(text || 'No suggestions returned.');
    } catch (e) {
      setAiError('Could not reach AI suggestions right now. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="view-head"><h1>Productivity insights</h1><p className="muted-sm">Summaries and AI-generated suggestions based on your activity</p></div>

      <div className="insight-grid">
        <GlassCard className="pad-lg">
          <div className="section-label">Daily summary</div>
          <p className="insight-text">Today you have <b>{stats.dueToday}</b> task{stats.dueToday === 1 ? '' : 's'} due and <b>{stats.overdue}</b> overdue. Your completion rate stands at <b>{stats.completionRate}%</b> with a <b>{stats.streak}-day</b> streak.</p>
        </GlassCard>
        <GlassCard className="pad-lg">
          <div className="section-label">Weekly report</div>
          <p className="insight-text">Over the last 7 days you completed <b>{stats.last7.reduce((a, d) => a + d.completed, 0)}</b> tasks. Your busiest category is <b>{catTime.sort((a, b) => b.count - a.count)[0]?.name || 'not set yet'}</b>.</p>
        </GlassCard>
        <GlassCard className="pad-lg">
          <div className="section-label">Monthly progress</div>
          <p className="insight-text">You have <b>{goals.length}</b> active goal{goals.length === 1 ? '' : 's'} with an average progress of <b>{goals.length ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0}%</b>.</p>
        </GlassCard>
      </div>

      <GlassCard className="pad-lg" style={{ marginTop: 16 }}>
        <div className="section-label">Time spent by category (completed tasks)</div>
        {catTime.length === 0 ? <EmptyState icon={BarChart2} title="No completed tasks yet" sub="Complete tasks to see this breakdown." /> : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catTime} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {catTime.map((c, i) => <Cell key={i} fill={CATEGORY_COLORS[c.name]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      <GlassCard className="pad-lg" style={{ marginTop: 16 }}>
        <div className="section-label"><Sparkles size={14} style={{ marginRight: 4, color: 'var(--accent)' }} />AI productivity suggestions</div>
        <p className="muted-sm" style={{ marginBottom: 12 }}>Get personalized tips generated from your live task data.</p>
        <button className="primary-btn" onClick={getSuggestions} disabled={aiLoading}>
          {aiLoading ? <><Loader2 size={14} className="spin" /> Thinking...</> : <><Sparkles size={14} /> Generate suggestions</>}
        </button>
        {aiError && <p style={{ color: '#ff4d6d', fontSize: 13, marginTop: 10 }}>{aiError}</p>}
        {aiText && <div className="ai-suggestion-box">{aiText}</div>}
      </GlassCard>
    </div>
  );
}

/* ============================== SETTINGS ============================== */
function SettingsView({ settings, setSettings, tasks, notes, goals, push }) {
  const fileInputRef = useRef(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ tasks, notes, goals, settings }, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'nexusos-backup.json');
    push('Exported as JSON');
  };
  const exportCSV = () => {
    const header = 'Title,Priority,Category,Due Date,Status\n';
    const rows = tasks.map(t => `"${t.title.replace(/"/g, '""')}",${t.priority},${t.category},${t.dueDate},${t.status}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    downloadBlob(blob, 'nexusos-tasks.csv');
    push('Exported as CSV');
  };
  const exportXLSX = async () => {
    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(tasks.map(t => ({ Title: t.title, Priority: t.priority, Category: t.category, DueDate: t.dueDate, Status: t.status })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
      XLSX.writeFile(wb, 'nexusos-tasks.xlsx');
      push('Exported as Excel');
    } catch (e) { push('Excel export failed', 'warn'); }
  };
  const exportPDF = () => { window.print(); push('Opened print dialog for PDF'); };

  const restoreFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        push('Backup file loaded — data will refresh on next save cycle');
        window.__restoreData = data;
      } catch { push('Invalid backup file', 'warn'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fade-in">
      <div className="view-head"><h1>Settings</h1><p className="muted-sm">Personalize your workspace</p></div>

      <div className="settings-grid">
        <GlassCard className="pad-lg">
          <div className="section-label"><Palette size={13} style={{ marginRight: 4 }} />Appearance</div>
          <div className="field-label">Theme</div>
          <div className="theme-toggle-row">
            <button className={`theme-opt ${settings.theme === 'dark' ? 'theme-opt-active' : ''}`} onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))}><Moon size={14} /> Dark</button>
            <button className={`theme-opt ${settings.theme === 'light' ? 'theme-opt-active' : ''}`} onClick={() => setSettings(s => ({ ...s, theme: 'light' }))}><Sun size={14} /> Light</button>
          </div>
          <div className="field-label" style={{ marginTop: 14 }}>Accent color</div>
          <div className="accent-row">
            {ACCENTS.map(a => (
              <button key={a.name} className={`accent-swatch ${settings.accent.name === a.name ? 'accent-swatch-active' : ''}`} style={{ background: a.val }} title={a.name} onClick={() => setSettings(s => ({ ...s, accent: a }))} />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="pad-lg">
          <div className="section-label"><User size={13} style={{ marginRight: 4 }} />Profile</div>
          <label className="field-label">Name</label>
          <input className="text-input" value={settings.name} onChange={e => setSettings(s => ({ ...s, name: e.target.value }))} />
          <label className="field-label">Role</label>
          <input className="text-input" value={settings.role} onChange={e => setSettings(s => ({ ...s, role: e.target.value }))} />
        </GlassCard>

        <GlassCard className="pad-lg">
          <div className="section-label"><Database size={13} style={{ marginRight: 4 }} />Backup and restore</div>
          <p className="muted-sm" style={{ marginBottom: 12 }}>Your data auto-saves in the background. You can also export a manual backup.</p>
          <div className="export-btn-row">
            <button className="ghost-btn" onClick={exportJSON}><FileJson size={13} /> JSON</button>
            <button className="ghost-btn" onClick={exportCSV}><FileText size={13} /> CSV</button>
            <button className="ghost-btn" onClick={exportXLSX}><FileSpreadsheet size={13} /> Excel</button>
            <button className="ghost-btn" onClick={exportPDF}><Download size={13} /> PDF</button>
          </div>
          <input type="file" accept="application/json" ref={fileInputRef} style={{ display: 'none' }} onChange={restoreFile} />
          <button className="ghost-btn full-w" style={{ marginTop: 10 }} onClick={() => fileInputRef.current.click()}><Upload size={13} /> Restore from JSON backup</button>
        </GlassCard>

        <GlassCard className="pad-lg">
          <div className="section-label">Keyboard shortcuts</div>
          <div className="shortcut-row"><span>Focus search</span><kbd>/</kbd></div>
          <div className="shortcut-row"><span>Close panels</span><kbd>Esc</kbd></div>
        </GlassCard>
      </div>
    </div>
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================== STYLES ============================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

.app-root {
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  overflow: hidden;
  font-family: var(--font-body);
  isolation: isolate;
}
.app-root.theme-dark {
  --bg-0: #05070f;
  --bg-1: #0a0f1e;
  --glass-bg: rgba(255,255,255,0.045);
  --glass-border: rgba(0,229,255,0.14);
  --text-1: #e9f3ff;
  --text-2: #b7c6dd;
  --text-3: #7c8aa3;
}
.app-root.theme-light {
  --bg-0: #eef2f9;
  --bg-1: #e4eaf5;
  --glass-bg: rgba(255,255,255,0.55);
  --glass-border: rgba(59,130,246,0.18);
  --text-1: #0d1626;
  --text-2: #3c4a63;
  --text-3: #6b7994;
}
.app-root { background: radial-gradient(ellipse 120% 80% at 20% -10%, rgba(var(--accent-rgb),0.10), transparent 60%), var(--bg-0); color: var(--text-1); }

.particle-canvas { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; opacity: 0.55; }
.mouse-glow { position: fixed; inset: 0; pointer-events: none; z-index: 1; transition: background 0.05s linear; }

/* ---- Sidebar ---- */
.sidebar {
  width: 240px; flex-shrink: 0; z-index: 20; position: relative;
  background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid var(--glass-border);
  display: flex; flex-direction: column; padding: 20px 14px;
  height: 100vh; position: sticky; top: 0;
}
.sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 6px 22px; }
.brand-orb { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(var(--accent-rgb),0.3), rgba(var(--accent-rgb),0.05)); border: 1px solid rgba(var(--accent-rgb),0.4); color: var(--accent); box-shadow: 0 0 16px rgba(var(--accent-rgb),0.4); }
.brand-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: var(--text-1); }
.brand-sub { font-size: 10px; color: var(--text-3); letter-spacing: 0.5px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; overflow-y: auto; }
.nav-item {
  display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 12px;
  background: transparent; border: none; color: var(--text-2); font-size: 13.5px; font-weight: 500;
  cursor: pointer; text-align: left; position: relative; transition: all 0.18s ease; font-family: var(--font-body);
}
.nav-item:hover { background: rgba(var(--accent-rgb),0.08); color: var(--text-1); }
.nav-item-active { background: rgba(var(--accent-rgb),0.14); color: var(--accent); box-shadow: inset 0 0 0 1px rgba(var(--accent-rgb),0.25); }
.nav-indicator { position: absolute; right: 10px; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
.sidebar-footer { border-top: 1px solid var(--glass-border); padding-top: 14px; margin-top: 8px; }
.profile-mini { display: flex; align-items: center; gap: 10px; }
.avatar-ring { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(var(--accent-rgb),0.15); border: 1px solid rgba(var(--accent-rgb),0.4); color: var(--accent); flex-shrink: 0; }
.profile-name { font-size: 12.5px; font-weight: 600; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.profile-role { font-size: 10.5px; color: var(--text-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sidebar-scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 19; }

/* ---- Main / Topbar ---- */
.main-col { flex: 1; min-width: 0; position: relative; z-index: 2; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.topbar { display: flex; align-items: center; gap: 14px; padding: 14px 26px; border-bottom: 1px solid var(--glass-border); background: rgba(0,0,0,0.08); backdrop-filter: blur(12px); flex-shrink: 0; }
.search-wrap { flex: 1; max-width: 420px; display: flex; align-items: center; gap: 8px; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 8px 12px; }
.search-wrap.sm { max-width: 260px; padding: 7px 10px; }
.search-input { background: transparent; border: none; outline: none; color: var(--text-1); font-size: 13px; flex: 1; font-family: var(--font-body); }
.search-input::placeholder { color: var(--text-3); }
.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.clock-chip { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 12.5px; color: var(--text-2); background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 7px 12px; border-radius: 10px; }
.only-mobile { display: none; }

.view-area { flex: 1; overflow-y: auto; padding: 24px 26px 60px; }
.view-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.view-head h1 { font-family: var(--font-display); font-size: 22px; font-weight: 700; margin: 0 0 4px; letter-spacing: 0.3px; }
.wave { display: inline-block; margin-left: 8px; animation: wave 2s ease infinite; }
@keyframes wave { 0%,100%{transform:rotate(0)} 20%{transform:rotate(18deg)} 40%{transform:rotate(-10deg)} 60%{transform:rotate(14deg)} }
.muted-sm { font-size: 12.5px; color: var(--text-3); margin: 0; }

/* ---- Glass card ---- */
.glass-card {
  background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 18px;
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04);
  position: relative; overflow: hidden;
}
.glass-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),0.6), transparent);
  opacity: 0.7;
}
.glass-hover { transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease; }
.glass-hover:hover { transform: translateY(-2px); border-color: rgba(var(--accent-rgb),0.35); box-shadow: 0 10px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(var(--accent-rgb),0.12); }
.pad-md { padding: 16px 18px; }
.pad-lg { padding: 20px 22px; }

/* ---- buttons/inputs ---- */
.icon-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; flex-shrink: 0; }
.icon-btn:hover { color: var(--accent); border-color: rgba(var(--accent-rgb),0.4); box-shadow: 0 0 14px rgba(var(--accent-rgb),0.2); }
.icon-btn-active { color: var(--accent); border-color: var(--accent); box-shadow: 0 0 14px rgba(var(--accent-rgb),0.35); }
.primary-btn { display: inline-flex; align-items: center; gap: 7px; background: linear-gradient(135deg, var(--accent), rgba(var(--accent-rgb),0.6)); color: #04121a; font-weight: 700; font-size: 13px; border: none; padding: 10px 16px; border-radius: 12px; cursor: pointer; box-shadow: 0 0 20px rgba(var(--accent-rgb),0.35); transition: transform 0.15s, box-shadow 0.15s; font-family: var(--font-body); }
.primary-btn:hover { transform: translateY(-1px); box-shadow: 0 0 28px rgba(var(--accent-rgb),0.5); }
.primary-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.primary-btn.small { padding: 8px 10px; }
.ghost-btn { display: inline-flex; align-items: center; gap: 6px; background: var(--glass-bg); color: var(--text-2); border: 1px solid var(--glass-border); font-size: 12.5px; font-weight: 600; padding: 9px 14px; border-radius: 11px; cursor: pointer; transition: all 0.18s; font-family: var(--font-body); }
.ghost-btn:hover { color: var(--accent); border-color: rgba(var(--accent-rgb),0.4); }
.ghost-btn.small { padding: 6px 10px; font-size: 11.5px; }
.full-w { width: 100%; justify-content: center; }
.text-input, .select-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--text-1); font-size: 13px; padding: 10px 12px; border-radius: 10px; outline: none; margin-bottom: 12px; font-family: var(--font-body); resize: vertical; }
.text-input:focus, .select-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(var(--accent-rgb),0.15); }
.select-input { cursor: pointer; }
.field-label { font-size: 11.5px; color: var(--text-3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
.field-row { display: flex; gap: 12px; }
.quick-add-row { display: flex; gap: 8px; align-items: center; }
.quick-add-row .text-input { margin-bottom: 0; }
.filter-row { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }

/* ---- stat cards ---- */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
.stat-card { }
.stat-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.stat-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(var(--accent-rgb),0.15); color: var(--accent); display: flex; align-items: center; justify-content: center; }
.stat-label { font-size: 11.5px; color: var(--text-3); font-weight: 600; }
.stat-value { font-family: var(--font-mono); font-size: 26px; font-weight: 700; color: var(--text-1); }
.stat-sub { font-size: 11px; color: var(--text-3); margin: 2px 0 10px; }
.mini-bar { height: 6px; border-radius: 6px; background: rgba(255,255,255,0.07); overflow: hidden; }
.mini-bar-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, var(--accent), rgba(var(--accent-rgb),0.5)); box-shadow: 0 0 10px rgba(var(--accent-rgb),0.5); transition: width 0.4s ease; }

.dash-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-2); margin-bottom: 14px; display: flex; align-items: center; }

.orb-wrap { display: flex; justify-content: center; margin: 6px 0 16px; }
.holo-ring { --pct: 0; width: 130px; height: 130px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: conic-gradient(var(--accent) calc(var(--pct) * 1%), rgba(255,255,255,0.06) 0); animation: spin 8s linear infinite; box-shadow: 0 0 30px rgba(var(--accent-rgb),0.35); }
@keyframes spin { to { transform: rotate(360deg); } }
.orb-inner { width: 100px; height: 100px; border-radius: 50%; background: var(--bg-0); display: flex; flex-direction: column; align-items: center; justify-content: center; animation: spin-rev 8s linear infinite; }
@keyframes spin-rev { to { transform: rotate(-360deg); } }
.orb-value { font-family: var(--font-mono); font-size: 26px; font-weight: 700; color: var(--accent); }
.orb-label { font-size: 10px; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; }
.quote-box { display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; color: var(--text-2); font-style: italic; line-height: 1.5; padding-top: 8px; border-top: 1px solid var(--glass-border); }

.mini-list { display: flex; flex-direction: column; gap: 10px; }
.mini-row { display: flex; align-items: flex-start; gap: 9px; }
.mini-title { font-size: 13px; font-weight: 600; color: var(--text-1); }
.mini-sub { font-size: 11px; color: var(--text-3); }

.badge-grid { display: flex; flex-direction: column; gap: 8px; }
.badge-chip { display: flex; align-items: center; gap: 8px; background: rgba(var(--accent-rgb),0.08); border: 1px solid rgba(var(--accent-rgb),0.25); border-radius: 10px; padding: 8px 12px; font-size: 12px; font-weight: 600; color: var(--text-1); }

.pdot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; box-shadow: 0 0 6px currentColor; }
.cat-tag { font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 20px; border: 1px solid; white-space: nowrap; }

/* ---- tasks ---- */
.progress-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
.task-list { display: flex; flex-direction: column; gap: 10px; }
.task-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; cursor: grab; }
.task-row.task-done { opacity: 0.55; }
.drag-handle { color: var(--text-3); margin-top: 4px; cursor: grab; flex-shrink: 0; }
.check-circle { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--glass-border); background: transparent; display: flex; align-items: center; justify-content: center; color: #04121a; cursor: pointer; flex-shrink: 0; margin-top: 2px; transition: all 0.18s; }
.check-circle.small { width: 17px; height: 17px; }
.check-circle-done { background: var(--accent); border-color: var(--accent); box-shadow: 0 0 10px rgba(var(--accent-rgb),0.5); }
.task-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.task-title { font-size: 13.5px; font-weight: 600; color: var(--text-1); }
.task-done .task-title { text-decoration: line-through; }
.task-desc { font-size: 12px; color: var(--text-3); margin-top: 3px; }
.task-meta { font-size: 11px; color: var(--text-3); display: flex; align-items: center; gap: 4px; margin-top: 6px; }
.task-actions { display: flex; gap: 6px; flex-shrink: 0; }

/* ---- modal ---- */
.modal-scrim { position: fixed; inset: 0; background: rgba(2,4,10,0.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { width: 100%; max-width: 460px; padding: 22px 24px; max-height: 88vh; overflow-y: auto; }
.modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.modal-head h3 { font-family: var(--font-display); font-size: 16px; margin: 0; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; }

/* ---- charts ---- */
.chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.legend-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; justify-content: center; }
.legend-chip { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--text-2); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; }

/* ---- notes ---- */
.notes-layout { display: grid; grid-template-columns: 240px 1fr; gap: 16px; height: calc(100vh - 160px); }
.notes-sidebar { display: flex; flex-direction: column; gap: 12px; }
.notes-list { display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
.notes-list-item { display: flex; align-items: center; gap: 7px; padding: 9px 11px; border-radius: 10px; font-size: 12.5px; color: var(--text-2); cursor: pointer; }
.notes-list-item:hover { background: rgba(var(--accent-rgb),0.06); }
.notes-list-item-active { background: rgba(var(--accent-rgb),0.14); color: var(--accent); }
.notes-editor { display: flex; flex-direction: column; overflow-y: auto; }
.editor-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; }
.note-title-input { background: transparent; border: none; outline: none; font-size: 17px; font-weight: 700; color: var(--text-1); flex: 1; font-family: var(--font-display); }
.note-textarea { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-1); font-size: 13.5px; padding: 12px; outline: none; margin-bottom: 14px; font-family: var(--font-body); line-height: 1.6; }
.note-code { font-family: var(--font-mono); background: rgba(0,229,255,0.04); }
.checklist-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.checklist-row { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; }
.checklist-input { flex: 1; background: transparent; border: none; outline: none; color: var(--text-1); font-size: 13px; border-bottom: 1px solid transparent; }
.checklist-input:focus { border-bottom-color: var(--accent); }
.autosave-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-3); margin-top: 14px; }
.notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.note-card { }
.note-head { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; }
.note-title { font-size: 13px; font-weight: 600; flex: 1; }
.note-preview { font-size: 12px; color: var(--text-3); line-height: 1.5; margin: 0; }

/* ---- calendar ---- */
.calendar-grid-layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
.cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.cal-month { font-family: var(--font-display); font-size: 14px; font-weight: 700; }
.cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 11px; color: var(--text-3); margin-bottom: 6px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
.cal-cell { aspect-ratio: 1; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12.5px; color: var(--text-2); cursor: pointer; border: 1px solid transparent; gap: 3px; }
.cal-cell:hover { background: rgba(var(--accent-rgb),0.08); }
.cal-cell-empty { cursor: default; }
.cal-cell-today { border-color: var(--accent); color: var(--accent); font-weight: 700; }
.cal-cell-selected { background: rgba(var(--accent-rgb),0.16); }
.cal-dots { display: flex; gap: 2px; }
.cal-dot { width: 4px; height: 4px; border-radius: 50%; }
.cal-side { display: flex; flex-direction: column; gap: 16px; }

/* ---- goals ---- */
.goals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
.goal-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.goal-title { font-size: 14px; font-weight: 700; color: var(--text-1); }
.goal-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-3); }

/* ---- insights ---- */
.insight-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.insight-text { font-size: 13px; line-height: 1.7; color: var(--text-2); margin: 0; }
.insight-text b { color: var(--accent); }
.ai-suggestion-box { margin-top: 14px; background: rgba(var(--accent-rgb),0.06); border: 1px solid rgba(var(--accent-rgb),0.25); border-radius: 12px; padding: 14px 16px; font-size: 13px; line-height: 1.7; color: var(--text-1); white-space: pre-wrap; }

/* ---- settings ---- */
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.theme-toggle-row { display: flex; gap: 8px; }
.theme-opt { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 10px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-2); cursor: pointer; font-size: 12.5px; font-weight: 600; }
.theme-opt-active { border-color: var(--accent); color: var(--accent); box-shadow: 0 0 12px rgba(var(--accent-rgb),0.25); }
.accent-row { display: flex; gap: 10px; }
.accent-swatch { width: 30px; height: 30px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; }
.accent-swatch-active { border-color: #fff; box-shadow: 0 0 0 3px rgba(255,255,255,0.12); }
.export-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
.shortcut-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--glass-border); font-size: 12.5px; color: var(--text-2); }
kbd { background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); border-radius: 6px; padding: 2px 7px; font-family: var(--font-mono); font-size: 11px; }

/* ---- notifications ---- */
.notif-badge { position: absolute; top: -4px; right: -4px; background: #ff4d6d; color: #fff; font-size: 9px; font-weight: 700; width: 15px; height: 15px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px rgba(255,77,109,0.6); }
.notif-panel { position: absolute; right: 0; top: 44px; width: 300px; max-height: 340px; overflow-y: auto; z-index: 50; }
.notif-head { padding: 12px 14px; font-size: 12px; font-weight: 700; border-bottom: 1px solid var(--glass-border); }
.notif-row { display: flex; gap: 8px; padding: 11px 14px; font-size: 12.5px; color: var(--text-2); border-bottom: 1px solid var(--glass-border); }
.notif-row:last-child { border-bottom: none; }

/* ---- search results ---- */
.search-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; font-size: 13px; color: var(--text-2); border-bottom: 1px solid var(--glass-border); }
.search-row:last-child { border-bottom: none; }

/* ---- toasts ---- */
.toast-stack { position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 8px; z-index: 200; }
.toast { display: flex; align-items: center; gap: 7px; background: rgba(10,14,26,0.95); border: 1px solid rgba(var(--accent-rgb),0.3); color: var(--text-1); padding: 10px 16px; border-radius: 10px; font-size: 12.5px; font-weight: 600; box-shadow: 0 6px 20px rgba(0,0,0,0.4); animation: toast-in 0.25s ease; }
.toast-warn { border-color: rgba(255,77,109,0.4); }
@keyframes toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.empty-state { text-align: center; padding: 32px 10px; }
.fade-in { animation: fade-in 0.3s ease; }
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.spin { animation: spin-simple 1s linear infinite; }
@keyframes spin-simple { to { transform: rotate(360deg); } }

.view-area::-webkit-scrollbar, .notes-list::-webkit-scrollbar, .notif-panel::-webkit-scrollbar, .notes-editor::-webkit-scrollbar { width: 6px; }
.view-area::-webkit-scrollbar-thumb, .notes-list::-webkit-scrollbar-thumb { background: rgba(var(--accent-rgb),0.3); border-radius: 6px; }

/* ---- responsive ---- */
@media (max-width: 1100px) {
  .dash-grid { grid-template-columns: 1fr 1fr; }
  .chart-grid { grid-template-columns: 1fr; }
  .settings-grid { grid-template-columns: 1fr; }
  .insight-grid { grid-template-columns: 1fr; }
  .calendar-grid-layout { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .dash-grid { grid-template-columns: 1fr; }
  .notes-layout { grid-template-columns: 1fr; height: auto; }
  .sidebar { position: fixed; left: -260px; top: 0; z-index: 30; transition: left 0.25s ease; box-shadow: 0 0 40px rgba(0,0,0,0.6); }
  .sidebar-open { left: 0; }
  .only-mobile { display: flex; }
}
@media (max-width: 560px) {
  .stat-grid { grid-template-columns: 1fr; }
  .view-area { padding: 18px 14px 50px; }
  .topbar { padding: 12px 14px; }
  .search-wrap { max-width: none; }
  .clock-chip span { display: none; }
  .field-row { flex-direction: column; }
}
`;
