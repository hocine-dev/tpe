import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Blocks, Construction, Play } from "lucide-react";

const DocPBFT = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <div className="bg-neon-blue/[0.06] border-b border-neon-blue/15 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <span className="text-xs font-mono text-neon-blue">Documentation</span>
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-md bg-neon-blue/[0.05] text-neon-blue/40 border border-neon-blue/10 cursor-not-allowed"
        >
          <Play className="w-3 h-3" />
          Simulation PBFT — Bientôt
        </button>
      </div>

      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-6 bg-card/40">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/[0.08] border border-neon-blue/20 flex items-center justify-center">
              <Blocks className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">
                Blockchain PBFT Simulation
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Practical Byzantine Fault Tolerance — Documentation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Coming Soon */}
      <div className="container max-w-4xl mx-auto py-32 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-20 h-20 rounded-2xl bg-neon-blue/[0.06] border border-neon-blue/15 flex items-center justify-center mb-6"
        >
          <Construction className="w-10 h-10 text-neon-blue/60" />
        </motion.div>

        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-3xl font-heading font-bold mb-3"
        >
          Documentation en préparation
        </motion.h2>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-sm text-muted-foreground max-w-md leading-relaxed mb-8"
        >
          La documentation Javadoc du protocole{" "}
          <strong className="text-neon-blue">PBFT</strong> est en cours de
          rédaction. Elle détaillera le leader, les phases Pre-prepare / Prepare
          / Commit, et la tolérance aux pannes byzantines.
        </motion.p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Accueil
          </Link>
          <Link
            to="/docs/pow"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-neon-orange/[0.08] border border-neon-orange/20 text-neon-orange hover:bg-neon-orange/[0.12] transition-all"
          >
            Voir la doc PoW
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-4 px-6 text-center">
        <p className="text-[11px] text-muted-foreground/40 font-mono">
          Documentation PBFT — BlockchainTPE — Université Le Havre Normandie 2025-2026
        </p>
      </footer>
    </div>
  );
};

export default DocPBFT;
