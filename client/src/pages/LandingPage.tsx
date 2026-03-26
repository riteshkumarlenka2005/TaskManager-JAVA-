import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, CheckSquare, FileText, Cloud } from 'lucide-react';
import './landing.css';

/* ─── Shaking Folder Image ─── */
const HeroImage: React.FC = () => (
  <motion.div 
    className="lp-hero-image-container"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
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

    {/* Hero Section Container */}
    <section className="lp-hero">
      <div className="lp-hero-inner">
        {/* 1. Logo */}
        <motion.div className="lp-logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="lp-logo-icon"><Layers size={24} /></div>
          <span className="lp-logo-name">TaskManager</span>
        </motion.div>

        {/* 2. Hero Image */}
        <HeroImage />

        {/* 3. Hero Text (Heading + Subtext) */}
        <motion.div className="lp-hero-left">
          <motion.h1 className="lp-h1"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
            }}
          >
            {["Organize.", "Simplify.", "Achieve."].map((word, i) => (
              <motion.span 
                key={i}
                className={word === "Simplify." ? "accent" : ""}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "inline-block", marginRight: i < 2 ? "0.3em" : "0" }}
              >
                {word}
                {i === 1 && <br />}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p className="lp-sub"
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}>
            The all-in-one workspace for tasks, notes, and productivity — built for clarity, speed, and focus.
          </motion.p>

          {/* Feature Cubes */}
          <motion.div 
            className="lp-feature-cubes"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } }
            }}
          >
            {[
              { icon: <CheckSquare size={20} />, label: "Smart Tasks", class: "tasks" },
              { icon: <FileText size={20} />, label: "Notes", class: "notes" },
              { icon: <Cloud size={20} />, label: "Cloud Sync", class: "cloud" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="lp-cube"
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.8 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5, ease: "backOut" }}
              >
                <div className={`lp-cube-icon ${item.class}`}>{item.icon}</div>
                <span className="lp-cube-label">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* 4. CTA Buttons */}
        <motion.div className="lp-cta"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}>
          <Link to="/register" className="lp-btn-primary">
            Start Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default LandingPage;
