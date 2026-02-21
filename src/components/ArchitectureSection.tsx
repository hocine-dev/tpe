import { motion } from "framer-motion";
import { Crown, Cpu, Send, ArrowRight, Workflow, Code2, Box } from "lucide-react";
import type { ReactNode } from "react";

interface AgentCardProps {
  icon: ReactNode;
  badge: string;
  title: string;
  subtitle: string;
  points: string[];
  color: "orange" | "green" | "blue";
  delay: number;
}

const colorStyles = {
  orange: {
    text: "text-neon-orange",
    border: "border-neon-orange/20",
    bg: "bg-neon-orange/[0.06]",
    dot: "bg-neon-orange",
    glow: "group-hover:shadow-[0_0_40px_hsl(30,100%,55%,0.1)]",
  },
  green: {
    text: "text-neon-green",
    border: "border-neon-green/20",
    bg: "bg-neon-green/[0.06]",
    dot: "bg-neon-green",
    glow: "group-hover:shadow-[0_0_40px_hsl(160,85%,45%,0.1)]",
  },
  blue: {
    text: "text-neon-blue",
    border: "border-neon-blue/20",
    bg: "bg-neon-blue/[0.06]",
    dot: "bg-neon-blue",
    glow: "group-hover:shadow-[0_0_40px_hsl(210,100%,60%,0.1)]",
  },
};

const AgentCard = ({ icon, badge, title, subtitle, points, color, delay }: AgentCardProps) => {
  const c = colorStyles[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
      className={`glass-card-hover p-7 group ${c.glow} flex flex-col`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center`}
        >
          <span className={c.text}>{icon}</span>
        </div>
        <div>
          <span className={`text-[10px] font-mono uppercase tracking-wider ${c.text}`}>
            {badge}
          </span>
          <h3 className="text-lg font-heading font-semibold">{title}</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>

      <ul className="space-y-2.5 flex-1">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const agents: Omit<AgentCardProps, "delay">[] = [
  {
    icon: <Crown className="w-5 h-5" />,
    badge: "Orchestrateur",
    title: "Agent Main",
    subtitle: "Le chef d'orchestre de la simulation. Il contrôle l'ensemble du réseau.",
    color: "orange",
    points: [
      "Initialisation de la population de nœuds",
      "Gestion des paramètres globaux (latence, difficulté)",
      "Collecte des statistiques en temps réel",
      "Contrôle du cycle de vie de la simulation",
    ],
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    badge: "Participant",
    title: "Agent Nœud",
    subtitle: "Participant actif du réseau blockchain. Chaque nœud est autonome.",
    color: "green",
    points: [
      "Processus de minage et validation des blocs",
      "Maintenance de la copie locale du registre",
      "Gestion des forks et adoption de la chaîne la plus longue",
      "Décisions autonomes basées sur le protocole",
    ],
  },
  {
    icon: <Send className="w-5 h-5" />,
    badge: "Communication",
    title: "Agent Messager",
    subtitle: "Entité dédiée à la propagation de l'information entre nœuds.",
    color: "blue",
    points: [
      "Représentation visuelle du transit des données",
      "Simulation des délais de transmission réseau",
      "Lien physique entre les nœuds de la topologie P2P",
      "Gestion de la bande passante et latence",
    ],
  },
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-24 md:py-32 relative">
      <div className="container px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="text-xs font-mono tracking-wider uppercase text-neon-green">
            Modélisation Multi-Agents
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Architecture de la Simulation
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Développée avec AnyLogic, la simulation repose sur une approche multi-agents
            où chaque entité est autonome et interagit au sein d'un environnement partagé.
          </p>
        </motion.div>

        {/* Tools badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-14"
        >
          {[
            { icon: <Code2 className="w-3.5 h-3.5" />, label: "AnyLogic / Java" },
            { icon: <Workflow className="w-3.5 h-3.5" />, label: "Multi-Agents" },
            { icon: <Box className="w-3.5 h-3.5" />, label: "Visualisation 2D/3D" },
          ].map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-white/[0.03] text-muted-foreground border border-white/[0.06]"
            >
              {b.icon}
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Agent cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <AgentCard key={agent.title} {...agent} delay={i * 0.15} />
          ))}
        </div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 glass-card p-6 max-w-3xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-orange/[0.08] border border-neon-orange/20">
              <Crown className="w-4 h-4 text-neon-orange" />
              <span className="text-neon-orange font-medium">Agent Main</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 rotate-90 sm:rotate-0" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-green/[0.08] border border-neon-green/20">
              <Cpu className="w-4 h-4 text-neon-green" />
              <span className="text-neon-green font-medium">Nœuds × N</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 rotate-90 sm:rotate-0" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/[0.08] border border-neon-blue/20">
              <Send className="w-4 h-4 text-neon-blue" />
              <span className="text-neon-blue font-medium">Messagers</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 rotate-90 sm:rotate-0" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08]">
              <span className="text-foreground font-medium font-mono text-xs">Consensus ✓</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
