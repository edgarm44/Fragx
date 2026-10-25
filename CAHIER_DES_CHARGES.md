# Fragx — Cahier des charges

Version 0.1 — 25 octobre 2026

## 1. Objectif

Fragx est un site web gratuit qui aide les joueurs de jeux de tir à progresser et à tirer le meilleur de leur matériel. Il couvre deux axes : le joueur (réglages, visée, statistiques, guides) et la machine (évaluation du setup, recommandations d'amélioration, test de performance).

## 2. Public visé

Tout joueur qui s'intéresse un minimum aux jeux vidéo, du débutant au joueur classé. Le ton doit rester accessible : chaque recommandation technique est accompagnée d'une explication courte, avec un niveau de détail supplémentaire disponible pour les joueurs avancés.

Langue : français uniquement.

## 3. Jeux couverts (lot 1)

- Valorant
- Fortnite
- Apex Legends
- Call of Duty (Warzone / multijoueur)
- Battlefield

## 4. Périmètre fonctionnel

### 4.1 Évaluation du setup

Deux modes complémentaires :

- **Saisie guidée (par défaut)** : l'utilisateur sélectionne CPU, GPU, RAM, stockage, écran (définition, fréquence), souris (DPI, taux d'interrogation), connexion. Pré-remplissage automatique quand le navigateur le permet : GPU via WebGL (`WEBGL_debug_renderer_info`, souvent masqué), nombre de threads (`navigator.hardwareConcurrency`), RAM approximative (`navigator.deviceMemory`, plafonnée à 8 Go), fréquence de l'écran estimée via `requestAnimationFrame`.
- **Outil Windows optionnel (lot ultérieur)** : petit exécutable qui lit le matériel réel et génère un code ou un fichier à importer sur le site. Aucune donnée envoyée sans action de l'utilisateur.

Sorties : note globale du setup par jeu, identification du goulot d'étranglement (CPU, GPU, RAM, écran, périphériques), liste d'améliorations classées par rapport gain / coût, réglages Windows et pilotes recommandés.

### 4.2 Test de performance (benchmark navigateur)

Scène WebGL/WebGPU standardisée mesurant FPS moyen, 1 % low et régularité des frame times, avec un score comparable entre utilisateurs. Le résultat doit afficher clairement qu'il s'agit d'un **indicateur relatif**, non d'une prédiction des FPS en jeu (le navigateur limite souvent à la fréquence de l'écran et n'exploite pas le GPU comme un jeu natif).

### 4.3 Réglages in-game

Par jeu : recommandations de paramètres graphiques selon le setup (priorité FPS ou qualité), convertisseur de sensibilité entre jeux, calcul de l'eDPI et du cm/360, conseils FOV, résolution, Reflex/anti-lag.

### 4.4 Entraînement de visée

Mini-exercices dans le navigateur : flicking, tracking, réflexes, précision. Scores conservés localement dans le navigateur (pas de compte). Sensibilité calibrable sur celle du jeu de l'utilisateur.

### 4.5 Analyse de statistiques par pseudo

Recherche d'un joueur, affichage et interprétation des stats (K/D, précision, pourcentage de headshots, évolution), avec conseils ciblés. Faisabilité très inégale selon les jeux (voir section 6).

### 4.6 Guides et astuces

Articles par jeu : cartes, positions, stratégies, mécaniques. Rédigés en Markdown/MDX dans Astro.

## 5. Contraintes

- **Pas de comptes utilisateurs** : aucune inscription, pas de stockage de données personnelles côté serveur. Préférences et scores dans le `localStorage`.
- **Stack** : Astro. Pages de contenu statiques ; quelques routes serveur (endpoints Astro) indispensables pour appeler les API de stats sans exposer les clés. Hébergement avec adaptateur serverless (Netlify, Vercel ou Cloudflare).
- **Performances du site** : pages légères, benchmark et aim trainer chargés uniquement à la demande.
- **Compatibilité** : navigateurs récents sur PC en priorité ; consultation des guides sur mobile.

## 6. Faisabilité des statistiques (état vérifié en octobre 2026)

| Jeu | Source possible | Contrainte |
|---|---|---|
| Valorant | API officielle Riot | Clé de production obligatoire, validée par Riot. Accès aux données d'un joueur uniquement s'il se connecte via Riot Sign On (RSO, opt-in) : pas de recherche libre par pseudo. Les API non officielles existent mais Riot les déconseille pour les outils de stats. |
| Fortnite | fortnite-api.com (non officielle) | Clé API gratuite ; stats visibles seulement si le profil du joueur est public. |
| Apex Legends | apexlegendsapi.com / mozambiquehe.re (non officielle) | Clé API, limite de débit faible. |
| Call of Duty | Aucune API publique | Activision a fait fermer des sites de stats pour violation de ses conditions. À exclure ou limiter à une saisie manuelle. |
| Battlefield | gametools.network (communautaire, gratuite) | Couverture de Battlefield 6 à confirmer. |

Conséquence : le module stats démarre avec Fortnite, Apex et Battlefield ; Valorant via RSO après obtention d'une clé de production ; Call of Duty en saisie manuelle.

## 7. Monétisation (phase 2, si le trafic le justifie)

Affiliation matériel (liens dans les recommandations d'amélioration), publicité, éventuellement fonctions premium. Implique : bannière de consentement RGPD dès l'ajout de pub ou de traceurs, transparence sur les liens affiliés, recommandations qui restent objectives.

## 8. Aspects juridiques

Mentions légales et politique de confidentialité ; mentions de non-affiliation avec les éditeurs (Riot, Epic, EA, Activision) ; respect des conditions d'utilisation de chaque API ; pas de logos ou visuels officiels sans autorisation.

## 9. Découpage en lots

- **Lot 1 — MVP public** : structure Astro, accueil, saisie guidée du setup + diagnostic, benchmark navigateur, convertisseur de sensibilité, aim trainer de base, premiers guides.
- **Lot 2** : stats par pseudo (Fortnite, Apex, Battlefield), réglages recommandés par jeu, enrichissement des guides.
- **Lot 3** : outil Windows de détection, Valorant via RSO, monétisation.

## 10. Points ouverts

- Nom de domaine et hébergeur.
- Source de la base de données matériel (scores CPU/GPU) et sa mise à jour.
- Méthode de calcul de la note du setup (pondérations par jeu).
- Identité visuelle.
- Qui rédige les guides et à quel rythme.
