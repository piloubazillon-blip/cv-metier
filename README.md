# CV MÉTIER

Générateur de CV gratuit et adapté à cinq métiers, déployé indépendamment de VORTEX PICKS.

## Métiers disponibles
- Préparateur / préparatrice de commandes — `/cv-preparateur-commandes/`
- Vendeur / vendeuse — `/cv-vendeur/`
- Serveur / serveuse — `/cv-serveur/`
- Aide à domicile — `/cv-aide-domicile/`
- Agent / agente d'entretien — `/cv-agent-entretien/`

Chaque page comprend un exemple de présentation, des conseils propres au métier et un lien vers le formulaire. Le sélecteur de métier sur la page d'accueil charge les compétences et suggestions correspondantes. Les visiteurs doivent vérifier les informations : aucun diplôme, habilitation ou expérience n'est inventé.

## Publier et tester
Dépôt GitHub `piloubazillon-blip/cv-metier`, branche `main`.
URL prévue : https://cv-metier.pilou-bazillon.workers.dev/

Le site est statique et l'export PDF utilise la fonction d'impression native du navigateur. Aucun CV n'est enregistré sur le serveur. Aucun paiement n'est activé ; l'export PDF reste gratuit.

Tests : `node --check app.js && node --check metiers.js && node --test tests/structure.test.mjs`.

## Référencement Google
- `/sitemap.xml` répertorie les six pages publiques.
- `/robots.txt` annonce le sitemap.
- Chaque page a son titre, sa description et son URL canonique.
- Après le déploiement, ajouter la propriété dans Google Search Console, confirmer la propriété et soumettre `https://cv-metier.pilou-bazillon.workers.dev/sitemap.xml`.
- Ces mesures facilitent l'exploration, mais ne garantissent ni l'indexation, ni une position donnée.
- Ne pas mettre de données personnelles réelles dans les exemples publics.

## À faire avant commercialisation
Mentions légales, politique de confidentialité, politique commerciale, compte de paiement sécurisé et vérifications côté serveur avant tout export premium. Aucune page ne doit promettre de résultats de recrutement.
