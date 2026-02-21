import { motion } from "framer-motion";
import { Pickaxe, Coins, Network, GraduationCap, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ReactNode } from "react";

interface MilestoneProps {
  month: string;
  title: string;
  icon: ReactNode;
  color: string;
  delay: number;
  isLast?: boolean;
}

const Milestone = ({ month, title, icon, color, delay, isLast }: MilestoneProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex gap-4"
  >
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-xl border ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      {!isLast && <div className="w-px flex-1 bg-white/[0.08] mt-2" />}
    </div>
    <div className={`pb-10 ${isLast ? "" : ""}`}>
      <span className="text-xs font-mono text-muted-foreground">{month}</span>
      <p className="text-sm font-medium text-foreground mt-1">{title}</p>
    </div>
  </motion.div>
);

const faqs = [
  {
    q: "Pourquoi choisir SHA-256 pour le Proof of Work ?",
    a: "SHA-256 est la fonction de hachage utilisée par Bitcoin. Elle offre une résistance aux collisions et aux pré-images, garantissant l'intégrité cryptographique du processus de minage. Sa difficulté est ajustable, ce qui permet de simuler différents scénarios de puissance de calcul.",
  },
  {
    q: "Comment est géré le problème des généraux byzantins ?",
    a: "Le PBFT résout ce problème en exigeant une supermajorité (2f+1 sur 3f+1 nœuds) lors de trois phases de vote : pre-prepare, prepare et commit. Tant que moins d'un tiers des nœuds sont malveillants, le consensus est garanti.",
  },
  {
    q: "Quels sont les paramètres ajustables dans la simulation ?",
    a: "La simulation permet de modifier la latence réseau, le nombre de nœuds, la difficulté du puzzle cryptographique (PoW), le montant de stake minimal (PoS), et le pourcentage de nœuds byzantins (PBFT).",
  },
  {
    q: "Comment les forks sont-ils résolus ?",
    a: "En PoW, la règle de la chaîne la plus longue s'applique. En PoS, des mécanismes de pénalité (slashing) découragent les validateurs de voter sur des chaînes concurrentes. En PBFT, les forks sont théoriquement impossibles grâce à la finalité instantanée.",
  },
];

const TimelineSection = () => {
  return (
    <section id="documentation" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 radial-fade opacity-30" />
      <div className="container px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
            Progression
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Documentation & Feuille de Route
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Timeline */}
          <div>
            <Milestone
              month="Mars 2025"
              title="Proof of Work — Implémentation & Simulation"
              icon={<Pickaxe className="w-4 h-4 text-neon-orange" />}
              color="border-neon-orange/30 bg-neon-orange/[0.06]"
              delay={0}
            />
            <Milestone
              month="Avril 2025"
              title="Proof of Stake — Analyse & Modélisation"
              icon={<Coins className="w-4 h-4 text-neon-green" />}
              color="border-neon-green/30 bg-neon-green/[0.06]"
              delay={0.1}
            />
            <Milestone
              month="Mai 2025"
              title="PBFT — Modélisation & Tests"
              icon={<Network className="w-4 h-4 text-neon-blue" />}
              color="border-neon-blue/30 bg-neon-blue/[0.06]"
              delay={0.2}
            />
            <Milestone
              month="Juin 2025"
              title="Soutenance Finale & Présentation"
              icon={<GraduationCap className="w-4 h-4 text-foreground" />}
              color="border-white/20 bg-white/[0.04]"
              delay={0.3}
              isLast
            />
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="glass-card border border-white/[0.06] rounded-xl px-5 overflow-hidden"
                >
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
