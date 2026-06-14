import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);



  return (
    <>
      <div className="min-h-screen pb-20 bg-gradient-to-b from-[#EAF7F3] via-white to-white relative overflow-hidden">
        {/* Background Glow Blobs */}
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#6ED6B3]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[25%] right-[-10%] w-[40%] h-[40%] bg-[#38B487]/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[5%] left-[15%] w-[35%] h-[35%] bg-[#EAF7F3]/80 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Navbar */}
        <div className="px-4 md:px-6 pt-6">
          <nav className="z-50 flex items-center justify-between w-full max-w-6xl mx-auto py-3 px-6 md:px-8 bg-[#0E5C49]/95 backdrop-blur-md rounded-full shadow-[0_12px_40px_rgba(14,92,73,0.12)] border border-[#38B487]/20 text-white text-sm transition-all duration-300">
            <a href="/" className="hover:scale-[1.02] transition-transform duration-300">
              <img src="/logo.svg" alt="logo" className="h-9 w-auto brightness-0 invert" />
            </a>

            <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-100 font-medium">
              <a href="#" className="hover:text-[#6ED6B3] transition-colors duration-200">
                Home
              </a>
              <a href="#features" className="hover:text-[#6ED6B3] transition-colors duration-200">
                Features
              </a>
              <a href="#testimonials" className="hover:text-[#6ED6B3] transition-colors duration-200">
                Testimonials
              </a>
              <a href="#cta" className="hover:text-[#6ED6B3] transition-colors duration-200">
                Contact
              </a>
            </div>

            <div className="flex gap-3">
              <Link
                to="/app?state=register"
                className="hidden md:block px-6 py-2 bg-gradient-to-r from-[#38B487] to-[#14805F] hover:from-[#6ED6B3] hover:to-[#38B487] active:scale-95 transition-all duration-300 rounded-full text-white font-medium shadow-[0_4px_14px_rgba(56,180,135,0.25)] hover:shadow-[0_4px_20px_rgba(110,214,179,0.35)]"
                hidden={user}
              >
                Get started
              </Link>
              <Link
                to="/app?state=login"
                className="hidden md:block px-6 py-2 border border-[#6ED6B3]/40 hover:bg-[#6ED6B3]/10 hover:border-[#6ED6B3] active:scale-95 transition-all duration-300 rounded-full text-[#EAF7F3] font-medium"
                hidden={user}
              >
                Login
              </Link>
              <Link
                to="/app"
                className="hidden md:block px-7 py-2 bg-gradient-to-r from-[#38B487] to-[#14805F] hover:from-[#6ED6B3] hover:to-[#38B487] active:scale-95 transition-all duration-300 rounded-full text-white font-medium shadow-[0_4px_14px_rgba(56,180,135,0.25)]"
                hidden={!user}
              >
                Dashboard
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden active:scale-90 transition p-1 hover:text-[#6ED6B3]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="lucide lucide-menu"
              >
                <path d="M4 5h16M4 12h16M4 19h16" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-100 bg-[#0E5C49]/98 text-white backdrop-blur-lg flex flex-col items-center justify-center text-xl gap-8 md:hidden transition-transform duration-500 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <a href="/" onClick={() => setMenuOpen(false)} className="hover:text-[#6ED6B3] transition-colors">
            Home
          </a>
          <a href="#features" onClick={() => setMenuOpen(false)} className="hover:text-[#6ED6B3] transition-colors">
            Features
          </a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)} className="hover:text-[#6ED6B3] transition-colors">
            Testimonials
          </a>
          <a href="#cta" onClick={() => setMenuOpen(false)} className="hover:text-[#6ED6B3] transition-colors">
            Contact
          </a>
          <div className="flex flex-col gap-4 w-64 mt-4">
            <Link
              to="/app?state=register"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 bg-[#38B487] text-center rounded-full text-white font-medium shadow-md shadow-[#38B487]/20"
              hidden={user}
            >
              Get started
            </Link>
            <Link
              to="/app?state=login"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 border border-[#6ED6B3]/40 text-center rounded-full text-white font-medium"
              hidden={user}
            >
              Login
            </Link>
            <Link
              to="/app"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-3 bg-[#38B487] text-center rounded-full text-white font-medium"
              hidden={!user}
            >
              Dashboard
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 active:scale-90 transition aspect-square size-10 items-center justify-center bg-[#14805F] hover:bg-[#38B487] transition-all text-white rounded-full flex border border-[#6ED6B3]/25"
          >
            ✕
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
          {/* Soft Mint Background Glow */}
          <div className="absolute top-24 -z-10 left-1/2 -translate-x-1/2 size-72 sm:size-96 xl:size-120 bg-[#6ED6B3]/25 blur-[100px] rounded-full"></div>

          {/* Avatars + Stars */}
          <div className="flex items-center mt-20 md:mt-24 bg-white/70 border border-[#6ED6B3]/20 rounded-full py-1.5 pl-3 pr-5 shadow-[0_4px_24px_rgba(20,128,95,0.04)] backdrop-blur-sm">
            <div className="flex -space-x-2.5 pr-4">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                alt="user3"
                className="size-7 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition duration-200 z-1"
              />
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="user1"
                className="size-7 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition duration-200 z-2"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="user2"
                className="size-7 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition duration-200 z-3"
              />
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="user5"
                className="size-7 rounded-full border-2 border-white hover:-translate-y-0.5 transition duration-200 z-4"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star text-transparent fill-[#38B487]"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                  ))}
                <span className="text-[11px] font-semibold text-[#14805F] ml-1.5 bg-[#EAF7F3] px-1.5 py-0.5 rounded-md">4.9/5 Rating</span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Empowering 10,000+ job seekers</p>
            </div>
          </div>

          {/* Headline + CTA */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-4xl text-center mt-6 text-[#0E5C49] tracking-tight leading-tight md:leading-[1.15]">
            Land your dream job with{" "}
            <span className="bg-gradient-to-r from-[#14805F] via-[#38B487] to-[#14805F] bg-clip-text text-transparent">
              AI-powered
            </span>{" "}
            resumes.
          </h1>

          <p className="max-w-xl text-center text-gray-600 text-base md:text-lg mt-6 mb-8 leading-relaxed">
            Create, edit, and optimize ATS-compliant professional resumes in minutes with intelligent AI guidance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/app"
              className="w-full sm:w-auto bg-gradient-to-r from-[#14805F] to-[#38B487] hover:from-[#0E5C49] hover:to-[#14805F] text-white rounded-full px-9 py-3.5 font-semibold text-base flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(20,128,95,0.2)] hover:shadow-[0_8px_25px_rgba(14,92,73,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started for free
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#6ED6B3] hover:bg-[#EAF7F3]/60 transition-all duration-300 rounded-full px-8 py-3.5 text-base font-semibold text-[#14805F]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-video size-4.5"
                aria-hidden="true"
              >
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
              </svg>
              <span>Watch demo</span>
            </button>
          </div>


        </div>
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

          * {
              font-family: 'Outfit', sans-serif;
          }
      `}
      </style>
    </>
  );
};

export default Hero;
