import {
  FilePenLineIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  PencilIcon,
  Sparkles,
  Zap,
  Target,
  FileText,
  ShieldCheck,
  Activity,
  ArrowRight,
  Loader2,
  DownloadIcon
} from "lucide-react";
import { useDownloadPDF } from "../hooks/useDownloadPDF";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

import StatCard from "../components/dashboard/StatCard";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import RecentActivity from "../components/dashboard/RecentActivity";

const Dashboard = () => {
  const [allResumes, setAllResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [coverLettersLoading, setCoverLettersLoading] = useState(true);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const { downloadPDF } = useDownloadPDF();

  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const loadCoverLetters = async () => {
    try {
      setCoverLettersLoading(true);
      const { data } = await api.get("/api/cover-letter/all", {
        headers: { Authorization: token },
      });
      setCoverLetters(data.coverLetters || []);
    } catch (error) {
      console.error(error);
    } finally {
      setCoverLettersLoading(false);
    }
  };

  const createResume = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } }
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please select a file to upload");
      return;
    }
    setIsLoading(true);
    try {
      const text = await pdfToText(resume);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText: text },
        { headers: { Authorization: token } }
      );
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResume = async (resumeId) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token },
        });
        setAllResumes(allResumes.filter((r) => r._id !== resumeId));
        toast.success("Resume deleted successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }
  };

  const handleDownload = async (e, id, template) => {
    e.stopPropagation();
    setDownloadingId(id);
    await downloadPDF(id, template || "classic");
    setDownloadingId(null);
  };

  useEffect(() => {
    loadAllResumes();
    loadCoverLetters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your resumes today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowUploadResume(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <UploadCloudIcon className="size-4" />
            Upload
          </button>
          <button 
            onClick={() => setShowCreateResume(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#14805F] text-white font-semibold rounded-xl hover:bg-[#0E5C49] transition-all shadow-md shadow-[#6ED6B3]/10"
          >
            <PlusIcon className="size-4" />
            Create New
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Resumes" value={allResumes.length} icon={FileText} trend="up" trendValue={12} color="indigo" />
        <StatCard title="Cover Letters" value={coverLettersLoading ? <Loader2 className="size-4 animate-spin inline-block" /> : coverLetters.length} icon={FileText} color="emerald" onClick={() => navigate('/app/cover-letters')} />
        <StatCard title="ATS Score Avg." value="78%" icon={ShieldCheck} trend="up" trendValue={5} color="emerald" />
        <StatCard title="AI Suggestions" value="24" icon={Sparkles} trend="down" trendValue={2} color="purple" />
        <StatCard title="Jobs Applied" value="12" icon={Target} trend="up" trendValue={8} color="amber" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart & Resumes */}
        <div className="lg:col-span-2 space-y-8">
          <AnalyticsChart />
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Resumes</h3>
              <button onClick={() => navigate('/app/resumes')} className="text-sm font-semibold text-[#14805F] hover:text-[#38B487] flex items-center gap-1">
                View all <ArrowRight className="size-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allResumes.slice(0, 4).map((resume) => (
                <div 
                  key={resume._id}
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                  className="group p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-[#6ED6B3]/40 hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className="size-12 bg-white rounded-lg flex items-center justify-center text-[#14805F] shadow-sm group-hover:bg-[#EAF7F3] transition-colors">
                    <FilePenLineIcon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{resume.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`flex items-center gap-1 transition-opacity ${downloadingId === resume._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <button 
                      onClick={(e) => handleDownload(e, resume._id, resume.template)}
                      className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                      title="Download PDF"
                    >
                      {downloadingId === resume._id ? (
                        <Loader2 className="size-4 animate-spin text-teal-600" />
                      ) : (
                        <DownloadIcon className="size-4 text-teal-600" />
                      )}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteResume(resume._id); }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
              {allResumes.length === 0 && (
                <div className="col-span-2 py-12 text-center">
                  <FileText className="size-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No resumes found. Create your first one!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Quick Actions */}
        <div className="space-y-8">
          <RecentActivity />
          
          <div className="bg-gradient-to-br from-[#0B3D33] to-[#0E5C49] p-6 rounded-2xl shadow-xl border border-[#38B487]/20 text-white relative overflow-hidden">
            {/* Glow accent */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#38B487]/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
              <Zap className="size-5 text-[#6ED6B3] fill-[#6ED6B3]" />
              Quick Actions
            </h3>
            <div className="space-y-3 relative z-10">
              <button 
                onClick={() => navigate('/app/ats-checker')}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/12 rounded-xl transition-all border border-white/10 hover:border-[#6ED6B3]/40"
              >
                <span className="text-sm font-medium">Run ATS Check</span>
                <ArrowRight className="size-4" />
              </button>
              <button 
                onClick={() => setShowCreateResume(true)}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/12 rounded-xl transition-all border border-white/10 hover:border-[#6ED6B3]/40"
              >
                <span className="text-sm font-medium">AI Suggestions</span>
                <ArrowRight className="size-4" />
              </button>
              <button 
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/12 rounded-xl transition-all border border-white/10 hover:border-[#6ED6B3]/40"
              >
                <span className="text-sm font-medium">Interview Prep</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cover Letters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="size-5 text-[#14805F]" />
            Recent Cover Letters
          </h3>
          <button onClick={() => navigate('/app/cover-letters')} className="text-sm font-semibold text-[#14805F] hover:text-[#38B487] flex items-center gap-1">
            View all <ArrowRight className="size-3" />
          </button>
        </div>
        
        <div className="space-y-3">
          {coverLettersLoading ? (
            <div className="text-center py-6">
              <Loader2 className="size-6 animate-spin text-[#14805F] mx-auto" />
            </div>
          ) : coverLetters.length > 0 ? (
            coverLetters.slice(0, 3).map((cl) => (
              <div 
                key={cl._id}
                onClick={() => navigate('/app/cover-letters')}
                className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-[#6ED6B3]/40 hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#14805F] transition-colors">
                    {cl.companyName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{cl.jobTitle}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(cl.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  <div className="size-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-[#EAF7F3] group-hover:border-[#6ED6B3]/30 transition-colors">
                    <ArrowRight className="size-4 text-[#14805F]" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium text-sm mb-3">No cover letters yet — Generate one now</p>
              <button 
                onClick={() => navigate('/app/cover-letter')}
                className="text-sm font-bold text-[#14805F] hover:text-[#0E5C49] flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                Generate Cover Letter <ArrowRight className="size-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Resume Modal */}
      {showCreateResume && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Resume</h2>
            <p className="text-slate-500 mb-6 text-sm">Enter a title for your professional journey.</p>
            <form onSubmit={createResume}>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer 2024"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all mb-6"
                required
              />
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateResume(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#14805F] text-white font-bold rounded-xl hover:bg-[#0E5C49] transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Resume</h2>
            <p className="text-slate-500 mb-6 text-sm">Upload an existing resume to parse with AI.</p>
            <form onSubmit={uploadResume}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Resume Title</label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer 2024"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select PDF File</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${resume ? "border-[#38B487] bg-[#EAF7F3]/30" : "border-slate-200 group-hover:border-[#38B487] group-hover:bg-[#EAF7F3]/30"}`}>
                    {resume ? (
                      <div className="flex flex-col items-center gap-1">
                        <FileText className="size-6 text-emerald-600" />
                        <p className="text-sm font-bold text-emerald-700 truncate max-w-full">{resume.name}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <UploadCloudIcon className="size-6 text-slate-400 group-hover:text-[#14805F]" />
                        <p className="text-sm font-medium text-slate-600">Click or drag to upload PDF</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowUploadResume(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#14805F] text-white font-bold rounded-xl hover:bg-[#0E5C49] transition-all flex items-center justify-center disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin size-5" /> : "Upload"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
