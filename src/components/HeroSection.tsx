import { motion } from "framer-motion";
import { Play, FileText, ArrowDown, Hash, Shield, Blocks } from "lucide-react";

/* ─── Mini blockchain chain visual ─── */
const BlockChainVisual = () => {
  const blocks = [
    { num: 0, hash: "0x0000...0000", label: "Genesis" },
    { num: 1, hash: "0x7f3a...b2c4", label: "Block" },
    { num: 2, hash: "0xa1b2...9ef0", label: "Block" },
    { num: 3, hash: "0x9c4e...1d8a", label: "Latest" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 overflow-x-auto pb-2 scrollbar-hide">
      {blocks.map((block, i) => (
        <div key={block.num} className="flex items-center shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 + i * 0.12, ease: "easeOut" }}
            className="glass-card p-3 min-w-[110px] md:min-w-[130px] relative"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-mono text-muted-foreground/70">{block.label}</span>
              <span className="text-[9px] font-mono text-neon-blue/80">#{block.num}</span>
            </div>
            <div className="flex items-center gap-1">
              <Hash className="w-2.5 h-2.5 text-neon-green/50" />
              <span className="text-[9px] font-mono text-neon-green/70 truncate">{block.hash}</span>
            </div>
            <div className="mt-1.5 h-px w-full bg-gradient-to-r from-neon-blue/20 via-neon-green/15 to-neon-orange/20" />
            <div className="flex items-center gap-1 mt-1">
              <Shield className="w-2 h-2 text-muted-foreground/40" />
              <span className="text-[8px] font-mono text-muted-foreground/50">verified</span>
            </div>
          </motion.div>
          {i < blocks.length - 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 1.05 + i * 0.12 }}
              className="w-5 md:w-8 h-px bg-gradient-to-r from-neon-blue/30 to-neon-blue/10 origin-left shrink-0"
            />
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Floating block decoration ─── */
const FloatingBlock = ({
  x,
  y,
  delay,
  size = 60,
}: {
  x: string;
  y: string;
  delay: number;
  size?: number;
}) => (
  <motion.div
    className="absolute pointer-events-none hidden lg:block"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: [0, 0.055, 0], y: [-5, -25, -5] }}
    transition={{ duration: 10, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <div
      className="rounded-lg border border-neon-blue/[0.07] bg-neon-blue/[0.015]"
      style={{ width: size, height: size * 0.65 }}
    >
      <div className="p-2">
        <div className="h-0.5 w-7 rounded bg-neon-blue/15 mb-1" />
        <div className="h-0.5 w-10 rounded bg-neon-blue/10" />
        <div className="h-0.5 w-5 rounded bg-neon-blue/10 mt-1" />
      </div>
    </div>
  </motion.div>
);

/* ─── Hero ─── */
const HeroSection = () => {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* BG layers */}
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <div className="absolute inset-0 radial-fade" />

      {/* Floating decorations */}
      <FloatingBlock x="8%" y="18%" delay={0} />
      <FloatingBlock x="82%" y="14%" delay={2.5} size={50} />
      <FloatingBlock x="75%" y="62%" delay={5} size={55} />
      <FloatingBlock x="12%" y="68%" delay={1.5} size={45} />
      <FloatingBlock x="50%" y="8%" delay={3.5} size={48} />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-[15%] w-[420px] h-[420px] bg-neon-blue/[0.025] rounded-full blur-[100px] animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-[15%] w-[350px] h-[350px] bg-neon-orange/[0.018] rounded-full blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-green/[0.012] rounded-full blur-[120px] animate-pulse-glow"
        style={{ animationDelay: "3s" }}
      />

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-8 text-center pt-28 md:pt-24">
        {/* Academic badge */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase rounded-full border border-neon-blue/20 bg-neon-blue/[0.05] text-neon-blue">
            <Blocks className="w-3.5 h-3.5" />
            Travail Personnel Encadré — Master 1 IWOCS
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
          className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.08] max-w-5xl mx-auto"
        >
          Simulation et Visualisation des{" "}
          <span className="gradient-text">Consensus Blockchain</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto italic"
        >
          « Rendre visible l'invisible »
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="mt-3 text-sm md:text-base text-muted-foreground/70 max-w-xl mx-auto leading-relaxed"
        >
          Explorer les protocoles PoW, PoS et PBFT à travers un simulateur
          interactif multi-agents développé avec AnyLogic.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.46 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#protocoles"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium rounded-xl bg-neon-blue text-white hover:shadow-[0_0_40px_hsl(210,100%,60%,0.35)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
            Explorer les Protocoles
          </a>
          <a
            href="#equipe"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium rounded-xl border border-white/[0.1] text-foreground hover:bg-white/[0.04] hover:border-white/[0.16] transition-all duration-300 hover:-translate-y-0.5"
          >
            <FileText className="w-4 h-4" />
            En savoir plus
          </a>
        </motion.div>

        {/* Blockchain chain */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-14 md:mt-16 max-w-2xl mx-auto hidden sm:block"
        >
          <BlockChainVisual />
        </motion.div>

        {/* University */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex items-center justify-center gap-3 text-[11px] text-muted-foreground/50 font-mono"
        >
          <span>Université Le Havre Normandie</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>2025 — 2026</span>
        </motion.div>
      </div>

      {/* Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/35">
            scroll
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/35" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
