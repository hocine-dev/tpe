import { motion } from "framer-motion";
import {
  Zap,
  Timer,
  Maximize,
  ShieldCheck,
  Leaf,
  GitFork,
  Users,
  Lock,
} from "lucide-react";
import type { ReactNode } from "react";

interface Row {
  icon: ReactNode;
  label: string;
  pow: string;
  pos: string;
  pbft: string;
}

const rows: Row[] = [
  {
    icon: <Zap className="w-4 h-4" />,
    label: "Consommation énergétique",
    pow: "Très haute",
    pos: "Basse",
    pbft: "Très basse",
  },
  {
    icon: <Timer className="w-4 h-4" />,
    label: "Vitesse de finalité",
    pow: "Lente (~10min)",
    pos: "Moyenne (~12s)",
    pbft: "Instantanée",
  },
  {
    icon: <Maximize className="w-4 h-4" />,
    label: "Scalabilité",
    pow: "Faible",
    pos: "Élevée",
    pbft: "Limitée (O(n²))",
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    label: "Modèle de sécurité",
    pow: "51% puissance",
    pos: "Slashing",
    pbft: "f < n/3",
  },
  {
    icon: <Leaf className="w-4 h-4" />,
    label: "Ressource requise",
    pow: "Calcul (GPU/ASIC)",
    pos: "Capital (tokens)",
    pbft: "Réseau (bande passante)",
  },
  {
    icon: <GitFork className="w-4 h-4" />,
    label: "Risque de fork",
    pow: "Possible",
    pos: "Rare",
    pbft: "Impossible",
  },
  {
    icon: <Users className="w-4 h-4" />,
    label: "Type de réseau",
    pow: "Public / ouvert",
    pos: "Public / ouvert",
    pbft: "Privé / permissionné",
  },
  {
    icon: <Lock className="w-4 h-4" />,
    label: "Décentralisation",
    pow: "Forte",
    pos: "Moyenne",
    pbft: "Faible",
  },
];

const levelColor = (val: string) => {
  const good = [
    "instantanée",
    "élevée",
    "très basse",
    "basse",
    "forte",
    "impossible",
    "slashing",
  ];
  const bad = [
    "très haute",
    "haute",
    "lente",
    "faible",
    "possible",
    "limitée",
  ];
  const v = val.toLowerCase();
  if (good.some((g) => v.includes(g))) return "text-neon-green";
  if (bad.some((b) => v.includes(b))) return "text-neon-orange";
  return "text-muted-foreground";
};

const ComparisonSection = () => {
  return (
    <section id="comparatif" className="py-24 md:py-32 relative">
      <div className="container px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
            Analyse croisée
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Comparaison Analytique
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Vue synthétique des forces et faiblesses de chaque protocole de consensus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card overflow-hidden max-w-5xl mx-auto"
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                    Critère
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-neon-orange">
                    PoW
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-neon-green">
                    PoS
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-neon-blue">
                    PBFT
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`${
                      i < rows.length - 1 ? "border-b border-white/[0.04]" : ""
                    } hover:bg-white/[0.015] transition-colors`}
                  >
                    <td className="py-3.5 px-6 flex items-center gap-3 text-foreground text-sm">
                      <span className="text-muted-foreground/70">{row.icon}</span>
                      {row.label}
                    </td>
                    <td className={`text-center py-3.5 px-6 text-xs ${levelColor(row.pow)}`}>
                      {row.pow}
                    </td>
                    <td className={`text-center py-3.5 px-6 text-xs ${levelColor(row.pos)}`}>
                      {row.pos}
                    </td>
                    <td className={`text-center py-3.5 px-6 text-xs ${levelColor(row.pbft)}`}>
                      {row.pbft}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/[0.06]">
            {rows.map((row) => (
              <div key={row.label} className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <span className="text-muted-foreground/60">{row.icon}</span>
                  {row.label}
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center">
                    <p className="text-muted-foreground/60 mb-1 text-[10px]">PoW</p>
                    <p className={levelColor(row.pow)}>{row.pow}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground/60 mb-1 text-[10px]">PoS</p>
                    <p className={levelColor(row.pos)}>{row.pos}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground/60 mb-1 text-[10px]">PBFT</p>
                    <p className={levelColor(row.pbft)}>{row.pbft}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
