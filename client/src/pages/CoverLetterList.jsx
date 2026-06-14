import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../configs/api.js";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Eye,
  Copy,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Wand2,
  Calendar,
  RefreshCw,
  Search,
} from "lucide-react";

// Tone badge config
const toneBadge = {
  professional: { bg: "bg-[#EAF7F3]", text: "text-[#14805F]", border: "border-[#6ED6B3]/25" },
  friendly: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200/50" },
  confident: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200/50" },
};

const ToneBadge = ({ tone }) => {
  const style = toneBadge[tone] || toneBadge.professional;
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border capitalize ${style.bg} ${style.text} ${style.border}`}>
      {tone}
    </span>
  );
};

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
      </div>
      <div className="h-6 bg-slate-100 rounded-full w-20" />
    </div>
    <div className="space-y-2 mb-5">
      <div className="h-3 bg-slate-50 rounded w-full" />
      <div className="h-3 bg-slate-50 rounded w-5/6" />
      <div className="h-3 bg-slate-50 rounded w-2/3" />
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <div className="h-3 bg-slate-100 rounded w-24" />
      <div className="flex gap-2">
        <div className="size-8 bg-slate-100 rounded-lg" />
        <div className="size-8 bg-slate-100 rounded-lg" />
        <div className="size-8 bg-slate-100 rounded-lg" />
      </div>
    </div>
  </div>
);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const CoverLetterList = () => {
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewModal, setViewModal] = useState(null); // holds the cover letter to view
  const [copiedId, setCopiedId] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My Cover Letters — Resunova";
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchAll = async () => {
    try {
      setError(false);
      setLoading(true);
      const { data } = await api.get("/api/cover-letter/all", {
        headers: { Authorization: token },
      });
      setCoverLetters(data.coverLetters || []);
    } catch {
      toast.error("Failed to load cover letters");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all cover letters
  useEffect(() => {
    if (token) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Delete a cover letter
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cover letter?")) return;
    try {
      await api.delete(`/api/cover-letter/${id}`, {
        headers: { Authorization: token },
      });
      setCoverLetters((prev) => prev.filter((cl) => cl._id !== id));
      toast.success("Deleted successfully");
      if (viewModal?._id === id) setViewModal(null);
    } catch {
      toast.error("Failed to delete. Please try again.");
    }
  };

  // Copy to clipboard
  const handleCopy = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const filteredAndSorted = [...coverLetters]
    .filter(cl => 
      cl.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cl.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "a-z") return a.companyName.localeCompare(b.companyName);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="size-8 text-[#14805F]" />
            My Cover Letters
          </h1>
          <p className="text-slate-500 mt-1">
            All your AI-generated cover letters in one place.
          </p>
        </div>
        <button
          onClick={() => navigate("/app/cover-letter")}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#14805F] text-white font-semibold rounded-xl hover:bg-[#0E5C49] transition-all shadow-md shadow-[#6ED6B3]/10"
        >
          <Plus className="size-4" />
          New Cover Letter
        </button>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-16 text-center"
        >
          <div className="bg-rose-50 p-6 rounded-full mb-4">
            <RefreshCw className="size-16 text-rose-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Failed to load</h3>
          <p className="text-slate-500 max-w-sm mt-3 leading-relaxed mb-6">There was an error loading your cover letters. Please try again.</p>
          <button onClick={fetchAll} className="flex items-center gap-2 px-6 py-3 bg-[#14805F] text-white font-bold rounded-xl hover:bg-[#0E5C49] transition-all shadow-md">
            <RefreshCw className="size-5" /> Retry
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {!error && !loading && coverLetters.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-16 text-center"
        >
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <FileText className="size-16 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-400 tracking-tight">
            No cover letters yet
          </h3>
          <p className="text-slate-400 max-w-sm mt-3 leading-relaxed">
            Generate your first one! Our AI will craft a tailored cover letter matched to your resume.
          </p>
          <button
            onClick={() => navigate("/app/cover-letter")}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-[#14805F] text-white font-bold rounded-xl hover:bg-[#0E5C49] transition-all shadow-md shadow-[#6ED6B3]/10"
          >
            <Wand2 className="size-5" />
            Generate Cover Letter
          </button>
        </motion.div>
      )}

      {/* Search and Sort */}
      {!error && !loading && coverLetters.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#38B487] focus:border-[#38B487] outline-none transition-all bg-white appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A-Z by Company</option>
            </select>
          </div>
        </div>
      )}

      {/* Cover Letters Grid */}
      {!error && !loading && coverLetters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((cl, index) => (
            <motion.div
              key={cl._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#6ED6B3]/40 transition-all p-6 flex flex-col"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {cl.companyName}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {cl.jobTitle}
                  </p>
                </div>
                <ToneBadge tone={cl.tone} />
              </div>

              {/* Preview Text */}
              <p className="text-xs text-slate-500 leading-relaxed flex-1 mb-4">
                {cl.content && cl.content.length > 120
                  ? cl.content.substring(0, 120) + "..."
                  : cl.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Calendar className="size-3" />
                  {formatDate(cl.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  {/* View */}
                  <button
                    onClick={() => setViewModal(cl)}
                    className="p-2 text-slate-400 hover:text-[#14805F] hover:bg-[#EAF7F3] rounded-lg transition-all"
                    title="View"
                  >
                    <Eye className="size-4" />
                  </button>
                  {/* Copy */}
                  <button
                    onClick={() => handleCopy(cl.content, cl._id)}
                    className="p-2 text-slate-400 hover:text-[#14805F] hover:bg-[#EAF7F3] rounded-lg transition-all"
                    title="Copy"
                  >
                    {copiedId === cl._id ? (
                      <CheckCircle2 className="size-4 text-[#14805F]" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(cl._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full View Modal */}
      <AnimatePresence>
        {viewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setViewModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-[#EAF7F3]/60 to-white flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-900 truncate">
                    {viewModal.jobTitle}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {viewModal.companyName}
                  </p>
                  <div className="mt-2">
                    <ToneBadge tone={viewModal.tone} />
                  </div>
                </div>
                <button
                  onClick={() => setViewModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all flex-shrink-0"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6 overflow-y-auto flex-1">
                <div className="prose prose-slate prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-slate-700">
                  {viewModal.content}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleCopy(viewModal.content, viewModal._id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                >
                  {copiedId === viewModal._id ? (
                    <>
                      <CheckCircle2 className="size-4 text-[#14805F]" />
                      <span className="text-[#14805F]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setViewModal(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoverLetterList;
