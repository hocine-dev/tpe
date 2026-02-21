import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Blocks,
  ArrowLeft,
  ChevronRight,
  Package,
  Box,
  Code2,
  X,
  ExternalLink,
  Play,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */
interface FieldRow {
  type: string;
  name: string;
  desc: string;
}
interface MethodRow {
  returnType: string;
  name: string;
  anchor: string;
  desc: string;
}
interface MethodDetail {
  anchor: string;
  signature: string;
  description: string;
  codeId: string;
}

/* ──────────────────────── Code Snippets ──────────────────────── */
const codeSnippets: Record<string, string> = {
  "code-Agent_Main-onClick_BtnAttaque": `public void onClick_BtnAttaque() {
    java.util.Random rand = new java.util.Random();
    if (noeuds.isEmpty()) return;

    int indexAttaquant = rand.nextInt(noeuds.size());
    noeud attaquant = (noeud) noeuds.get(indexAttaquant);
    attaquant.flash(Color.RED);

    Block lastBlock = attaquant.blockchain.get(attaquant.blockchain.size() - 1);
    Block fakeBlock = new Block("FAUSSES TRANSACTIONS", lastBlock.hash);
    fakeBlock.hash = "0000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa…";

    traceln("--- ATTAQUE : Noeud " + indexAttaquant + " diffuse un FAUX BLOC ! ---");

    for (Agent a : attaquant.getConnections()) {
        noeud voisin = (noeud) a;
        if (chk_simulerFork.isSelected()) {
            double delai = uniform(1.0, 2.0);
            attaquant.create_SendWithDelayEvent(delai, SECOND, fakeBlock, voisin);
        } else {
            attaquant.create_SendWithDelayEvent(0.001, SECOND, fakeBlock, voisin);
        }
    }
}`,
  "code-Agent_Main-onClick_BtnExport": `try {
    String userHome = System.getProperty("user.home");
    String relativePath = "Models" + java.io.File.separator + "blockchain";
    java.io.File projectDir = new java.io.File(userHome, relativePath);
    if (!projectDir.exists()) projectDir.mkdirs();

    java.io.File file = new java.io.File(projectDir, "recompenses_TPE.dat");
    java.io.PrintStream ps = new java.io.PrintStream(new java.io.FileOutputStream(file));
    ps.println("# NodeID  Reward(BTC)");

    for (noeud n : noeuds) {
        String solde = String.format(java.util.Locale.US, "%.3f", n.balance);
        ps.println(n.getIndex() + " " + solde);
    }
    ps.close();
    traceln("✅ SUCCÈS : Données exportées !");
} catch (Exception e) {
    traceln("❌ ERREUR : " + e.getMessage());
}`,
  "code-Agent_Main-ChaosEvent": `int indexHasard = uniform_discr(0, noeuds.size() - 1);
noeud n = noeuds.get(indexHasard);

if (n.estConnecte == true) {
    if (randomTrue(0.2)) {
        n.gestionReseau(false);
    }
} else {
    n.gestionReseau(true);
}`,
  "code-Agent_Noeud-onStartup": `public void onStartup() {
    int connectionsTarget = 2;
    int totalNodes = main.noeuds.size();

    while (getConnections().size() < connectionsTarget) {
        int randomIndex = uniform_discr(0, totalNodes - 1);
        Agent potentialNeighbor = main.noeuds.get(randomIndex);
        if (potentialNeighbor != this && !isConnectedTo(potentialNeighbor)) {
            connectTo(potentialNeighbor);
        }
    }

    int index = getIndex();
    indexText.setText("noeud " + index);

    Block genesisBlock = new Block("Bloc Genesis (Initial)", "0");
    genesisBlock.hash = "000000000000000000000000000000000000000000000001";
    blockchain.add(genesisBlock);
    updateVisuals();
}`,
  "code-Agent_Noeud-miningLoopAction": `public void miningLoopAction() {
    if (blockInProgress == null) {
        Block lastBlock = blockchain.get(blockchain.size() - 1);
        blockInProgress = new Block("Transactions du bloc " + (blockchain.size()), lastBlock.hash);
        currentNonce = 0;
    }

    String winningHash = blockInProgress.mineBlock(currentNonce);

    if (winningHash != null) {
        traceln("Noeud " + getIndex() + ": J'AI MINÉ LE BLOC " + blockchain.size() + " !");
        flash(Color.GREEN);
        blockchain.add(blockInProgress);
        visuelDejaRecu = true;
        create_EventResetVisuel(5, SECOND);

        // Diffuser aux voisins…
        updateVisuals();
        blockInProgress = null;
        currentNonce = 0;
    } else {
        currentNonce++;
    }
}`,
  "code-Agent_Noeud-onMessageReceived": `public void onMessageReceived(Object msg, Agent sender) {
    if (msg instanceof Block) {
        Block receivedBlock = (Block) msg;

        // Protection anti-boucle
        for (Block b : blockchain) {
            if (b.hash.equals(receivedBlock.hash)) return;
        }

        noeud expediteur = (noeud) sender;
        Block myLastBlock = blockchain.get(blockchain.size() - 1);

        String calculatedHash = receivedBlock.calculateHash();
        boolean isValid = calculatedHash.equals(receivedBlock.hash)
            && receivedBlock.hash.startsWith(Block.difficultyTarget);

        if (!isValid) { flash(Color.RED); return; }

        // CAS A : Le bloc s'ajoute parfaitement
        if (receivedBlock.previousHash.equals(myLastBlock.hash)) {
            blockchain.add(receivedBlock);
            blockInProgress = null;
            currentNonce = 0;
            // Relayer aux voisins…
        }
        // CAS B : Fork — chaîne plus longue
        else if (expediteur.blockchain.size() > this.blockchain.size()) {
            this.blockchain = new ArrayList<>(expediteur.blockchain);
        }
    }
}`,
  "code-Agent_Noeud-updateVisuals": `void updateVisuals() {
    int chainSize = blockchain.size();
    chainLengthText.setText("Blocks: " + chainSize);
}`,
  "code-Agent_Noeud-flash": `void flash(Color c) {
    voyant_rect.setFillColor(c);
    revertColorEvent.restart(1, SECOND);
}`,
  "code-Agent_Noeud-gestionReseau": `public void gestionReseau(boolean activer) {
    if (activer == false) {
        if (!this.estConnecte) return;
        disconnectFromAll();
        voyant_rect.setFillColor(silver);
        this.estConnecte = false;
    } else {
        if (this.estConnecte) return;
        Main mainAgent = (Main) getOwner();
        List<noeud> candidats = new ArrayList<>(mainAgent.noeuds);
        Collections.shuffle(candidats);
        int mesConnexions = 0;

        for (noeud candidat : candidats) {
            if (mesConnexions >= 3) break;
            if (candidat != this && candidat.estConnecte
                && candidat.getConnections().size() < 3) {
                connectTo(candidat);
                mesConnexions++;
            }
        }

        voyant_rect.setFillColor(black);
        this.estConnecte = true;

        // Synchronisation (chaîne la plus longue)
        noeud meilleurVoisin = null;
        int meilleurHauteur = this.blockchain.size();
        for (Agent a : getConnections()) {
            if (a instanceof noeud) {
                noeud voisin = (noeud) a;
                if (voisin.estConnecte && voisin.blockchain.size() > meilleurHauteur) {
                    meilleurVoisin = voisin;
                    meilleurHauteur = voisin.blockchain.size();
                }
            }
        }
        if (meilleurVoisin != null) {
            this.blockchain = new ArrayList<>(meilleurVoisin.blockchain);
        }

        this.currentNonce = 0;
        if (this.blockInProgress != null) {
            this.blockInProgress.nonce = 0;
            this.blockInProgress.hash = null;
        }
    }
}`,
  "code-Agent_Noeud-RadarConnexion": `// Cyclique toutes les 2 secondes
if (!this.estConnecte) return;
if (this.getConnections().size() >= 3) return;

Main mainAgent = (Main) getOwner();
List<noeud> candidats = new ArrayList<>(mainAgent.noeuds);
Collections.shuffle(candidats);
boolean nouvelleConnexion = false;

for (noeud candidat : candidats) {
    if (this.getConnections().size() >= 3) break;
    if (candidat != this && candidat.estConnecte
        && !this.isConnectedTo(candidat)
        && candidat.getConnections().size() < 3) {
        connectTo(candidat);
        nouvelleConnexion = true;
    }
}

if (nouvelleConnexion) {
    // Synchronisation immédiate…
    noeud meilleurVoisin = null;
    int meilleurHauteur = this.blockchain.size();
    for (Agent a : getConnections()) {
        if (a instanceof noeud) {
            noeud voisin = (noeud) a;
            if (voisin.estConnecte && voisin.blockchain.size() > meilleurHauteur) {
                meilleurVoisin = voisin;
                meilleurHauteur = voisin.blockchain.size();
            }
        }
    }
    if (meilleurVoisin != null) {
        this.blockchain = new ArrayList<>(meilleurVoisin.blockchain);
        this.blockInProgress = null;
        this.currentNonce = 0;
    }
}`,
  "code-Agent_Messager-onArrival": `public void onArrival() {
    send(contenu, cible);
    main.remove_messagers(this);
}`,
  "code-Block-ctor": `public Block(String transactions, String previousHash) {
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.timestamp = new Date().getTime();
    this.nonce = 0;
    this.hash = calculateHash();
}`,
  "code-Block-calculateHash": `public String calculateHash() {
    try {
        String dataToHash = previousHash
            + Long.toString(timestamp)
            + Integer.toString(nonce)
            + transactions;

        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(dataToHash.getBytes("UTF-8"));

        StringBuffer hexString = new StringBuffer();
        for (int i = 0; i < hashBytes.length; i++) {
            String hex = Integer.toHexString(0xff & hashBytes[i]);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}`,
  "code-Block-mineBlock": `public String mineBlock(int nonceToTry) {
    this.nonce = nonceToTry;
    this.hash = calculateHash();

    if (hash.substring(0, difficulty).equals(difficultyTarget)) {
        return hash;   // Succès
    } else {
        return null;   // Échec
    }
}`,
};

/* ──────────────────── Code Modal ──────────────────── */
const CodeModal = ({
  open,
  title,
  code,
  onClose,
}: {
  open: boolean;
  title: string;
  code: string;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl max-h-[85vh] rounded-xl border border-white/[0.08] bg-[hsl(222,47%,6%)] shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-neon-blue" />
              <span className="font-mono text-sm text-foreground">{title}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Code */}
          <div className="flex-1 overflow-auto p-5">
            <pre className="font-mono text-[13px] leading-relaxed text-[#d4d4d4] whitespace-pre overflow-x-auto">
              {code}
            </pre>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ──────────────────── Sidebar Link ──────────────────── */
const SideLink = ({
  href,
  children,
  indent = false,
}: {
  href: string;
  children: React.ReactNode;
  indent?: boolean;
}) => (
  <a
    href={href}
    className={`block px-3 py-1.5 text-[13px] rounded-md transition-colors hover:bg-white/[0.04] text-muted-foreground hover:text-foreground ${
      indent ? "pl-6" : ""
    }`}
  >
    {children}
  </a>
);

/* ──────────────────── Summary Table ──────────────────── */
const SummaryTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) => (
  <div className="overflow-x-auto mb-6">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              className="text-left py-2.5 px-4 font-medium text-neon-blue/80 bg-neon-blue/[0.04] border border-white/[0.06] text-xs uppercase tracking-wider"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
            {row.map((cell, j) => (
              <td
                key={j}
                className="py-2.5 px-4 border border-white/[0.04] text-sm text-muted-foreground"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ──────────────────── Method Detail Block ──────────────────── */
const MethodDetailBlock = ({
  detail,
  onViewCode,
}: {
  detail: MethodDetail;
  onViewCode: (title: string, codeId: string) => void;
}) => (
  <div id={detail.anchor} className="mb-8 glass-card p-5">
    <div className="mb-3">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
        Signature
      </span>
      <code className="block mt-1 font-mono text-[13px] text-neon-green/90 bg-white/[0.02] rounded-md px-3 py-2 border border-white/[0.04]">
        {detail.signature}
      </code>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
      {detail.description}
    </p>
    <button
      onClick={() => onViewCode(detail.signature.split("(")[0], detail.codeId)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-neon-blue/20 bg-neon-blue/[0.06] text-neon-blue hover:bg-neon-blue/[0.12] transition-colors"
    >
      <Code2 className="w-3 h-3" />
      Voir le code
    </button>
  </div>
);

/* ═══════════════════════ PAGE COMPONENT ═══════════════════════ */
const DocPoW = () => {
  const [modal, setModal] = useState<{ title: string; code: string } | null>(null);

  const openCode = (title: string, codeId: string) => {
    setModal({ title, code: codeSnippets[codeId] || "// Code non disponible" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Top Bar ─── */}
      <div className="bg-neon-orange/[0.06] border-b border-neon-orange/15 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <span className="text-xs font-mono text-neon-orange">Documentation</span>
        </div>
        <a
          href="https://cloud.anylogic.com/model/9242c96b-a86c-4923-9641-b5873cdb0804?mode=SETTINGS&tab=GENERAL"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-md bg-neon-orange/[0.08] text-neon-orange border border-neon-orange/20 hover:bg-neon-orange/[0.15] transition-all"
        >
          <Play className="w-3 h-3" />
          Lancer la simulation PoW
        </a>
      </div>

      {/* ─── Header ─── */}
      <header className="border-b border-white/[0.06] px-6 py-6 bg-card/40">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neon-orange/[0.08] border border-neon-orange/20 flex items-center justify-center">
              <Blocks className="w-5 h-5 text-neon-orange" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">
                Blockchain PoW Simulation
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Packages : <code className="text-neon-orange/80">agents</code>,{" "}
                <code className="text-neon-orange/80">models</code>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Packages nav ─── */}
      <div className="border-b border-white/[0.04] px-6 py-2 bg-card/20">
        <div className="container max-w-7xl mx-auto flex gap-4">
          <a
            href="#package-agents"
            className="flex items-center gap-1.5 text-xs text-neon-blue hover:text-neon-blue/80 transition-colors"
          >
            <Package className="w-3 h-3" />
            agents
          </a>
          <a
            href="#package-models"
            className="flex items-center gap-1.5 text-xs text-neon-blue hover:text-neon-blue/80 transition-colors"
          >
            <Box className="w-3 h-3" />
            models
          </a>
        </div>
      </div>

      {/* ─── Content Grid ─── */}
      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-[calc(100vh-180px)]">
        {/* Sidebar */}
        <aside className="border-r border-white/[0.04] py-5 pr-2 hidden lg:block sticky top-0 h-screen overflow-y-auto">
          <div className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50 px-3 mb-2">
              Package agents
            </p>
            <SideLink href="#class-Agent_Main">Agent_Main</SideLink>
            <SideLink href="#class-Agent_Noeud">Agent_Noeud</SideLink>
            <SideLink href="#class-Agent_Messager">Agent_Messager</SideLink>
          </div>
          <div className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50 px-3 mb-2">
              Package models
            </p>
            <SideLink href="#class-Block">Block</SideLink>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50 px-3 mb-2">
              Annexes
            </p>
            <SideLink href="#guide-gnuplot">Générer le Graphique</SideLink>
          </div>
        </aside>

        {/* Main */}
        <main className="py-8 px-6 lg:px-10">
          {/* ═══════ Overview ═══════ */}
          <h2 className="text-xl font-heading font-semibold mb-3 pb-2 border-b border-white/[0.06]">
            Vue d'ensemble
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Cette documentation décrit les principaux agents AnyLogic et la
            classe de modèle de bloc utilisés pour simuler un réseau blockchain
            fondé sur la preuve de travail (Proof-of-Work).
          </p>

          <h2 className="text-xl font-heading font-semibold mb-3 pb-2 border-b border-white/[0.06]">
            Liste des classes
          </h2>
          <SummaryTable
            headers={["Classe", "Description"]}
            rows={[
              [
                <a href="#class-Agent_Main" className="font-mono text-neon-orange hover:underline">agents.Agent_Main</a>,
                "Agent racine qui orchestre le réseau de nœuds, les messagers et l'UI.",
              ],
              [
                <a href="#class-Agent_Noeud" className="font-mono text-neon-green hover:underline">agents.Agent_Noeud</a>,
                "Mineur / validateur qui maintient une copie locale de la blockchain.",
              ],
              [
                <a href="#class-Agent_Messager" className="font-mono text-neon-blue hover:underline">agents.Agent_Messager</a>,
                "Agent mobile représentant un message (bloc) en transit.",
              ],
              [
                <a href="#class-Block" className="font-mono text-muted-foreground hover:underline">models.Block</a>,
                "Structure de données d'un bloc, incluant le hachage SHA-256 et le minage.",
              ],
            ]}
          />

          {/* ═══════ Agent_Main ═══════ */}
          <h2
            id="class-Agent_Main"
            className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-orange/20 mt-12 text-neon-orange"
          >
            agents.Agent_Main
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Agent principal (environnement). Contient la population de nœuds
            mineurs, les agents messagers et les contrôles de l'interface
            utilisateur (case à cocher pour simuler les forks, bouton
            d'attaque). Il fournit également la logique pour injecter un faux
            bloc dans le réseau.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Résumé des champs
          </h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">ArrayList&lt;noeud&gt;</code>, <code className="font-mono text-xs text-neon-orange">noeuds</code>, "Liste de tous les mineurs participant au réseau."],
              [<code className="font-mono text-xs">ArrayList&lt;Messager&gt;</code>, <code className="font-mono text-xs text-neon-orange">messagers</code>, "Liste des agents Messager en transit."],
              [<code className="font-mono text-xs">CheckBox</code>, <code className="font-mono text-xs text-neon-orange">chk_simulerFork</code>, "Contrôle UI pour activer une latence réseau réaliste (forks)."],
              [<code className="font-mono text-xs">Button</code>, <code className="font-mono text-xs text-neon-orange">btn_attaque</code>, "Bouton déclenchant une attaque « bloc invalide »."],
              [<code className="font-mono text-xs">Button</code>, <code className="font-mono text-xs text-neon-orange">btn_export</code>, "Exporte les soldes BTC vers un fichier .dat."],
              [<code className="font-mono text-xs">Event</code>, <code className="font-mono text-xs text-neon-orange">evt_ReseauInstable</code>, "Perturbateur cyclique (5s) : déconnecte 20% ou répare 100%."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Détails des méthodes
          </h3>
          <MethodDetailBlock
            detail={{
              anchor: "Agent_Main-onClick_BtnAttaque",
              signature: "public void onClick_BtnAttaque()",
              description:
                "Choisit un nœud attaquant au hasard, le fait clignoter en rouge, construit un faux bloc basé sur le dernier bloc valide, falsifie son hash puis le diffuse à ses voisins en respectant la latence.",
              codeId: "code-Agent_Main-onClick_BtnAttaque",
            }}
            onViewCode={openCode}
          />
          <MethodDetailBlock
            detail={{
              anchor: "Agent_Main-onClick_BtnExport",
              signature: "public void onClick_BtnExport()",
              description:
                "Détecte automatiquement le dossier du projet, récupère les soldes BTC des nœuds et génère le fichier recompenses_TPE.dat pour analyse Gnuplot.",
              codeId: "code-Agent_Main-onClick_BtnExport",
            }}
            onViewCode={openCode}
          />
          <MethodDetailBlock
            detail={{
              anchor: "Agent_Main-ChaosEvent",
              signature: "Event Cyclic (Récurrence : 5 secondes)",
              description:
                "Perturbateur du réseau. Sélectionne un nœud au hasard : s'il est connecté, 20% de chance de déconnexion ; s'il est déconnecté, réparation immédiate (100%). Teste la résilience de la blockchain.",
              codeId: "code-Agent_Main-ChaosEvent",
            }}
            onViewCode={openCode}
          />

          {/* ═══════ Agent_Noeud ═══════ */}
          <h2
            id="class-Agent_Noeud"
            className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-green/20 mt-12 text-neon-green"
          >
            agents.Agent_Noeud
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Représente un nœud (mineur / validateur) du réseau P2P. Chaque
            instance maintient une copie locale de la blockchain, mine de
            nouveaux blocs via Proof-of-Work, valide les blocs reçus et relaie
            l'information à ses voisins.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Résumé des champs
          </h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">double</code>, <code className="font-mono text-xs text-neon-green">BLOCK_REWARD</code>, "Récompense fixe par bloc (3.125 BTC)."],
              [<code className="font-mono text-xs">double</code>, <code className="font-mono text-xs text-neon-green">balance</code>, "Portefeuille du nœud (Solde cumulé)."],
              [<code className="font-mono text-xs">ArrayList&lt;Block&gt;</code>, <code className="font-mono text-xs text-neon-green">blockchain</code>, "Liste ordonnée des blocs de la chaîne valide."],
              [<code className="font-mono text-xs">Block</code>, <code className="font-mono text-xs text-neon-green">blockInProgress</code>, "Bloc actuellement en cours de minage."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-green">currentNonce</code>, "Dernier nonce testé dans la boucle de minage."],
              [<code className="font-mono text-xs">ShapeRectangle</code>, <code className="font-mono text-xs text-neon-green">voyant_rect</code>, "Indicateur visuel d'état (minage, réception, erreur)."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-green">visuelDejaRecu</code>, "Indique si un signal visuel a déjà été joué (anti-écho)."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Détails des méthodes
          </h3>
          {([
            {
              anchor: "Agent_Noeud-onStartup",
              signature: "public void onStartup()",
              description:
                "Construit la topologie P2P minimale (≥ 2 voisins aléatoires). Crée un bloc Genesis local avec un hash constant, l'ajoute à la blockchain et met à jour les éléments visuels.",
              codeId: "code-Agent_Noeud-onStartup",
            },
            {
              anchor: "Agent_Noeud-miningLoopAction",
              signature: "public void miningLoopAction()",
              description:
                "Boucle non bloquante : crée un bloc si nécessaire, appelle Block.mineBlock(nonce). Succès → ajoute à la chaîne, flash vert, propage aux voisins. Échec → incrémente le nonce.",
              codeId: "code-Agent_Noeud-miningLoopAction",
            },
            {
              anchor: "Agent_Noeud-onMessageReceived",
              signature:
                "public void onMessageReceived(Object msg, Agent sender)",
              description:
                "Cerveau du consensus. Ignore les blocs déjà connus, recalcule le hash, vérifie la difficulté. CAS A : s'ajoute en fin de chaîne. CAS B : fork → adopte la chaîne plus longue.",
              codeId: "code-Agent_Noeud-onMessageReceived",
            },
            {
              anchor: "Agent_Noeud-updateVisuals",
              signature: "void updateVisuals()",
              description:
                "Met à jour le texte affichant la longueur de la blockchain locale.",
              codeId: "code-Agent_Noeud-updateVisuals",
            },
            {
              anchor: "Agent_Noeud-flash",
              signature: "void flash(Color c)",
              description:
                "Change temporairement la couleur du voyant pour indiquer un événement (succès de minage, bloc invalide, fork…).",
              codeId: "code-Agent_Noeud-flash",
            },
            {
              anchor: "Agent_Noeud-gestionReseau",
              signature: "public void gestionReseau(boolean activer)",
              description:
                "Simule le Connection Manager de Bitcoin Core. OFF : déconnexion totale. ON : reconnexion aléatoire (max 3 voisins), synchronisation sur la chaîne la plus longue, reset du minage.",
              codeId: "code-Agent_Noeud-gestionReseau",
            },
            {
              anchor: "Agent_Noeud-RadarConnexion",
              signature: "Event Cyclic (Récurrence : 2 secondes)",
              description:
                "Heartbeat de résilience. Vérifie si le nœud a des slots libres (< 3 voisins). Si oui, tente une connexion aléatoire puis lance une synchronisation immédiate.",
              codeId: "code-Agent_Noeud-RadarConnexion",
            },
          ] as MethodDetail[]).map((d) => (
            <MethodDetailBlock key={d.anchor} detail={d} onViewCode={openCode} />
          ))}

          {/* ═══════ Agent_Messager ═══════ */}
          <h2
            id="class-Agent_Messager"
            className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-blue/20 mt-12 text-neon-blue"
          >
            agents.Agent_Messager
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Agent AnyLogic mobile représentant un message visuel. Transporte un
            objet Block d'un nœud source vers un nœud cible, puis déclenche la
            réception logique avant de s'auto-détruire.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Résumé des champs
          </h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">Agent</code>, <code className="font-mono text-xs text-neon-blue">cible</code>, "Nœud destinataire."],
              [<code className="font-mono text-xs">noeud</code>, <code className="font-mono text-xs text-neon-blue">source</code>, "Nœud émetteur."],
              [<code className="font-mono text-xs">Block</code>, <code className="font-mono text-xs text-neon-blue">contenu</code>, "Bloc transporté et remis à l'arrivée."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Détails des méthodes
          </h3>
          <MethodDetailBlock
            detail={{
              anchor: "Agent_Messager-onArrival",
              signature: "public void onArrival()",
              description:
                "Appelée quand l'agent atteint la cible. Envoie l'objet contenu au nœud cible via send(), puis retire ce messager de la collection pour libérer la mémoire.",
              codeId: "code-Agent_Messager-onArrival",
            }}
            onViewCode={openCode}
          />

          {/* ═══════ Block ═══════ */}
          <h2
            id="class-Block"
            className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-white/[0.12] mt-12"
          >
            models.Block
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Classe de modèle représentant un bloc de la blockchain. Encapsule
            les données métier (transactions, lien vers le bloc précédent), les
            métadonnées (timestamp, nonce) et la logique cryptographique de
            calcul de hash SHA-256 et de minage.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Résumé des champs
          </h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">static int</code>, <code className="font-mono text-xs">difficulty</code>, "Nombre de zéros requis au début d'un hash valide."],
              [<code className="font-mono text-xs">static String</code>, <code className="font-mono text-xs">difficultyTarget</code>, "Chaîne cible de zéros pour la vérification."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">hash</code>, "Hash SHA-256 courant de ce bloc."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">previousHash</code>, "Hash du bloc précédent (chaînage)."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">transactions</code>, "Transactions incluses dans ce bloc."],
              [<code className="font-mono text-xs">long</code>, <code className="font-mono text-xs">timestamp</code>, "Horodatage de création (millisecondes)."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs">nonce</code>, "Nonce utilisé pour le minage."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Détails des méthodes
          </h3>
          {([
            {
              anchor: "Block-ctor",
              signature:
                "public Block(String transactions, String previousHash)",
              description:
                "Crée un nouveau bloc en initialisant transactions, previousHash, timestamp, nonce à 0 puis calcule un premier hash (invalide avant minage).",
              codeId: "code-Block-ctor",
            },
            {
              anchor: "Block-calculateHash",
              signature: "public String calculateHash()",
              description:
                "Concatène previousHash + timestamp + nonce + transactions, applique SHA-256 via MessageDigest et retourne la chaîne hexadécimale.",
              codeId: "code-Block-calculateHash",
            },
            {
              anchor: "Block-mineBlock",
              signature: "public String mineBlock(int nonceToTry)",
              description:
                "Met à jour le nonce, recalcule le hash et vérifie s'il commence par difficultyTarget. Retourne le hash en cas de succès, null sinon.",
              codeId: "code-Block-mineBlock",
            },
          ] as MethodDetail[]).map((d) => (
            <MethodDetailBlock key={d.anchor} detail={d} onViewCode={openCode} />
          ))}

          {/* ═══════ Gnuplot Guide ═══════ */}
          <h2
            id="guide-gnuplot"
            className="text-xl font-heading font-semibold mb-3 pb-2 border-b border-white/[0.06] mt-12"
          >
            Guide : Générer le Graphique
          </h2>

          <div className="space-y-5 mb-10">
            <div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-1.5">
                1. Exporter les données
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dans la simulation, cliquez sur le bouton{" "}
                <strong className="text-foreground">Export Data</strong>. Le
                fichier{" "}
                <code className="text-neon-orange/80">recompenses_TPE.dat</code>{" "}
                sera généré dans{" "}
                <code className="text-muted-foreground/80">
                  Models/blockchain
                </code>
                .
              </p>
            </div>

            <div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-1.5">
                2. Script Gnuplot (draw.plt)
              </h4>
              <div className="font-mono text-xs bg-[#1a1a2e] border border-white/[0.06] rounded-lg p-4 leading-relaxed text-[#d4d4d4] overflow-x-auto">
                <p>
                  <span className="text-neon-blue">set</span> terminal pngcairo
                  size 1000,800 enhanced font 'Segoe UI,12'
                </p>
                <p>
                  <span className="text-neon-blue">set</span> output
                  'resultat_histogramme_final.png'
                </p>
                <p>
                  <span className="text-neon-blue">set</span> title
                  "Répartition des Récompenses"
                </p>
                <p>
                  <span className="text-neon-blue">set</span> xlabel
                  "Identifiant du Nœud"
                </p>
                <p>
                  <span className="text-neon-blue">set</span> ylabel "Bitcoins
                  Gagnés (BTC)"
                </p>
                <p>
                  <span className="text-neon-blue">set</span> grid y
                </p>
                <p>
                  <span className="text-neon-blue">set</span> boxwidth 0.5
                  relative
                </p>
                <p>
                  <span className="text-neon-blue">set</span> style fill solid
                  0.8 border rgb "black"
                </p>
                <p>
                  <span className="text-neon-blue">plot</span>{" "}
                  'recompenses_TPE.dat' using 2:xtic(1) with boxes title "Solde
                  BTC" linecolor rgb "gold"
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-1.5">
                3. Lancer la commande
              </h4>
              <div className="font-mono text-xs bg-[#1a1a2e] border border-white/[0.06] rounded-lg p-4 text-[#d4d4d4]">
                <span className="text-neon-green">
                  C:\Users\...\Models\blockchain&gt;
                </span>{" "}
                gnuplot draw.plt
              </div>
            </div>

            <div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-1.5">
                4. Résultat
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                L'image{" "}
                <code className="text-neon-orange/80">
                  resultat_histogramme_final.png
                </code>{" "}
                apparaîtra dans le dossier — l'histogramme de répartition des
                récompenses entre les mineurs.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-4 px-6 text-center">
        <p className="text-[11px] text-muted-foreground/40 font-mono">
          Documentation PoW — BlockchainTPE — Université Le Havre Normandie 2025-2026
        </p>
      </footer>

      {/* Code Modal */}
      <CodeModal
        open={!!modal}
        title={modal?.title ?? ""}
        code={modal?.code ?? ""}
        onClose={() => setModal(null)}
      />
    </div>
  );
};

export default DocPoW;
