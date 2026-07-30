import { useEffect, useRef, useState } from 'react'
import './App.css'

const PROJECTS = [
  { emoji: '⛑️', title: 'Kaves',  desc: 'A smart HSE web app to help HSE staffs on HSE documentation such as JSA, incident reports, and mapping. This web also provide a smart dashboard to analyze which place should be handled first based on risk assesment.', tags: ['React', 'Node.js', 'MongoDB'], color: 'var(--accent)' },
  { emoji: '🚪', title: 'MyLab',   desc: 'Room information display using Raspberry Pi. Also feature face recognition for easier lecturer recognition in room.', tags: ['Python', 'Raspberry Pi', 'MySQL'], color: '#06b6d4' },
  { emoji: '🕒', title: 'TeMan',  desc: 'Simple time management web app.', tags: ['HTML', 'CSS', 'MySQL'], color: '#10b981' },
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
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="section-inner">
          <span className="section-tag">01 — About Me</span>
          <h2 className="section-title">Who I Am</h2>
          <div className="about-grid">
            {/* LEFT: Profile Photo */}
            <div className="about-photo-col">         
                  {/* ntar di sini naro pp */}    
            </div>

            {/* RIGHT: Description */}
            <div className="about-text">
              <p className="about-lead">
                Hi! I'm Kavita, a sixth-year college student at Politeknik Negeri Batam!
              </p>
              <p className="about-body">
                With a foundation in software development and a deep curiosity
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
                {['ReactJS', 'Python', 'Data Analysis', 'UI/UX', 'Excel', 'Figma'].map(skill => (
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
                icon: '🖼️',
                status: 'Active',
                statusColor: '#10b981',
                title: 'To What Extent Can User-Centered Design Improve the Usability of KAVES? A Case in Smart HSE Application.',
                desc: 'This study applies User-Centered Design (UCD) across four iterative phases to redesign the KAVES interface and enhance its usability for HSE officers. Usability is evaluated using the System Usability Scale (SUS) before and after the redesign to improve efficiency, intuitiveness, and user satisfaction in high-risk work environments.',
                highlights: ['UI/UX', 'User Centered Design'],
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
