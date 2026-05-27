import { FileText, ShieldCheck, Sparkles, UserCircle } from "lucide-react";

const activities = [
  {
    id: 1,
    type: 'create',
    title: 'Resume Created',
    desc: 'Software Engineer Resume updated',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-[#14805F]',
    bg: 'bg-[#EAF7F3]'
  },
  {
    id: 2,
    type: 'ats',
    title: 'ATS Check Completed',
    desc: 'Score: 85% for Senior Dev position',
    time: '5 hours ago',
    icon: ShieldCheck,
    color: 'text-[#38B487]',
    bg: 'bg-[#EAF7F3]'
  },
  {
    id: 3,
    type: 'ai',
    title: 'AI Suggestions Applied',
    desc: 'Professional summary enhanced',
    time: '1 day ago',
    icon: Sparkles,
    color: 'text-[#0E5C49]',
    bg: 'bg-[#EAF7F3]'
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className={`size-10 rounded-xl ${activity.bg} flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`size-5 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{activity.title}</p>
                <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{activity.time}</span>
              </div>
              <p className="text-xs text-slate-500 truncate">{activity.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-8 py-2.5 text-sm font-semibold text-[#14805F] hover:bg-[#EAF7F3]/50 rounded-xl transition-all duration-200">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivity;
