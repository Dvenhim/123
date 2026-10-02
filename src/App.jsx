import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Send,
  Plus,
  Layers,
  CheckCircle2,
  Clock,
  Briefcase,
  Cpu,
  Database,
  Layout,
  Mail,
  Terminal,
  ArrowUpRight,
  X,
  Trash2,
  Check,
  Globe
} from 'lucide-react';
import './App.css';

// SVG Icon for GitHub
function Github({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// Helper for resolving asset paths correctly on GitHub Pages subpaths
function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

// Initial projects data — empty, real projects coming soon
const INITIAL_PROJECTS = [];

const ROADMAP_PROJECTS = [
  {
    title: 'REST API для блогу',
    description: 'Мій перший серйозний бекенд-проєкт — REST API з авторизацією, CRUD для постів, коментарів та JWT-токенами. Вивчаю Node.js та Express на практиці.',
    status: 'В розробці',
    tech: 'Node.js, Express.js, PostgreSQL, JWT',
    eta: 'Кінець 2026'
  },
  {
    title: 'Telegram-бот для навчання',
    description: 'Бот, який допомагає учням отримувати розклад, нагадування та корисні посилання для навчання. Практика роботи з API та базами даних.',
    status: 'Проектування',
    tech: 'Python, python-telegram-bot, SQLite',
    eta: 'Початок 2027'
  },
  {
    title: 'Система управління завданнями (API)',
    description: 'Бекенд-сервіс для трекінгу задач із ролями користувачів, фільтрацією та базою даних. Мета — навчитися будувати надійну архітектуру.',
    status: 'В планах',
    tech: 'Node.js / Python, PostgreSQL, REST API',
    eta: '2027'
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('Всі');
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('volodymyr_portfolio_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New project form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Web Apps');
  const [newTags, setNewTags] = useState('');
  const [newDemo, setNewDemo] = useState('');
  const [newGithub, setNewGithub] = useState('');
  const [newStatus, setNewStatus] = useState('У розробці');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Save projects to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem('volodymyr_portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#06b6d4', '#10b981', '#ec4899']
    });
  };

  // Add project handler
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      showToast('Будь ласка, заповніть назву та опис проєкту');
      return;
    }

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newProjectObj = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      tags: tagsArray.length > 0 ? tagsArray : ['React', 'TypeScript'],
      image: '/project1.jpg',
      demoUrl: newDemo.trim() || '#',
      githubUrl: newGithub.trim() || 'https://github.com/',
      status: newStatus,
      isCustom: true
    };

    setProjects(prev => [newProjectObj, ...prev]);
    setIsModalOpen(false);

    // Reset inputs
    setNewTitle('');
    setNewDesc('');
    setNewTags('');
    setNewDemo('');
    setNewGithub('');

    triggerConfetti();
    showToast(`Проєкт "${newProjectObj.title}" успішно додано до вашого портфоліо!`);
  };

  const handleDeleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('Проєкт видалено з портфоліо');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showToast('Будь ласка, заповніть усі поля форми');
      return;
    }

    setIsSubmitted(true);
    triggerConfetti();
    showToast('Дякую за повідомлення! Я зв\'яжуся з вами найближчим часом.');
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'Всі') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <div className="portfolio-app" id="portfolio-root">
      {/* Navigation Header */}
      <header className="portfolio-header">
        <a href="#hero" className="brand-logo">
          <div className="brand-dot"></div>
          <span>Volodymyr<span className="gradient-text">.dev</span></span>
        </a>

        <nav>
          <ul className="nav-links">
            <li><a href="#about" className="nav-link">Про мене</a></li>
            <li><a href="#skills" className="nav-link">Стек & Навички</a></li>
            <li><a href="#projects" className="nav-link">Мої Проєкти</a></li>
            <li><a href="#roadmap" className="nav-link">Майбутні ідеї</a></li>
            <li><a href="#contact" className="nav-link">Контакти</a></li>
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            id="add-project-nav-btn"
            className="btn btn-secondary"
            onClick={() => setIsModalOpen(true)}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Plus size={16} /> Додати проєкт
          </button>
          <a href="#contact" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.15rem', textDecoration: 'none' }}>
            <Mail size={16} /> Написати мені
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main>
        {/* HERO SECTION */}
        <section className="container hero-section" id="hero">
          <div className="hero-left">
            <div className="status-badge">
              <span className="brand-dot"></span>
              Учень 10-А класу · Майбутній Back-End розробник
            </div>

            <h1 className="hero-name-title">
              Привіт, я <span className="gradient-text">Володимир</span>.<br />
              Вчуся будувати надійний бекенд.
            </h1>

            <p className="hero-bio">
              Учень 10-А класу, який серйозно захопився програмуванням і крок за кроком іде до мети — стати
              Back-End розробником. Вивчаю Node.js, бази даних та архітектуру API. Портфоліо в процесі наповнення — реальні проєкти скоро з'являться!
            </p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <Briefcase size={18} /> Переглянути мої проєкти
              </a>
              <button
                id="add-project-hero-btn"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={18} /> Додати новий проєкт
              </button>
              <a href="#contact" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
                Зв'язатися зі мною <ArrowUpRight size={18} />
              </a>
            </div>

            <div className="hero-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn" title="GitHub">
                <Github size={18} />
              </a>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="social-btn" title="Telegram">
                <Send size={18} />
              </a>
              <a href="mailto:volodymyr@example.com" className="social-btn" title="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="hero-right">
            <div className="avatar-wrapper">
              <img
                src={getAssetUrl('/avatar.jpg')}
                alt="Володимир - Back-End розробник"
                className="avatar-img"
              />
              <div className="floating-pill pill-top">
                <Sparkles size={16} color="#6366f1" />
                <span>Back-End розробник</span>
              </div>
              <div className="floating-pill pill-bottom">
                <CheckCircle2 size={16} color="#10b981" />
                <span>Навчаюсь · Розвиваюсь</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT ME SECTION */}
        <section className="section-wrapper" id="about" style={{ background: 'rgba(14, 19, 31, 0.4)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Про мене</span>
              <h2 className="section-title-large">
                Хто я та чому програмування
              </h2>
              <p className="section-desc">
                Не просто захоплення — це мета. Я щодня навчаюся, пишу код і будую фундамент для майбутньої кар'єри.
              </p>
            </div>

            <div className="about-grid">
              <div className="glass-panel about-card">
                <h3><Cpu size={22} color="#6366f1" /> Мій шлях</h3>
                <p>
                  Мене звати Володимир, я учень <strong>10-А класу</strong>. Програмуванням захопився серйозно і поставив собі чітку ціль —
                  стати <strong>Back-End розробником</strong>.
                </p>
                <p>
                  Зараз активно вивчаю <strong>Node.js</strong>, <strong>бази даних (PostgreSQL)</strong>, REST API та принципи
                  проєктування архітектури. Хочу будувати надійні сервери та API, які справді тримаються під навантаженням.
                </p>

                <div className="stats-row">
                  <div className="stat-item">
                    <div className="stat-num gradient-text">10-А</div>
                    <div className="stat-sub">Мій клас</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num gradient-text-cyan">Back-End</div>
                    <div className="stat-sub">Мій фокус</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num" style={{ color: '#10b981' }}>∞</div>
                    <div className="stat-sub">Бажання вчитись</div>
                  </div>
                </div>
              </div>

              <div className="glass-panel about-card">
                <h3><Layers size={22} color="#06b6d4" /> Що я вже знаю та до чого прагну</h3>
                <p>
                  <strong>Вже вивчив:</strong> основи JavaScript, HTML/CSS, розуміння того, як працює інтернет (HTTP, DNS, клієнт-сервер). Цей сайт — одна з моїх перших робіт!
                </p>
                <p>
                  <strong>Зараз вивчаю:</strong> Node.js, Express.js, основи роботи з PostgreSQL, базові концепції REST API та автентифікація (JWT).
                </p>
                <p>
                  <strong>Моя ціль:</strong> Отримати першу роботу/стажування як Junior Back-End розробник після закінчення школи і продовжувати розвиватись у цій сфері.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="section-wrapper" id="skills">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Технологічний стек</span>
              <h2 className="section-title-large">Інструменти, якими я володію</h2>
              <p className="section-desc">
                Актуальний набір технологій, які я використовую для створення сучасних веб-додатків від задуму до продакшену.
              </p>
            </div>

            <div className="skills-grid">
              {/* Frontend Card */}
              <div className="glass-panel skill-category-card">
                <div className="skill-category-header">
                  <Layout size={22} color="#6366f1" />
                  <span>Frontend</span>
                </div>
                <div className="skill-pill-container">
                  <span className="skill-pill">React 19</span>
                  <span className="skill-pill">TypeScript</span>
                  <span className="skill-pill">JavaScript (ESNext)</span>
                  <span className="skill-pill">Next.js</span>
                  <span className="skill-pill">Vite</span>
                  <span className="skill-pill">HTML5 & Semantic UI</span>
                  <span className="skill-pill">Modern CSS / Design Tokens</span>
                  <span className="skill-pill">Tailwind CSS</span>
                  <span className="skill-pill">State Management</span>
                </div>
              </div>

              {/* Backend Card */}
              <div className="glass-panel skill-category-card">
                <div className="skill-category-header">
                  <Terminal size={22} color="#06b6d4" />
                  <span>Backend & APIs</span>
                </div>
                <div className="skill-pill-container">
                  <span className="skill-pill">Node.js</span>
                  <span className="skill-pill">Express.js</span>
                  <span className="skill-pill">RESTful API Design</span>
                  <span className="skill-pill">Python (FastAPI)</span>
                  <span className="skill-pill">Authentication & JWT</span>
                  <span className="skill-pill">Server-Side Validation (Zod)</span>
                  <span className="skill-pill">Microservices Architecture</span>
                </div>
              </div>

              {/* Databases & Cloud */}
              <div className="glass-panel skill-category-card">
                <div className="skill-category-header">
                  <Database size={22} color="#10b981" />
                  <span>Databases & DevOps</span>
                </div>
                <div className="skill-pill-container">
                  <span className="skill-pill">PostgreSQL</span>
                  <span className="skill-pill">Prisma ORM</span>
                  <span className="skill-pill">Supabase</span>
                  <span className="skill-pill">MongoDB</span>
                  <span className="skill-pill">Git & GitHub</span>
                  <span className="skill-pill">Docker Containers</span>
                  <span className="skill-pill">CI/CD Pipelines</span>
                  <span className="skill-pill">Vercel / Cloud Deploy</span>
                </div>
              </div>

              {/* Best Practices */}
              <div className="glass-panel skill-category-card">
                <div className="skill-category-header">
                  <Sparkles size={22} color="#ec4899" />
                  <span>Практики & Якість</span>
                </div>
                <div className="skill-pill-container">
                  <span className="skill-pill">Clean Architecture</span>
                  <span className="skill-pill">SOLID & DRY</span>
                  <span className="skill-pill">Unit & E2E Testing</span>
                  <span className="skill-pill">Performance Audit</span>
                  <span className="skill-pill">AI-Augmented Coding</span>
                  <span className="skill-pill">GEMINI.md Rule Systems</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="section-wrapper" id="projects" style={{ background: 'rgba(10, 14, 23, 0.5)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Портфоліо</span>
              <h2 className="section-title-large">Мої проєкти</h2>
              <p className="section-desc">
                Я тільки на початку шляху, тому реальні проєкти ще в розробці. Незабаром тут з'являться мої перші справжні роботи!
              </p>
            </div>

            {/* Filter and Add Button Controls */}
            <div className="projects-controls">
              <div className="project-tabs">
                {['Всі', 'Full-Stack', 'Web Apps', 'AI & Інструменти'].map(cat => (
                  <button
                    key={cat}
                    className={`project-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                id="add-project-tab-btn"
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} /> Додати свій проєкт
              </button>
            </div>

            {/* Projects Grid */}
            <div className="projects-grid">
              {filteredProjects.length === 0 ? (
                <div style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.25rem',
                  padding: '4rem 2rem',
                  borderRadius: '1.25rem',
                  border: '2px dashed rgba(99,102,241,0.3)',
                  background: 'rgba(99,102,241,0.04)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'rgba(99,102,241,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Clock size={32} color="#6366f1" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      Проєкти скоро з'являться! 🚀
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 480, lineHeight: 1.7 }}>
                      Я активно навчаюся та пишу свої перші реальні проєкти. Зовсім скоро тут будуть мої роботи з Node.js, API та баз даних.
                      Слідкуй за оновленнями!
                    </div>
                  </div>
                  <a
                    href="https://github.com/Dvenhim"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ textDecoration: 'none', marginTop: '0.5rem' }}
                  >
                    <Github size={16} /> Слідкуй на GitHub
                  </a>
                </div>
              ) : (
                filteredProjects.map(project => (
                  <article key={project.id} className="project-card">
                    <div className="project-thumb-container">
                      <img
                        src={getAssetUrl(project.image)}
                        alt={project.title}
                        className="project-thumb"
                      />
                      <div className="project-badge-overlay">
                        <span className="badge badge-primary">{project.category}</span>
                        <span className={`badge ${project.status === 'Завершено' ? 'badge-emerald' : 'badge-amber'}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="project-content">
                      <div>
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description">{project.description}</p>

                        <div className="project-tags">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="project-tag">{tag}</span>
                          ))}
                        </div>
                      </div>

                      <div className="project-actions">
                        {project.demoUrl && project.demoUrl !== '#' ? (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                          >
                            <Globe size={15} /> Демо
                          </a>
                        ) : (
                          <button
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            onClick={() => showToast(`Демо проєкту "${project.title}" готується до публікації!`)}
                          >
                            <Globe size={15} /> Демо
                          </button>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 0.85rem', textDecoration: 'none' }}
                            title="Переглянути код"
                          >
                            <Github size={16} />
                          </a>
                        )}

                        {project.isCustom && (
                          <button
                            className="btn btn-ghost"
                            style={{ color: '#f43f5e', padding: '0.5rem 0.75rem' }}
                            onClick={() => handleDeleteProject(project.id)}
                            title="Видалити доданий проєкт"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* FUTURE PROJECTS / ROADMAP SECTION */}
        <section className="section-wrapper" id="roadmap">
          <div className="container">
            <div className="section-header">
              <span className="section-tag" style={{ color: '#f59e0b' }}>Що далі</span>
              <h2 className="section-title-large">Проєкти, які я планую зробити</h2>
              <p className="section-desc">
                Конкретні ідеї, над якими я буду працювати, поки навчаюся. Реальні задачі — найкращий спосіб зрости як розробник.
              </p>
            </div>

            <div className="roadmap-grid">
              {ROADMAP_PROJECTS.map((item, idx) => (
                <div key={idx} className="roadmap-card">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge badge-amber">
                        <Clock size={12} /> {item.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {item.eta}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      Стек: {item.tech}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add idea card */}
              <div
                className="roadmap-card"
                style={{ cursor: 'pointer', borderStyle: 'dashed', borderColor: 'rgba(99, 102, 241, 0.4)', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                onClick={() => {
                  setNewStatus('В планах');
                  setIsModalOpen(true);
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    <Plus size={24} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    Запланувати новий проєкт
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Натисніть, щоб додати майбутній задум у ваш список
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="section-wrapper" id="contact" style={{ background: 'rgba(14, 19, 31, 0.5)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-tag" style={{ color: '#10b981' }}>Зв'язок</span>
              <h2 className="section-title-large">Напишіть мені — завжди радий!</h2>
              <p className="section-desc">
                Відкритий до спілкування, питань про навчання, порад від досвідчених розробників або просто — якщо хочете познайомитись!
              </p>
            </div>

            <div className="contact-grid">
              <div className="contact-info">
                <a href="https://t.me" target="_blank" rel="noreferrer" className="contact-channel">
                  <div className="channel-icon">
                    <Send size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Telegram @dvenhim</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Швидка відповідь онлайн</div>
                  </div>
                </a>

                <a href="mailto:volodymyr@example.com" className="contact-channel">
                  <div className="channel-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Електронна пошта</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>[vladimir.tatarenko.1999@gmail.com]</div>
                  </div>
                </a>

                <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-channel">
                  <div className="channel-icon">
                    <Github size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>GitHub профіль https://github.com/Dvenhim</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Відкритий вихідний код</div>
                  </div>
                </a>
              </div>

              {/* Form */}
              <form className="glass-panel contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ваше ім'я</label>
                  <input
                    id="contact-name-input"
                    type="text"
                    className="input-text"
                    placeholder="Наприклад: Олексій"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ваш Email або Telegram</label>
                  <input
                    id="contact-email-input"
                    type="text"
                    className="input-text"
                    placeholder="email@domain.com або @username"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Повідомлення або деталі проєкту</label>
                  <textarea
                    id="contact-message-input"
                    className="input-text"
                    rows={4}
                    placeholder="Опишіть ваше завдання або питання..."
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {isSubmitted ? (
                    <>
                      <Check size={18} /> Повідомлення надіслано!
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Надіслати повідомлення
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="portfolio-footer">
        <div className="container footer-content">
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              Volodymyr<span className="gradient-text">.dev</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Створено з акцентом на чисту архітектуру та високу якість. © 2026. Всі права захищено.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <a href="#hero" className="btn-ghost" style={{ textDecoration: 'none' }}>Вгору ↑</a>
            <a href="#projects" className="btn-ghost" style={{ textDecoration: 'none' }}>Проєкти</a>
            <a href="#contact" className="btn-ghost" style={{ textDecoration: 'none' }}>Контакти</a>
          </div>
        </div>
      </footer>

      {/* MODAL: ADD / PLAN NEW PROJECT */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Plus size={20} color="#6366f1" /> Додати новий або майбутній проєкт
              </h3>
              <button
                className="btn btn-ghost"
                style={{ padding: '0.4rem' }}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Назва проєкту</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Наприклад: Cloud AI Task Assistant"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Опис проєкту</label>
                <textarea
                  className="input-text"
                  rows={3}
                  placeholder="Коротко опишіть мету, функціонал та ключові особливості..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Категорія</label>
                  <select
                    className="input-select"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  >
                    <option value="Web Apps">Web Apps</option>
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="AI & Інструменти">AI & Інструменти</option>
                    <option value="Mobile / Other">Mobile / Other</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Статус</label>
                  <select
                    className="input-select"
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                  >
                    <option value="Завершено">Завершено</option>
                    <option value="У розробці">У розробці</option>
                    <option value="В планах">В планах</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Стек технологій (через кому)</label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Наприклад: React 19, TypeScript, PostgreSQL, Prisma"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Посилання на Демо (опціонально)</label>
                  <input
                    type="url"
                    className="input-text"
                    placeholder="https://my-demo.com"
                    value={newDemo}
                    onChange={e => setNewDemo(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">GitHub репозиторій (опціонально)</label>
                  <input
                    type="url"
                    className="input-text"
                    placeholder="https://github.com/..."
                    value={newGithub}
                    onChange={e => setNewGithub(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <Plus size={16} /> Додати до портфоліо
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast" id="portfolio-toast">
          <Sparkles size={18} color="#6366f1" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
