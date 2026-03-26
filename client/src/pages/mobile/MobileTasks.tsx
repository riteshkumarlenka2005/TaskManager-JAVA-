import React from 'react';
import { Plus, CheckCircle2, Circle, Clock, Tag } from 'lucide-react';

const MobileTasks: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <button className="w-12 h-12 rounded-2xl bg-mobile-primary flex items-center justify-center text-[#131321] shadow-[0_8px_20px_rgba(70,240,210,0.3)]">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <TaskCard 
          title="Review Backend API" 
          priority="high" 
          time="09:00 AM" 
          done 
        />
        <TaskCard 
          title="UI/UX Implementation" 
          priority="medium" 
          time="11:30 AM" 
        />
        <TaskCard 
          title="Security Patch Deploy" 
          priority="high" 
          time="02:00 PM" 
        />
        <TaskCard 
          title="Team Sync" 
          priority="low" 
          time="04:30 PM" 
        />
      </div>

      {/* Placeholder for more */}
      <div className="mobile-panel bg-white/[0.02] border-dashed border-white/10 text-center py-10">
        <p className="text-mobile-text-muted text-xs">You've reached the end of today's missions.</p>
      </div>
    </div>
  );
};

const TaskCard = ({ title, priority, time, done }: { title: string, priority: string, time: string, done?: boolean }) => (
  <div className={`mobile-panel flex items-center gap-4 transition-all ${
    done ? 'opacity-50' : ''
  }`}>
    <button className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
      done ? 'bg-mobile-primary border-mobile-primary text-[#131321]' : 'border-white/10 text-transparent'
    }`}>
      {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
    </button>
    
    <div className="flex-1">
      <h4 className={`text-sm font-bold mb-1 ${done ? 'line-through text-mobile-text-muted' : 'text-white'}`}>{title}</h4>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[10px] text-mobile-text-muted font-medium">
          <Clock className="w-3 h-3" /> {time}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
          priority === 'high' ? 'text-rose-400' : priority === 'medium' ? 'text-amber-400' : 'text-mobile-primary'
        }`}>
          <Tag className="w-3 h-3" /> {priority}
        </div>
      </div>
    </div>
  </div>
);

export default MobileTasks;
