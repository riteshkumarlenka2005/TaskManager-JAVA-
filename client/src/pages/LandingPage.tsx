import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Layers, 
  LayoutDashboard, 
  FileText, 
  Paintbrush, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Globe 
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05070A] text-[#A8FFDF] selection:bg-[#00FF9C]/20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="ambient-bg" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#00FF9C]/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00FF9C]/10 flex items-center justify-center border border-[#00FF9C]/20 shadow-[0_0_15px_rgba(0,255,156,0.2)]">
            <Layers className="w-5 h-5 text-[#00FF9C]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#A8FFDF]">TaskManager</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/login" className="text-sm font-medium text-[#7C8B93] hover:text-[#00FF9C] transition-colors">Sign In</Link>
          <Link to="/register" className="btn-primary py-2 px-6">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00FF9C]/10 border border-[#00FF9C]/20 text-[#00FF9C] text-xs font-bold tracking-widest uppercase mb-8 cyber-glow">
              <Zap className="w-3 h-3" /> Next-Gen Productivity
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Design Your <span className="accent-gradient-text">Future</span> <br className="hidden sm:block" /> Workforce
            </h1>
            <p className="text-lg sm:text-xl text-[#7C8B93] max-w-2xl mx-auto mb-12">
              The ultimate workspace for creators, hackers, and teams. Organize tasks, 
              write professional documentation, and draw futuristic blueprints in one neon-powered hub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg py-4 px-10 w-full sm:w-auto">
                Deploy Your Space
              </Link>
              <Link to="/login" className="btn-outline text-lg py-4 px-10 w-full sm:w-auto">
                Access Terminal
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Image / Mockup Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 60 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="max-w-5xl mx-auto mt-20 relative px-4"
        >
          <div className="relative glass-panel p-2 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-[#00FF9C]/30">
            <div className="bg-[#0A0F14] rounded-xl overflow-hidden border border-[#00FF9C]/10 aspect-video flex items-center justify-center p-8">
               <div className="text-center">
                  <LayoutDashboard className="w-20 h-20 text-[#00FF9C]/20 mx-auto mb-4" />
                  <p className="text-[#00FF9C]/40 font-mono text-sm uppercase tracking-widest animate-pulse">Initializing System Interface...</p>
               </div>
            </div>
            {/* Floating elements */}
            <div className="absolute top-10 -right-10 w-32 h-32 bg-[#00FF9C]/20 blur-[60px] rounded-full" />
            <div className="absolute bottom-10 -left-10 w-40 h-40 bg-[#00CFFF]/20 blur-[80px] rounded-full" />
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6 border-t border-[#00FF9C]/10 bg-[#0A0F14]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Hyper-Connected Modules</h2>
            <p className="text-[#7C8B93]">Everything you need to build the future.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<LayoutDashboard className="w-8 h-8" />}
              title="Neon Dashboard"
              description="High-contrast task management with priority tagging and real-time state tracking."
            />
            <FeatureCard 
              icon={<FileText className="w-8 h-8" />}
              title="Cyber Docs"
              description="Rich-text document platform with support for code blocks, tables, and neon styling."
            />
            <FeatureCard 
              icon={<Paintbrush className="w-8 h-8" />}
              title="Digital Canvas"
              description="Built-in drawing tool for sketching ideas, diagrams, and futuristic blueprints."
            />
          </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-24 px-6 border-t border-[#00FF9C]/05">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat icon={<Shield />} label="Encrypted" value="100%" />
          <Stat icon={<Zap />} label="Latancy" value="~14ms" />
          <Stat icon={<Globe />} label="Uptime" value="99.9%" />
          <Stat icon={<CheckCircle2 />} label="Efficiency" value="+40%" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center bg-gradient-to-b from-[#05070A] to-[#0A1F1A]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-[#A8FFDF]">Ready to hack your productivity?</h2>
          <p className="text-[#7C8B93] mb-12 text-lg">
            Join thousands of developers and designers who have switched to the neon side of work.
          </p>
          <Link to="/register" className="btn-primary text-xl py-5 px-12 group">
             Initialize Now <Zap className="w-6 h-6 ml-2 group-hover:scale-125 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#00FF9C]/05 text-center text-[#7C8B93] text-sm">
        <p>&copy; 2026 TaskManager Cyber Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-8 group border-[#00FF9C]/10 hover:border-[#00FF9C]/40 transition-all duration-300"
  >
    <div className="w-16 h-16 rounded-2xl bg-[#00FF9C]/05 flex items-center justify-center border border-[#00FF9C]/10 mb-6 group-hover:bg-[#00FF9C]/10 transition-colors">
      <div className="text-[#00FF9C] group-hover:scale-110 transition-transform">{icon}</div>
    </div>
    <h3 className="text-xl font-bold mb-3 text-[#A8FFDF]">{title}</h3>
    <p className="text-[#7C8B93] leading-relaxed">{description}</p>
  </motion.div>
);

const Stat: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00FF9C]/10 text-[#00FF9C] mb-4">
      {icon}
    </div>
    <div className="text-3xl font-bold text-[#A8FFDF] mb-1">{value}</div>
    <div className="text-xs uppercase tracking-widest text-[#7C8B93] font-bold">{label}</div>
  </div>
);

export default LandingPage;
