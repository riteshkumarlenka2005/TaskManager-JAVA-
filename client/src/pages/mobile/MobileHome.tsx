import React from 'react';
import { Cloud, Wind, Thermometer, Droplets, Smartphone, Tv, Lamp, Speaker } from 'lucide-react';

const MobileHome: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Status Widget */}
      <div className="mobile-panel bg-gradient-to-br from-[#46F0D2]/20 to-[#131321] border-[#46F0D2]/20 shadow-[0_0_30px_rgba(70,240,210,0.1)]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Cloud className="w-6 h-6 text-mobile-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Cloudy</h3>
              <p className="text-xs text-mobile-text-muted">Rajshahi, Bangladesh</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-4xl font-extrabold text-mobile-primary">28°</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/05">
          <StatMini icon={<Thermometer />} label="Sensible" value="31°" />
          <StatMini icon={<Droplets />} label="Humidity" value="65%" />
          <StatMini icon={<Wind />} label="W. force" value="3" />
          <StatMini icon={<Smartphone />} label="Pressure" value="1009hpa" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        <TabItem label="All Devices" active />
        <TabItem label="Living Room" />
        <TabItem label="Bedroom" />
        <TabItem label="Kitchen" />
      </div>

      {/* Grid */}
      <div className="mobile-grid">
        <DeviceCard icon={<Wind />} name="Air Condition" count={4} active />
        <DeviceCard icon={<Tv />} name="Smart TV" count={2} />
        <DeviceCard icon={<Lamp />} name="Smart Lighting" count={8} />
        <DeviceCard icon={<Speaker />} name="Speaker" count={6} />
      </div>

      {/* Bottom spacer for nav */}
      <div className="h-4" />
    </div>
  );
};

const StatMini = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="text-center">
    <div className="text-mobile-primary/60 mb-1 flex justify-center">{icon}</div>
    <div className="text-[10px] font-bold text-white mb-0.5">{value}</div>
    <div className="text-[8px] text-mobile-text-muted uppercase tracking-tighter">{label}</div>
  </div>
);

const TabItem = ({ label, active }: { label: string, active?: boolean }) => (
  <button className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
    active ? 'bg-mobile-primary text-[#131321] shadow-[0_4px_15px_rgba(70,240,210,0.3)]' : 'bg-white/05 text-mobile-text-muted'
  }`}>
    {label}
  </button>
);

const DeviceCard = ({ icon, name, count, active }: { icon: React.ReactNode, name: string, count: number, active?: boolean }) => (
  <div className={`mobile-panel p-5 group transition-all duration-500 cursor-pointer ${
    active ? 'bg-mobile-primary border-mobile-primary' : 'bg-white/[0.03] border-white/05'
  }`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`mobile-icon-box ${active ? 'bg-[#131321]/20' : 'bg-white/05'}`}>
        <div className={active ? 'text-[#131321]' : 'text-mobile-primary'}>{icon}</div>
      </div>
      <div className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${active ? 'bg-[#131321]/10 text-[#131321]' : 'bg-white/05 text-mobile-text-muted'}`}>
        WIFI
      </div>
    </div>
    <h4 className={`text-sm font-bold mb-0.5 ${active ? 'text-[#131321]' : 'text-white'}`}>{name}</h4>
    <p className={`text-[10px] ${active ? 'text-[#131321]/60' : 'text-mobile-text-muted'}`}>{count} Devices</p>
    
    <div className="flex justify-between items-center mt-6">
      <span className={`text-[10px] font-black uppercase ${active ? 'text-[#131321]' : 'text-mobile-primary'}`}>
        {active ? 'ON' : 'OFF'}
      </span>
      <div className={`w-10 h-5 rounded-full relative p-1 ${active ? 'bg-[#131321]/20' : 'bg-white/10'}`}>
        <div className={`w-3 h-3 rounded-full shadow-lg transition-transform duration-300 ${
          active ? 'bg-[#131321] translate-x-5' : 'bg-mobile-text-muted translate-x-0'
        }`} />
      </div>
    </div>
  </div>
);

export default MobileHome;
