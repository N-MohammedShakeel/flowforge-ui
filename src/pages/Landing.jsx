// src/pages/Landing.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  SparklesIcon,
  BoltIcon,
  CheckBadgeIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function Landing() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* ===== Background Effects ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjJoLTR6bS0zMCAwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWMmgtNHpNMzYgNjR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bS0zMCAwdi00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00eiIgZmlsbD0iIzFDMjMzQyIgZmlsbC1vcGFjaXR5PSIwLjQiLz48L2c+PC9zdmc+')] opacity-20" />
        {/* Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      {/* ===== Navigation ===== */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">FlowForge</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="hover:text-white transition-colors"
            >
              Wall of Love
            </a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* ===== Hero Section ===== */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8 backdrop-blur-sm">
            <SparklesIcon className="w-4 h-4" />
            <span>FlowForge AI 1.0 is now live</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
            Design Systems at the <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Speed of Thought
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed">
            Describe your project idea or upload an SRS document. Watch our AI
            generate a production-ready, editable software architecture in
            seconds. No more whiteboarding from scratch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                navigate(isAuthenticated ? "/dashboard" : "/register")
              }
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              {isAuthenticated ? "Open Dashboard" : "Start Designing for Free"}
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-semibold rounded-xl transition-all backdrop-blur-sm"
            >
              See How it Works
            </a>
          </div>

          {/* Interactive Hero Visual */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent z-10 rounded-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 shadow-2xl overflow-hidden group">
              {/* Fake UI Header */}
              <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-xs font-mono text-slate-400">
                  FlowForge Canvas
                </div>
              </div>

              {/* Fake Canvas Area */}
              <div className="h-[400px] lg:h-[500px] relative bg-[#0F1423] p-8 overflow-hidden">
                {/* Connecting Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ opacity: 0.5 }}
                >
                  <path
                    d="M 250 150 C 350 150, 350 250, 450 250"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-[dash_20s_linear_infinite]"
                  />
                  <path
                    d="M 250 150 C 350 150, 350 350, 450 350"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-[dash_20s_linear_infinite_reverse]"
                  />
                </svg>

                {/* Nodes */}
                <div className="absolute top-[110px] left-[50px] bg-white border border-gray-200 rounded-lg p-3 w-48 shadow-xl transform transition-transform group-hover:scale-105 group-hover:shadow-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                      FE
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      React Frontend
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Vite • Redux • Tailwind
                  </div>
                </div>

                <div className="absolute top-[210px] left-[450px] bg-white border border-gray-200 rounded-lg p-3 w-48 shadow-xl transform transition-transform group-hover:scale-105 group-hover:shadow-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">
                      API
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      Spring Boot API
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Java 21 • REST • JWT
                  </div>
                </div>

                <div className="absolute top-[310px] left-[450px] bg-white border border-gray-200 rounded-lg p-3 w-48 shadow-xl transform transition-transform group-hover:scale-105 group-hover:shadow-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                      DB
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      PostgreSQL
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Relational Database
                  </div>
                </div>

                {/* Floating "AI Analyzing" Badge */}
                <div className="absolute top-[50px] right-[50px] bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
                  <SparklesIcon className="w-4 h-4" />
                  AI Optimizing...
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== Features Section ===== */}
      <section id="features" className="py-24 relative z-10 bg-[#070A12]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Everything you need to architect
            </h2>
            <p className="text-slate-400">
              FlowForge bridges the gap between raw ideas and technical
              implementation with a suite of intelligent tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "AI Generation",
                desc: "Turn plain text descriptions, SRS PDFs, or existing codebases into visual architectures instantly.",
                icon: <BoltIcon className="w-6 h-6 text-indigo-400" />,
              },
              {
                title: "Interactive Canvas",
                desc: "Drag, drop, and connect components freely. Full React Flow integration for deep customizability.",
                icon: <SparklesIcon className="w-6 h-6 text-purple-400" />,
              },
              {
                title: "Intelligent Review",
                desc: "Get instant scores on Scalability, Security, and Maintainability with actionable suggestions.",
                icon: (
                  <MagnifyingGlassIcon className="w-6 h-6 text-emerald-400" />
                ),
              },
              {
                title: "Multiple Exports",
                desc: "Export your finished designs as JSON, high-res PNG images, or Mermaid.js markdown code.",
                icon: <ArrowDownTrayIcon className="w-6 h-6 text-pink-400" />,
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
                From Idea to Diagram in 3 Steps
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                Stop wasting time drawing boxes and arrows. Let AI do the heavy
                lifting so you can focus on the system design.
              </p>

              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Provide Context",
                    desc: "Type out your idea, upload an SRS PDF, or drop in a project ZIP.",
                    icon: (
                      <DocumentTextIcon className="w-5 h-5 text-indigo-400" />
                    ),
                  },
                  {
                    step: "02",
                    title: "AI Architects",
                    desc: "Our LangGraph-powered agents analyze requirements and build the graph.",
                    icon: <SparklesIcon className="w-5 h-5 text-purple-400" />,
                  },
                  {
                    step: "03",
                    title: "Refine & Export",
                    desc: "Tweak the diagram on the canvas, run a review, and export the result.",
                    icon: (
                      <CheckBadgeIcon className="w-5 h-5 text-emerald-400" />
                    ),
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 font-mono text-indigo-400 font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-1 flex items-center gap-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[100px]" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">You</span>
                    </div>
                    <div className="text-sm text-slate-300 pt-1">
                      "I need an architecture for a bus ticket booking system.
                      Uses React, Spring Boot, and Postgres."
                    </div>
                  </div>

                  <div className="bg-indigo-900/40 rounded-xl p-4 border border-indigo-500/30 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <SparklesIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-indigo-100 pt-1 space-y-2">
                      <p>Analyzing requirements...</p>
                      <p>Identifying microservices...</p>
                      <p>Establishing connections...</p>
                      <div className="inline-flex items-center gap-1 text-green-400 font-semibold mt-2">
                        <CheckBadgeIcon className="w-4 h-4" /> Canvas Generated
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjJoLTR6bS0zMCAwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWMmgtNHpNMzYgNjR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bS0zMCAwdi00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00eiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">
                Ready to Forge Your Architecture?
              </h2>
              <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
                Join hundreds of software architects and engineers who are
                accelerating their system design process with FlowForge.
              </p>

              <button
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/register")
                }
                className="px-8 py-4 bg-white text-indigo-900 hover:bg-indigo-50 text-base font-bold rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
              >
                {isAuthenticated ? "Go to Dashboard" : "Create Free Account"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-[#070A12]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">FlowForge</span>
          </div>

          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} FlowForge Inc. All rights reserved.
          </div>

          <div className="flex gap-4 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
