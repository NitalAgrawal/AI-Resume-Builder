import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOff,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
  Award,
  Loader2,
} from "lucide-react";
import { useDownloadPDF } from "../hooks/useDownloadPDF";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import CertificationForm from "../components/CertificationForm";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3b82f6",
    public: false,
  });
  const [activeSectionIndex, setactiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [pdfTemplate, setPdfTemplate] = useState("classic");
  const { downloadPDF, isDownloading } = useDownloadPDF(resumeId, pdfTemplate);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
    { id: "certification", name: "Certification", icon: Award },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get("/api/resumes/get/" + resumeId, {
        headers: { Authorization: token },
      });

      if (data.resume) {
        setResumeData(prev => ({
          ...prev,
          ...data.resume,
          personal_info: data.resume.personal_info || {},
          experience: data.resume.experience || [],
          education: data.resume.education || [],
          project: data.resume.project || [],
          skills: data.resume.skills || [],
          certification: data.resume.certification || [],
          professional_summary: data.resume.professional_summary || "",
        }));
        document.title = data.resume.title || "Resume Builder";
      }
    } catch (error) {
      console.error("Error loading resume:", error);
    }
  };

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: { Authorization: token },
      });

      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving visibility:", error);
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, title: "My Resume", text: "Check out my resume!" });
    } else {
      navigator.clipboard.writeText(resumeUrl);
      toast.success("Resume link copied to clipboard!");
    }
  };

  const saveResume = async (manual = false) => {
    if (!manual) setIsSaving(true);
    try {
      let updatedResumeData = structuredClone(resumeData);

      if (typeof resumeData?.personal_info?.image === "object") {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) formData.append("removeBackground", "yes");
      if (typeof resumeData?.personal_info?.image === "object") {
        formData.append("image", resumeData.personal_info.image);
      }

      await api.put("/api/resumes/update", formData, {
        headers: { Authorization: token },
      });

      if (manual) toast.success("Resume saved!");
    } catch (error) {
      console.error("Error saving resume:", error);
      if (manual) toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced Auto-save
  useEffect(() => {
    if (!resumeData._id) return; // Don't save on initial load
    const timeout = setTimeout(() => {
      saveResume();
    }, 3000);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData]);

  useEffect(() => {
    loadExistingResume();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDataUpdate = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/app" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeftIcon className="size-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{resumeData.title}</h1>
             <div className="flex items-center gap-2">
                {isSaving ? (
                  <span className="text-[10px] text-[#14805F] font-medium flex items-center gap-1">
                    <div className="size-1.5 bg-[#14805F] rounded-full animate-pulse" />
                    Saving changes...
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">All changes saved</span>
                )}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {resumeData.public && (
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <Share2Icon className="size-4" /> Share
            </button>
          )}
          <button onClick={changeResumeVisibility} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOff className="size-4" />}
            {resumeData.public ? "Public" : "Private"}
          </button>
          
          <div className="flex items-center ml-2 border-l border-slate-200 pl-4 gap-2">
             <select
               value={pdfTemplate}
               onChange={(e) => setPdfTemplate(e.target.value)}
               className="px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#38B487]"
             >
               <option value="classic">Classic</option>
               <option value="modern">Modern</option>
               <option value="minimal">Minimal</option>
             </select>
             <button 
               onClick={() => downloadPDF()} 
               disabled={isDownloading}
               className="flex items-center gap-2 px-6 py-2 bg-[#14805F] text-white font-semibold rounded-xl hover:bg-[#0E5C49] transition-all shadow-md shadow-[#6ED6B3]/10 disabled:opacity-70 disabled:cursor-not-allowed min-w-[170px] justify-center"
             >
               {isDownloading ? <Loader2 className="size-4 animate-spin" /> : <DownloadIcon className="size-4" />}
               {isDownloading ? "Generating PDF..." : "Download PDF"}
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Side: Forms */}
        <div className="w-1/2 overflow-y-auto p-8 border-r border-slate-200">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Template & Color */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) => handleDataUpdate('template', template)}
                />
                <div className="h-6 w-px bg-slate-200 mx-2" />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) => handleDataUpdate('accent_color', color)}
                />
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  disabled={activeSectionIndex === 0}
                  onClick={() => setactiveSectionIndex(p => Math.max(0, p - 1))}
                  className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <span className="text-xs font-bold text-slate-400 min-w-[60px] text-center">
                  {activeSectionIndex + 1} / {sections.length}
                </span>
                <button
                  disabled={activeSectionIndex === sections.length - 1}
                  onClick={() => setactiveSectionIndex(p => Math.min(sections.length - 1, p + 1))}
                  className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[500px]">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-[#EAF7F3] text-[#14805F] rounded-xl">
                  <activeSection.icon className="size-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{activeSection.name}</h2>
              </div>

              {activeSection.id === "personal" && (
                <PersonalInfoForm
                  data={resumeData.personal_info}
                  onChange={(data) => handleDataUpdate('personal_info', data)}
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                />
              )}
              {activeSection.id === "summary" && (
                <ProfessionalSummaryForm
                  data={resumeData.professional_summary}
                  onChange={(data) => handleDataUpdate('professional_summary', data)}
                  setResumeDate={setResumeData}
                />
              )}
              {activeSection.id === "experience" && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) => handleDataUpdate('experience', data)}
                />
              )}
              {activeSection.id === "education" && (
                <EducationForm
                  data={resumeData.education}
                  onChange={(data) => handleDataUpdate('education', data)}
                />
              )}
              {activeSection.id === "projects" && (
                <ProjectForm
                  data={resumeData.project}
                  onChange={(data) => handleDataUpdate('project', data)}
                />
              )}
              {activeSection.id === "skills" && (
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(data) => handleDataUpdate('skills', data)}
                />
              )}
              {activeSection.id === "certification" && (
                <CertificationForm
                  data={resumeData.certification}
                  onChange={(data) => handleDataUpdate('certification', data)}
                />
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
               <p className="text-xs text-slate-400">
                 Tip: You can also edit directly on the resume preview!
               </p>
               <button
                 onClick={() => {
                   toast.promise(saveResume(true), { 
                     loading: "Saving...",
                     success: "Saved!",
                     error: "Failed to save"
                   });
                 }}
                 className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
               >
                 Save Now
               </button>
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Preview */}
        <div className="w-1/2 bg-slate-200/50 overflow-y-auto flex justify-center py-12 px-8">
          <div className="w-full max-w-[800px] shadow-2xl h-fit">
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
              isEditable={true}
              onUpdate={(field, val) => handleDataUpdate(field, val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
