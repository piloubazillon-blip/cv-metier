# CV MÉTIER

Site indépendant pour créer un CV spécialisé, actuellement pour **9 métiers**. L'export A4 en PDF reste **gratuit**, sans compte ni carte bancaire.

## Pack premium — 4,99 € une seule fois

- CV **modifiable** dans un fichier Word compatible (.doc).
- Lettre de motivation **personnalisable** au format Word compatible (.doc).
- Pas d'abonnement ni de paiement récurrent.
- Les achats ne sont **pas activés** tant que Stripe n'est pas configuré.
- La photo facultative figure dans le PDF gratuit mais n'est pas incluse dans le fichier Word premium.
- Les textes proposés sont à relire avant candidature.

### Parcours client

1. Renseigner le formulaire CV. Le PDF gratuit reste accessible.
2. Cliquer sur « Activer mon pack premium — 4,99 € » (une fois les paiements activés).
3. Être redirigé vers Stripe Checkout.
4. Après paiement, retourner sur `/premium.html?session_id=...`.
5. Le Worker Cloudflare contacte directement Stripe, vérifie `payment_status=paid`, `amount_total=499`, devise `eur` et métadonnées du produit.
6. Deux téléchargements Word deviennent possibles. Chaque génération est vérifiée côté serveur.

Les informations personnelles du CV sont conservées **temporairement dans l'onglet via sessionStorage** pendant le parcours d'achat ; elles ne sont pas transmises à Stripe par notre code, ni stockées sur le serveur CV MÉTIER. Elles sont envoyées au Worker uniquement au moment de la génération des documents premium, sans stockage. Ne promettez pas une conservation automatique après fermeture du navigateur. La session Stripe est un jeton d'accès au téléchargement : ne publiez pas son URL.

### Configuration de Cloudflare (nécessaire avant de vendre)

**1. Déploiement Workers**

- Dépôt GitHub : `piloubazillon-blip/cv-metier`, branche `main`.
- Le fichier `wrangler.jsonc` définit `main: worker.js` et les fichiers statiques dans `assets.directory: "."`.
- Déployer via Workers Builds / GitHub avec la commande `npx wrangler deploy` en utilisant le fichier de configuration de ce dépôt.
- Avant activation, vérifier que `/api/payment-config` renvoie `enabled: false` et que la page d'accueil / ses 9 pages / son PDF s'ouvrent correctement.

**2. Compte Stripe**

- Créer et activer son propre compte sur `https://dashboard.stripe.com/`, compléter la vérification de l'entreprise et les renseignements requis.
- Dans les paramètres Cloudflare du Worker CV MÉTIER, ajouter la variable **secrète** `STRIPE_SECRET_KEY` (commencer par `sk_test_...`, puis `sk_live_...` en production).
- Le secret ne doit **jamais** être enregistré dans GitHub ou dans un fichier client.
- Dans Cloudflare > Worker `cv-metier` > Settings > Variables and Secrets, créer la variable texte `PAYMENTS_ENABLED` avec la valeur `true` **uniquement en mode test**. Elle est volontairement absente de `wrangler.jsonc` : sans activation explicite sur Cloudflare, le paiement reste désactivé.
- Effectuer un achat de test avec une carte de test Stripe et vérifier que les téléchargements ne sont jamais disponibles en cas d'annulation de paiement.
- Pour le lancement réel, ajouter mentions légales, informations de rétractation et CGV appropriées aux produits numériques, politique de confidentialité, coordonnées de contact, informations sur facturation et TVA applicable, puis activer les clés de production.

**Attention :** Aucun compte Stripe ni secret n'est connecté par ce dépôt seul : les paiements ne fonctionnent pas encore. En cas de souci de déploiement, ne pas activer Stripe avant que le Worker soit opérationnel.

### Limites connues à améliorer avant production

- Les documents Word sont générés sous forme de HTML compatible Word (`.doc`), pas de véritables fichiers Office Open XML (`.docx`).
- Les deux fichiers sont personnalisables et distincts, mais pas un document original rédigé par un humain.
- Les champs du CV sont disponibles uniquement dans l'onglet qui a initié l'achat ; prévoir une récupération de commande et un formulaire de ressaisie robuste avant de commercialiser à grande échelle.
- Aucun tableau de bord de commande ni facture de vente du site n'est fourni actuellement.
- La vérification de paiement utilise une consultation serveur de Stripe (pas de simple paramètre URL ni confirmation locale).

## Référencement

Les neuf pages métier sont présentes dans `sitemap.xml`, référencé dans `robots.txt`. Leur indexation par Google n'est pas garantie.

## Tests

`node --check worker.js && node --check app.js && node --check metiers.js && node --check payment.js && node --check premium.js && node --test tests/structure.test.mjs`
