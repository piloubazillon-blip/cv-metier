// Métier profiles: suggested phrasing is optional and must be verified by the candidate.
window.CV_METIERS = Object.freeze({
  "preparateur-commandes": {
    title:"Préparateur de commandes", female:"Préparatrice de commandes",
    beginner:"Candidat motivé par un poste de préparateur de commandes, souhaitant développer ses compétences en logistique et contribuer à une préparation rigoureuse des expéditions.",
    experienced:"Préparateur de commandes expérimenté dans les opérations logistiques, attentif à la qualité, aux délais et au respect des procédures de sécurité.",
    skills:["Organisation et rigueur","Travail en équipe","Respect des consignes","Préparation de commandes","Contrôle des quantités","Conditionnement et étiquetage","Utilisation d'un terminal RF","Gestion des stocks","Respect des règles de sécurité","CACES (si obtenu)"],
    defaultSkills:["Organisation et rigueur","Travail en équipe","Respect des consignes"]
  },
  "vendeur": {
    title:"Vendeur / Vendeuse",female:"Vendeuse",
    beginner:"Candidat motivé par la vente et l'accueil des clients, souhaitant développer son sens du service, son écoute et sa connaissance des produits.",
    experienced:"Professionnel de la vente ayant une expérience de l'accueil, du conseil client et de la mise en valeur des produits en magasin.",
    skills:["Accueil et écoute client","Travail en équipe","Sens du service","Conseil et orientation des clients","Mise en rayon","Étiquetage des produits","Gestion des stocks","Tenue de caisse (si pratiquée)","Merchandising (si pratiqué)","Gestion des réclamations (si pratiquée)"],
    defaultSkills:["Accueil et écoute client","Travail en équipe","Sens du service"]
  },
  "serveur": {
    title:"Serveur / Serveuse",female:"Serveuse",
    beginner:"Candidat motivé par les métiers de la restauration, souhaitant apprendre le service en salle et contribuer à un accueil attentionné des clients.",
    experienced:"Professionnel de la restauration habitué à accueillir les clients, coordonner le service en salle et contribuer au bon déroulement des repas.",
    skills:["Accueil et sens du service","Travail en équipe","Ponctualité et organisation","Prise de commandes (si pratiquée)","Service à table (si pratiqué)","Mise en place de la salle","Encaissement (si pratiqué)","Respect de l'hygiène","Gestion des priorités","Communication avec la cuisine"],
    defaultSkills:["Accueil et sens du service","Travail en équipe","Ponctualité et organisation"]
  },
  "aide-domicile": {
    title:"Aide à domicile",female:"Aide à domicile",
    beginner:"Candidat motivé par l'accompagnement des personnes à domicile, souhaitant faire preuve d'écoute, de discrétion et de respect des habitudes de vie.",
    experienced:"Professionnel de l'aide à domicile ayant une expérience de l'accompagnement quotidien et attentif au respect, à la confidentialité et à l'autonomie des bénéficiaires.",
    skills:["Écoute et empathie","Ponctualité et fiabilité","Respect de la confidentialité","Entretien du logement (si pratiqué)","Aide aux courses (si pratiquée)","Préparation des repas (si pratiquée)","Accompagnement aux déplacements (si pratiqué)","Communication avec les familles","Respect des consignes","Organisation du quotidien"],
    defaultSkills:["Écoute et empathie","Ponctualité et fiabilité","Respect de la confidentialité"]
  },
  "agent-entretien": {
    title:"Agent d'entretien",female:"Agente d'entretien",
    beginner:"Candidat sérieux et organisé, souhaitant contribuer à la propreté et à l'entretien des locaux tout en respectant les consignes et les procédures.",
    experienced:"Agent d'entretien expérimenté dans le nettoyage des locaux, l'organisation des interventions et l'application des consignes d'hygiène et de sécurité.",
    skills:["Rigueur et organisation","Respect des consignes","Ponctualité et autonomie","Nettoyage des surfaces (si pratiqué)","Entretien des sols (si pratiqué)","Tri et évacuation des déchets","Utilisation des matériels de nettoyage","Respect des règles d'hygiène","Gestion des priorités","Sécurité des produits d'entretien"],
    defaultSkills:["Rigueur et organisation","Respect des consignes","Ponctualité et autonomie"]
  },
  "employe-restauration": {
    title:"Employé polyvalent de restauration",female:"Employée polyvalente de restauration",
    beginner:"Candidat motivé par la restauration, souhaitant contribuer à l'accueil, à la préparation et au service dans le respect des consignes d'hygiène. Prêt à apprendre les procédures de l'établissement.",
    experienced:"Employé polyvalent de restauration ayant une expérience de la préparation, du service et de l'organisation du poste de travail, avec une attention particulière aux consignes d'hygiène.",
    skills:["Travail en équipe","Ponctualité","Sens du service","Organisation du poste","Accueil des clients (si pratiqué)","Préparation simple des produits (si pratiquée)","Service au comptoir (si pratiqué)","Nettoyage du poste de travail","Respect des consignes d'hygiène","Encaissement (si pratiqué)"],
    defaultSkills:["Travail en équipe","Ponctualité","Sens du service"]
  },
  "employe-libre-service": {
    title:"Employé libre-service / Mise en rayon",female:"Employée libre-service",
    beginner:"Candidat organisé et ponctuel, souhaitant apprendre les opérations de mise en rayon, participer à la bonne présentation des produits et contribuer au fonctionnement d'un magasin.",
    experienced:"Employé de libre-service ayant une expérience de l'approvisionnement des rayons, du contrôle des produits et de la présentation des espaces de vente.",
    skills:["Organisation et rigueur","Travail en équipe","Ponctualité","Mise en rayon (si pratiquée)","Approvisionnement des produits (si pratiqué)","Étiquetage (si pratiqué)","Contrôle des dates (si pratiqué)","Rotation des stocks (si pratiquée)","Accueil et orientation client","Respect des consignes de sécurité"],
    defaultSkills:["Organisation et rigueur","Travail en équipe","Ponctualité"]
  },
  "aide-soignant": {
    title:"Aide-soignant / Aide-soignante",female:"Aide-soignante",
    beginner:"Candidat au métier d'aide-soignant souhaitant présenter fidèlement sa formation, ses stages et ses compétences acquises. Les soins et le titre d'aide-soignant nécessitent les qualifications appropriées.",
    experienced:"Aide-soignant diplômé souhaitant mettre en valeur son expérience d'accompagnement, d'observation et de soins dans le cadre de ses compétences professionnelles et des protocoles du service.",
    skills:["Écoute et respect des personnes","Travail en équipe","Discrétion et confidentialité","Diplôme d'État d'aide-soignant (si obtenu)","Accompagnement dans les actes quotidiens (si pratiqué)","Observation et transmission (si pratiquées)","Respect des protocoles d'hygiène","Travail avec l'équipe soignante (si pratiqué)","Aide à la mobilité (si pratiquée)","Respect du champ de compétences"],
    defaultSkills:["Écoute et respect des personnes","Travail en équipe","Discrétion et confidentialité"]
  },
  "employe-etage": {
    title:"Employé d'étage / Femme ou valet de chambre",female:"Employée d'étage",
    beginner:"Candidat rigoureux et organisé, souhaitant apprendre la préparation et l'entretien des chambres, en respectant les consignes de qualité, d'hygiène et de discrétion.",
    experienced:"Employé d'étage ayant une expérience de la remise en état des chambres, du réapprovisionnement des fournitures et de l'organisation des interventions en hôtellerie.",
    skills:["Rigueur et ponctualité","Discrétion","Organisation du travail","Entretien des chambres (si pratiqué)","Réfection des lits (si pratiquée)","Réapprovisionnement du linge (si pratiqué)","Contrôle de la propreté (si pratiqué)","Respect des règles d'hygiène","Communication avec la réception (si pratiquée)","Gestion des priorités"],
    defaultSkills:["Rigueur et ponctualité","Discrétion","Organisation du travail"]
  }
});
