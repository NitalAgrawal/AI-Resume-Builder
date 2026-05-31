import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  Copy,
  BookmarkPlus,
  Loader2,
  FileText,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const CoverLetter = () => {
  // Form state
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [selectedResumeId, setSelectedResumeId] = useState("");

  // Data state
  const [resumes, setResumes] = useState([]);
  const [generatedContent, setGeneratedContent] = useState("");

  // UI state
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);

  // Fetch user resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get("/api/users/resumes", {
          headers: { Authorization: token },
        });
        setResumes(data.resumes || []);
      } catch (error) {
        toast.error("Failed to load resumes");
      } finally {
        setResumesLoading(false);
      }
    };
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate cover letter
  const handleGenerate = async () => {
    if (!jobTitle.trim()) return toast.error("Please enter a job title");
    if (!companyName.trim()) return toast.error("Please enter a company name");
    if (!jobDescription.trim()) return toast.error("Please enter a job description");
    if (!selectedResumeId) return toast.error("Please select a resume");

    setGenerating(true);
    setGeneratedContent("");
    setSaved(false);

    try {
      // Fetch full resume data
      const { data: resumeRes } = await api.get(`/api/resumes/get/${selectedResumeId}`, {
        headers: { Authorization: token },
      });

      const resumeData = resumeRes.resume || resumeRes;

      const { data } = await api.post(
        "/api/cover-letter/generate",
        {
          resumeData: {
            personal_info: resumeData.personal_info,
            professional_summary: resumeData.professional_summary,
            experience: resumeData.experience,
            skills: resumeData.skills,
            education: resumeData.education,
          },
          jobTitle,
          companyName,
          jobDescription,
          tone,
        },
        { headers: { Authorization: token } }
      );

      if (data.success && data.coverLetter) {
        setGeneratedContent(data.coverLetter);
        toast.success("Cover letter generated!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Save cover letter
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.post(
        "/api/cover-letter/save",
        {
          jobTitle,
          companyName,
          jobDescription,
          tone,
          content: generatedContent,
          resumeId: selectedResumeId || undefined,
          title: `Cover Letter — ${jobTitle} at ${companyName}`,
        },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setSaved(true);
        toast.success("Cover letter saved!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to save cover letter");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          AI Cover Letter <span className="text-[#14805F]">Generator</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Create a tailored, professional cover letter powered by AI — matched to your resume and the job you're applying for.
        </p>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel — Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Sparkles className="size-5 text-[#14805F]" />
              Job Details
            </h2>

            <div className="space-y-5">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all bg-slate-50/50"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all bg-slate-50/50"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all resize-none bg-slate-50/50"
                />
              </div>

              {/* Tone Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tone
                </label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all bg-slate-50/50 appearance-none cursor-pointer"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="confident">Confident</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Resume Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Resume
                </label>
                <div className="relative">
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    disabled={resumesLoading}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all bg-slate-50/50 appearance-none cursor-pointer disabled:opacity-60"
                  >
                    <option value="">
                      {resumesLoading ? "Loading resumes..." : "Choose a resume"}
                    </option>
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title || "Untitled Resume"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-4 bg-[#14805F] text-white rounded-xl font-bold text-lg hover:bg-[#0E5C49] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-md shadow-[#6ED6B3]/10"
              >
                {generating ? (
                  <>
                    <Loader2 className="animate-spin size-6" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="size-6" />
                    <span>Generate Cover Letter</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel — Output Preview */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            {/* Empty State */}
            {!generatedContent && !generating && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200 rounded-2xl h-full min-h-[560px] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <FileText className="size-16 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-400 tracking-tight">
                  Your cover letter will appear here...
                </h3>
                <p className="text-slate-400 max-w-sm mt-3 leading-relaxed">
                  Fill in the job details, select your resume, and click Generate to create a tailored cover letter.
                </p>
              </motion.div>
            )}

            {/* Loading State */}
            {generating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center h-full min-h-[560px] space-y-8"
              >
                <div className="relative">
                  <div className="size-32 border-4 border-[#EAF7F3] border-t-[#38B487] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wand2 className="size-12 text-[#14805F] animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">Crafting Your Letter...</h3>
                  <p className="text-slate-500 mt-2">
                    AI is tailoring your cover letter to match the job description.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Generated Output */}
            {generatedContent && !generating && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Saved Banner */}
                <AnimatePresence>
                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#EAF7F3] border border-[#6ED6B3]/40 rounded-xl px-5 py-3 flex items-center gap-3"
                    >
                      <CheckCircle2 className="size-5 text-[#14805F] flex-shrink-0" />
                      <span className="text-sm font-semibold text-[#14805F]">
                        Saved to your Cover Letters!
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cover Letter Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Card Header */}
                  <div className="px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-[#EAF7F3]/60 to-white flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {jobTitle} — {companyName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 capitalize">
                        Tone: {tone}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-[#EAF7F3] text-[#14805F] rounded-full text-xs font-bold border border-[#6ED6B3]/25 flex items-center gap-1">
                      <Wand2 className="size-3" />
                      AI Generated
                    </div>
                  </div>

                  {/* Cover Letter Content */}
                  <div className="px-8 py-6">
                    <div className="prose prose-slate prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-slate-700 font-[system-ui]">
                      {generatedContent}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="size-5 text-[#14805F]" />
                        <span className="text-[#14805F]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-5" />
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-[#14805F] text-white font-bold rounded-xl hover:bg-[#0E5C49] transition-all shadow-md shadow-[#6ED6B3]/10 disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin size-5" />
                        <span>Saving...</span>
                      </>
                    ) : saved ? (
                      <>
                        <CheckCircle2 className="size-5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="size-5" />
                        <span>Save Cover Letter</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
