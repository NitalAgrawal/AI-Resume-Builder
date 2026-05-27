import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import toast from "react-hot-toast";
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Target, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  FileText,
  Upload,
  BarChart3,
  Search
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

const CircularProgress = ({ score, size = "large" }) => {
  const radius = size === "large" ? 70 : 30;
  const strokeWidth = size === "large" ? 12 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className={size === "large" ? "w-48 h-48 transform -rotate-90" : "w-20 h-20 transform -rotate-90"}>
        <circle
          cx={size === "large" ? "96" : "40"}
          cy={size === "large" ? "96" : "40"}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx={size === "large" ? "96" : "40"}
          cy={size === "large" ? "96" : "40"}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${
            score >= 80 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-rose-500"
          }`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`${size === "large" ? "text-5xl" : "text-lg"} font-bold ${
          score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-rose-600"
        }`}>
          {score}%
        </span>
      </div>
    </div>
  );
};

const MetricBar = ({ label, score }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{score}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${
          score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
        }`}
      />
    </div>
  </div>
);

const AtsChecker = () => {
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [inputType, setInputType] = useState("text"); // 'text' or 'file'
  const { token } = useSelector((state) => state.auth);

  const handleCheckATS = async (e) => {
    e.preventDefault();
    if (inputType === "text" && !resumeText) {
      toast.error("Please provide resume text");
      return;
    }
    if (inputType === "file" && !resumeFile) {
      toast.error("Please upload a resume file");
      return;
    }
    if (!jobDescription) {
      toast.error("Please provide a job description");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (inputType === "text") {
        response = await api.post(
          "/api/ats/check",
          { resumeText, jobDescription },
          { headers: { Authorization: token } }
        );
      } else {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jobDescription", jobDescription);
        response = await api.post(
          "/api/ats/check-file",
          formData,
          { headers: { Authorization: token } }
        );
      }
      setResult(response.data);
      toast.success("ATS Analysis completed!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to check ATS score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Advanced ATS <span className="text-[#14805F]">Optimizer</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Get a professional-grade analysis of how well your resume matches the job requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Search className="size-5 text-[#14805F]" />
                Resume Input
              </h2>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setInputType("text")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${inputType === "text" ? "bg-white text-[#14805F] shadow-sm" : "text-slate-500"}`}
                >
                  Paste Text
                </button>
                <button 
                  onClick={() => setInputType("file")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${inputType === "file" ? "bg-white text-[#14805F] shadow-sm" : "text-slate-500"}`}
                >
                  Upload File
                </button>
              </div>
            </div>

            <form onSubmit={handleCheckATS} className="space-y-6">
              <AnimatePresence mode="wait">
                {inputType === "text" ? (
                  <motion.div 
                    key="text-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Resume Text</label>
                    <textarea
                      className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all resize-none bg-slate-50/50"
                      placeholder="Paste your resume content here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="file-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf,.docx,.doc"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${resumeFile ? "border-[#38B487] bg-[#EAF7F3]/30" : "border-slate-200 group-hover:border-[#38B487] group-hover:bg-[#EAF7F3]/30"}`}>
                        {resumeFile ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="size-10 text-[#14805F]" />
                            <p className="text-sm font-bold text-[#14805F] truncate max-w-full">{resumeFile.name}</p>
                            <button type="button" onClick={() => setResumeFile(null)} className="text-xs text-rose-500 font-bold hover:underline">Change File</button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="size-10 text-slate-400 group-hover:text-[#14805F]" />
                            <p className="text-sm font-medium text-slate-600">Click or drag to upload PDF/DOCX</p>
                            <p className="text-xs text-slate-400">Max size 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Description</label>
                <textarea
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all resize-none bg-slate-50/50"
                  placeholder="Paste the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#14805F] text-white rounded-xl font-bold text-lg hover:bg-[#0E5C49] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-md shadow-[#6ED6B3]/10"
              >
                {loading ? (
                  <><Loader2 className="animate-spin size-6" /><span>Analyzing...</span></>
                ) : (
                  <><Zap className="size-6 fill-white" /><span>Analyze Match Score</span></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="bg-white border border-slate-200 rounded-2xl h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <BarChart3 className="size-16 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-400 tracking-tight">Ready for AI Analysis</h3>
              <p className="text-slate-400 max-w-sm mt-3 leading-relaxed">
                Provide your resume and the job description to see how you rank and where you can improve.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center h-full min-h-[500px] space-y-8">
              <div className="relative">
                <div className="size-32 border-4 border-[#EAF7F3] border-t-[#38B487] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="size-12 text-[#14805F] animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900">Scanning Resume...</h3>
                <p className="text-slate-500 mt-2">Our AI is parsing your experience and matching keywords.</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8">
                <CircularProgress score={result.ats_score} />
                <div className="flex-1 text-center md:text-left space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Overall Match Score</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {result.ats_score >= 80 ? "Perfect! Your resume is highly optimized for this role." : result.ats_score >= 60 ? "Good, but some key areas are missing." : "Strong adjustments needed to pass initial ATS filters."}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    <span className="px-3 py-1 bg-[#EAF7F3] text-[#14805F] rounded-full text-xs font-bold border border-[#6ED6B3]/25 flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Structure Validated
                    </span>
                    <span className="px-3 py-1 bg-[#EAF7F3] text-[#14805F] rounded-full text-xs font-bold border border-[#6ED6B3]/25 flex items-center gap-1">
                      <Info className="size-3" /> Keyword Scan Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Match Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <MetricBar label="Keyword Match" score={result.metrics.keywordMatch} />
                  <MetricBar label="Skills Relevance" score={result.metrics.skillsRelevance} />
                  <MetricBar label="Experience Match" score={result.metrics.experienceRelevance} />
                  <MetricBar label="Readability" score={result.metrics.readability} />
                  <MetricBar label="Formatting" score={result.metrics.formatting} />
                  <MetricBar label="Action Verbs" score={result.metrics.actionVerbs} />
                </div>
              </div>

              {/* Keywords & Feedback Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="size-4 text-amber-500" />
                    Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-100 hover:bg-amber-50 hover:border-amber-100 transition-colors cursor-default">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="size-4 text-[#38B487]" />
                    Improvement Suggestions
                  </h4>
                  <ul className="space-y-3">
                    {result.suggestions.slice(0, 3).map((s, i) => (
                      <li key={i} className="flex gap-3 text-xs text-slate-600 leading-relaxed">
                        <div className="mt-1 size-1.5 rounded-full bg-[#6ED6B3] flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                 <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                    <button className="text-sm font-bold text-[#14805F] border-b-2 border-[#14805F] pb-4 -mb-[18px]">Strengths</button>
                    <button className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Weaknesses</button>
                 </div>
                 <div className="space-y-3">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#EAF7F3]/50 border border-[#EAF7F3] rounded-xl">
                        <CheckCircle2 className="size-4 text-[#14805F]" />
                        <span className="text-sm text-slate-700 font-medium">{s}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtsChecker;
