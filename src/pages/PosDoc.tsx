import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Blocks,
  ArrowLeft,
  Package,
  Box,
  Code2,
  X,
  Play,
} from "lucide-react";

interface MethodDetail {
  anchor: string;
  signature: string;
  description: string;
  codeId: string;
}

const POS_SIMULATION_URL =
  "https://cloud.anylogic.com/model/4121eec8-1a50-45ff-b486-6852d841a568";

const codeSnippets: Record<string, string> = {
  "code-Agent_Main-slotConsensus": `traceln("===============================================");
traceln("NOUVEAU SLOT DEMARRE");

for (noeud n : this.noeuds) {
  if (n.estConnecte == true) {
    if (n.stake < 32.0) {
      if (randomTrue(0.02)) {
        n.stake = 32.0;
        n.revertColorEvent.restart(0.01, SECOND);
        traceln("IN : Le Noeud " + n.getIndex() + " verrouille 32 ETH et devient Validateur !");
      }
    } else if (n.stake == 32.0) {
      if (randomTrue(0.02)) {
        n.stake = 0.0;
        n.revertColorEvent.restart(0.01, SECOND);
        traceln("OUT : Le Validateur " + n.getIndex() + " retire ses fonds et redevient passif.");
      }
    }
  }
}

List<noeud> validateursActifs = new ArrayList<noeud>();
for (noeud n : this.noeuds) {
  if (n.estConnecte == true && n.stake == 32.0) {
    validateursActifs.add(n);
  }
}

if (validateursActifs.isEmpty()) {
  traceln("MISSED SLOT : Aucun validateur actif en ligne.");
  return;
}

int indexGagnant = uniform_discr(0, validateursActifs.size() - 1);
noeud gagnant = validateursActifs.get(indexGagnant);
traceln("Le Validateur " + gagnant.getIndex() + " est selectionne pour forger le bloc !");
gagnant.effectuerMinage();`,
  "code-Agent_Main-evtInstabilite": `for (noeud n : noeuds) {
  if (n.estConnecte) {
    if (randomTrue(0.05)) {
      n.estConnecte = false;
      n.voisinsSauvegardes.clear();
      for (Agent voisin : n.getConnections()) {
        n.voisinsSauvegardes.add((noeud) voisin);
      }
      n.connections.disconnectFromAll();
      n.voyant_rect.setFillColor(gray);
    }
  } else {
    if (randomTrue(0.50)) {
      n.estConnecte = true;
      for (noeud ancienVoisin : n.voisinsSauvegardes) {
        n.connections.connectTo(ancienVoisin);
      }
      n.voisinsSauvegardes.clear();
      if (n.stake >= 32.0) {
        n.voyant_rect.setFillColor(cyan);
      } else {
        n.voyant_rect.setFillColor(black);
      }
    }
  }
}`,
  "code-Agent_Noeud-effectuerMinage": `if (this.estConnecte == false) return;

String previousHash = "0";
if (!this.blockchain.isEmpty()) {
  previousHash = this.blockchain.get(this.blockchain.size() - 1).hash;
}

Block nouveauBloc = new Block("Transactions du Slot", previousHash);
nouveauBloc.hash = nouveauBloc.calculateHash();

this.blockchain.add(nouveauBloc);
double RECOMPENSE_POS = 0.05;
this.balance = this.balance + RECOMPENSE_POS;
this.recompensesTotales = this.recompensesTotales + RECOMPENSE_POS;

updateVisuals();
voyant_rect.setFillColor(lightGreen);
revertColorEvent.restart(1.0, SECOND);

for (Agent voisin : getConnections()) {
  if (main.chk_simulerFork.isSelected()) {
    create_SendWithDelayEvent(uniform(1.0, 3.0), SECOND, nouveauBloc, voisin);
  } else {
    Messager m = main.add_messagers();
    m.setXY(this.getX(), this.getY());
    m.cible = (noeud) voisin;
    m.blocTransporte = nouveauBloc;
    m.expediteur = this;
    m.moveTo(voisin.getX(), voisin.getY());
  }
}`,
  "code-Agent_Noeud-updateVisuals": `int chainSize = blockchain.size();
chainLengthText.setText("Blocks: " + chainSize);`,
  "code-Agent_Noeud-revertColorEvent": `if (this.estConnecte == false) {
  voyant_rect.setFillColor(gray);
} else if (this.stake >= 32.0) {
  voyant_rect.setFillColor(cyan);
} else {
  voyant_rect.setFillColor(black);
  indexText.setColor(white);
  chainLengthText.setColor(white);
}`,
  "code-Agent_Noeud-onReceive": `if (this.estConnecte == false) {
    return;
}

if (msg instanceof Block) {
    Block receivedBlock = (Block) msg;

    for (Block b : blockchain) {
        if (b.hash.equals(receivedBlock.hash)) return;
    }

    noeud vraiExpediteur;
    if (sender instanceof Messager) {
        vraiExpediteur = ((Messager) sender).expediteur;
    } else {
        vraiExpediteur = (noeud) sender;
    }

    boolean isValid = receivedBlock.calculateHash().equals(receivedBlock.hash);
    if (!isValid) {
        voyant_rect.setFillColor(red);
        revertColorEvent.restart(1.0, SECOND);
        return;
    }

    String myLastHash = "0";
    if (!this.blockchain.isEmpty()) {
        myLastHash = this.blockchain.get(this.blockchain.size() - 1).hash;
    }

    if (this.blockchain.isEmpty() || receivedBlock.previousHash.equals(myLastHash)) {
        this.blockchain.add(receivedBlock);
        updateVisuals();
        voyant_rect.setFillColor(blue);
        revertColorEvent.restart(1.0, SECOND);
    } else if (vraiExpediteur.blockchain.size() > this.blockchain.size()) {
        this.blockchain = new ArrayList<Block>(vraiExpediteur.blockchain);
        updateVisuals();
        voyant_rect.setFillColor(blue);
        revertColorEvent.restart(1.0, SECOND);
    }
}`,
  "code-Agent_Messager-onArrival": `expediteur.send(blocTransporte, cible);
main.remove_messagers(this);`,
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
};

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
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-neon-green" />
              <span className="font-mono text-sm text-foreground">{title}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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

const SideLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className={`block px-3 py-1.5 text-[13px] rounded-md transition-colors hover:bg-white/[0.04] text-muted-foreground hover:text-foreground`}
  >
    {children}
  </a>
);

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
              className="text-left py-2.5 px-4 font-medium text-neon-green/80 bg-neon-green/[0.04] border border-white/[0.06] text-xs uppercase tracking-wider"
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
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-neon-green/20 bg-neon-green/[0.06] text-neon-green hover:bg-neon-green/[0.12] transition-colors"
    >
      <Code2 className="w-3 h-3" />
      Voir le code
    </button>
  </div>
);

/* ═══════════════════════ PAGE COMPONENT ═══════════════════════ */
const PosDoc = () => {
  const [modal, setModal] = useState<{ title: string; code: string } | null>(null);

  const openCode = (title: string, codeId: string) => {
    setModal({ title, code: codeSnippets[codeId] || "// Code non disponible" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Top Bar ─── */}
      <div className="bg-neon-green/[0.06] border-b border-neon-green/15 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <span className="text-xs font-mono text-neon-green">Documentation</span>
        </div>
        <a
          href={POS_SIMULATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-md bg-neon-green/[0.08] text-neon-green border border-neon-green/20 hover:bg-neon-green/[0.15] transition-all"
        >
          <Play className="w-3 h-3" />
          Lancer la simulation PoS
        </a>
      </div>

      {/* ─── Header ─── */}
      <header className="border-b border-white/[0.06] px-6 py-6 bg-card/40">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neon-green/[0.08] border border-neon-green/20 flex items-center justify-center">
              <Blocks className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">
                Blockchain PoS Simulation
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Packages : <code className="text-neon-green/80">agents</code>,{" "}
                <code className="text-neon-green/80">models</code>
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
            className="flex items-center gap-1.5 text-xs text-neon-green hover:text-neon-green/80 transition-colors"
          >
            <Package className="w-3 h-3" />
            agents
          </a>
          <a
            href="#package-models"
            className="flex items-center gap-1.5 text-xs text-neon-green hover:text-neon-green/80 transition-colors"
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
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50 px-3 mb-2">
              Package models
            </p>
            <SideLink href="#class-Block">Block</SideLink>
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
            fondé sur la preuve d'enjeu (Proof-of-Stake) avec validation par slots.
          </p>

          <h2 className="text-xl font-heading font-semibold mb-3 pb-2 border-b border-white/[0.06]">
            Liste des classes
          </h2>
          <SummaryTable
            headers={["Classe", "Description"]}
            rows={[
              [
                <a href="#class-Agent_Main" className="font-mono text-neon-green hover:underline">agents.Agent_Main</a>,
                "Agent racine qui orchestre les slots de consensus et l'instabilité du réseau.",
              ],
              [
                <a href="#class-Agent_Noeud" className="font-mono text-neon-green hover:underline">agents.Agent_Noeud</a>,
                "Validateur/passif qui forge des blocs et maintient une copie locale de la blockchain.",
              ],
              [
                <a href="#class-Agent_Messager" className="font-mono text-neon-green hover:underline">agents.Agent_Messager</a>,
                "Agent mobile représentant la propagation visuelle d'un bloc.",
              ],
              [
                <a href="#class-Block" className="font-mono text-muted-foreground hover:underline">models.Block</a>,
                "Structure de données d'un bloc, incluant le hachage SHA-256, previousHash et nonce.",
              ],
            ]}
          />

          {/* ═══════ Agent_Main ═══════ */}

          <h2
            id="class-Agent_Main"
            className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-green/20 mt-12 text-neon-green"
          >
            agents.Agent_Main
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Agent principal du réseau PoS. Il orchestre le slot de 12 secondes, fait
            évoluer le staking/désengagement des nœuds, puis choisit uniformément un
            validateur parmi ceux qui ont staké 32 ETH.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Résumé des champs et objets
          </h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">ArrayList&lt;noeud&gt;</code>, <code className="font-mono text-xs text-neon-green">noeuds</code>, "Liste de tous les nœuds du réseau."],
              [<code className="font-mono text-xs">ArrayList&lt;Messager&gt;</code>, <code className="font-mono text-xs text-neon-green">messagers</code>, "Agents de transport visuel des blocs."],
              [<code className="font-mono text-xs">Event</code>, <code className="font-mono text-xs text-neon-green">evt_SlotConsensus</code>, "Événement cyclique de sélection/forgeage."],
              [<code className="font-mono text-xs">Event</code>, <code className="font-mono text-xs text-neon-green">evt_Instabilite</code>, "Événement cyclique de panne/reconnexion du réseau."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Détails des méthodes
          </h3>
          <MethodDetailBlock
            detail={{
              anchor: "Agent_Main-evt_SlotConsensus",
              signature: "Event evt_SlotConsensus",
              description:
                "À chaque slot, met à jour le staking des nœuds, reconstruit la liste des validateurs actifs, puis en choisit un au hasard pour forger le bloc.",
              codeId: "code-Agent_Main-slotConsensus",
            }}
            onViewCode={openCode}
          />
          <MethodDetailBlock
            detail={{
              anchor: "Agent_Main-evt_Instabilite",
              signature: "Event evt_Instabilite",
              description:
                "Parcourt tous les nœuds: coupure aléatoire des connexions, sauvegarde des voisins, puis reconnexion partielle avec restauration du maillage.",
              codeId: "code-Agent_Main-evtInstabilite",
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
            Nœud du réseau PoS. Il peut être passif ou validateur, forge un bloc
            instantanément lorsqu'il est sélectionné, puis met à jour sa visualisation
            locale.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Résumé des champs et éléments visuels
          </h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">double</code>, <code className="font-mono text-xs text-neon-green">stake</code>, "Mise économique courante (0 ou 32 ETH)."],
              [<code className="font-mono text-xs">double</code>, <code className="font-mono text-xs text-neon-green">balance</code>, "Solde du nœud, incrémenté lors des blocs forgés."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-green">estConnecte</code>, "État de connectivité réseau."],
              [<code className="font-mono text-xs">ArrayList&lt;Block&gt;</code>, <code className="font-mono text-xs text-neon-green">blockchain</code>, "Copie locale de la chaîne de blocs."],
              [<code className="font-mono text-xs">ArrayList&lt;noeud&gt;</code>, <code className="font-mono text-xs text-neon-green">voisinsSauvegardes</code>, "Voisins mémorisés pour la restauration après panne."],
              [<code className="font-mono text-xs">double</code>, <code className="font-mono text-xs text-neon-green">recompensesTotales</code>, "Total cumulé des récompenses de forge."],
              [<code className="font-mono text-xs">Text</code>, <code className="font-mono text-xs text-neon-green">rewardText</code>, "Affiche balance et stake en ETH."],
              [<code className="font-mono text-xs">Text</code>, <code className="font-mono text-xs text-neon-green">chainLengthText</code>, "Affiche la hauteur de la chaîne locale."],
              [<code className="font-mono text-xs">Text</code>, <code className="font-mono text-xs text-neon-green">indexText</code>, "Affiche l'identifiant du nœud ou du validateur."],
              [<code className="font-mono text-xs">Rectangle</code>, <code className="font-mono text-xs text-neon-green">voyant_rect</code>, "Voyant de couleur du nœud."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Détails des méthodes
          </h3>
          {([
            {
              anchor: "Agent_Noeud-effectuerMinage",
              signature: "public void effectuerMinage()",
              description:
                "Forge instantanément un bloc, ajoute une récompense de 0.05 ETH et diffuse le bloc aux voisins via des messagers ou des délais simulés.",
              codeId: "code-Agent_Noeud-effectuerMinage",
            },
            {
              anchor: "Agent_Noeud-updateVisuals",
              signature: "void updateVisuals()",
              description:
                "Met à jour uniquement la hauteur de la chaîne locale dans l'interface; la balance et le stake sont affichés par rewardText.",
              codeId: "code-Agent_Noeud-updateVisuals",
            },
            {
              anchor: "Agent_Noeud-revertColorEvent",
              signature: "Event revertColorEvent",
              description:
                "Restaure la couleur du nœud selon son état: déconnecté, validateur ou passif.",
              codeId: "code-Agent_Noeud-revertColorEvent",
            },
            {
              anchor: "Agent_Noeud-radarConnexion",
              signature: "Event RadarConnexion",
              description:
                "Maintient au moins trois connexions en recherchant de nouveaux voisins éligibles, puis resynchronise la chaîne avec le meilleur voisin.",
              codeId: "code-Agent_Noeud-onReceive",
            },
            {
              anchor: "Agent_Noeud-onMessageReceived",
              signature: "public void onMessageReceived(Object msg, Agent sender)",
              description:
                "Valide les blocs reçus, les ajoute si le chaînage est cohérent, ou synchronise la chaîne locale si l'émetteur possède une chaîne plus longue.",
              codeId: "code-Agent_Noeud-onReceive",
            },
          ] as MethodDetail[]).map((d) => (
            <MethodDetailBlock key={d.anchor} detail={d} onViewCode={openCode} />
          ))}

          {/* ═══════ Agent_Messager ═══════ */}
          <h2
            id="class-Agent_Messager"
            className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-green/20 mt-12 text-neon-green"
          >
            agents.Agent_Messager
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Agent mobile qui transporte visuellement un bloc d'un nœud expéditeur
            vers un nœud cible.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Résumé des champs
          </h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">Agent</code>, <code className="font-mono text-xs text-neon-green">cible</code>, "Nœud destinataire du bloc."],
              [<code className="font-mono text-xs">noeud</code>, <code className="font-mono text-xs text-neon-green">expediteur</code>, "Nœud émetteur du message."],
              [<code className="font-mono text-xs">Block</code>, <code className="font-mono text-xs text-neon-green">blocTransporte</code>, "Bloc véhiculé pendant le déplacement."],
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
                "À l'arrivée, remet le bloc transporté au nœud cible puis détruit l'agent messager.",
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
            Classe modèle d'un bloc PoS. Elle stocke les données de création,
            previousHash, timestamp, nonce et hash. Les champs statiques de
            difficulté existent dans le source, mais ils ne sont pas exploités par la
            logique effective que la doc met en avant ici.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">
            Résumé des champs
          </h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">hash</code>, "Hash courant du bloc."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">previousHash</code>, "Hash du bloc précédent."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">transactions</code>, "Contenu transactionnel du bloc."],
              [<code className="font-mono text-xs">long</code>, <code className="font-mono text-xs">timestamp</code>, "Horodatage de création."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs">nonce</code>, "Nonce conservé dans la structure du bloc."],
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
                "Crée un nouveau bloc en initialisant transactions, previousHash, timestamp, nonce à 0 puis calcule un premier hash.",
              codeId: "code-Block-ctor",
            },
            {
              anchor: "Block-calculateHash",
              signature: "public String calculateHash()",
              description:
                "Concatène previousHash + timestamp + nonce + transactions, applique SHA-256 via MessageDigest et retourne la chaîne hexadécimale.",
              codeId: "code-Block-calculateHash",
            },
          ] as MethodDetail[]).map((d) => (
            <MethodDetailBlock key={d.anchor} detail={d} onViewCode={openCode} />
          ))}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-4 px-6 text-center">
        <p className="text-[11px] text-muted-foreground/40 font-mono">
          Documentation PoS — BlockchainTPE — Université Le Havre Normandie 2025-2026
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

export default PosDoc;
