import './App.css'

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
            <div className="about-avatar">
              <div className="avatar-ring">
                <div className="avatar-placeholder">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="30" r="18" fill="currentColor" opacity="0.6"/>
                    <ellipse cx="40" cy="72" rx="28" ry="18" fill="currentColor" opacity="0.4"/>
                  </svg>
                </div>
              </div>
              <div className="about-badges">
                <span className="badge">🎓 Student</span>
                <span className="badge">💡 Researcher</span>
                <span className="badge">⚡ Developer</span>
              </div>
            </div>
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
      <section className="section projects-section" id="projects">
        <div className="section-inner">
          <span className="section-tag">02 — Projects</span>
          <h2 className="section-title">What I've Built</h2>
          <p className="section-sub">A selection of projects I'm proud of</p>
          <div className="projects-grid">
            {[
              {
                emoji: '🚀',
                title: 'Project Alpha',
                desc: 'A full-stack web application for real-time data visualization with interactive dashboards and live analytics.',
                tags: ['React', 'Node.js', 'WebSocket'],
                color: 'var(--accent)',
              },
              {
                emoji: '🤖',
                title: 'AI Assistant',
                desc: 'An intelligent chatbot powered by natural language processing that helps users manage daily tasks efficiently.',
                tags: ['Python', 'NLP', 'FastAPI'],
                color: '#06b6d4',
              },
              {
                emoji: '📊',
                title: 'Data Pipeline',
                desc: 'Automated ETL pipeline that processes and transforms large datasets for downstream machine-learning workloads.',
                tags: ['Python', 'Pandas', 'SQL'],
                color: '#10b981',
              },
              {
                emoji: '🎨',
                title: 'Design System',
                desc: 'A comprehensive component library and design system built for consistency across multiple products.',
                tags: ['React', 'CSS', 'Storybook'],
                color: '#f59e0b',
              },
              {
                emoji: '🔐',
                title: 'Auth Service',
                desc: 'Secure authentication microservice supporting OAuth 2.0, JWT, and multi-factor authentication flows.',
                tags: ['Node.js', 'JWT', 'OAuth'],
                color: '#ef4444',
              },
              {
                emoji: '🌐',
                title: 'Portfolio Site',
                desc: 'This very portfolio — built with React and Vite, designed for performance and visual impact.',
                tags: ['React', 'Vite', 'CSS'],
                color: 'var(--accent)',
              },
            ].map((project) => (
              <div key={project.title} className="project-card" style={{ '--card-accent': project.color }}>
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
        </div>
      </section>

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
        <p>© 2026 Portfolio · Built with React &amp; Vite</p>
      </footer>
    </>
  )
}

export default App
