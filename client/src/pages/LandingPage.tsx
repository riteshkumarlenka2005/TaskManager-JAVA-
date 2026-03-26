import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Layers, 
  LayoutDashboard, 
  FileText, 
  Paintbrush, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Globe,
  Smartphone,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#FFFFFF] selection:bg-[#BEC4FF]/20 relative overflow-hidden font-['Outfit']">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#BEC4FF]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#7C8B93]/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#18181B] flex items-center justify-center border border-white/5 shadow-2xl">
            <Layers className="w-6 h-6 text-[#BEC4FF]" />
          </div>
          <span className="text-2xl font-black tracking-tighter">TaskManager</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-[#7C8B93] hover:text-[#BEC4FF] transition-all uppercase tracking-widest">Features</a>
          <a href="#mobile" className="text-sm font-bold text-[#7C8B93] hover:text-[#BEC4FF] transition-all uppercase tracking-widest">Mobile App</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-[#7C8B93] hover:text-white transition-colors">Sign In</Link>
          <Link to="/register" className="bg-[#BEC4FF] text-[#0E0E10] px-8 py-3 rounded-2xl font-black text-sm hover:bg-[#D6DAFF] transition-all shadow-xl shadow-[#BEC4FF]/10">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-16 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[#BEC4FF] text-[10px] font-black tracking-[0.2em] uppercase mb-10">
              <Sparkles className="w-3 h-3" /> Redefining Productivity
            </div>
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter mb-8 leading-[0.95] max-w-5xl mx-auto">
              Master your <span className="text-[#BEC4FF]">workflow</span> with precision.
            </h1>
            <p className="text-xl sm:text-2xl text-[#7C8B93] max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
              The premium workspace for high-performance individuals. Organize tasks, 
              documents, and designs in one visually stunning, unified hub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-black text-lg font-black py-5 px-12 rounded-[2rem] hover:bg-[#BEC4FF] transition-all w-full sm:w-auto shadow-2xl shadow-white/5"
              >
                Create Workspace
              </button>
              <a 
                href="/TaskManager.apk"
                download="TaskManager.apk"
                className="flex items-center justify-center gap-3 py-5 px-10 rounded-[2rem] bg-[#18181B] border border-white/5 text-white hover:bg-[#222226] transition-all font-bold group w-full sm:w-auto no-underline shadow-xl"
              >
                <Smartphone className="w-6 h-6 text-[#BEC4FF]" />
                Get Mobile App
              </a>
            </div>
          </motion.div>
        </div>

        {/* Hero Preview Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="max-w-6xl mx-auto mt-24 relative px-4"
        >
          <div className="relative bg-[#18181B] p-4 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
            <div className="bg-[#0E0E10] rounded-[32px] overflow-hidden aspect-video flex items-center justify-center relative p-12">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#BEC4FF]/5 to-transparent pointer-events-none" />
               <div className="text-center z-10">
                  <LayoutDashboard className="w-24 h-24 text-[#BEC4FF]/20 mx-auto mb-6" />
                  <p className="text-[#7C8B93] font-bold text-sm uppercase tracking-[0.3em]">System Interface Ready</p>
               </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black tracking-tighter mb-4 leading-tight">Hyper-focused modules for deep work.</h2>
              <p className="text-[#7C8B93] text-xl font-medium">No bloat. Just the tools you need.</p>
            </div>
            <Link to="/register" className="text-[#BEC4FF] font-black flex items-center gap-2 group text-lg">
              Explore All <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<LayoutDashboard className="w-8 h-8" />}
              title="SaaS Dashboard"
              description="Minimalist task management with priority focus and fluid state animations."
            />
            <FeatureCard 
              icon={<FileText className="w-8 h-8" />}
              title="Modern Docs"
              description="Clean document editor designed for clarity and rapid information architectural."
            />
            <FeatureCard 
              icon={<Paintbrush className="w-8 h-8" />}
              title="Creative Canvas"
              description="Professional drawing tools for sketching ideas and engineering blueprints."
            />
          </div>
        </div>
      </section>

      {/* Mobile Promo */}
      <section id="mobile" className="py-32 px-6 bg-[#18181B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <Stat icon={<Shield className="w-6 h-6" />} label="Security" value="E2E Encrypted" />
          <Stat icon={<Zap className="w-6 h-6" />} label="Speed" value="Instant Sync" />
          <Stat icon={<Globe className="w-6 h-6" />} label="Availability" value="Any Device" />
          <Stat icon={<CheckCircle2 className="w-6 h-6" />} label="Result" value="+60% Focus" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 text-center bg-[#0E0E10]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
               <Layers className="w-5 h-5 text-[#BEC4FF]" />
             </div>
             <span className="text-xl font-black tracking-tighter">TaskManager</span>
          </div>
          <p className="text-[#7C8B93] text-sm font-bold tracking-widest max-w-sm uppercase">
            &copy; 2026 TaskManager Elite. Designed for the top 1%.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-[#18181B] p-10 rounded-[3rem] group border border-white/5 hover:border-[#BEC4FF]/30 transition-all duration-500 shadow-2xl"
  >
    <div className="w-16 h-16 rounded-[1.5rem] bg-[#0E0E10] flex items-center justify-center border border-white/10 mb-8 group-hover:bg-[#BEC4FF] transition-all group-hover:text-black">
      <div className="text-[#BEC4FF] group-hover:text-black group-hover:scale-110 transition-all">{icon}</div>
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
    <p className="text-[#7C8B93] leading-relaxed font-medium">{description}</p>
  </motion.div>
);

const Stat: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center">
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#BEC4FF] mb-6 mb-4">
      {icon}
    </div>
    <div className="text-2xl font-black mb-2">{value}</div>
    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C8B93]">{label}</div>
  </div>
);

export default LandingPage;
