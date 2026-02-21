import { motion } from "framer-motion";
import {
  Database,
  ShieldQuestion,
  Handshake,
  HelpCircle,
  GraduationCap,
  BarChart3,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";

interface ConceptCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
  accentColor?: string;
}

const ConceptCard = ({ icon, title, description, delay, accentColor = "neon-blue" }: ConceptCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay }}
    className="glass-card-hover p-6 group"
  >
    <div className={`w-11 h-11 rounded-xl bg-${accentColor}/[0.08] border border-${accentColor}/20 flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(210,100%,60%,0.15)]`}>
      <span className={`text-${accentColor}`}>{icon}</span>
    </div>
    <h3 className="text-base font-heading font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const concepts = [
  {
    icon: <Database className="w-5 h-5" />,
    title: "Registre Distribué",
    description:
      "La blockchain est une technologie de stockage décentralisée, transparente et sécurisée fonctionnant sans organe central de contrôle.",
  },
  {
    icon: <ShieldQuestion className="w-5 h-5" />,
    title: "Consensus Complexes",
    description:
      "Les protocoles de consensus demeurent souvent abstraits et difficiles à appréhender pour les non-experts.",
  },
  {
    icon: <Handshake className="w-5 h-5" />,
    title: "Accord Décentralisé",
    description:
      "La validation nécessite un accord global sur l'état du registre au sein d'une blockchain, sans autorité centrale.",
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    title: "Problématique Centrale",
    description:
      "Comment « rendre visible l'invisible » en développant un outil de visualisation et simulation des comportements dynamiques ?",
  },
];

const objectives = [
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Pédagogie",
    description:
      "Créer un outil interactif permettant de comprendre les concepts abstraits de la blockchain et de ses protocoles de consensus.",
    color: "neon-orange",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Visualisation",
    description:
      "Représenter graphiquement la propagation des blocs et les interactions entre nœuds en temps réel au sein d'un réseau P2P.",
    color: "neon-green",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Analyse",
    description:
      "Étudier les performances et la sécurité des protocoles face à différents scénarios d'utilisation et conditions réseau.",
    color: "neon-blue",
  },
];

const AboutSection = () => {
  return (
    <section id="introduction" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 radial-fade opacity-30" />
      <div className="container px-4 md:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-wider uppercase text-neon-blue">
            Introduction
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Comprendre les Fondements
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            La blockchain repose sur des mécanismes complexes que ce projet cherche à rendre accessibles et compréhensibles.
          </p>
        </motion.div>

        {/* Concept cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {concepts.map((c, i) => (
            <ConceptCard
              key={c.title}
              icon={c.icon}
              title={c.title}
              description={c.description}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest">
            Objectifs
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        {/* Objectives */}
        <div className="grid md:grid-cols-3 gap-6">
          {objectives.map((obj, i) => (
            <motion.div
              key={obj.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card-hover p-7 text-center group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-${obj.color}/[0.08] border border-${obj.color}/20 flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110`}
              >
                <span className={`text-${obj.color}`}>{obj.icon}</span>
              </div>
              <h3 className="text-lg font-heading font-semibold mb-3">{obj.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {obj.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
