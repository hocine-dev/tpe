import { motion } from "framer-motion";
import {
  Settings,
  GitFork,
  BarChart3,
  Share2,
  Gauge,
  Network,
  Timer,
  Layers,
  Hash,
} from "lucide-react";

const params = [
  {
    icon: <Layers className="w-4 h-4" />,
    label: "Taille du Réseau",
    desc: "Ajuster le nombre de nœuds actifs pour observer la scalabilité.",
    color: "text-neon-blue",
  },
  {
    icon: <Gauge className="w-4 h-4" />,
    label: "Difficulté de Minage",
    desc: "Difficulté dynamique pour compenser les variations de puissance.",
    color: "text-neon-orange",
  },
  {
    icon: <Timer className="w-4 h-4" />,
    label: "Latence Réseau",
    desc: "Simuler les délais de propagation pour analyser les forks.",
    color: "text-neon-green",
  },
  {
    icon: <Network className="w-4 h-4" />,
    label: "Topologie P2P",
    desc: "Configurer le nombre de voisins et la structure des connexions.",
    color: "text-muted-foreground",
  },
];

const badges = [
  { icon: <Settings className="w-3.5 h-3.5" />, label: "Paramètres temps réel" },
  { icon: <GitFork className="w-3.5 h-3.5" />, label: "Résolution de Forks" },
  { icon: <BarChart3 className="w-3.5 h-3.5" />, label: "Graphiques dynamiques" },
  { icon: <Share2 className="w-3.5 h-3.5" />, label: "Topologie P2P" },
];

const SimulationSection = () => {
  return (
    <section id="simulation" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 radial-fade opacity-40" />
      <div className="container px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono tracking-wider uppercase text-neon-green">
            Cœur du projet
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            L'Environnement de Simulation
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Manipulez les variables du réseau pour observer le comportement des
            forks et la stabilisation de la chaîne en temps réel.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left — Parameters & Features */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-heading font-semibold mb-6">
              Paramètres Ajustables
            </h3>

            <div className="space-y-4 mb-8">
              {params.map((p) => (
                <div key={p.label} className="glass-card p-4 flex gap-4 items-start">
                  <div className={`mt-0.5 ${p.color}`}>{p.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-heading font-semibold mb-4">Fonctionnalités</h3>
            <div className="flex flex-wrap gap-2.5">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-neon-green/[0.06] text-neon-green border border-neon-green/15"
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — Simulation Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="glass-card p-0 overflow-hidden glow-blue">
              {/* Window bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-3 text-[10px] font-mono text-muted-foreground/70">
                  AnyLogic — Simulation PoW
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Nœuds actifs", value: "128", color: "text-neon-blue" },
                    { label: "Latence moy.", value: "45ms", color: "text-neon-green" },
                    { label: "Blocs/min", value: "6.2", color: "text-neon-orange" },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/[0.025] rounded-lg p-3">
                      <p className="text-[9px] font-mono uppercase text-muted-foreground/70">
                        {m.label}
                      </p>
                      <p className={`text-lg font-heading font-bold ${m.color}`}>
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Convergence bars */}
                <div className="space-y-3">
                  {[
                    { label: "Convergence PoW", pct: 72, color: "bg-neon-orange" },
                    { label: "Convergence PoS", pct: 91, color: "bg-neon-green" },
                    { label: "Convergence PBFT", pct: 98, color: "bg-neon-blue" },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-[9px] font-mono text-muted-foreground/70 mb-1">
                        <span>{bar.label}</span>
                        <span>{bar.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${bar.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                          className={`h-full rounded-full ${bar.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Network state */}
                <div className="bg-white/[0.015] rounded-lg p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-3 h-3 text-neon-blue/60" />
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                      mining_log.out
                    </span>
                  </div>
                  <div className="font-mono text-[10px] leading-relaxed text-muted-foreground/70 space-y-0.5">
                    <p>
                      <span className="text-neon-green/70">[INFO]</span>{" "}
                      Nœud_42 a miné le bloc #127
                    </p>
                    <p>
                      <span className="text-neon-blue/70">[SYNC]</span>{" "}
                      Propagation vers 6 voisins...
                    </p>
                    <p>
                      <span className="text-neon-orange/70">[FORK]</span>{" "}
                      Fork détecté — résolution par chaîne la plus longue
                    </p>
                    <p>
                      <span className="text-neon-green/70">[OK]</span>{" "}
                      Consensus atteint — hauteur: 127
                    </p>
                  </div>
                </div>

                {/* Code snippet */}
                <div className="bg-white/[0.015] rounded-lg p-3 font-mono text-[10px] leading-relaxed text-muted-foreground/70 overflow-hidden">
                  <span className="text-neon-blue/80">while</span> (
                  <span className="text-neon-green/80">!validHash</span>) {"{"}{" "}
                  <br />
                  {"  "}nonce++;
                  <br />
                  {"  "}hash = <span className="text-neon-orange/80">SHA256</span>(
                  header + nonce);
                  <br />
                  {"  "}validHash = hash.startsWith(
                  <span className="text-neon-orange/80">"0".repeat(difficulty)</span>
                  );
                  <br />
                  {"}"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SimulationSection;
