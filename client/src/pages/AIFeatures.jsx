import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import toast from "react-hot-toast";
import { 
  Sparkles, 
  Zap, 
  MessageSquare, 
  Lightbulb, 
  Search,
  ArrowRight,
  Target,
  FileText,
  Loader2,
  Code2,
  Briefcase
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState("improve");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { token } = useSelector((state) => state.auth);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [techStack, setTechStack] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const handleAIAction = async (action) => {
    setLoading(true);
    setResult(null);
    try {
      let endpoint = "";
      let payload = {};

      switch (action) {
        case "project":
          endpoint = "/api/ai/generate-project-desc";
          payload = { projectName, projectType, techStack };
          break;
        case "interview":
          endpoint = "/api/ai/generate-interview-questions";
          payload = { jobTitle, resumeData: {} }; // For demo, using empty resume data
          break;
        // Add other cases as needed
        default:
          break;
      }

      const { data } = await api.post(endpoint, payload, {
        headers: { Authorization: token },
      });
      setResult(data);
      toast.success("AI Generation complete!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "improve", label: "Resume Optimizer", icon: Sparkles, desc: "Enhance your resume sections with AI." },
    { id: "project", label: "Project Generator", icon: Code2, desc: "Generate professional project descriptions." },
    { id: "interview", label: "Interview Prep", icon: MessageSquare, desc: "Get custom interview questions." },
    { id: "matching", label: "Job Matcher", icon: Target, desc: "See how well you fit a specific job." },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-[#14805F] rounded-lg">
              <Sparkles className="text-white size-6" />
            </div>
            AI Career Suite
          </h1>
          <p className="text-slate-500 font-medium">Power up your job search with our advanced AI tools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); }}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 border ${
                activeTab === tab.id 
                  ? "bg-[#14805F] border-[#14805F] text-white shadow-lg shadow-[#6ED6B3]/15" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-[#6ED6B3]/40 hover:bg-[#EAF7F3]/40"
              }`}
            >
              <tab.icon className={`size-5 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`} />
              <div className="text-left">
                <p className="text-sm font-bold">{tab.label}</p>
                <p className={`text-[10px] ${activeTab === tab.id ? "text-[#EAF7F3]" : "text-slate-400"}`}>Ready to use</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">{tabs.find(t => t.id === activeTab).label}</h3>
                <p className="text-slate-500 text-sm mt-1">{tabs.find(t => t.id === activeTab).desc}</p>
              </div>

              <div className="p-8">
                {activeTab === "project" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Project Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. E-commerce API" 
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Project Type</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Full Stack Web App" 
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Tech Stack (comma separated)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. React, Node.js, MongoDB, Redis" 
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => handleAIAction("project")}
                      disabled={loading || !projectName}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-[#14805F] text-white rounded-xl font-bold hover:bg-[#0E5C49] transition-all disabled:opacity-50 shadow-md shadow-[#6ED6B3]/10"
                    >
                      {loading ? <Loader2 className="animate-spin size-5" /> : <Zap className="size-5 fill-white" />}
                      Generate Professional Description
                    </button>
                  </div>
                )}

                {activeTab === "interview" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Target Job Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Senior Frontend Engineer" 
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => handleAIAction("interview")}
                      disabled={loading || !jobTitle}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-[#14805F] text-white rounded-xl font-bold hover:bg-[#0E5C49] transition-all disabled:opacity-50 shadow-md shadow-[#6ED6B3]/10"
                    >
                      {loading ? <Loader2 className="animate-spin size-5" /> : <MessageSquare className="size-5" />}
                      Generate Interview Questions
                    </button>
                  </div>
                )}

                {(activeTab === "improve" || activeTab === "matching") && (
                  <div className="py-12 text-center space-y-4">
                    <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Briefcase className="text-slate-400 size-8" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Please select a resume first</h4>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">These features require an active resume to be selected from your dashboard.</p>
                    <button className="text-[#14805F] font-bold hover:text-[#38B487] hover:underline">Go to Dashboard</button>
                  </div>
                )}
 
                {/* Result Display */}
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 pt-8 border-t border-slate-100"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Generated Result</h4>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                      {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                    </div>
                    <button className="mt-4 flex items-center gap-2 text-[#14805F] font-bold text-sm hover:text-[#38B487] hover:underline">
                      Copy to Clipboard <ArrowRight className="size-4" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;
