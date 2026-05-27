const CallToAction = () => {
  return (
    <div
      id="cta"
      className="w-full max-w-5xl mx-auto px-4 mt-32"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EAF7F3] via-white to-[#EAF7F3]/30 border border-[#6ED6B3]/25 rounded-[24px] shadow-[0_12px_40px_rgba(20,128,95,0.04)] py-16 px-8 md:px-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Glow Element */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#6ED6B3]/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#38B487]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="space-y-3 max-w-xl z-10">
          <h2 className="text-3xl font-extrabold text-[#0E5C49] tracking-tight">
            Ready to land your dream job?
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Join thousands of successful professionals who built high-impact, ATS-approved resumes with our smart assistant.
          </p>
        </div>

        <a
          href="/app"
          className="z-10 flex items-center gap-2 rounded-full py-4 px-8 bg-gradient-to-r from-[#14805F] to-[#38B487] hover:from-[#0E5C49] hover:to-[#14805F] text-white font-semibold shadow-[0_6px_20px_rgba(20,128,95,0.2)] hover:shadow-[0_8px_25px_rgba(14,92,73,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span>Get Started Free</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
