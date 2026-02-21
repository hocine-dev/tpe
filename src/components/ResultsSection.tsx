import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  Pickaxe,
  Coins,
  Network,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const ResultsSection = () => {
  return (
    <section id="resultats" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 radial-fade opacity-30" />
      <div className="container px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-wider uppercase text-neon-orange">
            Résultats & Feuille de Route
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Avancées et Perspectives
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Key findings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-neon-green" />
              Résultats Clés
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon-green/[0.08] border border-neon-green/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-neon-green" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    Convergence du Réseau
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Stabilisation rapide du consensus PoW. Malgré l'apparition ponctuelle de forks
                    lors de latences élevées, le réseau converge systématiquement vers une chaîne
                    unique.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/[0.08] border border-neon-blue/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-neon-blue" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    Résilience du Protocole
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Robustesse confirmée du Proof of Work face aux conditions réseau dégradées. La
                    difficulté ajustable maintient un temps de bloc stable quelle que soit la
                    puissance de calcul.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Roadmap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card p-8"
          >
            <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-3">
              <ArrowRight className="w-5 h-5 text-neon-orange" />
              Feuille de Route
            </h3>

            <div className="space-y-0">
              {[
                {
                  month: "Février 2026",
                  label: "PoW — Implémentation & Simulation",
                  icon: <Pickaxe className="w-4 h-4 text-neon-orange" />,
                  color: "border-neon-orange/30 bg-neon-orange/[0.06]",
                  done: true,
                },
                {
                  month: "Mars 2026",
                  label: "PoS — Analyse & Modélisation",
                  icon: <Coins className="w-4 h-4 text-neon-green" />,
                  color: "border-neon-green/30 bg-neon-green/[0.06]",
                  done: false,
                },
                {
                  month: "Avril 2026",
                  label: "PBFT — Modélisation & Tests",
                  icon: <Network className="w-4 h-4 text-neon-blue" />,
                  color: "border-neon-blue/30 bg-neon-blue/[0.06]",
                  done: false,
                },
                {
                  month: "Juin 2026",
                  label: "Soutenance Finale",
                  icon: <GraduationCap className="w-4 h-4 text-foreground" />,
                  color: "border-white/20 bg-white/[0.04]",
                  done: false,
                },
              ].map((step, i, arr) => (
                <div key={step.month} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-xl border ${step.color} flex items-center justify-center shrink-0`}
                    >
                      {step.icon}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px flex-1 bg-white/[0.06] my-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {step.month}
                    </span>
                    <p className="text-sm font-medium text-foreground mt-0.5 flex items-center gap-2">
                      {step.label}
                      {step.done && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-green/[0.1] text-neon-green border border-neon-green/20">
                          Terminé
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 glass-card p-8 max-w-3xl mx-auto text-center"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Le simulateur remplit son rôle pédagogique en rendant tangibles les mécanismes
            abstraits du consensus Proof of Work. Une base solide a été établie pour l'étude
            approfondie du <span className="text-neon-green font-medium">Proof of Stake</span> et
            du <span className="text-neon-blue font-medium">PBFT</span> — notre feuille de route
            pour juin 2026.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
