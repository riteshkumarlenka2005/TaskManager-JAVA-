import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Layers, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#BEC4FF]/20 relative overflow-hidden font-['Outfit'] flex flex-col">
      
      {/* 3D Blinking Dotted Background */}
      <div className="absolute inset-0 z-0 pointer-events-none perspective-[1000px]">
        <div className="absolute inset-0 opacity-20 transform-gpu rotate-x-[30deg]">
          <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] gap-4 p-4 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4">
            {Array.from({ length: 1600 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.1 }}
                animate={{ 
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
                className="w-1 h-1 rounded-full bg-[#3D44A7]"
              />
            ))}
          </div>
        </div>
        
        {/* Radial Overlay for Depth */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#050505]/60 to-[#050505]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group overflow-hidden">
             <Layers className="w-4 h-4 text-[#BEC4FF] group-hover:scale-120 transition-transform" />
          </div>
          <span className="text-lg font-black tracking-tighter">TaskManager</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <Link to="/login" className="text-sm font-bold text-[#7C8B93] hover:text-white transition-colors">Log in</Link>
          <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-full font-black text-sm hover:scale-105 transition-transform shadow-xl shadow-white/5">
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ opacity: 0, rotateX: 20, y: 50 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#BEC4FF] text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            The Future of Productivity
          </motion.div>

          <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter leading-[0.85] mb-10 text-white drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
            Elegance <br />
            Defines <br />
            Control.
          </h1>

          <p className="text-[#7C8B93] text-lg md:text-xl font-medium max-w-xl mx-auto mb-14 leading-relaxed opacity-80">
            A minimalist workspace for high-performing teams. <br />
            No clutter. Just focus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-black px-12 py-5 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl shadow-white/10 group"
            >
              Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-12 py-5 rounded-full font-black text-lg border border-white/10 hover:bg-white/5 transition-all">
              Live Demo
            </button>
          </div>
        </motion.div>
      </main>

      {/* Simplified Footer section */}
      <footer className="relative z-10 p-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4F5B62]">
          TaskManager Elite • v4.0.0
        </div>
        <div className="flex items-center gap-8 mt-4 md:mt-0 text-[#7C8B93] text-xs font-bold uppercase tracking-widest">
           <a href="#" className="hover:text-white transition-colors">Twitter</a>
           <a href="#" className="hover:text-white transition-colors">GitHub</a>
           <a href="#" className="hover:text-white transition-colors">Discord</a>
        </div>
      </footer>

      {/* Floating 3D Mobile Badge */}
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        className="fixed bottom-10 right-10 z-[100] group cursor-grab active:cursor-grabbing"
      >
        <Link to="/TaskManager.apk" download="TaskManager.apk" className="w-16 h-16 bg-[#BEC4FF] text-black rounded-2xl flex items-center justify-center shadow-3xl transform group-hover:rotate-12 transition-transform shadow-[#BEC4FF]/20 relative">
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center animate-ping" />
           <Smartphone className="w-8 h-8" />
        </Link>
      </motion.div>

      {/* 3D Depth Card (Abstract) peeking from bottom */}
      <motion.div 
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#BEC4FF]/10 to-transparent blur-[100px] rounded-full pointer-events-none"
      />
    </div>
  );
};

export default LandingPage;
