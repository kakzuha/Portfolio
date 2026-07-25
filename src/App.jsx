import { useEffect, useRef, useState } from 'react'
import './App.css'

const PROJECTS = [
  { emoji: '🚀', title: 'Project Alpha',  desc: 'Full-stack app for real-time data visualization with interactive dashboards and live analytics.', tags: ['React', 'Node.js', 'WebSocket'], color: 'var(--accent)' },
  { emoji: '🤖', title: 'AI Assistant',   desc: 'Intelligent chatbot powered by NLP that helps users manage daily tasks efficiently.', tags: ['Python', 'NLP', 'FastAPI'], color: '#06b6d4' },
  { emoji: '📊', title: 'Data Pipeline',  desc: 'Automated ETL pipeline that processes large datasets for downstream ML workloads.', tags: ['Python', 'Pandas', 'SQL'], color: '#10b981' },
  { emoji: '🎨', title: 'Design System',  desc: 'Comprehensive component library built for consistency across multiple products.', tags: ['React', 'CSS', 'Storybook'], color: '#f59e0b' },
  { emoji: '🔐', title: 'Auth Service',   desc: 'Secure microservice supporting OAuth 2.0, JWT, and multi-factor authentication flows.', tags: ['Node.js', 'JWT', 'OAuth'], color: '#ef4444' },
  { emoji: '🌐', title: 'Portfolio Site', desc: 'This very portfolio — built with React and Vite for performance and visual impact.', tags: ['React', 'Vite', 'CSS'], color: 'var(--accent)' },
]

// ─── Carousel constants ───────────────────────────────────────────────
const CARD_W     = 300
const CARD_GAP   = 28
const STEP       = CARD_W + CARD_GAP
const N          = PROJECTS.length
const TOTAL_W    = N * STEP        // width of one full set
const AUTO_SPEED = 0.6             // px per rAF frame
const RESUME_DELAY = 2000          // ms before auto-scroll resumes

function ProjectsCarousel() {
  const viewportRef = useRef(null)
  const trackRef    = useRef(null)
  const animRef     = useRef(null)
  const posRef      = useRef(TOTAL_W)   // start at second copy
  const autoRef     = useRef(true)      // auto-scroll active?
  const resumeTimer = useRef(null)
  const dragRef     = useRef({ active: false, startX: 0, startPos: 0 })
  const [dotIdx, setDotIdx] = useState(0)  // only used for dot indicators

  // triplicate for seamless wrap
  const items = [...PROJECTS, ...PROJECTS, ...PROJECTS]

  // ── Apply position & update dot indicator ────────────────────────────
  const applyPos = (pos) => {
    let p = pos
    if (p >= TOTAL_W * 2) p -= TOTAL_W
    if (p <  TOTAL_W)     p += TOTAL_W
    posRef.current = p
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${p}px)`
    }
    // Cheap dot-index update (mod math, no expensive DOM reads)
    const idx = ((Math.round((p - TOTAL_W) / STEP) % N) + N) % N
    setDotIdx(idx)
  }

  // ── Render loop ───────────────────────────────────────────────────────
  useEffect(() => {
    applyPos(posRef.current)
    const tick = () => {
      if (autoRef.current) applyPos(posRef.current + AUTO_SPEED)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  // ── Non-passive wheel (so preventDefault works) ───────────────────────
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      pauseAuto()
      applyPos(posRef.current + e.deltaX + e.deltaY)
      scheduleResume()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // ── Pause / resume helpers ────────────────────────────────────────────
  const pauseAuto    = () => { autoRef.current = false; clearTimeout(resumeTimer.current) }
  const scheduleResume = () => {
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => { autoRef.current = true }, RESUME_DELAY)
  }

  // ── Prev / Next ───────────────────────────────────────────────────────
  const goPrev = () => { pauseAuto(); applyPos(posRef.current - STEP); scheduleResume() }
  const goNext = () => { pauseAuto(); applyPos(posRef.current + STEP); scheduleResume() }

  // ── Mouse drag ────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    if (e.button !== 0) return
    pauseAuto()
    dragRef.current = { active: true, startX: e.clientX, startPos: posRef.current }
    if (viewportRef.current) viewportRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = (e) => {
    if (!dragRef.current.active) return
    applyPos(dragRef.current.startPos - (e.clientX - dragRef.current.startX))
  }
  const onMouseUp = () => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    if (viewportRef.current) viewportRef.current.style.cursor = 'grab'
    scheduleResume()
  }

  // ── Touch ─────────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    pauseAuto()
    dragRef.current = { active: true, startX: e.touches[0].clientX, startPos: posRef.current }
  }
  const onTouchMove = (e) => {
    if (!dragRef.current.active) return
    applyPos(dragRef.current.startPos - (e.touches[0].clientX - dragRef.current.startX))
  }
  const onTouchEnd = () => { dragRef.current.active = false; scheduleResume() }

  return (
    <section className="section projects-section" id="projects">
      {/* Heading */}
      <div className="projects-heading">
        <span className="section-tag">02 — Projects</span>
        <h2 className="projects-big-title">Things I've Built</h2>
        <p className="section-sub">A curated selection of projects I'm proud of</p>
      </div>

      {/* Carousel */}
      <div
        className="carousel-viewport"
        ref={viewportRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Edge fades */}
        <div className="carousel-fade carousel-fade-left"  />
        <div className="carousel-fade carousel-fade-right" />

        {/* Nav buttons */}
        <button className="carousel-btn carousel-btn-prev" onClick={goPrev} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="carousel-btn carousel-btn-next" onClick={goNext} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Scrolling track */}
        <div className="carousel-track" ref={trackRef}>
          {items.map((project, i) => (
            <div
              key={i}
              className="carousel-card"
              style={{ '--card-accent': project.color }}
            >
              <div className="carousel-card-glow" />
              <div className="project-emoji">{project.emoji}</div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.desc}</p>
              <div className="project-tags">
                {project.tags.map(t => (
                  <span key={t} className="project-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="carousel-dots">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === dotIdx ? ' carousel-dot--active' : ''}`}
              onClick={() => { pauseAuto(); applyPos(TOTAL_W + i * STEP); scheduleResume() }}
              aria-label={`Project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <>
      <section className="section hero-section" id="center">
        <div className="hero-content">
          <h1 className="title1">Portfolio</h1>
          <p className="hero-sub">
            Researcher · Developer · Builder
          </p>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="section-inner">
          <span className="section-tag">01 — About Me</span>
          <h2 className="section-title">Who I Am</h2>
          <div className="about-grid">
            {/* ── LEFT: Profile Photo ── */}
            <div className="about-photo-col">
              <div className="about-photo-frame">
                <div className="about-photo-inner">
                  <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="about-photo-svg">
                    {/* Body / torso */}
                    <ellipse cx="60" cy="118" rx="42" ry="26" fill="var(--accent)" opacity="0.18"/>
                    <ellipse cx="60" cy="108" rx="30" ry="20" fill="var(--accent)" opacity="0.28"/>
                    {/* Neck */}
                    <rect x="53" y="72" width="14" height="16" rx="7" fill="var(--accent)" opacity="0.55"/>
                    {/* Head */}
                    <circle cx="60" cy="58" r="26" fill="var(--accent)" opacity="0.7"/>
                    {/* Eyes */}
                    <circle cx="52" cy="55" r="3.5" fill="var(--bg)" opacity="0.9"/>
                    <circle cx="68" cy="55" r="3.5" fill="var(--bg)" opacity="0.9"/>
                    <circle cx="53" cy="55.5" r="1.8" fill="var(--text-h)" opacity="0.8"/>
                    <circle cx="69" cy="55.5" r="1.8" fill="var(--text-h)" opacity="0.8"/>
                    {/* Smile */}
                    <path d="M52 67 Q60 74 68 67" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85"/>
                    {/* Hair */}
                    <path d="M34 54 Q36 28 60 26 Q84 28 86 54 Q84 36 60 34 Q36 36 34 54Z" fill="var(--text-h)" opacity="0.55"/>
                  </svg>
                </div>
                <div className="about-photo-glow" />
              </div>
              <div className="about-badges">
                <span className="badge">🎓 Student</span>
                <span className="badge">💡 Researcher</span>
                <span className="badge">⚡ Developer</span>
              </div>
            </div>

            {/* ── RIGHT: Bio / About Me ── */}
            <div className="about-text">
              <p className="about-lead">
                Hi! I'm a passionate developer and researcher dedicated to building
                meaningful technology that makes a difference.
              </p>
              <p className="about-body">
                With a strong foundation in software development and a deep curiosity
                for cutting-edge research, I enjoy bridging the gap between theory and
                practice. Whether it's crafting elegant user interfaces, designing
                efficient algorithms, or exploring the frontiers of AI — I love every
                step of the journey.
              </p>
              <p className="about-body">
                Outside of tech, I enjoy reading, collaborative problem-solving, and
                continuously learning something new every day.
              </p>
              <div className="about-skills">
                {['React', 'Python', 'Machine Learning', 'Node.js', 'Data Analysis', 'UI/UX'].map(skill => (
                  <span key={skill} className="skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <ProjectsCarousel />

      {/* ── CURRENT RESEARCH ── */}
      <section className="section research-section" id="research">
        <div className="section-inner">
          <span className="section-tag">03 — Current Research</span>
          <h2 className="section-title">What I'm Exploring</h2>
          <p className="section-sub">Ongoing investigations at the intersection of technology and impact</p>
          <div className="research-list">
            {[
              {
                icon: '🧠',
                status: 'Active',
                statusColor: '#10b981',
                title: 'Large Language Models for Domain-Specific Tasks',
                desc: 'Investigating fine-tuning strategies and prompt engineering techniques to adapt general-purpose LLMs for specialized scientific and educational domains with limited labeled data.',
                highlights: ['Fine-tuning', 'Few-shot Learning', 'Evaluation Benchmarks'],
              },
              {
                icon: '📡',
                status: 'Active',
                statusColor: '#10b981',
                title: 'Federated Learning with Privacy Guarantees',
                desc: 'Exploring privacy-preserving machine learning approaches where training data never leaves local devices, enabling collaborative model training without centralizing sensitive information.',
                highlights: ['Differential Privacy', 'Federated Aggregation', 'Edge Computing'],
              },
              {
                icon: '🔬',
                status: 'Ongoing',
                statusColor: '#f59e0b',
                title: 'Human-Computer Interaction in AI-Assisted Workflows',
                desc: 'Studying how humans cognitively adapt to AI-augmented environments and what design patterns best support trust, transparency, and effective collaboration between humans and AI systems.',
                highlights: ['UX Research', 'Cognitive Load', 'Trust Calibration'],
              },
            ].map((item) => (
              <div key={item.title} className="research-card">
                <div className="research-header">
                  <div className="research-icon">{item.icon}</div>
                  <span className="research-status" style={{ '--status-color': item.statusColor }}>
                    <span className="status-dot" />
                    {item.status}
                  </span>
                </div>
                <h3 className="research-title">{item.title}</h3>
                <p className="research-desc">{item.desc}</p>
                <div className="research-highlights">
                  {item.highlights.map(h => (
                    <span key={h} className="research-chip">{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <p>© 2026 Portfolio · Built with love </p>
      </footer>
    </>
  )
}

export default App
