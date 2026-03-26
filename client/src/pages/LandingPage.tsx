import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Layers, 
  ChevronDown,
  Folder,
  FileText,
  Book,
  Layout,
  Smartphone
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#18181B] text-white selection:bg-[#BEC4FF]/20 relative overflow-hidden font-['Outfit']">
      {/* Curved Background Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-white rounded-t-[100px] md:rounded-t-[200px] z-0" />

      {/* Navbar Container */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl">
             <Layers className="w-5 h-5 text-[#BEC4FF]" />
          </div>
          <span className="text-xl font-black tracking-tighter">TaskManager</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <a href="#" className="text-sm font-bold text-[#BEC4FF] border-b-2 border-[#BEC4FF] pb-1">Home</a>
          <a href="#" className="text-sm font-bold text-[#7C8B93] hover:text-white transition-all">Projects</a>
          <a href="#" className="text-sm font-bold text-[#7C8B93] hover:text-white transition-all">Members</a>
          <a href="#" className="text-sm font-bold text-[#7C8B93] hover:text-white transition-all">Pages</a>
          <a href="#" className="text-sm font-bold text-[#7C8B93] hover:text-white transition-all">Docs</a>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-bold text-white hover:opacity-80 transition-opacity">Log in</Link>
          <Link to="/register" className="bg-transparent border border-white/20 px-8 py-3 rounded-full font-bold text-sm hover:bg-white hover:text-black transition-all">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-40 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading & Filter Bar */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-10 bg-[#BEC4FF]/20 rounded-2xl flex items-center justify-center mb-10 overflow-hidden relative">
               <div className="w-4 h-4 rounded-full bg-orange-500 absolute top-[-5px] right-2 animate-bounce" />
               <Layers className="text-[#BEC4FF] w-6 h-6" />
            </div>

            <h1 className="text-6xl md:text-[5.5rem] font-black leading-[0.9] tracking-tighter mb-8 max-w-2xl">
              Organize Your <br />
              Best <span className="text-[#BEC4FF]">Happy Space</span>
            </h1>
            
            <p className="text-[#7C8B93] text-xl font-medium mb-12 max-w-md leading-relaxed">
              Folders & Documents For Work Or Play In 12+ Categories.
            </p>

            {/* Custom Filter Bar (Real Estate Style) */}
            <div className="bg-white p-3 rounded-[32px] shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-2xl mb-10">
               <div className="flex-1 flex items-center gap-4 px-6 py-2 border-r border-gray-100 last:border-none">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                     <Folder className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Storage Type</span>
                     <div className="flex items-center gap-1">
                        <span className="text-black font-black text-sm">Folder</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                     </div>
                  </div>
               </div>
               <div className="flex-1 flex items-center gap-4 px-6 py-2 border-r border-gray-100 last:border-none">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                     <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Complexity</span>
                     <div className="flex items-center gap-1">
                        <span className="text-black font-black text-sm">Standard</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                     </div>
                  </div>
               </div>
               <button 
                  onClick={() => navigate('/register')}
                  className="bg-[#3D44A7] hover:bg-[#2F358C] text-white px-10 py-4 rounded-[24px] font-black transition-all flex items-center gap-2"
               >
                  Search
               </button>
            </div>

            {/* Sub-actions */}
            <div className="flex items-center gap-10">
               <button className="flex items-center gap-3 text-white font-black hover:opacity-80 transition-opacity uppercase text-[10px] tracking-widest">
                  Create Folder <ChevronDown className="w-5 h-5 bg-white/10 rounded-full" />
               </button>
               <button className="flex items-center gap-3 text-white font-black hover:opacity-80 transition-opacity uppercase text-[10px] tracking-widest">
                  Import Docs <ChevronDown className="w-5 h-5 bg-white/10 rounded-full" />
               </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Cards (Overlapping) */}
        <div className="lg:col-span-5 relative h-[500px] mt-12 lg:mt-0">
          <div className="absolute inset-0 bg-cover bg-center rounded-[50px] opacity-20 filter grayscale" 
               style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80)' }} 
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="absolute top-0 right-0 z-20 w-full"
          >
            {/* Main Overlapping Cards Container */}
            <div className="relative w-full h-full">
              {/* Badge Card */}
              <div className="absolute top-[20px] left-[-40px] z-30 bg-[#E2837E] p-6 rounded-[32px] shadow-2xl max-w-[200px]">
                 <span className="text-white font-black text-lg block leading-tight">Advanced <br /> Organization</span>
              </div>

              {/* Central Large Card */}
              <div className="bg-[#2C2C30] p-10 rounded-[40px] shadow-2xl border border-white/5 mt-20 ml-10 flex flex-col gap-6 relative group overflow-hidden">
                 <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-[#BEC4FF]/5 rounded-full blur-3xl pointer-events-none" />
                 
                 <div className="w-14 h-14 rounded-full bg-[#3A3A3E] flex items-center justify-center text-[#BEC4FF]">
                    <Layout className="w-7 h-7" />
                 </div>
                 
                 <div>
                    <h3 className="text-2xl font-black mb-3 text-white">Comfortable</h3>
                    <p className="text-[#7C8B93] text-sm font-medium leading-relaxed">
                       Manage your Folders, Notes, <br /> and Tasks efficiently.
                    </p>
                 </div>
              </div>

              {/* Side Card (Peeking) */}
              <div className="absolute top-[180px] right-[-60px] z-10 bg-[#1D1D21] p-10 rounded-[40px] shadow-2xl border border-white/5 opacity-60 scale-95 blur-[1px]">
                 <div className="w-14 h-14 rounded-full bg-[#3A3A3E] flex items-center justify-center text-[#BEC4FF] mb-6">
                    <Book className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-black mb-3">Luxury</h3>
                 <p className="text-[#7C8B93] text-sm">Premium Workspace</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Overlay */}
          <div className="absolute bottom-[-20px] left-10 z-30 text-[#7C8B93] text-[10px] font-bold max-w-xs">
             Join 10k+ researchers and <br />
             professionals using TaskManager, or <span className="text-orange-400 underline decoration-dotted">learn more here</span>
          </div>
        </div>
      </div>

      {/* Trust Section / Logos Container */}
      <section className="relative z-20 px-8 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
           {/* Detailed Card at Bottom Left */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="bg-white rounded-[40px] p-2 flex items-center gap-6 shadow-2xl shadow-black/5"
           >
              <div className="w-24 h-24 rounded-[32px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=200" alt="Office" className="w-full h-full object-cover" />
              </div>
              <div className="pr-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase mb-1">
                   <Folder className="w-3 h-3 text-orange-400" /> Cloud Workspace • Main
                </div>
                <div className="flex items-center gap-4 mb-2">
                   <div className="flex items-center gap-1 text-[10px] font-black text-black">
                      <Layout className="w-3 h-3 text-gray-400" /> 128 Notes
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-black text-black">
                      <FileText className="w-3 h-3 text-gray-400" /> 12 Folders
                   </div>
                </div>
                <div className="flex items-center justify-between gap-8">
                   <span className="text-lg font-black text-black">Elite Space</span>
                   <button className="bg-[#BEC4FF]/10 text-[#3D44A7] px-4 py-1 rounded-md text-[10px] font-black uppercase">Open Now</button>
                </div>
              </div>
           </motion.div>

           {/* Trusted Logos */}
           <div className="flex-1 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-8 opacity-40 grayscale contrast-125">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg" alt="Airbnb" className="h-6" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" alt="Cisco" className="h-6" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-6" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-6" />
              </div>
           </div>
        </div>
      </section>

      {/* Floating CTA for Mobile App */}
      <Link to="/TaskManager.apk" download="TaskManager.apk" className="fixed bottom-10 right-10 z-[100] bg-[#BEC4FF] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
         <Smartphone className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default LandingPage;
