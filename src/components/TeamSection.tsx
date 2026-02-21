import { motion } from "framer-motion";
import { User, BookOpen, School, ExternalLink, Calendar } from "lucide-react";

const authors = [
  { name: "Boussad HAMMOUM", role: "Étudiant Master 1" },
  { name: "Hocine HAMAMA", role: "Étudiant Master 1" },
];

const supervisors = [
  { name: "Pr. Claude DUVALLET", role: "Encadrant" },
  { name: "Pr. Cyrille BERTELLE", role: "Encadrant" },
  { name: "M. Maxence LAMBARD", role: "Encadrant" },
  { name: "Dr. Aicha FERJANI", role: "Encadrante" },
];

const TeamSection = () => {
  return (
    <section id="equipe" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 radial-fade opacity-20" />
      <div className="container px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
            Équipe & Crédits
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Le Projet Académique
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Authors card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/[0.08] border border-neon-blue/20 flex items-center justify-center">
                <User className="w-5 h-5 text-neon-blue" />
              </div>
              <h3 className="text-base font-heading font-semibold">Auteurs</h3>
            </div>
            <div className="space-y-4">
              {authors.map((a) => (
                <div key={a.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neon-blue/[0.08] border border-neon-blue/15 flex items-center justify-center">
                    <span className="text-xs font-heading font-bold text-neon-blue">
                      {a.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Supervisors card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neon-green/[0.08] border border-neon-green/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-neon-green" />
              </div>
              <h3 className="text-base font-heading font-semibold">Encadrants</h3>
            </div>
            <div className="space-y-3">
              {supervisors.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Institution card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-7"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neon-orange/[0.08] border border-neon-orange/20 flex items-center justify-center">
                <School className="w-5 h-5 text-neon-orange" />
              </div>
              <h3 className="text-base font-heading font-semibold">Institution</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Université Le Havre Normandie
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Master 1 Informatique — IWOCS
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Année Universitaire 2025 — 2026</span>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <p className="text-xs text-muted-foreground mb-3">
                  Travail Personnel Encadré (TPE)
                </p>
                
                
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
