import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Play } from 'lucide-react';
import './landing.css';

/* ─── Shaking Folder Image ─── */
const HeroImage: React.FC = () => (
  <motion.div 
    className="lp-hero-image-container"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <motion.img 
      src="/FolderImage.png" 
      alt="Folder" 
      className="lp-hero-img"
      animate={{ 
        x: [-2, 2, -2, 2, 0],
        y: [0, -1, 1, -1, 0],
        rotate: [-0.5, 0.5, -0.5, 0.5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    />
    <div className="lp-hero-glow" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%' }} />
  </motion.div>
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
        {/* Hero Text */}
        <motion.div className="lp-hero-left" initial="hidden" animate="visible">
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
        </motion.div>

        {/* Hero Image */}
        <HeroImage />
      </div>
    </section>
  </div>
);

export default LandingPage;
