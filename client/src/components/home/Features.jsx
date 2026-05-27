import { useState } from "react";
import { Sparkles, CheckCircle, Layers } from "lucide-react";
import Title from "./Title";

const Features = () => {
  const [activeTab, setActiveTab] = useState(0);

  const featureItems = [
    {
      icon: <Sparkles className="size-6 stroke-[#38B487]" />,
      title: "AI Resume Writer",
      description: "Generate tailored professional summaries and impact-driven work experience bullet points in seconds.",
      badge: "AI Powered"
    },
    {
      icon: <CheckCircle className="size-6 stroke-[#14805F]" />,
      title: "ATS Smart Scanner",
      description: "Analyze your resume against real job descriptions to identify keyword gaps and increase your match rate.",
      badge: "ATS Optimization"
    },
    {
      icon: <Layers className="size-6 stroke-[#0E5C49]" />,
      title: "Premium Templates",
      description: "Recruiter-approved designs crafted to maximize readability and ensure a perfect visual first impression.",
      badge: "Recruiter Friendly"
    }
  ];

  return (
    <div
      id="features"
      className="flex flex-col items-center my-24 px-4 scroll-mt-20 w-full max-w-6xl mx-auto"
    >
      <div className="flex items-center gap-2 text-sm text-[#14805F] bg-[#38B487]/10 font-bold rounded-full px-5 py-1.5 border border-[#38B487]/15 shadow-sm">
        <Sparkles width={14} className="stroke-[#38B487] animate-pulse" />
        <span>Powerfully Simple</span>
      </div>

      <Title
        title="Supercharge your job search"
        description="Our premium AI-assisted tools help you craft an outstanding resume that bypasses ATS filters and catches recruiter attention."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full mt-12">
        {/* Left Side: Dynamic Showcase Image/Mockup */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6ED6B3]/10 to-[#38B487]/10 rounded-[24px] blur-xl -z-10"></div>
          <div className="border border-[#6ED6B3]/20 bg-white/70 backdrop-blur-md p-4 rounded-[22px] shadow-[0_20px_50px_rgba(20,128,95,0.06)] hover:scale-[1.02] transition-all duration-500">
            <img
              className="rounded-[16px] max-h-[360px] object-cover"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
              alt="AI Resume Editor Mockup"
            />
          </div>
        </div>

        {/* Right Side: Elegant Feature Cards */}
        <div className="lg:col-span-6 space-y-5 w-full">
          {featureItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`p-6 border transition-all duration-300 rounded-[20px] flex gap-4 cursor-pointer text-left ${
                activeTab === idx
                  ? "bg-gradient-to-r from-[#EAF7F3] to-white border-[#38B487] shadow-[0_8px_30px_rgba(20,128,95,0.06)] scale-[1.01]"
                  : "bg-white/60 border-transparent hover:border-[#6ED6B3]/35 hover:bg-[#EAF7F3]/20 hover:scale-[1.005]"
              }`}
            >
              <div className="p-3 bg-white border border-gray-100 rounded-[14px] flex items-center justify-center h-12 w-12 shrink-0 shadow-sm">
                {item.icon}
              </div>
              <div className="space-y-1 w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-[#0E5C49]">
                    {item.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === idx
                      ? "bg-[#38B487] text-white"
                      : "bg-[#EAF7F3] text-[#14805F]"
                  }`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
    
        * {
            font-family: 'Outfit', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default Features;
