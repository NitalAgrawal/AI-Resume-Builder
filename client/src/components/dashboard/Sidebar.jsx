import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  History, 
  Settings, 
  LogOut,
  UserCircle
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/features/authSlice";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
    { icon: FileText, label: "My Resumes", path: "/app/resumes" },
    { icon: ShieldCheck, label: "ATS Checker", path: "/app/ats-checker" },
    { icon: FileText, label: "Cover Letters", path: "/app/cover-letters" },
    { icon: Sparkles, label: "AI Tools", path: "/app/ai-tools" },
    { icon: History, label: "History", path: "/app/history" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 bg-[#14805F] rounded-lg flex items-center justify-center">
            <Sparkles className="text-white size-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ResumeAI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-[#EAF7F3] text-[#14805F] shadow-sm shadow-[#6ED6B3]/10" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("size-5", isActive ? "text-[#14805F]" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="size-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <UserCircle className="size-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-900 truncate">{user?.name}</span>
            <span className="text-xs text-slate-500 truncate">{user?.email}</span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all duration-200"
        >
          <LogOut className="size-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
