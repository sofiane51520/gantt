import type {Task} from "./gantt.ts";

export const data: Task[] = [
    // === Projet 1 : Technique ===
    { id: "1", objectType: "project", name: "Technique", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Technique" },
    { id: "2", objectType: "task", name: "Analyse", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T18:00:00Z"), hidden: false, path: "Technique/Analyse" },
    { id: "3", objectType: "task", name: "Design", startDate: new Date("2025-10-23T12:00:00Z"), endDate: new Date("2025-10-24T12:00:00Z"), hidden: false, path: "Technique/Design" },
    { id: "4", objectType: "task", name: "UI", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-25T00:00:00Z"), hidden: false, path: "Technique/Design/UI" },
    { id: "5", objectType: "task", name: "Backend", startDate: new Date("2025-10-23T06:00:00Z"), endDate: new Date("2025-10-25T12:00:00Z"), hidden: false, path: "Technique/Backend" },
    { id: "6", objectType: "task", name: "Tests", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Technique/Tests" },

    // === Projet 2 : Management ===
    { id: "7", objectType: "project", name: "Management", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Management" },
    { id: "8", objectType: "task", name: "Préparation", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T12:00:00Z"), hidden: false, path: "Management/Préparation" },
    { id: "9", objectType: "task", name: "Execution", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-25T00:00:00Z"), hidden: false, path: "Management/Execution" },
    { id: "10", objectType: "task", name: "Suivi", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T18:00:00Z"), hidden: false, path: "Management/Suivi" },

    // === Projet 3 : Marketing ===
    { id: "11", objectType: "project", name: "Marketing", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Marketing" },
    { id: "12", objectType: "task", name: "Recherche marché", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T20:00:00Z"), hidden: false, path: "Marketing/Recherche marché" },
    { id: "13", objectType: "task", name: "Création contenu", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-25T00:00:00Z"), hidden: false, path: "Marketing/Création contenu" },
    { id: "14", objectType: "task", name: "Campagne réseaux", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Marketing/Campagne réseaux" },
    { id: "15", objectType: "task", name: "Analyse performance", startDate: new Date("2025-10-25T10:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Marketing/Analyse performance" },

    // === Projet 4 : Développement Produit ===
    { id: "16", objectType: "project", name: "Développement Produit", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Développement Produit" },
    { id: "17", objectType: "task", name: "Concept", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T18:00:00Z"), hidden: false, path: "Développement Produit/Concept" },
    { id: "18", objectType: "task", name: "Prototype", startDate: new Date("2025-10-23T18:00:00Z"), endDate: new Date("2025-10-24T18:00:00Z"), hidden: false, path: "Développement Produit/Prototype" },
    { id: "19", objectType: "task", name: "Tests utilisateurs", startDate: new Date("2025-10-24T18:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Développement Produit/Tests utilisateurs" },
    { id: "20", objectType: "task", name: "Améliorations", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T22:00:00Z"), hidden: false, path: "Développement Produit/Améliorations" },

    // === Projet 5 : Support ===
    { id: "21", objectType: "project", name: "Support", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Support" },
    { id: "22", objectType: "task", name: "Tickets clients", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T22:00:00Z"), hidden: false, path: "Support/Tickets clients" },
    { id: "23", objectType: "task", name: "Analyse incidents", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-24T20:00:00Z"), hidden: false, path: "Support/Analyse incidents" },
    { id: "24", objectType: "task", name: "Mise à jour FAQ", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Support/Mise à jour FAQ" },

    // === Projet 6 : RH ===
    { id: "25", objectType: "project", name: "Ressources Humaines", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Ressources Humaines" },
    { id: "26", objectType: "task", name: "Recrutement", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-24T00:00:00Z"), hidden: false, path: "Ressources Humaines/Recrutement" },
    { id: "27", objectType: "task", name: "Onboarding", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-25T00:00:00Z"), hidden: false, path: "Ressources Humaines/Onboarding" },
    { id: "28", objectType: "task", name: "Formation", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Ressources Humaines/Formation" },

    // === Projet 7 : Finances ===
    { id: "29", objectType: "project", name: "Finances", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Finances" },
    { id: "30", objectType: "task", name: "Budget", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T22:00:00Z"), hidden: false, path: "Finances/Budget" },
    { id: "31", objectType: "task", name: "Prévisions", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-24T20:00:00Z"), hidden: false, path: "Finances/Prévisions" },
    { id: "32", objectType: "task", name: "Reporting", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Finances/Reporting" },

    // === Projet 8 : Infrastructure ===
    { id: "33", objectType: "project", name: "Infrastructure", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Infrastructure" },
    { id: "34", objectType: "task", name: "Maintenance", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T20:00:00Z"), hidden: false, path: "Infrastructure/Maintenance" },
    { id: "35", objectType: "task", name: "Mises à jour serveurs", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-24T22:00:00Z"), hidden: false, path: "Infrastructure/Mises à jour serveurs" },
    { id: "36", objectType: "task", name: "Sécurité réseau", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Infrastructure/Sécurité réseau" },

    // === Projet 9 : Communication ===
    { id: "37", objectType: "project", name: "Communication", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Communication" },
    { id: "38", objectType: "task", name: "Newsletter", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T18:00:00Z"), hidden: false, path: "Communication/Newsletter" },
    { id: "39", objectType: "task", name: "Réseaux sociaux", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-24T22:00:00Z"), hidden: false, path: "Communication/Réseaux sociaux" },
    { id: "40", objectType: "task", name: "Presse", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Communication/Presse" },

    // === Projet 10 : Innovation ===
    { id: "41", objectType: "project", name: "Innovation", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Innovation" },
    { id: "42", objectType: "task", name: "Recherche idées", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T22:00:00Z"), hidden: false, path: "Innovation/Recherche idées" },
    { id: "43", objectType: "task", name: "Prototypage rapide", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-24T22:00:00Z"), hidden: false, path: "Innovation/Prototypage rapide" },
    { id: "44", objectType: "task", name: "Pitch", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Innovation/Pitch" },

    // === Projet 11 : Documentation ===
    { id: "45", objectType: "project", name: "Documentation", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Documentation" },
    { id: "46", objectType: "task", name: "Structure", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-23T20:00:00Z"), hidden: false, path: "Documentation/Structure" },
    { id: "47", objectType: "task", name: "Rédaction", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-24T22:00:00Z"), hidden: false, path: "Documentation/Rédaction" },
    { id: "48", objectType: "task", name: "Relecture", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Documentation/Relecture" },
    { id: "49", objectType: "task", name: "Publication", startDate: new Date("2025-10-25T12:00:00Z"), endDate: new Date("2025-10-25T23:00:00Z"), hidden: false, path: "Documentation/Publication" },
    { id: "50", objectType: "task", name: "Archivage", startDate: new Date("2025-10-25T18:00:00Z"), endDate: new Date("2025-10-25T23:59:59Z"), hidden: false, path: "Documentation/Archivage" }
];
