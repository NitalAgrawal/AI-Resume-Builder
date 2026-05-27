import { TrendingUp, TrendingDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "indigo" }) => {
  const colors = {
    indigo: "bg-[#EAF7F3] text-[#14805F] border-[#6ED6B3]/20",
    emerald: "bg-[#EAF7F3] text-[#38B487] border-[#6ED6B3]/20",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    purple: "bg-[#EAF7F3] text-[#0E5C49] border-[#6ED6B3]/20",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl border", colors[color])}>
          <Icon className="size-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          )}>
            {trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trendValue}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
