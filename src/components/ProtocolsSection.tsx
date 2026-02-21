import { motion } from "framer-motion";
import { Pickaxe, Coins, Network, ArrowRight, Zap, Leaf, Vote, BookOpen, Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtocolCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  tagline: string;
  mechanism: string;
  resource: string;
  security: string;
  example: string;
  points: string[];
  color: "orange" | "green" | "blue";
  delay: number;
  docPath: string;
  simLink?: string;
}

const colorMap = {
  orange: {
    text: "text-neon-orange",
    border: "border-neon-orange/20",
    bg: "bg-neon-orange/[0.06]",
    hoverGlow: "hover:shadow-[0_0_50px_hsl(30,100%,55%,0.1)]",
    dot: "bg-neon-orange",
    bar: "bg-neon-orange/40",
    ring: "ring-neon-orange/20",
  },
  green: {
    text: "text-neon-green",
    border: "border-neon-green/20",
    bg: "bg-neon-green/[0.06]",
    hoverGlow: "hover:shadow-[0_0_50px_hsl(160,85%,45%,0.1)]",
    dot: "bg-neon-green",
    bar: "bg-neon-green/40",
    ring: "ring-neon-green/20",
  },
  blue: {
    text: "text-neon-blue",
    border: "border-neon-blue/20",
    bg: "bg-neon-blue/[0.06]",
    hoverGlow: "hover:shadow-[0_0_50px_hsl(210,100%,60%,0.1)]",
    dot: "bg-neon-blue",
    bar: "bg-neon-blue/40",
    ring: "ring-neon-blue/20",
  },
};

const ProtocolCard = ({
  icon,
  title,
  subtitle,
  tagline,
  mechanism,
  resource,
  security,
  example,
  points,
  color,
  delay,
  docPath,
  simLink,
}: ProtocolCardProps) => {
  const c = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`glass-card-hover p-7 flex flex-col ${c.hoverGlow} group`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
        >
          <span className={c.text}>{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold">{title}</h3>
          <p className={`text-xs ${c.text} font-medium`}>{subtitle}</p>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-sm text-muted-foreground mb-5 italic leading-relaxed">
        {tagline}
      </p>

      {/* Key points */}
      <ul className="space-y-2.5 mb-5 flex-1">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
            {point}
          </li>
        ))}
      </ul>

      {/* Specs */}
      <div className="space-y-2.5 pt-4 border-t border-white/[0.05]">
        {[
          { label: "Mécanisme", value: mechanism },
          { label: "Ressource", value: resource },
          { label: "Sécurité", value: security },
          { label: "Exemple", value: example },
        ].map((spec) => (
          <div key={spec.label} className="flex items-start gap-2 text-xs">
            <span className="text-muted-foreground/60 shrink-0 w-[72px]">{spec.label}</span>
            <span className="text-muted-foreground">{spec.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-5 pt-4 border-t border-white/[0.05] flex flex-wrap items-center gap-2.5">
        <Link
          to={docPath}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md ${c.bg} ${c.border} border ${c.text} hover:brightness-125 transition-all`}
        >
          <BookOpen className="w-3 h-3" />
          Documentation
        </Link>
        {simLink ? (
          <a
            href={simLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md ${c.bg} ${c.border} border ${c.text} hover:brightness-125 transition-all`}
          >
            <Play className="w-3 h-3" />
            Simulation
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white/[0.02] border border-white/[0.04] text-muted-foreground/40 cursor-not-allowed">
            <Play className="w-3 h-3" />
            Bientôt
          </span>
        )}
        <a
          href="#comparatif"
          className={`ml-auto inline-flex items-center gap-1.5 text-xs font-medium ${c.text} hover:gap-2.5 transition-all duration-200`}
        >
          Comparer <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
};

const protocols: Omit<ProtocolCardProps, "delay">[] = [
  {
    icon: <Pickaxe className="w-5 h-5" />,
    title: "Proof of Work",
    subtitle: "Le pionnier robuste",
    tagline:
      "Premier mécanisme de consensus décentralisé, rendu célèbre par Bitcoin. La sécurité repose sur la puissance de calcul.",
    mechanism: "Résolution d'un puzzle SHA-256 avec ajustement dynamique de la difficulté",
    resource: "Puissance de calcul (GPU/ASIC)",
    security: "Attaque 51% — coût prohibitif",
    example: "Bitcoin, Litecoin",
    color: "orange",
    docPath: "/docs/pow",
    simLink: "https://cloud.anylogic.com/model/9242c96b-a86c-4923-9641-b5873cdb0804?mode=SETTINGS&tab=GENERAL",
    points: [
      "Compétition cryptographique : incrémentation du nonce jusqu'à respecter la difficulté cible",
      "Propagation immédiate aux voisins dès qu'un bloc valide est trouvé",
      "Règle de la chaîne la plus longue en cas de fork",
      "Consommation énergétique élevée mais sécurité maximale",
    ],
  },
  {
    icon: <Coins className="w-5 h-5" />,
    title: "Proof of Stake",
    subtitle: "L'alternative écologique",
    tagline:
      "Alternative éco-responsable au PoW. La sécurité est garantie par des garanties économiques plutôt que par la puissance de calcul.",
    mechanism: "Sélection basée sur la mise en jeu de jetons (stake)",
    resource: "Garantie économique (tokens)",
    security: "Slashing — perte des jetons en cas de fraude",
    example: "Ethereum 2.0, Cardano",
    color: "green",
    docPath: "/docs/pos",
    points: [
      "Sélection aléatoire pondérée par le montant de stake",
      "Consommation énergétique drastiquement réduite",
      "Mécanismes de pénalité pour garantir l'honnêteté",
      "Risque de centralisation par concentration des actifs",
    ],
  },
  {
    icon: <Network className="w-5 h-5" />,
    title: "PBFT",
    subtitle: "Le vote par supermajorité",
    tagline:
      "Algorithme conçu pour les blockchains privées. Validation par vote multi-phases sans risque de fork.",
    mechanism: "Vote multi-phases : pre-prepare, prepare, commit (2/3 requis)",
    resource: "Bande passante réseau et identités vérifiées",
    security: "Tolérant tant que f < n/3 nœuds malveillants",
    example: "Hyperledger Fabric (IBM)",
    color: "blue",
    docPath: "/docs/pbft",
    points: [
      "Réseau permissionné avec identités connues",
      "Finalité instantanée et définitive des transactions",
      "Tolérance mathématique aux fautes byzantines",
      "Scalabilité limitée par le volume de messages O(n²)",
    ],
  },
];

const ProtocolsSection = () => {
  return (
    <section id="protocoles" className="py-24 md:py-32 relative">
      <div className="container px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
            Analyse approfondie
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Les 3 Piliers du Consensus
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Trois architectures fondamentales pour la validation distribuée des
            transactions au sein de réseaux pair-à-pair.
          </p>
        </motion.div>

        {/* Protocol icons summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-14"
        >
          {[
            { icon: <Zap className="w-4 h-4" />, label: "Puissance de calcul", color: "text-neon-orange" },
            { icon: <Leaf className="w-4 h-4" />, label: "Mise en jeu", color: "text-neon-green" },
            { icon: <Vote className="w-4 h-4" />, label: "Vote distribué", color: "text-neon-blue" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={item.color}>{item.icon}</span>
              {item.label}
            </span>
          ))}
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {protocols.map((p, i) => (
            <ProtocolCard key={p.title} {...p} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProtocolsSection;
