import { useState, useEffect, useRef } from "react";
import { Github, Twitter, Linkedin, Mail, Heart, ArrowUp, Shield, Code2, Sparkles } from "lucide-react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef}
      className="relative bg-linear-to-b from-gray-900 to-gray-950 text-white py-16 overflow-hidden"
    >
      {/* Animated Background - Matching other sections */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-indigo-400/20 rounded-full animate-float-particle"
              style={{
                top: `${(i * 12) % 100}%`,
                left: `${(i * 17) % 100}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${10 + (i % 8)}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* Brand Section - Left */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              {/* Logo with Glow Effect */}
              <div className="relative inline-block">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg blur-lg opacity-50" />
                <h3 className="relative text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  DevSync
                </h3>
              </div>
              
              {/* Tagline */}
              <p className="text-gray-400 text-lg max-w-xs">
                Developer management made simple
              </p>
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-medium text-gray-300">v2.0.0 • Latest Release</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Middle */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Documentation", href: "#" },
                { label: "API Reference", href: "#" },
                { label: "Support", href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social & Newsletter - Right */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Connect With Us
            </h4>
            
            {/* Social Icons */}
            <div className="flex gap-3 mb-6">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="relative group"
                    aria-label={social.label}
                  >
                    <div className="absolute -inset-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    <div className="relative w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 hover:border-indigo-500 transition-all duration-300 hover:scale-110 hover:bg-gray-700">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-800 rounded-lg">
              <Shield className="w-8 h-8 text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-white">Enterprise Ready</p>
                <p className="text-xs text-gray-400">SOC2 Type II Certified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`relative transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Decorative Line with Gradient */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span>© 2025 DevSync.</span>
              <span className="flex items-center gap-1">
                All rights reserved.
                <Heart className="w-3 h-3 text-red-400/50 inline-block mx-1" />
              </span>
            </p>

            {/* Built with love */}
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-600 flex items-center gap-1">
                Built with
                <Code2 className="w-3 h-3 text-indigo-400 mx-1" />
                by the DevSync team
              </p>
              
              {/* Scroll to top button */}
              <button
                onClick={scrollToTop}
                className="group relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="Scroll to top"
              >
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <ArrowUp className="relative w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
              </button>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-4 flex justify-center md:justify-start gap-6 text-xs text-gray-700">
            <a href="#" className="hover:text-gray-400 transition-colors">Status</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Security</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.2; }
          75% { opacity: 0.3; }
        }
        .animate-float-particle {
          animation: float-particle 10s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
