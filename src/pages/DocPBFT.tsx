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

const PBFT_SIMULATION_URL =
  "https://cloud.anylogic.com/model/5110a506-ee5f-463d-91c1-09576efbfa6d?mode=SETTINGS&tab=GENERAL";

/* ──────────────────────── Code Snippets (extraits fidèles PBFT.alp) ─────────────────────── */
const codeSnippets: Record<string, string> = {

  /* ── Main ── */
  "code-Main-startup": `client.setXY(1000, 50);
// 1. DISPOSITION EN ELLIPSE
double rayonX = 450.0;
double rayonY = 250.0;
double centreX = 550.0;
double centreY = 350.0;

for (int i = 0; i < this.noeuds.size(); i++) {
    noeud n = this.noeuds.get(i);
    double angle = i * 2 * Math.PI / this.noeuds.size();
    n.setXY(centreX + rayonX * Math.cos(angle), centreY + rayonY * Math.sin(angle));
}

// 2. FORCER LE FULL MESH INSTANTANÉ
for (noeud n1 : this.noeuds) {
    for (noeud n2 : this.noeuds) {
        if (n1 != n2 && !n1.isConnectedTo(n2)) {
            n1.connectTo(n2);
        }
    }
}

// 3. COURONNEMENT DU PREMIER LEADER
this.noeuds.get(0).estLeader = true;`,

  "code-Main-declencherConsensus": `void declencherConsensus() {
if (enCoursDeViewChange || consensusEnCours) return;
consensusEnCours = true;
roundActuel++;
client.reponsesRecues = 0;
alerteFraudeRapportee = false;
nbValideGlobal = 0;
nbReject = 0;

List<noeud> listeSaine = new ArrayList<>();
for (noeud n : noeuds) {
    n.veutTricher = false;
    n.estMalveillant = false;
    if (n.estConnecte) {
        listeSaine.add(n);
        n.votesPrepare = 0;
        n.votesCommit = 0;
        n.sendersPrepare.clear();
        n.sendersCommit.clear();
    }
}

noeud leaderActuel = noeuds.get(indexLeader);
if (!leaderActuel.estConnecte) {
    int tentatives = 0;
    do { indexLeader = (indexLeader + 1) % noeuds.size(); tentatives++;
    } while (!noeuds.get(indexLeader).estConnecte && tentatives < noeuds.size());
    leaderActuel = noeuds.get(indexLeader);
}

Collections.shuffle(listeSaine);
int nbTricheurs = uniform_discr(0, 3);
for (int i = 0; i < nbTricheurs && i < listeSaine.size(); i++) {
    listeSaine.get(i).veutTricher = true;
}

String previousHash = "0000";
if (!leaderActuel.blockchain.isEmpty() &&
    leaderActuel.blockchain.get(leaderActuel.blockchain.size() - 1) != null) {
    previousHash = leaderActuel.blockchain.get(leaderActuel.blockchain.size() - 1).hash;
}

leaderActuel.blocEnCours = new Block("Batch_10_TX", previousHash);
if (leaderActuel.veutTricher) leaderActuel.blocEnCours.hash = "FAUX_HASH_666";

leaderActuel.votesPrepare = 1;
leaderActuel.sendersPrepare.add(leaderActuel.getIndex());

traceln("🚀 Round " + roundActuel + " : Le Leader " + leaderActuel.getIndex() + " lance le consensus");
leaderActuel.statechart.receiveMessage("GO_LEADER");

for (noeud voisin : noeuds) {
    if (voisin != leaderActuel && leaderActuel.isConnectedTo(voisin)) {
        Messager m = add_messagers();
        m.setXY(leaderActuel.getX(), leaderActuel.getY());
        m.cible = voisin;
        m.expediteur = leaderActuel;
        m.typeMessage = "PRE-PREPARE";
        m.roundDuMessage = roundActuel;
        m.blocTransporte = leaderActuel.blocEnCours;
        m.moveTo(voisin.getX(), voisin.getY());
    }
}

evt_ResumeRound.restart(7, SECOND);
}`,

  "code-Main-demanderNouveauLeader": `void demanderNouveauLeader(noeud envoyeur) {
    for (Agent a : envoyeur.getConnections()) {
        noeud voisin = (noeud) a;
        Messager m = add_messagers();
        m.setXY(envoyeur.getX(), envoyeur.getY());
        m.cible = voisin;
        m.expediteur = envoyeur;
        m.typeMessage = "VIEW-CHANGE";
        m.moveTo(voisin.getX(), voisin.getY());
    }
}`,

  "code-Main-getQuorum": `int getQuorum() {
    int f = (int) Math.floor((p_numNoeuds - 1) / 3);
    return 2 * f + 1;
}`,

  "code-Main-evt_Instabilite": `// Déclenché toutes les 30 s — simule pannes et rétablissements
for (noeud n : noeuds) {
    // 1. PANNE (p_probaPanne % de malchance)
    if (n.estConnecte && randomTrue(p_probaPanne)) {
        n.estConnecte = false;
        n.estLeader = false; // perd la couronne en tombant

        n.voisinsSauvegardes.clear();
        for (Agent voisin : n.getConnections()) {
            n.voisinsSauvegardes.add((noeud) voisin);
        }
        n.connections.disconnectFromAll();
        n.voyant_rect.setFillColor(gray);
    }
    // 2. RÉTABLISSEMENT (50 % de chance)
    else if (!n.estConnecte && randomTrue(0.50)) {
        n.estConnecte = true;
        for (noeud ancienVoisin : n.voisinsSauvegardes) {
            if (ancienVoisin.estConnecte) n.connections.connectTo(ancienVoisin);
        }
        n.voisinsSauvegardes.clear();
        n.voyant_rect.setFillColor(magenta);
        n.revertColorEvent.restart(1.0, SECOND);
    }
}`,

  "code-Main-Watchdog_Leader": `// Déclenché toutes les 1 s — surveille le leader
noeud leaderActuel = noeuds.get(indexLeader);

// 1. DÉBLOCAGE D'URGENCE : consensus bloqué mais leader vivant
if (consensusEnCours && leaderActuel.statechart.isStateActive(leaderActuel.Attente)) {
    consensusEnCours = false;
}

// 2. CRASH LEADER
if (leaderActuel.estConnecte == false && !enCoursDeViewChange) {
    enCoursDeViewChange = true;
    consensusEnCours = false;
    traceln("⏰ Le Leader " + leaderActuel.getIndex() + " ne répond plus ! Vote de destitution...");
    for (noeud n : noeuds) {
        if (n.estConnecte) demanderNouveauLeader(n);
    }
}`,

  "code-Main-Mandat_Leader": `// Déclenché après p_mandatLeader secondes (défaut 100 s)
if (!enCoursDeViewChange) {
    enCoursDeViewChange = true;
    traceln("⏱️ 100 secondes écoulées ! Fin du mandat du Leader " + indexLeader + ".");
    for (noeud n : noeuds) {
        if (n.estConnecte) demanderNouveauLeader(n);
    }
}`,

  "code-Main-evt_LogFraude": `// Déclenché 1 s après détection de fraude (one-shot)
if (this.alerteFraudeRapportee) {
    int n = 0;
    for (noeud node : noeuds) if (node.veutTricher) n++;
    String s = (n > 1) ? "s" : "";
    traceln("⚠️ " + n + " nœud" + s + " malveillant" + s + " détecté" + s);
}`,

  "code-Main-evt_ResumeRound": `// Déclenché 7 s après le lancement du consensus (one-shot)
if (roundActuel > 0) {
    int f = (int) Math.floor((p_numNoeuds - 1) / 3);
    int quorumClientRequis = f + 1;
    int quorum = getQuorum();

    traceln("-----------------------------------------");
    traceln("📊 BILAN DU RÉSEAU - ROUND " + roundActuel);

    if (nbValideGlobal >= quorum) {
        traceln("🌐 Résultat : BLOC VALIDÉ ✅");
    } else if (nbReject > 0) {
        traceln("🌐 Résultat : BLOC REJETÉ ❌");
        traceln("❓ Cause : Fraude du Leader");
    } else {
        traceln("🌐 Résultat : BLOC REJETÉ ❌");
        traceln("❓ Cause : Quorum non atteint");
    }

    if (client.reponsesRecues >= quorumClientRequis) {
        traceln("👤 Client : Transaction CONFIRMÉE ✅");
    } else {
        traceln("👤 Client : Transaction EN ATTENTE ⏳ (Preuves insuffisantes)");
    }
    traceln("-----------------------------------------");
}`,

  /* ── noeud ── */
  "code-noeud-state-Attente-entry": `// EntryAction état Attente
voyant_rect.setFillColor(darkGray);`,

  "code-noeud-state-PrePrepare-entry": `// EntryAction état PrePrepare
voyant_rect.setFillColor(cyan);`,

  "code-noeud-state-Prepare-entry": `// EntryAction état Prepare
voyant_rect.setFillColor(yellow);
Main main = (Main) getOwner();

Block b = this.veutTricher ? new Block("FRAUDE", "0") : this.blocEnCours;
if (this.veutTricher) b.hash = "FAUX_HASH_666";

for (Agent a : this.getConnections()) {
    noeud voisin = (noeud) a;
    Messager m = main.add_messagers();
    m.setXY(this.getX(), this.getY());
    m.cible = voisin;
    m.expediteur = this;
    m.blocTransporte = b;
    m.typeMessage = "PREPARE";
    m.roundDuMessage = main.roundActuel;
    m.moveTo(voisin.getX(), voisin.getY());
}

// Auto-vote
if (!this.sendersPrepare.contains(this.getIndex())) {
    this.sendersPrepare.add(this.getIndex());
    this.votesPrepare++;
    this.onChange();
}`,

  "code-noeud-state-Commit-entry": `// EntryAction état Commit
voyant_rect.setFillColor(orange);
Main main = (Main) getOwner();

// Auto-vote Commit
if (!this.sendersCommit.contains(this.getIndex())) {
    this.sendersCommit.add(this.getIndex());
    this.votesCommit++;
    this.onChange();
}

Block b = this.veutTricher ? new Block("FRAUDE", "0") : this.blocEnCours;
if (this.veutTricher) b.hash = "FAUX_HASH_666";

for (Agent a : this.getConnections()) {
    noeud voisin = (noeud) a;
    Messager m = main.add_messagers();
    m.setXY(this.getX(), this.getY());
    m.cible = voisin;
    m.expediteur = this;
    m.blocTransporte = b;
    m.typeMessage = "COMMIT";
    m.roundDuMessage = main.roundActuel;
    m.moveTo(voisin.getX(), voisin.getY());
}`,

  "code-noeud-state-Valide-entry": `// EntryAction état Valide
voyant_rect.setFillColor(lightGreen);
Main main = (Main) getOwner();
main.nbValideGlobal++;

Block blocValide = this.blocEnCours;
if (blocValide != null) {
    boolean estNouveau = blockchain.isEmpty() ||
        !blockchain.get(blockchain.size()-1).hash.equals(blocValide.hash);
    if (estNouveau) {
        blockchain.add(blocValide);
        this.updateVisuals();
    }

    // Envoi d'une réponse REPLY au Client
    if (main.client != null) {
        Messager m = main.add_messagers();
        m.setXY(this.getX(), this.getY());
        m.cibleClient = main.client;
        m.expediteur = this;
        m.typeMessage = "REPLY";
        m.blocTransporte = blocValide;
        m.roundDuMessage = main.roundActuel;
        m.moveTo(m.cibleClient.getX(), m.cibleClient.getY());
    }
}`,

  "code-noeud-state-Rejet-entry": `// EntryAction état Rejet
voyant_rect.setFillColor(red);`,

  "code-noeud-updateVisuals": `void updateVisuals() {
    int chainSize = blockchain.size();
    String chainLabel = "Blocks: " + chainSize;
    if (chainLengthText != null) {
        chainLengthText.setText(chainLabel);
    }
}`,

  "code-noeud-revertColorEvent": `// Déclenché 1 s après certaines transitions visuelles (recurrence = 1 s)
if (this.estConnecte == false) {
    voyant_rect.setFillColor(gray);
    return;
}
if      (this.statechart.isStateActive(Attente))    voyant_rect.setFillColor(darkGray);
else if (this.statechart.isStateActive(PrePrepare)) voyant_rect.setFillColor(cyan);
else if (this.statechart.isStateActive(Prepare))    voyant_rect.setFillColor(yellow);
else if (this.statechart.isStateActive(Commit))     voyant_rect.setFillColor(orange);
else if (this.statechart.isStateActive(Valide))     voyant_rect.setFillColor(lightGreen);
else if (this.statechart.isStateActive(Rejet))      voyant_rect.setFillColor(red);`,

  "code-noeud-RadarConnexion": `// Déclenché toutes les 2 s — maintient le full-mesh et synchronise la blockchain
if (this.estConnecte == false) return;

Main mainAgent = (Main) getOwner();
int nombreVoisinsVoulu = mainAgent.p_numNoeuds - 1;
boolean dejaConnecte = this.getConnections().size() >= nombreVoisinsVoulu;

if (!dejaConnecte) {
    for (noeud candidat : mainAgent.noeuds) {
        if (this.getConnections().size() >= nombreVoisinsVoulu) break;
        if (candidat != this && candidat.estConnecte && !this.isConnectedTo(candidat)) {
            this.connectTo(candidat);
        }
    }
}

// Synchronisation blockchain (uniquement depuis Attente)
noeud meilleurVoisin = null;
int meilleurHauteur = this.blockchain.size();
for (Agent a : getConnections()) {
    if (a instanceof noeud) {
        noeud voisin = (noeud) a;
        if (voisin.estConnecte && voisin.blockchain.size() > meilleurHauteur) {
            meilleurHauteur = voisin.blockchain.size();
            meilleurVoisin = voisin;
        }
    }
}
if (meilleurVoisin != null && this.statechart.isStateActive(Attente)) {
    this.blockchain = new ArrayList<Block>(meilleurVoisin.blockchain);
    if (this.chainLengthText != null)
        this.chainLengthText.setText("Blocks: " + this.blockchain.size());
    this.updateVisuals();
    this.voyant_rect.setFillColor(magenta);
    this.revertColorEvent.restart(0.5, SECOND);
}`,

  /* ── Messager ── */
  "code-Messager-onArrival": `// ─── 1. RÉPONSE AU CLIENT ───────────────────────────────────
if (cibleClient != null) {
    if (typeMessage.equals("REPLY") && blocTransporte != null
            && !blocTransporte.hash.equals("FAUX_HASH_666")) {
        cibleClient.reponsesRecues++;
        main.remove_messagers(this);
        return;
    }
}

// Cible inexistante ou hors-ligne → abandon
if (cible == null || !cible.estConnecte) {
    main.remove_messagers(this);
    return;
}

// ─── 2. DÉTECTION DE FRAUDE ─────────────────────────────────
if (blocTransporte != null && blocTransporte.hash.equals("FAUX_HASH_666")) {
    if (expediteur != null) expediteur.estMalveillant = true;
    if (!main.alerteFraudeRapportee) {
        main.alerteFraudeRapportee = true;
        main.evt_LogFraude.restart(1, SECOND);
    }
}

// ─── 3. REQUEST ─────────────────────────────────────────────
if (typeMessage.equals("REQUEST")) {
    main.compteurBatch++;
    if (main.compteurBatch >= 10) {
        main.compteurBatch = 0;
        main.declencherConsensus();
    }
    main.remove_messagers(this);
    return;
}

// ─── 4. VIEW-CHANGE ─────────────────────────────────────────
if (typeMessage.equals("VIEW-CHANGE")) {
    if (!main.enCoursDeViewChange) { main.remove_messagers(this); return; }
    cible.votesViewChange++;
    if (cible.votesViewChange >= main.getQuorum() && main.enCoursDeViewChange) {
        for (noeud n : main.noeuds) n.votesViewChange = 0;
        int tentatives = 0;
        do {
            main.indexLeader = (main.indexLeader + 1) % main.noeuds.size();
            tentatives++;
        } while (!main.noeuds.get(main.indexLeader).estConnecte && tentatives < main.noeuds.size());
        for (noeud n : main.noeuds) n.estLeader = false;
        main.noeuds.get(main.indexLeader).estLeader = true;
        traceln("🔄 VIEW CHANGE : Nœud " + main.indexLeader + " élu.");
        main.enCoursDeViewChange = false;
        main.consensusEnCours = false;
        main.Mandat_Leader.restart(main.p_mandatLeader, SECOND);
    }
    main.remove_messagers(this);
    return;
}

// ─── 5. PHASES PBFT (PRE-PREPARE / PREPARE / COMMIT) ────────
if (roundDuMessage < main.roundActuel) { main.remove_messagers(this); return; }

int idExp = (expediteur != null) ? expediteur.getIndex() : -1;

if (typeMessage.equals("PRE-PREPARE")) {
    if (blocTransporte.hash.equals("FAUX_HASH_666")) {
        cible.statechart.receiveMessage("FRAUDE");
        main.nbReject++;
        main.enCoursDeViewChange = true;
        main.consensusEnCours = false;
        main.demanderNouveauLeader(cible);
        main.remove_messagers(this);
        return;
    }
    cible.blocEnCours = blocTransporte;
    if (idExp != -1 && !cible.sendersPrepare.contains(idExp)) {
        cible.sendersPrepare.add(idExp);
        cible.votesPrepare++;
    }
    cible.statechart.receiveMessage("PRE-PREPARE");

} else if (typeMessage.equals("PREPARE") || typeMessage.equals("COMMIT")) {
    if (cible.blocEnCours != null
            && blocTransporte.hash.equals(cible.blocEnCours.hash)
            && idExp != -1) {
        if (typeMessage.equals("PREPARE") && !cible.sendersPrepare.contains(idExp)) {
            cible.sendersPrepare.add(idExp);
            cible.votesPrepare++;
            cible.onChange();
        }
        if (typeMessage.equals("COMMIT") && !cible.sendersCommit.contains(idExp)) {
            cible.sendersCommit.add(idExp);
            cible.votesCommit++;
            cible.onChange();
        }
    }
}

main.remove_messagers(this);`,

  /* ── Client ── */
  "code-Client-evt_EnvoiRequete": `// Déclenché toutes les 2,5 s — envoie une requête REQUEST au leader courant
noeud leader = main.noeuds.get(main.indexLeader);
Messager m = main.add_messagers();
m.setXY(this.getX(), this.getY());
m.cible = leader;
m.expediteurClient = this;
m.typeMessage = "REQUEST";
m.setSpeed(20);
m.moveTo(leader.getX(), leader.getY());`,

  /* ── Block ── */
  "code-Block-ctor": `import java.security.MessageDigest;
import java.util.Date;

public class Block {

    // Variables statiques
    public static int difficulty = 3;
    public static String difficultyTarget =
        new String(new char[difficulty]).replace('\\0', '0');

    // Variables d'instance
    public String hash;
    public String previousHash;
    public String transactions;
    public long   timestamp;
    public int    nonce;

    public Block(String transactions, String previousHash) {
        this.transactions  = transactions;
        this.previousHash  = previousHash;
        this.timestamp     = new Date().getTime();
        this.nonce         = 0;
        this.hash          = calculateHash();
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
  detail: { anchor: string; signature: string; description: string; codeId: string };
  onViewCode: (title: string, codeId: string) => void;
}) => (
  <div id={detail.anchor} className="mb-8 glass-card p-5">
    <div className="mb-3">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50">
        Signature
      </span>
      <code className="block mt-1 font-mono text-[13px] text-neon-blue/90 bg-white/[0.02] rounded-md px-3 py-2 border border-white/[0.04]">
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

/* ──────────────────── Event Detail Block ──────────────────── */
const EventDetailBlock = ({
  name,
  timing,
  description,
  codeId,
  onViewCode,
}: {
  name: string;
  timing: string;
  description: string;
  codeId: string;
  onViewCode: (title: string, codeId: string) => void;
}) => (
  <div className="mb-6 glass-card p-5">
    <div className="flex items-center gap-3 mb-2">
      <code className="font-mono text-[13px] text-neon-blue/90">{name}</code>
      <span className="text-[10px] font-mono text-muted-foreground/50 bg-white/[0.03] border border-white/[0.05] rounded px-2 py-0.5">
        {timing}
      </span>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
    <button
      onClick={() => onViewCode(name, codeId)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-neon-blue/20 bg-neon-blue/[0.06] text-neon-blue hover:bg-neon-blue/[0.12] transition-colors"
    >
      <Code2 className="w-3 h-3" />
      Voir le code
    </button>
  </div>
);

/* ──────────────────── State Detail Block ──────────────────── */
const StateDetailBlock = ({
  name,
  color,
  description,
  codeId,
  onViewCode,
}: {
  name: string;
  color: string;
  description: string;
  codeId: string;
  onViewCode: (title: string, codeId: string) => void;
}) => (
  <div className="mb-4 glass-card p-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
      <code className="font-mono text-[13px] text-neon-blue/90">{name}</code>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
    <button
      onClick={() => onViewCode(`EntryAction — ${name}`, codeId)}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-neon-blue/20 bg-neon-blue/[0.06] text-neon-blue hover:bg-neon-blue/[0.12] transition-colors"
    >
      <Code2 className="w-3 h-3" />
      Voir le code
    </button>
  </div>
);

/* ═══════════════════════ PAGE COMPONENT ═══════════════════════ */
const DocPBFT = () => {
  const [modal, setModal] = useState<{ title: string; code: string } | null>(null);

  const openCode = (title: string, codeId: string) => {
    setModal({ title, code: codeSnippets[codeId] || "// Code non disponible" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <div className="bg-neon-blue/[0.06] border-b border-neon-blue/15 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <span className="text-xs font-mono text-neon-blue">Documentation</span>
        </div>
        <a
          href={PBFT_SIMULATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium rounded-md bg-neon-blue/[0.08] text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/[0.15] transition-all"
        >
          <Play className="w-3 h-3" />
          Lancer la simulation PBFT
        </a>
      </div>

      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-6 bg-card/40">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/[0.08] border border-neon-blue/20 flex items-center justify-center">
              <Blocks className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">Blockchain PBFT</h1>
              <p className="text-xs text-muted-foreground font-mono">
                Package : <code className="text-neon-blue/80">pbft</code> — AnyLogic 8.9.8
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Packages nav */}
      <div className="border-b border-white/[0.04] px-6 py-2 bg-card/20">
        <div className="container max-w-7xl mx-auto flex gap-4">
          <a href="#package-agents" className="flex items-center gap-1.5 text-xs text-neon-blue hover:text-neon-blue/80 transition-colors">
            <Package className="w-3 h-3" />
            agents
          </a>
          <a href="#package-models" className="flex items-center gap-1.5 text-xs text-neon-blue hover:text-neon-blue/80 transition-colors">
            <Box className="w-3 h-3" />
            models
          </a>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-[calc(100vh-180px)]">
        {/* Sidebar */}
        <aside className="border-r border-white/[0.04] py-5 pr-2 hidden lg:block sticky top-0 h-screen overflow-y-auto">
          <div className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50 px-3 mb-2">Agents</p>
            <SideLink href="#class-Main">Main</SideLink>
            <SideLink href="#class-noeud" indent>noeud</SideLink>
            <SideLink href="#class-Messager" indent>Messager</SideLink>
            <SideLink href="#class-Client" indent>Client</SideLink>
          </div>
          <div className="mb-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/50 px-3 mb-2">Models</p>
            <SideLink href="#class-Block">Block</SideLink>
          </div>
        </aside>

        {/* Main */}
        <main className="py-8 px-6 lg:px-10">

          {/* Vue d'ensemble */}
          <h2 className="text-xl font-heading font-semibold mb-3 pb-2 border-b border-neon-blue/20 mt-0 text-neon-blue">Vue d'ensemble</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Simulation AnyLogic du protocole PBFT (Practical Byzantine Fault Tolerance). Cinq classes collaborent : <code className="text-neon-blue/80">Main</code> orchestre les rounds et les timers ; <code className="text-neon-blue/80">noeud</code> exécute le statechart Pre-prepare → Prepare → Commit → Valide/Rejet ; <code className="text-neon-blue/80">Messager</code> transporte chaque message entre nœuds ; <code className="text-neon-blue/80">Client</code> émet des requêtes périodiques et comptabilise les réponses ; <code className="text-neon-blue/80">Block</code> (Java embarqué) représente un bloc signé SHA-256.
          </p>

          {/* Liste des classes */}
          <h2 className="text-xl font-heading font-semibold mb-3 pb-2 border-b border-white/[0.06]">Liste des classes</h2>
          <SummaryTable
            headers={["Classe", "Type", "Description"]}
            rows={[
              [<a href="#class-Main" className="font-mono text-neon-blue hover:underline">Main</a>, "ActiveObjectClass", "Agent racine. Orchestre rounds, timers, pannes, view-change et bilan final."],
              [<a href="#class-noeud" className="font-mono text-neon-blue hover:underline">noeud</a>, "ActiveObjectClass", "Participant PBFT. Possède un statechart à 6 états, votes et blockchain locale."],
              [<a href="#class-Messager" className="font-mono text-neon-blue hover:underline">Messager</a>, "ActiveObjectClass", "Agent mobile transportant un message/bloc entre nœuds et vers le client."],
              [<a href="#class-Client" className="font-mono text-neon-blue hover:underline">Client</a>, "ActiveObjectClass", "Émet des requêtes REQUEST toutes les 2,5 s et comptabilise les REPLY reçus."],
              [<a href="#class-Block" className="font-mono text-neon-blue hover:underline">Block</a>, "JavaClass", "Bloc blockchain : hash SHA-256, previousHash, transactions, timestamp, nonce."],
            ]}
          />

          {/* ═══ Main ═══ */}
          <h2 id="class-Main" className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-blue/20 mt-12 text-neon-blue">Main</h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Agent racine unique. Dispose les nœuds en ellipse au démarrage, force le full-mesh, couronne le premier leader, puis orchestre tous les rounds via ses méthodes et ses 5 événements temporisés.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">StartupCode</h3>
          <div className="mb-6 glass-card p-5">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Positionne <code className="text-neon-blue/80">client</code> à (1000, 50), dispose les nœuds en ellipse (rayonX = 450, rayonY = 250, centre = 550 × 350), force le full-mesh bidirectionnel, puis passe <code className="text-neon-blue/80">estLeader = true</code> au nœud 0.
            </p>
            <button
              onClick={() => openCode("StartupCode — Main", "code-Main-startup")}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-neon-blue/20 bg-neon-blue/[0.06] text-neon-blue hover:bg-neon-blue/[0.12] transition-colors"
            >
              <Code2 className="w-3 h-3" />
              Voir le code
            </button>
          </div>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Champs (paramètres & variables)</h3>
          <SummaryTable
            headers={["Type", "Nom", "Valeur par défaut", "Description"]}
            rows={[
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">indexLeader</code>, "0", "Index du leader courant dans la liste noeuds."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">compteurBatch</code>, "0", "Nombre de requêtes REQUEST reçues depuis le dernier consensus."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-blue">enCoursDeViewChange</code>, "false", "Verrou : un view-change est en cours."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">roundActuel</code>, "0", "Compteur de round courant."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-blue">consensusEnCours</code>, "false", "Verrou : un consensus est en cours."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">p_numNoeuds</code>, "10", "Paramètre : nombre de nœuds dans le réseau."],
              [<code className="font-mono text-xs">double</code>, <code className="font-mono text-xs text-neon-blue">p_probaPanne</code>, "0.05", "Paramètre : probabilité de panne par nœud par cycle evt_Instabilite."],
              [<code className="font-mono text-xs">double</code>, <code className="font-mono text-xs text-neon-blue">p_mandatLeader</code>, "100", "Paramètre : durée du mandat leader en secondes."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-blue">alerteFraudeRapportee</code>, "false", "Indique qu'une fraude a déjà été signalée pour ce round."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">nbValideGlobal</code>, "0", "Nombre de nœuds ayant atteint l'état Valide pour le round courant."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">nbReject</code>, "0", "Nombre de nœuds ayant détecté une fraude (→ Rejet) pour le round courant."],
              [<code className="font-mono text-xs">Client</code>, <code className="font-mono text-xs text-neon-blue">client</code>, "—", "Instance embarquée unique de la classe Client."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Méthodes</h3>
          <MethodDetailBlock
            detail={{
              anchor: "Main-declencherConsensus",
              signature: "void declencherConsensus()",
              description: "Point d'entrée d'un nouveau round. Vérifie les verrous, incrémente roundActuel, réinitialise les compteurs, choisit aléatoirement 0–3 nœuds tricheurs, prépare le bloc leader (hash falsifié si veutTricher), diffuse PRE-PREPARE à tous les voisins connectés et arme evt_ResumeRound à 7 s.",
              codeId: "code-Main-declencherConsensus",
            }}
            onViewCode={openCode}
          />
          <MethodDetailBlock
            detail={{
              anchor: "Main-demanderNouveauLeader",
              signature: "void demanderNouveauLeader(noeud envoyeur)",
              description: "Crée un Messager VIEW-CHANGE depuis envoyeur vers chacun de ses voisins connectés. Appelée par Watchdog_Leader (crash), Mandat_Leader (fin de mandat) et OnArrival (fraude détectée).",
              codeId: "code-Main-demanderNouveauLeader",
            }}
            onViewCode={openCode}
          />
          <MethodDetailBlock
            detail={{
              anchor: "Main-getQuorum",
              signature: "int getQuorum()",
              description: "Retourne le quorum PBFT : 2f + 1 où f = ⌊(p_numNoeuds − 1) / 3⌋. Utilisé par Messager.OnArrival et evt_ResumeRound.",
              codeId: "code-Main-getQuorum",
            }}
            onViewCode={openCode}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Événements</h3>
          <EventDetailBlock name="evt_Instabilite" timing="toutes les 30 s (début à 30 s)" description="Simule les pannes (p_probaPanne %) et les rétablissements (50 %). Un nœud qui tombe perd ses connexions et sa couronne ; un nœud qui revient retrouve ses anciens voisins." codeId="code-Main-evt_Instabilite" onViewCode={openCode} />
          <EventDetailBlock name="Watchdog_Leader" timing="toutes les 1 s (début à 0 s)" description="Surveille l'état du leader : débloque un consensus orphelin si le leader est toujours vivant ; déclenche un view-change si le leader est tombé." codeId="code-Main-Watchdog_Leader" onViewCode={openCode} />
          <EventDetailBlock name="Mandat_Leader" timing="one-shot à p_mandatLeader s puis toutes les 1 s" description="Déclenche un view-change par expiration de mandat, même si le leader est toujours en vie." codeId="code-Main-Mandat_Leader" onViewCode={openCode} />
          <EventDetailBlock name="evt_LogFraude" timing="one-shot 1 s après détection (restart par Messager)" description="Log le nombre de nœuds malveillants détectés dans la console AnyLogic." codeId="code-Main-evt_LogFraude" onViewCode={openCode} />
          <EventDetailBlock name="evt_ResumeRound" timing="one-shot 7 s après declencherConsensus" description="Publie le bilan du round : BLOC VALIDÉ / REJETÉ et état de confirmation du client (quorum client = f + 1)." codeId="code-Main-evt_ResumeRound" onViewCode={openCode} />

          {/* ═══ noeud ═══ */}
          <h2 id="class-noeud" className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-blue/20 mt-12 text-neon-blue">noeud</h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Participant du réseau PBFT. Chaque nœud possède un statechart à 6 états, deux listes de votes avec déduplication par index, une blockchain locale et un indicateur visuel coloré (<code className="text-neon-blue/80">voyant_rect</code>).
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Champs</h3>
          <SummaryTable
            headers={["Type", "Nom", "Valeur par défaut", "Description"]}
            rows={[
              [<code className="font-mono text-xs">ArrayList&lt;Block&gt;</code>, <code className="font-mono text-xs text-neon-blue">blockchain</code>, "new ArrayList()", "Copie locale de la blockchain validée."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-blue">estConnecte</code>, "true", "Nœud en ligne ou en panne."],
              [<code className="font-mono text-xs">ArrayList&lt;noeud&gt;</code>, <code className="font-mono text-xs text-neon-blue">voisinsSauvegardes</code>, "new ArrayList()", "Sauvegarde du voisinage avant déconnexion (pour rétablissement)."],
              [<code className="font-mono text-xs">Block</code>, <code className="font-mono text-xs text-neon-blue">blocEnCours</code>, "null", "Bloc en cours de traitement par le consensus."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">votesPrepare</code>, "0", "Nombre de votes PREPARE reçus (dédupliqués par sendersPrepare)."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">votesCommit</code>, "0", "Nombre de votes COMMIT reçus (dédupliqués par sendersCommit)."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-blue">estLeader</code>, "false", "Vrai si ce nœud est le leader courant."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-blue">estMalveillant</code>, "false", "Marqué vrai par Messager.OnArrival si fraude détectée."],
              [<code className="font-mono text-xs">boolean</code>, <code className="font-mono text-xs text-neon-blue">veutTricher</code>, "false", "Activé aléatoirement par declencherConsensus (0–3 nœuds par round)."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">votesViewChange</code>, "0", "Votes VIEW-CHANGE reçus pour la destitution du leader."],
              [<code className="font-mono text-xs">ArrayList&lt;Integer&gt;</code>, <code className="font-mono text-xs text-neon-blue">sendersPrepare</code>, "new ArrayList()", "Ensemble des index émetteurs PREPARE (déduplication)."],
              [<code className="font-mono text-xs">ArrayList&lt;Integer&gt;</code>, <code className="font-mono text-xs text-neon-blue">sendersCommit</code>, "new ArrayList()", "Ensemble des index émetteurs COMMIT (déduplication)."],
              [<code className="font-mono text-xs">ShapeRectangle</code>, <code className="font-mono text-xs text-neon-blue">voyant_rect</code>, "—", "Indicateur visuel coloré selon l'état du statechart."],
              [<code className="font-mono text-xs">ShapeText</code>, <code className="font-mono text-xs text-neon-blue">chainLengthText</code>, "—", "Texte affichant la hauteur de la blockchain locale."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-3">Statechart</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Les transitions utilisent les guards suivants : <code className="text-neon-blue/80">VersCommit</code> → <code className="text-neon-blue/80">votesPrepare &gt;= main.getQuorum()</code> ; <code className="text-neon-blue/80">VersValide</code> → <code className="text-neon-blue/80">votesCommit &gt;= main.getQuorum()</code>. Les autres transitions (LancerConsensus, AutoPrepare, Reset, rejeter, retour, transition1, transition2) ont un guard <code className="text-neon-blue/80">true</code>.
          </p>
          <StateDetailBlock name="Attente" color="#555" description="État initial. voyant_rect = darkGray. Le nœud attend un message GO_LEADER ou PRE-PREPARE." codeId="code-noeud-state-Attente-entry" onViewCode={openCode} />
          <StateDetailBlock name="PrePrepare" color="#00bcd4" description="voyant_rect = cyan. Reçu PRE-PREPARE valide, le bloc est stocké dans blocEnCours." codeId="code-noeud-state-PrePrepare-entry" onViewCode={openCode} />
          <StateDetailBlock name="Prepare" color="#ffeb3b" description="voyant_rect = yellow. Diffuse PREPARE à tous les voisins (honnête ou frauduleux) et s'auto-vote." codeId="code-noeud-state-Prepare-entry" onViewCode={openCode} />
          <StateDetailBlock name="Commit" color="#ff9800" description="voyant_rect = orange. S'auto-vote COMMIT et diffuse COMMIT à tous les voisins." codeId="code-noeud-state-Commit-entry" onViewCode={openCode} />
          <StateDetailBlock name="Valide" color="#8bc34a" description="voyant_rect = lightGreen. Ajoute le bloc à la blockchain locale (déduplication), met à jour l'affichage et envoie un REPLY au client." codeId="code-noeud-state-Valide-entry" onViewCode={openCode} />
          <StateDetailBlock name="Rejet" color="#f44336" description="voyant_rect = red. Bloc frauduleux détecté via message FRAUDE envoyé par Messager.OnArrival." codeId="code-noeud-state-Rejet-entry" onViewCode={openCode} />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2 mt-6">Méthodes</h3>
          <MethodDetailBlock
            detail={{
              anchor: "noeud-updateVisuals",
              signature: "void updateVisuals()",
              description: "Met à jour chainLengthText avec « Blocks: N » où N est la taille de la blockchain locale. Appelée depuis l'EntryAction Valide et RadarConnexion.",
              codeId: "code-noeud-updateVisuals",
            }}
            onViewCode={openCode}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Événements</h3>
          <EventDetailBlock name="revertColorEvent" timing="one-shot après 1 s (restart par evt_Instabilite, RadarConnexion)" description="Remet voyant_rect à la couleur correspondant à l'état actif du statechart. Gère aussi le cas panne (gray)." codeId="code-noeud-revertColorEvent" onViewCode={openCode} />
          <EventDetailBlock name="RadarConnexion" timing="toutes les 2 s (début à 0 s)" description="Maintient le full-mesh en reconnectant les voisins manquants, puis synchronise la blockchain locale avec le voisin le plus avancé (uniquement depuis l'état Attente)." codeId="code-noeud-RadarConnexion" onViewCode={openCode} />

          {/* ═══ Messager ═══ */}
          <h2 id="class-Messager" className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-blue/20 mt-12 text-neon-blue">Messager</h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Agent mobile créé à la volée par Main ou les nœuds. Il se déplace vers sa cible via <code className="text-neon-blue/80">moveTo()</code> et exécute toute la logique protocolaire dans <code className="text-neon-blue/80">OnArrival</code> avant d'être supprimé de <code className="text-neon-blue/80">main.messagers</code>.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Champs</h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">noeud</code>, <code className="font-mono text-xs text-neon-blue">cible</code>, "Nœud destinataire (null pour les messages REPLY vers le client)."],
              [<code className="font-mono text-xs">Block</code>, <code className="font-mono text-xs text-neon-blue">blocTransporte</code>, "Bloc transporté (peut être null pour VIEW-CHANGE)."],
              [<code className="font-mono text-xs">noeud</code>, <code className="font-mono text-xs text-neon-blue">expediteur</code>, "Nœud émetteur."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs text-neon-blue">typeMessage</code>, "Type du message : REQUEST, PRE-PREPARE, PREPARE, COMMIT, VIEW-CHANGE, REPLY."],
              [<code className="font-mono text-xs">Client</code>, <code className="font-mono text-xs text-neon-blue">expediteurClient</code>, "Référence au Client émetteur (pour les messages REQUEST)."],
              [<code className="font-mono text-xs">Client</code>, <code className="font-mono text-xs text-neon-blue">cibleClient</code>, "Référence au Client destinataire (pour les messages REPLY)."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">roundDuMessage</code>, "Round auquel appartient ce message (filtre les messages obsolètes)."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">OnArrival</h3>
          <div className="mb-8 glass-card p-5">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Logique centrale du protocole exécutée à l'arrivée du messager. Traite séquentiellement : (1) REPLY → client, (2) cible hors-ligne → abandon, (3) détection de fraude, (4) REQUEST → compteurBatch, (5) VIEW-CHANGE → gestion du quorum et élection, (6) filtre de round obsolète, (7) PRE-PREPARE / PREPARE / COMMIT avec déduplication par index expéditeur.
            </p>
            <button
              onClick={() => openCode("OnArrival — Messager", "code-Messager-onArrival")}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-neon-blue/20 bg-neon-blue/[0.06] text-neon-blue hover:bg-neon-blue/[0.12] transition-colors"
            >
              <Code2 className="w-3 h-3" />
              Voir le code
            </button>
          </div>

          {/* ═══ Client ═══ */}
          <h2 id="class-Client" className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-neon-blue/20 mt-12 text-neon-blue">Client</h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Agent embarqué unique dans Main (instance <code className="text-neon-blue/80">client</code>). Positionné à (1000, 50) au démarrage. Émet une requête REQUEST vers le leader courant toutes les 2,5 s et comptabilise les REPLY valides reçus.
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Champs</h3>
          <SummaryTable
            headers={["Type", "Nom", "Valeur par défaut", "Description"]}
            rows={[
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs text-neon-blue">reponsesRecues</code>, "0", "Compteur de messages REPLY valides reçus. Réinitialisé par declencherConsensus. Comparé au quorum client (f+1) dans evt_ResumeRound."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Événements</h3>
          <EventDetailBlock
            name="evt_EnvoiRequete"
            timing="toutes les 2,5 s (début à 0 s)"
            description="Crée un Messager REQUEST vers le leader courant avec expediteurClient = this et speed = 20. Le Messager.OnArrival incrémentera compteurBatch et déclenchera un consensus tous les 10 REQUEST."
            codeId="code-Client-evt_EnvoiRequete"
            onViewCode={openCode}
          />

          {/* ═══ Block ═══ */}
          <h2 id="class-Block" className="text-xl font-heading font-semibold mb-2 pb-2 border-b border-white/[0.12] mt-12">Block (JavaClass)</h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Classe Java embarquée dans le modèle. Représente un bloc de la blockchain. Utilise SHA-256 via <code className="text-neon-blue/80">java.security.MessageDigest</code>. Le champ statique <code className="text-neon-blue/80">difficulty = 3</code> et <code className="text-neon-blue/80">difficultyTarget</code> existent mais ne sont pas utilisés par PBFT (pas de minage PoW).
          </p>

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Champs</h3>
          <SummaryTable
            headers={["Type", "Nom", "Description"]}
            rows={[
              [<code className="font-mono text-xs">static int</code>, <code className="font-mono text-xs">difficulty</code>, "Difficulté PoW (= 3). Non utilisé par PBFT."],
              [<code className="font-mono text-xs">static String</code>, <code className="font-mono text-xs">difficultyTarget</code>, "Chaîne de « difficulty » zéros. Non utilisée par PBFT."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">hash</code>, "Hash SHA-256 du bloc. Falsifié en « FAUX_HASH_666 » par les nœuds tricheurs."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">previousHash</code>, "Hash du bloc précédent (« 0000 » pour le premier bloc)."],
              [<code className="font-mono text-xs">String</code>, <code className="font-mono text-xs">transactions</code>, "Payload du bloc (ex : « Batch_10_TX »)."],
              [<code className="font-mono text-xs">long</code>, <code className="font-mono text-xs">timestamp</code>, "Horodatage à la création (ms depuis epoch)."],
              [<code className="font-mono text-xs">int</code>, <code className="font-mono text-xs">nonce</code>, "Nonce (= 0 dans l'implémentation courante, PoW désactivé)."],
            ]}
          />

          <h3 className="text-sm font-heading font-semibold text-foreground/80 mb-2">Méthodes</h3>
          <MethodDetailBlock
            detail={{
              anchor: "Block-ctor",
              signature: "Block(String transactions, String previousHash)",
              description: "Initialise tous les champs et calcule le premier hash via calculateHash().",
              codeId: "code-Block-ctor",
            }}
            onViewCode={openCode}
          />
          <MethodDetailBlock
            detail={{
              anchor: "Block-calculateHash",
              signature: "String calculateHash()",
              description: "Concatène previousHash + timestamp + nonce + transactions, calcule SHA-256 et retourne la représentation hexadécimale sur 64 caractères.",
              codeId: "code-Block-calculateHash",
            }}
            onViewCode={openCode}
          />

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-4 px-6 text-center">
        <p className="text-[11px] text-muted-foreground/40 font-mono">Documentation PBFT — BlockchainTPE — Université Le Havre Normandie 2025-2026</p>
      </footer>

      {/* Code Modal */}
      <CodeModal open={!!modal} title={modal?.title ?? ""} code={modal?.code ?? ""} onClose={() => setModal(null)} />
    </div>
  );
};

export default DocPBFT;
