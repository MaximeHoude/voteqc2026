import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Heart, Zap, Target, BookOpen, Lightbulb, Eye, ShieldCheck,
  ArrowRight, ArrowLeft, Check, X, Info, Menu, Star, RotateCcw,
  ChevronDown, ChevronRight, AlertCircle, ThumbsUp, ThumbsDown,
  Handshake, Sparkles, XCircle, Meh, Settings2, CheckCircle2,
  TrendingUp, Users, Scale, Globe, Shuffle, Lock, CircleSlash,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// PARTIES
// ═══════════════════════════════════════════════════════════

const parties = [
  // Partis principaux (représentés ou ayant obtenu plus de 1 % aux dernières élections)
  { id: "caq", name: "Coalition Avenir Québec", shortName: "CAQ", leader: "Christine Fréchette", leaderTitle: "Cheffe", color: "#00B0F0", colorDark: "#0079B0", ideology: "Centre-droit · Autonomisme · Nationalisme québécois", website: "https://coalitionavenirquebec.org", main: true },
  { id: "plq", name: "Parti libéral du Québec", shortName: "PLQ", leader: "Charles Milliard", leaderTitle: "Chef", color: "#ED1C24", colorDark: "#A30D14", ideology: "Centre · Fédéralisme · Libéralisme économique", website: "https://plq.org", main: true },
  { id: "pq", name: "Parti Québécois", shortName: "PQ", leader: "Paul St-Pierre Plamondon", leaderTitle: "Chef", color: "#0055A4", colorDark: "#003876", ideology: "Centre-gauche · Souverainisme · Social-démocratie", website: "https://pq.org", main: true },
  { id: "qs", name: "Québec solidaire", shortName: "QS", leader: "Carmen Palardy", leaderTitle: "Cheffe", color: "#FF6600", colorDark: "#B84800", ideology: "Gauche · Souverainisme · Écosocialisme · Féminisme", website: "https://quebecsolidaire.net", main: true },
  { id: "pcq", name: "Parti conservateur du Québec", shortName: "PCQ", leader: "Éric Duhaime", leaderTitle: "Chef", color: "#2F4F4F", colorDark: "#1A2E2E", ideology: "Droite · Fédéralisme · Conservatisme fiscal", website: "https://conservateur.quebec", main: true },
  { id: "pvq", name: "Parti vert du Québec", shortName: "PVQ", leader: "Alex Tyrrell", leaderTitle: "Chef", color: "#4CAF50", colorDark: "#2E7D32", ideology: "Gauche · Écosocialisme · Justice climatique", website: "https://pvq.qc.ca", main: true },
  // Partis émergents et alternatifs — avec candidats aux dernières élections
  { id: "cq", name: "Climat Québec", shortName: "CQ", leader: "Martine Ouellet", leaderTitle: "Cheffe", color: "#8BC34A", colorDark: "#558B2F", ideology: "Centre-gauche · Éco-souverainisme · Justice climatique", website: "https://climat.quebec", main: false },
  { id: "pmlq", name: "Parti marxiste-léniniste du Québec", shortName: "PMLQ", leader: "Christine Dandenault", leaderTitle: "Cheffe", color: "#B71C1C", colorDark: "#7F0000", ideology: "Extrême gauche · Marxisme-léninisme · Républicanisme", website: "https://pmlq.qc.ca", main: false },
  { id: "plib", name: "Parti libertarien du Québec", shortName: "PLibQ", leader: "Yan Roshdy", leaderTitle: "Chef", color: "#FFB300", colorDark: "#B28704", ideology: "Droite · Libertarianisme · Libertés individuelles · État minimal", website: "", main: false },
  // Tier 3 — autres partis autorisés par le DGEQ
  { id: "pcanq", name: "Parti canadien du Québec", shortName: "PCanQ", leader: "Joseph Cianflone", leaderTitle: "Chef", color: "#C62828", colorDark: "#8E0000", ideology: "Centre-droit · Fédéralisme · Bilinguisme · Droits des minorités linguistiques", website: "https://canadianpartyofquebec.ca", main: false },
  { id: "bpot", name: "Bloc pot", shortName: "BPot", leader: "Jean-Patrick Berthiaume", leaderTitle: "Chef", color: "#558B2F", colorDark: "#33691E", ideology: "Centre · Légalisation du cannabis · Libertés civiles", website: "https://blocpot.qc.ca", main: false },
  { id: "dd", name: "Démocratie directe", shortName: "DD", leader: "Jean Charles Cléroux", leaderTitle: "Chef", color: "#1565C0", colorDark: "#0D47A1", ideology: "Centre · Démocratie directe · Référendums citoyens · Réforme électorale", website: "", main: false },
  { id: "pculq", name: "Parti culinaire du Québec", shortName: "PCulQ", leader: "Jean-Louis Thémistocle", leaderTitle: "Chef fondateur", color: "#FFB74D", colorDark: "#E65100", ideology: "Centre · Alimentation locale · Souveraineté alimentaire · Gastronomie", website: "https://www.particulinaireduquebec.org", main: false },
  { id: "un", name: "Union nationale", shortName: "UN", leader: "Jonathan Blanchette", leaderTitle: "Chef", color: "#37474F", colorDark: "#1C2931", ideology: "Centre-droit · Nationalisme · Autonomie québécoise · Conservatisme", website: "https://www.union-nationale-quebec.net/", main: false },
  { id: "ea", name: "Équipe autonomiste", shortName: "ÉA", leader: "Louis Chandonnet", leaderTitle: "Chef", color: "#0288D1", colorDark: "#01579B", ideology: "Centre-droit · Autonomisme · Nationalisme soft · Décentralisation", website: "https://equipeautonomiste.ca", main: false },
  { id: "paé", name: "Parti accès propriété et équité", shortName: "PAÉ", leader: "Shawn Lalande McLean", leaderTitle: "Chef", color: "#8E24AA", colorDark: "#4A148C", ideology: "Centre · Accès à la propriété · Équité économique", website: "", main: false },
  { id: "pcomq", name: "Parti communiste du Québec", shortName: "PCoQ", leader: "Adrien Welsh", leaderTitle: "Chef", color: "#D32F2F", colorDark: "#8B0000", ideology: "Extrême gauche · Communisme · Anti-capitalisme", website: "https://pcq.qc.ca", main: false },
  { id: "pnul", name: "Parti nul", shortName: "PNul", leader: "Renaud Blais", leaderTitle: "Chef", color: "#616161", colorDark: "#212121", ideology: "Promotion du vote nul · Réforme démocratique", website: "", main: false },
  { id: "ppq", name: "Parti populaire du Québec", shortName: "PPQ", leader: "Sylvain Pariseau", leaderTitle: "Chef", color: "#795548", colorDark: "#3E2723", ideology: "Droite populiste · Conservatisme", website: "", main: false },
  { id: "presq", name: "Présence Québec", shortName: "PrésQ", leader: "Guillaume Tremblay", leaderTitle: "Chef", color: "#00897B", colorDark: "#004D40", ideology: "Centre · Démocratie participative · Bienveillance", website: "", main: false },
  { id: "qi", name: "Québec innovant", shortName: "QI", leader: "Alexandre St-Pierre", leaderTitle: "Chef", color: "#00ACC1", colorDark: "#006064", ideology: "Centre · Innovation technologique · Modernisation", website: "", main: false },
];

const extraPartyIds = ["cq", "pmlq", "plib"];

// Positions révisées rigoureusement selon plateformes documentées — 100 questions × 3 partis
// Format : [cq, pmlq, plib]
// CQ = Climat Québec (Martine Ouellet, éco-souverainiste radical, priorité absolue climat)
// PMLQ = Parti marxiste-léniniste (extrême gauche, nationalisation totale, République)
// PLibQ = Parti libertarien (état minimal, libre marché total, libertés maximales)
const extraPositions = [
  // Q1 Hydrocarbures interdits ─ Q2 Nouv. hydro ─ Q3 Taxe carbone ─ Q4 Fin vente essence 2030 ─ Q5 Subv. transition
  [2,2,-2],[-1,2,0],[2,-1,-2],[2,1,-2],[2,2,-2],
  // Q6 Tramway QC ─ Q7 3e lien routier ─ Q8 30% territoire protégé ─ Q9 Bio subventionné ─ Q10 Fin centrales gaz
  [2,1,-1],[-2,-2,0],[2,2,0],[2,1,-1],[2,2,-2],
  // Q11 Déchets nationalisés ─ Q12 Train interurbain ─ Q13 Taxe pollueurs ─ Q14 Éolien offshore ─ Q15 Chasse/pêche strict
  [1,2,-2],[2,1,0],[2,2,-2],[2,1,0],[2,1,-1],
  // Q16 Baisse impôts ─ Q17 Réduire subv. entreprises ─ Q18 Salaire min 20$ ─ Q19 Nationaliser essentiels ─ Q20 Impôt fortune
  [-1,-2,2],[0,2,2],[1,2,-2],[1,2,-2],[1,2,-2],
  // Q21 Dette prioritaire ─ Q22 Investir santé ─ Q23 Réduire taille État ─ Q24 Réduire écart riches/pauvres ─ Q25 Libre-échange
  [-1,-2,2],[1,0,-1],[-1,-2,2],[2,2,-2],[0,-1,2],
  // Q26 Investir PME ─ Q27 Soutenir syndicats ─ Q28 Privatiser services ─ Q29 SAQ privée ─ Q30 Logement social
  [1,1,-1],[1,1,0],[-2,-2,2],[-2,-2,2],[1,2,-2],
  // Q31 Loi 21 laïcité ─ Q32 Renforcer Loi 101 ─ Q33 Multiculturalisme Q ─ Q34 Indépendance ─ Q35 Immigration réduite
  [0,0,-1],[2,1,-2],[1,2,0],[2,2,-2],[0,0,0],
  // Q36 Aîné·e·s intégration ─ Q37 Franciser immigrants ─ Q38 Accueil réfugiés ─ Q39 Reconnaissance autoch ─ Q40 Nation québécoise
  [1,0,-1],[1,0,-1],[1,2,1],[1,2,1],[2,2,0],
  // Q41 Redonner pouvoir régions ─ Q42 Proportionnelle ─ Q43 Référendum indép ─ Q44 Constitution Q ─ Q45 Monarchie
  [1,1,1],[1,2,1],[2,2,-1],[2,2,-1],[-1,-2,0],
  // Q46 Abolir Loi 21 ─ Q47 Vote obligatoire ─ Q48 Immigration augm ─ Q49 Intégration francisation ─ Q50 Territoires autoch
  [0,0,0],[0,1,-2],[0,2,-1],[1,1,-1],[2,2,0],
  // Q51 Anglais institutions ─ Q52 Égalité H/F ─ Q53 CPE 5$ ─ Q54 Congé parental ─ Q55 Logement abordable
  [-1,0,2],[2,2,0],[2,2,-2],[2,2,-2],[2,2,-2],
  // Q56 Baisser impôt familles ─ Q57 Lutte itinérance ─ Q58 Luxe impôt ─ Q59 Santé publique gratuite ─ Q60 État providence
  [0,-1,2],[2,2,-1],[2,2,-2],[2,2,-2],[2,2,-2],
  // Q61 Soins dentaires ─ Q62 Assurance médicaments publique ─ Q63 Privé en santé ─ Q64 Fin CHSLD privé ─ Q65 Maintien domicile
  [1,2,-1],[2,2,-2],[-2,-2,2],[2,2,-1],[2,2,0],
  // Q66 CLSC renforcés ─ Q67 Télémédecine ─ Q68 Aide méd. mourir ─ Q69 Décrim drogues ─ Q70 Santé mentale jeunes
  [2,2,-1],[1,1,1],[1,1,2],[1,1,2],[2,2,-1],
  // Q71 Avort. accessible ─ Q72 Médec. fam universel ─ Q73 Agences placement privé ─ Q74 Salaire infirmières ─ Q75 Vaccination obligatoire
  [2,2,1],[2,2,-1],[-2,-2,0],[2,2,0],[1,1,-1],
  // Q76 Éducation publique prioritaire ─ Q77 Fin école privée subv ─ Q78 Frais univ gelés ─ Q79 Cours francisation ─ Q80 Cours histoire oblig
  [2,2,-1],[2,2,-2],[2,2,-2],[1,1,-1],[2,2,0],
  // Q81 Formation prof valorisée ─ Q82 Maternelle 4 ans ─ Q83 Prof payé plus ─ Q84 Réforme primaire ─ Q85 Universités francophones
  [1,1,0],[1,1,-1],[2,2,0],[1,1,0],[2,2,0],
  // Q86 Limite réseaux soc enfants ─ Q87 IA éducation ─ Q88 Tiers quota privé ─ Q89 Anglais 6e année ─ Q90 Sport scolaire
  [1,0,-1],[0,0,0],[2,2,-2],[-1,-1,1],[1,1,0],
  // Q91 Immigration cap strict ─ Q92 Voile neutralité ─ Q93 Fr tous services ─ Q94 Bilinguisme institutionnel ─ Q95 Temples rel financement
  [0,0,0],[0,0,-2],[2,1,-2],[-2,0,1],[-1,-2,-1],
  // Q96 Souveraineté cond gagnantes ─ Q97 Québec bilingue ─ Q98 Québec en Amérique ─ Q99 CEPEQ fr ─ Q100 Souver. alim
  [2,2,-1],[-2,0,1],[0,0,1],[2,1,-1],[2,2,-1],
];

// Positions révisées — 100 questions × 12 partis de niche (selon la liste officielle du DGEQ)
// Format : [pcanq, bpot, dd, pculq, un, ea, paé, pcomq, pnul, ppq, presq, qi]
// PCanQ = Parti canadien du Québec (Joseph Cianflone - fédéraliste fort, bilingue, anti Loi 21/96)
// BPot = Bloc pot (Jean-Patrick Berthiaume, pro-cannabis, libertés civiles)
// DD = Démocratie directe (Jean Charles Cléroux, référendums citoyens)
// PCulQ = Parti culinaire (Jean-Louis Thémistocle, souveraineté alimentaire)
// UN = Union nationale (Jonathan Blanchette, nationalisme conservateur traditionnel)
// ÉA = Équipe autonomiste (Louis Chandonnet, autonomisme modéré, décentralisation)
// PAÉ = Parti accès propriété et équité (Shawn Lalande McLean, accès au logement/propriété)
// PCoQ = Parti communiste du Québec (Adrien Welsh, extrême gauche communiste)
// PNul = Parti nul (Renaud Blais, promouvoir le vote nul)
// PPQ = Parti populaire du Québec (Sylvain Pariseau, droite populiste)
// PrésQ = Présence Québec (Guillaume Tremblay, démocratie participative, bienveillance)
// QI = Québec innovant (Alexandre St-Pierre, innovation, modernisation)
const extraPositions2 = [
  // Format : [pcanq, bpot, dd, pculq, un, ea, paé, pcomq, pnul, ppq, presq, qi]
  [-1,0,0,1,-1,0,0,2,0,-1,0,0],[0,0,0,0,1,1,0,2,0,1,0,0],[0,1,1,1,0,0,0,-1,0,-1,0,0],[-1,0,0,1,-1,-1,0,1,0,-1,0,0],[0,1,1,2,0,0,0,2,0,0,0,0],
  [0,1,1,1,-1,-1,0,1,0,-1,0,0],[0,-1,0,-1,1,1,0,-2,0,1,0,0],[1,1,1,2,0,0,0,2,0,0,0,0],[0,1,0,2,0,0,0,1,0,0,0,0],[-1,1,1,1,-1,-1,0,2,0,-1,0,0],
  [-1,0,1,1,0,0,0,2,0,-1,0,0],[1,1,1,2,1,2,0,1,0,1,0,0],[0,1,1,1,0,0,0,2,0,-1,0,0],[1,1,1,0,0,1,0,1,0,0,0,0],[0,0,1,0,0,0,0,1,0,0,0,0],
  [1,1,0,0,1,1,0,-2,0,1,0,0],[0,1,1,0,0,0,0,2,0,0,0,0],[-1,0,0,1,0,0,0,2,0,-1,0,0],[-2,0,0,1,0,-1,0,2,0,-1,0,0],[-1,0,0,1,0,-1,0,2,0,-1,0,0],
  [1,0,0,-1,1,1,0,-2,0,1,0,0],[2,1,1,2,1,1,0,0,0,1,0,0],[0,0,0,0,0,1,0,-2,0,1,0,0],[0,1,1,1,0,0,0,2,0,0,0,0],[2,0,0,-1,0,1,0,-1,0,1,0,0],
  [1,1,1,2,1,1,0,1,0,1,0,0],[0,1,1,1,0,0,0,1,0,0,0,0],[0,-1,0,-1,0,0,0,-2,0,0,0,0],[1,0,1,-1,-1,0,0,-2,0,-1,0,0],[1,1,1,1,0,0,0,2,0,0,0,0],
  [-2,0,0,0,2,1,0,0,0,1,0,0],[-2,0,0,0,2,2,0,1,0,1,0,0],[2,1,1,1,-1,0,0,2,0,-1,0,0],[-2,0,1,0,2,1,0,2,0,-1,0,0],[-1,-1,0,-1,2,1,0,0,0,1,0,0],
  [-1,0,0,1,1,1,0,0,0,0,0,0],[-1,0,0,1,2,1,0,0,0,0,0,0],[2,1,1,1,0,0,0,2,0,-1,0,0],[2,1,1,1,1,1,0,2,0,0,0,0],[-1,0,0,1,2,2,0,2,0,1,0,0],
  [0,1,2,2,2,2,0,1,0,1,0,0],[1,1,2,1,0,0,0,2,0,0,0,0],[-2,0,1,0,2,1,0,2,0,-1,0,0],[-2,1,2,1,2,2,0,2,0,0,0,0],[0,0,0,-1,-1,0,0,-2,0,0,0,0],
  [2,1,1,0,-2,-1,0,0,0,-1,0,0],[0,1,1,0,0,0,0,1,0,-1,0,0],[1,1,0,1,-2,-1,0,2,0,-1,0,0],[0,0,1,2,2,2,0,1,0,1,0,0],[2,1,1,1,-1,0,0,2,0,-1,0,0],
  [2,0,0,-1,-2,0,0,0,0,-1,0,0],[2,1,1,2,1,1,0,2,0,0,0,0],[1,1,1,2,1,1,0,2,0,1,0,0],[1,1,1,2,1,1,0,2,0,1,0,0],[1,1,1,2,1,1,0,2,0,1,0,0],
  [1,1,1,1,1,1,0,-1,0,1,0,0],[1,1,1,1,1,1,0,2,0,1,0,0],[0,1,1,1,0,0,0,2,0,-1,0,0],[2,1,1,1,1,1,0,2,0,1,0,0],[1,1,1,1,-1,0,0,2,0,-1,0,0],
  [1,1,1,1,0,0,0,2,0,1,0,0],[2,1,1,2,1,1,0,2,0,1,0,0],[-1,-1,-1,-1,0,0,0,-2,0,1,0,0],[1,1,1,1,0,0,0,2,0,0,0,0],[1,1,1,2,2,1,0,2,0,1,0,0],
  [1,1,1,2,1,1,0,2,0,1,0,0],[1,2,1,1,0,1,0,1,0,0,0,0],[1,1,1,1,-1,0,0,1,0,-1,0,0],[1,2,1,0,-1,-1,0,1,0,-1,0,0],[2,1,1,2,1,1,0,2,0,1,0,0],
  [2,1,1,2,0,1,0,2,0,-1,0,0],[2,1,1,2,1,1,0,2,0,1,0,0],[0,-1,0,-1,-1,0,0,-2,0,0,0,0],[1,1,1,1,1,1,0,2,0,1,0,0],[1,1,1,1,1,1,0,1,0,0,0,0],
  [1,1,1,2,1,1,0,2,0,0,0,0],[-1,1,1,1,-1,0,0,2,0,-1,0,0],[1,1,1,2,0,1,0,2,0,-1,0,0],[-1,0,0,1,2,2,0,1,0,1,0,0],[0,1,1,2,2,2,0,2,0,1,0,0],
  [1,1,1,2,1,1,0,1,0,1,0,0],[0,1,1,1,0,0,0,1,0,0,0,0],[1,1,1,1,1,1,0,2,0,1,0,0],[1,1,1,1,1,1,0,1,0,1,0,0],[-1,0,0,1,2,2,0,2,0,1,0,0],
  [0,0,0,1,1,1,0,0,0,1,0,0],[1,0,0,0,0,0,0,0,0,0,0,0],[-1,1,1,1,-1,0,0,2,0,-1,0,0],[2,0,0,-1,-1,-1,0,-1,0,0,0,0],[1,1,1,2,1,1,0,1,0,1,0,0],
  [-1,-1,0,-1,2,2,0,0,0,1,0,0],[-2,0,0,0,2,2,0,0,0,1,0,0],[-2,0,0,1,2,2,0,1,0,1,0,0],[2,0,0,-1,-2,-1,0,0,0,0,0,0],[0,-1,-1,-1,0,0,0,-2,0,1,0,0],
  [-2,0,1,0,2,1,0,2,0,-1,0,0],[2,0,0,-1,-2,-1,0,0,0,0,0,0],[2,0,0,0,-1,0,0,0,0,0,0,0],[-1,0,0,1,2,1,0,1,0,0,0,0],[-1,0,1,2,2,1,0,2,0,1,0,0],
];

const extraPartyIds2 = ["pcanq", "bpot", "dd", "pculq", "un", "ea", "paé", "pcomq", "pnul", "ppq", "presq", "qi"];

// Helper: return the parties that should be scored for a given quiz type
function getQuizParties(quizType) {
  return quizType === "all" ? parties : parties.filter(p => p.main);
}

// ═══════════════════════════════════════════════════════════
// QUESTIONS — with Quebec-specific context (help text)
// ═══════════════════════════════════════════════════════════

const mkQ = (id, text, category, help, c,l,p,q,r,v) => ({
  id, text, category, help,
  positions: [{p:'caq',v:c},{p:'plq',v:l},{p:'pq',v:p},{p:'qs',v:q},{p:'pcq',v:r},{p:'pvq',v:v}]
});

const q100 = [
  mkQ(1,"Le Québec doit interdire totalement l'exploration et l'exploitation des hydrocarbures sur son territoire.","Environnement","En 2022, le Québec a adopté la Loi 21 mettant fin à l'exploration et à la production d'hydrocarbures. Ce débat porte sur le maintien ou le renforcement de cette interdiction (gaz de schiste, pétrole, gaz naturel).",0,0,1,2,-2,2),
  mkQ(2,"Le Québec doit construire de nouvelles centrales hydroélectriques pour répondre à la demande énergétique.","Environnement","Hydro-Québec prévoit que la consommation pourrait doubler d'ici 2050. Les nouveaux projets soulèvent des enjeux environnementaux et de relations avec les Premières Nations.",2,1,1,-1,2,-2),
  mkQ(3,"La taxe carbone est un outil efficace pour lutter contre les changements climatiques.","Environnement","Le Québec utilise le SPEDE (système de plafonnement et d'échange de droits d'émission), distinct de la taxe carbone fédérale. Il génère des revenus réinvestis dans la transition.",1,1,1,2,-2,2),
  mkQ(4,"Le Québec doit interdire la vente de véhicules à essence neufs d'ici 2030.","Environnement","Le Québec a déjà annoncé l'interdiction de la vente de véhicules neufs à essence pour 2035. Cette question porte sur l'accélération de l'échéance.",0,1,1,2,-2,2),
  mkQ(5,"Le gouvernement doit subventionner massivement la transition énergétique des entreprises.","Environnement","Plusieurs programmes existent déjà (ÉcoPerformance, Roulez vert). Le débat porte sur l'ampleur du soutien et les conditions environnementales rattachées.",1,1,0,2,-2,2),
  mkQ(6,"Le projet de tramway à Québec doit être réalisé coûte que coûte.","Environnement","Le tramway de Québec est un projet majeur de transport collectif évalué à plus de 7 milliards $. Il a fait l'objet de nombreuses révisions et controverses politiques.",0,1,1,2,-2,2),
  mkQ(7,"Le troisième lien entre Québec et Lévis doit être un tunnel routier et non un tunnel pour transport en commun.","Environnement","Le projet vise à relier Québec à la Rive-Sud sous le fleuve Saint-Laurent. Sa nature (routier vs collectif) divise les partis depuis 2018.",1,0,-1,-2,2,-2),
  mkQ(8,"Le Québec doit protéger au moins 30% de son territoire d'ici 2030 pour préserver la biodiversité.","Environnement","Cible internationale (COP15 Montréal 2022). Le Québec a actuellement environ 17% de son territoire protégé, principalement au nord.",1,1,2,2,-1,2),
  mkQ(9,"L'agriculture biologique doit être encouragée par des subventions gouvernementales.","Environnement","Moins de 10% des fermes québécoises sont certifiées bio. La Politique bioalimentaire 2018-2025 a fixé des objectifs de croissance.",1,1,1,2,-1,2),
  mkQ(10,"Le Québec doit fermer toutes ses centrales thermiques au gaz naturel d'ici 2035.","Environnement","Les centrales au gaz servent surtout en pointe de demande hivernale. Leur fermeture nécessiterait des alternatives stockables (batteries, hydrogène).",0,0,1,2,-2,2),
  mkQ(11,"La gestion des déchets doit être nationalisée et gérée par l'État.","Environnement","Actuellement gérée par les municipalités et entreprises privées. Le Québec a un système de consigne et de collecte sélective en réforme.",-1,-1,0,1,-2,1),
  mkQ(12,"Le Québec doit investir dans le transport ferroviaire interurbain pour réduire les émissions.","Environnement","Le projet TGF (train à grande fréquence) Québec-Toronto est en discussion fédérale. Le Québec n'a pas de réseau ferroviaire passager moderne entre ses régions.",1,1,2,2,0,2),
  mkQ(13,"Les entreprises polluantes doivent payer une taxe sur leurs émissions de carbone.","Environnement","Le SPEDE québécois lie les grandes industries depuis 2013. Le débat porte sur l'élargissement et le renforcement du système.",1,1,1,2,-2,2),
  mkQ(14,"Le Québec doit développer l'énergie éolienne offshore dans le golfe du Saint-Laurent.","Environnement","Aucun parc éolien marin n'existe au Québec. Les enjeux : impact sur la pêche, mammifères marins, et coûts vs éolien terrestre.",1,1,1,1,0,2),
  mkQ(15,"La chasse et la pêche doivent être strictement réglementées pour protéger la faune.","Environnement","Le Québec délivre annuellement plus de 400 000 permis. Les enjeux : caribou forestier, saumon atlantique, espèces en déclin.",1,1,1,2,0,2),
  mkQ(16,"Le gouvernement doit réduire les impôts des particuliers pour stimuler l'économie.","Économie","Le Québec a les impôts personnels parmi les plus élevés au Canada. La CAQ a réduit le premier palier d'impôt en 2023.",1,1,1,-1,2,-1),
  mkQ(17,"Les subventions gouvernementales aux entreprises doivent être réduites drastiquement.","Économie","Investissement Québec et le Fonds du développement économique distribuent des milliards en aide aux entreprises chaque année.",-1,0,1,1,2,1),
  mkQ(18,"Le salaire minimum doit être augmenté à 20$ de l'heure.","Économie","Le salaire minimum au Québec est de 16,10$ (mai 2025). Une hausse à 20$ représenterait environ +24%.",0,0,1,2,-2,2),
  mkQ(19,"Le Québec doit nationaliser les services essentiels comme l'électricité et l'eau.","Économie","L'électricité est déjà nationalisée (Hydro-Québec depuis 1962). L'eau potable est municipale. La question vise un élargissement éventuel.",0,-1,1,2,-2,1),
  mkQ(20,"Le gouvernement doit créer un impôt sur la fortune des ultra-riches.","Économie","Aucun impôt sur la fortune n'existe au Canada. Plusieurs pays européens en ont, certains l'ont aboli (France 2017).",-1,-1,0,2,-2,1),
  mkQ(21,"La privatisation des services publics est une solution viable pour réduire les coûts.","Économie","Débat de longue date au Québec, particulièrement en santé. Études contradictoires sur les économies réelles.",0,1,-1,-2,2,-2),
  mkQ(22,"Le Québec doit investir massivement dans l'innovation et la recherche.","Économie","Le Québec investit environ 2,3% de son PIB en R&D, sous la cible OCDE de 3%. Secteurs phares : aérospatiale, IA, sciences de la vie.",2,2,1,1,1,1),
  mkQ(23,"Les banques et les institutions financières doivent être plus réglementées.","Économie","La réglementation bancaire est principalement fédérale. L'AMF supervise les marchés financiers québécois.",0,0,1,2,-2,1),
  mkQ(24,"Le gouvernement doit garantir un revenu minimum universel pour tous les Québécois.","Économie","Idée discutée mondialement. Au Québec, le Programme de revenu de base (2023) cible déjà certaines personnes avec contraintes sévères.",-1,-1,0,2,-2,1),
  mkQ(25,"Le Québec doit réduire sa dette publique avant de faire de nouvelles dépenses.","Économie","La dette nette du Québec représente environ 38% du PIB. Une Loi sur la réduction de la dette fixe des cibles à 2038.",2,1,0,-1,2,-1),
  mkQ(26,"Les entreprises québécoises doivent être protégées contre la concurrence étrangère.","Économie","Enjeu d'achat local, notamment via les marchés publics et la « Stratégie d'achat québécois ».",1,0,1,1,0,1),
  mkQ(27,"Le gouvernement doit offrir des crédits d'impôt pour l'achat de logements.","Économie","Crise du logement aiguë au Québec. Plusieurs programmes existent (Accès Famille, RAP fédéral) mais leur efficacité est débattue.",1,1,1,0,1,0),
  mkQ(28,"Les syndicats ont trop de pouvoir au Québec.","Économie","Le taux de syndicalisation au Québec (~38%) est l'un des plus élevés en Amérique du Nord. Le Code du travail québécois est plus protecteur qu'ailleurs.",0,0,-1,-2,2,-1),
  mkQ(29,"Le Québec doit développer son industrie minière pour diversifier son économie.","Économie","Le Plan Nord et le développement minier (lithium, graphite, terres rares) divisent : développement vs protection des territoires et des Premières Nations.",2,1,0,-1,2,-2),
  mkQ(30,"Le gouvernement doit créer une banque publique d'investissement.","Économie","La Caisse de dépôt et placement existe déjà (gestion des régimes de retraite). L'idée serait une banque publique de prêts aux particuliers/PME.",0,0,1,2,-2,1),
  mkQ(31,"Le Québec doit réduire significativement ses seuils d'immigration.","Immigration","Le Québec accueille environ 50 000 immigrants permanents par an. La CAQ a fait de la baisse des seuils un enjeu majeur depuis 2018.",1,-1,1,-2,2,-1),
  mkQ(32,"Les immigrants doivent démontrer une connaissance du français avant d'être admis.","Immigration","Depuis 2024, les nouveaux arrivants économiques doivent démontrer un niveau de français (niveau 7 oral). Élargissement possible aux autres catégories.",2,1,2,0,1,1),
  mkQ(33,"Le Québec doit accueillir plus de réfugiés.","Immigration","Le Québec a accueilli des milliers de réfugiés syriens (2015-16) et ukrainiens (2022). Capacité d'accueil et services d'intégration au cœur du débat.",-1,1,0,2,-2,2),
  mkQ(34,"L'immigration temporaire (travailleurs étrangers, étudiants) doit être réduite.","Immigration","L'immigration temporaire au Québec a explosé : plus de 500 000 résidents non-permanents en 2024, en grande partie hors contrôle provincial.",1,0,1,-1,2,0),
  mkQ(35,"Les services d'intégration pour les immigrants doivent être renforcés.","Immigration","Francisation, reconnaissance des diplômes, accompagnement à l'emploi : programmes en sous-financement chronique selon plusieurs études.",1,2,1,2,0,2),
  mkQ(36,"Le Québec doit favoriser l'immigration économique au détriment de l'immigration familiale.","Immigration","L'immigration économique représente environ 65% des admissions. Le regroupement familial reste largement de compétence fédérale.",1,1,0,-1,2,-1),
  mkQ(37,"Les immigrants doivent s'adapter aux valeurs québécoises.","Immigration","Concept formalisé dans la Déclaration sur les valeurs communes (interculturalisme), opposé au multiculturalisme canadien.",2,1,2,0,2,0),
  mkQ(38,"Le Programme de l'expérience québécoise (PEQ) doit être rétabli.","Immigration","Le PEQ permettait aux étudiants étrangers et travailleurs temporaires d'obtenir la résidence permanente rapidement. Réformé en 2020, ses critères ont été restreints.",-1,1,0,2,0,1),
  mkQ(39,"Le Québec doit accorder le droit de vote aux résidents permanents.","Immigration","Aucune province canadienne n'accorde le vote aux non-citoyens. Quelques municipalités à l'étranger (NYC, Bruxelles) le permettent.",-2,-1,-1,2,-2,1),
  mkQ(40,"Les entreprises doivent être obligées de former leurs employés immigrants au français.","Immigration","La Loi 96 (2022) a renforcé les obligations linguistiques des entreprises de 25 employés ou plus.",1,1,2,1,0,1),
  mkQ(41,"Le Québec doit limiter l'immigration dans les régions surpeuplées comme Montréal.","Immigration","Plus de 75% des nouveaux arrivants s'établissent dans le Grand Montréal. Programmes de régionalisation existent mais ont peu d'effet.",2,0,1,0,1,0),
  mkQ(42,"L'immigration est essentielle pour contrer le vieillissement démographique du Québec.","Immigration","L'âge médian au Québec est de 43 ans. Sans immigration, la population active diminuerait dès les années 2030.",1,2,0,2,-1,1),
  mkQ(43,"La loi 101 doit être renforcée pour protéger la langue française.","Langue et identité","La Charte de la langue française (1977) encadre l'usage du français. La Loi 96 (2022) l'a déjà renforcée. Débat continu sur son application.",2,0,2,1,-1,1),
  mkQ(44,"Le français doit être la seule langue officielle du Québec.","Langue et identité","Le français est seule langue officielle depuis 1977. La question porte sur le renforcement de ce statut face au bilinguisme institutionnel.",1,0,2,1,-1,1),
  mkQ(45,"La loi 21 sur la laïcité de l'État doit être maintenue.","Langue et identité","Adoptée en 2019, elle interdit le port de signes religieux pour certains employés de l'État en position d'autorité (juges, policiers, enseignants). Contestée devant la Cour suprême.",2,-1,2,-2,1,-2),
  mkQ(46,"Les cégeps anglophones doivent être soumis à la loi 101.","Langue et identité","Actuellement, les cégeps anglophones (Dawson, John Abbott, Vanier) ne sont pas soumis à la Loi 101. La Loi 96 a plafonné leurs effectifs.",2,-1,2,0,-2,0),
  mkQ(47,"Le Québec doit célébrer davantage son multiculturalisme.","Langue et identité","Le Québec rejette officiellement le multiculturalisme canadien (charte fédérale 1988) au profit de l'interculturalisme.",0,2,-1,2,1,2),
  mkQ(48,"L'interculturalisme québécois est préférable au multiculturalisme canadien.","Langue et identité","L'interculturalisme reconnaît la diversité tout en affirmant le français comme langue commune et la culture québécoise comme socle commun.",2,0,2,1,1,1),
  mkQ(49,"Les commerces doivent être obligés de servir les clients en français.","Langue et identité","La Loi 96 a précisé le droit d'être servi en français dans tous les commerces, mais l'application reste inégale.",2,1,2,1,0,1),
  mkQ(50,"Le Québec doit reconnaître le racisme systémique et agir pour le combattre.","Langue et identité","La CAQ refuse l'expression « racisme systémique ». QS et PLQ la défendent. Débat ravivé après le décès de Joyce Echaquan en 2020.",0,1,0,2,-2,2),
  mkQ(51,"Les symboles religieux ont leur place dans l'espace public.","Langue et identité","Lié au débat sur la laïcité (Loi 21). La croix de l'Assemblée nationale a été retirée en 2019.",-1,0,-1,1,1,0),
  mkQ(52,"Le gouvernement doit investir dans la promotion du français à l'international.","Langue et identité","Via l'Organisation internationale de la Francophonie (OIF) et les délégations du Québec à l'étranger (Paris, Bruxelles, Dakar...).",2,1,2,1,0,1),
  mkQ(53,"Les Québécois d'origine immigrante doivent pouvoir exprimer leur culture librement.","Langue et identité","Tension entre liberté d'expression culturelle et cadre interculturel québécois (langue commune, valeurs partagées).",1,2,1,2,2,2),
  mkQ(54,"L'histoire du Québec doit être enseignée de manière plus critique dans les écoles.","Langue et identité","Inclure davantage les perspectives autochtones, la traite des esclaves, l'histoire des minorités, etc. Réforme du programme depuis 2017.",-1,0,-1,2,-1,1),
  mkQ(55,"Le Québec doit créer un régime public d'assurance-médicaments universel.","Santé","Le Québec a un régime hybride public-privé depuis 1997 (RAMQ + assurances privées). Un régime entièrement public reste un projet débattu.",0,1,1,2,-1,2),
  mkQ(56,"Les soins de santé privés doivent être davantage développés au Québec.","Santé","Le secteur privé en santé est en croissance (cliniques, chirurgies). Tensions avec le principe d'universalité de la Loi canadienne sur la santé.",1,1,0,-2,2,-2),
  mkQ(57,"Le gouvernement doit embaucher plus de médecins de famille.","Santé","Plus de 1 million de Québécois n'ont pas de médecin de famille. Pénurie aiguë et débats sur la rémunération des médecins.",2,2,2,2,2,2),
  mkQ(58,"Les soins dentaires doivent être couverts par la RAMQ.","Santé","La RAMQ couvre certains soins dentaires pour les enfants et prestataires d'aide sociale. Le régime fédéral (2024) élargit la couverture.",0,1,1,2,-1,2),
  mkQ(59,"Les soins de santé mentale doivent être entièrement gratuits.","Santé","Psychothérapie peu couverte par la RAMQ. Listes d'attente longues. Programme québécois pour les troubles mentaux (PQPTM) en déploiement.",1,1,1,2,0,2),
  mkQ(60,"Le Québec doit permettre l'aide médicale à mourir pour les personnes souffrant de maladies mentales.","Santé","L'AMM existe au Québec depuis 2015 pour les maladies physiques. L'élargissement aux troubles mentaux est reporté au fédéral jusqu'en 2027.",0,0,0,1,-1,1),
  mkQ(61,"Les infirmières praticiennes spécialisées doivent avoir plus d'autonomie.","Santé","Les IPS peuvent diagnostiquer et prescrire depuis 2020, mais avec restrictions. L'élargissement de leurs pouvoirs est défendu pour pallier la pénurie.",2,2,2,1,1,1),
  mkQ(62,"Le Québec doit investir massivement en prévention de la santé.","Santé","Moins de 3% du budget santé va à la prévention. Plusieurs études démontrent un retour sur investissement élevé.",2,2,2,2,1,2),
  mkQ(63,"Les cliniques privées doivent être interdites.","Santé","Position radicale de QS. Les cliniques médicales privées sont en croissance, surtout pour la chirurgie de la cataracte et orthopédique.",-1,-2,-1,1,-2,0),
  mkQ(64,"Le cannabis récréatif doit être légalisé pour la vente en ligne par l'État.","Santé","Le cannabis est légal au Canada depuis 2018. Au Québec, vente exclusive par la SQDC (uniquement en magasin). Ailleurs au Canada, vente en ligne autorisée.",-1,1,0,1,1,0),
  mkQ(65,"Les vaccins doivent être obligatoires pour tous les élèves.","Santé","Aucun vaccin n'est obligatoire au Québec pour fréquenter l'école. Recommandations de la santé publique seulement.",2,2,2,1,-1,1),
  mkQ(66,"Le Québec doit créer plus de places en CHSLD publiques.","Santé","Centre d'hébergement et de soins de longue durée. Pénurie de places et débat sur les Maisons des aînés (modèle de la CAQ).",2,2,2,2,1,2),
  mkQ(67,"Les frais de scolarité au cégep et à l'université doivent être gratuits.","Éducation","Le cégep est déjà gratuit (sauf petits frais). Les frais universitaires québécois sont parmi les plus bas en Amérique du Nord (~3 000$/an).",-1,-1,0,2,-2,1),
  mkQ(68,"L'école doit être obligatoire dès 4 ans.","Éducation","L'école est obligatoire dès 6 ans. Les maternelles 4 ans sont déployées progressivement par la CAQ depuis 2018.",2,1,1,1,0,1),
  mkQ(69,"Les écoles privées doivent recevoir moins de financement public.","Éducation","Le Québec subventionne les écoles privées à environ 60% des coûts publics. Débat sur l'équité et l'effet ségrégatif.",-1,-1,0,2,-2,1),
  mkQ(70,"L'enseignement de la programmation informatique doit être obligatoire à l'école primaire.","Éducation","Le programme québécois inclut la culture numérique depuis 2018, mais sans obligation formelle de programmation.",1,1,1,1,1,1),
  mkQ(71,"Les écoles doivent avoir plus d'autonomie dans leur gestion.","Éducation","Loi 40 (2020) a aboli les commissions scolaires francophones. Débat continu sur la décentralisation et la gouvernance.",1,1,0,-1,2,0),
  mkQ(72,"Le Québec doit investir davantage dans l'éducation des adultes.","Éducation","Taux d'analphabétisme fonctionnel élevé (~19%). Centres de formation aux adultes en sous-financement chronique.",1,1,1,2,0,1),
  mkQ(73,"Les écoles doivent offrir plus de services de santé mentale aux élèves.","Éducation","Pénurie de psychologues scolaires. Détresse psychologique en hausse chez les jeunes selon plusieurs études.",2,2,2,2,1,2),
  mkQ(74,"L'histoire du Québec doit être enseignée de façon plus approfondie.","Éducation","Cours d'histoire du Québec et du Canada en secondaire 3 et 4. Réforme du programme en 2017 a relancé le débat.",2,1,2,1,1,1),
  mkQ(75,"Les écoles doivent bannir les téléphones portables en classe.","Éducation","Mesure adoptée au Québec en 2024 pour le primaire et secondaire (avec exceptions pédagogiques).",2,1,1,0,2,1),
  mkQ(76,"Le gouvernement doit offrir plus de bourses aux étudiants étrangers.","Éducation","Les frais des étudiants internationaux ont fortement augmenté en 2024 (anglophones), causant la baisse des inscriptions.",0,1,0,1,-1,0),
  mkQ(77,"Le Québec doit légaliser la possession de petites quantités de drogues dures.","Société","Approche défendue par certaines villes (Vancouver, Toronto). Crise des opioïdes et décès par surdose en hausse au Québec.",-1,0,-1,1,-2,0),
  mkQ(78,"La prostitution doit être décriminalisée.","Société","La prostitution est légale au Canada mais l'achat de services sexuels est criminalisé (modèle nordique). Débat sur la sécurité des travailleuses.",-1,0,0,1,-2,1),
  mkQ(79,"Les peines pour crimes violents doivent être plus sévères.","Société","Compétence largement fédérale (Code criminel). Le Québec a une approche traditionnellement plus axée sur la réhabilitation.",2,1,1,-2,2,-1),
  mkQ(80,"Le Québec doit créer un registre des armes à feu provincial.","Société","Le registre québécois des armes d'épaule existe depuis 2018 (après l'abolition du registre fédéral). Débat sur son efficacité.",1,1,1,2,-2,1),
  mkQ(81,"Les policiers doivent porter des caméras corporelles.","Société","Plusieurs corps policiers québécois en sont équipés (SPVM en déploiement). Enjeux : transparence, respect de la vie privée, coûts.",1,1,1,1,1,1),
  mkQ(82,"Le financement des groupes communautaires doit être augmenté.","Société","Plus de 4 000 organismes communautaires au Québec. Sous-financement chronique malgré leur rôle dans le filet social.",0,1,1,2,-1,2),
  mkQ(83,"Le Québec doit reconnaître le droit à l'avortement comme un droit fondamental.","Société","L'avortement est légal et accessible au Québec, mais pas inscrit comme droit fondamental dans la Charte québécoise.",1,2,2,2,-1,2),
  mkQ(84,"Les personnes transgenres doivent avoir accès facilement aux soins d'affirmation de genre.","Société","La RAMQ couvre certains soins. Listes d'attente très longues. Débats récents sur l'âge minimal et l'accompagnement.",0,1,1,2,-1,2),
  mkQ(85,"Le gouvernement doit investir dans le logement social.","Société","Programme AccèsLogis sous-financé selon plusieurs rapports. Crise du logement aiguë dans toutes les régions.",1,1,1,2,-1,2),
  mkQ(86,"Les sans-abri doivent avoir accès à un logement gratuit.","Société","Approche « logement d'abord » (Housing First) vs approche conditionnelle. Débat sur les ressources disponibles.",0,0,1,2,-2,1),
  mkQ(87,"Le Québec doit interdire les conversions thérapeutiques pour les personnes LGBTQ+.","Société","Pratiques visant à modifier l'orientation sexuelle ou identité de genre. Interdites au fédéral depuis 2022. Loi québécoise depuis 2020.",1,2,2,2,-1,2),
  mkQ(88,"Les peines pour crimes économiques doivent être plus sévères.","Société","Fraude, évasion fiscale, corruption. Débat ravivé par la Commission Charbonneau (2011-2015).",1,1,2,2,1,2),
  mkQ(89,"Le Québec doit tenir un référendum sur la souveraineté dans un premier mandat.","Souveraineté","Deux référendums tenus : 1980 (40,4% oui) et 1995 (49,4% oui). Le PQ promet un référendum lors d'un éventuel mandat.",-2,-2,2,1,-2,0),
  mkQ(90,"Le Québec devrait devenir un pays indépendant.","Souveraineté","Question fondamentale qui divise la politique québécoise depuis les années 1960. Sondages oscillent autour de 35-40% pour l'indépendance.",-1,-2,2,1,-2,0),
  mkQ(91,"Le Québec doit rester dans le Canada.","Souveraineté","Position fédéraliste. Le Québec n'a pas signé la Constitution de 1982. Demandes historiques de reconnaissance comme société distincte/nation.",1,2,-2,-1,2,0),
  mkQ(92,"Le Québec doit avoir plus de pouvoirs en immigration.","Souveraineté","Le Québec a déjà un pouvoir partagé en immigration (Accord Cullen-Couture 1978, Accord Canada-Québec 1991). Demande accrue sur les seuils et l'immigration temporaire.",2,1,2,2,1,1),
  mkQ(93,"Le Québec doit collecter tous ses impôts au lieu de passer par Ottawa.","Souveraineté","Actuellement, deux déclarations d'impôt (fédérale et provinciale). Une déclaration unique gérée par Québec est revendiquée.",1,-1,2,2,0,1),
  mkQ(94,"Le Québec doit avoir sa propre politique étrangère.","Souveraineté","Le Québec a déjà des délégations à l'étranger. La Doctrine Gérin-Lajoie (1965) affirme la prolongation internationale des compétences provinciales.",0,-1,2,1,-1,0),
  mkQ(95,"Le fédéralisme canadien fonctionne bien pour le Québec.","Souveraineté","Question d'évaluation globale du système canadien. Tensions historiques sur les compétences, les transferts, la péréquation.",0,2,-2,-1,1,-1),
  mkQ(96,"Le Québec doit avoir son propre système de retraite public.","Souveraineté","Le Québec a déjà le RRQ (Régime de rentes du Québec), distinct du RPC fédéral. Question d'élargissement et d'autonomie complète.",0,-1,2,1,0,1),
  mkQ(97,"Le Québec doit quitter la monarchie canadienne.","Souveraineté","L'Assemblée nationale a aboli le serment au roi en 2022. Question constitutionnelle complexe nécessitant l'unanimité fédérale-provinciale.",0,0,2,2,1,1),
  mkQ(98,"Le Québec doit avoir un siège permanent à l'ONU.","Souveraineté","Réservé aux États souverains. Le Québec a un statut d'observateur dans certaines organisations internationales (UNESCO, OIF).",0,-1,2,1,-1,0),
  mkQ(99,"Le Québec doit avoir sa propre constitution.","Souveraineté","Idée portée par plusieurs partis. Le Québec n'a jamais signé la Constitution canadienne de 1982.",1,0,2,2,0,1),
  mkQ(100,"L'indépendance du Québec est une condition nécessaire à son épanouissement.","Souveraineté","Position philosophique fondamentale qui sépare souverainistes et fédéralistes depuis les années 1960.",-1,-2,2,1,-2,0),
];

// Map of question ID → English translation { text, category, help }
const questionsEn = {
1: { text: "Quebec must totally ban the exploration and exploitation of hydrocarbons on its territory.", category: "Environment", help: "In 2022, Quebec adopted Act 21 ending hydrocarbon exploration and production. This debate is about maintaining or strengthening this ban (shale gas, oil, natural gas)." },
2: { text: "Quebec must build new hydroelectric plants to meet energy demand.", category: "Environment", help: "Hydro-Québec projects consumption could double by 2050. New projects raise environmental issues and First Nations relations." },
3: { text: "The carbon tax is an effective tool to fight climate change.", category: "Environment", help: "Quebec uses the SPEDE (cap-and-trade system), distinct from the federal carbon tax. It generates revenues reinvested in the energy transition." },
4: { text: "Quebec must ban the sale of new gasoline vehicles by 2030.", category: "Environment", help: "Quebec has already announced a ban on new gasoline vehicle sales by 2035. This question is about accelerating the deadline." },
5: { text: "The government must massively subsidize the energy transition for businesses.", category: "Environment", help: "Several programs already exist (ÉcoPerformance, Roulez vert). The debate is about the scale of support and attached environmental conditions." },
6: { text: "The Quebec City tramway project must be completed at all costs.", category: "Environment", help: "The Quebec City tramway is a major public transit project valued at over $7 billion. It has faced numerous revisions and political controversies." },
7: { text: "The third link between Quebec City and Lévis must be a road tunnel, not a public-transit tunnel.", category: "Environment", help: "The project aims to link Quebec City to the South Shore under the St. Lawrence River. Its nature (road vs transit) has divided parties since 2018." },
8: { text: "Quebec must protect at least 30% of its territory by 2030 to preserve biodiversity.", category: "Environment", help: "International target (COP15 Montreal 2022). Quebec currently has about 17% of its territory protected, mainly in the north." },
9: { text: "Organic farming must be encouraged by government subsidies.", category: "Environment", help: "Less than 10% of Quebec farms are certified organic. The 2018-2025 Bioalimentary Policy set growth targets." },
10: { text: "Quebec must close all its natural gas thermal plants by 2035.", category: "Environment", help: "Gas plants mainly serve winter demand peaks. Closing them would require storable alternatives (batteries, hydrogen)." },
11: { text: "Waste management must be nationalized and managed by the state.", category: "Environment", help: "Currently managed by municipalities and private companies. Quebec has a deposit-return and selective collection system under reform." },
12: { text: "Quebec must invest in intercity rail transport to reduce emissions.", category: "Environment", help: "The federal TGF (high-frequency rail) Quebec-Toronto project is under discussion. Quebec has no modern inter-regional passenger rail network." },
13: { text: "Polluting companies must pay a carbon emissions tax.", category: "Environment", help: "Quebec's SPEDE has bound large industries since 2013. Debate is about expanding and strengthening the system." },
14: { text: "Quebec must develop offshore wind energy in the Gulf of St. Lawrence.", category: "Environment", help: "No offshore wind farms exist in Quebec. Issues: impact on fishing, marine mammals, and costs vs onshore wind." },
15: { text: "Hunting and fishing must be strictly regulated to protect wildlife.", category: "Environment", help: "Quebec issues over 400,000 permits annually. Issues: woodland caribou, Atlantic salmon, declining species." },
16: { text: "The government must reduce personal income taxes to stimulate the economy.", category: "Economy", help: "Quebec has some of the highest personal income taxes in Canada. The CAQ reduced the first tax bracket in 2023." },
17: { text: "Government subsidies to businesses must be drastically reduced.", category: "Economy", help: "Investissement Québec and the Economic Development Fund distribute billions in business aid each year." },
18: { text: "The minimum wage must be raised to $20 per hour.", category: "Economy", help: "Quebec's minimum wage is $16.10 (May 2025). An increase to $20 would represent about +24%." },
19: { text: "Quebec must nationalize essential services like electricity and water.", category: "Economy", help: "Electricity is already nationalized (Hydro-Québec since 1962). Drinking water is municipal. The question is about potential expansion." },
20: { text: "The government must create a wealth tax on the ultra-rich.", category: "Economy", help: "No wealth tax exists in Canada. Several European countries have one, some have abolished it (France 2017)." },
21: { text: "Privatization of public services is a viable solution to reduce costs.", category: "Economy", help: "Long-standing debate in Quebec, especially in health. Contradictory studies on real savings." },
22: { text: "Quebec must invest massively in innovation and research.", category: "Economy", help: "Quebec invests about 2.3% of GDP in R&D, below the OECD target of 3%. Key sectors: aerospace, AI, life sciences." },
23: { text: "Banks and financial institutions must be more regulated.", category: "Economy", help: "Banking regulation is primarily federal. The AMF oversees Quebec's financial markets." },
24: { text: "The government must guarantee a universal basic income for all Quebecers.", category: "Economy", help: "Discussed worldwide. In Quebec, the Basic Income Program (2023) already targets people with severe constraints." },
25: { text: "Quebec must reduce its public debt before making new spending.", category: "Economy", help: "Quebec's net debt is about 38% of GDP. A Debt Reduction Act sets targets for 2038." },
26: { text: "Quebec businesses must be protected from foreign competition.", category: "Economy", help: "Buy-local issue, notably through public procurement and the \"Quebec Buying Strategy\"." },
27: { text: "The government must offer tax credits for home purchases.", category: "Economy", help: "Severe housing crisis in Quebec. Several programs exist (Accès Famille, federal HBP) but their effectiveness is debated." },
28: { text: "Unions have too much power in Quebec.", category: "Economy", help: "Quebec's unionization rate (~38%) is among the highest in North America. Quebec's Labour Code is more protective than elsewhere." },
29: { text: "Quebec must develop its mining industry to diversify its economy.", category: "Economy", help: "The Plan Nord and mining development (lithium, graphite, rare earths) divides: development vs territory protection and First Nations relations." },
30: { text: "The government must create a public investment bank.", category: "Economy", help: "The Caisse de dépôt et placement already exists (pension fund management). The idea would be a public lending bank for individuals/SMEs." },
31: { text: "Quebec must significantly reduce its immigration thresholds.", category: "Immigration", help: "Quebec welcomes about 50,000 permanent immigrants per year. The CAQ has made reducing thresholds a major issue since 2018." },
32: { text: "Immigrants must demonstrate knowledge of French before being admitted.", category: "Immigration", help: "Since 2024, new economic arrivals must demonstrate a level of French (oral level 7). Possible expansion to other categories." },
33: { text: "Quebec must welcome more refugees.", category: "Immigration", help: "Quebec welcomed thousands of Syrian (2015-16) and Ukrainian (2022) refugees. Reception capacity and integration services are central to the debate." },
34: { text: "Temporary immigration (foreign workers, students) must be reduced.", category: "Immigration", help: "Temporary immigration to Quebec has exploded: over 500,000 non-permanent residents in 2024, largely outside provincial control." },
35: { text: "Integration services for immigrants must be strengthened.", category: "Immigration", help: "Francization, credential recognition, employment support: chronically underfunded programs according to several studies." },
36: { text: "Quebec must favour economic immigration over family immigration.", category: "Immigration", help: "Economic immigration represents about 65% of admissions. Family reunification remains largely federal jurisdiction." },
37: { text: "Immigrants must adapt to Quebec values.", category: "Immigration", help: "Concept formalized in the Declaration on Common Values (interculturalism), opposed to Canadian multiculturalism." },
38: { text: "The Quebec Experience Program (PEQ) must be reinstated.", category: "Immigration", help: "The PEQ allowed foreign students and temporary workers to quickly obtain permanent residency. Reformed in 2020, its criteria were restricted." },
39: { text: "Quebec must grant the right to vote to permanent residents.", category: "Immigration", help: "No Canadian province grants voting rights to non-citizens. A few municipalities abroad (NYC, Brussels) allow it." },
40: { text: "Companies must be required to train their immigrant employees in French.", category: "Immigration", help: "Act 96 (2022) strengthened language obligations for companies of 25 employees or more." },
41: { text: "Quebec must limit immigration in overcrowded regions like Montreal.", category: "Immigration", help: "Over 75% of newcomers settle in Greater Montreal. Regionalization programs exist but have little effect." },
42: { text: "Immigration is essential to counter Quebec's demographic aging.", category: "Immigration", help: "The median age in Quebec is 43. Without immigration, the active population would begin to decline in the 2030s." },
43: { text: "Act 101 must be strengthened to protect the French language.", category: "Language & identity", help: "The Charter of the French Language (1977) governs French usage. Act 96 (2022) already strengthened it. Ongoing debate on its application." },
44: { text: "French must be the sole official language of Quebec.", category: "Language & identity", help: "French has been the sole official language since 1977. The question is about strengthening this status against institutional bilingualism." },
45: { text: "Act 21 on state secularism must be maintained.", category: "Language & identity", help: "Adopted in 2019, it prohibits the wearing of religious symbols for certain state employees in positions of authority (judges, police, teachers). Contested before the Supreme Court." },
46: { text: "English-language CEGEPs must be subject to Act 101.", category: "Language & identity", help: "Currently, anglophone CEGEPs (Dawson, John Abbott, Vanier) are not subject to Act 101. Act 96 capped their enrolment." },
47: { text: "Quebec must celebrate its multiculturalism more.", category: "Language & identity", help: "Quebec officially rejects Canadian multiculturalism (1988 federal charter) in favour of interculturalism." },
48: { text: "Quebec interculturalism is preferable to Canadian multiculturalism.", category: "Language & identity", help: "Interculturalism recognizes diversity while affirming French as the common language and Quebec culture as the common foundation." },
49: { text: "Businesses must be required to serve customers in French.", category: "Language & identity", help: "Act 96 clarified the right to be served in French in all businesses, but enforcement remains uneven." },
50: { text: "Quebec must recognize systemic racism and act to combat it.", category: "Language & identity", help: "The CAQ refuses the term \"systemic racism\". QS and PLQ defend it. Debate revived after Joyce Echaquan's death in 2020." },
51: { text: "Religious symbols have their place in the public sphere.", category: "Language & identity", help: "Linked to the secularism debate (Act 21). The crucifix at the National Assembly was removed in 2019." },
52: { text: "The government must invest in promoting French internationally.", category: "Language & identity", help: "Via the Organisation internationale de la Francophonie (OIF) and Quebec's delegations abroad (Paris, Brussels, Dakar...)." },
53: { text: "Quebecers of immigrant origin must be able to freely express their culture.", category: "Language & identity", help: "Tension between cultural freedom of expression and Quebec's intercultural framework (common language, shared values)." },
54: { text: "Quebec history must be taught more critically in schools.", category: "Language & identity", help: "Include more Indigenous perspectives, the history of slavery, minorities, etc. Curriculum reform since 2017." },
55: { text: "Quebec must create a universal public drug insurance plan.", category: "Health", help: "Quebec has had a hybrid public-private plan since 1997 (RAMQ + private insurance). A fully public plan remains a debated project." },
56: { text: "Private healthcare must be further developed in Quebec.", category: "Health", help: "The private health sector is growing (clinics, surgeries). Tensions with the universality principle of the Canada Health Act." },
57: { text: "The government must hire more family doctors.", category: "Health", help: "Over 1 million Quebecers don't have a family doctor. Acute shortage and debates on physician compensation." },
58: { text: "Dental care must be covered by RAMQ.", category: "Health", help: "RAMQ covers certain dental care for children and social assistance recipients. The federal plan (2024) expands coverage." },
59: { text: "Mental health care must be entirely free.", category: "Health", help: "Psychotherapy is barely covered by RAMQ. Long wait lists. Quebec Program for Mental Health Disorders (PQPTM) being rolled out." },
60: { text: "Quebec must allow medical assistance in dying for people with mental illnesses.", category: "Health", help: "MAID has existed in Quebec since 2015 for physical illnesses. Expansion to mental disorders is postponed federally until 2027." },
61: { text: "Specialized nurse practitioners must have more autonomy.", category: "Health", help: "SNPs can diagnose and prescribe since 2020, but with restrictions. Expanding their powers is defended to address the shortage." },
62: { text: "Quebec must invest massively in health prevention.", category: "Health", help: "Less than 3% of the health budget goes to prevention. Several studies show a high return on investment." },
63: { text: "Private clinics must be banned.", category: "Health", help: "Radical position of QS. Private medical clinics are growing, especially for cataract and orthopedic surgery." },
64: { text: "Recreational cannabis must be legalized for online sale by the state.", category: "Health", help: "Cannabis has been legal in Canada since 2018. In Quebec, exclusive sale through SQDC (in-store only). Elsewhere in Canada, online sales allowed." },
65: { text: "Vaccines must be mandatory for all students.", category: "Health", help: "No vaccine is mandatory in Quebec to attend school. Public health recommendations only." },
66: { text: "Quebec must create more public CHSLD spaces.", category: "Health", help: "Long-term care hospitals. Space shortage and debate about the Maisons des aînés (CAQ model)." },
67: { text: "CEGEP and university tuition fees must be free.", category: "Education", help: "CEGEP is already free (with small fees). Quebec university fees are among the lowest in North America (~$3,000/year)." },
68: { text: "School must be mandatory from age 4.", category: "Education", help: "School is mandatory from age 6. 4-year-old kindergarten is gradually being rolled out by the CAQ since 2018." },
69: { text: "Private schools must receive less public funding.", category: "Education", help: "Quebec subsidizes private schools at about 60% of public costs. Debate on equity and segregation effects." },
70: { text: "Computer programming instruction must be mandatory in elementary school.", category: "Education", help: "Quebec curriculum includes digital culture since 2018, but without formal programming requirement." },
71: { text: "Schools must have more autonomy in their management.", category: "Education", help: "Act 40 (2020) abolished francophone school boards. Ongoing debate on decentralization and governance." },
72: { text: "Quebec must invest more in adult education.", category: "Education", help: "High functional illiteracy rate (~19%). Adult training centers in chronic underfunding." },
73: { text: "Schools must offer more mental health services to students.", category: "Education", help: "Shortage of school psychologists. Rising psychological distress among youth according to several studies." },
74: { text: "Quebec history must be taught more deeply.", category: "Education", help: "Quebec and Canadian history courses in secondary 3 and 4. 2017 curriculum reform revived the debate." },
75: { text: "Schools must ban cell phones in the classroom.", category: "Education", help: "Measure adopted in Quebec in 2024 for elementary and secondary (with pedagogical exceptions)." },
76: { text: "The government must offer more scholarships to foreign students.", category: "Education", help: "International student fees rose sharply in 2024 (anglophones), causing enrolment decline." },
77: { text: "Quebec must legalize possession of small quantities of hard drugs.", category: "Society", help: "Approach defended by some cities (Vancouver, Toronto). Opioid crisis and overdose deaths rising in Quebec." },
78: { text: "Prostitution must be decriminalized.", category: "Society", help: "Prostitution is legal in Canada but purchasing sexual services is criminalized (Nordic model). Debate on worker safety." },
79: { text: "Sentences for violent crimes must be more severe.", category: "Society", help: "Largely federal jurisdiction (Criminal Code). Quebec has a traditionally more rehabilitation-focused approach." },
80: { text: "Quebec must create a provincial firearms registry.", category: "Society", help: "Quebec's long-gun registry has existed since 2018 (after the federal registry's abolition). Debate on its effectiveness." },
81: { text: "Police officers must wear body cameras.", category: "Society", help: "Several Quebec police services are equipped (SPVM rollout). Issues: transparency, privacy, costs." },
82: { text: "Funding for community groups must be increased.", category: "Society", help: "Over 4,000 community organizations in Quebec. Chronic underfunding despite their role in the social safety net." },
83: { text: "Quebec must recognize the right to abortion as a fundamental right.", category: "Society", help: "Abortion is legal and accessible in Quebec, but not enshrined as a fundamental right in the Quebec Charter." },
84: { text: "Transgender people must have easy access to gender-affirming care.", category: "Society", help: "RAMQ covers certain care. Very long wait lists. Recent debates on minimum age and support." },
85: { text: "The government must invest in social housing.", category: "Society", help: "AccèsLogis program is underfunded according to several reports. Severe housing crisis in all regions." },
86: { text: "Homeless people must have access to free housing.", category: "Society", help: "Housing First approach vs conditional approach. Debate on available resources." },
87: { text: "Quebec must ban conversion therapy for LGBTQ+ people.", category: "Society", help: "Practices aimed at changing sexual orientation or gender identity. Banned federally since 2022. Quebec law since 2020." },
88: { text: "Sentences for economic crimes must be more severe.", category: "Society", help: "Fraud, tax evasion, corruption. Debate revived by the Charbonneau Commission (2011-2015)." },
89: { text: "Quebec must hold a sovereignty referendum in a first mandate.", category: "Sovereignty", help: "Two referendums held: 1980 (40.4% yes) and 1995 (49.4% yes). The PQ promises a referendum in a possible mandate." },
90: { text: "Quebec should become an independent country.", category: "Sovereignty", help: "Fundamental question that has divided Quebec politics since the 1960s. Polls hover around 35-40% for independence." },
91: { text: "Quebec must remain in Canada.", category: "Sovereignty", help: "Federalist position. Quebec did not sign the 1982 Constitution. Historical demands for recognition as a distinct society/nation." },
92: { text: "Quebec must have more powers in immigration.", category: "Sovereignty", help: "Quebec already has shared power in immigration (Cullen-Couture Accord 1978, Canada-Quebec Accord 1991). Increased demand on thresholds and temporary immigration." },
93: { text: "Quebec must collect all its taxes instead of going through Ottawa.", category: "Sovereignty", help: "Currently, two tax returns (federal and provincial). A single return managed by Quebec is being demanded." },
94: { text: "Quebec must have its own foreign policy.", category: "Sovereignty", help: "Quebec already has delegations abroad. The Gérin-Lajoie Doctrine (1965) asserts the international extension of provincial jurisdiction." },
95: { text: "Canadian federalism works well for Quebec.", category: "Sovereignty", help: "Question of overall evaluation of the Canadian system. Historical tensions over jurisdictions, transfers, equalization." },
96: { text: "Quebec must have its own public pension system.", category: "Sovereignty", help: "Quebec already has the QPP (Quebec Pension Plan), distinct from the federal CPP. Question of expansion and full autonomy." },
97: { text: "Quebec must leave the Canadian monarchy.", category: "Sovereignty", help: "The National Assembly abolished the oath to the King in 2022. Complex constitutional question requiring federal-provincial unanimity." },
98: { text: "Quebec must have a permanent seat at the UN.", category: "Sovereignty", help: "Reserved for sovereign states. Quebec has observer status in certain international organizations (UNESCO, OIF)." },
99: { text: "Quebec must have its own constitution.", category: "Sovereignty", help: "Idea carried by several parties. Quebec has never signed the 1982 Canadian Constitution." },
100: { text: "Quebec independence is a necessary condition for its flourishing.", category: "Sovereignty", help: "Fundamental philosophical position separating sovereignists and federalists since the 1960s." },
};

const q20Indices = [0,5,17,20,30,32,42,44,46,54,56,66,72,79,82,84,88,89,91,94];
const q20 = q20Indices.map((idx, i) => ({ ...q100[idx], id: i + 1 }));

// Augmenter chaque question avec les positions des partis supplémentaires (tier 2 + tier 3)
q100.forEach((q, i) => {
  const extras = extraPositions[i];
  if (extras) {
    extraPartyIds.forEach((pid, j) => {
      q.positions.push({ p: pid, v: extras[j] });
    });
  }
  const extras2 = extraPositions2[i];
  if (extras2) {
    extraPartyIds2.forEach((pid, j) => {
      q.positions.push({ p: pid, v: extras2[j] });
    });
  }
});
// q20 partage les références d'objets via spread, donc les positions augmentées sont déjà partagées

const IMPORTANT_WEIGHT = 2;
const SOFT_LIMIT = 7;

const answerOptions = [
  { value: 2, label: "Tout à fait d'accord", labelEn: "Strongly agree", color: "#16a34a", lightColor: "#dcfce7" },
  { value: 1, label: "Plutôt d'accord", labelEn: "Somewhat agree", color: "#65a30d", lightColor: "#ecfccb" },
  { value: 0, label: "Partagé / Nuancé", labelEn: "Mixed / Nuanced", color: "#737373", lightColor: "#f5f5f5" },
  { value: -1, label: "Plutôt pas d'accord", labelEn: "Somewhat disagree", color: "#ea580c", lightColor: "#ffedd5" },
  { value: -2, label: "Pas du tout d'accord", labelEn: "Strongly disagree", color: "#dc2626", lightColor: "#fee2e2" },
];

const answerLabels = { 2: "Tout à fait d'accord", 1: "Plutôt d'accord", 0: "Partagé / Nuancé", [-1]: "Plutôt pas d'accord", [-2]: "Pas du tout d'accord" };
const answerLabelsEn = { 2: "Strongly agree", 1: "Somewhat agree", 0: "Mixed / Nuanced", [-1]: "Somewhat disagree", [-2]: "Strongly disagree" };
// ═══════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════

function FleurDeLys({ size = 16, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M12 2c-.6 1.5-1.5 2.7-2.5 3.7C8.5 6.5 8 7.5 8 9c0 1 .5 2 1.5 2.5L8 13c-1 .5-2 .5-2.5 0-1-1-.5-2.5.5-3-.5-1.5-.5-3 .5-4 .5 1.5 2 2 3.5 1.5C9.5 7 10 6 10 5c0-1.5 1-2.5 2-3zm0 0c.6 1.5 1.5 2.7 2.5 3.7.5 1 1.5 2 1.5 3.3 0 1-.5 2-1.5 2.5L16 13c1 .5 2 .5 2.5 0 1-1 .5-2.5-.5-3 .5-1.5.5-3-.5-4-.5 1.5-2 2-3.5 1.5C14.5 7 14 6 14 5c0-1.5-1-2.5-2-3zM5 14h14v2H5v-2zm6 4h2v4h-2v-4z"/>
    </svg>
  );
}

function getInitials(name) {
  if (!name) return "?";
  // Gère le cas "Parti autorisé par le DGEQ" (fallback quand pas d'info)
  if (name.startsWith("Parti autorisé")) return "?";
  // Gère le cas "Ruba Ghazal et Sol Zanetti" (co-porte-paroles)
  if (name.includes(" et ")) {
    const parts = name.split(" et ");
    const first = parts[0].split(/\s+/).filter(Boolean).pop();
    const second = parts[1].split(/\s+/).filter(Boolean).pop();
    return ((first?.[0] || "") + (second?.[0] || "")).toUpperCase();
  }
  return name.split(/[\s-]+/).map(n => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function Avatar({ leader, color, colorDark, size = 40, ring = false }) {
  const initials = getInitials(leader);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color} 0%, ${colorDark} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.38, letterSpacing: -0.5,
      boxShadow: ring ? `0 0 0 4px #fff, 0 0 0 6px ${color}, 0 12px 32px ${color}50` : `0 4px 14px ${color}33`,
      flexShrink: 0, userSelect: "none", textShadow: "0 1px 2px rgba(0,0,0,0.18)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.28), transparent 55%)" }} />
      <span style={{ position: "relative", zIndex: 1 }}>{initials}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HOMEPAGE
// ═══════════════════════════════════════════════════════════

function HomePage({ onStart, onMethodo, onProject, onSupport, lang = "fr", t }) {
  // Safety: provide defaults if t is missing (preview mode)
  t = t || {
    quickQuiz: "Quiz rapide", fullQuiz: "Quiz complet", allParties: "Tous les partis",
    quickQuizDesc: "20 questions essentielles. Un aperçu avec les 6 principaux partis.",
    fullQuizDesc: "100 questions sur tous les enjeux. 6 principaux partis québécois.",
    allPartiesDesc: "100 questions comparées aux 21 partis autorisés — représentation démocratique élargie.",
    parties6: "6 partis", parties18: "21 partis", min2: "≈ 2 min", min10: "≈ 10 min", min12: "≈ 12 min",
    new: "NOUVEAU",
    heroBadge: "Élections générales québécoises · 2026",
    heroTitleA: "Pour qui voter au", heroTitleB: "Québec en", heroTitleYear: "2026",
    heroSubtitle: "Répondez à nos questions et découvrez quel parti politique québécois correspond le mieux à vos convictions.",
    heroMeta: "Outil citoyen indépendant · Gratuit · Sans pub · Sans enregistrement",
    partiesTitle: "Les partis en présence",
    partiesSubtitle: "21 formations politiques provinciales autorisées par le DGEQ",
    tierMain: "Partis principaux · représentés ou > 1 % aux dernières élections",
    tierEmerging: "Partis émergents et alternatifs · avec candidats aux dernières élections",
    tierNiche: "Partis de niche et protestataires · autorisés par le DGEQ",
    partiesNote: "Tous inclus dans le quiz « Tous les partis ». Pour les photos et logos officiels, visitez les sites des partis.",
    officialSite: "Site officiel →",
    guaranteesTitle: "Nos garanties",
    guaranteesSubtitle: "Conçu autour de votre vie privée et de la transparence",
    methodology: "Méthodologie", project: "Le projet", support: "Soutenir",
  };
  const guarantees = lang === "en" ? [
    { icon: <ShieldCheck size={22} />, title: "No data stored", desc: "Your answers stay on your device. Nothing sent, nothing stored." },
    { icon: <CircleSlash size={22} />, title: "Zero advertising", desc: "No ads, no tracking, no third-party cookies." },
    { icon: <Heart size={22} />, title: "Donation-funded", desc: "100% independent. No political or commercial funding." },
    { icon: <Eye size={22} />, title: "Transparent", desc: "Methodology, code and sources verifiable by all." },
    { icon: <Shuffle size={22} />, title: "Random order", desc: "Questions and parties shown in random order." },
    { icon: <Scale size={22} />, title: "Indicative only", desc: "A tool to help you think. The final vote is yours." },
  ] : [
    { icon: <ShieldCheck size={22} />, title: "Aucune donnée enregistrée", desc: "Vos réponses restent sur votre appareil. Rien n'est envoyé, rien n'est stocké." },
    { icon: <CircleSlash size={22} />, title: "Zéro publicité", desc: "Pas de pub, pas de pistage, aucun cookie tiers." },
    { icon: <Heart size={22} />, title: "Financé par les dons", desc: "100% indépendant. Aucun financement politique ou commercial." },
    { icon: <Eye size={22} />, title: "Transparent", desc: "Méthodologie, code et sources vérifiables par tous." },
    { icon: <Shuffle size={22} />, title: "Ordre aléatoire", desc: "Questions et partis affichés dans un ordre aléatoire." },
    { icon: <Scale size={22} />, title: "Indicatif seulement", desc: "Un outil d'aide à la réflexion. Le vote final vous appartient." },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <section style={{ textAlign: "center", padding: "32px 0 48px" }}>
        <div className="badge-pill">
          <FleurDeLys size={14} color="#003da5" />
          <span>{t.heroBadge}</span>
        </div>
        <h1 className="hero-title">
          {t.heroTitleA}<br />{t.heroTitleB} <span className="text-gradient">{t.heroTitleYear}</span>&nbsp;?
        </h1>
        <p className="hero-subtitle">
          {t.heroSubtitle}
        </p>
        <p className="hero-meta">{t.heroMeta}</p>

        <div className="quiz-cards quiz-cards-three">
          <button className="quiz-card quiz-card-primary" onClick={() => onStart("quick")}>
            <div className="quiz-card-icon"><Zap size={22} strokeWidth={2.25} /></div>
            <h3>{t.quickQuiz}</h3>
            <p>{t.quickQuizDesc}</p>
            <div className="quiz-card-meta">
              <span className="time-pill">{t.min2}</span>
              <span className="parties-pill">{t.parties6}</span>
              <span className="arrow"><ArrowRight size={18} /></span>
            </div>
          </button>
          <button className="quiz-card" onClick={() => onStart("full")}>
            <div className="quiz-card-icon"><Target size={22} strokeWidth={2.25} /></div>
            <h3>{t.fullQuiz}</h3>
            <p>{t.fullQuizDesc}</p>
            <div className="quiz-card-meta">
              <span className="time-pill">{t.min10}</span>
              <span className="parties-pill">{t.parties6}</span>
              <span className="arrow"><ArrowRight size={18} /></span>
            </div>
          </button>
          <button className="quiz-card quiz-card-special" onClick={() => onStart("all")}>
            <div className="quiz-card-badge">{t.new}</div>
            <div className="quiz-card-icon"><FleurDeLys size={22} color="currentColor" /></div>
            <h3>{t.allParties}</h3>
            <p>{t.allPartiesDesc}</p>
            <div className="quiz-card-meta">
              <span className="time-pill">{t.min12}</span>
              <span className="parties-pill parties-pill-special">{t.parties18}</span>
              <span className="arrow"><ArrowRight size={18} /></span>
            </div>
          </button>
        </div>
      </section>

      <section style={{ marginBottom: 64 }}>
        <h2 className="section-title">{t.partiesTitle}</h2>
        <p className="section-subtitle">{t.partiesSubtitle}</p>

        <div className="tier-label"><Star size={13} strokeWidth={2.5} /> {t.tierMain}</div>
        <div className="party-grid-full">
          {parties.filter(p => p.main).map(p => (
            <a
              key={p.id}
              href={p.website || "#"}
              target={p.website ? "_blank" : undefined}
              rel={p.website ? "noopener noreferrer" : undefined}
              className={`party-card-full ${p.website ? "" : "party-card-nolink"}`}
              onClick={e => { if (!p.website) e.preventDefault(); }}
            >
              <Avatar leader={p.leader} color={p.color} colorDark={p.colorDark} size={56} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="party-fullname">{p.name}</div>
                <div className="party-meta">
                  <span className="party-role">{p.leaderTitle}&nbsp;:</span> <strong>{p.leader}</strong>
                </div>
                {p.website && <div className="party-website">{t.officialSite}</div>}
              </div>
            </a>
          ))}
        </div>

        <div className="tier-label" style={{ marginTop: 28 }}><TrendingUp size={13} strokeWidth={2.5} /> {t.tierEmerging}</div>
        <div className="party-grid-full">
          {parties.filter(p => !p.main && ["cq","pmlq"].includes(p.id)).map(p => (
            <a
              key={p.id}
              href={p.website || "#"}
              target={p.website ? "_blank" : undefined}
              rel={p.website ? "noopener noreferrer" : undefined}
              className={`party-card-full party-card-full-small ${p.website ? "" : "party-card-nolink"}`}
              onClick={e => { if (!p.website) e.preventDefault(); }}
            >
              <Avatar leader={p.leader} color={p.color} colorDark={p.colorDark} size={48} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="party-fullname">{p.name}</div>
                <div className="party-meta">
                  <span className="party-role">{p.leaderTitle}&nbsp;:</span> <strong>{p.leader}</strong>
                </div>
                {p.website && <div className="party-website">{t.officialSite}</div>}
              </div>
            </a>
          ))}
        </div>

        <div className="tier-label" style={{ marginTop: 28 }}><Users size={13} strokeWidth={2.5} /> {t.tierNiche}</div>
        <div className="party-grid-full">
          {parties.filter(p => !p.main && !["cq","pmlq"].includes(p.id)).map(p => (
            <a
              key={p.id}
              href={p.website || "#"}
              target={p.website ? "_blank" : undefined}
              rel={p.website ? "noopener noreferrer" : undefined}
              className={`party-card-full party-card-full-small ${p.website ? "" : "party-card-nolink"}`}
              onClick={e => { if (!p.website) e.preventDefault(); }}
            >
              <Avatar leader={p.leader} color={p.color} colorDark={p.colorDark} size={48} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="party-fullname">{p.name}</div>
                <div className="party-meta">
                  {p.leader.startsWith("Parti autorisé") ? (
                    <span className="party-role-small">{lang === "en" ? "Authorized by Élections Québec" : p.leaderTitle}</span>
                  ) : (
                    <>
                      <span className="party-role">{p.leaderTitle}&nbsp;:</span> <strong>{p.leader}</strong>
                    </>
                  )}
                </div>
                {p.website && <div className="party-website">{t.officialSite}</div>}
              </div>
            </a>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 14, textAlign: "center", fontStyle: "italic" }}>
          {t.partiesNote}
        </p>
      </section>

      <section style={{ marginBottom: 64 }}>
        <h2 className="section-title">{t.guaranteesTitle}</h2>
        <p className="section-subtitle">{t.guaranteesSubtitle}</p>
        <div className="guarantees-grid">
          {guarantees.map((g, i) => (
            <div key={i} className="guarantee-card">
              <div className="guarantee-icon">{g.icon}</div>
              <div>
                <div className="guarantee-title">{g.title}</div>
                <div className="guarantee-desc">{g.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 64 }}>
        <h2 className="section-title">Comment ça marche&nbsp;?</h2>
        <div className="steps-grid">
          {[
            { n: "01", t: "Choisissez un quiz", d: "20 questions rapides ou 100 questions complètes." },
            { n: "02", t: "Répondez honnêtement", d: "Sur une échelle de « tout à fait d'accord » à « pas du tout »." },
            { n: "03", t: "Marquez vos priorités", d: "Sélectionnez les enjeux qui comptent vraiment pour vous (×2)." },
            { n: "04", t: "Découvrez vos résultats", d: "Concordance par parti et par thème, en pourcentage." },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{s.n}</div>
              <div className="step-title">{s.t}</div>
              <div className="step-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="support-banner">
        <div className="support-banner-icon"><Heart size={28} /></div>
        <div className="support-banner-text">
          <h3>{lang === "en" ? "This project is 100% independent" : "Ce projet est 100% indépendant"}</h3>
          <p>{lang === "en" ? "No ads. No political funding. If VoteQC2026 is useful to you, support it so it can continue." : "Aucune publicité. Aucun financement politique. Si VoteQC2026 vous est utile, soutenez-le pour qu'il puisse continuer."}</p>
        </div>
        <button className="btn btn-support" onClick={onSupport}><Heart size={16} /> {t.support} <ArrowRight size={16} /></button>
      </section>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}>
        <button className="btn btn-outline" onClick={onMethodo}><BookOpen size={16} /> {t.methodology}</button>
        <button className="btn btn-outline" onClick={onProject}><Lightbulb size={16} /> {t.project}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// QUIZ QUESTION (with always-visible info button)
// ═══════════════════════════════════════════════════════════

function QuizQuestion({ q, num, total, answer, onAnswer, onSkip, onNext, onPrev, canNext, canPrev, onQuit, lang = "fr", t }) {
  // Safety: provide defaults if t is missing
  t = t || {
    question: "Question", of: "sur",
    agree: "D'accord", disagree: "Pas d'accord",
    skip: "Passer / Je ne sais pas",
    previous: "← Précédent", next: "Suivant →", seeResults: "Voir les résultats →",
    quizTip: "« Passer » retire la question du calcul, contrairement à « Partagé / Nuancé ».",
    context: "Contexte", quitQuiz: "Quitter",
  };
  const pct = (num / total) * 100;
  const [showInfo, setShowInfo] = useState(false);
  // Use English translations when lang === "en", fallback to French
  const enTrans = (typeof questionsEn !== "undefined" && questionsEn[q.id]) || null;
  const displayText = (lang === "en" && enTrans) ? enTrans.text : q.text;
  const displayCategory = (lang === "en" && enTrans) ? enTrans.category : q.category;
  const displayHelp = (lang === "en" && enTrans) ? enTrans.help : q.help;
  const hasSpecificHelp = !!displayHelp;

  useEffect(() => { setShowInfo(false); }, [q.id]);

  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={onQuit} className="btn-link" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <X size={16} /> {t.quitQuiz}
        </button>
      </div>

      <div className="quiz-progress-header">
        <div className="quiz-progress-info">
          <span className="quiz-counter">
            <strong>Q{num}</strong>
            <span className="quiz-counter-divider">/</span>
            <span className="quiz-counter-total">{total}</span>
          </span>
          <span className="quiz-category-pill">{displayCategory}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="question-card">
        <div className="question-header">
          <h2 className="question-text">{displayText}</h2>
          <button
            onClick={() => setShowInfo(s => !s)}
            className={`info-btn ${showInfo ? "info-btn-active" : ""}`}
            aria-label={lang === "en" ? "More info on this question" : "Plus d'information sur la question"}
            aria-expanded={showInfo}
            title={lang === "en" ? "More info on this question" : "Plus d'information sur cette question"}
          >
            <Info size={18} />
            {hasSpecificHelp && <span className="info-btn-dot" />}
          </button>
        </div>
        {showInfo && (
          <div className="info-panel fade-in">
            <div className="info-panel-header">
              <Info size={14} strokeWidth={2.5} />
              <span className="info-panel-title">{t.context}</span>
            </div>
            <p className="info-panel-text">
              {hasSpecificHelp
                ? displayHelp
                : (lang === "en"
                  ? "This question asks for your personal opinion. Consider your values and priorities. For details on party positions, consult their official electoral platforms."
                  : "Cette question vous demande votre opinion personnelle. Considérez vos valeurs et priorités. Pour plus de détails sur les positions des partis, consultez leurs plateformes électorales officielles.")}
            </p>
          </div>
        )}
      </div>

      <div className="scale-labels">
        <span style={{ color: "#16a34a" }}>{t.agree}</span>
        <div className="scale-bar">
          <div style={{ background: "#16a34a", flex: 1 }} />
          <div style={{ background: "#65a30d", flex: 1 }} />
          <div style={{ background: "#a3a3a3", flex: 1 }} />
          <div style={{ background: "#ea580c", flex: 1 }} />
          <div style={{ background: "#dc2626", flex: 1 }} />
        </div>
        <span style={{ color: "#dc2626" }}>{t.disagree}</span>
      </div>

      <div className="answer-options">
        {answerOptions.map(opt => {
          const selected = answer === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              className={`answer-btn ${selected ? "answer-btn-selected" : ""}`}
              style={{ "--answer-color": opt.color, "--answer-light": opt.lightColor }}
            >
              <span className="answer-indicator" />
              <span className="answer-label">{lang === "en" ? opt.labelEn : opt.label}</span>
              {selected && <span className="answer-check"><Check size={18} strokeWidth={3} /></span>}
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <button onClick={() => { if (onSkip) onSkip(); else onAnswer(null); }} className="btn-link" style={{ fontSize: 13 }}>
          {t.skip}
        </button>
      </div>

      <div className="quiz-nav">
        <button onClick={onPrev} disabled={!canPrev} className="btn btn-outline"><ArrowLeft size={16} /> {t.previous.replace("← ", "")}</button>
        <button onClick={onNext} disabled={!canNext} className="btn btn-primary">
          {num === total ? t.seeResults.replace(" →", "") : t.next.replace(" →", "")} <ArrowRight size={16} />
        </button>
      </div>

      <p className="quiz-tip">
        {t.quizTip}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// IMPORTANCE REVIEW
// ═══════════════════════════════════════════════════════════

function ImportanceReview({ questions, answers, onSetImportance, onConfirm, onSkip, lang = "fr", t }) {
  const answered = useMemo(() => {
    return answers.filter(a => a.value !== null).map(a => {
      const q = questions.find(qq => qq.id === a.questionId);
      return q ? { question: q, answer: a } : null;
    }).filter(Boolean);
  }, [answers, questions]);

  const grouped = useMemo(() => {
    const g = {};
    answered.forEach(item => {
      const enT = (typeof questionsEn !== "undefined" && questionsEn[item.question.id]) || null;
      const cat = (lang === "en" && enT) ? enT.category : item.question.category;
      if (!g[cat]) g[cat] = [];
      g[cat].push(item);
    });
    return g;
  }, [answered, lang]);

  const importantCount = answers.filter(a => a.isImportant && a.value !== null).length;
  const overLimit = importantCount > SOFT_LIMIT;

  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="review-star"><Star size={40} strokeWidth={2} fill="currentColor" /></div>
        <h1 className="page-title">{lang === "en" ? "Which issues matter most to you?" : "Quels enjeux comptent le plus pour vous ?"}</h1>
        <p className="page-subtitle">
          {lang === "en" ? (
            <>Select the questions that are <strong>particularly important</strong> in your electoral choice. They will count <strong>twice as much</strong>.</>
          ) : (
            <>Sélectionnez les questions qui sont <strong>particulièrement importantes</strong> dans votre choix électoral. Elles compteront <strong>deux fois plus</strong>.</>
          )}
        </p>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8, fontStyle: "italic" }}>
          {lang === "en" ? "This step is optional." : "Cette étape est facultative."}
        </p>
      </div>

      <div className={`info-banner ${overLimit ? "info-banner-warn" : "info-banner-info"}`}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0, color: overLimit ? "#b45309" : "#0369a1" }}>
            {overLimit ? <AlertCircle size={20} /> : <Lightbulb size={20} />}
          </span>
          <div style={{ fontSize: 14 }}>
            <div style={{ fontWeight: 600 }}>
              {lang === "en"
                ? `${importantCount} question${importantCount !== 1 ? "s" : ""} marked${overLimit ? " · recommended limit: 7" : ""}`
                : `${importantCount} question${importantCount !== 1 ? "s" : ""} marquée${importantCount !== 1 ? "s" : ""}${overLimit ? " · limite recommandée : 7" : ""}`}
            </div>
            <div style={{ marginTop: 4, opacity: 0.85 }}>
              {overLimit
                ? (lang === "en" ? "Too many priorities dilute their effect. Consider keeping only the most essential ones." : "Trop de priorités diluent leur effet. Pensez à n'en garder que les plus essentielles.")
                : (lang === "en" ? "Tip: select 3 to 7 questions that truly touch your priorities." : "Conseil : sélectionnez 3 à 7 questions qui touchent vraiment à vos priorités.")}
            </div>
          </div>
        </div>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <div className="cat-header">{cat}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map(({ question, answer }) => {
              const imp = answer.isImportant;
              const enQ = (typeof questionsEn !== "undefined" && questionsEn[question.id]) || null;
              const qText = (lang === "en" && enQ) ? enQ.text : question.text;
              return (
                <button key={question.id} onClick={() => onSetImportance(question.id, !imp)} className={`review-item ${imp ? "review-item-important" : ""}`}>
                  <span className="review-star-icon">
                    <Star size={20} fill={imp ? "currentColor" : "none"} strokeWidth={2} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="review-question">{qText}</div>
                    <div className="review-answer">
                      {lang === "en" ? "Your answer: " : "Votre réponse : "}
                      <strong style={{ color: answerOptions.find(o => o.value === answer.value)?.color }}>
                        {(lang === "en" ? answerLabelsEn : answerLabels)[answer.value]}
                      </strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="sticky-actions">
        <button onClick={onSkip} className="btn btn-ghost">{lang === "en" ? "Skip this step" : "Passer cette étape"}</button>
        <button onClick={onConfirm} className="btn btn-primary">
          {importantCount > 0
            ? (lang === "en" ? "See my weighted results" : "Voir mes résultats pondérés")
            : (lang === "en" ? "See my results" : "Voir mes résultats")}
          <ArrowRight size={16} />
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 24 }}>
        {lang === "en"
          ? "Standard method used by Stemwijzer, Wahl-O-Mat, Smartvote: binary ×2 weighting."
          : "Méthode standard utilisée par Stemwijzer, Wahl-O-Mat, Smartvote : pondération binaire ×2."}
      </p>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════════════

function QuizResults({ scores, categoryScores, isWeighted, onRestart, onMethodo, onSupport, activeParties, quizType, lang = "fr", t }) {
  t = t || {
    yourTopMatch: "Votre meilleur résultat", concordance: "concordance",
    fullRanking: "Classement complet", rankingSubtitle: "Tous les partis selon votre concordance",
    resultsByCategory: "Résultats par thème", categorySubtitle: "Top 3 des partis pour chaque catégorie",
    restart: "Recommencer", methodology: "Méthodologie", support: "Soutenir",
  };
  const partiesList = activeParties || parties;
  const sorted = useMemo(() => [...scores].sort((a, b) => b.score - a.score), [scores]);
  const top = sorted[0];
  const topParty = partiesList.find(p => p.id === top.partyId);

  const concordLabel = s => {
    if (lang === "en") {
      if (s >= 80) return { label: "Perfect match", icon: <Sparkles size={16} />, color: "#16a34a" };
      if (s >= 65) return { label: "Strong match", icon: <ThumbsUp size={16} />, color: "#65a30d" };
      if (s >= 50) return { label: "Moderate match", icon: <Handshake size={16} />, color: "#ca8a04" };
      if (s >= 35) return { label: "Moderate disagreement", icon: <Meh size={16} />, color: "#ea580c" };
      if (s >= 20) return { label: "Strong disagreement", icon: <ThumbsDown size={16} />, color: "#dc2626" };
      return { label: "Total opposition", icon: <XCircle size={16} />, color: "#991b1b" };
    }
    if (s >= 80) return { label: "Accord parfait", icon: <Sparkles size={16} />, color: "#16a34a" };
    if (s >= 65) return { label: "Accord fort", icon: <ThumbsUp size={16} />, color: "#65a30d" };
    if (s >= 50) return { label: "Accord modéré", icon: <Handshake size={16} />, color: "#ca8a04" };
    if (s >= 35) return { label: "Désaccord modéré", icon: <Meh size={16} />, color: "#ea580c" };
    if (s >= 20) return { label: "Désaccord fort", icon: <ThumbsDown size={16} />, color: "#dc2626" };
    return { label: "Opposition totale", icon: <XCircle size={16} />, color: "#991b1b" };
  };

  const conc = concordLabel(top.score);

  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    let raf, start;
    const dur = 1100;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayScore(Math.round(eased * top.score));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [top.score]);

  return (
    <div className="fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
      {quizType === "all" && (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span className="all-parties-badge"><FleurDeLys size={14} color="currentColor" /> {lang === "en" ? `Results compared to all ${partiesList.length} parties` : `Résultats comparés aux ${partiesList.length} partis`}</span>
        </div>
      )}
      {isWeighted && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span className="weighted-badge"><Star size={14} /> {lang === "en" ? "Results weighted by your priorities" : "Résultats pondérés selon vos priorités"}</span>
        </div>
      )}

      <div className="result-hero" style={{ "--party-color": topParty.color, "--party-color-dark": topParty.colorDark }}>
        <div className="result-hero-bg" />
        <div className="result-hero-content">
          <p className="result-hero-label">{lang === "en" ? "The party that best matches you" : "Le parti qui vous correspond le mieux"}</p>
          <Avatar leader={topParty.leader} color={topParty.color} colorDark={topParty.colorDark} size={92} ring />
          <h2 className="result-hero-name">{topParty.name}</h2>
          <p className="result-hero-leader">{topParty.leader}</p>
          <div className="result-hero-score">
            <span className="result-score-num">{displayScore}</span>
            <span className="result-score-pct">%</span>
          </div>
          <div className="result-concord" style={{ background: `${conc.color}15`, color: conc.color }}>
            <span style={{ display: "inline-flex", alignItems: "center" }}>{conc.icon}</span>
            <span>{conc.label}</span>
          </div>
          <p className="result-ideology">{topParty.ideology}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t.fullRanking}</h3>
          <span className="card-subtitle">{t.rankingSubtitle}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sorted.map((s, i) => {
            const party = partiesList.find(pp => pp.id === s.partyId);
            return (
              <div key={s.partyId} className="ranking-row">
                <div className="ranking-rank">{i + 1}</div>
                <Avatar leader={party.leader} color={party.color} colorDark={party.colorDark} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ranking-name-row">
                    <div className="ranking-name">
                      <span style={{ fontWeight: 700 }}>{party.shortName}</span>
                      <span className="ranking-leader">{party.leader}</span>
                    </div>
                    <span className="ranking-score" style={{ color: party.color }}>{s.score}%</span>
                  </div>
                  <div className="ranking-bar">
                    <div className="ranking-bar-fill" style={{ width: `${s.score}%`, background: `linear-gradient(90deg, ${party.color}, ${party.colorDark})`, animationDelay: `${i * 80}ms` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t.resultsByCategory}</h3>
          <span className="card-subtitle">{t.categorySubtitle}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(categoryScores).map(([cat, catScores]) => {
            const sortedCat = [...catScores].sort((a, b) => b.score - a.score);
            // Translate category name to English if applicable
            const catFrToEn = {
              "Environnement": "Environment",
              "Économie": "Economy",
              "Immigration": "Immigration",
              "Langue et identité": "Language & identity",
              "Santé": "Health",
              "Éducation": "Education",
              "Société": "Society",
              "Souveraineté": "Sovereignty",
            };
            const displayCat = (lang === "en" && catFrToEn[cat]) ? catFrToEn[cat] : cat;
            return (
              <div key={cat} className="cat-block">
                <div className="cat-block-title">{displayCat}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {sortedCat.slice(0, 3).map(s => {
                    const party = partiesList.find(pp => pp.id === s.partyId);
                    return (
                      <div key={s.partyId} className="cat-row">
                        <Avatar leader={party.leader} color={party.color} colorDark={party.colorDark} size={28} />
                        <span className="cat-party-name">{party.shortName}</span>
                        <div className="cat-bar">
                          <div className="cat-bar-fill" style={{ width: `${s.score}%`, background: party.color }} />
                        </div>
                        <span className="cat-score">{s.score}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{lang === "en" ? "How to interpret your results" : "Comment interpréter vos résultats"}</h3>
        </div>
        <div className="legend-grid">
          {(lang === "en" ? [
            ["#16a34a", "80–100%", "Perfect match"],
            ["#65a30d", "65–79%", "Strong match"],
            ["#ca8a04", "50–64%", "Moderate match"],
            ["#ea580c", "35–49%", "Moderate disagreement"],
            ["#dc2626", "20–34%", "Strong disagreement"],
            ["#991b1b", "0–19%", "Total opposition"],
          ] : [
            ["#16a34a", "80–100%", "Accord parfait"],
            ["#65a30d", "65–79%", "Accord fort"],
            ["#ca8a04", "50–64%", "Accord modéré"],
            ["#ea580c", "35–49%", "Désaccord modéré"],
            ["#dc2626", "20–34%", "Désaccord fort"],
            ["#991b1b", "0–19%", "Opposition totale"],
          ]).map(([c, range, label]) => (
            <div key={label} className="legend-item">
              <div className="legend-swatch" style={{ background: c }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{range}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="support-banner">
        <div className="support-banner-icon"><Heart size={28} /></div>
        <div className="support-banner-text">
          <h3>{lang === "en" ? "Was this result useful?" : "Ce résultat vous a été utile ?"}</h3>
          <p>{lang === "en" ? "VoteQC2026 is funded only by donations. Help us keep it independent and accessible." : "VoteQC2026 est financé uniquement par les dons. Aidez-nous à le maintenir indépendant et accessible."}</p>
        </div>
        <button className="btn btn-support" onClick={onSupport}><Heart size={16} /> {t.support} <ArrowRight size={16} /></button>
      </section>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
        <button onClick={onRestart} className="btn btn-primary"><RotateCcw size={16} /> {lang === "en" ? "Retake the quiz" : "Refaire le quiz"}</button>
        <button onClick={onMethodo} className="btn btn-outline"><BookOpen size={16} /> {t.methodology}</button>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginTop: 32, padding: "0 16px" }}>
        {lang === "en"
          ? "These results are indicative and based on your answers. They are not a voting recommendation. The final vote is yours."
          : "Ces résultats sont indicatifs et basés sur vos réponses. Ils ne constituent pas une recommandation de vote. Le vote final vous appartient."}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// METHODOLOGY
// ═══════════════════════════════════════════════════════════

function MethodologyPage({ onBack, lang = "fr" }) {
  const sections = lang === "en" ? [
    { t: "Principle", c: "VoteQC2026 compares your answers to the known positions of Quebec political parties on 100 issues across 7 categories: Environment, Economy, Immigration, Language & identity, Health, Education, Society & Sovereignty." },
    { t: "Response scale", c: "Each question is answered on a 5-level scale: from \"Strongly agree\" (+2) to \"Strongly disagree\" (–2). The \"Skip\" option removes the question from the calculation." },
    { t: "Concordance calculation", c: "For each question, we calculate the distance between your answer and the party's position. Concordance is: 1 – distance × 0.5, giving a score between –1 (total opposition) and +1 (perfect match)." },
    { t: "Importance weighting", c: "If you mark questions as \"important\", they count twice as much (×2) in the average. This is the standard method used by major European voting compasses (Stemwijzer, Wahl-O-Mat, Smartvote)." },
    { t: "Normalization", c: "The final score is normalized between 0% and 100% with the formula: score = (average + 1) / 2 × 100." },
    { t: "Random order", c: "Questions are shuffled at the start of the quiz to avoid any order bias. Tied parties are also displayed in random order." },
    { t: "Sources", c: "Party positions are based on their electoral platforms, public statements, and votes at Quebec's National Assembly." },
  ] : [
    { t: "Principe", c: "VoteQC2026 compare vos réponses aux positions connues des partis politiques québécois sur 100 enjeux répartis en 7 catégories : Environnement, Économie, Immigration, Langue et identité, Santé, Éducation, Société et Souveraineté." },
    { t: "Échelle de réponse", c: "Chaque question se répond sur une échelle à 5 niveaux : de « Tout à fait d'accord » (+2) à « Pas du tout d'accord » (–2). L'option « Passer » retire la question du calcul." },
    { t: "Calcul de concordance", c: "Pour chaque question, on calcule la distance entre votre réponse et la position du parti. La concordance est : 1 – distance × 0.5, ce qui donne un score entre –1 (opposition totale) et +1 (accord parfait)." },
    { t: "Pondération par importance", c: "Si vous marquez des questions comme « importantes », elles comptent deux fois plus (×2) dans la moyenne. C'est la méthode standard utilisée par les grandes boussoles électorales européennes (Stemwijzer, Wahl-O-Mat, Smartvote)." },
    { t: "Normalisation", c: "Le score final est normalisé entre 0% et 100% avec la formule : score = (moyenne + 1) / 2 × 100." },
    { t: "Ordre aléatoire", c: "Les questions sont mélangées au début du quiz pour éviter tout biais d'ordre. Les partis à égalité sont également affichés dans un ordre aléatoire." },
    { t: "Sources", c: "Les positions des partis sont basées sur leurs plateformes électorales, déclarations publiques et votes à l'Assemblée nationale du Québec." },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <button onClick={onBack} className="btn-link" style={{ marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={16} /> {lang === "en" ? "Back" : "Retour"}
      </button>
      <h1 className="page-title" style={{ textAlign: "left", marginBottom: 12 }}>{lang === "en" ? "Methodology" : "Méthodologie"}</h1>
      <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 16 }}>
        {lang === "en" ? "How VoteQC2026 works — step by step." : "Comment fonctionne VoteQC2026 — étape par étape."}
      </p>
      <div className="card" style={{ padding: 0 }}>
        {sections.map((s, i) => (
          <div key={i} className="methodo-section">
            <div className="methodo-num">{String(i + 1).padStart(2, "0")}</div>
            <div>
              <h3 className="methodo-title">{s.t}</h3>
              <p className="methodo-content">{s.c}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROJECT
// ═══════════════════════════════════════════════════════════

function ProjectPage({ onBack, onSupport, lang = "fr" }) {
  const isEn = lang === "en";
  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <button onClick={onBack} className="btn-link" style={{ marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={16} /> {isEn ? "Back" : "Retour"}
      </button>
      <h1 className="page-title" style={{ textAlign: "left", marginBottom: 12 }}>{isEn ? "The project" : "Le projet"}</h1>
      <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 16 }}>
        {isEn ? "Why VoteQC2026 exists and who's behind it." : "Pourquoi VoteQC2026 existe et qui est derrière."}
      </p>

      <div className="card">
        <h2 className="card-title">{isEn ? "Why this site?" : "Pourquoi ce site ?"}</h2>
        <p className="prose">
          {isEn
            ? "Quebec politics is rich, complex, and sometimes hard to access. With many parties holding often-nuanced positions, it's not always easy to know which one best matches your personal convictions."
            : "La politique québécoise est riche, complexe, et parfois difficile d'accès. Avec six partis aux positions souvent nuancées, il n'est pas toujours évident de savoir lequel correspond le mieux à ses convictions personnelles."}
        </p>
        <p className="prose">
          {isEn ? (
            <>VoteQC2026 offers a simple tool: <strong>answer questions</strong>, <strong>compare your answers</strong> to the documented positions of the parties, and <strong>visualize the match</strong>. No ads. No data collection. No hidden agenda.</>
          ) : (
            <>VoteQC2026 propose un outil simple : <strong>répondre à des questions</strong>, <strong>comparer ses réponses</strong> aux positions documentées des partis, et <strong>visualiser la concordance</strong>. Sans publicité. Sans collecte de données. Sans agenda caché.</>
          )}
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">{isEn ? "Our values" : "Nos valeurs"}</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon"><Scale size={22} /></div>
            <div>
              <h4>{isEn ? "Total neutrality" : "Neutralité totale"}</h4>
              <p>{isEn ? "No party is favoured. The code and questions are rigorously balanced." : "Aucun parti n'est favorisé. Le code et les questions sont rigoureusement équilibrés."}</p>
            </div>
          </div>
          <div className="value-item">
            <div className="value-icon"><Lock size={22} /></div>
            <div>
              <h4>{isEn ? "Absolute privacy" : "Vie privée absolue"}</h4>
              <p>{isEn ? "No answer, no result, no IP address is stored. Everything stays on your device." : "Aucune réponse, aucun résultat, aucune adresse IP n'est stocké. Tout reste sur votre appareil."}</p>
            </div>
          </div>
          <div className="value-item">
            <div className="value-icon"><Eye size={22} /></div>
            <div>
              <h4>{isEn ? "Transparency" : "Transparence"}</h4>
              <p>{isEn ? "Public methodology, cited sources, consultable code. Everything is verifiable." : "Méthodologie publique, sources citées, code consultable. Tout est vérifiable."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">{isEn ? "Who are we?" : "Qui sommes-nous ?"}</h2>
        <p className="prose">
          {isEn ? (
            <>A small team of Quebec citizens passionate about democracy and digital tools. We remain deliberately <strong>anonymous</strong> for two reasons: to protect our privacy, and to ensure no personal affiliation can be interpreted as political bias.</>
          ) : (
            <>Une petite équipe de citoyens et citoyennes québécois passionnés par la démocratie et le numérique. Nous restons volontairement <strong>anonymes</strong> pour deux raisons : préserver notre vie privée, et garantir qu'aucune affiliation personnelle ne puisse être interprétée comme un biais politique.</>
          )}
        </p>
        <p className="prose">
          {isEn
            ? "We are not affiliated with any party, interest group, or political or commercial organization."
            : "Nous ne sommes affiliés à aucun parti, aucun groupe d'intérêt, aucune organisation politique ou commerciale."}
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">{isEn ? "Funding" : "Le financement"}</h2>
        <p className="prose">
          {isEn ? (
            <>VoteQC2026 is funded <strong>exclusively by user donations</strong>. These donations pay for hosting, the domain name, site security, and compensate development and maintenance time.</>
          ) : (
            <>VoteQC2026 est financé <strong>exclusivement par les dons des utilisateurs et utilisatrices</strong>. Ces dons servent à payer l'hébergement, le nom de domaine, la sécurité du site, et à compenser le temps de développement et de maintenance.</>
          )}
        </p>
        <p className="prose">
          {isEn
            ? "No political party, company, or foundation funds this project. This is our guarantee of independence."
            : "Aucun parti politique, aucune entreprise, aucune fondation ne finance ce projet. C'est notre garantie d'indépendance."}
        </p>
        <button onClick={onSupport} className="btn btn-primary" style={{ marginTop: 12 }}>
          <Heart size={16} /> {isEn ? "Support the project" : "Soutenir le projet"} <ArrowRight size={16} />
        </button>
      </div>

      <div className="card">
        <h2 className="card-title">{isEn ? "A living site" : "Un site qui évolue"}</h2>
        <p className="prose">
          {isEn ? (
            <>VoteQC2026 is designed as a <strong>living</strong> tool. Throughout the campaign and beyond, party positions evolve — and we update questions and answers accordingly. If you spot an error or a poorly-documented position, write to us.</>
          ) : (
            <>VoteQC2026 est conçu comme un outil <strong>vivant</strong>. Tout au long de la campagne et au-delà, les positions des partis évoluent — et nous mettons à jour les questions et les réponses en conséquence. Si vous repérez une erreur ou une position mal documentée, écrivez-nous.</>
          )}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TRANSPARENCY
// ═══════════════════════════════════════════════════════════

function TransparencyPage({ onBack, lang = "fr" }) {
  const isEn = lang === "en";
  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <button onClick={onBack} className="btn-link" style={{ marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={16} /> {isEn ? "Back" : "Retour"}
      </button>
      <h1 className="page-title" style={{ textAlign: "left", marginBottom: 12 }}>{isEn ? "Transparency" : "Transparence"}</h1>
      <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 16 }}>
        {isEn ? "Total transparency commitment to our users." : "Engagement de transparence totale envers les utilisateurs."}
      </p>

      <div className="card">
        <h2 className="card-title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <CircleSlash size={20} /> {isEn ? "No data collected" : "Aucune donnée collectée"}
        </h2>
        <p className="prose">
          {isEn ? (
            <>VoteQC2026 collects <strong>no personal data</strong>. Your quiz answers stay in your browser's memory during the session, then disappear as soon as you close the tab.</>
          ) : (
            <>VoteQC2026 ne collecte <strong>aucune donnée personnelle</strong>. Vos réponses au quiz restent dans la mémoire de votre navigateur le temps de la session, puis disparaissent dès que vous fermez l'onglet.</>
          )}
        </p>
        <ul className="check-list">
          <li>{isEn ? "No user account" : "Aucun compte utilisateur"}</li>
          <li>{isEn ? "No tracking cookies" : "Aucun cookie de pistage"}</li>
          <li>{isEn ? "No IP address recorded" : "Aucune adresse IP enregistrée"}</li>
          <li>{isEn ? "No third-party analytics (Google Analytics, Meta, etc.)" : "Aucun outil d'analytique tiers (Google Analytics, Meta, etc.)"}</li>
          <li>{isEn ? "No data sharing with third parties" : "Aucun partage de données avec des tiers"}</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <BookOpen size={20} /> {isEn ? "Position sources" : "Sources des positions"}
        </h2>
        <p className="prose">{isEn ? "Positions attributed to each party are based on:" : "Les positions attribuées à chaque parti sont basées sur :"}</p>
        <ul className="check-list">
          <li>{isEn ? "Official electoral platforms (2018, 2022, 2026 elections)" : "Plateformes électorales officielles (élections 2018, 2022, 2026)"}</li>
          <li>{isEn ? "Votes at Quebec's National Assembly" : "Votes à l'Assemblée nationale du Québec"}</li>
          <li>{isEn ? "Public statements by leaders and spokespeople" : "Déclarations publiques des chefs et porte-parole"}</li>
          <li>{isEn ? "Answers to media questionnaires" : "Réponses aux questionnaires médiatiques"}</li>
        </ul>
        <p className="prose" style={{ marginTop: 16 }}>
          {isEn
            ? "If a party has no clear position on an issue, we assign a neutral position (0) or the position most consistent with its general ideology, clearly indicating so."
            : "Si un parti n'a pas de position claire sur un enjeu, nous attribuons une position neutre (0) ou la position la plus cohérente avec son idéologie générale, en l'indiquant clairement."}
        </p>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Scale size={20} /> {isEn ? "Editorial neutrality" : "Neutralité éditoriale"}
        </h2>
        <p className="prose">
          {isEn ? (
            <>Questions and their phrasing are designed to be <strong>neutral</strong>. We avoid loaded or biased wording. A question shouldn't be identifiable as "coming from the left" or "coming from the right".</>
          ) : (
            <>Les questions et leur formulation sont conçues pour être <strong>neutres</strong>. Nous évitons les formulations chargées ou biaisées. Une question ne devrait pas pouvoir être identifiée comme « venant de la gauche » ou « venant de la droite ».</>
          )}
        </p>
        <p className="prose">
          {isEn ? (
            <>The display order of parties (particularly in case of ties in the results) is <strong>random</strong>, never alphabetical or favourable to one party.</>
          ) : (
            <>L'ordre d'affichage des partis (notamment en cas d'égalité dans les résultats) est <strong>aléatoire</strong>, jamais alphabétique ou favorable à l'un ou l'autre.</>
          )}
        </p>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Heart size={20} /> {isEn ? "Financial independence" : "Indépendance financière"}
        </h2>
        <p className="prose">
          {isEn
            ? "VoteQC2026 is funded solely by user donations. We periodically publish a public statement of revenues and expenses to demonstrate our independence."
            : "VoteQC2026 est financé uniquement par les dons des utilisateurs. Nous publions périodiquement un bilan public des recettes et dépenses pour démontrer notre indépendance."}
        </p>
        <p className="prose"><strong>{isEn ? "We refuse" : "Nous refusons"}</strong> {isEn ? "any funding from:" : "tout financement provenant de :"}</p>
        <ul className="cross-list">
          <li>{isEn ? "Political parties or candidates" : "Partis politiques ou candidats"}</li>
          <li>{isEn ? "Lobbying organizations" : "Organisations de lobbying"}</li>
          <li>{isEn ? "Partisan media" : "Médias partisans"}</li>
          <li>{isEn ? "Companies seeking placement" : "Entreprises souhaitant un placement"}</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Settings2 size={20} /> {isEn ? "Code and methodology" : "Code et méthodologie"}
        </h2>
        <p className="prose">
          {isEn ? (
            <>The concordance calculation method is <strong>public and documented</strong> on the Methodology page. No hidden calculation, no opaque proprietary algorithm.</>
          ) : (
            <>La méthode de calcul de concordance est <strong>publique et documentée</strong> sur la page Méthodologie. Aucun calcul caché, aucun algorithme propriétaire opaque.</>
          )}
        </p>
        <p className="prose">
          {isEn
            ? "If you spot an error or want to verify a calculation, don't hesitate to contact us."
            : "Si vous repérez une erreur ou souhaitez vérifier un calcul, n'hésitez pas à nous contacter."}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUPPORT
// ═══════════════════════════════════════════════════════════

function SupportPage({ onBack, lang = "fr" }) {
  const isEn = lang === "en";
  const usages = isEn ? [
    { icon: <Globe size={22} />, t: "Hosting", d: "Robust servers capable of absorbing traffic spikes during election periods." },
    { icon: <Globe size={22} />, t: "Domain name", d: "Annual renewal and security certificates (HTTPS)." },
    { icon: <ShieldCheck size={22} />, t: "Security & anti-DDoS", d: "Protection against attacks to ensure site availability." },
    { icon: <Settings2 size={22} />, t: "Maintenance", d: "Regular updates to questions and party positions." },
    { icon: <BookOpen size={22} />, t: "Research", d: "Continuous political monitoring, analysis of platforms and statements." },
    { icon: <Lightbulb size={22} />, t: "Development", d: "Time spent improving the tool, adding features, fixing bugs." },
  ] : [
    { icon: <Globe size={22} />, t: "Hébergement", d: "Serveurs robustes capables d'absorber des pics de trafic en période électorale." },
    { icon: <Globe size={22} />, t: "Nom de domaine", d: "Renouvellement annuel et certificats de sécurité (HTTPS)." },
    { icon: <ShieldCheck size={22} />, t: "Sécurité & anti-DDoS", d: "Protection contre les attaques pour garantir la disponibilité du site." },
    { icon: <Settings2 size={22} />, t: "Maintenance", d: "Mises à jour régulières des questions et positions des partis." },
    { icon: <BookOpen size={22} />, t: "Recherche", d: "Veille politique continue, analyse des plateformes et déclarations." },
    { icon: <Lightbulb size={22} />, t: "Développement", d: "Temps consacré à améliorer l'outil, ajouter des fonctionnalités, corriger les bogues." },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <button onClick={onBack} className="btn-link" style={{ marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <ArrowLeft size={16} /> {isEn ? "Back" : "Retour"}
      </button>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ marginBottom: 16, color: "var(--primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "var(--primary-light)" }}>
          <Heart size={36} />
        </div>
        <h1 className="page-title" style={{ marginBottom: 12 }}>{isEn ? "Support VoteQC2026" : "Soutenir VoteQC2026"}</h1>
        <p className="page-subtitle">
          {isEn ? (
            <>This project is <strong>100% independent</strong> and exists only thanks to donations from citizens who believe in free, neutral, and accessible political information.</>
          ) : (
            <>Ce projet est <strong>100% indépendant</strong> et n'existe que grâce aux dons des citoyens et citoyennes qui croient en une information politique libre, neutre et accessible.</>
          )}
        </p>
      </div>

      <div className="card support-why">
        <h2 className="card-title">{isEn ? "Why support us?" : "Pourquoi soutenir ?"}</h2>
        <p className="prose">
          {isEn ? (
            <>Maintaining a site like VoteQC2026 requires <strong>time</strong> (research, development, updates) and <strong>money</strong> (servers, security, infrastructure). An independent project doesn't have the luxury of ads or political sponsors to pay its bills.</>
          ) : (
            <>Maintenir un site comme VoteQC2026 demande du <strong>temps</strong> (recherche, développement, mises à jour) et de l'<strong>argent</strong> (serveurs, sécurité, infrastructure). Un projet indépendant n'a pas le luxe de la publicité ou des sponsors politiques pour payer ses factures.</>
          )}
        </p>
        <p className="prose">
          {isEn ? (
            <><strong>Every donation, however small, makes a concrete difference</strong>: it ensures the site stays freely accessible to all, with no ads, no tracking, and no compromise on neutrality.</>
          ) : (
            <><strong>Chaque don, même petit, fait une différence concrète</strong> : il garantit que le site reste accessible gratuitement à toutes et à tous, sans pub, sans pistage, et sans compromis sur la neutralité.</>
          )}
        </p>
      </div>

      <div className="card">
        <h2 className="card-title">{isEn ? "What do your donations fund?" : "À quoi servent vos dons ?"}</h2>
        <p className="card-subtitle" style={{ display: "block", marginBottom: 20 }}>
          {isEn ? "Here's concretely what your support finances:" : "Voici concrètement ce que finance votre soutien :"}
        </p>
        <div className="usages-grid">
          {usages.map((u, i) => (
            <div key={i} className="usage-card">
              <div className="usage-icon">{u.icon}</div>
              <h4 className="usage-title">{u.t}</h4>
              <p className="usage-desc">{u.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card kofi-card">
        <h2 className="card-title" style={{ textAlign: "center" }}>{isEn ? "How to support?" : "Comment soutenir ?"}</h2>
        <p className="card-subtitle" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
          {isEn ? "We use Ko-fi — a secure donation platform for creators. One-time or recurring donations, no account required." : "Nous utilisons Ko-fi — une plateforme de dons sécurisée pour créateurs. Dons ponctuels ou récurrents, sans compte requis."}
        </p>
        <a
          href="https://ko-fi.com/voteqc2026"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-kofi"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, textDecoration: "none" }}
        >
          <Heart size={18} fill="currentColor" />
          <span>{isEn ? "Donate on Ko-fi" : "Faire un don sur Ko-fi"}</span>
          <ArrowRight size={18} />
        </a>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16, textAlign: "center" }}>
          ko-fi.com/voteqc2026
        </p>
      </div>

      <div className="card support-thanks">
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", marginBottom: 12 }}>
          <Heart size={26} />
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 8px" }}>{isEn ? "Thank you" : "Merci"}</h3>
        <p style={{ color: "#6b7280", margin: 0, fontSize: 15, lineHeight: 1.6 }}>
          {isEn
            ? "Whether you donate or not, thank you for using VoteQC2026. Simply informing yourself about Quebec politics is already a precious civic act."
            : "Que vous fassiez un don ou non, merci d'avoir utilisé VoteQC2026. Le simple fait de vous informer sur la politique québécoise est déjà un acte citoyen précieux."}
        </p>
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════
// TRANSLATIONS — UI labels (questions stay in French)
// ═══════════════════════════════════════════════════════════

const translations = {
  fr: {
    // Header / Nav
    quickQuiz: "Quiz rapide", fullQuiz: "Quiz complet", allParties: "Tous les partis",
    methodology: "Méthodologie", project: "Le projet", transparency: "Transparence", support: "Soutenir",
    // Quiz cards
    quickQuizDesc: "20 questions essentielles. Un aperçu avec les 6 principaux partis.",
    fullQuizDesc: "100 questions sur tous les enjeux. 6 principaux partis québécois.",
    allPartiesDesc: "100 questions comparées aux 21 partis autorisés — représentation démocratique élargie.",
    parties6: "6 partis", parties18: "21 partis", min2: "≈ 2 min", min10: "≈ 10 min", min12: "≈ 12 min",
    new: "NOUVEAU",
    // Hero
    heroBadge: "Élections générales québécoises · 2026",
    heroTitleA: "Pour qui voter au", heroTitleB: "Québec en", heroTitleYear: "2026",
    heroSubtitle: "Répondez à nos questions et découvrez quel parti politique québécois correspond le mieux à vos convictions.",
    heroMeta: "Outil citoyen indépendant · Gratuit · Sans pub · Sans enregistrement",
    // Sections
    partiesTitle: "Les partis en présence",
    partiesSubtitle: "21 formations politiques provinciales autorisées par le DGEQ",
    tierMain: "Partis principaux · représentés ou > 1 % aux dernières élections",
    tierEmerging: "Partis émergents et alternatifs · avec candidats aux dernières élections",
    tierNiche: "Partis de niche et protestataires · autorisés par le DGEQ",
    partiesNote: "Tous inclus dans le quiz « Tous les partis ». Pour les photos et logos officiels, visitez les sites des partis.",
    officialSite: "Site officiel →",
    guaranteesTitle: "Nos garanties",
    guaranteesSubtitle: "Conçu autour de votre vie privée et de la transparence",
    // Quiz UI
    question: "Question", of: "sur", agree: "D'accord", disagree: "Pas d'accord",
    skip: "Passer / Je ne sais pas", previous: "← Précédent", next: "Suivant →",
    seeResults: "Voir les résultats →", quitQuiz: "Quitter",
    quizTip: "« Passer » retire la question du calcul, contrairement à « Partagé / Nuancé ».",
    context: "Contexte",
    // Results
    yourTopMatch: "Votre meilleur résultat", concordance: "concordance",
    fullRanking: "Classement complet", rankingSubtitle: "Tous les partis selon votre concordance",
    resultsByCategory: "Résultats par thème", categorySubtitle: "Top 3 des partis pour chaque catégorie",
    restart: "Recommencer",
    // Language
    language: "Langue", languageEN: "English", languageFR: "Français",
  },
  en: {
    // Header / Nav
    quickQuiz: "Quick Quiz", fullQuiz: "Full Quiz", allParties: "All Parties",
    methodology: "Methodology", project: "Project", transparency: "Transparency", support: "Support",
    // Quiz cards
    quickQuizDesc: "20 essential questions. An overview with the 6 main parties.",
    fullQuizDesc: "100 questions on all issues. 6 main Quebec parties.",
    allPartiesDesc: "100 questions compared to all 18 authorized parties — broader democratic representation.",
    parties6: "6 parties", parties18: "21 parties", min2: "≈ 2 min", min10: "≈ 10 min", min12: "≈ 12 min",
    new: "NEW",
    // Hero
    heroBadge: "Quebec General Election · 2026",
    heroTitleA: "Who to vote for in", heroTitleB: "Quebec in", heroTitleYear: "2026",
    heroSubtitle: "Answer our questions and discover which Quebec political party best matches your convictions.",
    heroMeta: "Independent civic tool · Free · No ads · No registration",
    // Sections
    partiesTitle: "The parties at a glance",
    partiesSubtitle: "18 provincial political parties authorized by Élections Québec",
    tierMain: "Main parties · represented or > 1 % in last election",
    tierEmerging: "Emerging and alternative parties · with candidates in last election",
    tierNiche: "Niche and protest parties · authorized by Élections Québec",
    partiesNote: "All included in the « All parties » quiz. For official photos and logos, visit the parties' websites.",
    officialSite: "Official site →",
    guaranteesTitle: "Our guarantees",
    guaranteesSubtitle: "Designed around your privacy and transparency",
    // Quiz UI — note: questions remain in French (Quebec election context)
    question: "Question", of: "of", agree: "Agree", disagree: "Disagree",
    skip: "Skip / I don't know", previous: "← Previous", next: "Next →",
    seeResults: "See results →", quitQuiz: "Quit",
    quizTip: "\"Skip\" removes the question from calculation, unlike \"Mixed / Nuanced\".",
    context: "Context",
    // Results
    yourTopMatch: "Your top match", concordance: "match",
    fullRanking: "Full ranking", rankingSubtitle: "All parties by your match score",
    resultsByCategory: "Results by theme", categorySubtitle: "Top 3 parties for each category",
    restart: "Restart",
    // Language
    language: "Language", languageEN: "English", languageFR: "Français",
  },
};

// Always default to French (Quebec election context).
// User can switch to English via the nav toggle.
function detectLang() {
  return "fr";
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [lang, setLang] = useState(detectLang());
  const t = translations[lang];
  const [page, setPage] = useState("home");
  const [quizType, setQuizType] = useState("quick");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef(null);

  const questions = shuffledQuestions;
  const currentQ = questions[qIndex];
  const total = questions.length;

  const scrollTop = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "instant", block: "start" });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => { scrollTop(); }, [page, qIndex, isReviewing, isComplete, scrollTop]);

  const startQuiz = useCallback((type) => {
    const base = type === "quick" ? q20 : q100;
    const shuffled = [...base];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledQuestions(shuffled);
    setQuizType(type);
    setPage("quiz");
    setQIndex(0); setAnswers([]); setIsComplete(false); setIsReviewing(false); setMenuOpen(false);
  }, []);

  const setAnswer = useCallback((value) => {
    const qId = currentQ.id;
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.questionId === qId);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], value }; return n; }
      return [...prev, { questionId: qId, value, isImportant: false }];
    });
  }, [currentQ]);

  // Skip handler: mark question as skipped (value === null, isSkipped flag)
  // and auto-advance to the next question.
  const skipQuestion = useCallback(() => {
    const qId = currentQ.id;
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.questionId === qId);
      const skipped = { questionId: qId, value: null, isImportant: false, isSkipped: true };
      if (idx >= 0) { const n = [...prev]; n[idx] = skipped; return n; }
      return [...prev, skipped];
    });
    // Auto-advance after skipping
    setTimeout(() => {
      if (qIndex < total - 1) setQIndex(i => i + 1);
      else setIsReviewing(true);
    }, 60);
  }, [currentQ, qIndex, total]);

  const setImportance = useCallback((qId, imp) => {
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.questionId === qId);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], isImportant: imp }; return n; }
      return prev;
    });
  }, []);

  const getCurrentAnswer = () => {
    const a = answers.find(a => a.questionId === currentQ?.id);
    return a?.value ?? null;
  };

  // A question is "addressed" if answered OR explicitly skipped
  const isCurrentAddressed = () => {
    const a = answers.find(a => a.questionId === currentQ?.id);
    return !!a && (a.value !== null || a.isSkipped === true);
  };

  const goNext = () => { if (qIndex < total - 1) setQIndex(i => i + 1); else setIsReviewing(true); };
  const goPrev = () => { if (qIndex > 0) setQIndex(i => i - 1); };
  const canGoNext = isCurrentAddressed();

  const activeParties = useMemo(() => getQuizParties(quizType), [quizType]);

  const calcScores = useMemo(() => {
    const valid = answers.filter(a => a.value !== null);
    if (valid.length === 0) return activeParties.map(p => ({ partyId: p.id, score: 50, concordance: 0 }));
    return activeParties.map(party => {
      let wSum = 0, tW = 0;
      valid.forEach(ans => {
        const q = questions.find(qq => qq.id === ans.questionId);
        if (!q) return;
        const pp = q.positions.find(pos => pos.p === party.id);
        if (!pp) return;
        const dist = Math.abs(ans.value - pp.v);
        const conc = 1 - dist * 0.5;
        const w = ans.isImportant ? IMPORTANT_WEIGHT : 1;
        wSum += conc * w; tW += w;
      });
      if (tW === 0) return { partyId: party.id, score: 50, concordance: 0 };
      const avg = wSum / tW;
      return { partyId: party.id, score: Math.round(((avg + 1) / 2) * 100), concordance: avg };
    });
  }, [answers, questions, activeParties]);

  const calcCatScores = useMemo(() => {
    const valid = answers.filter(a => a.value !== null);
    const cats = [...new Set(questions.map(q => q.category))];
    const result = {};
    cats.forEach(cat => {
      const catQs = questions.filter(q => q.category === cat);
      const catAns = valid.filter(a => catQs.some(q => q.id === a.questionId));
      if (catAns.length === 0) { result[cat] = activeParties.map(p => ({ partyId: p.id, score: 50, concordance: 0 })); return; }
      result[cat] = activeParties.map(party => {
        let wSum = 0, tW = 0;
        catAns.forEach(ans => {
          const q = catQs.find(qq => qq.id === ans.questionId);
          if (!q) return;
          const pp = q.positions.find(pos => pos.p === party.id);
          if (!pp) return;
          const dist = Math.abs(ans.value - pp.v);
          const conc = 1 - dist * 0.5;
          const w = ans.isImportant ? IMPORTANT_WEIGHT : 1;
          wSum += conc * w; tW += w;
        });
        if (tW === 0) return { partyId: party.id, score: 50, concordance: 0 };
        const avg = wSum / tW;
        return { partyId: party.id, score: Math.round(((avg + 1) / 2) * 100), concordance: avg };
      });
    });
    return result;
  }, [answers, questions, activeParties]);

  const hasImportant = answers.some(a => a.isImportant && a.value !== null);

  const goHome = () => { setPage("home"); setMenuOpen(false); };
  const restart = () => { setPage("home"); setAnswers([]); setIsComplete(false); setIsReviewing(false); setQIndex(0); };
  const goPage = (p) => { setPage(p); setMenuOpen(false); };

  return (
    <>
      <style>{styles}</style>
      <div ref={scrollRef} className="app-root">
        <header className="app-header">
          <div className="app-header-inner">
            <div className="app-logo" onClick={goHome}>
              <span className="logo-mark"><FleurDeLys size={20} color="#003da5" /></span>
              <span className="logo-text">
                <span className="logo-primary">Vote</span>QC<span className="logo-primary">2026</span>
              </span>
            </div>

            <nav className="app-nav">
              <button className="nav-btn" onClick={() => startQuiz("quick")}>{t.quickQuiz}</button>
              <button className="nav-btn" onClick={() => startQuiz("full")}>{t.fullQuiz}</button>
              <button className="nav-btn nav-btn-special" onClick={() => startQuiz("all")}>{t.allParties}</button>
              <button className="nav-btn" onClick={() => goPage("methodology")}>{t.methodology}</button>
              <button className="nav-btn" onClick={() => goPage("project")}>{t.project}</button>
              <button className="nav-btn" onClick={() => goPage("transparency")}>{t.transparency}</button>
              <button className="nav-btn nav-btn-support" onClick={() => goPage("support")}>
                <Heart size={14} /> {t.support}
              </button>
              <div
                className="lang-switch"
                role="group"
                aria-label={t.language}
              >
                <button
                  type="button"
                  className={`lang-switch-btn ${lang === "fr" ? "lang-switch-btn-active" : ""}`}
                  onClick={() => setLang("fr")}
                  aria-pressed={lang === "fr"}
                >
                  FR
                </button>
                <button
                  type="button"
                  className={`lang-switch-btn ${lang === "en" ? "lang-switch-btn-active" : ""}`}
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                >
                  EN
                </button>
              </div>
            </nav>

            <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Menu" aria-expanded={menuOpen}>
              <Menu size={22} />
            </button>
          </div>

          {menuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-section">
                <div className="mobile-menu-label">Quiz</div>
                <button className="mobile-nav-btn" onClick={() => startQuiz("quick")}><Zap size={16} /> {t.quickQuiz} <span className="mobile-nav-pill">{t.min2} · {t.parties6}</span></button>
                <button className="mobile-nav-btn" onClick={() => startQuiz("full")}><Target size={16} /> {t.fullQuiz} <span className="mobile-nav-pill">{t.min10} · {t.parties6}</span></button>
                <button className="mobile-nav-btn mobile-nav-special" onClick={() => startQuiz("all")}><FleurDeLys size={16} color="currentColor" /> {t.allParties} <span className="mobile-nav-pill">{t.min12} · {t.parties18}</span></button>
              </div>
              <div className="mobile-menu-divider" />
              <div className="mobile-menu-section">
                <div className="mobile-menu-label">{lang === "fr" ? "À propos" : "About"}</div>
                <button className="mobile-nav-btn" onClick={() => goPage("methodology")}><BookOpen size={16} /> {t.methodology}</button>
                <button className="mobile-nav-btn" onClick={() => goPage("project")}><Lightbulb size={16} /> {t.project}</button>
                <button className="mobile-nav-btn" onClick={() => goPage("transparency")}><Eye size={16} /> {t.transparency}</button>
              </div>
              <div className="mobile-menu-divider" />
              <div className="mobile-menu-section">
                <div className="mobile-menu-label">{t.language}</div>
                <button
                  className={`mobile-nav-btn ${lang === "fr" ? "mobile-nav-lang-active" : ""}`}
                  onClick={() => { setLang("fr"); setMenuOpen(false); }}
                  aria-pressed={lang === "fr"}
                >
                  Français {lang === "fr" && <Check size={16} style={{ marginLeft: "auto" }} />}
                </button>
                <button
                  className={`mobile-nav-btn ${lang === "en" ? "mobile-nav-lang-active" : ""}`}
                  onClick={() => { setLang("en"); setMenuOpen(false); }}
                  aria-pressed={lang === "en"}
                >
                  English {lang === "en" && <Check size={16} style={{ marginLeft: "auto" }} />}
                </button>
              </div>
              <div className="mobile-menu-divider" />
              <button className="mobile-nav-btn mobile-nav-support" onClick={() => goPage("support")}><Heart size={16} /> {t.support}</button>
            </div>
          )}
        </header>

        <main className="app-main">
          {page === "home" && (
            <HomePage
              onStart={startQuiz}
              onMethodo={() => goPage("methodology")}
              onProject={() => goPage("project")}
              onSupport={() => goPage("support")}
              lang={lang}
              t={t}
            />
          )}
          {page === "methodology" && <MethodologyPage onBack={goHome} lang={lang} />}
          {page === "project" && <ProjectPage onBack={goHome} onSupport={() => goPage("support")} lang={lang} />}
          {page === "transparency" && <TransparencyPage onBack={goHome} lang={lang} />}
          {page === "support" && <SupportPage onBack={goHome} lang={lang} />}
          {page === "quiz" && isComplete && (
            <QuizResults
              scores={calcScores} categoryScores={calcCatScores}
              isWeighted={hasImportant} onRestart={restart}
              onMethodo={() => goPage("methodology")}
              onSupport={() => goPage("support")}
              activeParties={activeParties}
              quizType={quizType}
              lang={lang} t={t}
            />
          )}
          {page === "quiz" && isReviewing && !isComplete && (
            <ImportanceReview
              questions={questions} answers={answers}
              onSetImportance={setImportance}
              onConfirm={() => { setIsReviewing(false); setIsComplete(true); }}
              onSkip={() => { setAnswers(prev => prev.map(a => ({ ...a, isImportant: false }))); setIsReviewing(false); setIsComplete(true); }}
              lang={lang} t={t}
            />
          )}
          {page === "quiz" && !isComplete && !isReviewing && currentQ && (
            <QuizQuestion
              q={currentQ} num={qIndex + 1} total={total}
              answer={getCurrentAnswer()}
              onAnswer={setAnswer} onSkip={skipQuestion}
              onNext={goNext} onPrev={goPrev}
              canNext={canGoNext} canPrev={qIndex > 0} onQuit={goHome}
              lang={lang} t={t}
            />
          )}
        </main>

        <footer className="app-footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div className="footer-brand-col">
                <div className="footer-brand">
                  <FleurDeLys size={20} color="#003da5" />
                  <span style={{ fontWeight: 800, fontSize: 17 }}>
                    <span style={{ color: "#003da5" }}>Vote</span>QC<span style={{ color: "#003da5" }}>2026</span>
                  </span>
                </div>
                <p className="footer-tagline">
                  {lang === "en" ? "Independent civic tool for Quebec elections." : "Outil citoyen indépendant pour les élections québécoises."}
                </p>
                <p className="footer-made">
                  <FleurDeLys size={12} color="#003da5" /> {lang === "en" ? "Made in Quebec" : "Fait au Québec"}
                </p>
              </div>
              <div>
                <div className="footer-col-title">{lang === "en" ? "The quiz" : "Le quiz"}</div>
                <button className="footer-link" onClick={() => startQuiz("quick")}>{t.quickQuiz} (20)</button>
                <button className="footer-link" onClick={() => startQuiz("full")}>{t.fullQuiz} (100)</button>
                <button className="footer-link" onClick={() => startQuiz("all")}>{t.allParties} (100 · 21)</button>
                <button className="footer-link" onClick={() => goPage("methodology")}>{t.methodology}</button>
              </div>
              <div>
                <div className="footer-col-title">{lang === "en" ? "The project" : "Le projet"}</div>
                <button className="footer-link" onClick={() => goPage("project")}>{lang === "en" ? "About" : "À propos"}</button>
                <button className="footer-link" onClick={() => goPage("transparency")}>{t.transparency}</button>
              </div>
              <div>
                <div className="footer-col-title">{lang === "en" ? "Support" : "Soutien"}</div>
                <button className="footer-link footer-link-highlight" onClick={() => goPage("support")} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Heart size={13} /> {t.support}
                </button>
                <span className="footer-link" style={{ cursor: "default" }}>contact@voteqc2026.com</span>
              </div>
            </div>
            <div className="footer-bottom">
              <p style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Lock size={13} /> {lang === "en" ? "100% independent · No ads · No data stored · No tracking" : "100% indépendant · Zéro pub · Zéro donnée enregistrée · Zéro pistage"}
              </p>
              <p style={{ marginTop: 6 }}>© 2026 VoteQC2026 · {lang === "en" ? "Civic decision-support tool" : "Outil citoyen d'aide à la décision électorale"}</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,800&display=swap');

:root {
  --bg: #fafaf7;
  --bg-elevated: #ffffff;
  --border: #e8e8ec;
  --border-strong: #d4d4d8;
  --text: #18181b;
  --text-muted: #6b7280;
  --text-faint: #9ca3af;
  --primary: #003da5;
  --primary-dark: #002970;
  --primary-light: #e6edf7;
  /* Quebec heritage accent: or (gold) — evokes the fleur-de-lys and patriotic heritage */
  --accent: #c9a227;
  --accent-dark: #8a6d14;
  --accent-light: #fdf6d8;
  --radius: 14px;
  --radius-sm: 10px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-display: 'Fraunces', Georgia, serif;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

* { box-sizing: border-box; }
button { font-family: var(--font-sans); }

.app-root {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex; flex-direction: column;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(250,250,247,0.85);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border);
}
.app-header-inner {
  max-width: 1200px; margin: 0 auto;
  padding: 0 20px; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
}
.app-logo {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; user-select: none;
  transition: var(--transition);
}
.app-logo:hover { opacity: 0.75; }
.logo-mark { display: flex; align-items: center; }
.logo-text { font-weight: 800; font-size: 19px; letter-spacing: -0.5px; }
.logo-primary { color: var(--primary); }

.app-nav { display: flex; align-items: center; gap: 2px; }
.nav-btn {
  background: transparent; border: none;
  font-size: 14px; font-weight: 500; color: var(--text-muted);
  padding: 8px 12px; border-radius: 8px;
  cursor: pointer; transition: var(--transition);
}
.nav-btn:hover { background: var(--primary-light); color: var(--primary); }
.nav-btn-support {
  margin-left: 6px; background: var(--primary-light); color: var(--primary);
  font-weight: 600; padding: 8px 14px;
  border: 1px solid #c7d6ec;
  display: inline-flex; align-items: center; gap: 6px;
}
.nav-btn-support:hover {
  background: #d6e1f1; color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,61,165,0.12);
}

.menu-toggle {
  display: none;
  background: transparent; border: none;
  width: 40px; height: 40px; padding: 10px;
  flex-direction: column; justify-content: space-between;
  cursor: pointer; border-radius: 8px;
}
.menu-toggle:hover { background: var(--primary-light); }
.menu-toggle span {
  display: block; height: 2px; background: var(--text);
  border-radius: 2px; transition: var(--transition);
}
.mobile-menu {
  display: none;
  flex-direction: column; padding: 12px 16px 16px;
  border-top: 1px solid var(--border);
  background: white; gap: 4px;
}
.mobile-menu-section { display: flex; flex-direction: column; gap: 2px; }
.mobile-menu-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; color: var(--text-faint);
  padding: 8px 14px 4px;
}
.mobile-menu-divider {
  height: 1px; background: var(--border); margin: 8px 0;
}
.mobile-nav-btn {
  text-align: left; background: transparent; border: none;
  padding: 12px 14px; border-radius: 8px;
  font-size: 15px; font-weight: 500; color: var(--text);
  cursor: pointer; transition: var(--transition);
  display: flex; align-items: center; justify-content: space-between;
  width: 100%;
}
.mobile-nav-btn:hover { background: var(--primary-light); color: var(--primary); }
.mobile-nav-pill {
  font-size: 11px; font-weight: 600;
  background: var(--bg); color: var(--text-muted);
  padding: 3px 8px; border-radius: 99px;
}
.mobile-nav-support {
  background: var(--primary-light); color: var(--primary);
  font-weight: 600; margin-top: 4px;
}
.mobile-nav-support:hover { background: #d6e1f1; color: var(--primary-dark); }

@media (max-width: 920px) {
  .app-nav { display: none; }
  .menu-toggle { display: flex; }
  .mobile-menu { display: flex; }
}

.app-main {
  flex: 1; max-width: 1200px;
  margin: 0 auto; padding: 24px 20px 64px;
  width: 100%;
}

.app-footer {
  border-top: 1px solid var(--border);
  background: white; margin-top: 48px;
}
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 40px 20px 24px; }
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 32px;
  padding-bottom: 32px; border-bottom: 1px solid var(--border);
}
@media (max-width: 720px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
  .footer-brand-col { grid-column: 1 / -1; }
}
.footer-brand-col { max-width: 320px; }
.footer-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.footer-tagline { font-size: 13px; color: var(--text-muted); margin: 0 0 12px; line-height: 1.5; }
.footer-made {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--text-faint);
  font-weight: 600;
}
.footer-col-title {
  font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
  color: var(--text); margin-bottom: 12px;
}
.footer-link {
  display: block;
  background: transparent; border: none;
  color: var(--text-muted); cursor: pointer;
  font-size: 13px; padding: 4px 0; text-align: left;
  transition: var(--transition);
  font-family: inherit;
}
.footer-link:hover { color: var(--primary); }
.footer-link-highlight { color: var(--accent); font-weight: 600; }
.footer-link-highlight:hover { color: var(--accent); }
.footer-bottom {
  text-align: center; font-size: 12px;
  color: var(--text-faint); padding-top: 24px;
}
.footer-bottom p { margin: 0; }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-sans); font-weight: 600; font-size: 15px;
  padding: 12px 24px; border-radius: 10px; border: none;
  cursor: pointer; transition: var(--transition);
  white-space: nowrap; line-height: 1;
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 1px 2px rgba(0,61,165,0.2), 0 4px 12px rgba(0,61,165,0.18); }
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,61,165,0.25), 0 6px 18px rgba(0,61,165,0.28); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-outline { background: white; color: var(--text); border: 1px solid var(--border-strong); }
.btn-outline:hover:not(:disabled) { background: var(--bg); border-color: var(--text-muted); }
.btn-ghost { background: transparent; color: var(--text-muted); }
.btn-ghost:hover:not(:disabled) { background: var(--bg); color: var(--text); }
.btn-support { background: var(--primary); color: white; box-shadow: 0 2px 8px rgba(0,61,165,0.18); }
.btn-support:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,61,165,0.28); }

/* Ko-fi CTA button — larger, more prominent */
.btn-kofi {
  background: var(--primary);
  color: white;
  font-family: var(--font-sans);
  font-weight: 700; font-size: 17px;
  padding: 14px 28px;
  border-radius: var(--radius);
  border: none; cursor: pointer;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(0,61,165,0.25);
  width: 100%; max-width: 360px;
  margin: 0 auto; display: flex !important;
}
.btn-kofi:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0,61,165,0.35);
}
.btn-kofi:active { transform: translateY(0); }
.btn-kofi:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.kofi-card { text-align: center; }
.btn-link {
  background: transparent; border: none; color: var(--text-muted);
  font-size: 14px; font-weight: 500; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 0; transition: var(--transition);
}
.btn-link:hover { color: var(--primary); }

.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}
.card-header { margin-bottom: 20px; }
.card-title {
  font-family: var(--font-display);
  font-size: 22px; font-weight: 700;
  margin: 0 0 6px; letter-spacing: -0.3px;
}
.card-subtitle { font-size: 13px; color: var(--text-muted); }
.prose { font-size: 15px; line-height: 1.65; color: var(--text); margin: 0 0 14px; }
.prose:last-child { margin-bottom: 0; }
.prose strong { font-weight: 700; }

.badge-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--primary-light); color: var(--primary);
  font-size: 13px; font-weight: 600;
  padding: 8px 16px; border-radius: 99px;
  margin-bottom: 24px;
  border: 1px solid #c9d8eb;
}
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(36px, 6vw, 60px);
  font-weight: 700; line-height: 1.05;
  margin: 0 0 20px; letter-spacing: -1.5px;
}
.text-gradient {
  background: linear-gradient(135deg, var(--primary) 0%, #1a56db 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-size: clamp(16px, 2.2vw, 19px);
  color: var(--text-muted); line-height: 1.55;
  max-width: 600px; margin: 0 auto 20px;
}
.hero-meta { font-size: 13px; color: var(--text-faint); margin-bottom: 40px; }

.quiz-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px; max-width: 720px; margin: 0 auto;
}
.quiz-cards-three {
  max-width: 1060px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.quiz-card {
  background: white; border: 1px solid var(--border);
  border-radius: var(--radius); padding: 28px 24px;
  text-align: left; cursor: pointer;
  transition: var(--transition); font-family: var(--font-sans);
  display: flex; flex-direction: column; gap: 8px;
  box-shadow: var(--shadow-sm);
  position: relative; overflow: hidden;
}
.quiz-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary); }
.quiz-card-primary { border-color: var(--primary); }
.quiz-card-special {
  border-color: #0c4a6e;
  background: #ffffff;
}
.quiz-card-special:hover { border-color: #0c4a6e; }
.quiz-card-special .arrow { color: #0c4a6e; }
.quiz-card-badge {
  position: absolute; top: 14px; right: 14px;
  font-size: 10px; font-weight: 800;
  letter-spacing: 1px; padding: 3px 9px;
  background: #0c4a6e;
  color: white; border-radius: 99px;
  box-shadow: 0 2px 6px rgba(13,148,136,0.2);
}
.quiz-card-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--primary-light); color: var(--primary);
  margin-bottom: 4px;
}
.quiz-card-special .quiz-card-icon {
  background: #e0f2fe; color: #0c4a6e;
}
.quiz-card h3 { font-family: var(--font-display); font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.3px; }
.quiz-card p { font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.5; flex: 1; }
.quiz-card-meta {
  display: flex; align-items: center; gap: 6px;
  margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);
  flex-wrap: wrap;
}
.time-pill {
  font-size: 12px; font-weight: 600; color: var(--text-muted);
  background: var(--bg); padding: 4px 10px; border-radius: 99px;
}
.parties-pill {
  font-size: 12px; font-weight: 600; color: var(--primary);
  background: var(--primary-light); padding: 4px 10px; border-radius: 99px;
}
.parties-pill-special {
  color: #0c4a6e; background: #e0f2fe;
}
.arrow {
  display: inline-flex; align-items: center; color: var(--primary);
  transition: var(--transition); margin-left: auto;
}
.quiz-card:hover .arrow { transform: translateX(4px); }

.tier-label {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.2px;
  color: var(--text-muted);
  margin-bottom: 12px; padding: 0 4px;
  display: inline-flex; align-items: center; gap: 6px;
}
.party-card-small {
  background: #fafafa;
  border-style: dashed;
}
.party-card-small .party-shortname { font-size: 14px; }
.party-card-small .party-leader { font-size: 11px; }

.nav-btn-special {
  color: #0c4a6e !important;
  background: #f0f9ff;
  border: 1px solid transparent;
  font-weight: 600;
}
.nav-btn-special:hover {
  background: #e0f2fe !important;
  color: #0c4a6e !important;
}
.mobile-nav-special {
  color: #0c4a6e !important;
  background: #f0f9ff;
  font-weight: 600;
}
.mobile-nav-special:hover { background: #e0f2fe !important; }

/* Language switch — segmented control with clear active state */
.lang-switch {
  display: inline-flex; align-items: stretch;
  background: #f3f4f6;
  border: 1px solid var(--border);
  border-radius: 99px;
  padding: 3px;
  margin-left: 8px;
  position: relative;
}
.lang-switch-btn {
  font-family: var(--font-sans);
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: 99px;
  padding: 5px 12px;
  cursor: pointer;
  transition: var(--transition);
  min-width: 36px;
}
.lang-switch-btn:hover:not(.lang-switch-btn-active) {
  color: var(--primary);
  background: rgba(0,61,165,0.06);
}
.lang-switch-btn:active:not(.lang-switch-btn-active) {
  background: rgba(0,61,165,0.12);
}
.lang-switch-btn-active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  font-weight: 800;
}
.lang-switch-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.mobile-nav-lang-active {
  background: var(--primary-light) !important;
  color: var(--primary) !important;
  font-weight: 700 !important;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 700; text-align: center;
  margin: 0 0 8px; letter-spacing: -0.5px;
}
.section-subtitle {
  text-align: center; font-size: 15px;
  color: var(--text-muted); margin: 0 0 32px;
}

.party-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.party-grid-full {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}
.party-card-full {
  background: white; border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 16px;
  display: flex; align-items: flex-start; gap: 14px;
  transition: var(--transition); box-shadow: var(--shadow-sm);
  text-decoration: none; color: inherit;
}
.party-card-full:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}
.party-card-full-small {
  background: #fafafa;
  border-style: dashed;
}
.party-card-nolink {
  cursor: default;
}
.party-card-nolink:hover {
  transform: none;
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}
.party-fullname {
  font-weight: 700; font-size: 15px; line-height: 1.3;
  margin-bottom: 4px; color: var(--text);
}
.party-meta {
  font-size: 12px; color: var(--text-muted);
  line-height: 1.4;
}
.party-role {
  color: var(--text-faint);
  font-weight: 500;
}
.party-role-small {
  font-size: 11px; color: var(--text-faint);
  font-style: italic;
}
.party-website {
  font-size: 11px; color: var(--primary);
  font-weight: 600; margin-top: 6px;
  letter-spacing: 0.3px;
}
.party-card {
  background: white; border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 14px;
  display: flex; align-items: center; gap: 12px;
  transition: var(--transition); box-shadow: var(--shadow-sm);
}
.party-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}
.party-shortname { font-weight: 700; font-size: 16px; line-height: 1.2; }
.party-leader {
  font-size: 12px; color: var(--text-muted); margin-top: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.guarantees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.guarantee-card { display: flex; gap: 14px; align-items: flex-start; padding: 4px; }
.guarantee-icon {
  font-size: 28px; flex-shrink: 0;
  background: var(--primary-light);
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
}
.guarantee-title { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
.guarantee-desc { font-size: 14px; color: var(--text-muted); line-height: 1.5; }

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.step-card {
  text-align: center; padding: 24px 16px;
  background: white; border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
.step-number {
  font-family: var(--font-display);
  font-size: 36px; font-weight: 800;
  color: var(--primary); opacity: 0.3;
  letter-spacing: -1px; margin-bottom: 8px;
}
.step-title { font-weight: 600; font-size: 16px; margin-bottom: 6px; }
.step-desc { font-size: 14px; color: var(--text-muted); line-height: 1.5; }

.support-banner {
  display: flex; align-items: center; gap: 20px;
  background: var(--primary-light);
  border: 1px solid #c7d6ec;
  border-radius: var(--radius);
  padding: 24px 28px; margin-bottom: 24px;
  flex-wrap: wrap;
}
.support-banner-icon {
  flex-shrink: 0;
  background: white; width: 64px; height: 64px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,61,165,0.15);
  color: var(--primary);
}
.support-banner-text { flex: 1; min-width: 240px; }
.support-banner-text h3 {
  font-family: var(--font-display);
  font-size: 19px; font-weight: 700;
  margin: 0 0 4px; color: var(--primary-dark);
  letter-spacing: -0.3px;
}
.support-banner-text p { font-size: 14px; color: #1f2937; margin: 0; line-height: 1.5; }

.quiz-progress-header { margin-bottom: 24px; }
.quiz-progress-info {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}
.quiz-counter { font-size: 14px; color: var(--text-muted); display: flex; align-items: baseline; gap: 4px; }
.quiz-counter strong { color: var(--text); font-size: 16px; font-weight: 700; }
.quiz-counter-divider { color: var(--text-faint); }
.quiz-counter-total { color: var(--text-muted); }
.quiz-category-pill {
  background: var(--primary-light); color: var(--primary);
  font-size: 12px; font-weight: 600;
  padding: 4px 12px; border-radius: 99px;
  letter-spacing: 0.2px;
}
.progress-bar {
  width: 100%; height: 6px;
  background: var(--border);
  border-radius: 99px; overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #1a56db);
  border-radius: 99px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-card {
  background: white; border: 1px solid var(--border);
  border-radius: var(--radius); padding: 22px 24px;
  margin-bottom: 16px; box-shadow: var(--shadow-sm);
}
.question-header {
  display: flex; align-items: flex-start; gap: 14px;
  margin-bottom: 4px;
}
.question-text {
  flex: 1; font-family: var(--font-display);
  font-size: clamp(18px, 2.8vw, 22px);
  font-weight: 600; line-height: 1.35;
  margin: 0; letter-spacing: -0.2px;
}

.info-btn {
  flex-shrink: 0;
  position: relative;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--bg);
  border: 1.5px solid var(--border-strong);
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: var(--transition);
  margin-top: 4px;
}
.info-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
  transform: scale(1.05);
}
.info-btn-active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}
.info-btn-active:hover {
  background: var(--primary-dark);
  color: white;
}
.info-btn-i {
  font-family: var(--font-display);
  font-style: italic; font-weight: 700;
  font-size: 18px; line-height: 1;
}
.info-btn-dot {
  position: absolute; top: 4px; right: 4px;
  width: 8px; height: 8px; border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 0 2px white;
}
.info-btn-active .info-btn-dot {
  box-shadow: 0 0 0 2px var(--primary);
}

.info-panel {
  margin-top: 18px;
  background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
  border: 1px solid #fcd34d;
  border-left: 4px solid #f59e0b;
  border-radius: var(--radius-sm);
  padding: 14px 18px;
}
.info-panel-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 6px;
}
.info-panel-icon { font-size: 14px; }
.info-panel-title {
  font-size: 11px; font-weight: 700;
  color: #92400e; text-transform: uppercase;
  letter-spacing: 1px;
}
.info-panel-text {
  font-size: 14px; color: #713f12;
  line-height: 1.6; margin: 0;
}

.scale-labels {
  display: flex; align-items: center; gap: 12px;
  font-size: 11px; font-weight: 600;
  margin-bottom: 10px; padding: 0 4px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.scale-bar {
  flex: 1; height: 4px; border-radius: 99px;
  display: flex; overflow: hidden; opacity: 0.6;
}

.answer-options {
  display: flex; flex-direction: column;
  gap: 6px; margin-bottom: 14px;
}
.answer-btn {
  display: flex; align-items: center; gap: 14px;
  width: 100%; text-align: left;
  /* 2px transparent border keeps height stable whether or not selected */
  background: white; border: 2px solid var(--border);
  border-radius: var(--radius-sm); padding: 12px 16px;
  font-family: var(--font-sans); font-size: 15px; font-weight: 600;
  color: var(--text); cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  position: relative;
}
.answer-btn:hover {
  border-color: var(--answer-color);
  background: var(--answer-light);
  /* No transform to prevent layout shift */
}
.answer-btn:focus-visible { outline: 2px solid var(--answer-color); outline-offset: 2px; }
.answer-btn-selected {
  border-color: var(--answer-color);
  background: var(--answer-light);
  /* font-weight stays at 600 in all states — no reflow */
  /* Use outline (painted outside) instead of box-shadow to prevent any shift */
  box-shadow: 0 2px 8px color-mix(in srgb, var(--answer-color) 18%, transparent);
}
.answer-indicator {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid var(--answer-color); flex-shrink: 0;
  background: white; transition: background-color 0.18s ease, box-shadow 0.18s ease;
}
.answer-btn-selected .answer-indicator {
  background: var(--answer-color);
  box-shadow: inset 0 0 0 3px white;
}
.answer-label { flex: 1; }
.answer-check {
  color: var(--answer-color); flex-shrink: 0;
  display: inline-flex; align-items: center;
}

.quiz-nav { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.quiz-nav .btn { flex: 1; min-width: 120px; }
.quiz-tip {
  text-align: center; font-size: 12px;
  color: var(--text-faint); margin-top: 16px; line-height: 1.5;
}

.review-star { font-size: 56px; margin-bottom: 12px; filter: drop-shadow(0 4px 12px rgba(251, 191, 36, 0.4)); }
.page-title {
  font-family: var(--font-display);
  font-size: clamp(26px, 4vw, 36px);
  font-weight: 700; margin: 0 0 12px;
  letter-spacing: -0.5px; line-height: 1.2;
  text-align: center;
}
.page-subtitle {
  font-size: 16px; color: var(--text-muted);
  max-width: 540px; margin: 0 auto;
  line-height: 1.55; text-align: center;
}

.info-banner {
  display: flex; padding: 16px 18px;
  border-radius: var(--radius-sm);
  margin-bottom: 24px; border: 1px solid;
}
.info-banner-info { background: var(--primary-light); border-color: #c9d8eb; color: #002970; }
.info-banner-warn { background: #fff7ed; border-color: #fed7aa; color: #7c2d12; }

.cat-header {
  font-size: 11px; font-weight: 700;
  color: var(--primary); text-transform: uppercase;
  letter-spacing: 1.2px; margin-bottom: 10px; padding: 0 4px;
}
.review-item {
  display: flex; gap: 14px; align-items: flex-start;
  width: 100%; text-align: left;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--border);
  background: white; cursor: pointer;
  font-family: var(--font-sans); transition: var(--transition);
}
.review-item:hover { border-color: #fcd34d; background: #fffbeb; }
.review-item-important {
  border-color: #fbbf24; background: #fefce8;
  box-shadow: 0 0 0 1px #fbbf24, 0 4px 12px rgba(251, 191, 36, 0.15);
}
.review-star-icon {
  font-size: 24px; flex-shrink: 0;
  color: #d4d4d8; transition: var(--transition);
  width: 28px; text-align: center;
}
.review-item-important .review-star-icon { color: #f59e0b; }
.review-question { font-size: 14px; line-height: 1.45; color: var(--text); }
.review-answer { font-size: 12px; color: var(--text-muted); margin-top: 6px; }

.sticky-actions {
  position: sticky; bottom: 16px;
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  margin-top: 24px;
}

.weighted-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, #fefce8, #fef3c7);
  color: #92400e; border: 1px solid #fbbf24;
  border-radius: 99px; padding: 6px 16px;
  font-size: 13px; font-weight: 600;
}
.all-parties-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f0f9ff;
  color: #0c4a6e; border: 1px solid #7dd3fc;
  border-radius: 99px; padding: 6px 16px;
  font-size: 13px; font-weight: 600;
}

.result-hero {
  background: white; border-radius: var(--radius);
  padding: 40px 24px 32px; margin-bottom: 24px;
  text-align: center; position: relative; overflow: hidden;
  border: 1px solid var(--border); box-shadow: var(--shadow-md);
}
.result-hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at top, color-mix(in srgb, var(--party-color) 12%, transparent) 0%, transparent 60%);
  pointer-events: none;
}
.result-hero-content { position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.result-hero-label {
  font-size: 13px; color: var(--text-muted);
  margin: 0 0 16px; text-transform: uppercase;
  letter-spacing: 1.2px; font-weight: 600;
}
.result-hero-name {
  font-family: var(--font-display);
  font-size: clamp(26px, 4.5vw, 38px);
  font-weight: 700; margin: 16px 0 0;
  color: var(--party-color);
  letter-spacing: -0.5px; line-height: 1.15;
}
.result-hero-leader { color: var(--text-muted); margin: 4px 0 16px; font-size: 15px; }
.result-hero-score {
  display: flex; align-items: baseline; justify-content: center;
  margin: 8px 0 16px; gap: 4px;
  font-family: var(--font-display); font-weight: 800;
  color: var(--party-color); line-height: 1;
}
.result-score-num { font-size: clamp(64px, 10vw, 88px); letter-spacing: -3px; }
.result-score-pct { font-size: clamp(28px, 4vw, 36px); }
.result-concord {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 18px; border-radius: 99px;
  font-weight: 600; font-size: 15px;
}
.result-ideology {
  font-size: 13px; color: var(--text-muted);
  margin: 16px 0 0; max-width: 480px; font-style: italic;
}

.ranking-row { display: flex; align-items: center; gap: 12px; padding: 4px 0; }
.ranking-rank {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; color: var(--text-muted);
  flex-shrink: 0;
}
.ranking-name-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 6px;
}
.ranking-name { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
.ranking-leader { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ranking-score { font-weight: 700; font-size: 16px; font-variant-numeric: tabular-nums; }
.ranking-bar { height: 8px; background: var(--bg); border-radius: 99px; overflow: hidden; }
.ranking-bar-fill {
  height: 100%; border-radius: 99px;
  width: 0;
  animation: barFill 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes barFill { from { width: 0; } }

.cat-block { padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.cat-block:last-child { border-bottom: none; padding-bottom: 0; }
.cat-block-title {
  font-weight: 700; font-size: 14px;
  margin-bottom: 12px; color: var(--text);
  text-transform: uppercase; letter-spacing: 0.5px;
}
.cat-row { display: flex; align-items: center; gap: 10px; }
.cat-party-name { font-weight: 600; font-size: 13px; min-width: 40px; }
.cat-bar { flex: 1; height: 6px; background: var(--bg); border-radius: 99px; overflow: hidden; min-width: 60px; }
.cat-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease-out; }
.cat-score { font-size: 13px; font-weight: 600; color: var(--text-muted); width: 40px; text-align: right; font-variant-numeric: tabular-nums; }

.legend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}
.legend-item { display: flex; align-items: center; gap: 10px; }
.legend-swatch { width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0; }

.methodo-section {
  display: flex; gap: 20px; padding: 24px;
  border-bottom: 1px solid var(--border);
}
.methodo-section:last-child { border-bottom: none; }
.methodo-num {
  font-family: var(--font-display);
  font-size: 32px; font-weight: 700;
  color: var(--primary); opacity: 0.4;
  letter-spacing: -1px; line-height: 1;
  flex-shrink: 0; min-width: 48px;
}
.methodo-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.2px; }
.methodo-content { font-size: 14px; line-height: 1.7; color: var(--text-muted); margin: 0; }

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}
.value-item { display: flex; gap: 14px; align-items: flex-start; }
.value-icon {
  font-size: 24px; flex-shrink: 0;
  background: var(--primary-light);
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
}
.value-item h4 { font-size: 15px; font-weight: 700; margin: 0 0 4px; }
.value-item p { font-size: 13px; color: var(--text-muted); margin: 0; line-height: 1.5; }

.check-list, .cross-list {
  list-style: none; padding: 0; margin: 12px 0 0;
  display: flex; flex-direction: column; gap: 8px;
}
.check-list li, .cross-list li {
  font-size: 14px; line-height: 1.5;
  padding-left: 28px; position: relative;
  color: var(--text);
}
.check-list li::before {
  content: "✓"; position: absolute; left: 0;
  color: #16a34a; font-weight: 700; font-size: 16px;
}
.cross-list li::before {
  content: "✕"; position: absolute; left: 0;
  color: #dc2626; font-weight: 700; font-size: 16px;
}

.support-why {
  background: var(--primary-light);
  border-color: #c7d6ec;
}

.usages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.usage-card {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 18px;
}
.usage-icon { font-size: 24px; margin-bottom: 10px; }
.usage-title { font-size: 14px; font-weight: 700; margin: 0 0 6px; }
.usage-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0; }

.methods-list { display: flex; flex-direction: column; gap: 10px; }
.method-item {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px;
  background: white; border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  transition: var(--transition); cursor: pointer;
}
.method-item:hover {
  border-color: var(--primary);
  background: var(--primary-light);
  transform: translateX(2px);
}
.method-item-primary { border-color: var(--primary); background: var(--primary-light); }
.method-icon { font-size: 28px; flex-shrink: 0; width: 40px; text-align: center; }
.method-name {
  font-size: 15px; font-weight: 700; margin-bottom: 2px;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.method-badge {
  font-size: 10px; font-weight: 700;
  background: var(--primary); color: white;
  padding: 2px 8px; border-radius: 99px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.method-desc { font-size: 13px; color: var(--text-muted); }
.method-arrow { font-size: 20px; color: var(--text-faint); transition: var(--transition); }
.method-item:hover .method-arrow { color: var(--primary); transform: translateX(4px); }

.support-thanks {
  text-align: center; background: linear-gradient(135deg, var(--primary-light) 0%, #d6e3f0 100%);
  border-color: #c9d8eb;
}

.fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) {
  .app-main { padding: 16px 16px 48px; }
  .app-header-inner { padding: 0 16px; height: 56px; }
  .question-card { padding: 20px; }
  .question-header { gap: 10px; }
  .info-btn { width: 32px; height: 32px; }
  .info-btn-i { font-size: 16px; }
  .answer-btn { padding: 12px 14px; font-size: 14px; }
  .card { padding: 22px 18px; }
  .quiz-card { padding: 24px 20px; }
  .result-hero { padding: 32px 16px 24px; }
  .ranking-leader { display: none; }
  .support-banner { padding: 20px; flex-direction: column; text-align: center; }
}
`;
