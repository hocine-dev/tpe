import { useState, useEffect } from "react";
import { Blocks, Menu, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Introduction", href: "#introduction" },
  { label: "Protocoles", href: "#protocoles" },
  { label: "Architecture", href: "#architecture" },
  { label: "Simulation", href: "#simulation" },
  { label: "Comparatif", href: "#comparatif" },
  { label: "Équipe", href: "#equipe" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <a href="#accueil" className="flex items-center gap-2.5 group">
          <Blocks className="w-6 h-6 text-neon-blue transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(210,100%,60%)]" />
          <span className="font-heading font-bold text-base tracking-tight text-foreground">
            BlockchainTPE
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-white/[0.04]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="https://blockchaintpe.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 hover:shadow-[0_0_20px_hsl(210,100%,60%,0.15)] transition-all duration-300"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Projet en ligne
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-muted-foreground"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-white/[0.06] overflow-hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://blockchaintpe.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Projet en ligne
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
