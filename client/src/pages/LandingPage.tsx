import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Play, Zap } from 'lucide-react';
import './landing.css';

/* ─── Floating Hero Cards ─── */
const HeroCards: React.FC = () => (
  <div className="lp-hero-right">
    <div className="lp-hero-glow" />

    {/* Task Card */}
    <motion.div
      className="lp-hero-card"
      style={{ top: '8%', left: '0%', zIndex: 3 }}
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="lp-card-label">Tasks</div>
        <div className="lp-card-row"><div className="lp-card-check done"><Zap size={9} /></div>Build landing page</div>
        <div className="lp-card-row"><div className="lp-card-check done"><Zap size={9} /></div>Deploy to cloud</div>
        <div className="lp-card-row"><div className="lp-card-check" />Write documentation</div>
      </motion.div>
    </motion.div>

    {/* Notes Card */}
    <motion.div
      className="lp-hero-card"
      style={{ top: '2%', right: '0', zIndex: 2 }}
      initial={{ opacity: 0, y: 40, rotateY: 6 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 0.8, duration: 1 }}
    >
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}>
        <div className="lp-card-label">Notes</div>
        <div className="lp-card-line" style={{ width: '100%', background: 'rgba(190,196,255,0.12)' }} />
        <div className="lp-card-line" style={{ width: '70%', background: 'rgba(190,196,255,0.08)' }} />
        <div className="lp-card-line" style={{ width: '85%', background: 'rgba(190,196,255,0.06)' }} />
      </motion.div>
    </motion.div>

    {/* Docs Card */}
    <motion.div
      className="lp-hero-card"
      style={{ bottom: '10%', left: '12%', zIndex: 4 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 1 }}
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}>
        <div className="lp-card-label">Docs</div>
        <div className="lp-card-line" style={{ width: '90%', background: 'rgba(190,196,255,0.1)' }} />
        <div className="lp-card-line" style={{ width: '60%', background: 'rgba(190,196,255,0.06)' }} />
      </motion.div>
    </motion.div>
  </div>
);

/* ═══ LANDING PAGE — Hero Only ═══ */
const LandingPage: React.FC = () => (
  <div className="lp">
    {/* Grid Background */}
    <div className="lp-grid-bg" />

    {/* Logo — Top Left */}
    <div className="lp-logo">
      <div className="lp-logo-icon"><Layers size={24} /></div>
      <span className="lp-logo-name">TaskManager</span>
    </div>

    {/* Hero Section */}
    <section className="lp-hero">
      <div className="lp-hero-inner">
        {/* Left — Text */}
        <motion.div className="lp-hero-left" initial="hidden" animate="visible">
          <motion.div className="lp-badge"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}>
            <motion.span className="lp-badge-dot"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }} />
            TaskManager Pro
          </motion.div>

          <motion.h1 className="lp-h1"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}>
            Organize. <span className="accent">Simplify.</span><br />Achieve.
          </motion.h1>

          <motion.p className="lp-sub"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}>
            The all-in-one workspace for tasks, notes, and productivity — built for clarity, speed, and focus.
          </motion.p>

          <motion.p className="lp-trust"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}>
            Trusted by students, developers, and creators.
          </motion.p>

          <motion.div className="lp-cta"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}>
            <Link to="/register" className="lp-btn-primary">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="lp-btn-secondary">
              <Play size={16} /> View Demo
            </Link>
          </motion.div>

          <motion.div className="lp-badges"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}>
            <span className="lp-badge-item"><span className="chk">✔</span> No credit card required</span>
            <span className="lp-badge-item"><span className="chk">✔</span> Lightning fast</span>
            <span className="lp-badge-item"><span className="chk">✔</span> Secure & reliable</span>
          </motion.div>
        </motion.div>

        {/* Right — Floating Cards */}
        <HeroCards />
      </div>
    </section>
  </div>
);

export default LandingPage;
