import { Blocks, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="container px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Blocks className="w-5 h-5 text-neon-blue" />
            <span className="font-heading text-sm font-semibold text-foreground">
              BlockchainTPE
            </span>
          </div>

          {/* Center text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Travail Personnel Encadré — Master 1 IWOCS
            </p>
            <p className="text-[11px] text-muted-foreground/50 mt-1">
              Université Le Havre Normandie — 2025/2026
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground/50 border border-white/[0.06] rounded-md px-2.5 py-1">
              React + Tailwind + Framer Motion
            </span>
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
